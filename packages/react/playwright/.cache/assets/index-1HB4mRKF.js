import { r as reactExports, c as requireReactDom, g as getDefaultExportFromCjs } from './index-BQAR1rgm.js';

// packages/react/compose-refs/src/compose-refs.tsx
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}

var reactDomExports = requireReactDom();
const ReactDOM = /*@__PURE__*/getDefaultExportFromCjs(reactDomExports);

export { ReactDOM as R, composeRefs as c, reactDomExports as r, useComposedRefs as u };
//# sourceMappingURL=index-1HB4mRKF.js.map
