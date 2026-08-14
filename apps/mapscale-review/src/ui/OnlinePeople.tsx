import { useSyncExternalStore } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@kozmos/react";
import {
  getMyFloor,
  getPeers,
  peerColour,
  presenceVersion,
  subscribePresence,
  type Peer,
} from "../cloud/presence";

/**
 * Who else is in the dashboard, beside the bell.
 *
 * **Everyone online is listed; only some of them have a cursor on your map.** That is the same
 * distinction the map makes and it is worth showing rather than hiding: a colleague on another
 * floor is present — worth knowing before you edit — but pointing at something you cannot see.
 * So a peer on your floor is drawn solid, and one elsewhere is drawn faded with their location in
 * the tooltip. The alternative, dropping them from the list entirely, answers "is anyone here?"
 * with "no" while somebody is editing the floor below.
 */
export function OnlinePeople({
  levelName,
}: {
  /** How to name a floor in the tooltip, when the app can resolve it. */
  levelName?: (building: string | undefined, level: number | undefined) => string | undefined;
}) {
  useSyncExternalStore(subscribePresence, presenceVersion);
  const peers = getPeers();
  // Read from presence rather than from props: it is the same fact the map scopes cursors on, and
  // two copies of it is exactly how the badge ends up saying "elsewhere" about a visible cursor.
  const { building, level } = getMyFloor();
  if (!peers.length) return null;

  const withYou = (p: Peer) =>
    p.building !== undefined && p.building === building && p.level === level;

  // Newest first would reshuffle constantly; `getPeers` sorts by name, and this keeps the people
  // on your own floor at the front so the useful ones are never the ones that overflow.
  const ordered = [...peers].sort((a, b) => Number(withYou(b)) - Number(withYou(a)));
  const shown = ordered.slice(0, 4);
  const extra = ordered.length - shown.length;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {shown.map((p, i) => {
          const here = withYou(p);
          const where = levelName?.(p.building, p.level);
          return (
            <Tooltip key={p.id}>
              <TooltipTrigger asChild>
                <span
                  aria-label={`${p.identity.name}${here ? " — on this floor" : where ? ` — on ${where}` : " — elsewhere"}`}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 10.5,
                    fontWeight: 600,
                    letterSpacing: ".02em",
                    color: "#fff",
                    background: peerColour(p),
                    // overlapped, in the usual way, so a row of people costs less width
                    marginLeft: i ? -8 : 0,
                    boxShadow: "0 0 0 2px #fff",
                    // Faded = present, but not where you are. The colour still identifies them,
                    // so the same person is the same colour in the list and on the map.
                    opacity: here ? 1 : 0.42,
                    cursor: "default",
                  }}
                >
                  {p.identity.initials}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {p.identity.name}
                {here ? " · on this floor" : where ? ` · on ${where}` : " · on another floor"}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      {extra > 0 && (
        <span style={{ fontSize: 11.5, color: "var(--primitives-colors-background-600)" }}>
          +{extra}
        </span>
      )}
    </div>
  );
}
