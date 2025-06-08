import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

const Register = () => {
  const { theme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', password_confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:8000/api/register/', formData);
      setFormData({ username: '', email: '', password: '', password_confirm: '' });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response?.data) {
        const errors = err.response.data;
        if (errors.username) setError(errors.username[0]);
        else if (errors.email) setError(errors.email[0]);
        else if (errors.password) setError(errors.password[0]);
        else setError('Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
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
            Register for <span style={styles.highlightText}>CourseComparison</span>
          </h1>
          <p style={styles.heroSubtitle}>Create an account to start learning today.</p>
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
            <h2 style={styles.sectionTitle}>Sign Up</h2>
            <AnimatePresence>
              {success && (
                <motion.p
                  style={styles.successText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {success}
                </motion.p>
              )}
              {error && (
                <motion.p
                  style={styles.errorText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
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
                <label htmlFor="email" style={styles.formLabel}>
                  Email
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  className="form-input"
                  placeholder="Enter your email"
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
              <div style={styles.formGroup}>
                <label htmlFor="password_confirm" style={styles.formLabel}>
                  Confirm Password
                </label>
                <motion.input
                  type="password"
                  id="password_confirm"
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  className="form-input"
                  placeholder="Confirm your password"
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
                Register
              </motion.button>
            </form>
            <p style={styles.loginLink}>
              Already have an account?{' '}
              <Link to="/login" style={styles.link} className="link">
                Login here
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
    padding: '64px 0',
    backgroundSize: '200% 200%',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--button-text)',
    marginBottom: '8px',
  },
  highlightText: {
    color: 'var(--highlight)',
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--button-text)',
    marginBottom: '24px',
    maxWidth: '640px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  main: {
    width: '100%',
    flexGrow: 1,
    padding: '40px 0',
  },
  section: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
  },
  formContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '24px',
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
    gap: '4px',
  },
  formLabel: {
    color: 'var(--accent)',
    fontWeight: '500',
    fontSize: '14px',
  },
  formInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--text-secondary)',
    background: 'var(--card-background)',
    fontSize: '16px',
    outline: 'none',
    color: 'var(--text-primary)',
  },
  submitButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  successText: {
    color: '#16a34a',
    marginBottom: '16px',
    textAlign: 'center',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: '16px',
    textAlign: 'center',
  },
  loginLink: {
    marginTop: '16px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
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
    padding: '24px 0',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
  },
};

export default Register;