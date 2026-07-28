import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { wpGraphqlRequest } from "@/lib/wpGraphql";

export type WpAvatar = { url?: string | null } | null;

export type WpAuthorNode = {
  name?: string | null;
  avatar?: WpAvatar;
  roles?: { nodes?: Array<{ name?: string | null } | null> | null } | null;
  description?: string | null;
} | null;

export type WpPost = {
  uri: string;
  title?: string | null;
  date?: string | null;
  content?: string | null;
  categories?: { nodes?: Array<{ name?: string | null } | null> | null } | null;
  author?: { node?: WpAuthorNode } | null;
  comments?: {
    nodes?: Array<{
      content?: string | null;
      author?: { name?: string | null } | null;
      date?: string | null;
      replies?: {
        nodes?: Array<{
          date?: string | null;
          content?: string | null;
          author?: { name?: string | null } | null;
        } | null> | null;
      } | null;
      status?: string | null;
    } | null> | null;
  } | null;
  featuredImage?: {
    node?: {
      altText?: string | null;
      title?: string | null;
      filePath?: string | null;
      sourceUrl?: string | null;
    } | null;
  } | null;
};

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
};

type PostsConnection = {
  pageInfo: PageInfo;
  nodes: WpPost[];
};

type GetAllPostsData = {
  posts: PostsConnection;
};

type GetAllPostsVars = { first: number; after?: string | null };

const GET_ALL_POSTS = /* GraphQL */ `
  query GetAllPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        uri
        title
        date
        content
        categories {
          nodes {
            name
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
            roles {
              nodes {
                name
              }
            }
            description
          }
        }
        comments {
          nodes {
            content
            author {
              name
            }
            date
            replies {
              nodes {
                date
                content
                author {
                  name
                }
              }
            }
            status
          }
        }
        featuredImage {
          node {
            altText
            title
            filePath
            sourceUrl
          }
        }
      }
    }
  }
`;

type GetPostByUriData = { post: WpPost | null };
type GetPostByUriVars = { uri: string };

const GET_POST_BY_URI = /* GraphQL */ `
  query GetPostByUri($uri: ID!) {
    post(id: $uri, idType: URI) {
      uri
      title
      date
      content
      categories {
        nodes {
          name
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
          roles {
            nodes {
              name
            }
          }
          description
        }
      }
      comments {
        nodes {
          content
          author {
            name
          }
          date
          replies {
            nodes {
              date
              content
              author {
                name
              }
            }
          }
          status
        }
      }
      featuredImage {
        node {
          altText
          title
          filePath
          sourceUrl
        }
      }
    }
  }
`;

export function useInfiniteWpPosts(first: number = 10) {
  return useInfiniteQuery({
    queryKey: ["wp-posts", { first }],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam, signal }) => {
      const data = await wpGraphqlRequest<GetAllPostsData, GetAllPostsVars>(
        GET_ALL_POSTS,
        { first, after: pageParam },
        signal,
      );
      return data.posts;
    },
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? (lastPage.pageInfo.endCursor ?? null) : null,
  });
}

export function useWpPostBySlug(slug: string | undefined) {
  const uri = slug ? `/${slug.replace(/^\/+|\/+$/g, "")}/` : undefined;

  return useQuery({
    queryKey: ["wp-post", { uri }],
    queryFn: ({ signal }) =>
      wpGraphqlRequest<GetPostByUriData, GetPostByUriVars>(GET_POST_BY_URI, { uri: uri! }, signal),
    enabled: !!uri,
    select: (data) => data.post,
  });
}
