import { useState, type FormEvent } from "react";
import { Button, Input, Text } from "@kozmos/react";
import { AuthError, signIn } from "../cloud/session";
import { BACKDROPS, LoginBackdrop, backdropOfTheDay, type BackdropKind } from "../ui/LoginBackdrop";
import { POINTR } from "../mock/pointrConfig";

/**
 * Sign in to the real Pointr Cloud instance.
 *
 * **Shaped on the product's own login** (Olcay's screenshot, 2026-08-14) — the proposition on the
 * left, the card on the right — and then given the thing that page is missing: a backdrop that
 * says what the product *does*. A floor plan drawing itself, a route solving, a building coming
 * apart into levels. See `LoginBackdrop`; there are three and they rotate daily.
 *
 * ⚠️ **The password is never held.** It lives in a controlled input for as long as you are typing
 * and is cleared the moment the request resolves either way — nothing keeps it, and `session.ts`
 * never stores or logs it.
 */
export function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<BackdropKind>(() => backdropOfTheDay());

  const configured = !!POINTR.baseUrl && !!POINTR.client;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      setPassword("");
      onDone();
    } catch (err) {
      setPassword("");                       // a failed attempt must not leave it sitting there
      setError(err instanceof AuthError ? err.message : "Something went wrong signing in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        gap: 48,
        padding: "0 8vw",
        background: "linear-gradient(160deg,#f5f8ff 0%,#eef3fd 55%,#e7eefb 100%)",
        overflow: "hidden",
      }}
    >
      <LoginBackdrop kind={kind} />

      {/*
        **A scrim under each content block** (Olcay, 2026-08-14: *"adjust the animation content
        layout so that it works out with the text content and login box"*). The backdrop is a
        continuous field, so it needs somewhere to recede rather than being switched off: an
        elliptical wash behind the copy and a plain one behind the card. Both are transparent at
        the edges, so nothing draws a box — the texture simply thins where reading happens.
      */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "2vw",
          top: "50%",
          transform: "translateY(-50%)",
          width: "min(760px, 62vw)",
          height: 460,
          background:
            "radial-gradient(ellipse at 42% 50%, rgba(244,247,254,.96) 0%, rgba(244,247,254,.86) 42%, rgba(244,247,254,0) 72%)",
          pointerEvents: "none",
        }}
      />

      {/* the proposition */}
      <div style={{ position: "relative", flex: "1 1 0", minWidth: 0, maxWidth: 620 }}>
        <Text
          style={{
            display: "block",
            fontSize: "clamp(30px,4.4vw,54px)",
            lineHeight: 1.12,
            fontWeight: 700,
            color: "#0b369c",
            letterSpacing: "-0.02em",
          }}
        >
          Every floor plan,
          <br />
          reviewed before it ships.
        </Text>
        <Text
          style={{
            display: "block",
            marginTop: 18,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#464a53",
            maxWidth: 520,
          }}
        >
          MapScale reads each new CAD file, tells you how much of the floor changed, and holds
          anything risky until a human has looked at it.
        </Text>
        {/* Which instance this is. A prototype that can point at QA or production must say which. */}
        {configured && (
          <Text style={{ display: "block", marginTop: 28, fontSize: 12, color: "#6b7280" }}>
            Signing in to {POINTR.baseUrl.replace(/^https?:\/\//, "")}
          </Text>
        )}
      </div>

      {/* the card */}
      <form
        onSubmit={submit}
        style={{
          position: "relative",
          flex: "0 0 380px",
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 24px 70px rgba(11,54,156,.16), 0 2px 8px rgba(11,54,156,.07)",
          border: "1px solid rgba(255,255,255,.9)",
        }}
      >
        <Text style={{ display: "block", fontSize: 26, fontWeight: 600, color: "#1a1c24" }}>
          Sign in
        </Text>

        <label style={{ display: "block", marginTop: 22, fontSize: 12, color: "#464a53" }}>
          Email
          <Input
            type="email"
            name="username"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="you@pointr.tech"
            style={{ marginTop: 6, width: "100%" }}
          />
        </label>

        <label style={{ display: "block", marginTop: 16, fontSize: 12, color: "#464a53" }}>
          Password
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            style={{ marginTop: 6, width: "100%" }}
          />
        </label>

        {/* Announced, not just coloured — a failure nobody's screen reader mentions is a dead end. */}
        {error && (
          <div
            role="alert"
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#fceaee",
              border: "1px solid #f3a2b3",
              color: "#430915",
              fontSize: 12.5,
              lineHeight: 1.45,
            }}
          >
            {error}
          </div>
        )}
        {!configured && (
          <div
            role="alert"
            style={{
              marginTop: 16,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#f7f8f9",
              border: "1px solid #e3e4e8",
              color: "#464a53",
              fontSize: 12.5,
            }}
          >
            This build has no Pointr connection configured, so there is nothing to sign in to.
          </div>
        )}

        <Button type="submit" disabled={busy || !configured} style={{ width: "100%", marginTop: 20 }}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>

        <Text style={{ display: "block", marginTop: 14, fontSize: 11.5, color: "#6b7280", lineHeight: 1.5 }}>
          Your session lasts until you close this tab. Nothing is stored on this machine.
        </Text>
      </form>

      {/* Backdrop switcher — small, out of the way, and the reason the variations are worth having */}
      <div style={{ position: "absolute", bottom: 18, right: 18, display: "flex", gap: 6 }}>
        {BACKDROPS.map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setKind(b)}
            aria-label={`${b} background`}
            aria-pressed={kind === b}
            style={{
              width: 8,
              height: 8,
              padding: 0,
              borderRadius: 999,
              cursor: "pointer",
              border: "none",
              background: kind === b ? "#0b369c" : "#c9cdd6",
            }}
          />
        ))}
      </div>
    </div>
  );
}
