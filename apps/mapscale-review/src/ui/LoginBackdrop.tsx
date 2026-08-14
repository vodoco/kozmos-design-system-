import { useMemo } from "react";

/**
 * The login page's backdrop — abstract, and **seamless by construction** (Olcay, 2026-08-14:
 * *"still not a fan. it could be more abstract. and repeating seamlessly."*).
 *
 * **Why the first two attempts were wrong.** A floor plan drawing itself is a picture of a floor
 * plan; a scan sweeping across rooms that sprout ✓ marks is a diagram of the review screen. Both
 * were *illustrations of the product* placed behind a form — too literal to be atmosphere — and
 * both restarted visibly, because a sweep has a beginning and an end.
 *
 * **The loop is arithmetic, not easing.** Every scene is artwork that repeats every `TILE` units,
 * drawn a tile beyond each edge and translated by **exactly one tile period**. The last frame is
 * therefore identical to the first, so `linear infinite` has no seam anywhere — there is no fade
 * hiding a jump, because there is no jump. The only thing that fades is a breath whose 0% and 100%
 * keyframes hold the same value.
 *
 * **It also has to sit under a headline and a card**, so it is texture rather than incident: a
 * uniform field reads as background behind type, where discrete objects read as things that
 * happen to be half-covered. `Login` puts a soft scrim under each content block on top of this.
 *
 * The vocabulary is still ours — modular space, coverage, strata — but abstracted to field and
 * lattice, with the diff palette surviving only as occasional accent cells.
 */
export type BackdropKind = "field" | "coverage" | "strata";

export const BACKDROPS: BackdropKind[] = ["field", "coverage", "strata"];

/** Deterministic per calendar day, so a reload shows the same one and a return visit does not. */
export function backdropOfTheDay(seed = Math.floor(Date.now() / 86_400_000)): BackdropKind {
  return BACKDROPS[seed % BACKDROPS.length];
}

const INK = "#0b369c";
/** The app's own diff colours, as accents only — enough to feel like ours, not enough to explain. */
const ACCENT = ["#2FBF71", "#3B82F6", "#EF4444", "#9C6EFF"];

/** One super-tile. Everything repeats on this period, and everything drifts by exactly this much. */
const TILE = 240;
/** Cells within a super-tile — small enough to read as texture rather than as rooms. */
const CELL = 60;

