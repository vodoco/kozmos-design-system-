import { useMemo } from "react";

/**
 * The login page's animated backdrop — three variations, all drawn from what this product actually
 * does rather than from stock motion (Olcay, 2026-08-14: *"possibly with animated background
 * elements related with what we're doing. Or maybe different variations"*).
 *
 * - **`review`** — the whole product in eight seconds: a plan draws, a scan sweeps it, and the
 *   changes bloom in the diff palette behind the sweep, each taking its decision mark. This is the
 *   one that leads, because it is the only one that shows what the dashboard is FOR.
 * - **`survey`** — a floor plan drawing itself, the way MapScale reads a CAD file: outer shell
 *   first, then rooms, then the fixtures inside them.
 * - **`wayfinding`** — a route solving itself across a floor, with the pulse travelling along it.
 * - **`levels`** — a building's levels lifting apart into the stack this dashboard edits one at
 *   a time.
 *
 * **All of it is SVG and CSS.** No canvas, no library, no animation frame: a login screen must not
 * hold a render loop open behind a form, and the whole thing is inert as soon as it scrolls away.
 *
 * ⚠️ **`prefers-reduced-motion` is honoured properly** — not by slowing the motion down but by
 * removing it, leaving the finished drawing. The composition is the point; the drawing of it is
 * the flourish, and for someone who asked not to be moved, the flourish is the part that has to go.
 */
export type BackdropKind = "review" | "survey" | "wayfinding" | "levels";

export const BACKDROPS: BackdropKind[] = ["review", "survey", "wayfinding", "levels"];

/** Deterministic per calendar day, so a reload shows the same one and a return visit does not. */
export function backdropOfTheDay(seed = Math.floor(Date.now() / 86_400_000)): BackdropKind {
  return BACKDROPS[seed % BACKDROPS.length];
}

const INK = "#0b369c";
/**
 * The diff palette, deliberately the same four values the app uses (`Semantics/Diff` in
 * @kozmos/tokens, mirrored in `mock/diff.ts`). A login screen quoting the product's own colours is
 * why the animation reads as *this* product rather than as decoration.
 */
const NEW = "#2FBF71", UPDATED = "#3B82F6", REMOVED = "#EF4444";

