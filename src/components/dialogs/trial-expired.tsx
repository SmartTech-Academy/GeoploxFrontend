import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const TrialExpired: React.FC<Props> = ({ setOpen, open }) => {
  const [currentPlan, setCurrentPlan] = useState(0); // 0 for Premium, 1 for Enterprise

  const plans = [
    {
      title: "Premium Plan",
      price: "₦10,000",
      period: "/Month",
      recommended: true,
      features: [
        "Unlimited Property Browsing",
        "Full Listing Details",
        "Access to Contact Info of Property Owners/Developers",
        "On-Platform Messaging",
        "Analytics Dashboard",
        "Email Notifications for New Listings in Preferred Areas",
        "Priority & Email Support",
      ],
      buttonText: "Upgrade to Premium",
    },
    {
      title: "Enterprise Plan",
      price: "₦20,000",
      period: "/Month",
      recommended: false,
      features: [
        "Unlimited property browsing",
        "Full listing details",
        "Access to Contact Info of Property Owners/Developers",
        "Downloadable Unwatermarked Property Images",
        "On-Platform Messaging",
        "Analytics Dashboard",
        "Email Notifications for New Listings in Preferred Areas",
        "Priority & Dedicated Support",
      ],
      buttonText: "Upgrade to Enterprise",
    },
  ];

  const currentPlanData = plans[currentPlan];

  const handleUpgrade = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentPlanData.title}</DialogTitle>
          {currentPlanData.recommended && (
            <span className="rounded-sm bg-white px-2 py-1 text-xs font-medium text-[#6B7280]">
              Recommended
            </span>
          )}

          <DialogDescription>
            Your 15-day trial has ended. Upgrade to a paid plan to keep using and access even more
            features.
          </DialogDescription>
        </DialogHeader>

        {/* Plan Content */}
        <div className="w-full">
          <div
            key={currentPlan} // forces re-mount on switch
            className="mb-4 animate-in rounded-lg bg-[#F8F6F0] p-4 fade-in-50 slide-in-from-bottom-4"
          >
            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-[#1F2130]">{currentPlanData.price}</span>
              <span className="text-lg text-[#6B7280]">{currentPlanData.period}</span>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {currentPlanData.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-[#D4B04A]" />
                  <span className="text-sm/5 text-[#6B7280]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Indicators */}
          <div className="mb-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPlan(0)}
              className={`size-2 rounded-full transition-all duration-200 ${
                currentPlan === 0 ? "scale-110 bg-[#1F2130]" : "bg-[#D1D5DB]"
              }`}
            />
            <button
              onClick={() => setCurrentPlan(1)}
              className={`size-2 rounded-full transition-all duration-200 ${
                currentPlan === 1 ? "scale-110 bg-[#1F2130]" : "bg-[#D1D5DB]"
              }`}
            />
          </div>
        </div>

        {/* Footer */}
        <div>
          <Button
            onClick={handleUpgrade}
            variant="default"
            style={{
              background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
              boxShadow:
                "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
            }}
            className="h-10 w-full rounded-4xl border border-[oklch(0.235_0_0/50%)] p-4"
          >
            {currentPlanData.buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrialExpired;
