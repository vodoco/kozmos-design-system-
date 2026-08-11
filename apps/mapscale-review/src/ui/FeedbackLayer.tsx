import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Icon, Input, Text } from "@kozmos/react";
import { Tour, TOUR_STEPS, type TourScreen } from "./Tour";

/**
 * **Prototype-only.** The review layer: a guided tour (see `Tour.tsx`) and Figma-style comment
 * pins the team drops on any screen.
 *
 * This is a REVIEW TOOL LAYERED ON TOP of the prototype, not part of the Pointr dashboard design.
 * It is deliberately violet and dashed so nobody mistakes it for product UI — the one surface here
 * that ignores the v9 design language on purpose.
 *
 * **Comments are shared** (Olcay: *"everyone should be able to see each comment"*): they live in a
 * Vercel Blob store behind `/api/feedback`, so every reviewer reads and writes one list. When that
 * endpoint isn't there — local `vite dev`, or before the Blob store is connected — the layer falls
 * back to this browser's `localStorage` and *says so in the panel* rather than pretending. Nothing
 * is ever silently lost: local notes stay local and can still be copied out.
 */

const LOCAL_KEY = "map566-feedback-v1";
const NAME_KEY = "map566-feedback-author";
const TOUR_SEEN = "map566-tour-seen";
const API = "/api/feedback";
/** Long enough not to hammer the store, short enough that a live review feels shared. */
const POLL_MS = 25000;

const ACCENT = "#7A5AF8";
const ACCENT_DARK = "#5B3FD1";

export interface Note {
  id: string;
  screen: string;
  /** Viewport-relative, so a pin lands in the same place on another laptop. */
  xPct: number;
  yPct: number;
  text: string;
  author: string;
  at: string;
}

const SCREEN_LABEL: Record<string, string> = {
  mapContent: "Map Content",
  levelEditor: "Editing Level",
  review: "Manual Review",
  history: "Version History",
  wizard: "Building wizard",
};

