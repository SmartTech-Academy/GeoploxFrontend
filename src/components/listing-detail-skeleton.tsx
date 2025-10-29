import { Skeleton } from '@/components/ui/skeleton';

export const ListingDetailSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="landing-container flex flex-col gap-8 pt-[77px]">
        {/* Header */}
        <header className="flex w-full flex-col items-center justify-between lg:flex-row">
          <div className="flex w-full flex-col items-start self-stretch">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-3 h-10 w-2/3" />
          </div>
          <div className="mt-4 flex w-full items-start justify-end self-stretch lg:mt-0">
            <div className="flex items-center gap-1">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </header>

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-11">
            {/* Image Gallery */}
            <div className="relative flex flex-col gap-[19px]">
              <Skeleton className="h-[500px] w-full rounded-lg" />
              <div className="flex gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="size-[135px] shrink-0" />
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="flex flex-col items-start gap-3 self-stretch border-b border-[#EAEBF0] pb-[21px]">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <Skeleton className="h-10 w-48" />
                <div className="flex items-center gap-6">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col items-end">
            <div className="flex w-[325px] shrink-0 flex-col items-start gap-5 self-stretch rounded-[5px] border border-[#E5E5E5] p-4">
              <div className="flex w-full items-center gap-4 border-b border-[#F1F1F4] pb-5">
                <Skeleton className="size-[68px] rounded" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 self-stretch">
                <Skeleton className="h-8 w-full rounded-full" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
