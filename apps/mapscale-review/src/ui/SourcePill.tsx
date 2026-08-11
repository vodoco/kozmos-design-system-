import { SOURCE_LABEL, type VersionSource } from "../mock/diff";

const MUTED = "#5d626f";

/**
 * Where a floor plan came from. Dashboard and API interleave in one level's history, and "who
 * sent this" is the first question when two arrivals land close together (§11).
 *
 * API wears the theme blue — informational, like the "New version" tag. (It briefly wore #9C6EFF,
 * which is the User Override diff colour; §3 reserves that purple for what a feature IS.)
 *
 * Lives in its own module because both the Editing Level panel and Version History (S1) render it;
 * two copies would drift.
 */
export function SourcePill({ source }: { source: VersionSource }) {
  const api = source === "api";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        color: api ? "#0d44c2" : MUTED,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: api ? "#346df1" : "#9AA0A6",
        }}
      />
      {SOURCE_LABEL[source]}
    </span>
  );
}
