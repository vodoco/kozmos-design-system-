import { useEffect, useRef, useState } from "react";

/**
 * The Floor-plan card's thumbnail + preview overlay (Olcay, 2026-08-10: "thumbnail should show
 * the preview of the floor-plan — upon tap should open in an overlay larger").
 *
 * The thumb is v9's `FloorPlanThumbnail` (Figma b8dqhE3CPxitYfqlXuQJTC · 4510:41445 — the 80×40
 * chip the Level Manager rows wear, node 18833:214839 is the reference screen): white surface,
 * 2px background/900 border, radius 8, the drawing clipped inside. The source image carries its
 * own white card and margin, so the component overscales it slightly (the v9 node's own crop
 * numbers) to keep the drawing, not the frame, in the thumb.
 *
 * The overlay is deliberately NOT another card: the preview asset already draws one, so the
 * lightbox is just the image large on the ConfirmOverlay's backdrop, with the file name in the
 * same white note chip the map screens use, and an ✕. Escape / backdrop / ✕ dismiss; the ✕ takes
 * focus on open and Tab stays inside (same modal conventions as ConfirmOverlay).
 *
 * One preview asset exists in the mock (`public/floorplan-preview.png`, the v9 component's own
 * export) — every version shows it. Per-version previews arrive with the real API, the same
 * honest limit as the map's blueprint overlay (§11).
 */

const PREVIEW_SRC = "/floorplan-preview.png";
const LINE = "#e3e4e8";
const MUTED = "#5d626f";

function PreviewOverlay({ file, onClose }: { file: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Only the ✕ is focusable, but the page beneath still is — keep Tab inside the modal.
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Floor-plan preview — ${file}`}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
      >
        <img
          src={PREVIEW_SRC}
          alt={`Floor-plan preview — ${file}`}
          style={{
            // native asset is 652×432 — allow only a mild upscale so the CAD line-work stays crisp
            maxWidth: "min(84vw, 800px)",
            maxHeight: "78vh",
            objectFit: "contain",
          }}
        />
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
            padding: "8px 14px",
            fontSize: 12,
            color: MUTED,
            maxWidth: 460,
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file}
        </div>
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close preview"
          title="Close"
          style={{
            position: "absolute",
            top: -12,
            right: -12,
            width: 28,
            height: 28,
            borderRadius: 14,
            border: `1px solid ${LINE}`,
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            color: MUTED,
            fontSize: 14,
            lineHeight: 1,
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function FloorPlanThumb({ file }: { file: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Preview floor-plan — ${file}`}
        title="Preview floor-plan"
        style={{
          // v9 FloorPlanThumbnail: 80×40, white, 2px background/900 border, radius 8, clipped
          width: 80,
          height: 40,
          flex: "0 0 auto",
          padding: 0,
          background: "#fff",
          border: `2px solid ${LINE}`,
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
          cursor: "zoom-in",
        }}
      >
        <img
          src={PREVIEW_SRC}
          alt=""
          style={{
            // the v9 node's own crop: overscale to trim the asset's baked-in card margin
            position: "absolute",
            width: "113.19%",
            height: "127.81%",
            left: "-6.6%",
            top: "-13.91%",
            maxWidth: "none",
            objectFit: "cover",
          }}
        />
      </button>
      {open && <PreviewOverlay file={file} onClose={() => setOpen(false)} />}
    </>
  );
}
