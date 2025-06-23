/**
 * Extends the Window interface to include custom global properties used in the application.
 */
interface Window {
    /** Webflow API instance array */
    Webflow: any[];
    /** Environment variables exposed to the client */
    Env: {
    };
}