/**
 * Thin Worker: serve the static nanik-legal site from Assets.
 * Maps /dashboard → /dashboard.html (and same for other pages) so old links keep working.
 * Blocks secret / local env paths that must never be public.
 */
function isBlockedPath(pathname) {
  const p = pathname.toLowerCase();
  if (p.includes("/.env") || p.endsWith(".env") || p.includes(".env.")) return true;
  if (p.includes("/supabase/.env")) return true;
  if (p.includes("/.git/") || p.endsWith("/.git")) return true;
  if (p.includes("/.wrangler/")) return true;
  return false;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    if (isBlockedPath(path)) {
      return new Response("Not Found", { status: 404 });
    }

    if (path !== "/" && !path.includes(".") && !path.endsWith("/")) {
      const htmlReq = new Request(new URL(path + ".html", url.origin), request);
      const htmlRes = await env.ASSETS.fetch(htmlReq);
      if (htmlRes.status !== 404) return htmlRes;
    }

    return env.ASSETS.fetch(request);
  },
};
