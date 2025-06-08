import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const Help = () => {
  const { theme } = useContext(ThemeContext);
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I enroll in a course?',
      answer: 'To enroll in a course, visit the Courses page, select the course you’re interested in, and click the "Enroll Now" button. Follow the prompts to complete your enrollment.',
    },
    {
      question: 'Can I get a refund if I’m not satisfied with a course?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you’re not satisfied, contact us within 30 days of enrollment to request a refund.',
    },
    {
      question: 'How can I contact support if I have an issue?',
      answer: 'You can reach our support team via the Contact page. We’re available Monday to Friday, 9:00 AM to 6:00 PM.',
    },
    {
      question: 'Are the courses self-paced?',
      answer: 'Yes, most of our courses are self-paced, allowing you to learn at your own speed. Check the course details for specific information.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const faqVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const answerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
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
        .faq-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .faq-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px var(--shadow-hover);
        }
        .faq-header {
          transition: background-color 0.2s ease;
        }
        .faq-header:hover {
          background-color: var(--background-secondary);
        }
        .contact-button {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .contact-button:hover {
          background-color: var(--accent-hover);
          transform: scale(1.05);
        }
        .help-section {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .help-section:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 16px var(--shadow-hover);
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
            Help <span style={styles.highlightText}>Center</span>
          </h1>
          <p style={styles.heroSubtitle}>Find answers to common questions or get in touch with us.</p>
        </div>
      </motion.header>
      <main style={styles.main}>
        <section style={styles.section}>
          <motion.div
            style={styles.faqContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div style={styles.faqList}>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  style={styles.faqCard}
                  className="faq-card"
                  variants={faqVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    style={styles.faqHeader}
                    className="faq-header"
                    onClick={() => toggleFAQ(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleFAQ(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 style={styles.faqQuestion}>{faq.question}</h3>
                    {openIndex === index ? (
                      <FaChevronUp style={styles.faqIcon} />
                    ) : (
                      <FaChevronDown style={styles.faqIcon} />
                    )}
                  </div>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        style={styles.faqAnswer}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={answerVariants}
                      >
                        <p style={styles.faqAnswerText}>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            style={styles.helpSection}
            className="help-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={styles.sectionTitle}>Need More Help?</h2>
            <p style={styles.helpText}>
              If you can’t find the answer you’re looking for, feel free to reach out to our support team.
            </p>
            <Link to="/contact">
              <motion.button
                style={styles.contactButton}
                className="contact-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </Link>
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
  faqContainer: {
    marginBottom: '40px',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  faqCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '16px 24px',
    cursor: 'pointer',
  },
  faqHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
  faqQuestion: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--accent)',
    margin: 0,
  },
  faqIcon: {
    width: '16px',
    height: '16px',
    color: 'var(--accent)',
  },
  faqAnswer: {
    marginTop: '12px',
    overflow: 'hidden',
  },
  faqAnswerText: {
    color: 'var(--text-primary)',
    fontSize: '16px',
  },
  helpSection: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '24px',
    textAlign: 'center',
  },
  helpText: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
    marginBottom: '24px',
    maxWidth: '640px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  contactButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
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

export default Help;