// src/components/Review.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating, setRating }) => {
  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          style={{
            ...styles.star,
            color: star <= rating ? 'var(--highlight)' : 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          onClick={() => handleStarClick(star)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
};

const Review = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // Use ThemeContext
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [newReview, setNewReview] = useState({ course: '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsResponse, coursesResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/reviews/'),
          axios.get('http://localhost:8000/api/courses/'),
        ]);
        setReviews(reviewsResponse.data);
        setCourses(coursesResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (value) => {
    setNewReview({ ...newReview, rating: value });
  };

  const handleFilterChange = (e) => {
    setSelectedCourseFilter(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isAuthenticated || !token) {
      setError('You must be logged in to submit a review.');
      navigate('/login');
      return;
    }

    if (!newReview.rating) {
      setError('Please select a rating.');
      return;
    }

    if (!newReview.course) {
      setError('Please select a course.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/reviews/',
        {
          course: parseInt(newReview.course),
          rating: parseFloat(newReview.rating),
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewReview({ course: '', rating: 0, comment: '' });
      setSuccess('Review submitted successfully!');
      const response = await axios.get('http://localhost:8000/api/reviews/');
      setReviews(response.data);
    } catch (err) {
      console.error('Error response:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError('Invalid or expired token. Please log in again.');
        navigate('/login');
      } else {
        setError(
          err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.course?.[0] ||
          err.response?.data?.rating?.[0] ||
          'Failed to submit review. Please try again.'
        );
      }
    }
  };

  const filteredReviews = selectedCourseFilter
    ? reviews.filter((review) => review.course === parseInt(selectedCourseFilter))
    : reviews;

  const reviewVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
        <p style={styles.loadingText}>Loading reviews...</p>
      </motion.div>
    );
  }

  return (
    <div style={styles.container}>
      <style jsx>{`
        .review-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px var(--shadow-hover);
        }
        .submit-btn {
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .submit-btn:hover {
          background-color: var(--accent-hover);
          transform: scale(1.05);
        }
        .form-input, .form-select, .form-textarea {
          transition: all 0.3s ease;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 8px var(--accent, 0.5);
        }
      `}</style>

      <motion.header
        style={{
          ...styles.header,
          backgroundImage: 'linear-gradient(90deg, var(--accent), var(--mobile-menu-bg), var(--accent))',
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.headerContent}>
          <h1 style={styles.heroTitle}>Course Reviews</h1>
          <p style={styles.heroSubtitle}>See what others are saying about our courses.</p>
        </div>
      </motion.header>

      <main style={styles.main}>
        <section style={styles.section}>
          {/* Submit Review Form */}
          <motion.div
            style={styles.formContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={styles.sectionTitle}>Submit Your Review</h2>
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
                <label htmlFor="course" style={styles.formLabel}>
                  Course
                </label>
                <select
                  id="course"
                  name="course"
                  value={newReview.course}
                  onChange={handleInputChange}
                  style={styles.formSelect}
                  className="form-select"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Rating</label>
                <StarRating
                  rating={newReview.rating}
                  setRating={handleRatingChange}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="comment" style={styles.formLabel}>
                  Your Review
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  style={styles.formTextarea}
                  className="form-textarea"
                  placeholder="Write your review here"
                  rows="4"
                  required
                />
              </div>
              <motion.button
                type="submit"
                style={styles.submitButton}
                className="submit-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Review
              </motion.button>
            </form>
          </motion.div>

          {/* Existing Reviews */}
          <motion.div
            style={styles.reviewContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={styles.sectionTitle}>User Reviews</h2>
            <div style={styles.formGroup}>
              <label htmlFor="courseFilter" style={styles.formLabel}>
                Filter by Course
              </label>
              <select
                id="courseFilter"
                name="courseFilter"
                value={selectedCourseFilter}
                onChange={handleFilterChange}
                style={styles.formSelect}
                className="form-select"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.Name}
                  </option>
                ))}
              </select>
            </div>
            {filteredReviews.length === 0 ? (
              <motion.p
                style={styles.noResults}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }}
              >
                No reviews yet{selectedCourseFilter ? ' for this course' : ''}. Be the first to share your thoughts!
              </motion.p>
            ) : (
              <div style={styles.reviewList}>
                {filteredReviews.map((review, index) => (
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
                      <h3 style={styles.reviewCourse}>
                        {courses.find((course) => course.id === review.course)?.Name || 'Unknown Course'}
                      </h3>
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
    background: 'linear-gradient(to bottom, var(--background), var(--background-secondary))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  header: {
    width: '100%',
    backgroundSize: '200% 200%',
    padding: '24px 0',
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
  rating: {
    display: 'flex',
    alignItems: 'center',
  },
  ratingStars: {
    color: 'var(--highlight)',
    fontSize: '16px',
  },
  ratingEmptyStars: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
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
  formContainer: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px var(--shadow)',
    padding: '24px',
    marginBottom: '40px',
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
    marginBottom: '24px',
  },
  formLabel: {
    color: 'var(--accent)',
    fontWeight: '500',
    fontSize: '14px',
  },
  formSelect: {
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
  },
  successText: {
    color: '#16a34a',
    marginBottom: '16px',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: '16px',
  },
  starContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  star: {
    fontSize: '24px',
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

export default Review;