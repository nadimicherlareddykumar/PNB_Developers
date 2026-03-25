import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import TubesBackground from '../../components/TubesBackground';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast, showToast, hideToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/agent/dashboard');
    } catch (error) {
      showToast(error.response?.data?.error || 'Invalid credentials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <TubesBackground>
        <div className="h-full flex items-center justify-center p-8">
          <div className="glass-card-dark max-w-md w-full">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-accent-rose flex items-center justify-center mb-4">
                <span className="text-2xl font-black text-text-dark">PND</span>
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-tight text-text-light">
                Agent Portal
              </h1>
              <span className="utility-label text-accent-rose mt-2">PND DEVELOPERS</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark-input w-full"
                  placeholder="agent@pnddevelopers.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-[900] tracking-[0.2em] uppercase text-text-muted mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark-input w-full pr-12"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="pill-button w-full mt-6 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>
          </div>
        </div>
      </TubesBackground>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={hideToast} />
    </div>
  );
}

export default Login;
