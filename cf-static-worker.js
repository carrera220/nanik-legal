/**
 * Thin Worker: serve the static nanik-legal site from Assets.
 * Maps /dashboard → /dashboard.html (and same for other pages) so old links keep working.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;

    if (path !== "/" && !path.includes(".") && !path.endsWith("/")) {
      const htmlReq = new Request(new URL(path + ".html", url.origin), request);
      const htmlRes = await env.ASSETS.fetch(htmlReq);
      if (htmlRes.status !== 404) return htmlRes;
    }

    return env.ASSETS.fetch(request);
  },
};
