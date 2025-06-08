import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: 'var(--accent)', transition: { duration: 0.2 } },
    blur: { scale: 1, borderColor: 'var(--text-secondary)', transition: { duration: 0.2 } },
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .header-section {
          animation: gradientShift 10s ease infinite;
        }
        .form-input {
          transition: all 0.3s ease;
        }
        .form-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 8px var(--accent, 0.5);
          outline: none;
        }
        .submit-button {
          transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .submit-button:hover {
          background-color: var(--accent-hover);
          transform: scale(1.05);
          box-shadow: 0 4px 12px var(--shadow-hover);
        }
        .submit-button:active {
          transform: scale(0.95);
        }
        .link:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }
      `}</style>
      <motion.header
        style={{
          ...styles.header,
          backgroundImage: 'linear-gradient(90deg, var(--accent), var(--mobile-menu-bg), var(--accent))',
        }}
        className="header-section"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <div style={styles.headerContent}>
          <h1 style={styles.heroTitle}>
            Login to <span style={styles.highlightText}>CourseComparison</span>
          </h1>
          <p style={styles.heroSubtitle}>Access your account to continue learning.</p>
        </div>
      </motion.header>
      <main style={styles.main}>
        <section style={styles.section}>
          <motion.div
            style={styles.formContainer}
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <h2 style={styles.sectionTitle}>Sign In</h2>
            <AnimatePresence>
              {error && (
                <motion.p
                  style={styles.errorText}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.formLabel}>
                  Username
                </label>
                <motion.input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  className="form-input"
                  placeholder="Enter your username"
                  required
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                  animate="blur"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.formLabel}>
                  Password
                </label>
                <motion.input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  variants={inputVariants}
                  whileFocus="focus"
                  initial="blur"
                  animate="blur"
                />
              </div>
              <motion.button
                type="submit"
                style={styles.submitButton}
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </form>
            <p style={styles.registerLink}>
              Don't have an account?{' '}
              <Link to="/register" style={styles.link} className="link">
                Register here
              </Link>
            </p>
          </motion.div>
        </section>
      </main>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>© 2025 CourseComparison. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, var(--background), var(--background-secondary))',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    padding: '40px 0',
    backgroundSize: '200% 200%',
  },
  headerContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--button-text)',
    margin: '0 0 8px 0',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--button-text)',
    margin: 0,
  },
  highlightText: {
    color: 'var(--highlight)',
  },
  main: {
    width: '100%',
    flexGrow: 1,
    padding: '40px 0',
  },
  section: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 16px',
  },
  formContainer: {
    background: 'var(--card-background)',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px var(--shadow)',
    maxWidth: '400px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '20px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  formInput: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--text-secondary)',
    fontSize: '14px',
    outline: 'none',
    background: 'var(--card-background)',
    color: 'var(--text-primary)',
  },
  submitButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '8px',
  },
  errorText: {
    color: '#e11d48',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  registerLink: {
    marginTop: '16px',
    textAlign: 'center',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'underline',
  },
  footer: {
    width: '100%',
    background: 'linear-gradient(to right, var(--mobile-menu-bg), var(--accent))',
    color: 'var(--button-text)',
    padding: '20px 0',
  },
  footerContent: {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
  },
};

export default Login;