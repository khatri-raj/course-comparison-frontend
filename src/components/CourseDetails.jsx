import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaSave, FaExternalLinkAlt } from 'react-icons/fa';

const CourseDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [savedCourseIds, setSavedCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseAndReviews = async () => {
      try {
        const courseResponse = await axios.get(`http://localhost:8000/api/courses/${id}/`);
        setCourse(courseResponse.data);

        const reviewsResponse = await axios.get(`http://localhost:8000/api/reviews/by-course/${id}/`);
        setReviews(reviewsResponse.data);

        if (isAuthenticated) {
          const savedResponse = await axios.get('http://localhost:8000/api/saved-courses/', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setSavedCourseIds(savedResponse.data.map(item => item.course.id));
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch course details or reviews. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourseAndReviews();
  }, [id, isAuthenticated]);

  const handleSaveToDashboard = async (course) => {
    if (!isAuthenticated) {
      alert('Please log in to save courses.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/saved-courses/',
        { course_id: course.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSavedCourseIds([...savedCourseIds, course.id]);
      alert('Course saved to your dashboard!');
    } catch (err) {
      if (err.response?.status === 400 && err.response.data.course) {
        alert('This course is already saved.');
      } else {
        alert('Failed to save course.');
      }
    }
  };

  const handleLinkClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert('No link available for this course.');
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const reviewVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  if (loading) {
    return (
      <motion.div
        style={styles.loadingContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading course details...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        style={styles.errorContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p style={styles.errorText}>{error}</p>
      </motion.div>
    );
  }

  if (!course) {
    return (
      <motion.div
        style={styles.errorContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p style={styles.errorText}>Course not found.</p>
      </motion.div>
    );
  }

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
        .course-card, .review-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .course-card:hover, .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px var(--shadow-hover);
        }
        .save-button, .link-button {
          transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .save-button:hover:not(:disabled), .link-button:hover:not(:disabled) {
          background-color: var(--accent-hover);
          transform: scale(1.05);
          box-shadow: 0 4px 12px var(--shadow-hover);
        }
        .save-button:active:not(:disabled), .link-button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>

      <motion.header
        style={{
          ...styles.header,
          backgroundImage: 'linear-gradient(90deg, var(--accent), var(--mobile-menu-bg), var(--accent))',
        }}
        className="header-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.headerContent}>
          <h1 style={styles.heroTitle}>{course.Name}</h1>
          <p style={styles.heroSubtitle}>Explore detailed information and user reviews.</p>
        </div>
      </motion.header>

      <main style={styles.main}>
        <section style={styles.section}>
          <motion.div
            style={styles.courseCard}
            className="course-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 style={styles.courseTitle}>{course.Name}</h2>
            <p style={styles.academyName}>{course.Institute}</p>
            <div style={styles.courseDetails}>
              <p style={styles.detailText}>Fees: ${course.Fees}</p>
              <p style={styles.detailText}>Placement Rate: {course.Placement_rate}%</p>
              <div style={styles.rating}>
                <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                <span style={styles.ratingText}>({course.Rating})</span>
              </div>
              <p style={styles.detailText}>Duration: {course.Duration || 'Not specified'}</p>
              <p style={styles.detailText}>Syllabus: {course.Syllabus || 'No syllabus available'}</p>
            </div>
            <div style={styles.buttonContainer}>
              <motion.button
                style={{
                  ...styles.actionButton,
                  ...styles.saveButton,
                  ...(savedCourseIds.includes(course.id) ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                }}
                className="save-button"
                onClick={() => handleSaveToDashboard(course)}
                disabled={savedCourseIds.includes(course.id)}
                whileHover={savedCourseIds.includes(course.id) ? {} : { scale: 1.05 }}
                whileTap={savedCourseIds.includes(course.id) ? {} : { scale: 0.95 }}
              >
                <FaSave style={styles.buttonIcon} /> {savedCourseIds.includes(course.id) ? 'Saved' : 'Save to Dashboard'}
              </motion.button>
              <motion.button
                style={{
                  ...styles.actionButton,
                  ...styles.linkButton,
                  ...(course.link ? {} : { opacity: 0.5, cursor: 'not-allowed' }),
                }}
                className="link-button"
                onClick={() => handleLinkClick(course.link)}
                disabled={!course.link}
                whileHover={course.link ? { scale: 1.05 } : {}}
                whileTap={course.link ? { scale: 0.95 } : {}}
              >
                <FaExternalLinkAlt style={styles.buttonIcon} /> Visit Course
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            style={styles.reviewContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={styles.sectionTitle}>User Reviews</h2>
            {reviews.length === 0 ? (
              <motion.p
                style={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No reviews yet for this course. Be the first to share your thoughts!
              </motion.p>
            ) : (
              <div style={styles.reviewList}>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    style={styles.reviewCard}
                    className="review-card"
                    variants={reviewVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div style={styles.reviewHeader}>
                      <h3 style={styles.reviewCourse}>{course.Name}</h3>
                      <div style={styles.rating}>
                        <span style={styles.ratingStars}>{'★'.repeat(Math.round(review.rating))}</span>
                        <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(review.rating))}</span>
                      </div>
                    </div>
                    <p style={styles.reviewText}>{review.comment}</p>
                    <p style={styles.reviewMeta}>
                      Posted by {review.user} on {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
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
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, var(--background),-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '16px',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '4px solid var(--accent)',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'var(--accent)',
    fontWeight: '600',
    fontSize: '16px',
  },
  errorContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, var(--background), var(--background-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: '16px',
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
  courseCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '24px',
    marginBottom: '40px',
  },
  courseTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--accent)',
    margin: 0,
  },
  academyName: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    margin: '8px 0',
  },
  courseDetails: {
    marginBottom: '16px',
  },
  detailText: {
    color: 'var(--text-primary)',
    fontSize: '16px',
    margin: '8px 0',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    margin: '8px 0',
  },
  ratingStars: {
    color: 'var(--highlight)',
    fontSize: '16px',
  },
  ratingEmptyStars: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
  },
  ratingText: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginLeft: '4px',
  },
  actionButton: {
    padding: '10px 0',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--button-text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  saveButton: {
    background: 'var(--button-bg)',
    padding: '10px 20px',
  },
  linkButton: {
    background: 'var(--button-bg)',
    padding: '10px 20px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-start',
  },
  buttonIcon: {
    width: '16px',
    height: '16px',
  },
  reviewContainer: {
    marginBottom: '40px',
  },
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  reviewCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '24px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  reviewCourse: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--accent)',
  },
  reviewText: {
    color: 'var(--text-primary)',
    fontSize: '16px',
  },
  reviewMeta: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    marginTop: '8px',
  },
  noResults: {
    color: 'var(--text-secondary)',
    textAlign: 'center',
    fontSize: '18px',
    margin: '24px 0',
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

export default CourseDetails;