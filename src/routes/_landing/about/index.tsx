import assets from '@/assets';
import { PageMetaTags } from '@/components/page-meta-data';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_landing/about/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full bg-white pt-(--landing-header-height)">
      <PageMetaTags
        title="About Us"
        description="Learn about Geoplox's mission to revolutionize real estate in Nigeria. Trusted by thousands of property owners and buyers."
        keywords="about geoplox, real estate company Nigeria, property platform"
      />
      <section className="landing-container flex w-full flex-col gap-11 pt-[77px] pb-[33px]">
        <h1 className="self-stretch text-center text-[50px] leading-[60px] font-semibold tracking-[-0.02em] text-[#1F2130]">
          About Us
        </h1>

        <div className="flex w-full flex-col gap-4 self-stretch text-[18px] leading-[25px] text-[#4D5462]">
          <p>
            Geoplox is a trusted real estate platform dedicated to connecting people with the right property — whether
            it’s a first home, an investment, or a place to grow a business. We bring together up-to-date listings,
            market insights, and expert guidance to make property search simple and rewarding. Our team knows the
            market, understands local communities, and works hard to match every client with a place that truly fits.
          </p>

          <p>
            From apartments and family homes to commercial spaces, Geoplox offers tools, resources, and support to help
            you move forward with confidence.
          </p>
        </div>

        <img src={assets.aboutusimage} alt="" width={1234} height={427} />

        <div className="flex grow flex-col gap-12">
          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">Our Mission</h5>

            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              To simplify real estate discovery by providing accurate listings, innovative search tools, and exceptional
              customer service — empowering individuals and businesses to find the right property with confidence and
              ease.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">Our Service</h5>
            <div className="flex w-full flex-col gap-4">
              <p className="text-[18px] leading-[25px] text-[#4D5462]">
                Geoplox is a trusted real estate platform dedicated to connecting people with the right property —
                whether it’s a first home, an investment, or a place to grow a business. We bring together up-to-date
                listings, market insights, and expert guidance to make property search simple and rewarding. Our team
                knows the market, understands local communities, and works hard to match every client with a place that
                truly fits.
              </p>

              <p className="text-[18px] leading-[25px] text-[#4D5462]">
                From apartments and family homes to commercial spaces, Geoplox offers tools, resources, and support to
                help you move forward with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
