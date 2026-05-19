import { PageMetaTags } from "@/components/page-meta-data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/privacy/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen w-full bg-white pt-(--landing-header-height)">
      <PageMetaTags
        title="Privacy Policy"
        description="Geoplox Privacy Policy"
        keywords="geoplox, privacy, policy"
      />
      <section className="landing-container flex w-full flex-col gap-11 pt-[77px] pb-[33px]">
        <h1 className="self-stretch text-center text-[50px] leading-[60px] font-semibold tracking-[-0.02em] text-[#1F2130]">
          Privacy Policy
        </h1>

        <div className="flex w-full flex-col gap-4 self-stretch text-[18px] leading-[25px] text-[#4D5462]">
          <p>Effective Date: 23/01/2026</p>
          <p>Last Updated: 23/01/2026</p>
          <p>
            This Privacy Policy (“Policy”) describes how Geoplox (“Geoplox,” “we,” “our,” or “us”)
            collects, uses, discloses, stores, and protects personal data when you access or use our
            website, platform, products, or services (collectively, the “Services”). This Policy is
            intended to be legally binding and forms part of the terms governing your relationship
            with Geoplox.
          </p>
          <p>
            By accessing or using our Services, you acknowledge that you have read, understood, and
            agreed to the practices described in this Policy.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            1. Scope and Application
          </h2>
          <p>
            This Policy applies to all users, visitors, partners, and entities that interact with
            Geoplox, including but not limited to developers, property owners, investors,
            professionals, service providers, and institutions.
          </p>
          <p>
            This Policy applies regardless of how you access the Services, including through web
            platforms, mobile interfaces, APIs, or other digital channels operated by Geoplox.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            2. Definitions
          </h2>
          <p>For the purposes of this Policy:</p>
          <ul className="list-inside list-disc">
            <li>
              “Personal Data” means any information that identifies or can reasonably be linked to
              an individual.
            </li>
            <li>“User” means any person or entity that accesses or uses the Services.</li>
            <li>
              “Processing” means any operation performed on Personal Data, including collection,
              storage, use, disclosure, or deletion.
            </li>
            <li>
              “Platform Data” means information submitted, uploaded, generated, or exchanged through
              the Geoplox platform.
            </li>
          </ul>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            3. Information We Collect
          </h2>
          <h3 className="mt-4 text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            3.1 Information You Provide Directly
          </h3>
          <p>We may collect Personal Data that you voluntarily provide, including:</p>
          <ul className="list-inside list-disc">
            <li>Full name, company name, and professional role</li>
            <li>Email address, phone number, and contact details</li>
            <li>Account registration and profile information</li>
            <li>Information submitted through contact forms or onboarding processes</li>
            <li>Documents, records, and data uploaded to the platform</li>
          </ul>
          <h3 className="mt-4 text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            3.2 Information Collected Automatically
          </h3>
          <p>When you use our Services, we may automatically collect:</p>
          <ul className="list-inside list-disc">
            <li>IP address, device identifiers, browser type, and operating system</li>
            <li>Usage data, interaction logs, timestamps, and referring URLs</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
          <h3 className="mt-4 text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            3.3 Third-Party Information
          </h3>
          <p>
            We may receive information from third-party service providers, partners, or
            integrations, provided such sharing complies with applicable law.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            4. Purpose and Legal Basis for Processing
          </h2>
          <p>
            Geoplox processes Personal Data strictly for legitimate business purposes, including:
          </p>
          <ul className="list-inside list-disc">
            <li>Providing, operating, and maintaining the Services</li>
            <li>Verifying users and maintaining platform integrity</li>
            <li>Facilitating structured information exchange and coordination</li>
            <li>Communicating with users regarding accounts, updates, or support</li>
            <li>Improving platform performance, security, and user experience</li>
            <li>Complying with legal, regulatory, and contractual obligations</li>
          </ul>
          <p>
            Where required by law, processing is based on one or more of the following legal
            grounds:
          </p>
          <ul className="list-inside list-disc">
            <li>User consent</li>
            <li>Performance of a contract</li>
            <li>Compliance with legal obligations</li>
            <li>Legitimate business interests that do not override user rights</li>
          </ul>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            5. What Geoplox Does Not Do
          </h2>
          <p>To avoid ambiguity:</p>
          <ul className="list-inside list-disc">
            <li>Geoplox does not sell Personal Data to third parties.</li>
            <li>Geoplox does not act as an agent, broker,Real Estate Consultant, or representative in transactions.</li>
            <li>
              All data processed is used solely to support the platform’s neutral infrastructure
              role.
            </li>
          </ul>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            6. Data Sharing and Disclosure
          </h2>
          <p>We may share Personal Data only in the following circumstances:</p>
          <h3 className="mt-4 text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            6.1 With Other Users
          </h3>
          <p>
            Certain information may be visible to other platform participants based on your role,
            permissions, and interactions. You control what you submit and acknowledge that shared
            data may be accessed by relevant parties.
          </p>
          <h3 className="mt-4 text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            6.2 With Service Providers
          </h3>
          <p>
            We may share data with trusted third-party vendors who perform services such as hosting,
            analytics, security, or communications, under strict confidentiality obligations.
          </p>
          <h3 className="mt-4 text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            6.3 Legal and Regulatory Requirements
          </h3>
          <p>
            We may disclose data where required by law, court order, regulatory authority, or to
            protect our legal rights, users, or the public.
          </p>
          <h3 className="mt-4 text-[20px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            6.4 Business Transfers
          </h3>
          <p>
            In the event of a merger, acquisition, restructuring, or asset sale, data may be
            transferred as part of the transaction, subject to continued protection under this
            Policy.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            7. Data Retention
          </h2>
          <p>
            We retain Personal Data only for as long as necessary to fulfill the purposes outlined
            in this Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p>Data may be retained to:</p>
          <ul className="list-inside list-disc">
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce agreements</li>
            <li>Maintain audit and security records</li>
          </ul>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            8. Data Security
          </h2>
          <p>
            Geoplox implements reasonable administrative, technical, and organizational measures to
            protect Personal Data against unauthorized access, loss, misuse, alteration, or
            disclosure.
          </p>
          <p>
            While we take data protection seriously, no system can be guaranteed to be completely
            secure. Users acknowledge and accept this inherent risk.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            9. User Rights
          </h2>
          <p>Subject to applicable law, you may have the right to:</p>
          <ul className="list-inside list-disc">
            <li>Access your Personal Data</li>
            <li>Request correction or update of inaccurate data</li>
            <li>Request deletion or restriction of processing</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Object to certain types of processing</li>
          </ul>
          <p>
            Requests may be submitted through our official contact channels. We reserve the right to
            verify identity before fulfilling requests.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            10. Cookies and Tracking Technologies
          </h2>
          <p>Geoplox uses cookies and similar technologies to:</p>
          <ul className="list-inside list-disc">
            <li>Enable platform functionality</li>
            <li>Analyze usage and performance</li>
            <li>Improve user experience</li>
          </ul>
          <p>
            You may control cookie preferences through your browser settings, though disabling
            cookies may limit certain features.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            11. International Data Transfers
          </h2>
          <p>
            Your information may be processed or stored in jurisdictions outside your country of
            residence. Where such transfers occur, Geoplox ensures appropriate safeguards are in
            place in accordance with applicable data protection laws.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            12. Children’s Privacy
          </h2>
          <p>
            The Services are not intended for individuals under the age of 18. Geoplox does not
            knowingly collect Personal Data from minors. If such data is identified, it will be
            deleted promptly.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            13. Limitation of Liability
          </h2>
          <p>To the maximum extent permitted by law, Geoplox shall not be liable for:</p>
          <ul className="list-inside list-disc">
            <li>Unauthorized access beyond our reasonable control</li>
            <li>Actions taken by third parties using shared data</li>
            <li>Losses arising from user-provided information</li>
          </ul>
          <p>Users remain responsible for the accuracy and legality of data they submit.</p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            14. Changes to This Policy
          </h2>
          <p>
            Geoplox reserves the right to update or modify this Privacy Policy at any time. Changes
            become effective upon publication. Continued use of the Services constitutes acceptance
            of the revised Policy.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            15. Governing Law
          </h2>
          <p>
            This Privacy Policy shall be governed by and construed in accordance with the laws of
            the applicable jurisdiction in which Geoplox is registered, without regard to conflict
            of law principles.
          </p>

          <h2 className="mt-6 text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            16. Contact Information
          </h2>
          <p>
            For questions, concerns, or data-related requests, please contact Geoplox through the
            official communication channels provided on our website.
          </p>

          <p className="mt-6 font-semibold">
            By using Geoplox, you acknowledge that you understand and accept this Privacy Policy in
            full.
          </p>
        </div>
      </section>
    </div>
  );
}
