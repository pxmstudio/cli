/**
 * Extends the Window interface to include custom global properties used in the website.
 */
interface Window {
    /** Webflow API instance array */
    Webflow: any[];
    /** Environment variables exposed to the client */
    Env: {
        /** Example: Google reCAPTCHA v3 site key */
        RECAPTCHA_V3_SITE_KEY: string;
    };
}