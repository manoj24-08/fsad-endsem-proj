import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart3,
  BookMarked,
  Upload,
  User,
} from 'lucide-react';
import AcademicConnectLogo from './Logo';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/create-course', label: 'Create Course', icon: PlusCircle },
  { to: '/admin/manage-courses', label: 'Manage Courses', icon: BookOpen },
  { to: '/admin/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/admin/progress', label: 'Student Progress', icon: BarChart3 },
  { to: '/admin/profile', label: 'My Profile', icon: User },
];

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/courses', label: 'Browse Courses', icon: BookMarked },
  { to: '/student/profile', label: 'My Profile', icon: User },
];

export default function Sidebar({ role, open, onClose }) {
  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 z-30 flex flex-col transition-transform duration-200',
          'md:translate-x-0 md:static md:h-auto md:flex',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand section */}
        <div className="px-4 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-700 flex items-center justify-center shadow-sm">
              <AcademicConnectLogo size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-brand-700 tracking-tight leading-none">AcademicConnect</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {role === 'admin' ? 'Educator Portal' : 'Student Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
          <ul className="space-y-0.5">
            {links.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                      isActive
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    )
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">AcademicConnect © 2024</p>
        </div>
      </aside>
    </>
  );
}
