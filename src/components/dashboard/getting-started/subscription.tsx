'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface SubscriptionProps {
  form: UseFormReturn<any>;
}

const Subscription: React.FC<SubscriptionProps> = ({ form }) => {
  console.log(form.watch());
  const plans = [
    {
      value: 'basic',
      name: 'Basic Plan',
      description: 'Free for 14 Days',
      price: 'Free',
      period: '',
      buttonText: 'Get Started',
      buttonVariant: 'default' as const,
      isRecommended: false,
      hasCheckmark: true,
    },
    {
      value: 'premium',
      name: 'Premium Plan',
      description: '25+ Active Listings',
      price: '₦10,000',
      period: '/Month',
      buttonText: 'Get Premium',
      buttonVariant: 'outline' as const,
      isRecommended: true,
      hasCheckmark: false,
    },
    {
      value: 'enterprise',
      name: 'Enterprise Plan',
      description: '100+ Active Listings',
      price: '₦50,000',
      period: '/Month',
      buttonText: 'Get Enterprise',
      buttonVariant: 'outline' as const,
      isRecommended: false,
      hasCheckmark: false,
    },
  ];

  const handlePayment = (plan: (typeof plans)[0]) => {
    if (plan.value === 'basic') {
      // No payment needed for basic plan
      return;
    }

    // Initialize Paystack payment
    const handler = (window as any).PaystackPop?.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: form.getValues('email') || 'user@example.com',
      amount: plan.value === 'premium' ? 1000000 : 5000000, // Amount in kobo
      currency: 'NGN',
      ref: `${plan.value}_${Date.now()}`,
      callback: (response: any) => {
        console.log('[v0] Payment successful:', response);
        // Handle successful payment
        form.setValue('plan', plan.value);
        alert('Payment successful!');
      },
      onClose: () => {
        console.log('[v0] Payment modal closed');
      },
    });

    if (handler) {
      handler.openIframe();
    } else {
      console.error('[v0] Paystack not loaded');
      alert('Payment system not available. Please try again later.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Subscription</h2>
        <p className="text-[14px] leading-[20px] text-[#71748C]">Flexible pricing tailored for you.</p>
      </div>

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="grid gap-4">
                {plans.map((plan) => (
                  <FormItem key={plan.value} className="space-y-0">
                    <FormControl>
                      <RadioGroupItem value={plan.value} id={plan.value} className="peer sr-only" />
                    </FormControl>
                    <div
                      className={cn(
                        'relative rounded-lg border-2 p-6 transition-all',
                        form.getValues().plan === plan.value
                          ? 'border-[#D4AF36] bg-[#FFF9E6]'
                          : 'border-[#E3E3E8] bg-white hover:border-[#D4AF36]'
                      )}
                    >
                      {form.getValues().plan === plan.value && (
                        <div className="absolute -top-4 -right-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF36]">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}

                      <label htmlFor={plan.value} className="cursor-pointer">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                              <h3 className="text-[20px] leading-[28px] font-semibold text-[#1F2130]">{plan.name}</h3>
                              {plan.isRecommended && (
                                <span className="rounded bg-[oklch(0.7665_0.1393_91.15_/_5%)] px-2 py-1.5 text-[12px] font-semibold text-[#D4AF36]">
                                  Recommended
                                </span>
                              )}
                            </div>

                            <p className="text-[14px] leading-[20px] text-[#71748C]">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[28px] leading-[40px] font-semibold text-[#1F2130]">
                              {plan.price}
                            </span>

                            {plan.period && <span className="text-[#71748C]">{plan.period}</span>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Button
                            type="button"
                            variant={plan.buttonVariant}
                            style={{
                              background:
                                plan.value === 'basic'
                                  ? 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)'
                                  : 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                              boxShadow:
                                plan.value === 'basic'
                                  ? '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)'
                                  : '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                            }}
                            onClick={() => handlePayment(plan)}
                            className={cn(
                              'w-fit rounded-full border font-semibold text-white hover:text-white',
                              plan.value !== 'basic'
                                ? 'border-[oklch(0.235_0_0_/_50%)]'
                                : 'border-[oklch(0.7665_0.1393_91.15_/_50%)]'
                            )}
                          >
                            {plan.buttonText}
                          </Button>

                          {plan.value !== 'basic' && (
                            <button
                              type="button"
                              className="text-sm font-medium text-[#D4AF36] underline hover:no-underline"
                            >
                              Learn about plan
                            </button>
                          )}
                        </div>
                      </label>
                    </div>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Subscription;