/** Deterministic pseudo-random, so a cell always draws the same thing and nothing needs seeding. */
function hash(x: number, y: number, salt = 0) {
  const n = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

export function LoginBackdrop({ kind }: { kind: BackdropKind }) {
  /**
   * The cells of ONE super-tile, repeated across the canvas. This is what makes the drift seamless:
   * shifting by `TILE` lands every cell exactly where its neighbour already was.
   */
  const cells = useMemo(() => {
    const out: { x: number; y: number; size: number; accent?: string; dot: boolean; bar: boolean }[] = [];
    for (let gx = 0; gx < TILE / CELL; gx++) {
      for (let gy = 0; gy < TILE / CELL; gy++) {
        const h = hash(gx, gy);
        const h2 = hash(gx, gy, 1);
        const h3 = hash(gx, gy, 2);
        out.push({
          x: gx * CELL,
          y: gy * CELL,
          size: 18 + Math.round(h * 26),
          accent: h3 > 0.86 ? ACCENT[Math.floor(h2 * ACCENT.length) % ACCENT.length] : undefined,
          dot: h2 > 0.62,
          bar: h > 0.78,
        });
      }
    }
    return out;
  }, []);

  /** Enough repeats to cover the viewBox plus a tile of overdraw on every side. */
  const repeats = useMemo(() => {
    const out: { dx: number; dy: number }[] = [];
    for (let x = -TILE; x <= 600 + TILE; x += TILE)
      for (let y = -TILE; y <= 360 + TILE; y += TILE) out.push({ dx: x, dy: y });
    return out;
  }, []);

  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        /* Exactly one period of travel. Because the artwork repeats every ${TILE} units, the final
           frame equals the first and the loop has no seam to hide. */
        @keyframes ms-drift  { to { transform: translate(${TILE}px, ${TILE}px); } }
        @keyframes ms-driftx { to { transform: translate(${TILE}px, 0); } }
        @keyframes ms-rise   { to { transform: translate(0, -${TILE}px); } }
        /* 0% and 100% match, so the breath never lands on a discontinuity either. */
        @keyframes ms-breathe { 0%,100% { opacity: .34 } 50% { opacity: .6 } }

        .ms-drift   { animation: ms-drift  56s linear infinite; }
        .ms-driftx  { animation: ms-driftx 48s linear infinite; }
        .ms-rise    { animation: ms-rise   44s linear infinite; }
        .ms-breathe { animation: ms-breathe 16s ease-in-out infinite; }
        /* A second layer at a different rate reads as depth; it loops on its own period. */
        .ms-slow    { animation-duration: 96s; }

        @media (prefers-reduced-motion: reduce) {
          .ms-drift, .ms-driftx, .ms-rise, .ms-breathe { animation: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 600 360"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {kind === "field" && (
          <>
            {/* far layer — larger, slower, fainter: parallax without a second idea */}
            <g className="ms-drift ms-slow" opacity="0.18">
              {repeats.map((r, i) => (
                <g key={i} transform={`translate(${r.dx} ${r.dy}) scale(2)`}>
                  {cells.map((c, j) => (
                    <rect
                      key={j}
                      x={c.x + (CELL - c.size) / 2}
                      y={c.y + (CELL - c.size) / 2}
                      width={c.size}
                      height={c.size}
                      rx="2"
                      fill="none"
                      stroke={INK}
                      strokeWidth="0.7"
                    />
                  ))}
                </g>
              ))}
            </g>

            <g className="ms-drift ms-breathe">
              {repeats.map((r, i) => (
                <g key={i} transform={`translate(${r.dx} ${r.dy})`}>
                  {cells.map((c, j) => (
                    <g key={j}>
                      <rect
                        x={c.x + (CELL - c.size) / 2}
                        y={c.y + (CELL - c.size) / 2}
                        width={c.size}
                        height={c.size}
                        rx="2"
                        fill={c.accent ?? "none"}
                        fillOpacity={c.accent ? 0.13 : 0}
                        stroke={c.accent ?? INK}
                        strokeWidth={c.accent ? 1.3 : 0.9}
                        opacity={c.accent ? 0.8 : 0.45}
                      />
                      {c.dot && (
                        <circle cx={c.x + CELL / 2} cy={c.y + CELL / 2} r="1.5" fill={INK} opacity="0.45" />
                      )}
                      {c.bar && (
                        <line
                          x1={c.x + 10}
                          y1={c.y + CELL - 8}
                          x2={c.x + CELL - 10}
                          y2={c.y + CELL - 8}
                          stroke={INK}
                          strokeWidth="0.9"
                          opacity="0.25"
                        />
                      )}
                    </g>
                  ))}
                </g>
              ))}
            </g>
          </>
        )}

        {kind === "coverage" && (
          /* Rings on a lattice — signal falling off, abstracted. Sideways drift only, so the
             horizon stays level and the motion stays quiet behind a form. */
          <g className="ms-driftx ms-breathe">
            {repeats.map((r, i) => (
              <g key={i} transform={`translate(${r.dx} ${r.dy})`}>
                {cells.map((c, j) => (
                  <g key={j} opacity={c.accent ? 0.85 : 0.4}>
                    {[9, 17, 25].map((rad, k) => (
                      <circle
                        key={k}
                        cx={c.x + CELL / 2}
                        cy={c.y + CELL / 2}
                        r={rad}
                        fill="none"
                        stroke={c.accent ?? INK}
                        strokeWidth={k === 0 ? 1.2 : 0.65}
                        opacity={1 - k * 0.3}
                      />
                    ))}
                    {c.dot && <circle cx={c.x + CELL / 2} cy={c.y + CELL / 2} r="1.8" fill={c.accent ?? INK} />}
                  </g>
                ))}
              </g>
            ))}
          </g>
        )}

        {kind === "strata" && (
          /* Bands rising — levels as pure stratum, with no building drawn around them. */
          <g className="ms-rise ms-breathe">
            {repeats.map((r, i) => (
              <g key={i} transform={`translate(${r.dx} ${r.dy})`}>
                {cells.map((c, j) => (
                  <g key={j}>
                    <line
                      x1={c.x}
                      y1={c.y + CELL / 2}
                      x2={c.x + CELL}
                      y2={c.y + CELL / 2}
                      stroke={c.accent ?? INK}
                      strokeWidth={c.accent ? 1.8 : 0.9}
                      opacity={c.accent ? 0.75 : 0.3}
                      strokeDasharray={c.bar ? "10 6" : undefined}
                    />
                    {c.dot && (
                      <rect
                        x={c.x + CELL / 2 - 2.5}
                        y={c.y + CELL / 2 - 2.5}
                        width="5"
                        height="5"
                        rx="1"
                        fill={c.accent ?? INK}
                        opacity="0.45"
                      />
                    )}
                  </g>
                ))}
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
