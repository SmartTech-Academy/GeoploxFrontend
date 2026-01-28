import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4';
import { useForm } from 'react-hook-form';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CirclePlus, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import assets from '@/assets';

import { PageMetaTags } from '@/components/page-meta-data';
import { useContactUs } from '@/lib/services';
import { customResolver } from '@/lib/customZodResolver';
import { toast, Toaster } from 'sonner';

// Zod schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Route = createFileRoute('/_landing/contact/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: contactUs, isPending } = useContactUs();

  const form = useForm<ContactFormData>({
    resolver: customResolver(contactSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactUs(data, {
      onSuccess: () => {
        form.reset();
        toast.success('Message sent successfully! We will get back to you soon.');
      },
    });
  };

  const faqData = [
    {
      question: 'What type of company is Geoplox?',
      answer:
        'Geoplox is a real estate intelligence and ecosystem infrastructure platform. We provide structured data, transparency, and coordination tools that connect participants across the real estate value chain. We do not act as brokers, agents, or advisors.',
    },
    {
      question: 'Does Geoplox buy, sell, list, or source properties?',
      answer:
        'No. Geoplox does not buy, sell, list, market, or source properties. All transactions and negotiations are conducted directly between the relevant parties. Geoplox remains neutral and independent.',
    },
    {
      question: 'Who is Geoplox built for?',
      answer:
        'Geoplox serves developers, property owners, investors, real estate professionals, service providers, and institutions who require better visibility, credible information, and structured coordination within the real estate ecosystem.',
    },
    {
      question: 'How does Geoplox add value if it does not advise or transact?',
      answer:
        'Geoplox adds value by organizing information, improving transparency, and enabling efficient collaboration. By reducing information gaps and coordination friction, we help stakeholders operate with greater clarity and confidence.',
    },
    {
      question: 'Is Geoplox a replacement for brokers, lawyers, or consultants?',
      answer:
        'No. Geoplox is designed to complement existing roles, not replace them. Brokers, lawyers, consultants, and other professionals continue to perform their specialized functions while Geoplox provides the infrastructure that supports their work.',
    },
    {
      question: 'How does Geoplox support trust between stakeholders?',
      answer:
        'Geoplox introduces structured data standards, documentation, and verification frameworks that improve credibility and reduce ambiguity, enabling stakeholders to engage with greater confidence.',
    },
    {
      question: 'Does Geoplox participate in negotiations or decision-making?',
      answer:
        'No. Geoplox does not participate in negotiations or influence decisions. All commercial terms, agreements, and outcomes are determined solely by the involved parties.',
    },
    {
      question: 'Is Geoplox suitable for both individuals and institutions?',
      answer:
        'Yes. Geoplox is designed to scale across individual professionals, small teams, and large institutions seeking consistent processes and reliable real estate intelligence.',
    },
    {
      question: 'How does Geoplox handle data confidentiality and privacy?',
      answer:
        'Data confidentiality is central to our platform design. Access controls, role-based visibility, and secure information handling ensure that stakeholders only see information relevant to their participation.',
    },
    {
      question: 'How do I contact Geoplox or request onboarding support?',
      answer:
        'You can reach us through the contact form or official communication channels on this page. Our team will guide you through onboarding and explain how Geoplox fits within your role in the ecosystem.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white pt-(--landing-header-height)">
      <Toaster />
      <PageMetaTags
        title="Contact Us"
        description="Get in touch with our team. We're here to help with all your real estate needs across Nigeria."
        keywords="contact geoplox, real estate support, property help Nigeria"
      />
      {/* Get in Touch Section */}
      <section className="landing-container flex w-full flex-col gap-11 pt-[77px] pb-[33px]">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-16">
          {/* Left Side - Contact Info */}
          <div className="flex w-full max-w-[554px] flex-col items-start gap-12">
            <h1 className="text-[50px] leading-[60px] font-semibold tracking-[-0.02em] text-[#1F2130]">Get in Touch</h1>

            <p className="text-[20px] leading-7 text-[#4D5462]">
              If you would prefer to chat in real time with our support team, we are available online every week day.
            </p>

            <div className="flex flex-col items-start gap-[22px]">
              <h2 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">Follow us</h2>
              <div className="flex items-center gap-6">
                <a href="https://www.facebook.com/geoplox" target="_blank" rel="noopener noreferrer">
                  <Facebook className="fill-primary text-primary size-6" />
                </a>
                <a href="https://www.x.com/estateinformant" target="_blank" rel="noopener noreferrer">
                  <Twitter className="fill-primary text-primary size-6" />
                </a>
                <a href="https://www.LinkedIn.com/geoplox" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="fill-primary text-primary size-6" />
                </a>
                <a href="https://www.instagram.com/geoplox" target="_blank" rel="noopener noreferrer">
                  <Instagram className="text-primary size-6" />
                </a>
              </div>
            </div>

            {/* <div className="flex flex-col items-start gap-4 self-stretch">
              <h2 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
                Our Address
              </h2>

              <p className="text-[20px] leading-7 text-[#4D5462]">
                Plot 8, Block A9, Wole Olateju Crescent, Off Admiralty Way Eti-Osa, Lekki Phase 1
              </p>
            </div> */}

            <div className="flex flex-col items-start gap-4 self-stretch">
              <h2 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">Contact</h2>
              <div className="text-[20px] leading-7 text-[#4D5462]">
                <p>support@geoplox.com</p>
                <p>info@geoplox.com</p>
                <p>08132950172</p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div
            style={{
              boxShadow:
                '0px 0px 0px 0.516017px #E4E5E9, 0px 0px 0px 1.03203px rgba(228, 229, 233, 0.6), 0px 0px 0px 3.61212px #F9F9FB, 0px 0px 0px 4.12814px #F3F4F7',
            }}
            className="flex w-full flex-col items-center gap-14 rounded-[20px] bg-white px-4 py-8 lg:min-w-[513px] lg:items-start lg:px-12 lg:py-16"
          >
            <img src={assets.logotext} className="h-10 w-[126px]" width={126} height={40} alt="logo" />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full shrink-0 flex-col items-start gap-11 self-stretch"
              >
                <div className="flex w-full flex-col items-start gap-6 self-stretch">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Full Name
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="Femi Idowu"
                            {...field}
                            className="h-10 self-stretch rounded-xl border-[#D5D5DD] px-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="rene_realty@forbes.com"
                            {...field}
                            className="h-10 self-stretch rounded-xl border-[#D5D5DD] px-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+234 807 6775"
                            {...field}
                            className="h-10 self-stretch rounded-xl border-[#D5D5DD] px-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Hi. Would like to check the availability the property. Please acknowledge. Thank you!"
                            {...field}
                            className="min-h-[84px] resize-none rounded-xl border-[#D5D5DD] px-3"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  style={{
                    background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                    boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                  }}
                  className="h-12 self-stretch rounded-[40px] border border-[oklch(0.235_0_0/50%)] p-4 text-[16px] leading-[19px] font-semibold text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  {isPending ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="flex w-full bg-white py-16">
        <div className="landing-container w-full">
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-[67px]">
            <h2 className="text-[38px] leading-[60px] font-semibold tracking-[-0.02em] text-[#1F2130] lg:text-[50px]">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible defaultValue="item-0" className="w-full gap-6">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-none border-x-0 border-t-0 border-b border-[#DDDDDD] bg-white"
                >
                  <AccordionTrigger
                    icon={CirclePlus}
                    className="py-6 text-[18px] leading-[21px] font-semibold text-[#060807] hover:no-underline"
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-[14px] leading-5 text-[#787878]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
