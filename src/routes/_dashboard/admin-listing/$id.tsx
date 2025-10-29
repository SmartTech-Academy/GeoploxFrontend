import { WithSuspense } from '@/components/error-components';
import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';

const RouteComponent = WithSuspense(lazy(() => import('../../../components/listing-detail')));
export const Route = createFileRoute('/_dashboard/admin-listing/$id')({
  component: RouteComponent,
});
