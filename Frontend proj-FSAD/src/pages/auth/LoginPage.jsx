import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AcademicConnectLogo from '../../components/common/Logo';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (!result.success) { setApiError(result.error); return; }
    navigate(result.user.role === 'admin' ? '/admin' : '/student');
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@edu.com', password: 'admin123' });
    else setForm({ email: 'student@edu.com', password: 'student123' });
    setErrors({});
    setApiError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <AcademicConnectLogo size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your AcademicConnect account</p>
        </div>

        {/* Demo credentials */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-brand-700 mb-2">🔑 Demo Credentials</p>
          <div className="flex gap-2">
            <button
              onClick={() => fillDemo('admin')}
              className="flex-1 text-xs bg-brand-700 text-white py-1.5 rounded-lg hover:bg-brand-600 transition"
            >
              Admin Login
            </button>
            <button
              onClick={() => fillDemo('student')}
              className="flex-1 text-xs bg-white border border-brand-200 text-brand-700 py-1.5 rounded-lg hover:bg-brand-50 transition"
            >
              Student Login
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="card p-8">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={errors.email}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="label">
                Password <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
