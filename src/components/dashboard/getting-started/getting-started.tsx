'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import * as z from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FormAccountType from './form-account-type';
import PersonalInfo from './personal-info';
import BusinessInfo from './business-info';
import KYCDocuments from './kyc-documents';
import Subscription from './subscription';
import CompleteOnboarding from './complete-onboarding';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserOnboardingStatus } from '@/hooks/use-user-onboarding-status';
import { useNavigate } from '@tanstack/react-router';
import { customResolver } from '@/lib/customZodResolver';
import { PageMetaTags } from '@/components/page-meta-data';

// Account types
type AccountType = 'developer' | 'agent' | 'client' | 'property-owner';

// Step definitions for each account type
const STEP_FLOWS = {
  developer: ['account-type', 'personal-info', 'business-info', 'kyc-documents', 'complete'],
  agent: ['account-type', 'personal-info', 'subscription', 'complete'],
  client: ['account-type', 'personal-info', 'subscription', 'complete'],
  'property-owner': ['account-type', 'personal-info', 'kyc-documents', 'complete'],
};

// Step schemas
const step1Schema = z.object({
  accountType: z.enum(['developer', 'agent', 'client', 'property-owner'], {
    error: 'Please select an account type',
  }),
});

const step2Schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(11, 'Phone number must be 11 digits'),
  whatsappNumber: z.string().min(11, 'WhatsApp number must be 11 digits'),
  homeAddress: z.string().min(1, 'Home address is required'),
  state: z.string().min(1, 'State is required'),
  localGovernment: z.string().min(1, 'Local government is required'),
});

const step3BusinessSchema = z.object({
  businessLogo: z.any().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  businessEmail: z.email('Valid email is required'),
  businessPhone: z.string().min(11, 'Business phone must be 11 digits'),
  businessWhatsapp: z.string().min(11, 'Business WhatsApp must be 11 digits'),
  website: z.string().optional(),
  instagram: z.string().optional(),
  businessAddress: z.string().min(1, 'Business address is required'),
  businessState: z.string().min(1, 'State is required'),
  businessLocalGovernment: z.string().min(1, 'Local government is required'),
});

const step4KYCSchema = z.object({
  cacDocument: z.any().optional(),
  govtIssuedId: z.any().optional(),
});

const step3SubscriptionSchema = z.object({
  plan: z.enum(['basic', 'premium', 'enterprise'], {
    error: 'Please select a subscription plan',
  }),
});

// Combined schema that merges all step schemas
const combinedSchema = step1Schema
  .merge(step2Schema)
  .merge(step3BusinessSchema)
  .merge(step4KYCSchema)
  .merge(step3SubscriptionSchema);

// Step-specific validation schemas
const getStepSchema = (step: string) => {
  switch (step) {
    case 'account-type':
      return step1Schema;
    case 'personal-info':
      return step2Schema;
    case 'business-info':
      return step3BusinessSchema;
    case 'kyc-documents':
      return step4KYCSchema;
    case 'subscription':
      return step3SubscriptionSchema;
    default:
      return z.object({});
  }
};

