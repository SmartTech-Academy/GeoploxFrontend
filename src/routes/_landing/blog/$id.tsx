import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import assets from '@/assets';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import { PageMetaTags } from '@/components/page-meta-data';
export const Route = createFileRoute('/_landing/blog/$id')({
  component: RouteComponent,
});

const BLOGS = [
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog1,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog2,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog3,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog4,
  },
  {
    date: 'Sunday, February 12, 2023',
    title: 'How to position your team for success',
    text: 'In this article, we provide three tips on how we position our team for success consolidated in the 3 C’s framework',
    image: assets.blog5,
  },
];

function RouteComponent() {
  return (
    <div className="min-h-screen w-full bg-white pt-(--landing-header-height)">
      <PageMetaTags
        title="10 Tips for First-Time Home Buyers in Lagos"
        description="Essential advice for navigating the Lagos property market as a first-time buyer, from budgeting to closing deals."
        keywords="Lagos property buying guide, first time home buyer Nigeria, real estate tips"
        image="/blog/first-time-buyer-guide.jpg"
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
                    <BreadcrumbPage>How to position your team for success</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex flex-col gap-12">
              <div className="flex items-center gap-3">
                <span className="text-[15px]/5  font-semibold tracking-[-0.12px] text-[#060809]">
                  Market Trends
                </span>

                <span className="text-[15px]/5  tracking-[-0.12px] text-[#7B828E]">
                  Sunday, February 12, 2023
                </span>
              </div>

              <div className="flex w-full flex-col gap-[15px]">
                <h1 className="text-[45px] leading-[58px] font-semibold tracking-[-1.21px] text-black">
                  How to position your team for success
                </h1>

                <p className="text-[15px]/5  tracking-[-0.12px] text-[#060809]">
                  In this week’s Business Spotlight, Awele talks us through her journey, some challenges she has faced,
                  and what she has found most rewarding through it all
                </p>
              </div>

              <img src={assets.blog1} alt="blog" className="h-auto w-full" width={1212} height={541} />

              <div className="flex flex-col items-start gap-6 px-5 lg:px-6">
                <p className="text-[15px]/5  tracking-[-0.12px] text-[#060809]">
                  On a journey to de-stigmatise anxiety through a series of art therapy sessions across Nigeria, Awele
                  Ogwu has turned a personal experience into an opportunity to create an outlet for many others to
                  network, express themselves andffind relief in moments of anxiety. Founded in 2018, The Art Room NG is
                  a therapeutic arts space based in Lagos and Abuja.
                </p>
                <p className="text-[15px]/5  tracking-[-0.12px] text-[#060809]">
                  It was quite nerve-wracking to be honest. To see something that you once had as an idea become
                  something in realityfbut it was also quite exciting and rewarding. We had prepped for this session for
                  over a month just waiting to see how many people would show up. We put the word out and sold out in a
                  few days, which encouraged us to push through and put more into the session.
                </p>
                <p className="text-[15px]/5  tracking-[-0.12px] text-[#060809]">
                  It was quite nerve-wracking to be honest. To see something that you once had as an idea become
                  something in realityfbut it was also quite exciting and rewarding. We had prepped for this session for
                  over a month just waiting to see how many people would show up. We put the word out and sold out in a
                  few days, which encouraged us to push through and put more into the session.
                </p>
                <p className="text-[15px]/5  tracking-[-0.12px] text-[#060809]">
                  It was quite nerve-wracking to be honest. To see something that you once had as an idea become
                  something in realityfbut it was also quite exciting and rewarding. We had prepped for this session for
                  over a month just waiting to see how many people would show up. We put the word out and sold out in a
                  few days, which encouraged us to push through and put more into the session.
                </p>

                <div className="flex w-full flex-col items-start gap-[25px]">
                  <div className="flex items-center gap-[25px]">
                    <img src={assets.blogwritter} alt="author" className="size-12" width={48} height={48} />
                    <div className="flex flex-col items-start gap-[7px]">
                      <p className="text-[15px]/5  tracking-[-0.12px] text-[#060809]">Skylar Vaccaro</p>
                      <p className="text-[14px] leading-[21px] tracking-[-0.12px] text-[#393E46]">
                        Product Marketing and Communications
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-[25px]">
                    <p className="text-[12px] leading-[22px] tracking-[-0.12px] text-[#8F96A3]">SHARE THIS POST ON</p>

                    <div className="flex items-center gap-4">
                      <button className="flex size-8 items-center justify-center rounded-4xl bg-[#F9F9F9]">
                        <Facebook className="size-4 fill-primary text-primary" />
                      </button>

                      <button className="flex size-8 items-center justify-center rounded-4xl bg-[#F9F9F9]">
                        <Twitter className="size-4 fill-primary text-primary" />
                      </button>

                      <button className="flex size-8 items-center justify-center rounded-4xl bg-[#F9F9F9]">
                        <Linkedin className="size-4 fill-primary text-primary" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </section>

      <section className="relative min-h-[647.5px] w-full bg-[oklch(0.7898_0.1514_90.07/20%)] py-5 lg:rounded-[13px] lg:py-[106px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${assets.yellowbackground})`,
          }}
        >
          <div className="absolute inset-0 bg-[oklch(0.7898_0.1514_90.07/20%)]/20" />
        </div>
        <div className="relative z-10 landing-container flex flex-col gap-5 lg:gap-[52px]">
          <h4 className="text-[34px] leading-[41px] font-semibold text-black">More posts like this</h4>

          <div className="grid w-full gap-[31px] lg:grid-cols-2">
            {BLOGS.slice(0, 2).map((blog, index) => (
              <Link
                to="/blog/$id"
                params={{ id: String(index) }}
                key={index}
                className="grow rounded-xl border border-[#E9EBEC] bg-white"
              >
                <img src={blog.image} width={626} height={240} className="h-auto w-full" />
                <div className="flex w-full flex-col gap-[5px] p-6">
                  <h5 className="line-clamp-1 text-[18px] leading-[26px] font-semibold tracking-[-0.2px] text-[#060809]">
                    {blog.title}
                  </h5>

                  <p className="line-clamp-1 text-[15px]/5  tracking-[-0.12px] text-[#060809]">{blog.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
