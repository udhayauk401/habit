import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiTarget, FiTrendingUp, FiZap } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';
import { authAPI } from '../services/api';
import '../styles/LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowLoading, setSlowLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError('');
    setLoading(true);
    setSlowLoading(false);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const slowLoadingTimer = window.setTimeout(() => {
      setSlowLoading(true);
    }, 5000);

    try {
      let response;
      if (isSignUp) {
        response = await authAPI.register({ email: normalizedEmail, password: normalizedPassword });
      } else {
        response = await authAPI.login({ email: normalizedEmail, password: normalizedPassword });
      }

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        navigate('/dashboard');
      } else {
        const errorMsg = response.message || 'Authentication failed';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'An error occurred. Please try again.';
      setError(errorMsg);
    } finally {
      window.clearTimeout(slowLoadingTimer);
      setSlowLoading(false);
      setLoading(false);
    }
  };

  

  return (
    <div className="login-shell">
      <motion.div
        className="login-hero"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-mark">✦</span>
            Daily progress, beautifully tracked
          </div>
          <h1>Small Habits. Big Results.</h1>
          <p>
            Stay consistent every day. Build the future you dream of one habit at a time.
          </p>

          <div className="feature-list">
            <div className="feature-card">
              <div className="feature-icon">
                <FiTarget />
              </div>
              <div>
                <h3>Build Discipline</h3>
                <p>Create momentum with focused daily routines.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiZap />
              </div>
              <div>
                <h3>Maintain Streaks</h3>
                <p>Keep your progress alive with consistent wins.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp />
              </div>
              <div>
                <h3>Track Progress</h3>
                <p>See your growth evolve in a calm, elegant flow.</p>
              </div>
            </div>
          </div>

          <blockquote>
            “Success is the sum of small efforts repeated every day.” — Robert Collier
          </blockquote>

          <div className="hero-stats">
            <div>
              <strong>10,000+</strong>
              <span>Active Users</span>
            </div>
            <div>
              <strong>500K+</strong>
              <span>Habits Completed</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>Success Rate</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="login-panel"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
      >
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <div className="brand-row">
            <div className="brand-icon">
              <span className="brand-icon-inner">✦</span>
            </div>
            <div>
              <div className="brand-name">HabitFlow</div>
              <div className="brand-subtitle">Premium Habit Tracker</div>
            </div>
          </div>

          <h2>{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
          <p>{isSignUp ? 'Start building your future with a few strong habits.' : 'Sign in to continue your momentum.'}</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <FiMail />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <FiLock />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-link">
                Forgot password?
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? (slowLoading ? 'Waking up server, please wait...' : 'Processing...') : isSignUp ? 'Create account' : 'Sign in'}
              <FiArrowRight />
            </button>
          </form>

          

          <div className="auth-switch">
            <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              className="text-link strong-link"
              onClick={() => {
                setIsSignUp((prev) => !prev);
                setError('');
              }}
            >
              {isSignUp ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
