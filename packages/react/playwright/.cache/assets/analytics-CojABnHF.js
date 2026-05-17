import { j as jsxRuntimeExports } from './utils-C6Yw6kaM.js';
import { r as reactExports } from './index-BQAR1rgm.js';

let hasWarnedMissingProvider = false;
const AnalyticsContext = reactExports.createContext({
  trackEvent: () => {
    if (!hasWarnedMissingProvider && false) {
      hasWarnedMissingProvider = true;
      console.warn("KozmosAnalytics: No <AnalyticsProvider> found. Events will be silently dropped. This warning is shown once.");
    }
  }
});
const useKozmosAnalytics = () => reactExports.useContext(AnalyticsContext);
const AnalyticsProvider = ({
  children,
  onDispatch,
  batchDelayMs = 2e3
}) => {
  const queueRef = reactExports.useRef([]);
  const timeoutRef = reactExports.useRef(null);
  const onDispatchRef = reactExports.useRef(onDispatch);
  reactExports.useEffect(() => {
    onDispatchRef.current = onDispatch;
  }, [onDispatch]);
  const flushQueue = reactExports.useCallback(() => {
    if (queueRef.current.length > 0) {
      if (onDispatchRef.current) {
        onDispatchRef.current([...queueRef.current]);
      } else {
        console.debug(`[Kozmos Analytics Batched Drop]`, [...queueRef.current]);
      }
      queueRef.current = [];
    }
  }, []);
  reactExports.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      flushQueue();
    };
  }, [flushQueue]);
  const trackEvent = reactExports.useCallback((component, eventName, properties) => {
    const event = {
      eventName,
      component,
      properties,
      timestamp: Date.now()
    };
    queueRef.current.push(event);
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        flushQueue();
        timeoutRef.current = null;
      }, batchDelayMs);
    }
  }, [flushQueue, batchDelayMs]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnalyticsContext.Provider, { value: { trackEvent }, children });
};

export { AnalyticsProvider as A, useKozmosAnalytics as u };
//# sourceMappingURL=analytics-CojABnHF.js.map
