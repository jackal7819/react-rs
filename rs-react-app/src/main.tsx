import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { ThemeProviderWrapper } from './components/ThemeProviderWrapper.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const queryClient = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProviderWrapper>
          <App />
        </ThemeProviderWrapper>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
