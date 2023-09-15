import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './api/queryClient.ts';
import { BrowserRouter } from 'react-router-dom';
import AuthWrapper from './auth/AuthWrapper.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider i18n={{}}>
        <BrowserRouter>
          <AuthWrapper>
            <App />
          </AuthWrapper>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
