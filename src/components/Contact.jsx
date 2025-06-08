// src/components/Contact.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // Use ThemeContext
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isAuthenticated || !token) {
      setError('You must be logged in to submit the form.');
      navigate('/login');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/contact-messages/',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSuccess(true);
      setError('');
    } catch (err) {
      console.error('Contact form error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Invalid or expired token. Please log in again.');
        navigate('/login');
      } else {
        setError(
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.email?.[0] ||
          err.response?.data?.message?.[0] ||
          'Failed to submit the form. Please try again.'
        );
      }
      setSuccess(false);
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
        .info-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px var(--shadow-hover);
        }
        .form-input, .form-textarea {
          transition: all 0.3s ease;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 8px var(--accent, 0.5);
        }
        .submit-button {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .submit-button:hover {
          background-color: var(--accent-hover);
          transform: scale(1.05);
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
            Contact <span style={styles.highlightText}>Us</span>
          </h1>
          <p style={styles.heroSubtitle}>We'd love to hear from you! Reach out with any questions or feedback.</p>
        </div>
      </motion.header>

      <main style={styles.main}>
        <section style={styles.section}>
          <motion.div
            style={styles.infoContainer}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.div
              style={styles.infoCard}
              className="info-card"
              variants={cardVariants}
              custom={0}
              whileHover={{ scale: 1.02 }}
            >
              <h2 style={styles.infoTitle}>Get in Touch</h2>
              <p style={styles.infoText}><strong>Email:</strong> support@coursecomparison.com</p>
              <p style={styles.infoText}><strong>Phone:</strong> +91 82628 13490, 96071 35646</p>
              <p style={styles.infoText}><strong>Address:</strong> Park Plaza, above Birla Super Market, Karve Nagar, Pune, Maharashtra 411052</p>
            </motion.div>
            <motion.div
              style={styles.infoCard}
              className="info-card"
              variants={cardVariants}
              custom={1}
              whileHover={{ scale: 1.02 }}
            >
              <h2 style={styles.infoTitle}>Business Hours</h2>
              <p style={styles.infoText}><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
              <p style={styles.infoText}><strong>Saturday:</strong> 10:00 AM - 2:00 PM</p>
              <p style={styles.infoText}><strong>Sunday:</strong> Closed</p>
            </motion.div>
          </motion.div>

          <motion.div
            style={styles.formContainer}
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <h2 style={styles.sectionTitle}>Send Us a Message</h2>
            <AnimatePresence>
              {success && (
                <motion.p
                  style={styles.successText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Your message has been sent successfully!
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
                <label htmlFor="name" style={styles.formLabel}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  className="form-input"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.formLabel}>
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="subject" style={styles.formLabel}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  className="form-input"
                  placeholder="Enter the subject"
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="message" style={styles.formLabel}>
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  style={styles.formTextarea}
                  className="form-textarea"
                  placeholder="Write your message here"
                  rows="4"
                  required
                />
              </div>
              <motion.button
                type="submit"
                style={styles.submitButton}
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
            </form>
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
  sectionTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '24px',
    textAlign: 'center',
  },
  infoContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  infoCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '24px',
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--accent)',
    marginBottom: '12px',
  },
  infoText: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
    marginBottom: '8px',
  },
  formContainer: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '24px',
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
  formTextarea: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--text-secondary)',
    background: 'var(--card-background)',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
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

export default Contact;