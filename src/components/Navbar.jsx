import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/compare', label: 'Compare' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
    { path: '/help', label: 'Help' },
    ...(isAuthenticated
      ? [
          { path: '/dashboard', label: 'Dashboard' },
          { path: '#', label: 'Logout', onClick: logout },
        ]
      : [
          { path: '/login', label: 'Login' },
          { path: '/register', label: 'Register' },
        ]),
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  return (
    <nav style={{ ...styles.navbar, ...(isScrolled ? styles.navbarScrolled : {}) }}>
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .navbar {
          background: linear-gradient(90deg, var(--accent), var(--mobile-menu-bg), var(--accent));
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
        }
        .nav-link {
          position: relative;
          text-shadow: 0 1px 2px var(--shadow);
          transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-link:hover {
          transform: scale(1.05);
          background: var(--accent-hover);
          box-shadow: 0 4px 8px var(--shadow-hover);
        }
        .nav-link:active {
          transform: scale(0.95);
        }
        .hamburger-icon, .theme-toggle {
          transition: transform 0.3s ease;
        }
        .hamburger-icon:hover, .theme-toggle:hover {
          transform: scale(1.2);
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
            align-items: center;
          }
          .mobile-menu {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
        }
        @media (min-width: 769px) {
          .hamburger {
            display: none;
          }
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
      <div style={styles.container}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <Link to="/" style={styles.logo}>
            Compare<span style={styles.logoHighlight}>IT</span>
          </Link>
        </motion.div>

        <div style={styles.navLinks} className="nav-links">
          {navLinks.map((link, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={linkVariants}
            >
              <Link
                to={link.path}
                onClick={link.onClick || (() => {})}
                style={{
                  ...styles.navLink,
                  ...(location.pathname === link.path && !link.onClick ? styles.activeLink : {}),
                }}
                className="nav-link"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <motion.button
            onClick={toggleTheme}
            style={styles.themeToggle}
            className="theme-toggle"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <FaMoon style={styles.icon} />
            ) : (
              <FaSun style={styles.icon} />
            )}
          </motion.button>
        </div>

        <motion.div
          style={styles.hamburger}
          className="hamburger"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <button onClick={toggleMobileMenu} style={styles.button}>
            {isMobileMenuOpen ? (
              <FaTimes style={styles.icon} className="hamburger-icon" />
            ) : (
              <FaBars style={styles.icon} className="hamburger-icon" />
            )}
          </button>
        </motion.div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              style={styles.mobileMenu}
              className="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => {
                      link.onClick && link.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      ...styles.mobileNavLink,
                      ...(location.pathname === link.path && !link.onClick ? styles.activeMobileLink : {}),
                    }}
                    className="nav-link"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                style={styles.mobileNavLink}
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px var(--shadow)',
    background: 'var(--navbar-bg)',
    transition: 'all 0.3s ease',
    padding: 0,
  },
  navbarScrolled: {
    padding: '8px 0',
    boxShadow: '0 4px 8px var(--shadow-hover)',
    background: 'var(--navbar-bg-scrolled)',
  },
  container: {
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px 16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--button-text)',
    textDecoration: 'none',
    letterSpacing: '1px',
    textShadow: '0 1px 2px var(--shadow)',
    flexShrink: 0,
  },
  logoHighlight: {
    color: 'var(--highlight)',
  },
  navLinks: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    marginRight: 0,
    paddingRight: 0,
  },
  navLink: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--button-text)',
    textDecoration: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    transition: 'background 0.3s ease, color 0.3s ease',
    whiteSpace: 'nowrap',
  },
  activeLink: {
    background: 'var(--card-background)',
    color: 'var(--accent)',
    boxShadow: '0 2px 4px var(--shadow)',
  },
  hamburger: {
    display: 'none',
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: 'var(--button-text)',
  },
  themeToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  mobileMenu: {
    width: '100%',
    background: 'var(--mobile-menu-bg)',
    padding: '16px',
    display: 'none',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 4px 8px var(--shadow)',
    alignItems: 'center',
  },
  mobileNavLink: {
    padding: '12px 16px',
    fontSize: '18px',
    fontWeight: '500',
    color: 'var(--button-text)',
    textDecoration: 'none',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    textShadow: '0 1px 2px var(--shadow)',
    textAlign: 'center',
  },
  activeMobileLink: {
    background: 'var(--highlight)',
    color: 'var(--mobile-menu-bg)',
  },
};

export default Navbar;