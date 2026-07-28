import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import assets from "@/assets";

import { PageMetaTags } from "@/components/page-meta-data";
import {
  // useInfiniteWpPosts,
  useWpPostBySlug,
} from "@/lib/services/wpBlog";
import { excerptFromHtml } from "@/lib/utils";
import {
  // BLOG_BASE_URL,
  toAbsoluteBlogUrl,
} from "@/lib/wpGraphql";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
// import { TbBrandFacebook, TbBrandLinkedin, TbBrandTwitter } from 'react-icons/tb';
export const Route = createFileRoute("/_landing/blog/$id")({
  component: RouteComponent,
});

// function currentUrl() {
//   if (typeof window === 'undefined') return '';
//   return window.location.href;
// }

function RouteComponent() {
  const { id } = Route.useParams();
  const postQuery = useWpPostBySlug(id);
  // const morePostsQuery = useInfiniteWpPosts(6);

  const post = postQuery.data;
  const title = post?.title ?? "Blog Post";
  const description = post?.content ? excerptFromHtml(post.content, 160) : undefined;
  const postDate = post?.date ? format(new Date(post.date), "EEEE, MMMM d, yyyy") : undefined;
  const category = post?.categories?.nodes?.[0]?.name ?? "Blog";
  const imageUrl =
    toAbsoluteBlogUrl(post?.featuredImage?.node?.sourceUrl) ??
    toAbsoluteBlogUrl(post?.featuredImage?.node?.filePath) ??
    assets.blog1;

  // const shareUrl = currentUrl();
  // const twitterShare = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
  // const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  // const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  // const morePosts =
  //   morePostsQuery.data?.pages
  //     .flatMap((p) => p.nodes)
  //     .filter((p) => p.uri !== post?.uri)
  //     .slice(0, 2) ?? [];

  return (
    <div className="min-h-screen w-full bg-white pt-(--landing-header-height)">
      <PageMetaTags
        title={title}
        description={description}
        keywords="real estate blog Nigeria, property investment tips, real estate news"
        image={imageUrl}
      />
      <section className="landing-container flex w-full flex-col gap-8 pt-[77px] pb-[33px]">
        <header className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start self-stretch">
            <div className="flex gap-3 self-stretch py-[15px]">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />

                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/blog">Blog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{postQuery.isLoading ? "Loading…" : title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex flex-col gap-12">
              {postQuery.isLoading ? (
                <div className="flex w-full flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex w-full flex-col gap-4">
                    <Skeleton className="h-12 w-4/5" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <Skeleton className="h-[420px] w-full" />
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                  </div>
                </div>
              ) : postQuery.isError ? (
                <div className="rounded-xl border border-[#E9EBEC] bg-white p-6 text-[#060809]">
                  Failed to load post. {(postQuery.error as Error)?.message}
                </div>
              ) : !post ? (
                <div className="rounded-xl border border-[#E9EBEC] bg-white p-6 text-[#060809]">
                  Post not found.
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-[15px]/5 font-semibold tracking-[-0.12px] text-[#060809]">
                      {category}
                    </span>
                    {postDate ? (
                      <span className="text-[15px]/5 tracking-[-0.12px] text-[#7B828E]">
                        {postDate}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex w-full flex-col gap-[15px]">
                    <h1 className="text-[45px] leading-[58px] font-semibold tracking-[-1.21px] text-black">
                      {title}
                    </h1>

                    {description ? (
                      <p className="text-[15px]/5 tracking-[-0.12px] text-[#060809]">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  {/*<img*/}
                  {/*  src={imageUrl}*/}
                  {/*  alt={post.featuredImage?.node?.altText || title}*/}
                  {/*  className="h-auto max-h-[541px] w-full rounded-xl object-cover"*/}
                  {/*  width={1212}*/}
                  {/*  height={541}*/}
                  {/*/>*/}

                  <div className="flex flex-col items-start gap-6 px-5 lg:px-6">
                    <div
                      className="wp-content w-full"
                      dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                    />
                    <div className="flex w-full flex-col items-start gap-[25px]">
                      <div className="flex items-center gap-[25px]">
                        <img
                          src={
                            toAbsoluteBlogUrl(post.author?.node?.avatar?.url) ?? assets.blogwritter
                          }
                          alt={post.author?.node?.name ?? "author"}
                          className="size-12 rounded-full object-cover"
                          width={48}
                          height={48}
                        />
                        <div className="flex flex-col items-start gap-[7px]">
                          <p className="text-[15px]/5 tracking-[-0.12px] text-[#060809]">
                            {post.author?.node?.name ?? "Geoplox"}
                          </p>
                          <p className="text-[14px] leading-[21px] tracking-[-0.12px] text-[#393E46]">
                            {post.author?.node?.description ?? "Geoplox Blog"}
                          </p>
                        </div>
                      </div>

                      {/*<div className="flex flex-col items-start gap-[25px]">*/}
                      {/*  <p className="text-[12px] leading-[22px] tracking-[-0.12px] text-[#8F96A3]">*/}
                      {/*    SHARE THIS POST ON*/}
                      {/*  </p>*/}

                      {/*  <div className="flex items-center gap-4">*/}
                      {/*    <a*/}
                      {/*      className="flex size-8 items-center justify-center rounded-4xl bg-[#F9F9F9]"*/}
                      {/*      href={facebookShare}*/}
                      {/*      target="_blank"*/}
                      {/*      rel="noreferrer"*/}
                      {/*      aria-label="Share on Facebook"*/}
                      {/*    >*/}
                      {/*      <TbBrandFacebook className="fill-primary text-primary size-4" />*/}
                      {/*    </a>*/}

                      {/*    <a*/}
                      {/*      className="flex size-8 items-center justify-center rounded-4xl bg-[#F9F9F9]"*/}
                      {/*      href={twitterShare}*/}
                      {/*      target="_blank"*/}
                      {/*      rel="noreferrer"*/}
                      {/*      aria-label="Share on X"*/}
                      {/*    >*/}
                      {/*      <TbBrandTwitter className="fill-primary text-primary size-4" />*/}
                      {/*    </a>*/}

                      {/*    <a*/}
                      {/*      className="flex size-8 items-center justify-center rounded-4xl bg-[#F9F9F9]"*/}
                      {/*      href={linkedInShare}*/}
                      {/*      target="_blank"*/}
                      {/*      rel="noreferrer"*/}
                      {/*      aria-label="Share on LinkedIn"*/}
                      {/*    >*/}
                      {/*      <TbBrandLinkedin className="fill-primary text-primary size-4" />*/}
                      {/*    </a>*/}
                      {/*  </div>*/}

                      {/*  <a*/}
                      {/*    className="text-[12px] leading-[22px] tracking-[-0.12px] text-[#8F96A3] underline underline-offset-4"*/}
                      {/*    href={`${BLOG_BASE_URL}${post.uri}`}*/}
                      {/*    target="_blank"*/}
                      {/*    rel="noreferrer"*/}
                      {/*  >*/}
                      {/*    View on SEO blog*/}
                      {/*  </a>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      </section>

      {/*<section className="relative min-h-[647.5px] w-full bg-[oklch(0.7898_0.1514_90.07/20%)] py-5 lg:rounded-[13px] lg:py-[106px]">*/}
      {/*  <div*/}
      {/*    className="absolute inset-0 bg-cover bg-center bg-no-repeat"*/}
      {/*    style={{*/}
      {/*      backgroundImage: `url(${assets.yellowbackground})`,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07/20%)]/20" />*/}
      {/*  </div>*/}
      {/*  <div className="landing-container relative z-10 flex flex-col gap-5 lg:gap-[52px]">*/}
      {/*    <h4 className="text-[34px] leading-[41px] font-semibold text-black">More posts like this</h4>*/}

      {/*    <div className="grid w-full gap-[31px] lg:grid-cols-2">*/}
      {/*      {morePostsQuery.isLoading ? (*/}
      {/*        <>*/}
      {/*          <div className="grow rounded-xl border border-[#E9EBEC] bg-white">*/}
      {/*            <Skeleton className="h-[240px] w-full rounded-none" />*/}
      {/*            <div className="flex w-full flex-col gap-3 p-6">*/}
      {/*              <Skeleton className="h-6 w-4/5" />*/}
      {/*              <Skeleton className="h-5 w-full" />*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*          <div className="grow rounded-xl border border-[#E9EBEC] bg-white">*/}
      {/*            <Skeleton className="h-[240px] w-full rounded-none" />*/}
      {/*            <div className="flex w-full flex-col gap-3 p-6">*/}
      {/*              <Skeleton className="h-6 w-4/5" />*/}
      {/*              <Skeleton className="h-5 w-full" />*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </>*/}
      {/*      ) : (*/}
      {/*        morePosts.map((p) => {*/}
      {/*          const slug = p.uri.replace(/^\/+|\/+$/g, '');*/}
      {/*          const img =*/}
      {/*            toAbsoluteBlogUrl(p.featuredImage?.node?.sourceUrl) ??*/}
      {/*            toAbsoluteBlogUrl(p.featuredImage?.node?.filePath) ??*/}
      {/*            assets.blog1;*/}
      {/*          return (*/}
      {/*            <Link*/}
      {/*              to="/blog/$id"*/}
      {/*              params={{ id: slug }}*/}
      {/*              key={p.uri}*/}
      {/*              className="grow rounded-xl border border-[#E9EBEC] bg-white"*/}
      {/*            >*/}
      {/*              <img src={img} width={626} height={240} className="h-auto w-full rounded-t-xl object-cover" />*/}
      {/*              <div className="flex w-full flex-col gap-[5px] p-6">*/}
      {/*                <h5 className="line-clamp-1 text-[18px] leading-[26px] font-semibold tracking-[-0.2px] text-[#060809]">*/}
      {/*                  {p.title}*/}
      {/*                </h5>*/}

      {/*                <p className="line-clamp-1 text-[15px]/5 tracking-[-0.12px] text-[#060809]">*/}
      {/*                  {excerptFromHtml(p.content ?? '', 140)}*/}
      {/*                </p>*/}
      {/*              </div>*/}
      {/*            </Link>*/}
      {/*          );*/}
      {/*        })*/}
      {/*      )}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
    </div>
  );
}
