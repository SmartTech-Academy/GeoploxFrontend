'use client';

import { Button } from '@/components/ui/button';
import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface CompleteOnboardingProps {
  form: UseFormReturn<any>;
  goToPreviousStep: () => void;
}

const CompleteOnboarding: React.FC<CompleteOnboardingProps> = ({ form, goToPreviousStep }) => {
  const formData = form.getValues();

  return (
    <div className="flex w-full flex-col gap-10 bg-white pt-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Complete Onboarding</h2>
        <p className="text-[14px] leading-[20px] text-[#71748C]">Review your account information before submitting</p>
      </div>

      {/* Business Logo Display */}
      {formData.businessLogo && (
        <div className="flex items-center justify-center self-stretch border-b border-[#F1F1F4] pb-8">
          <div className="flex size-[64px] items-center justify-center overflow-hidden rounded-full border-2 border-[#D5D5DD]">
            <img
              src={URL.createObjectURL(formData.businessLogo) || '/placeholder.svg'}
              alt="Business Logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="flex w-full flex-col gap-6">
        {/* Personal Information Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Account Type</label>
              <p className="text-[14px] text-[#1F2130] capitalize">{formData.accountType?.replace('-', ' ')}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Full Name</label>
              <p className="text-[14px] text-[#1F2130]">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Personal Phone Number</label>
              <p className="text-[14px] text-[#1F2130]">{formData.phoneNumber}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Personal Whatsapp Number</label>
              <p className="text-[14px] text-[#1F2130]">{formData.whatsappNumber}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[14px] font-medium text-[#41415A]">Home Address</label>
            <p className="text-[14px] text-[#1F2130]">
              {formData.homeAddress}, {formData.localGovernment}, {formData.state}
            </p>
          </div>
        </div>

        {/* Business Information Section (if applicable) */}
        {(formData.accountType === 'developer' || formData.accountType === 'property-owner') &&
          formData.businessName && (
            <div className="space-y-4 border-t border-[#F1F1F4] pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">Business Name</label>
                  <p className="text-[14px] text-[#1F2130]">{formData.businessName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">Business Email Address</label>
                  <p className="text-[14px] text-[#1F2130]">{formData.businessEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">Business Phone Number</label>
                  <p className="text-[14px] text-[#1F2130]">{formData.businessPhone}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[14px] font-medium text-[#41415A]">Business Whatsapp Number</label>
                  <p className="text-[14px] text-[#1F2130]">{formData.businessWhatsapp}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[14px] font-medium text-[#41415A]">Business Address</label>
                <p className="text-[14px] text-[#1F2130]">
                  {formData.businessAddress}, {formData.businessLocalGovernment}, {formData.businessState}
                </p>
              </div>
            </div>
          )}

        {/* Subscription Plan (if applicable) */}
        {(formData.accountType === 'agent' || formData.accountType === 'client') && formData.plan && (
          <div className="space-y-4 border-t border-[#F1F1F4] pt-6">
            <div className="space-y-1">
              <label className="text-[14px] font-medium text-[#41415A]">Selected Plan</label>
              <p className="text-[14px] text-[#1F2130] capitalize">{formData.plan}</p>
            </div>
          </div>
        )}

        {/* Documents Section (if applicable) */}
        {(formData.cacDocument || formData.govtIssuedId) && (
          <div className="space-y-4 border-t border-[#F1F1F4] pt-6">
            <h3 className="text-[16px] font-semibold text-[#1F2130]">Uploaded Documents</h3>
            {formData.cacDocument && (
              <div className="space-y-1">
                <label className="text-[14px] font-medium text-[#41415A]">CAC Document</label>
                <p className="text-[14px] text-[#1F2130]">{formData.cacDocument.name}</p>
              </div>
            )}
            {formData.govtIssuedId && (
              <div className="space-y-1">
                <label className="text-[14px] font-medium text-[#41415A]">Government Issued ID</label>
                <p className="text-[14px] text-[#1F2130]">{formData.govtIssuedId.name}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex-1 rounded-full border-[#E3E3E8] bg-transparent"
          onClick={goToPreviousStep}
        >
          Back
        </Button>
        <Button
          style={{
            background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
            boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
          }}
          type="submit"
          className="h-12 flex-1 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] font-semibold text-white"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CompleteOnboarding;
