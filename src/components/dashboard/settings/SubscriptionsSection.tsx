import TrialExpired from '@/components/dialogs/trial-expired';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SubscriptionsSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const billHistory = [
    { date: '12 Mar, 2025', description: 'Premium Plan, Monthly', amount: '₦10,000/Month' },
    { date: '12 Mar, 2025', description: 'Premium Plan, Monthly', amount: '₦10,000/Month' },
    { date: '12 Mar, 2025', description: 'Premium Plan, Monthly', amount: '₦10,000/Month' },
    { date: '12 Mar, 2025', description: 'Premium Plan, Monthly', amount: '₦10,000/Month' },
    { date: '12 Mar, 2025', description: 'Premium Plan, Monthly', amount: '₦10,000/Month' },
    { date: '12 Mar, 2025', description: 'Premium Plan, Monthly', amount: '₦10,000/Month' },
    { date: '12 Mar, 2025', description: 'Premium Plan, Monthly', amount: '₦10,000/Month' },
  ];

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Subscription</h2>
        <p className="text-[14px] leading-[20px] text-[#71748C]">Manage your subscription and billing</p>
      </div>

      <div className="flex w-full flex-col gap-8">
        {/* Current Plan Section */}
        <div className="flex flex-col items-start gap-5 self-stretch border-b border-[#F1F1F4] pb-8">
          <div className="box-border flex items-center justify-between gap-4 self-stretch rounded-[10px] border border-[#E3E3E8] bg-white px-5 py-6">
            <div className="flex grow flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                <h3 className="text-[16px] leading-[16px] tracking-[-0.02em] text-[#282828]">Basic Plan</h3>

                <span className="rounded-[4px] bg-[oklch(0.7665_0.1393_91.15_/_5%)] px-2 py-1 text-[12px] leading-[12px] text-[#D4AF36]">
                  Active Plan
                </span>
              </div>
              <p className="text-[14px] leading-[20px] text-[#71748C]">Free for 14 Days</p>
            </div>
            <Button
              onClick={() => setOpenModal(true)}
              style={{
                background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',

                boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
              }}
              className="h-10 rounded-[32px] p-4 text-[14px] leading-[17px] font-semibold text-white"
              size="sm"
            >
              Upgrade
            </Button>
          </div>
        </div>

        {/* Bill History Section */}
        <div className="flex flex-col items-start gap-2 self-stretch">
          <h3 className="text-[16px] leading-[20px] font-semibold text-[#1F2130]">Bill History</h3>

          <div className="flex w-full flex-col bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-[#F1F1F4]">
              <span className="px-4 py-3 text-[12px] font-normal text-[#71748C]">Date</span>
              <span className="px-4 py-3 text-[12px] font-normal text-[#71748C]">Description</span>
              <span className="w-full px-4 py-3 text-right text-[12px] font-normal text-[#71748C]">Amount</span>
            </div>

            {/* Table Rows */}
            {billHistory.map((item, index) => (
              <div key={index} className={`grid w-full grid-cols-3 ${index % 2 === 0 ? 'bg-[#F8F8F8]' : ''}`}>
                <span className="px-4 py-[18px] text-[14px] leading-[16px] text-[#41415A]">{item.date}</span>
                <span className="px-4 py-[18px] text-[14px] leading-[16px] text-[#41415A]">{item.description}</span>
                <span className="px-4 py-[18px] text-right text-[14px] leading-[16px] text-[#41415A]">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TrialExpired open={openModal} setOpen={setOpenModal} />
    </div>
  );
};

export default SubscriptionsSection;
