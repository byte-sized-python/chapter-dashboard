import { Auth0Client } from "@auth0/nextjs-auth0/server";

/**
 * Auth0 client for the BSP Chapter Dashboard.
 *
 * Configuration comes from the environment:
 *   AUTH0_DOMAIN        auth.bytesizedpython.org
 *   AUTH0_CLIENT_ID     regular web application client id
 *   AUTH0_CLIENT_SECRET regular web application client secret
 *   AUTH0_SECRET        32-byte hex cookie encryption key (openssl rand -hex 32)
 *   APP_BASE_URL        optional; inferred from the request host when omitted
 *
 * The SDK serves /auth/login, /auth/callback, /auth/logout and /auth/profile
 * from proxy.ts. We never handle credentials ourselves — we only read the
 * verified email off the session.
 */
export const auth0 = new Auth0Client();
