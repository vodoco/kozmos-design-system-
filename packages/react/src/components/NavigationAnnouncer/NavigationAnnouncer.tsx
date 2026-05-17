import React, { useEffect, useState } from 'react';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface NavigationAnnouncerProps {
    message: string;
    isActive?: boolean;
}

/**
 * A structurally invisible primitive that pipes active wayfinding updates directly
 * into accessibility channels (VoiceOver, TalkBack) without altering layout DOM hierarchies.
 */
const NavigationAnnouncer: React.FC<NavigationAnnouncerProps> = ({ message, isActive = true }) => {
    const [announcement, setAnnouncement] = useState("");
    const { trackEvent } = useKozmosAnalytics();

    useEffect(() => {
        if (isActive && message) {
            trackEvent('A11y', 'navigation_announced', { message });
            // De-duplicate fast-firing redundant announcements
            if (announcement !== message) {
                setAnnouncement(message);
            }
        }
    }, [message, isActive, announcement, trackEvent]);

    return (
        <div 
            className="sr-only" 
            aria-live="assertive" 
            aria-atomic="true"
            role="alert"
        >
            {announcement}
        </div>
    );
};

NavigationAnnouncer.displayName = 'NavigationAnnouncer';

export { NavigationAnnouncer };
