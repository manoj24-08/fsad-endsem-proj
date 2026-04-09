import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import AcademicConnectLogo from './Logo';

export default function Navbar({ onMenuToggle, showMenu = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Logo + hamburger */}
        <div className="flex items-center gap-3">
          {user && onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center shadow-sm">
              <AcademicConnectLogo size={22} className="text-white" />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-extrabold text-brand-700 text-sm tracking-tight">Academic</span>
              <span className="font-extrabold text-slate-700 text-sm tracking-tight -mt-0.5">Connect</span>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-bold">
                  {user.avatar}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-800 leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-soft border border-slate-200 py-1 z-50">
                  <Link
                    to={`/${user.role}/profile`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={15} />
                    My Profile
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
