/**
 * Shared prototype feedback — the store behind the comment pins (see src/ui/FeedbackLayer.tsx).
 *
 * Everyone reviewing the prototype writes to and reads from ONE list, so the team sees each
 * other's notes. Before this, notes lived in each reader's localStorage and nobody could collect
 * them.
 *
 * **Zero dependencies on purpose.** This project deploys *prebuilt* (see handoff §7a): Vercel's
 * install step is a no-op, so `node_modules` never exists in the deployment and `@vercel/blob`
 * could not be imported. Everything here talks to the Blob REST API with plain `fetch`.
 *
 * Storage is one JSON array at a fixed pathname. Concurrency is last-write-wins: two people
 * saving in the same second could lose one note. For a design review that is the right trade —
 * anything stronger means a real database.
 *
 * ⚠️ **Read-after-write is NOT immediate** (measured against production, 2026-08-11 — this is the
 * sharper half of "last-write-wins" and worth stating separately). The blob listing is eventually
 * consistent, so a request issued moments after a write can still see the previous list. Two
 * concrete consequences, both observed:
 *
 *   1. Editing or resolving a note **immediately** after posting it can answer `no such note`.
 *   2. A write built on a stale read **reverts** the writes it didn't see — a delete issued right
 *      after an edit + resolve resurrected the note with its original text.
 *
 * A second or two apart, everything behaves. The client handles the visible half by re-reading
 * whenever a patch or delete fails, so a stale answer shows the truth instead of a dead button;
 * the silent-revert half is inherent to last-write-wins and needs a real database to fix.
 *
 * Needs `BLOB_READ_WRITE_TOKEN`, which appears when a Blob store is connected to the project.
 * Without it every route answers 501 and the client quietly falls back to local-only notes.
 */

const PATHNAME = "map566/notes.json";
const API = "https://blob.vercel-storage.com";
const VERSION = "7";

function token() {
  return process.env.BLOB_READ_WRITE_TOKEN || "";
}

/** Find the blob's public URL. Listing is the reliable way — the store id isn't known here. */
async function findUrl(t) {
  const res = await fetch(`${API}?prefix=${encodeURIComponent(PATHNAME)}&limit=1`, {
    headers: { authorization: `Bearer ${t}`, "x-api-version": VERSION },
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const hit = data?.blobs?.find((b) => b.pathname === PATHNAME) ?? data?.blobs?.[0];
  return hit?.url ?? null;
}

async function readNotes(t) {
  const url = await findUrl(t);
  if (!url) return [];
  // cache-buster: blob URLs are CDN-cached, and a comment feed must not serve a stale list
  const res = await fetch(`${url}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json().catch(() => []);
  return Array.isArray(json) ? json : [];
}

async function writeNotes(t, notes) {
  const res = await fetch(`${API}/${PATHNAME}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${t}`,
      "x-api-version": VERSION,
      "x-content-type": "application/json",
      // a stable pathname, so the list is always the same object rather than a new one each save
      "x-add-random-suffix": "0",
      "x-cache-control-max-age": "0",
    },
    body: JSON.stringify(notes),
  });
  if (!res.ok) throw new Error(`blob write failed: ${res.status} ${await res.text()}`);
  return notes;
}

export default async function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  const t = token();
  if (!t) {
    // Not an error the reviewer should see as a crash — the client degrades to local notes.
    res.status(501).json({ error: "no-store", detail: "BLOB_READ_WRITE_TOKEN is not set" });
    return;
  }

  try {
    if (req.method === "GET") {
      res.status(200).json({ notes: await readNotes(t) });
      return;
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
      const notes = await readNotes(t);

      if (body.deleteId) {
        const next = notes.filter((n) => n.id !== body.deleteId);
        await writeNotes(t, next);
        res.status(200).json({ notes: next });
        return;
      }

      /**
       * Edit the text, or resolve/reopen (Olcay, 2026-08-11). One route for both because they are
       * the same operation — patch a note in place — and splitting them would mean two read/write
       * round-trips against a store whose concurrency is already last-write-wins.
       *
       * `resolved` is a fact about the note, not a deletion: a resolved comment stays readable, so
       * the thread of a review survives. Only `text` and `resolved` are patchable — the pin's
       * position, screen and author are what make it a *record* of who said what where.
       */
      if (body.updateId) {
        const target = notes.find((n) => n.id === body.updateId);
        if (!target) {
          res.status(404).json({ error: "no such note" });
          return;
        }
        if (body.text !== undefined && !String(body.text).trim()) {
          res.status(400).json({ error: "empty note" });
          return;
        }
        const next = notes.map((n) =>
          n.id !== body.updateId
            ? n
            : {
                ...n,
                ...(body.text !== undefined
                  ? { text: String(body.text).slice(0, 2000), editedAt: new Date().toISOString() }
                  : {}),
                ...(body.resolved !== undefined
                  ? {
                      resolved: !!body.resolved,
                      resolvedBy: body.resolved ? String(body.by || "").slice(0, 60) : "",
                      resolvedAt: body.resolved ? new Date().toISOString() : "",
                    }
                  : {}),
              },
        );
        await writeNotes(t, next);
        res.status(200).json({ notes: next });
        return;
      }

      const n = body.note;
      if (!n?.text?.trim()) {
        res.status(400).json({ error: "empty note" });
        return;
      }
      const next = [
        ...notes,
        {
          id: n.id || `n${Date.now()}${Math.round(Math.random() * 1e4)}`,
          screen: String(n.screen || "").slice(0, 40),
          xPct: Number(n.xPct) || 0,
          yPct: Number(n.yPct) || 0,
          text: String(n.text).slice(0, 2000),
          author: String(n.author || "Anonymous").slice(0, 60),
          at: new Date().toISOString(),
        },
      ];
      await writeNotes(t, next);
      res.status(200).json({ notes: next });
      return;
    }

    res.status(405).json({ error: "method not allowed" });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
