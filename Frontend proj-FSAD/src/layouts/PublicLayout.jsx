import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Toast from '../components/ui/Toast';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toast />
    </div>
  );
}
