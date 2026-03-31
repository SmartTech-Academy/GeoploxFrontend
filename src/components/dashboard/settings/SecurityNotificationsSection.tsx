import ChangePassword from "@/components/dialogs/change-password";
import { Button } from "@/components/ui/button";
// import { Switch } from '@/components/ui/switch';
import { useState } from "react";

const SecurityNotificationsSection = () => {
  const [open, setOpen] = useState(false);
  //   const [notifications, setNotifications] = useState({
  //     emailNotifications: false,
  //     inAppNotifications: true,
  //   });

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-3 self-stretch text-center">
        <h2 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">
          Security & Notifications
        </h2>
        <p className="text-[14px]/5 text-[#71748C]">Update your business details</p>
      </div>

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-start gap-5 self-stretch border-b border-[#F1F1F4] pb-8">
          {/* Password Section */}
          <div className="box-border flex items-start justify-between gap-4 self-stretch rounded-[10px] border border-[#E3E3E8] bg-white px-5 py-6">
            <div className="flex grow flex-col items-start gap-2">
              <h3 className="text-[16px]/4 tracking-[-0.02em] text-[#282828]">Password</h3>

              <p className="text-[14px]/5 text-[#71748C]">Update your password</p>
            </div>
            <Button
              className="h-8 rounded-4xl bg-[#F1F1F4] px-4 py-[15px] text-[14px]/3.5 font-normal text-black"
              variant="secondary"
              size="sm"
              onClick={() => setOpen(true)}
            >
              Change
            </Button>
          </div>

          {/* Two-step Authentication Section */}
          {/* <div className="box-border flex items-start justify-between gap-4 self-stretch rounded-[10px] border border-[#E3E3E8] bg-white px-5 py-6">
            <div className="flex grow flex-col items-start gap-2">
              <h3 className="text-[16px] leading-4 tracking-[-0.02em] text-[#282828]">Two-step authentication</h3>

              <p className="text-[14px] leading-5 text-[#71748C]">
                Verify your identity with an authentication method.
              </p>
            </div>
            <Button
              className="h-8 rounded-4xl bg-[#F1F1F4] px-4 py-[15px] text-[14px] leading-3.5 font-normal text-black"
              variant="secondary"
              size="sm"
            >
              Disable
            </Button>
          </div> */}
        </div>

        {/* Notifications Section */}
        {/* <div className="flex flex-col items-start justify-between gap-7 self-stretch rounded-[10px] border border-[#E3E3E8] bg-white px-5 py-6">
          <div className="flex w-full grow flex-col items-start gap-5">
            <h3 className="text-[16px] leading-4 font-normal tracking-[-0.02em] text-[#282828]">Notifications</h3>

            <div className="flex flex-col items-start gap-3 self-stretch">
              <div className="flex items-center justify-between gap-5 self-stretch border-b border-[#E3E3E8] pb-3">
                <span className="text-[14px] leading-5 text-[#71748C]">Would you like email notifications</span>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between gap-5 self-stretch">
                <span className="text-[14px] leading-5 text-[#71748C]">Would you like in-app notifications</span>
                <Switch
                  checked={notifications.inAppNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, inAppNotifications: checked })}
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <ChangePassword onOpenChange={setOpen} open={open} />
    </div>
  );
};

export default SecurityNotificationsSection;
