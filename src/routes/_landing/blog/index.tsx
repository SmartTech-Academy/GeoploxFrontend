import assets from '@/assets';
import { PageMetaTags } from '@/components/page-meta-data';
import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useInfiniteWpPosts } from '@/lib/services/wpBlog';
import { excerptFromHtml } from '@/lib/utils';
import { toAbsoluteBlogUrl } from '@/lib/wpGraphql';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';


export const Route = createFileRoute('/_landing/blog/')({
  component: RouteComponent,
});

function slugFromUri(uri: string) {
  return uri.replace(/^\/+|\/+$/g, '');
}

function RouteComponent() {
  const postsQuery = useInfiniteWpPosts(10);
  const posts = postsQuery.data?.pages.flatMap((p) => p.nodes) ?? [];

  return (
    <div className="w-full">
      <PageMetaTags
        title="Real Estate Blog"
        description="Get expert insights on Nigerian real estate market, investment tips, and property trends."
        keywords="real estate blog Nigeria, property investment tips, real estate news"
      />
      <section className="relative flex min-h-[400px] items-center justify-start">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${assets.bloghero})`,
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 landing-container w-full py-(--landing-header-height)">
          <div className="flex w-full flex-col items-start gap-[42px]">
            <div className="flex max-w-[639px] flex-col items-start gap-[17px]">
              <div className="flex flex-col items-start gap-[9px]">
                {/* Main Heading */}
                <h1 className="text-[66px] leading-[79px] font-semibold tracking-[-0.02em] text-balance text-[#D4AF36]">
                  Geoplox Blog
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-[20px] leading-7 text-primary-foreground">
                Updates about current market trends and news
              </p>
            </div>

            {/*<div className="flex w-full max-w-[817px] grow flex-col gap-3">*/}
            {/*  /!* Search Interface *!/*/}
            {/*  <div className="flex w-full max-w-[817px] items-center gap-3 rounded-4xl bg-[oklch(1_0_0/50%)] p-4 backdrop-blur-md">*/}
            {/*    <div className="relative flex flex-1 items-center gap-2">*/}
            {/*      <Input*/}
            {/*        type="email"*/}
            {/*        placeholder="Enter email"*/}
            {/*        className="h-10 rounded-[85px] border border-[#D5D5DD] bg-white py-[14px] text-base text-gray-900 placeholder:text-gray-500 focus-visible:ring-0"*/}
            {/*      />*/}
            {/*    </div>*/}

            {/*    <Button*/}
            {/*      style={{*/}
            {/*        background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',*/}
            {/*        border: '1px solid rgba(30, 30, 30, 0.5)',*/}
            {/*        boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',*/}
            {/*      }}*/}
            {/*      className="flex h-10 items-center justify-center rounded-[40px] p-4 text-[14px] leading-[17px] font-semibold text-white"*/}
            {/*    >*/}
            {/*      Subscribe*/}
            {/*    </Button>*/}
            {/*  </div>*/}

            {/*  <p className="text-[14px]/5  text-white">*/}
            {/*    Subscribe to our monthly newsletter. You can unsubscribe anytime.*/}
            {/*  </p>*/}
            {/*</div>*/}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col gap-[64px] bg-white py-16">
        <div className="landing-container flex w-full flex-col gap-[64px]">
          {postsQuery.isLoading ? (
            <div className="flex flex-col gap-[64px]">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex flex-col-reverse items-center justify-center gap-10 lg:flex-row">
                  <div className="flex flex-col items-start lg:w-1/2">
                    <div className="flex w-full flex-col gap-6 self-stretch">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="flex w-full flex-col gap-4 self-stretch pb-8">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-4/5" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-[294px] w-full lg:w-1/2" />
                </div>
              ))}
            </div>
          ) : postsQuery.isError ? (
            <div className="rounded-xl border border-[#E9EBEC] bg-white p-6 text-[#060809]">
              Failed to load blog posts. {(postsQuery.error as Error)?.message}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-xl border border-[#E9EBEC] bg-white p-6 text-[#060809]">No blog posts yet.</div>
          ) : (
            posts.map((post) => {
              const slug = slugFromUri(post.uri);
              const dateLabel = post.date ? format(new Date(post.date), 'EEEE, MMMM d, yyyy') : '';
              const category = post.categories?.nodes?.[0]?.name ?? 'Blog';
              const imageUrl =
                toAbsoluteBlogUrl(post.featuredImage?.node?.sourceUrl) ??
                toAbsoluteBlogUrl(post.featuredImage?.node?.filePath) ??
                assets.blog1;

              return (
                <Link
                  to="/blog/$id"
                  params={{ id: slug }}
                  key={post.uri}
                  className="flex flex-col-reverse items-center justify-center gap-10 lg:flex-row"
                >
                  <div className="flex flex-col items-start lg:w-1/2">
                    <div className="flex flex-col gap-6 self-stretch">
                      <div className="flex items-center gap-3">
                        <span className="text-[15px]/5 tracking-[-0.12px] text-[#060809]">{category}</span>
                        {dateLabel ? (
                          <span className="text-[15px]/5 tracking-[-0.12px] text-[#7B828E]">{dateLabel}</span>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-8 self-stretch pb-8">
                        <h4 className="text-[28px] leading-[34px] font-semibold tracking-[-0.39px] text-black">
                          {post.title}
                        </h4>

                        <p className="line-clamp-2 text-[15px]/5 tracking-[-0.12px] text-[#060809]">
                          {excerptFromHtml(post.content ?? '')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <img
                    src={imageUrl}
                    width={573}
                    height={294}
                    alt={post.featuredImage?.node?.altText || post.title || 'Blog post'}
                    className="h-auto w-full rounded-xl object-cover lg:w-1/2"
                  />
                </Link>
              );
            })
          )}

          <div className="flex items-center justify-center">
            <Button
              className="h-12 rounded-[40px] bg-[#F9F9F9] px-6 py-[15px] text-[16px] leading-[19px] font-semibold text-[#1F2130]"
              variant="secondary"
              disabled={postsQuery.isLoading || !postsQuery.hasNextPage || postsQuery.isFetchingNextPage}
              onClick={() => postsQuery.fetchNextPage()}
            >
              {postsQuery.isLoading || postsQuery.isFetchingNextPage
                ? 'Loading…'
                : postsQuery.hasNextPage
                  ? 'Load More'
                  : 'No More Posts'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
