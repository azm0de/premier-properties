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
    setupDarkModeDetection();
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

// Dark Mode Detection and Support
function setupDarkModeDetection() {
    // Function to apply dark mode
    function applyDarkMode(isDark) {
        const body = document.body;
        if (isDark) {
            body.classList.add('dark-mode');
            body.setAttribute('data-theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.removeAttribute('data-theme');
        }
    }

    // Check for system preference
    function checkSystemPreference() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Detect dark mode extensions by checking computed styles
    function detectDarkModeExtension() {
        // Create a test element to check if it's being modified by extensions
        const testDiv = document.createElement('div');
        testDiv.style.cssText = 'position: absolute; visibility: hidden; background-color: white; color: black;';
        document.body.appendChild(testDiv);

        const computedStyle = window.getComputedStyle(testDiv);
        const bgColor = computedStyle.backgroundColor;
        const textColor = computedStyle.color;

        document.body.removeChild(testDiv);

        // Check if colors have been inverted (common sign of dark mode extension)
        const bgRGB = bgColor.match(/\d+/g);
        const textRGB = textColor.match(/\d+/g);

        if (bgRGB && textRGB) {
            const bgLuminance = (parseInt(bgRGB[0]) + parseInt(bgRGB[1]) + parseInt(bgRGB[2])) / 3;
            const textLuminance = (parseInt(textRGB[0]) + parseInt(textRGB[1]) + parseInt(textRGB[2])) / 3;

            // Dark background with light text indicates dark mode extension
            return bgLuminance < 128 && textLuminance > 128;
        }

        return false;
    }

    // Check for common dark mode extension classes/attributes
    function detectExtensionClasses() {
        const commonDarkModeSelectors = [
            'html[data-darkreader-mode]',
            'html[data-night-mode]',
            'body.night-mode',
            'body.dark-theme',
            'html.dark',
            '[data-theme="dark"]'
        ];

        return commonDarkModeSelectors.some(selector =>
            document.querySelector(selector) !== null
        );
    }

    // Main detection function
    function detectDarkMode() {
        const systemDark = checkSystemPreference();
        const extensionDark = detectDarkModeExtension() || detectExtensionClasses();

        return systemDark || extensionDark;
    }

    // Initial dark mode detection and application
    function initializeDarkMode() {
        const isDarkMode = detectDarkMode();
        applyDarkMode(isDarkMode);

        // Also check for specific extension mutations
        checkForExtensionChanges();
    }

    // Monitor for changes in dark mode preference
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            applyDarkMode(e.matches || detectDarkModeExtension() || detectExtensionClasses());
        });
    }

    // Monitor for extension changes using MutationObserver
    function checkForExtensionChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;

            mutations.forEach(function(mutation) {
                // Check for attribute changes that might indicate extension activity
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'style' ||
                     mutation.attributeName === 'class' ||
                     mutation.attributeName.startsWith('data-'))) {
                    shouldCheck = true;
                }

                // Check for style modifications
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 &&
                            (node.tagName === 'STYLE' || node.tagName === 'LINK')) {
                            shouldCheck = true;
                        }
                    });
                }
            });

            if (shouldCheck) {
                setTimeout(() => {
                    const isDarkMode = detectDarkMode();
                    applyDarkMode(isDarkMode);
                }, 100); // Small delay to allow extension to finish applying changes
            }
        });

        // Observe changes to html, head, and body
        observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['style', 'class', 'data-darkreader-mode', 'data-night-mode', 'data-theme']
        });

        observer.observe(document.head, {
            childList: true,
            subtree: true
        });
    }

    // Periodic check for extension changes (backup method)
    setInterval(() => {
        const currentMode = document.body.classList.contains('dark-mode');
        const detectedMode = detectDarkMode();

        if (currentMode !== detectedMode) {
            applyDarkMode(detectedMode);
        }
    }, 2000); // Check every 2 seconds

    // Initialize dark mode detection
    initializeDarkMode();

    // Add aggressive Dark Reader override
    forceDarkReaderBackgroundFix();
}

