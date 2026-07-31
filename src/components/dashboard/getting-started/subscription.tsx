import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetPlans } from "@/lib/services";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import LoadingFallback from "@/components/loading-fallback";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

interface SubscriptionProps {
  form: UseFormReturn<any>;
}

const Subscription: React.FC<SubscriptionProps> = ({ form }) => {
  const { data: plansResponse, isPending: isLoadingPlans } = useGetPlans();

  const plansData = plansResponse?.data.data;
  const plans = plansData ? [plansData.basic, plansData.premium, plansData.enterprise] : [];

  useEffect(() => {
    form.setValue("duration_months", 1);
  }, [form]);

  if (isLoadingPlans) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Subscription</h2>
        <p className="text-[14px]/5 text-[#71748C]">Flexible pricing tailored for you.</p>
      </div>

      {/* Billing cycle removed — fixed to 1 month by default */}

      <FormField
        control={form.control}
        name="plan"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormControl>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="grid gap-4">
                {plans.map((plan) => {
                  const isBasic = plan.name?.toLowerCase() === "basic";
                  const isDisabled = !isBasic;

                  return (
                    <FormItem key={plan.id} className="relative space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value={String(plan.id)}
                          id={String(plan.id)}
                          className="peer sr-only"
                          disabled={isDisabled}
                        />
                      </FormControl>
                      <div
                        className={cn(
                          "relative rounded-lg border-2 p-6 transition-all",
                          isDisabled
                            ? "cursor-not-allowed border-[#E3E3E8] bg-[#F7F7F9] opacity-50"
                            : form.getValues().plan === String(plan.id)
                              ? "border-[#D4AF36] bg-[#FFF9E6]"
                              : "border-[#E3E3E8] bg-white hover:border-[#D4AF36]",
                        )}
                      >
                        {!isDisabled && form.getValues().plan === String(plan.id) && (
                          <div className="absolute -top-4 -right-2">
                            <div className="flex size-6 items-center justify-center rounded-full bg-[#D4AF36]">
                              <Check className="size-4 text-white" />
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

                        <label
                          htmlFor={String(plan.id)}
                          className={cn("cursor-pointer", isDisabled && "cursor-not-allowed")}
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className="text-[20px]/7 font-semibold text-[#1F2130]">
                                  {plan.name}
                                </h3>
                                {isDisabled && (
                                  <span className="rounded-full bg-[#E3E3E8] px-2 py-0.5 text-[11px] font-medium text-[#71748C]">
                                    Coming Soon
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[28px] leading-[40px] font-semibold text-[#1F2130]">
                                {plan.price ?? "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              disabled={isDisabled}
                              className="w-fit rounded-full font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Get {plan.name}
                            </Button>
                          </div>
                        </label>
                      </div>
                    </FormItem>
                  );
                })}
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
