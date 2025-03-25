export const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID; 

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

export const logPageView = (page_path: string) => {
    window.gtag('event', 'page_view', {
        page_path,
    });
};

export const logEvent = (action: string, params: object = {}) => {
    window.gtag('event', action, params);
}; 