export function LoginBackdrop({ kind }: { kind: BackdropKind }) {
  // The rooms are generated once: a fresh set on every render would re-draw mid-animation.
  const rooms = useMemo(
    () => [
      { x: 60, y: 90, w: 150, h: 110 },
      { x: 220, y: 90, w: 110, h: 110 },
      { x: 340, y: 90, w: 200, h: 60 },
      { x: 340, y: 160, w: 95, h: 130 },
      { x: 445, y: 160, w: 95, h: 130 },
      { x: 60, y: 210, w: 90, h: 80 },
      { x: 160, y: 210, w: 170, h: 80 },
    ],
    [],
  );
  /**
   * The changes the sweep finds. `at` is the delay that lines each bloom up with the moment the
   * scan line passes it — x/600 of the 8s cycle, give or take, so the two read as cause and effect.
   */
  const CHANGES = useMemo(
    () => [
      { id: "a", kind: "new", tone: NEW, x: 76, y: 226, w: 58, h: 48, at: 1.0 },
      { id: "b", kind: "updated", tone: UPDATED, x: 236, y: 106, w: 78, h: 78, at: 2.6 },
      { id: "c", kind: "removed", tone: REMOVED, x: 356, y: 176, w: 62, h: 96, at: 4.2 },
      { id: "d", kind: "new", tone: NEW, x: 460, y: 100, w: 64, h: 42, at: 5.4 },
    ],
    [],
  );

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes ms-draw   { to { stroke-dashoffset: 0; } }
        @keyframes ms-fade   { to { opacity: 1; } }
        @keyframes ms-travel { to { offset-distance: 100%; } }
        @keyframes ms-pulse  { 0%,100% { r: 4; opacity: .9 } 50% { r: 9; opacity: .25 } }
        @keyframes ms-lift   { to { transform: translateY(0); opacity: 1; } }
        @keyframes ms-sweep  { 0% { transform: translateX(-40px); opacity: 0 }
                               8% { opacity: 1 }
                               92% { opacity: 1 }
                               100% { transform: translateX(560px); opacity: 0 } }
        @keyframes ms-bloom  { 0%,100% { opacity: 0; transform: scale(.9) }
                               12%, 78% { opacity: 1; transform: scale(1) } }
        @keyframes ms-mark   { 0%, 20% { opacity: 0; transform: scale(.6) }
                               34%, 78% { opacity: 1; transform: scale(1) }
                               100% { opacity: 0 } }
        .ms-draw   { stroke-dasharray: 1200; stroke-dashoffset: 1200;
                     animation: ms-draw 2.4s cubic-bezier(.4,0,.2,1) forwards; }
        .ms-fade   { opacity: 0; animation: ms-fade .8s ease forwards; }
        .ms-plate  { opacity: 0; transform: translateY(26px); animation: ms-lift 1s cubic-bezier(.2,.8,.2,1) forwards; }
        .ms-dot    { animation: ms-pulse 2.6s ease-in-out infinite; }
        .ms-sweep  { animation: ms-sweep 8s cubic-bezier(.5,0,.5,1) infinite; }
        /* Each change blooms as the sweep reaches it, so the motion reads as CAUSED by the scan
           rather than as decoration running alongside it. Delays are the x-position over speed. */
        .ms-bloom  { opacity: 0; transform-box: fill-box; transform-origin: center;
                     animation: ms-bloom 8s ease-in-out infinite; }
        .ms-mark   { opacity: 0; transform-box: fill-box; transform-origin: center;
                     animation: ms-mark 8s ease-in-out infinite; }
        .ms-walker { offset-path: path('M 90 250 L 200 250 L 200 150 L 380 150 L 380 120 L 520 120');
                     offset-distance: 0%; animation: ms-travel 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          /* Show the finished drawing, not a slower one. */
          .ms-draw { animation: none; stroke-dashoffset: 0; }
          .ms-fade, .ms-plate { animation: none; opacity: 1; transform: none; }
          .ms-dot { animation: none; }
          .ms-walker { animation: none; offset-distance: 62%; }
          .ms-sweep  { animation: none; opacity: 0; }
          .ms-bloom, .ms-mark { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 600 360"
        /* `meet`, not `slice`: the composition IS the drawing, and cover-scaling a 600×360 plan
           into a tall viewport magnified it past the point where it read as a floor plan at all. */
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.6 }}
      >
        {kind === "review" && (
          <g fill="none" stroke={INK} strokeLinejoin="round">
            {/* the published floor, quiet */}
            <rect x="50" y="80" width="500" height="220" rx="4" strokeWidth="2.2" opacity="0.55" />
            {rooms.map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} strokeWidth="1.2" opacity="0.3" />
            ))}

            {/* what the new plan changed — each keyed to where the sweep will reach it */}
            {CHANGES.map((c) => (
              <g key={c.id}>
                <rect
                  className="ms-bloom"
                  x={c.x}
                  y={c.y}
                  width={c.w}
                  height={c.h}
                  rx="2"
                  fill={c.tone}
                  fillOpacity="0.22"
                  stroke={c.tone}
                  strokeWidth="2.2"
                  strokeDasharray={c.kind === "removed" ? "7 5" : undefined}
                  style={{ animationDelay: `${c.at}s` }}
                />
                {/* the decision it gets — the marks this dashboard is built around */}
                <g className="ms-mark" style={{ animationDelay: `${c.at}s` }}>
                  <circle
                    cx={c.x + c.w / 2}
                    cy={c.y + c.h / 2}
                    r="10"
                    fill="#fff"
                    stroke={c.tone}
                    strokeWidth="2"
                  />
                  <path
                    d={
                      c.kind === "removed"
                        ? `M ${c.x + c.w / 2 - 4} ${c.y + c.h / 2 - 4} L ${c.x + c.w / 2 + 4} ${c.y + c.h / 2 + 4} M ${c.x + c.w / 2 + 4} ${c.y + c.h / 2 - 4} L ${c.x + c.w / 2 - 4} ${c.y + c.h / 2 + 4}`
                        : `M ${c.x + c.w / 2 - 4.5} ${c.y + c.h / 2} L ${c.x + c.w / 2 - 1} ${c.y + c.h / 2 + 3.5} L ${c.x + c.w / 2 + 5} ${c.y + c.h / 2 - 3.5}`
                    }
                    stroke={c.tone}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            ))}

            {/* the scan itself — a soft leading edge, so it reads as reading rather than as a wipe */}
            <g className="ms-sweep">
              <defs>
                <linearGradient id="ms-scan" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={INK} stopOpacity="0" />
                  <stop offset="100%" stopColor={INK} stopOpacity="0.28" />
                </linearGradient>
              </defs>
              <rect x="0" y="80" width="46" height="220" fill="url(#ms-scan)" stroke="none" />
              <line x1="46" y1="74" x2="46" y2="306" stroke={INK} strokeWidth="2" opacity="0.75" />
            </g>
          </g>
        )}

        {kind === "survey" && (
          <g fill="none" stroke={INK} strokeLinejoin="round">
            <rect
              className="ms-draw"
              x="50"
              y="80"
              width="500"
              height="220"
              rx="4"
              strokeWidth="2"
              opacity="0.5"
            />
            {rooms.map((r, i) => (
              <rect
                key={i}
                className="ms-draw"
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                strokeWidth="1.2"
                opacity="0.35"
                style={{ animationDelay: `${0.5 + i * 0.16}s` }}
              />
            ))}
            {rooms.map((r, i) => (
              <circle
                key={`d${i}`}
                className="ms-fade"
                cx={r.x + r.w / 2}
                cy={r.y + r.h / 2}
                r="3"
                fill={INK}
                stroke="none"
                opacity="0"
                style={{ animationDelay: `${1.9 + i * 0.1}s` }}
              />
            ))}
          </g>
        )}

        {kind === "wayfinding" && (
          <g fill="none" stroke={INK} strokeLinejoin="round">
            <rect x="50" y="80" width="500" height="220" rx="4" strokeWidth="2" opacity="0.28" />
            {rooms.slice(0, 5).map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} strokeWidth="1" opacity="0.18" />
            ))}
            <path
              className="ms-draw"
              d="M 90 250 L 200 250 L 200 150 L 380 150 L 380 120 L 520 120"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.75"
              strokeDasharray="1200"
            />
            <circle className="ms-walker" r="6" fill={INK} stroke="#fff" strokeWidth="2" />
            <circle className="ms-dot" cx="90" cy="250" r="4" fill={INK} stroke="none" />
            <circle
              className="ms-dot"
              cx="520"
              cy="120"
              r="4"
              fill={INK}
              stroke="none"
              style={{ animationDelay: "1.3s" }}
            />
          </g>
        )}

        {kind === "levels" && (
          /*
            Shifted down and spaced wider than the first attempt: at 34 units the four plates
            overlapped into one diamond and the whole point — that a building is a STACK this
            dashboard edits a level at a time — was invisible.
          */
          <g fill="none" stroke={INK} transform="translate(0 46)">
            {[0, 1, 2, 3].map((i) => (
              /*
                Two nested groups on purpose. The CSS `transform` in `ms-plate` OVERRIDES an SVG
                `transform` attribute on the same element — so animating and positioning the same
                <g> landed all four plates on top of each other. Position outside, animate inside.
              */
              <g key={i} transform={`translate(0 ${i * -62})`}>
                <g className="ms-plate" style={{ animationDelay: `${i * 0.16}s` }}>
                {/* an isometric plate — the level as this dashboard's unit of work */}
                <path
                  d="M 300 300 L 500 245 L 300 190 L 100 245 Z"
                  strokeWidth="1.5"
                  opacity={0.55 - i * 0.09}
                  fill={INK}
                  fillOpacity={0.055}
                />
                {/* the riser to the plate above, so the gap reads as height rather than as space */}
                {i < 3 && (
                  <path
                    d="M 100 245 L 100 183 M 500 245 L 500 183 M 300 300 L 300 238"
                    strokeWidth="1"
                    opacity={0.22 - i * 0.04}
                    strokeDasharray="3 5"
                  />
                )}
                {i === 1 && (
                  <circle className="ms-dot" cx="300" cy="245" r="4" fill={INK} stroke="none" />
                )}
                </g>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
