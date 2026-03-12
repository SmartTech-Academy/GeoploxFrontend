import ListingDetail from '@/components/listing-detail';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_landing/short-let/$propertySubType/$state/$lga/$id')({
  component: ListingDetail,
});
