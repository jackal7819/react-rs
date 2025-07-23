import { createBrowserRouter, RouterProvider } from 'react-router';
import { ErrorPage } from './pages/ErrorPage';
import { MainLayout } from './components/MainLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      { path: 'about', element: <AboutPage /> },
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
