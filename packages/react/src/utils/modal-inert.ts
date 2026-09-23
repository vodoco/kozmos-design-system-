type InertState = {
  targets: HTMLElement[];
  owned: Map<Element, string | null>;
  observer: MutationObserver;
  update: () => void;
};

// Independent from aria-hidden's counters: ARIA visibility and HTML interaction
// suppression are distinct lifecycles. Never change a host's aria-hidden state.
const documents = new WeakMap<Document, InertState>();

/** Make the background of a document-modal popup non-interactive. The newest
 * connected popup wins; release restores the preceding popup and host attributes.
 * Native inert complements, rather than replaces, the primitive's focus trap. */
export function inertOutside(target: HTMLElement): () => void {
  const doc = target.ownerDocument;
  let state = documents.get(doc);
  if (!state) {
    const update = () => {
      const current = documents.get(doc);
      if (!current) return;
      const top = [...current.targets]
        .reverse()
        .find((node) => node.isConnected);
      const wanted = new Set<Element>();
      if (top) {
        // Preserve live announcements exactly as the ARIA visibility primitive
        // does. Never make a container inert if it contains the active popup.
        const keep = [top, ...doc.body.querySelectorAll("[aria-live], script")];
        const visit = (parent: Element) => {
          for (const child of parent.children) {
            if (keep.includes(child as HTMLElement)) continue;
            if (keep.some((node) => child.contains(node))) visit(child);
            else wanted.add(child);
          }
        };
        visit(doc.body);
      }
      for (const [node, previous] of current.owned) {
        if (wanted.has(node)) continue;
        if (previous === null) node.removeAttribute("inert");
        else node.setAttribute("inert", previous);
        current.owned.delete(node);
      }
      for (const node of wanted) {
        if (current.owned.has(node)) continue;
        current.owned.set(node, node.getAttribute("inert"));
        node.setAttribute("inert", "");
      }
    };
    state = {
      targets: [],
      owned: new Map(),
      observer: new doc.defaultView!.MutationObserver(update),
      update,
    };
    documents.set(doc, state);
    state.observer.observe(doc.body, { childList: true, subtree: true });
  }
  const current = state;
  current.targets.push(target);
  current.update();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    current.targets.splice(current.targets.lastIndexOf(target), 1);
    current.update();
    if (!current.targets.length) {
      current.observer.disconnect();
      documents.delete(doc);
    }
  };
}
