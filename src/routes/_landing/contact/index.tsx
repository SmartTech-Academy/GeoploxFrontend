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
    mode: 'onTouched',
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
      question: 'Is Geoplox an Estate Agent?',
      answer:
        "Nigeria Property Centre is not itself an Estate Agent. We only display the properties provided to us. We recommend that you contact the estate agent or developer who is marketing the property if you require further information. The agent's contact details are on the property details page.",
    },
    {
      question: "I asked for details on a property but haven't heard anything yet. What should I do?",
      answer:
        "If you haven't received a response within 24-48 hours, please try contacting the property agent directly using the contact information provided on the property listing. You can also reach out to our support team for assistance in connecting with the right agent.",
    },
    {
      question: 'What should I do if I want more information about one of the properties?',
      answer:
        "To get more information about a property, click on the property listing to view full details including photos, specifications, and pricing. You'll find the agent's contact information on the property page to request additional details or schedule a viewing.",
    },
    {
      question: "Why don't all the properties have full details and photos?",
      answer:
        'Property details and photos are provided by the listing agents and developers. Some agents may still be updating their listings or may have different levels of detail available. We encourage all our partners to provide comprehensive information, but the completeness depends on what each agent submits.',
    },
    {
      question: 'Is there any limit to the number of properties I can list?',
      answer:
        'There are different listing packages available depending on your needs. Basic accounts may have limitations, while premium accounts offer expanded listing capabilities. Contact our sales team to discuss the best package for your property portfolio and business requirements.',
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
                <Facebook className="fill-primary text-primary size-6" />
                <Twitter className="fill-primary text-primary size-6" />
                <Linkedin className="fill-primary text-primary size-6" />
                <Instagram className="text-primary size-6" />
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 self-stretch">
              <h2 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
                Our Address
              </h2>

              <p className="text-[20px] leading-7 text-[#4D5462]">
                Plot 8, Block A9, Wole Olateju Crescent, Off Admiralty Way Eti-Osa, Lekki Phase 1
              </p>
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
      <section className="flex w-full items-center bg-white py-16">
        <div className="landing-container">
          <div className="flex w-full flex-col gap-[67px]">
            <h2 className="text-[38px] leading-[60px] font-semibold tracking-[-0.02em] text-[#1F2130] lg:text-[50px]">
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible defaultValue="item-0" className="w-full gap-6 self-stretch">
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
