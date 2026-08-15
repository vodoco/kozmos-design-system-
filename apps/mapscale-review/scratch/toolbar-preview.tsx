/**
 * Every state the geometry toolbar has, side by side, over a stand-in for the map — MAP-566.
 * See `toolbar-preview.html` for why this exists. Nothing in the app imports it.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@kozmos/react";
import "@kozmos/react/dist/style.css";
import "../src/index.css";
import { GeometryToolbar, type GeomState } from "../src/ui/GeometryToolbar";
import { SavedNotice } from "../src/ui/SavedNotice";
import { FeaturePanel } from "../src/ui/FeaturePanel";

/**
 * The real panel, with a realistic property bag — for measuring the header's alignment
 * (Olcay, 2026-08-16: *"alignent issue at the feature header"*). Rendered twice: once with an icon
 * the size `TypeIcon` produces, and once with none, because the title is a flex row with a `gap`
 * and an absent icon still gets gapped away from the block's left edge.
 */
const DEMO_PROPS = {
  fid: "a80b5862-1ae5-439c-b408-b0b49c8a3372",
  bid: "51dd37d1-c2bc-4d9e-8e22-2ea1a15a626c",
  sid: "c1126cb8-a192-4bd3-90f5-08fb70278862",
  lvl: -2,
  mainType: "Operational Space",
  name: "Operational Space",
};

function HeaderBench() {
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {[
        {
          k: "with icon",
          icon: (
            <span
              style={{
                width: 16,
                height: 16,
                flex: "0 0 auto",
                display: "block",
                background: "#c9d3e6",
                borderRadius: 3,
              }}
            />
          ),
        },
        { k: "no icon", icon: undefined },
      ].map(({ k, icon }) => (
        <div
          key={k}
          style={{
            position: "relative",
            width: 400,
            height: 340,
            borderRadius: 12,
            background: "#dfe4ec",
            border: "1px solid #d3d9e3",
            overflow: "hidden",
          }}
          data-case={k}
        >
          <div
            style={{
              font: "11px/1.4 system-ui",
              color: "#5d626f",
              padding: 4,
            }}
          >
            {k}
          </div>
          <FeaturePanel props={DEMO_PROPS} icon={icon} onClose={() => {}} />
        </div>
      ))}
    </div>
  );
}

const BASE: GeomState = {
  editing: true,
  fid: "demo",
  mode: "vertices",
  snap: true,
  canUndo: false,
  canRedo: false,
  dirty: false,
  pieces: 1,
};

const CASES: { title: string; state: GeomState; notice?: string }[] = [
  { title: "Points — as it opens, nothing done yet", state: BASE },
  {
    title: "Move — history available, snap off",
    state: { ...BASE, mode: "move", snap: false, canUndo: true, dirty: true },
  },
  {
    title: "Split armed — waiting for the first click",
    state: { ...BASE, mode: "split" },
  },
  {
    title: "Split — first click landed, waiting for the far side",
    state: { ...BASE, mode: "split", cutting: true },
  },
  {
    title: "Cut refused — the longest string this bar can be asked to hold",
    state: { ...BASE, mode: "split", canUndo: true },
    notice: "that cut runs along an edge — move it a little and try again",
  },
  {
    title: "After a split — three pieces, undo and redo both live",
    state: { ...BASE, canUndo: true, canRedo: true, dirty: true, pieces: 3 },
  },
  {
    title:
      "Corners marquee-selected — drag moves them together, Delete removes them",
    state: { ...BASE, selected: 4, canUndo: true, dirty: true },
  },
  {
    title:
      "A POINT feature — no outline, so Reshape / Move / Split / rotate / scale / Straighten all go",
    state: { ...BASE, kind: "point" },
  },
];

