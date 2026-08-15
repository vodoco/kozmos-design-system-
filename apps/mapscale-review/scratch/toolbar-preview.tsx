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
          style={{
            position: "relative",
            height: 110,
            borderRadius: 12,
            background:
              "repeating-linear-gradient(45deg,#dfe4ec 0 10px,#e7ebf2 10px 20px)",
            border: "1px solid #d3d9e3",
            overflow: "hidden",
          }}
        >
          <SavedNotice name="Gate A12 Waiting Area" />
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
