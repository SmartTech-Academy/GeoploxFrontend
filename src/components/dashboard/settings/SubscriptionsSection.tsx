import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UpgradePlanDialog } from '@/components/dialogs/upgrade-plan-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetBillingInfo } from '@/lib/services/profile';
import { format } from 'date-fns';

const SubscriptionsSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data: billingInfo, isPending: isBillingLoading } = useGetBillingInfo();

  const currentPlan = billingInfo?.currentPlan;
  const subscription = billingInfo?.summary;
  const billHistory = billingInfo?.payments || [];

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Subscription</h2>
        <p className="text-[14px]/5  text-[#71748C]">Manage your subscription and billing</p>
      </div>

      <div className="flex w-full flex-col gap-8">
        {/* Current Plan Section */}
        {isBillingLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="flex flex-col items-start gap-5 self-stretch border-b border-[#F1F1F4] pb-8">
            <div className="box-border flex items-center justify-between gap-4 self-stretch rounded-[10px] border border-[#E3E3E8] bg-white px-5 py-6">
              {currentPlan ? (
                <div className="flex grow flex-col items-start gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[16px]/4  font-semibold tracking-[-0.02em] text-[#282828]">
                      {currentPlan.name} Plan
                    </h3>
                    {subscription?.next_renewal && (
                      <span className="rounded-sm bg-[oklch(0.7665_0.1393_91.15/5%)] px-2 py-1 text-[12px]/3  text-[#D4AF36]">
                        Active Plan
                      </span>
                    )}
                  </div>
                  <p className="text-[14px]/5  text-[#71748C]">
                    {subscription?.next_renewal
                      ? `Expires on ${new Date(subscription.next_renewal).toLocaleDateString()}`
                      : 'Plan Inactive'}
                  </p>
                </div>
              ) : (
                <p className="text-[14px]/5  text-[#71748C]">You are not subscribed to any plan.</p>
              )}

              <Button
                onClick={() => setOpenModal(true)}
                style={{
                  background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',

                  boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                }}
                className="h-10 rounded-4xl p-4 text-[14px] leading-[17px] font-semibold text-white"
                size="sm"
              >
                {currentPlan ? 'Upgrade' : 'Subscribe'}
              </Button>
            </div>
          </div>
        )}

        {/* Bill History Section */}
        <div className="flex flex-col items-start gap-2 self-stretch">
          <h3 className="text-[16px]/5  font-semibold text-[#1F2130]">Bill History</h3>

          <div className="flex w-full flex-col bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-[#F1F1F4]">
              <span className="px-4 py-3 text-[12px] font-normal text-[#71748C]">Date</span>
              <span className="px-4 py-3 text-[12px] font-normal text-[#71748C]">Description</span>
              <span className="w-full px-4 py-3 text-right text-[12px] font-normal text-[#71748C]">Amount</span>
            </div>

            {/* Table Rows */}
            {billHistory.map((item, index) => (
              <div key={item.id} className={`grid w-full grid-cols-3 ${index % 2 === 0 ? 'bg-[#F8F8F8]' : ''}`}>
                <span className="px-4 py-[18px] text-[14px]/4  text-[#41415A]">
                  {format(new Date(item.paid_at), 'dd MMM, yyyy')}
                </span>
                <span className="px-4 py-[18px] text-[14px]/4  text-[#41415A]">{item.plan_name} Plan</span>
                <span className="px-4 py-[18px] text-right text-[14px]/4  text-[#41415A]">
                  {new Intl.NumberFormat('en-NG', { style: 'currency', currency: item.currency }).format(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UpgradePlanDialog open={openModal} onOpenChange={setOpenModal} />
    </div>
  );
};

export default SubscriptionsSection;
