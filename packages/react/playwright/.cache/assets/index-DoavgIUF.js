import { r as reactExports } from './index-BQAR1rgm.js';

// packages/react/use-previous/src/use-previous.tsx
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

export { usePrevious as u };
//# sourceMappingURL=index-DoavgIUF.js.map
