import { Skeleton } from "@/components/ui/skeleton";

export const PropertyListingCardSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-between gap-[89px] self-stretch border-b border-[#F1F1F4] pb-10">
      <Skeleton className="h-[266px] w-[463px]" />
      <div className="flex flex-1 flex-col items-start gap-9">
        <div className="flex w-full flex-col gap-4 self-stretch">
          <div className="flex flex-col items-start gap-2.5">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-7 w-1/2" />
          </div>
          <div className="flex flex-col items-start gap-[11px] self-stretch">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="flex w-full items-center gap-3 self-stretch">
          <Skeleton className="h-8 w-1/2 rounded-full" />
          <Skeleton className="h-8 w-1/2 rounded-full" />
        </div>
      </div>
    </div>
  );
};