function loadLocal(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function when(at: string) {
  const d = new Date(at);
  return Number.isNaN(d.getTime()) ? at : d.toLocaleString();
}

export function FeedbackLayer({
  screen,
  onNavigate,
}: {
  screen: string;
  /** The tour drives the app; App maps these to real screens with a demo level. */
  onNavigate: (screen: TourScreen) => void;
}) {
  const [notes, setNotes] = useState<Note[]>(loadLocal);
  /** `shared` once /api/feedback answers; `local` when it doesn't. Decided on first load. */
  const [mode, setMode] = useState<"unknown" | "shared" | "local">("unknown");
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState<{ xPct: number; yPct: number; text: string } | null>(null);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [panel, setPanel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [author, setAuthor] = useState(() => localStorage.getItem(NAME_KEY) || "");
  const [tourStep, setTourStep] = useState<number | null>(() =>
    localStorage.getItem(TOUR_SEEN) ? null : 0,
  );

  useEffect(() => {
    if (author) localStorage.setItem(NAME_KEY, author);
  }, [author]);

  /** Pull the shared list. Falls back to local — and stays there — if the endpoint isn't live. */
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      setNotes(Array.isArray(data.notes) ? data.notes : []);
      setMode("shared");
    } catch {
      setMode((m) => (m === "shared" ? "shared" : "local"));
      setNotes(loadLocal());
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // keep a live review roughly in sync without anyone pressing anything
  useEffect(() => {
    if (mode !== "shared") return;
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [mode, refresh]);

  // local mode persists here; shared mode's source of truth is the server
  useEffect(() => {
    if (mode === "local") localStorage.setItem(LOCAL_KEY, JSON.stringify(notes));
  }, [notes, mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (draft) setDraft(null);
      else if (placing) setPlacing(false);
      else if (openNote) setOpenNote(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, placing, openNote]);

  const here = useMemo(() => notes.filter((n) => n.screen === screen), [notes, screen]);

  const place = useCallback((e: React.MouseEvent) => {
    setDraft({
      xPct: (e.clientX / window.innerWidth) * 100,
      yPct: (e.clientY / window.innerHeight) * 100,
      text: "",
    });
    setPlacing(false);
  }, []);

  const save = async () => {
    if (!draft?.text.trim()) return setDraft(null);
    const note: Note = {
      id: `n${Date.now()}${Math.round(Math.random() * 1e4)}`,
      screen,
      xPct: draft.xPct,
      yPct: draft.yPct,
      text: draft.text.trim(),
      author: author.trim() || "Anonymous",
      at: new Date().toISOString(),
    };
    setDraft(null);
    if (mode === "shared") {
      setBusy(true);
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ note }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "save failed");
        setNotes(data.notes);
      } catch {
        // don't lose what they typed: keep it locally and tell them the truth
        setNotes((n) => [...n, note]);
        setMode("local");
      } finally {
        setBusy(false);
      }
    } else {
      setNotes((n) => [...n, note]);
    }
  };

  const remove = async (id: string) => {
    setOpenNote(null);
    if (mode === "shared") {
      setBusy(true);
      try {
        const res = await fetch(API, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ deleteId: id }),
        });
        const data = await res.json();
        if (res.ok) setNotes(data.notes);
      } finally {
        setBusy(false);
      }
    } else {
      setNotes((all) => all.filter((x) => x.id !== id));
    }
  };

  const copyAll = async () => {
    const byScreen = notes.reduce<Record<string, Note[]>>((acc, n) => {
      (acc[n.screen] ||= []).push(n);
      return acc;
    }, {});
    const md = [
      `# MAP-566 prototype feedback`,
      `${notes.length} note${notes.length === 1 ? "" : "s"}`,
      "",
      ...Object.entries(byScreen).flatMap(([s, list]) => [
        `## ${SCREEN_LABEL[s] ?? s}`,
        ...list.map((n) => `- ${n.text}  \n  _${n.author} · ${when(n.at)}_`),
        "",
      ]),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(md);
      alert(`Copied ${notes.length} note(s).`);
    } catch {
      window.prompt("Copy the feedback:", md);
    }
  };

  const pill = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 6,
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    border: `1px dashed ${active ? ACCENT_DARK : ACCENT}`,
    background: active ? ACCENT : "#F6F3FF",
    color: active ? "#fff" : ACCENT_DARK,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          data-tour="feedback-comment"
          style={pill(placing)}
          onClick={() => {
            setPlacing((p) => !p);
            setDraft(null);
          }}
          title="Click anywhere on the screen to pin a comment"
        >
          <Icon name="edit-01" /> {placing ? "Click a spot…" : "Comment"}
        </button>
        <button
          style={pill(panel)}
          onClick={() => {
            setPanel((p) => !p);
            if (!panel) refresh();
          }}
          title="All feedback"
        >
          {notes.length} note{notes.length === 1 ? "" : "s"}
        </button>
        <button style={pill(false)} onClick={() => setTourStep(0)} title="Guided walkthrough">
          Tour
        </button>
      </div>

      {placing && (
        <div
          onClick={place}
          style={{ position: "fixed", inset: 0, zIndex: 60, cursor: "crosshair", background: "rgba(122,90,248,0.06)" }}
        />
      )}

      {here.map((n, i) => (
        <div key={n.id} style={{ position: "fixed", left: `${n.xPct}%`, top: `${n.yPct}%`, zIndex: 61 }}>
          <button
            onClick={() => setOpenNote((o) => (o === n.id ? null : n.id))}
            title={n.text}
            style={{
              transform: "translate(-50%, -100%)",
              width: 26,
              height: 26,
              borderRadius: "50% 50% 50% 2px",
              background: ACCENT,
              color: "#fff",
              border: "2px solid #fff",
              boxShadow: "0 2px 6px rgba(0,0,0,.3)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
          {openNote === n.id && (
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 0,
                width: 240,
                background: "#fff",
                border: `1px solid ${ACCENT}`,
                borderRadius: 10,
                boxShadow: "0 6px 20px rgba(0,0,0,.18)",
                padding: 12,
              }}
            >
              <div style={{ fontSize: 12.5, color: "#1a1c24", lineHeight: 1.45 }}>{n.text}</div>
              <div style={{ fontSize: 11, color: "#737373", marginTop: 6 }}>
                {n.author} · {when(n.at)}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                <Button size="sm" variant="link" disabled={busy} onClick={() => remove(n.id)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {draft && (
        <div
          style={{
            position: "fixed",
            left: `${draft.xPct}%`,
            top: `${draft.yPct}%`,
            zIndex: 62,
            width: 260,
            transform: "translate(-50%, 8px)",
            background: "#fff",
            border: `1px solid ${ACCENT}`,
            borderRadius: 10,
            boxShadow: "0 6px 20px rgba(0,0,0,.2)",
            padding: 12,
          }}
        >
          <div style={{ fontSize: 11, color: ACCENT_DARK, fontWeight: 700, marginBottom: 6 }}>
            Comment on {SCREEN_LABEL[screen] ?? screen}
          </div>
          <textarea
            autoFocus
            value={draft.text}
            onChange={(e) => setDraft((d) => (d ? { ...d, text: e.target.value } : d))}
            placeholder="What's wrong, missing, or good here?"
            style={{
              width: "100%",
              minHeight: 70,
              resize: "vertical",
              borderRadius: 8,
              border: "1px solid #e3e4e8",
              padding: 8,
              fontSize: 12.5,
              fontFamily: "inherit",
            }}
          />
          {!author && (
            <div style={{ marginTop: 8 }}>
              <Input
                label="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="So the team knows whose note this is"
              />
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button size="sm" variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
            <Button size="sm" disabled={busy} onClick={save}>
              Save
            </Button>
          </div>
        </div>
      )}

      {panel && (
        <div
          style={{
            position: "fixed",
            right: 16,
            top: 62,
            bottom: 16,
            width: 320,
            zIndex: 63,
            background: "#fff",
            border: `1px solid ${ACCENT}`,
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #e3e4e8", display: "flex", alignItems: "center", gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 600, color: ACCENT_DARK, flex: 1 }}>
              {mode === "shared" ? "Team feedback" : "Your feedback"}
            </Text>
            <button onClick={refresh} title="Refresh" style={{ border: "none", background: "none", cursor: "pointer", color: "#737373", fontSize: 11 }}>
              Refresh
            </button>
            <button onClick={() => setPanel(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#737373" }}>
              <Icon name="x-close" />
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
            {notes.length === 0 && (
              <div style={{ fontSize: 12.5, color: "#737373", lineHeight: 1.5 }}>
                No notes yet. Press <b>Comment</b>, then click anything on screen to pin one to it.
              </div>
            )}
            {notes.map((n, i) => (
              <div key={n.id} style={{ borderBottom: "1px solid #f1f2f4", padding: "8px 0" }}>
                <div style={{ fontSize: 11, color: ACCENT_DARK, fontWeight: 600 }}>
                  {i + 1} · {SCREEN_LABEL[n.screen] ?? n.screen}
                </div>
                <div style={{ fontSize: 12.5, color: "#1a1c24", lineHeight: 1.45 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: "#737373" }}>
                  {n.author} · {when(n.at)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid #e3e4e8", display: "flex", gap: 8 }}>
            <Button size="sm" onClick={copyAll} disabled={!notes.length} className="w-full">
              Copy all
            </Button>
          </div>
          <div style={{ padding: "0 12px 12px", fontSize: 11, color: "#737373", lineHeight: 1.4 }}>
            {mode === "shared" ? (
              <>Notes are <b>shared with everyone</b> reviewing this prototype.</>
            ) : (
              <>
                Saved <b>in this browser only</b> — the shared store isn't reachable, so use{" "}
                <b>Copy all</b> to send these on.
              </>
            )}
          </div>
        </div>
      )}

      {tourStep !== null && (
        <Tour
          step={tourStep}
          onStep={setTourStep}
          onNavigate={onNavigate}
          onClose={() => {
            setTourStep(null);
            localStorage.setItem(TOUR_SEEN, "1");
          }}
        />
      )}
    </>
  );
}

export { TOUR_STEPS };
