import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaEye } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [savedCourses, setSavedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedCourses = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/saved-courses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Saved Courses API Response:', response.data);
        setSavedCourses(response.data.map(item => ({
          savedCourseId: item.id,
          id: item.course.id,
          Name: item.course.Name,
          Institute: item.course.Institute,
          Fees: item.course.Fees,
          Placement_rate: item.course.Placement_rate,
          Rating: item.course.Rating,
          image: item.course.image,
        })));
        setLoading(false);
      } catch (err) {
        setError('Failed to load saved courses.');
        setLoading(false);
      }
    };
    fetchSavedCourses();
  }, [isAuthenticated]);

  const handleRemoveCourse = async (savedCourseId) => {
    try {
      await axios.delete(`http://localhost:8000/api/saved-courses/${savedCourseId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSavedCourses(savedCourses.filter(course => course.savedCourseId !== savedCourseId));
      setError('');
    } catch (err) {
      console.error('Remove course error:', err.response?.data || err.message);
      setError('Failed to remove course. Please try again.');
    }
  };

  const handleViewDetails = (courseId) => {
    window.location.href = `/course/${courseId}`;
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 4px 8px var(--shadow-hover)' },
    tap: { scale: 0.95 },
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
          background-size: 200% 200%;
        }
        .course-card, .saved-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .course-card:hover, .saved-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px var(--shadow-hover);
        }
        .course-image {
          transition: transform 0.5s ease, filter 0.3s ease;
        }
        .saved-card:hover .course-image {
          transform: scale(1.1);
          filter: brightness(1.1);
        }
        .action-button, .remove-button, .update-button, .view-button {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .action-button:hover, .update-button:hover, .view-button:hover {
          background-color: var(--accent-hover);
          transform: scale(1.05);
        }
        .remove-button:hover {
          background-color: #e11d48;
          transform: scale(1.05);
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
          <h1 style={styles.heroTitle}>Dashboard</h1>
          <Link to="/update-profile">
            <motion.button
              style={styles.updateButton}
              className="update-button"
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              Update Profile
            </motion.button>
          </Link>
        </div>
      </motion.header>
      <main style={styles.main}>
        <section style={styles.section}>
          <motion.div
            style={styles.welcomeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={styles.sectionTitle}>Welcome, {user?.username || 'User'}!</h2>
            <p style={styles.welcomeText}>
              Explore your saved courses and continue your learning journey.
            </p>
          </motion.div>
          <motion.div
            style={styles.savedSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 style={styles.sectionTitle}>Saved Courses</h2>
            {loading ? (
              <p style={styles.noResults}>Loading saved courses...</p>
            ) : error ? (
              <p style={styles.errorText}>{error}</p>
            ) : savedCourses.length === 0 ? (
              <motion.p
                style={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                You haven’t saved any courses yet.{' '}
                <Link to="/compare" style={styles.link} className="link">
                  Compare and save courses now!
                </Link>
              </motion.p>
            ) : (
              <motion.div
                style={styles.courseGrid}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {savedCourses.map((course, index) => (
                  <motion.div
                    key={course.savedCourseId}
                    style={styles.savedCard}
                    className="saved-card"
                    variants={cardVariants}
                    custom={index}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div
                      style={{
                        ...styles.courseImage,
                        backgroundImage: `url(${course.image || 'https://source.unsplash.com/300x140/?course'})`,
                      }}
                      className="course-image"
                    ></div>
                    <h3 style={styles.courseTitle}>{course.Name}</h3>
                    <p style={styles.courseDetail}>Institute: {course.Institute}</p>
                    <p style={styles.courseDetail}>Fees: ${course.Fees}</p>
                    <p style={styles.courseDetail}>Placement Rate: {course.Placement_rate}%</p>
                    <div style={styles.rating}>
                      <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                      <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                      <span style={styles.ratingText}>({course.Rating})</span>
                    </div>
                    <div style={styles.buttonGroup}>
                      <motion.button
                        style={styles.viewButton}
                        className="view-button"
                        onClick={() => handleViewDetails(course.id)}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <FaEye style={styles.buttonIcon} /> View Details
                      </motion.button>
                      <motion.button
                        style={styles.removeButton}
                        className="remove-button"
                        onClick={() => handleRemoveCourse(course.savedCourseId)}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <FaTrash style={styles.buttonIcon} /> Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
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
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--button-text)',
    margin: 0,
    textShadow: '0 2px 4px var(--shadow)',
  },
  main: {
    width: '100%',
    flexGrow: 1,
    padding: '64px 0',
  },
  section: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
  },
  welcomeSection: {
    marginBottom: '48px',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '24px',
  },
  welcomeText: {
    color: 'var(--text-secondary)',
    fontSize: '20px',
    maxWidth: '720px',
    margin: '0 auto',
  },
  savedSection: {
    marginBottom: '48px',
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  savedCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  courseImage: {
    height: '140px',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  courseTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--accent)',
    margin: 0,
  },
  courseDetail: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
    margin: '4px 0',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '4px 0',
  },
  ratingStars: {
    color: 'var(--highlight)',
    fontSize: '18px',
  },
  ratingEmptyStars: {
    color: 'var(--text-secondary)',
    fontSize: '18px',
  },
  ratingText: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
    marginLeft: '8px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  updateButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '12px 32px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  viewButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '10px 0',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flex: 1,
  },
  removeButton: {
    background: '#dc3545',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '10px 0',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flex: 1,
  },
  buttonIcon: {
    width: '16px',
    height: '16px',
  },
  noResults: {
    color: 'var(--text-secondary)',
    textAlign: 'center',
    fontSize: '20px',
    margin: '32px 0',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: '20px',
    margin: '32px 0',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'underline',
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    background: 'linear-gradient(to right, var(--mobile-menu-bg), var(--accent))',
    color: 'var(--button-text)',
    padding: '32px 0',
  },
  footerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
  },
};

export default Dashboard;