// Aggressive Dark Reader background image fix
function forceDarkReaderBackgroundFix() {
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

    // Function to detect Dark Reader
    function isDarkReaderActive() {
        return document.querySelector('html[data-darkreader-mode]') !== null ||
               document.querySelector('html[data-darkreader-scheme]') !== null ||
               document.documentElement.hasAttribute('data-darkreader-mode') ||
               document.documentElement.hasAttribute('data-darkreader-scheme');
    }

    // Function to force background image
    function forceBackgroundImage() {
        const heroBackground = document.querySelector('.hero-background');
        const heroBefore = document.querySelector('.hero-background::before');

        if (heroBackground) {
            // Add inline styles that are harder for Dark Reader to override
            const styleText = `
                .hero-background::before {
                    background: url('${backgroundImageUrl}') center/cover !important;
                    background-image: url('${backgroundImageUrl}') !important;
                    background-size: cover !important;
                    background-position: center !important;
                    background-repeat: no-repeat !important;
                    filter: brightness(0.6) contrast(1.2) !important;
                    opacity: 1 !important;
                    display: block !important;
                    content: "" !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    z-index: -1 !important;
                    visibility: visible !important;
                }
            `;

            // Create or update a style element with high specificity
            let forceStyle = document.getElementById('force-hero-bg');
            if (!forceStyle) {
                forceStyle = document.createElement('style');
                forceStyle.id = 'force-hero-bg';
                document.head.appendChild(forceStyle);
            }
            forceStyle.textContent = styleText;

            // Check if main background is working
            const computedStyle = window.getComputedStyle(heroBackground, '::before');
            const currentBg = computedStyle.backgroundImage;
            const isBackgroundMissing = currentBg === 'none' || !currentBg.includes('unsplash');

            if (isBackgroundMissing) {
                // Mark as failed to trigger CSS backup
                heroBackground.setAttribute('data-bg-failed', 'true');

                // Create a JavaScript backup background element
                let backupBg = document.getElementById('backup-hero-bg');
                if (!backupBg) {
                    backupBg = document.createElement('div');
                    backupBg.id = 'backup-hero-bg';
                    backupBg.style.cssText = `
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        background: url('${backgroundImageUrl}') center/cover !important;
                        background-image: url('${backgroundImageUrl}') !important;
                        background-size: cover !important;
                        background-position: center !important;
                        background-repeat: no-repeat !important;
                        filter: brightness(0.6) contrast(1.2) !important;
                        z-index: -1 !important;
                        opacity: 1 !important;
                        pointer-events: none !important;
                        display: block !important;
                    `;
                    heroBackground.insertBefore(backupBg, heroBackground.firstChild);
                }

                // Force backup to be visible
                backupBg.style.opacity = '1';
                backupBg.style.zIndex = '-1';
                backupBg.style.display = 'block';
            } else {
                // Background is working, remove failed attribute
                heroBackground.removeAttribute('data-bg-failed');
            }

            // Create an img element as ultimate fallback
            let imgBackup = document.getElementById('img-hero-bg');
            if (!imgBackup && isBackgroundMissing) {
                imgBackup = document.createElement('img');
                imgBackup.id = 'img-hero-bg';
                imgBackup.src = backgroundImageUrl;
                imgBackup.style.cssText = `
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    filter: brightness(0.6) contrast(1.2) !important;
                    z-index: -2 !important;
                    opacity: 1 !important;
                    pointer-events: none !important;
                `;
                heroBackground.appendChild(imgBackup);
            }
        }
    }

    // Check immediately and after delays (Dark Reader sometimes loads slowly)
    if (isDarkReaderActive()) {
        forceBackgroundImage();
    }

    // Check again after short delays
    setTimeout(() => {
        if (isDarkReaderActive()) {
            forceBackgroundImage();
        }
    }, 500);

    setTimeout(() => {
        if (isDarkReaderActive()) {
            forceBackgroundImage();
        }
    }, 1500);

    setTimeout(() => {
        if (isDarkReaderActive()) {
            forceBackgroundImage();
        }
    }, 3000);

    // Monitor for Dark Reader activation
    const darkReaderObserver = new MutationObserver(function(mutations) {
        let shouldFix = false;

        mutations.forEach(function(mutation) {
            // Check for Dark Reader attributes
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'data-darkreader-mode' ||
                 mutation.attributeName === 'data-darkreader-scheme' ||
                 mutation.target.hasAttribute('data-darkreader-mode') ||
                 mutation.target.hasAttribute('data-darkreader-scheme'))) {
                shouldFix = true;
            }

            // Check for style modifications that might remove background
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 &&
                        (node.tagName === 'STYLE' || node.tagName === 'LINK')) {
                        shouldFix = true;
                    }
                });
            }
        });

        if (shouldFix && isDarkReaderActive()) {
            setTimeout(forceBackgroundImage, 50);
        }
    });

    // Observe the entire document for Dark Reader changes
    darkReaderObserver.observe(document.documentElement, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['data-darkreader-mode', 'data-darkreader-scheme', 'style', 'class']
    });

    darkReaderObserver.observe(document.head, {
        childList: true,
        subtree: true
    });

    // Aggressive periodic check specifically for Dark Reader
    setInterval(() => {
        if (isDarkReaderActive()) {
            forceBackgroundImage();
        }
    }, 1000); // Check every second when Dark Reader is active

    // Also check when page becomes visible (Dark Reader sometimes applies changes when tab becomes active)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && isDarkReaderActive()) {
            setTimeout(forceBackgroundImage, 100);
        }
    });

    // Force fix on window focus
    window.addEventListener('focus', function() {
        if (isDarkReaderActive()) {
            setTimeout(forceBackgroundImage, 100);
        }
    });
}

// Export functions for use in other files
window.PremierProperties = {
    toggleMobileMenu,
    animateCounter,
    debounce,
    setupDarkModeDetection
};