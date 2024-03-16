import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import './i18n.ts';
import './index.css';
import { routeTree } from './core/router/router.tsx';
import { QueryClientProvider } from './core/components/providers/queryClientProvider/queryClientProvider.tsx';
import { notFoundRoute } from './routes/notFound/notFound.tsx';
import { StoreProvider } from './core/components/providers/storeProvider/storeProvider.tsx';

const router = createRouter({
  routeTree,
  notFoundRoute,
});
// TODO: Custom provider that loads data from cookies / indexDb

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <QueryClientProvider>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StoreProvider>
  </React.StrictMode>,
);
