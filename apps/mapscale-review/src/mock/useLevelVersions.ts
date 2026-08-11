import { useCallback, useSyncExternalStore } from "react";
import { seedVersions, type LevelVersion } from "./diff";
import {
  getLevelVersions,
  levelKey,
  setLevelVersions,
  subscribeLevelVersions,
} from "./store";

/**
 * One level's version timeline, shared by every screen that shows it — the Editing Level card and
 * Version History (S1). Reads/writes the module store, so an upload or a restore in the editor is
 * the same list S1 opens, and a version created a moment ago can be selected, compared and
 * previewed like any other.
 *
 * `isNew` (a level being created by the drop overlay's "Add as new level") starts empty: its
 * first upload becomes Version 1, rather than landing on top of a seeded history it never had.
 *
 * Shape mirrors `useState` so the call sites read unchanged.
 */
export function useLevelVersions(level: {
  buildingId?: string;
  short: string;
  index: number;
  isNew?: boolean;
}): [LevelVersion[], (update: (prev: LevelVersion[]) => LevelVersion[]) => void] {
  const key = levelKey(level.buildingId, level.index);
  const seed = useCallback(
    () => (level.isNew ? [] : seedVersions(level.short, level.index)),
    [level.isNew, level.short, level.index],
  );
  const versions = useSyncExternalStore(
    subscribeLevelVersions,
    // stable between writes: the store hands back the same array until something replaces it
    () => getLevelVersions(key, seed),
  );
  const update = useCallback(
    (fn: (prev: LevelVersion[]) => LevelVersion[]) =>
      setLevelVersions(key, fn(getLevelVersions(key, seed))),
    [key, seed],
  );
  return [versions, update];
}
