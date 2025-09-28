// Premier Properties - Main JavaScript File

// Global Variables
let navbar;
let hamburger;
let navMenu;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    setupEventListeners();
    setupScrollEffects();
    setupAnimations();
});

// Initialize all components
function initializeComponents() {
    navbar = document.getElementById('navbar');
    hamburger = document.getElementById('hamburger');
    navMenu = document.getElementById('nav-menu');
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });

    // Window resize handler
    window.addEventListener('resize', handleWindowResize);
}

// Setup scroll effects
function setupScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);

    // Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        setupIntersectionObserver();
    }
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    if (!navbar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Setup intersection observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll(
        '.property-card, .service-card, .team-card, .testimonial-card, .stat-card, .award-card, .section-header'
    );

    animateElements.forEach(el => observer.observe(el));
}

// Setup additional animations
function setupAnimations() {
    // Stagger animation for property cards
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

// Toggle mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Handle smooth scrolling
function handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');

    if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
}

// Handle window resize
function handleWindowResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Animate counter numbers
function animateCounter(element) {
    const text = element.textContent;
    const numberMatch = text.match(/[\d,.]+/);

    if (!numberMatch) return;

    const number = parseFloat(numberMatch[0].replace(/[,.]/g, ''));
    const suffix = text.replace(numberMatch[0], '');
    const duration = 2000;
    const steps = 60;
    const stepValue = number / steps;
    const stepDuration = duration / steps;

    let currentValue = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        currentValue += stepValue;

        if (step >= steps) {
            currentValue = number;
            clearInterval(timer);
        }

        // Format number based on original format
        let formattedNumber;
        if (text.includes('$') && number >= 1000000) {
            formattedNumber = `$${(currentValue / 1000000).toFixed(1)}B`;
        } else if (text.includes('$') && number >= 1000) {
            formattedNumber = `$${(currentValue / 1000).toFixed(1)}M`;
        } else if (number >= 1000) {
            formattedNumber = Math.floor(currentValue).toLocaleString();
        } else if (text.includes('%')) {
            formattedNumber = Math.floor(currentValue) + '%';
        } else {
            formattedNumber = Math.floor(currentValue);
        }

        element.textContent = formattedNumber + (suffix.replace(/[\d,.%$BM+]/g, ''));
    }, stepDuration);
}

// Utility function to debounce events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(handleNavbarScroll, 10);
window.addEventListener('scroll', optimizedScrollHandler);

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // Remove any loading spinners
    const loaders = document.querySelectorAll('.loading');
    loaders.forEach(loader => loader.classList.remove('loading'));
});

// Handle form submissions (basic)
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.classList.contains('contact-form')) {
        // This will be handled by contact.js
        return;
    }

    // Basic form handling for other forms
    e.preventDefault();
    console.log('Form submitted:', form);
});

// Add touch event handlers for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');

    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('.btn, .property-card, .service-card');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });

        button.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }

    // Tab navigation for accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Handle image lazy loading (if needed)
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Export functions for use in other files
window.PremierProperties = {
    toggleMobileMenu,
    animateCounter,
    debounce
};