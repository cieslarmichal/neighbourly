/* eslint-disable react-refresh/only-export-components */
import { NotFoundRoute } from '@tanstack/react-router';
import { rootRoute } from '../root';
import { FC } from 'react';
import { Button } from '../../components/ui/button';
import { AuthenticatedLayout } from '../../layouts/authenticated/authenticatedLayout';

export const NotFoundPage: FC = () => {
  return (
    <AuthenticatedLayout>
      <div id="not-found-page">
        <Button>Click me</Button>
        <h1>Not Found</h1>
      </div>
    </AuthenticatedLayout>
  );
};

export const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFoundPage,
});
