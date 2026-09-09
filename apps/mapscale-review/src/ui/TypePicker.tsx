import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Icon,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@kozmos/react";
import { ChevronDown, Help } from "./icons";
import {
  CLASS_LABEL,
  typeLabel,
  typeTree,
  type FeatureClass,
} from "../mock/taxonomy";

/**
 * **Choosing what a feature IS** — the one control in the panel that meets the whole taxonomy.
 *
 * ⚠️ **The field shows both halves of the answer** (Olcay, 2026-09-09: *"we see mainType within
 * input even though subType selected (Retail Space / Store — store is bold)"*). The old control was
 * a plain `Select` of subtypes with the mainType printed above it as a separate caption, which read
 * as two unrelated things: a label, and a field. A type is one fact with two parts — the mainType is
 * the context and the subType is the value — so they share a box, and weight says which is which.
 *
 * ⚠️ **And it used to offer only the subType.** The note it replaced said *"a feature's mainType is
 * not a free choice"*, which was a guess about the product; the shipping dashboard's own picker
 * offers the whole tree with a class pre-filter, so this does too. Picking a group header sets the
 * mainType and clears the subType, which is a real state — 39 of the 43 mainTypes publish a row of
 * their own and can be saved as-is. The four that do not are not offered alone; see `typeTree`.
 *
 * ⚠️ **A list of 362 needs a way in.** Search reads the taxonomy's `alsoKnownAs`, so "food hall"
 * finds Food Court and "loo" finds a restroom, and the class chips cut 362 down to 295 / 39 / 11 / 2
 * before you type anything.
 */

/** The classes offered as a pre-filter. `system` is not among them — see `typeTree`. */
const FILTERS: (FeatureClass | "all")[] = [
  "all",
  "poi",
  "interior-asset",
  "structural",
  "virtual",
];

const MUTED = "var(--primitives-colors-background-600)";
const LINE = "var(--primitives-colors-background-500)";
const HAIR = "var(--primitives-colors-background-200)";
const INK = "var(--review-ink)";
const THEME = "var(--primitives-colors-theme-700)";

/**
 * The taxonomy publishes a description for all 362 rows — checked, none blank — so this always has
 * something to say. It is the taxonomy's own words, never a sentence written here.
 */
function Info({ text }: { text: string }) {
  if (!text) return null;
  return (
    <span
      /**
       * ⚠️ **Decorative, and deliberately so.** It used to be `tabIndex={0}` with its own label,
       * which put a second tab stop on all 353 rows. The description is on the row itself now — as
       * its `title`, so a pointer gets it anywhere on the row and a screen reader gets it with the
       * option — and this is the visual cue that there is one.
       */
      aria-hidden
      style={{
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        width: 16,
        height: 16,
        borderRadius: 999,
        color: MUTED,
        cursor: "help",
      }}
    >
      {/**
       * ⚠️ **`./icons`, not `@kozmos/icons`.** The DS package's `info-circle` renders a
       * **lucide-react** drawing under a name it records against a Pointr Library node — code and
       * Figma ship different glyphs under one name, which is the whole reason `./icons` exists. This
       * is the library's own `help-circle` (node 1007:10248), the same mark the rest of the app uses.
       */}
      <Help size={16} />
    </span>
  );
}

