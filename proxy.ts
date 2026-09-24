import { auth0 } from "./lib/auth0";

/**
 * Next.js 16 renamed middleware.ts to proxy.ts. The Auth0 SDK mounts its
 * /auth/* routes and refreshes rolling sessions here, so the matcher has to
 * stay broad — narrowing it breaks session rolling.
 */
export async function proxy(request: Request) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
