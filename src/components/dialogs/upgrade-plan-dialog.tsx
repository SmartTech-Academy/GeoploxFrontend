import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useGetPlans, useSubscribeToPlan } from "@/lib/services";
import { toast } from "sonner";
import LoadingFallback from "../loading-fallback";
import { Check } from "lucide-react";
import { customResolver } from "@/lib/customZodResolver";

const subscriptionSchema = z.object({
  plan: z.string({ error: "Please select a plan." }),
  duration_months: z.number().min(1),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface UpgradePlanDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export const UpgradePlanDialog: React.FC<UpgradePlanDialogProps> = ({ open, onOpenChange }) => {
  const { mutate: subscribeToPlan, isPending: isSubscribing } = useSubscribeToPlan();
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const { data: plansResponse, isPending: isLoadingPlans } = useGetPlans();

  // Filter out the basic plan for the upgrade dialog
  const plansData = plansResponse?.data.data;
  const upgradeablePlans = plansData
    ? [plansData.basic, plansData.premium, plansData.enterprise]
    : [];
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const currentPlanData = upgradeablePlans[currentPlanIndex];

  const form = useForm<SubscriptionFormData>({
    resolver: customResolver(subscriptionSchema),
    defaultValues: {
      plan: String(upgradeablePlans[0]?.id),
      duration_months: 1,
    },
  });

  useEffect(() => {
    form.setValue("duration_months", billingCycle === "Monthly" ? 1 : 12);
  }, [billingCycle, form]);

  useEffect(() => {
    // Update the form value when the selected plan changes
    form.setValue("plan", String(currentPlanData?.id));
  }, [currentPlanData, form]);

  const onSubmit = (data: SubscriptionFormData) => {
    subscribeToPlan(
      { plan_id: data.plan, duration_months: data.duration_months },
      {
        onSuccess: () => {
          toast.success("Subscription updated successfully!");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="text-2xl">Upgrade Your Plan</DialogTitle>
          <DialogDescription className="max-w-sm">
            Your current plan has limitations. Choose a new plan to unlock more features and grow
            with us.
          </DialogDescription>
        </DialogHeader>
        {isLoadingPlans ? (
          <LoadingFallback />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="mx-auto w-fit overflow-hidden rounded-xl border border-[#F1F1F4] bg-white p-1.5">
                <div className="scrollbar-hide flex w-full items-center gap-3 overflow-x-auto">
                  {["Monthly", "Annually"].map((tab) => (
                    <Button
                      key={tab}
                      type="button"
                      variant={billingCycle === tab ? "default" : "outline"}
                      className={`h-[33px] rounded-[6px] px-3 py-[11px] text-[14px] leading-[21px] text-[#41415A] transition-all duration-300 ease-in-out ${
                        billingCycle === tab
                          ? "border border-[#D5D5DD] bg-white font-semibold"
                          : "border-none bg-[#F9F9FB]"
                      }`}
                      onClick={() => setBillingCycle(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Plan Content */}
              <div className="w-full">
                <div
                  key={currentPlanIndex} // forces re-mount on switch
                  className="mb-4 animate-in rounded-lg bg-[#F8F6F0] p-4 fade-in-50 slide-in-from-bottom-4"
                >
                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[#1F2130]">
                      {currentPlanData.price.split("/")[0]}
                    </span>
                    <span className="text-lg text-[#6B7280]">
                      /{currentPlanData.price.split("/")[1]}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {currentPlanData.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="mt-0.5 size-5 shrink-0 text-[#D4B04A]" />
                        <span className="text-sm/5 text-[#6B7280]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Indicators */}
                <div className="mb-6 flex justify-center gap-2">
                  {upgradeablePlans.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentPlanIndex(index)}
                      className={`size-2 rounded-full transition-all duration-200 ${
                        currentPlanIndex === index ? "scale-110 bg-[#1F2130]" : "bg-[#D1D5DB]"
                      }`}
                      aria-label={`Select ${upgradeablePlans[index].name} plan`}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <Button
                type="submit"
                className="h-12 w-full rounded-[40px]"
                disabled={isSubscribing}
                style={{
                  background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                  boxShadow:
                    "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                }}
              >
                {isSubscribing ? "Subscribing..." : `Upgrade to ${currentPlanData.name}`}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
