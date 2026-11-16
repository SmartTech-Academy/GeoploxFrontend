export const BLOG_BASE_URL =
  (import.meta.env.VITE_BLOG_BASE_URL as string | undefined) ?? "https://blog.geoplox.com";

// Always go through the same-origin proxy (Vercel/Netlify rewrites + Vite dev proxy), never
// blog.geoplox.com directly from the browser. Besides avoiding CORS, the WordPress host
// (SiteGround) drops connections from some networks, including Nigerian ISPs (confirmed
// 2026-11-16: timeouts from Nigeria, 200 from Germany and from Vercel). When the browser
// called it directly, the blog sections loaded nothing for those visitors.
export const BLOG_GRAPHQL_URL =
  (import.meta.env.VITE_BLOG_GRAPHQL_URL as string | undefined) ?? "/blog-graphql";

// Same-origin proxy for WordPress media (featured images, images inside post content), for
// the same reason: /blog-media/* is rewritten to blog.geoplox.com/wp-content/*.
const BLOG_MEDIA_PROXY = "/blog-media/";
const BLOG_MEDIA_PATTERN = /https?:\/\/blog\.geoplox\.com\/wp-content\//gi;

export function proxyBlogMedia(url: string): string {
  return url.replace(BLOG_MEDIA_PATTERN, BLOG_MEDIA_PROXY);
}

/** Rewrites every blog.geoplox.com/wp-content URL in WordPress post HTML (src, srcset, href). */
export function proxyBlogMediaInHtml(html: string): string {
  return html.replace(BLOG_MEDIA_PATTERN, BLOG_MEDIA_PROXY);
}

type GraphqlError = {
  message: string;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

type GraphqlResponse<T> = { data: T; errors?: undefined } | { data?: T; errors: GraphqlError[] };

export async function wpGraphqlRequest<
  TData,
  TVariables extends Record<string, unknown> | undefined = undefined,
>(query: string, variables?: TVariables, signal?: AbortSignal): Promise<TData> {
  const res = await fetch(BLOG_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!res.ok) {
    // Surface raw text since WPGraphQL errors can be HTML (proxy/CDN) or JSON.
    const text = await res.text().catch(() => "");
    throw new Error(`WPGraphQL request failed (${res.status}): ${text || res.statusText}`);
  }

  const json = (await res.json()) as GraphqlResponse<TData>;
  if ("errors" in json && json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  }
  if (!("data" in json) || json.data == null) {
    throw new Error("WPGraphQL returned no data");
  }

  return json.data;
}

export function toAbsoluteBlogUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return proxyBlogMedia(pathOrUrl);
  return proxyBlogMedia(`${BLOG_BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`);
}
