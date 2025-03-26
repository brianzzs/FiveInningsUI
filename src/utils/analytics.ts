export const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const DISABLE_ANALYTICS = import.meta.env.VITE_DISABLE_ANALYTICS === 'true';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

export const logPageView = (page_path: string) => {
    if (DISABLE_ANALYTICS) return;
    window.gtag('event', 'page_view', {
        page_path,
    });
};

export const logEvent = (action: string, params: object = {}) => {
    if (DISABLE_ANALYTICS) return;
    window.gtag('event', action, params);
}; 