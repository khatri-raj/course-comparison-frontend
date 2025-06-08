import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaStar, FaGraduationCap, FaQuoteLeft, FaRocket } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const heroBackground = 'https://source.unsplash.com/1920x1080/?education,learning';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, reviewsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/courses/'),
          axios.get('http://localhost:8000/api/reviews/'),
        ]);
        const sortedCourses = coursesResponse.data.sort((a, b) => b.Rating - a.Rating);
        const sortedReviews = reviewsResponse.data.sort((a, b) => b.rating - a.rating).slice(0, 3);
        setCourses(sortedCourses);
        setReviews(sortedReviews);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  const loadMoreCourses = () => {
    setVisibleCourses((prev) => prev + 6);
  };

  const handleViewClick = (courseId) => {
    console.log(`View Details clicked for course ID: ${courseId}`);
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 6px 12px var(--shadow-hover)' },
    tap: { scale: 0.95 },
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
        <p style={styles.loadingText}>Loading...</p>
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

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-section {
          animation: gradientShift 15s ease infinite;
        }
        .course-card, .top-card, .testimonial-card {
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .course-card:hover, .top-card:hover, .testimonial-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 12px 24px var(--shadow-hover);
          background-color: ${theme === 'light' ? '#e0f7fa' : 'var(--card-background)'};
        }
        .course-image {
          transition: transform 0.5s ease, filter 0.3s ease;
        }
        .course-card:hover .course-image, .top-card:hover .course-image {
          transform: scale(1.1);
          filter: brightness(1.15);
        }
        .primary-button, .top-button, .cta-button, .load-more-button {
          transition: all 0.3s ease;
        }
        .primary-button:hover, .top-button:hover, .cta-button:hover, .load-more-button:hover {
          background-color: var(--accent-hover);
          box-shadow: 0 6px 12px var(--shadow-hover);
        }
        .course-link {
          transition: color 0.3s ease;
        }
        .course-link:hover {
          color: var(--accent-hover);
        }
        .course-link:hover .arrow {
          transform: translateX(8px);
        }
        .course-card::after, .top-card::after, .testimonial-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, ${theme === 'light' ? 'rgba(129, 199, 132, 0.1)' : 'var(--accent, 0.1)'}, rgba(255, 255, 255, 0));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .course-card:hover::after, .top-card:hover::after, .testimonial-card:hover::after {
          opacity: 1;
        }
        .top-button, .course-link {
          position: relative;
          z-index: 1;
          pointer-events: auto;
        }
      `}</style>

      <motion.header
        style={{
          ...styles.header,
          backgroundImage: `linear-gradient(to right, var(--accent, 0.6), var(--background-secondary, 0.8)), url(${heroBackground})`,
        }}
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div style={styles.headerContent}>
          <motion.h1 style={styles.heroTitle} variants={heroVariants}>
            {isAuthenticated ? (
              <span>
                Welcome to <span style={styles.highlightText}>Learning!</span>
              </span>
            ) : (
              <span>
                Find Your <span style={styles.highlightText}>Perfect Course</span>
              </span>
            )}
          </motion.h1>
          <motion.p style={styles.heroSubtitle} variants={heroVariants}>
            Discover top courses tailored to your goals with CourseComparison.
          </motion.p>
          <motion.div style={styles.buttonGroup} variants={heroVariants}>
            <Link
              to="/compare"
              style={styles.primaryButton}
              className="primary-button"
            >
              Explore Courses
            </Link>
          </motion.div>
        </div>
      </motion.header>

      <motion.section style={styles.section} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaStar style={styles.icon} /> Top-Rated Courses
        </h2>
        <div style={styles.topCoursesRow}>
          {courses.slice(0, 3).map((course, index) => (
            <motion.div
              key={course.id}
              style={styles.topCard}
              className="top-card"
              variants={cardVariants}
              custom={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                style={{
                  ...styles.courseImage,
                  backgroundImage: `url(${course.image || 'https://source.unsplash.com/400x200/?course'})`,
                }}
                className="course-image"
              ></div>
              <h3 style={styles.courseTitle}>{course.Name}</h3>
              <p style={styles.courseInstitute}>{course.Institute}</p>
              <div style={styles.rating}>
                <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                <span style={styles.ratingText}>({course.Rating})</span>
              </div>
              <Link
                to={`/course/${course.id}`}
                style={styles.topButton}
                className="top-button"
                onClick={() => handleViewClick(course.id)}
              >
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section style={styles.section} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaGraduationCap style={styles.icon} /> Featured Courses
        </h2>
        {courses.length === 0 ? (
          <motion.p style={styles.noResults} initial="hidden" animate="visible" variants={heroVariants}>
            No courses found.
          </motion.p>
        ) : (
          <Slider {...sliderSettings}>
            {courses.slice(0, visibleCourses).map((course, index) => (
              <motion.div
                key={course.id}
                style={styles.courseSlide}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={index}
              >
                <div style={styles.courseCard} className="course-card">
                  <div
                    style={{
                      ...styles.courseImage,
                      backgroundImage: `url(${course.image || 'https://source.unsplash.com/400x200/?course'})`,
                    }}
                    className="course-image"
                  ></div>
                  <h3 style={styles.courseTitle}>{course.Name}</h3>
                  <p style={styles.courseInstitute}>{course.Institute}</p>
                  <div style={styles.rating}>
                    <span style={styles.ratingStars}>{'★'.repeat(Math.round(course.Rating))}</span>
                    <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(course.Rating))}</span>
                    <span style={styles.ratingText}>({course.Rating})</span>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    style={styles.courseLink}
                    className="course-link"
                    onClick={() => handleViewClick(course.id)}
                  >
                    View Details <span style={styles.arrow}>→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </Slider>
        )}
        {visibleCourses < courses.length && courses.length > 6 && (
          <motion.button
            onClick={loadMoreCourses}
            style={styles.loadMoreButton}
            className="load-more-button"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            Load More
          </motion.button>
        )}
      </motion.section>

      <motion.section style={styles.testimonialSection} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaQuoteLeft style={styles.icon} /> Learner Reviews
        </h2>
        <Slider {...testimonialSettings}>
          {reviews.length === 0 ? (
            <motion.div style={styles.noReviews} initial="hidden" animate="visible" variants={heroVariants}>
              <p style={styles.noResults}>No reviews yet. Share your experience!</p>
            </motion.div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                style={styles.testimonialSlide}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                custom={index}
              >
                <div style={styles.testimonialCard} className="testimonial-card">
                  <p style={styles.testimonialText}>"{review.comment}"</p>
                  <div style={styles.rating}>
                    <span style={styles.ratingStars}>{'★'.repeat(Math.round(review.rating))}</span>
                    <span style={styles.ratingEmptyStars}>{'★'.repeat(5 - Math.round(review.rating))}</span>
                  </div>
                  <p style={styles.testimonialUser}>{review.user}</p>
                  <p style={styles.testimonialCourse}>
                    {courses.find((course) => course.id === review.course)?.Name || 'Unknown Course'}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </Slider>
      </motion.section>

      <motion.section style={styles.ctaSection} initial="hidden" animate="visible" variants={heroVariants}>
        <h2 style={styles.sectionTitle}>
          <FaRocket style={styles.icon} /> Start Learning Today
        </h2>
        <p style={styles.ctaText}>Join thousands of learners and achieve your goals.</p>
        <Link
          to={isAuthenticated ? '/dashboard' : '/register'}
          style={styles.ctaButton}
          className="cta-button"
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </Link>
      </motion.section>

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
    flexDirection: 'column',
    gap: '16px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '4px solid var(--accent)',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '18px',
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
    fontSize: '18px',
  },
  header: {
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '80px 0',
    position: 'relative',
    minHeight: '200px',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--button-text)',
    marginBottom: '16px',
  },
  highlightText: {
    color: 'var(--highlight)',
  },
  heroSubtitle: {
    fontSize: '24px',
    color: 'var(--button-text)',
    marginBottom: '32px',
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },
  primaryButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '14px 32px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontSize: '18px',
    display: 'inline-block',
  },
  section: {
    maxWidth: '1280px',
    margin: '0 auto 48px',
    padding: '0 24px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '24px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  topCoursesRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    overflowX: 'auto',
    paddingBottom: '16px',
  },
  topCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
    padding: '24px',
    minWidth: '250px',
    flex: '0 0 auto',
    minHeight: '400px',
  },
  courseImage: {
    height: '200px',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  courseTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  courseInstitute: {
    color: 'var(--text-secondary)',
    fontSize: '18px',
    marginBottom: '8px',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
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
    marginLeft: '8px',
    fontSize: '16px',
  },
  topButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    fontSize: '16px',
  },
  courseSlide: {
    padding: '0 12px',
  },
  courseCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
    padding: '24px',
    margin: '10px',
    minHeight: '400px',
  },
  courseLink: {
    color: 'var(--accent)',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
  },
  arrow: {
    display: 'inline-block',
    transition: 'transform 0.3s ease',
  },
  loadMoreButton: {
    display: 'block',
    margin: '24px auto 0',
    padding: '12px 32px',
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
  },
  noResults: {
    color: 'var(--text-primary)',
    textAlign: 'center',
    fontSize: '20px',
    margin: '24px 0',
  },
  testimonialSection: {
    maxWidth: '1280px',
    margin: '0 auto 48px',
    padding: '32px 24px',
    background: 'var(--background)',
    borderRadius: '12px',
  },
  testimonialSlide: {
    padding: '0 24px',
  },
  testimonialCard: {
    background: 'var(--card-background)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px var(--shadow)',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '720px',
    margin: '0 auto',
    minHeight: '300px',
  },
  testimonialText: {
    color: 'var(--text-primary)',
    fontSize: '20px',
    fontStyle: 'italic',
    marginBottom: '16px',
  },
  testimonialUser: {
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '20px',
  },
  testimonialCourse: {
    color: 'var(--text-secondary)',
    fontSize: '16px',
  },
  noReviews: {
    textAlign: 'center',
  },
  ctaSection: {
    maxWidth: '1280px',
    margin: '0 auto 48px',
    padding: '0 24px',
    textAlign: 'center',
  },
  ctaText: {
    color: 'var(--text-primary)',
    fontSize: '24px',
    maxWidth: '720px',
    margin: '0 auto 24px',
  },
  ctaButton: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    fontWeight: '600',
    padding: '14px 32px',
    borderRadius: '9999px',
    textDecoration: 'none',
    fontSize: '18px',
    display: 'inline-block',
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
    fontSize: '16px',
  },
  icon: {
    width: '32px',
    height: '32px',
    color: 'var(--accent)',
  },
};

export default Home;