export function TypePicker({
  mainType,
  subType,
  multiple,
  onChange,
}: {
  mainType: string;
  /** `undefined` means the mainType alone is the answer, which is a real and saveable state. */
  subType?: string;
  /** The selection disagrees; the field shows the placeholder rather than a false single value. */
  multiple?: boolean;
  onChange: (next: { mainType: string; subType?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cls, setCls] = useState<FeatureClass | "all">("all");
  const search = useRef<HTMLInputElement>(null);

  const tree = useMemo(() => typeTree({ q, cls }), [q, cls]);
  const count = (gs: ReturnType<typeof typeTree>) =>
    gs.reduce((n, g) => n + g.subTypes.length + (g.selectable ? 1 : 0), 0);
  const shown = count(tree);

  /**
   * **The list, flattened in the order it is drawn** — the only thing arrow keys can walk.
   *
   * 🔴 **Every row was its own tab stop, and so was every ⓘ.** At 353 types that is **706 presses**
   * to cross the control, which is not a keyboard path, it is a punishment. The fix is the standard
   * combobox shape: focus stays in the search box, `aria-activedescendant` points at the highlighted
   * row, and Up/Down/Home/End/Enter move and choose. Nothing inside the list takes focus at all.
   */
  const flat = useMemo(
    () =>
      tree.flatMap((g) => [
        ...(g.selectable
          ? [
              {
                id: g.mainType,
                mainType: g.mainType,
                subType: undefined as string | undefined,
                label: g.label,
                description: g.description,
                group: true,
              },
            ]
          : []),
        ...g.subTypes.map((t) => ({
          id: `${t.mainType}/${t.subType}`,
          mainType: t.mainType,
          subType: t.subType ?? undefined,
          label: t.displayName,
          description: t.description,
          group: false,
        })),
      ]),
    [tree],
  );
  /** id → position in `flat`, and mainType → its rows, so the render can stay grouped. */
  const index = useMemo(() => new Map(flat.map((r, i) => [r.id, i])), [flat]);
  const byMain = useMemo(() => {
    const m = new Map<string, typeof flat>();
    for (const r of flat) {
      const list = m.get(r.mainType);
      if (list) list.push(r);
      else m.set(r.mainType, [r]);
    }
    return m;
  }, [flat]);
  const rowsOf = (g: { mainType: string }) => byMain.get(g.mainType) ?? [];
  const indexOf = (id: string) => index.get(id) ?? -1;

  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  /** Opening lands on what is already chosen, not at the top of 353 rows. */
  const currentId = subType ? `${mainType}/${subType}` : mainType;
  useLayoutEffect(() => {
    if (!open) return;
    const i = flat.findIndex((r) => r.id === currentId);
    setActive(i < 0 ? 0 : i);
  }, [open, currentId, flat]);
  // Filtering changes the list under the cursor; keep it on something that exists.
  useLayoutEffect(() => {
    setActive((a) => (a >= flat.length ? 0 : a));
  }, [flat.length]);
  // Follow the highlight with the scroll, or arrowing walks off the bottom invisibly.
  useLayoutEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-i="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);
  /**
   * ⚠️ **The denominator is what can be OFFERED, not what the taxonomy publishes.** 362 is the
   * whole release; nine of those rows are system types this picker never shows, so "353 of 362"
   * on an unfiltered list reads as nine results silently missing. The universe here is 353.
   */
  const offerable = useMemo(() => count(typeTree({})), []);

  const choose = (next: { mainType: string; subType?: string }) => {
    onChange(next);
    setOpen(false);
    reset();
  };
  /**
   * ⚠️ **The class filter has to clear too, not just the query.** A sticky filter helps someone
   * re-typing several features in a row, but it can also HIDE the current type: leave it on
   * Structural, open a POI, and the list neither contains the selection nor says why — it just
   * opens at row one. Predictable beats convenient here.
   */
  const reset = () => {
    setQ("");
    setCls("all");
  };

  return (
    <div>
      <Text
        style={{
          display: "block",
          fontSize: 11,
          color: MUTED,
          marginBottom: 4,
        }}
      >
        Select type
      </Text>

      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          // Opening onto a search box is the difference between a list of 353 and a search of 353.
          if (o) setTimeout(() => search.current?.focus(), 0);
          else reset();
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Select type"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              // 46, not 44: two lines of 11/1.3 + 13/1.35 over 6px padding measure 46, and a
              // mainType-only selection is one line — so a smaller floor makes the control jump
              // 2px as you pick. Measured in the browser, not derived.
              minHeight: 46,
              padding: "6px 10px",
              textAlign: "left",
              borderRadius: "var(--primitives-radius-lg, 8px)",
              border: `1px solid ${LINE}`,
              background: "var(--primitives-colors-background-0)",
              cursor: "pointer",
            }}
          >
            <span style={{ flex: 1, minWidth: 0 }}>
              {multiple ? (
                <Text style={{ fontSize: 13, color: MUTED }}>
                  Multiple values
                </Text>
              ) : (
                <>
                  {/**
                   * The mainType is CONTEXT, so it is shown above the value — quiet, and only when
                   * it is not the value itself.
                   *
                   * ⚠️ **It was drawn unconditionally at first, and a mainType-only selection then
                   * read "Retail Space" twice** — once muted, once bold. Olcay asked for *"Retail
                   * Space in bold"*, singular. `minHeight` on the control keeps the box the same
                   * height whether it holds one line or two, which is what I had wrongly been using
                   * the duplicate to do.
                   */}
                  {subType && (
                    <Text
                      style={{
                        display: "block",
                        fontSize: 11,
                        lineHeight: 1.3,
                        color: MUTED,
                      }}
                    >
                      {typeLabel(mainType) || "—"}
                    </Text>
                  )}
                  <Text
                    style={{
                      display: "block",
                      fontSize: 13,
                      lineHeight: 1.35,
                      fontWeight: 600,
                      color: subType ? INK : THEME,
                    }}
                  >
                    {subType
                      ? typeLabel(subType)
                      : typeLabel(mainType) || "Choose a type"}
                  </Text>
                </>
              )}
            </span>
            {/* Clearing goes back to the mainType, which is a type in its own right — not to empty,
                which is not a state a feature can be saved in. */}
            {subType && !multiple && (
              <span
                role="button"
                tabIndex={0}
                aria-label="Clear sub type"
                title={`Back to ${typeLabel(mainType)}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange({ mainType, subType: undefined });
                }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter" && e.key !== " ") return;
                  e.preventDefault();
                  e.stopPropagation();
                  onChange({ mainType, subType: undefined });
                }}
                style={{
                  flex: "0 0 auto",
                  display: "grid",
                  placeItems: "center",
                  width: 20,
                  height: 20,
                  color: MUTED,
                  cursor: "pointer",
                }}
              >
                {/* The DS `x-close`, matching `PanelHeader`'s own ✕ — the one glyph the
                  app already takes from @kozmos/icons rather than from ./icons. */}
                <Icon name="x-close" />
              </span>
            )}
            <span
              style={{
                flex: "0 0 auto",
                display: "grid",
                placeItems: "center",
                color: MUTED,
              }}
            >
              <ChevronDown size={16} />
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          style={{ width: 320, padding: 0, overflow: "hidden" }}
        >
          <div style={{ padding: 8, borderBottom: `1px solid ${HAIR}` }}>
            <Input
              ref={search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${offerable} types…`}
              aria-label="Search types"
              role="combobox"
              aria-expanded
              aria-controls={listId}
              aria-autocomplete="list"
              // The highlighted row is announced from here; nothing in the list takes focus.
              aria-activedescendant={
                flat[active] ? `${listId}-${active}` : undefined
              }
              onKeyDown={(e) => {
                if (!flat.length) return;
                const go = (i: number) => {
                  e.preventDefault();
                  setActive(((i % flat.length) + flat.length) % flat.length);
                };
                if (e.key === "ArrowDown") return go(active + 1);
                if (e.key === "ArrowUp") return go(active - 1);
                if (e.key === "Home") return go(0);
                if (e.key === "End") return go(flat.length - 1);
                // PageUp/PageDown move by roughly a visible screen of rows.
                if (e.key === "PageDown")
                  return go(Math.min(active + 8, flat.length - 1));
                if (e.key === "PageUp") return go(Math.max(active - 8, 0));
                if (e.key === "Enter") {
                  const r = flat[active];
                  if (!r) return;
                  e.preventDefault();
                  choose({ mainType: r.mainType, subType: r.subType });
                }
              }}
            />
            {/* The pre-filter. `all` first because it is the state you return to. */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginTop: 8,
              }}
            >
              {FILTERS.map((c) => {
                const on = cls === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCls(c)}
                    aria-pressed={on}
                    style={{
                      border: "none",
                      cursor: "pointer",
                      fontSize: 11.5,
                      padding: "4px 9px",
                      borderRadius: 999,
                      background: on
                        ? THEME
                        : "var(--primitives-colors-background-100)",
                      color: on ? "#fff" : INK,
                    }}
                  >
                    {c === "all" ? "Everything" : CLASS_LABEL[c]}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Types"
            style={{ maxHeight: 300, overflow: "auto", padding: 4 }}
          >
            {!tree.length && (
              <Text
                style={{
                  display: "block",
                  padding: "14px 8px",
                  fontSize: 12.5,
                  color: MUTED,
                }}
              >
                Nothing matches “{q}”. The search also reads each type’s other
                names, so try a plainer word.
              </Text>
            )}
            {tree.map((g) => (
              <div key={g.mainType}>
                {/**
                 * A group header IS a choice — 39 mainTypes save as they are. The four that are
                 * parents only stay as headings and say so by not reacting, and they carry no
                 * `option` role, so arrowing steps over them.
                 */}
                {!g.selectable && (
                  <div
                    role="presentation"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 8px",
                      marginTop: 2,
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: MUTED,
                      }}
                    >
                      {g.label}
                    </Text>
                    <Info text={g.description} />
                  </div>
                )}
                {rowsOf(g).map((r) => {
                  const i = indexOf(r.id);
                  const on = r.id === currentId;
                  const hot = i === active;
                  return (
                    <div
                      key={r.id}
                      id={`${listId}-${i}`}
                      data-i={i}
                      role="option"
                      aria-selected={on}
                      // ⚠️ No `tabIndex`. 353 rows plus 353 ⓘ was 706 tab stops; focus stays in
                      // the search box and `aria-activedescendant` carries the highlight.
                      title={r.description || undefined}
                      onMouseMove={() => (hot ? undefined : setActive(i))}
                      onClick={() =>
                        choose({ mainType: r.mainType, subType: r.subType })
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: r.group ? "8px 8px" : "7px 8px 7px 20px",
                        marginTop: r.group ? 2 : 0,
                        borderRadius: 6,
                        cursor: "pointer",
                        background: hot
                          ? "var(--primitives-colors-background-100)"
                          : on
                            ? "var(--primitives-colors-theme-0)"
                            : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 12.5,
                          fontWeight: r.group || on ? 600 : 400,
                          color: on ? THEME : INK,
                        }}
                      >
                        {r.label}
                      </Text>
                      <Info text={r.description} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ padding: "6px 10px", borderTop: `1px solid ${HAIR}` }}>
            <Text style={{ fontSize: 11, color: MUTED }}>
              {shown === offerable
                ? `${offerable} types`
                : `${shown} of ${offerable} types`}
            </Text>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