function Bench() {
  return (
    <div style={{ padding: 28, background: "#eef1f6", minHeight: "100vh" }}>
      <h1 style={{ font: "500 15px/1.4 system-ui", margin: "0 0 4px" }}>
        Geometry toolbar
      </h1>
      <p
        style={{
          font: "13px/1.5 system-ui",
          color: "#5d626f",
          margin: "0 0 24px",
        }}
      >
        Each row is the real component over a stand-in for the map. The bar is
        bottom-centred in the app, so each panel below is a scaled-down map
        area.
      </p>

      {CASES.map((c) => (
        <div key={c.title} style={{ marginBottom: 22 }}>
          <div
            style={{
              font: "12px/1.4 system-ui",
              color: "#5d626f",
              marginBottom: 6,
            }}
          >
            {c.title}
          </div>
          <div
            style={{
              position: "relative",
              height: 132,
              borderRadius: 12,
              // A stand-in for the floor plan: enough texture to judge contrast
              // and the drop shadow against, without pretending to be a map.
              background:
                "repeating-linear-gradient(45deg,#dfe4ec 0 10px,#e7ebf2 10px 20px)",
              border: "1px solid #d3d9e3",
              overflow: "hidden",
            }}
          >
            <GeometryToolbar state={c.state} notice={c.notice} />
          </div>
        </div>
      ))}

      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            font: "12px/1.4 system-ui",
            color: "#5d626f",
            marginBottom: 6,
          }}
        >
          The feature panel header — title, subtitle and body must share one
          left edge
        </div>
        <HeaderBench />
      </div>

      {/* The bug found by driving the real app, 2026-08-15: the bar is 707px and was centred on the
          whole map, so the properties panel covered its right-hand end. The panel is only ever open
          when the toolbar is, so this was not an edge case — it was the only case. */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            font: "12px/1.4 system-ui",
            color: "#5d626f",
            marginBottom: 6,
          }}
        >
          With the properties panel open — the bar must centre on the map you
          can still see
        </div>
        <div
          style={{
            position: "relative",
            height: 132,
            borderRadius: 12,
            background:
              "repeating-linear-gradient(45deg,#dfe4ec 0 10px,#e7ebf2 10px 20px)",
            border: "1px solid #d3d9e3",
            overflow: "hidden",
          }}
        >
          <GeometryToolbar state={BASE} padRight={384} />
          {/* Stand-in for FeaturePanel: same width, same inset, same z-order. */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              bottom: 12,
              width: 360,
              zIndex: 5,
              borderRadius: 10,
              background: "#fff",
              border: "1px solid #e3e4e8",
              font: "12px/1.4 system-ui",
              color: "#9AA0A6",
              padding: 10,
            }}
          >
            properties panel (360px)
          </div>
        </div>
      </div>

      {/* 3× — the only way to actually judge whether an icon is drawn or merely present. */}
      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            font: "12px/1.4 system-ui",
            color: "#5d626f",
            marginBottom: 6,
          }}
        >
          The same bar at 3×, to check the icons are drawn rather than implied
        </div>
        <div
          style={{
            position: "relative",
            height: 170,
            borderRadius: 12,
            background: "#e7ebf2",
            border: "1px solid #d3d9e3",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "scale(3.4)",
              // Centred on the transform + history icons — the text needs no proving.
              transformOrigin: "52% 88%",
            }}
          >
            <GeometryToolbar
              state={{ ...BASE, canUndo: true, canRedo: false }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div
          style={{
            font: "12px/1.4 system-ui",
            color: "#5d626f",
            marginBottom: 6,
          }}
        >
          The Update confirmation, which replaces the panel it closes
        </div>
        <div
          data-savedbox
          style={{
            position: "relative",
            height: 260,
            borderRadius: 12,
            background:
              "repeating-linear-gradient(45deg,#dfe4ec 0 10px,#e7ebf2 10px 20px)",
            border: "1px solid #d3d9e3",
            overflow: "hidden",
          }}
        >
          <SavedNotice name="Gate A12 Waiting Area" />
          {/* Stand-in for the map page's #zoomctl — right:16 / bottom:16, two 44px buttons with a
              6px gap. The notice has to clear this, not sit on top of it. */}
          <div
            data-zoomctl
            style={{
              position: "absolute",
              right: 16,
              bottom: 16,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {["+", "−"].map((s) => (
              <div
                key={s}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,.16)",
                  display: "grid",
                  placeItems: "center",
                  font: "20px/1 system-ui",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="mapscale-theme">
      <Bench />
    </ThemeProvider>
  </StrictMode>,
);
