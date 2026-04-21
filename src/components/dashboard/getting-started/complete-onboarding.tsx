import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import LoadingFallback from "@/components/loading-fallback";
import { useGetOnboardingSummary } from "@/lib/services";
import React, { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useGetProfileData } from "@/lib/services/profile";

interface CompleteOnboardingProps {
  form: UseFormReturn<any>;
  goToPreviousStep: () => void;
}

const CompleteOnboarding: React.FC<CompleteOnboardingProps> = () => {
  const { data: profileData } = useGetProfileData();
  const isCompleted = useMemo(() => profileData?.onboarding_status === "completed", [profileData]);

  const { data: summaryData, isPending } = useGetOnboardingSummary({ enabled: !isCompleted });
  const summary = summaryData?.data?.data;

  const hasDocuments = useMemo(() => {
    if (!summary) return false;
    const cac = summary.business?.cac;
    const govId = summary.government_id_doc_url;
    const hasCac = typeof cac === "string" && cac.trim() !== "";
    const hasGovId = typeof govId === "string" && govId.trim() !== "";
    return hasCac || hasGovId;
  }, [summary]);

  if (isPending) {
    return <LoadingFallback />;
  }

  if (!summary) {
    return <div className="text-center">Could not load onboarding summary. Please try again.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">
          Complete Onboarding
        </h2>
        <p className="text-[14px]/5 text-[#71748C]">
          Review your account information before submitting
        </p>
      </div>

      {(summary.business?.logo_url || summary.display_picture_url) && (
        <div className="flex items-center justify-center self-stretch border-b border-[#F1F1F4] pb-8">
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#D5D5DD]">
            {(summary.business?.logo_url || summary.display_picture_url) && (
              <img
                src={summary.business?.logo_url || summary.display_picture_url}
                alt="Profile or Business Logo"
                className="size-full object-cover"
              />
            )}
          </div>
        </div>
      )}

      <div className="flex w-full flex-col gap-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Account Type</label>
              <p className="text-[14px] text-[#1F2130] capitalize">
                {summary.user_role?.replace("_", " ")}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Full Name</label>
              <p className="text-[14px] text-[#1F2130]">
                {summary.firstname} {summary.lastname}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">
                Personal Phone Number
              </label>
              <p className="text-[14px] text-[#1F2130]">{summary.phone_number}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">
                Personal Whatsapp Number
              </label>
              <p className="text-[14px] text-[#1F2130]">{summary.whatsapp_number}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-[#41415A]">Home Address</label>
            <p className="text-[14px] text-[#1F2130]">
              {summary.home_address}, {summary.local_gov_area}, {summary.state}
            </p>
          </div>
        </div>

        {/* Business Information Section (if applicable) */}
        {(summary.user_role === "developer" || summary.user_role === "owner") &&
          summary.business && (
            <div className="space-y-4 border-t border-[#F1F1F4] pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">Business Name</label>
                  <p className="text-[14px] text-[#1F2130]">{summary.business.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">
                    Business Email Address
                  </label>
                  <p className="text-[14px] text-[#1F2130]">{summary.business.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">
                    Business Phone Number
                  </label>
                  <p className="text-[14px] text-[#1F2130]">{summary.business.phone}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">
                    Business Whatsapp Number
                  </label>
                  <p className="text-[14px] text-[#1F2130]">{summary.business.whatsapp}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[14px] font-medium text-[#41415A]">Business Address</label>
                <p className="text-[14px] text-[#1F2130]">
                  {summary.business.address}, {summary.business.lga}, {summary.business.state}
                </p>
              </div>
            </div>
          )}

        {/* Subscription Plan (if applicable) */}
        {(summary.user_role === "agent" || summary.user_role === "client") && summary.plan && (
          <div className="space-y-4 border-t border-[#F1F1F4] pt-6">
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Subscription Plan</label>
              <p className="text-[14px] text-[#1F2130] capitalize">{summary.plan.plan.name}</p>
            </div>
          </div>
        )}

        {/* Documents Section (if applicable) */}
        {summary.user_role !== "client" && hasDocuments && (
          <div className="space-y-4 border-t border-[#F1F1F4] pt-6">
            <h3 className="text-[16px] font-semibold text-[#1F2130]">Uploaded Documents</h3>
            {summary.business?.cac && (
              <div className="space-y-1">
                <label className="text-[14px] font-medium text-[#41415A]">CAC Document</label>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-gray-500" />
                  <p className="text-[14px] text-[#1F2130]">
                    {summary.business.cac.split("/").pop()}
                  </p>
                </div>
              </div>
            )}
            {summary.government_id_doc_url && (
              <div className="space-y-1">
                <label className="text-[14px] font-medium text-[#41415A]">
                  {summary.user_role === "owner"
                    ? "Proof of Identity"
                    : summary.user_role === "developer"
                      ? "Proof of address"
                      : "Government Issued ID"}
                </label>
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-gray-500" />
                  <p className="text-[14px] text-[#1F2130]">
                    {summary.government_id_doc_url.split("/").pop()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button
          style={{
            background: "linear-gradient(180deg, #D4AF36 0%, #B69118 60%)",
            boxShadow:
              "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
          }}
          type="submit"
          className="h-12 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] font-semibold text-white"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CompleteOnboarding;
