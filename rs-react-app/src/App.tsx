import { createBrowserRouter, RouterProvider } from 'react-router';
import { ErrorPage } from './pages/ErrorPage';
import { MainLayout } from './components/MainLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DetailPanel } from './components/DetailPanel';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
        children: [
          {
            index: true,
            element: <DetailPanel />,
          },
        ],
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
