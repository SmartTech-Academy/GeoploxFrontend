import assets from "@/assets";
import { PageMetaTags } from "@/components/page-meta-data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/about/")({
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
          About Geoplox
        </h1>

        <div className="flex w-full flex-col gap-4 self-stretch text-[18px] leading-[25px] text-[#4D5462]">
          <p>
            Geoplox is a real estate intelligence and ecosystem infrastructure company built to fix
            a fundamental weakness in the property industry: fragmentation. Real estate involves
            many capable players, developers, property owners, investors, professionals, and capital
            providers yet they often operate in isolation, with poor information flow and limited
            coordination. Geoplox exists to connect these players through a neutral, data-led
            platform that enables trust, efficiency, and scale.
          </p>
          <p>
            We do not participate in transactions, give advisory opinions, or source properties. Our
            role is structural. Geoplox provides the shared intelligence, visibility, and
            coordination layer that allows the real estate ecosystem to function as a system rather
            than a collection of disconnected actors.
          </p>
        </div>

        <img src={assets.aboutusimage} alt="" width={1234} height={427} />

        <div className="flex grow flex-col gap-12">
          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              The Problem We Solve
            </h5>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              In many markets, real estate is constrained by opaque data, informal processes, and
              relationship-driven decision-making. Opportunities are missed, risks are amplified,
              and capital is inefficiently deployed not because of lack of demand, but because
              stakeholders cannot reliably see, verify, or align with one another.
            </p>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              Geoplox addresses this by standardizing information, clarifying roles, and enabling
              credible interaction across the industry without replacing existing participants.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              What We Do
            </h5>
            <div className="flex w-full flex-col gap-4">
              <h6 className="text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
                Real Estate Intelligence Infrastructure
              </h6>
              <p className="text-[18px] leading-[25px] text-[#4D5462]">
                Geoplox structures and organizes real estate information into usable intelligence.
                We create a single source of truth around property-level data, development status,
                market activity, and ecosystem participation, allowing stakeholders to engage from a
                common factual baseline.
              </p>
              <h6 className="text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
                Ecosystem Connectivity
              </h6>
              <p className="text-[18px] leading-[25px] text-[#4D5462]">
                We connect developers, property owners, investors, and service providers on a
                neutral platform designed to reduce friction and duplication. Geoplox enables
                visibility across opportunities, requirements, and progress without acting as an
                intermediary or decision-maker.
              </p>
              <h6 className="text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
                Transparency and Credibility Layer
              </h6>
              <p className="text-[18px] leading-[25px] text-[#4D5462]">
                Through structured data validation and standardized documentation, Geoplox improves
                trust between parties. This allows stakeholders to engage with greater confidence
                while maintaining full autonomy over negotiations and outcomes.
              </p>
              <h6 className="text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
                Process and Workflow Enablement
              </h6>
              <p className="text-[18px] leading-[25px] text-[#4D5462]">
                We support the coordination of real estate activities by organizing milestones,
                information exchange, and stakeholder interactions. This creates continuity across
                projects and transactions, even when multiple independent parties are involved.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              What Makes Geoplox Different
            </h5>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              Geoplox is intentionally independent and conflict-free. We do not compete with
              brokers, advisors, or developers. Instead, we strengthen their ability to operate by
              providing the infrastructure they lack.
            </p>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              Our value is not in opinions or deal-making, but in creating the conditions that allow
              better decisions and smoother execution to occur.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              Our Philosophy
            </h5>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              We believe real estate markets perform best when:
            </p>
            <ul className="list-inside list-disc text-[18px] leading-[25px] text-[#4D5462]">
              <li>Information is structured and accessible</li>
              <li>Trust is built on transparency, not personal networks alone</li>
              <li>Participants retain control while benefiting from shared infrastructure</li>
            </ul>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              Geoplox is designed around these principles.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              Our Vision
            </h5>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              To become the foundational operating layer for real estate ecosystems in emerging and
              growth markets, where collaboration, clarity, and efficiency are the norm rather than
              the exception.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 self-stretch">
            <h5 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
              Our Commitment
            </h5>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              We are committed to neutrality, data integrity, and long-term impact. Every solution
              we build is guided by the belief that stronger infrastructure leads to stronger
              markets.
            </p>
            <p className="text-[18px] leading-[25px] text-[#4D5462]">
              Geoplox is not part of the transaction. It is the platform that makes better
              transactions possible.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