const GettingStarted = () => {
  const { completeOnboarding } = useUserOnboardingStatus();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState<AccountType>('developer');

  // Single form instance for all steps
  const form = useForm({
    resolver: customResolver(combinedSchema),
    defaultValues: {
      accountType: 'developer',
      plan: 'basic',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  // Get current step flow based on account type
  const getStepFlow = () => {
    if (!accountType) return ['account-type'];
    return STEP_FLOWS[accountType];
  };

  const stepFlow = getStepFlow();
  const currentStepKey = stepFlow[currentStep];

  const goToNextStep = async () => {
    const stepSchema = getStepSchema(currentStepKey);
    const stepFields = Object.keys(stepSchema.shape) as (keyof typeof stepSchema.shape)[];

    // Trigger validation for current step fields only
    const isValid = await form.trigger(stepFields);

    if (isValid && currentStep < stepFlow.length - 1) {
      // Update account type if we're on account-type step
      if (currentStepKey === 'account-type') {
        const newAccountType = form.getValues('accountType');
        if (newAccountType && newAccountType !== accountType) {
          setAccountType(newAccountType);
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step completion status
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  // Step titles
  const getStepTitle = (step: string) => {
    switch (step) {
      case 'account-type':
        return 'Account Type';
      case 'personal-info':
        return 'Personal Information';
      case 'business-info':
        return 'Business Information';
      case 'kyc-documents':
        return 'KYC Documents';
      case 'subscription':
        return 'Subscription';
      case 'complete':
        return 'Complete Onboarding';
      default:
        return '';
    }
  };

  // Step indicator component for mobile
  const StepIndicator = ({ step, status }: { step: string; index: number; status: string }) => {
    const stepTitle = getStepTitle(step);

    const indicatorContent = (
      <div
        className={cn(
          'h-1 grow rounded-full transition-colors',
          status === 'completed' && 'bg-[#D4AF36]',
          status === 'current' && 'bg-[#D4AF36]',
          status === 'upcoming' && 'bg-[#E3E3E8]'
        )}
      />
    );

    // Use Tooltip for mobile (better for touch devices)
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{indicatorContent}</TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              {status === 'completed' && <CheckCircle2 className="h-4 w-4 text-[#D4AF36]" />}
              <span className="text-sm font-medium">{stepTitle}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Step card component for desktop sidebar
  const StepCard = ({ step, status }: { step: string; index: number; status: string }) => (
    <div
      className={cn(
        'flex items-center justify-between gap-4 self-stretch rounded-[5px] p-6',
        status === 'current' && 'bg-[#FBF7EB]',
        status === 'completed' && 'bg-[#FBF7EB]',
        status === 'upcoming' && 'bg-[#F8F8F8]'
      )}
    >
      <span className="text-[16px] leading-[19px] font-semibold text-[#4E4E4E]">{getStepTitle(step)}</span>
      {status === 'completed' && <CheckCircle2 className="fill-primary size-4 text-white" />}
    </div>
  );

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStepKey) {
      case 'account-type':
        return <FormAccountType form={form} />;

      case 'personal-info':
        return <PersonalInfo form={form} />;

      case 'business-info':
        return <BusinessInfo form={form} />;

      case 'kyc-documents':
        return <KYCDocuments form={form} />;

      case 'subscription':
        return <Subscription form={form} />;

      case 'complete':
        return <CompleteOnboarding form={form} goToPreviousStep={goToPreviousStep} />;

      default:
        return null;
    }
  };

  const handleFinalSubmit = () => {
    console.log('Final form data:', form.getValues());
    completeOnboarding();
    navigate({ to: '/dashboard' });
    // Handle final submission logic here
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStepKey === 'complete') {
      handleFinalSubmit();
      return;
    }
    goToNextStep();
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <PageMetaTags
        title="Getting Started Guide"
        description="Learn how to use Geoplox effectively. Complete setup guide for new users and property managers."
        keywords="getting started, user onboarding, geoplox tutorial"
      />
      <div className="w-full">
        <div className="flex w-full flex-col lg:flex-row">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden w-full shrink-0 flex-col gap-8 border-r border-[#F1F1F4] px-5 py-8 lg:flex lg:w-[447px] lg:px-6">
            <div className="flex flex-col items-start gap-3">
              <h2 className="text-[24px] leading-[29px] font-semibold text-[#4E4E4E]">Hi, Rene Forbes</h2>
              <p className="text-[14px] leading-[20px] text-[#71748C]">
                Just a few steps left to finish setting up your account.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3">
              {stepFlow.map((step, index) => {
                const status = getStepStatus(index);
                return <StepCard key={step} step={step} index={index} status={status} />;
              })}
            </div>
          </div>

          {/* Mobile Header - Visible only on mobile */}
          <div className="flex w-full flex-col gap-4 border-b border-[#F1F1F4] py-6 lg:hidden">
            <div className="flex w-full flex-col gap-10">
              <h2 className="text-[24px] font-semibold text-[#4E4E4E]">Get Started</h2>
              <div className="flex w-full flex-col gap-3">
                <p className="text-[24px] text-[#4E4E4E]">Hi, Rene Forbes</p>
                <p className="text-[14px] text-[#71748C]">Just a few steps left to finish setting up your account.</p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex w-full items-center justify-center gap-2">
              {stepFlow.map((step, index) => {
                const status = getStepStatus(index);
                return <StepIndicator key={step} step={step} index={index} status={status} />;
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto w-full max-w-[560px] flex-1 py-8">
            <Form {...form}>
              <form onSubmit={handleContinue} className="space-y-8">
                {renderStepContent()}

                {currentStepKey !== 'complete' && (
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={currentStep === 0}
                      className={cn(
                        'h-12 flex-1 rounded-full border-[#E3E3E8] bg-transparent',
                        currentStep === 0 && 'hidden'
                      )}
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
                      Continue
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
