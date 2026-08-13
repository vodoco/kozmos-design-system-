/**
 * What a **site publish** would and would not take live.
 *
 * **Decided 2026-08-13 (Olcay).** A level whose review has not concluded is **held out of every
 * publish** — including someone else's site publish. The app already promised this in one place:
 * a part-way *Save* leaves the strip reading *"held out of publishing, including the automatic
 * one, until you complete the review"*. This module makes it true everywhere, and gives the
 * Publish action something to say.
 *
 * ⚠️ **This deliberately contradicts US5's unhappy path**, which says a second user publishing the
 * level / building / site *"takes a red-blocked update live"* (handoff §1053). That reading makes
 * *"Red never auto-publishes"* hold only against the system and not against a colleague, which is
 * a guarantee worth almost nothing. Excluding is the stronger promise, so the story needs amending
 * rather than the design.
 *
 * The cost of excluding, and why the overlay must name names: a site publish now silently ships a
 * map **missing** changes somebody deliberately uploaded. "Held out" is only safe if the person
 * publishing is told exactly what is being left behind.
 */

import {
  magnitudeBand,
  seedChanges,
  seedVersions,
  type LevelVersion,
} from "./diff";
import { SITE_SNAPSHOT } from "./site";
import { getLevelVersions, getReviewOutcome, levelKey } from "./store";

/** One level a publish would skip, and enough about it to act. */
export interface HeldLevel {
  buildingId: string;
  building: string;
  index: number;
  short: string;
  name: string;
  /** The version waiting on a human. */
  versionN: number;
  /** How many changes are waiting. `undefined` for cause B, which has no changelog to count. */
  changes?: number;
  /** Why it is held — the overlay says this out loud, it never just greys a row. */
  reason: "needs-review" | "needs-decision" | "expert-review" | "part-way";
}

/** Is this version still waiting on somebody? */
function isPending(v: LevelVersion): boolean {
  return v.state === "needs-review" || v.state === "needs-decision" || v.state === "expert-review";
}

/**
 * Every level a site publish would leave behind, newest-version-first per building.
 *
 * Read live from the same store the tree and the review read, so this cannot drift from what the
 * user is looking at — an upload or a completed review changes this list immediately.
 */
export function levelsHeldFromPublish(): HeldLevel[] {
  const held: HeldLevel[] = [];
  for (const b of SITE_SNAPSHOT) {
    for (const l of b.levels) {
      const key = levelKey(b.id, l.index);
      const versions = getLevelVersions(key, () => seedVersions(l.short, l.index, b.id));
      const newest = versions[0];
      if (!newest || !isPending(newest)) continue;

      const outcome = getReviewOutcome(key, newest.n);
      // a concluded review is not held — that is the whole point of concluding it
      if (outcome?.complete) continue;

      /**
       * A count only when there is an honest one to give:
       *   · cause B has no changelog at all (decision 11) — counting is exactly what failed;
       *   · a level under EXPERT REVIEW has no final list either. The mapping team is still
       *     pruning it, so any number here would be overwritten before the user ever saw it.
       */
      const countable = newest.redCause !== "cannot-match" && newest.state !== "expert-review";
      const changes = !countable
        ? undefined
        : outcome?.changes.length ?? seedChanges(magnitudeBand(newest.changePct ?? 30)).length;

      held.push({
        buildingId: b.id,
        building: b.name,
        index: l.index,
        short: l.short,
        name: l.long,
        versionN: newest.n,
        changes,
        // a saved-but-unfinished review is a different sentence from one nobody has opened
        reason: outcome && !outcome.complete ? "part-way" : (newest.state as HeldLevel["reason"]),
      });
    }
  }
  return held;
}

/** The one-line reason a level is being skipped, in the user's words. */
export const HELD_REASON: Record<HeldLevel["reason"], string> = {
  "needs-review": "Nobody has reviewed this yet",
  "needs-decision": "Waiting on your decision",
  "expert-review": "Pointr's mapping team is still working on it",
  "part-way": "Review started but not concluded",
};
