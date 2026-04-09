import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AcademicConnectLogo from '../components/common/Logo';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white px-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center shadow-2xl">
            <AcademicConnectLogo size={44} className="text-white" />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
          Academic<span className="text-brand-200">Connect</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-brand-100 mb-10 leading-relaxed">
          The smart platform for educators and students to connect, learn, and grow together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-bold rounded-xl bg-white text-brand-700 hover:bg-brand-50 shadow-xl transition"
          >
            Get Started Free
            <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold rounded-xl border-2 border-white/50 text-white hover:bg-white/10 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
