import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
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
      const errorMsg = error.response?.data?.error || error.message || 'Invalid credentials';
      showToast(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row font-spartan">
      {/* Left Panel - Visual Showcase */}
      <div className="relative w-full h-[40vh] md:h-screen md:w-1/2 lg:w-[55%] overflow-hidden">
        <TubesBackground>
          <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent z-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-text-light mb-4 uppercase tracking-tighter">
                Redefining <br/>Real Estate
              </h2>
              <p className="text-text-muted font-mono text-sm max-w-md">
                Empowering agents with state-of-the-art tools and dynamic insights to conquer the modern property market.
              </p>
            </motion.div>
          </div>
        </TubesBackground>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full h-[60vh] md:h-screen md:w-1/2 lg:w-[45%] flex items-center justify-center p-8 relative overflow-hidden bg-bg-dark">
        {/* Subtle background glow effect on the right side */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent-rose opacity-5 blur-[120px] rounded-full pointer-events-none" />

        <div className="glass-card-dark w-full max-w-md relative z-10 p-10 md:p-12 border-border-dark/50 shadow-2xl">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-accent-rose/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(228,164,189,0.15)] outline outline-1 outline-accent-rose/20 text-accent-rose">
                <span className="text-2xl font-black tracking-tighter">PND</span>
              </div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-text-light text-center">
                Agent Portal
              </h1>
              <span className="utility-label text-accent-rose mt-3 block text-center">
                Secure Access
              </span>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-[800] tracking-[0.2em] uppercase text-text-muted mb-2.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Agent email"
                  className="dark-input w-full bg-black/20 focus:bg-black/40 hover:bg-black/30 transition-colors"
                  placeholder="agent@pnddevelopers.com"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-[11px] font-[800] tracking-[0.2em] uppercase text-text-muted mb-2.5">
                  Password
                </label>
                <div className="relative group">
                   <input
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     aria-label="Agent password"
                     className="dark-input w-full pr-12 bg-black/20 focus:bg-black/40 hover:bg-black/30 transition-colors"
                     placeholder="Enter password"
                     required
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     aria-label={showPassword ? 'Hide password' : 'Show password'}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent-rose transition-colors"
                   >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="pill-button w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isLoading ? 'Authenticating...' : 'Sign In →'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={hideToast} />
    </div>
  );
}

export default Login;
