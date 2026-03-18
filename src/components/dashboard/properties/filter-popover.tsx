import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Filter } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export interface FilterValues {
  q?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'most_viewed';
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  verified?: boolean;
}

const propertyTypes = ['flat', 'apartment', 'house', 'land', 'commercial', 'villa', 'duplex'];

const FilterPopover: React.FC<{ onApply: (filters: Partial<FilterValues>) => void }> = ({ onApply }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm<FilterValues>();

  const onSubmit = (data: FilterValues) => {
    // Clean up empty values before applying
    const cleanedFilters = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );
    onApply(cleanedFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Filter className="size-4 text-gray-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Filters</h4>
            <p className="text-sm text-muted-foreground">Set filters for the property list.</p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="sort">Sort By</Label>
              <Select onValueChange={(value) => setValue('sort', value as FilterValues['sort'])} value={watch('sort')}>
                <SelectTrigger id="sort" className="col-span-2 h-8 w-full">
                  <SelectValue placeholder="Select sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="most_viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="property_type">Property Type</Label>
              <Select onValueChange={(value) => setValue('property_type', value)} value={watch('property_type')}>
                <SelectTrigger id="property_type" className="col-span-2 h-8 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Min Price" {...register('min_price', { valueAsNumber: true })} />
              <Input type="number" placeholder="Max Price" {...register('max_price', { valueAsNumber: true })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="Bedrooms" {...register('bedrooms', { valueAsNumber: true })} />
              <Input type="number" placeholder="Bathrooms" {...register('bathrooms', { valueAsNumber: true })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="verified">Verified Only</Label>
              <Switch
                id="verified"
                onCheckedChange={(checked) => setValue('verified', checked)}
                checked={watch('verified')}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onApply({});
              }}
              size="sm"
            >
              Reset
            </Button>
            <Button type="submit" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
