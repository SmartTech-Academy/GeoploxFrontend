'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetPlans } from '@/lib/services';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import LoadingFallback from '@/components/loading-fallback';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useEffect, useState } from 'react';

interface SubscriptionProps {
  form: UseFormReturn<any>;
}

const Subscription: React.FC<SubscriptionProps> = ({ form }) => {
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const { data: plansResponse, isPending: isLoadingPlans } = useGetPlans();

  const plansData = plansResponse?.data.data;
  const plans = plansData ? [plansData.basic, plansData.premium, plansData.enterprise] : [];

  useEffect(() => {
    form.setValue('duration_months', billingCycle === 'Monthly' ? 1 : 12);
  }, [billingCycle, form]);

  if (isLoadingPlans) {
    return <LoadingFallback />;
  }

  const tabs = [
    { name: 'Monthly', icon: '' },
    { name: 'Annually', icon: '' },
  ];

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Subscription</h2>
        <p className="text-[14px] leading-[20px] text-[#71748C]">Flexible pricing tailored for you.</p>
      </div>

      <div className="mx-auto overflow-hidden rounded-[8px] border border-[#F1F1F4] bg-white p-1.5">
        <div className="scrollbar-hide flex w-full items-center gap-3 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              type="button"
              style={{
                boxShadow:
                  billingCycle === tab.name
                    ? '0px 0px 10px rgba(31, 33, 48, 0.06), 0px 1px 1px rgba(31, 33, 48, 0.25), inset 0px 2px 1px rgba(255, 255, 255, 0.7)'
                    : 'none',
              }}
              variant={billingCycle === tab.name ? 'default' : 'outline'}
              className={`h-[33px] rounded-[6px] px-3 py-[11px] text-[14px] leading-[21px] text-[#41415A] transition-all duration-300 ease-in-out ${
                billingCycle === tab.name
                  ? 'border border-[#D5D5DD] bg-white font-semibold'
                  : 'border-none bg-[#F9F9FB]'
              }`}
              onClick={() => setBillingCycle(tab.name)}
            >
              {tab.name} {tab.icon}
            </Button>
          ))}
        </div>
      </div>

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="grid gap-4">
                {plans.map((plan) => (
                  <FormItem key={plan.id} className="relative space-y-0">
                    <FormControl>
                      <RadioGroupItem value={String(plan.id)} id={String(plan.id)} className="peer sr-only" />
                    </FormControl>
                    <div
                      className={cn(
                        'relative rounded-lg border-2 p-6 transition-all',
                        form.getValues().plan === String(plan.id)
                          ? 'border-[#D4AF36] bg-[#FFF9E6]'
                          : 'border-[#E3E3E8] bg-white hover:border-[#D4AF36]'
                      )}
                    >
                      {form.getValues().plan === String(plan.id) && (
                        <div className="absolute -top-4 -right-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF36]">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}

                      {plan.is_recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                          <div className="rounded-full bg-[#1F2130] px-4 py-1 text-[12px] font-medium text-white">
                            Recommended
                          </div>
                        </div>
                      )}

                      <label htmlFor={String(plan.id)} className="cursor-pointer">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                              <h3 className="text-[20px] leading-[28px] font-semibold text-[#1F2130]">{plan.name}</h3>
                            </div>

                            <p className="text-[14px] leading-[20px] text-[#71748C]">
                              {plan.features[plan.features.length - 1]}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[28px] leading-[40px] font-semibold text-[#1F2130]">
                              {plan.price}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Button type="button" variant="outline" className="w-fit rounded-full font-semibold">
                            Get {plan.name}
                          </Button>

                          {plan.name !== 'Basic' && (
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
