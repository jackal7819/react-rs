import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
