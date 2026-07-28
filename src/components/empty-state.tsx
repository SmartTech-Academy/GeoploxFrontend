import assets from "@/assets";

interface EmptyStateProps {
  type: "user" | "list" | "chart" | "favorite";
  message?: string;
}

export const EmptyState = ({ type, message }: EmptyStateProps) => {
  if (type === "user") {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4 bg-[#F9F9F9]">
        <div className="flex flex-col items-center justify-center gap-6">
          <img
            src={assets.messagingloading || "/placeholder.svg"}
            alt="loading"
            className="h-21 w-56 animate-pulse"
            width={224}
            height={84}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <h5 className="text-[20px]/7 font-normal text-[#1F2130]">No user selected</h5>
            <p className="text-center text-[14px]/5 tracking-[-0.02em] text-[#71748C]">
              Select a user from the list
              <br /> to view details and take action.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="flex size-full items-center justify-center text-center text-sm text-gray-500">
        {message}
      </div>
    );
  }

  if (type === "favorite") {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-8 self-stretch py-14">
        <img
          src={assets.chatloading || "/placeholder.svg"}
          className="h-28 w-[211px] animate-pulse"
          width={211}
          height={112}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <h5 className="text-[20px]/7 font-semibold text-[#1F2130]">No Favorites Yet</h5>
          <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
            You haven&apos;t added any properties to your favorites.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 self-stretch py-14">
      <img
        src={assets.chatloading || "/placeholder.svg"}
        className="h-28 w-[211px] animate-pulse"
        width={211}
        height={112}
      />
      <div className="flex flex-col items-center justify-center gap-3">
        <h5 className="text-[20px]/7 font-semibold text-[#1F2130]">No users found</h5>
        <p className="text-[14px] leading-[17px] tracking-[-0.02em] text-[#71748C]">
          No users match your current filter.
        </p>
      </div>
    </div>
  );
};
