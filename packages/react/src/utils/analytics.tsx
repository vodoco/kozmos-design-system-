import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';

// Define the shape of our analytics events
export interface AnalyticsEvent {
    eventName: string;
    component: string;
    timestamp: number;
    properties?: Record<string, any>;
}

// -------------------------------------------------------------
// The Context API for providing and consuming tracking functions
// -------------------------------------------------------------
interface AnalyticsContextType {
    trackEvent: (component: string, eventName: string, properties?: Record<string, any>) => void;
}

let hasWarnedMissingProvider = false;
const AnalyticsContext = createContext<AnalyticsContextType>({
    trackEvent: () => { 
        // Silent no-op when used outside of a Provider — warn once in dev only
        if (!hasWarnedMissingProvider && process.env.NODE_ENV !== 'production') {
            hasWarnedMissingProvider = true;
            console.warn('KozmosAnalytics: No <AnalyticsProvider> found. Events will be silently dropped. This warning is shown once.');
        }
    }
});

export const useKozmosAnalytics = () => useContext(AnalyticsContext);

// -------------------------------------------------------------
// The Analytics Provider containing our debounced/batched engine
// -------------------------------------------------------------
export interface AnalyticsProviderProps {
    children: React.ReactNode;
    /** Callback triggered when the queue flushes its batch of events */
    onDispatch?: (events: AnalyticsEvent[]) => void;
    /** How long to wait before flushing the queue (defaults to 2000ms) */
    batchDelayMs?: number;
}

/**
 * High-performance batched telemetry provider for Kozmos.
 * Prevents UI-thread blocking by coalescing analytics events over a given interval.
 */
export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
    children,
    onDispatch,
    batchDelayMs = 2000
}) => {
    const queueRef = useRef<AnalyticsEvent[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const onDispatchRef = useRef(onDispatch);

    // Keep the callback reference fresh strictly without triggering dependency cascades
    useEffect(() => {
        onDispatchRef.current = onDispatch;
    }, [onDispatch]);

    const flushQueue = useCallback(() => {
        if (queueRef.current.length > 0) {
            if (onDispatchRef.current) {
                // Dispatch a shallow clone to prevent mutations
                onDispatchRef.current([...queueRef.current]);
            } else {
                // Graceful generic tracking dump matching native Android/iOS un-bound state handlers natively
                console.debug(`[Kozmos Analytics Batched Drop]`, [...queueRef.current]);
            }
            queueRef.current = [];
        }
    }, []);

    useEffect(() => {
        // Guarantee final drain if the host application unmounts the Provider
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            flushQueue();
        };
    }, [flushQueue]);

    const trackEvent = useCallback((component: string, eventName: string, properties?: Record<string, any>) => {
        const event: AnalyticsEvent = {
            eventName,
            component,
            properties,
            timestamp: Date.now()
        };
        
        queueRef.current.push(event);

        // Schedule batch flush if not already ticking
        if (!timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                flushQueue();
                timeoutRef.current = null;
            }, batchDelayMs);
        }

    }, [flushQueue, batchDelayMs]);

    return (
        <AnalyticsContext.Provider value={{ trackEvent }}>
            {children}
        </AnalyticsContext.Provider>
    );
};
