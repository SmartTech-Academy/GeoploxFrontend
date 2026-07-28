export const BLOG_BASE_URL =
  (import.meta.env.VITE_BLOG_BASE_URL as string | undefined) ?? "https://blog.geoplox.com";

// Prefer same-origin proxy to avoid CORS in browsers. Configure via Vite/Netlify/Vercel rewrites.
export const BLOG_GRAPHQL_URL =
  import.meta.env.VITE_BLOG_GRAPHQL_URL ?? "https://blog.geoplox.com/graphql";

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
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${BLOG_BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
