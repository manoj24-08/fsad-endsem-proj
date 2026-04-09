import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import AcademicConnectLogo from '../../components/common/Logo';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!form.role) e.role = 'Please select a role.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (!result.success) { setApiError(result.error); return; }
    navigate(result.user.role === 'admin' ? '/admin' : '/student');
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
            <AcademicConnectLogo size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join AcademicConnect today</p>
        </div>

        <div className="card p-8">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              required
            />
            <Select
              label="I am a"
              value={form.role}
              onChange={set('role')}
              error={errors.role}
              required
            >
              <option value="student">Student</option>
              <option value="admin">Educator / Admin</option>
            </Select>

            <div className="flex flex-col gap-1">
              <label className="label">
                Password <span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
              required
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
