import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PropertyFilterSidebar } from "./property-filter-sidebar";

interface MobilePropertyFiltersProps {
  filters: Record<string, any>;
  onFiltersChange: (newFilters: Record<string, any>) => void;
  onClear: () => void;
}

export const MobilePropertyFilters: React.FC<MobilePropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="mb-6 flex flex-col gap-4 px-4">
      {/* Advance Filter Button */}
      <Button
        variant="link"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        className="text-[14px] leading-[17px] font-semibold tracking-[0.01em] text-primary"
      >
        {showAdvancedFilters ? "Hide Filter" : "Advance Filter"}
      </Button>

      <Sheet open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <SheetContent className="w-full border-r-0 border-none sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <PropertyFilterSidebar
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClear={onClear}
            />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};
