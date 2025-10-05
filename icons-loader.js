// SVG Icons Loader for Premier Properties
// This script loads SVG icons efficiently and provides fallbacks

(function() {
    'use strict';

    // Check if SVG is supported
    function supportsSVG() {
        return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Shape', '1.0');
    }

    // Load SVG sprite
    function loadSVGSprite() {
        // Check if already loaded
        if (document.querySelector('#svg-icons-sprite')) {
            return;
        }

        fetch('icons.svg')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load SVG sprite');
                }
                return response.text();
            })
            .then(data => {
                const div = document.createElement('div');
                div.id = 'svg-icons-sprite';
                div.innerHTML = data;
                div.style.position = 'absolute';
                div.style.width = '0';
                div.style.height = '0';
                div.style.overflow = 'hidden';

                // Insert at the beginning of body
                document.body.insertBefore(div, document.body.firstChild);

                // Mark as loaded
                document.documentElement.classList.add('svg-loaded');

                console.log('SVG icons loaded successfully');
            })
            .catch(error => {
                console.error('Error loading SVG sprite:', error);

                // Add fallback class for styling
                document.documentElement.classList.add('svg-failed');

                // You could implement emoji fallbacks here if needed
                showEmojiFromFallback();
            });
    }

    // Fallback to show professional inline SVG alternatives
    function showEmojiFromFallback() {
        const iconElements = document.querySelectorAll('svg.icon use[href^="#icon-"]');

        const iconMap = {
            'icon-facebook': `<svg viewBox="0 0 24 24" fill="#D4AF37" style="width: 1em; height: 1em;"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
            'icon-instagram': `<svg viewBox="0 0 24 24" fill="#D4AF37" style="width: 1em; height: 1em;"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
            'icon-linkedin': `<svg viewBox="0 0 24 24" fill="#D4AF37" style="width: 1em; height: 1em;"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
            'icon-twitter': `<svg viewBox="0 0 24 24" fill="#D4AF37" style="width: 1em; height: 1em;"><path d="M7.548 22.5c9.056 0 14.01-7.503 14.01-14.01 0-.213 0-.425-.015-.636A10.02 10.02 0 0024 5.305a9.828 9.828 0 01-2.828.776A4.94 4.94 0 0023.337 3.12a9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616 2.5c-2.719 0-4.924 2.205-4.924 4.924 0 .386.043.762.128 1.124C7.728 8.087 4.1 5.245 1.671 1.149a4.93 4.93 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.212"/></svg>`,
            'icon-email': `<svg viewBox="0 0 24 24" fill="#D4AF37" style="width: 1em; height: 1em;"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>`,
            'icon-phone': `<svg viewBox="0 0 24 24" fill="#D4AF37" style="width: 1em; height: 1em;"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102c-.125-.501-.575-.852-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>`,
            'icon-location': `<svg viewBox="0 0 24 24" fill="#D4AF37" style="width: 1em; height: 1em;"><path d="M12 1.5A6.75 6.75 0 005.25 8.25c0 1.85.75 3.525 1.965 4.74L12 17.775l4.785-4.785A6.737 6.737 0 0018.75 8.25 6.75 6.75 0 0012 1.5zm0 9a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"/></svg>`,
            'icon-check': `<svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" style="width: 1em; height: 1em;"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
        };

        iconElements.forEach(useElement => {
            const href = useElement.getAttribute('href');
            const iconName = href.replace('#', '');
            const fallbackSvg = iconMap[iconName];

            if (fallbackSvg) {
                const svgElement = useElement.closest('svg');
                if (svgElement) {
                    svgElement.outerHTML = fallbackSvg;
                }
            }
        });
    }

    // Initialize when DOM is ready
    function init() {
        if (!supportsSVG()) {
            console.warn('SVG not supported, using emoji fallbacks');
            showEmojiFromFallback();
            return;
        }

        loadSVGSprite();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose global function for manual loading if needed
    window.PremierIcons = {
        loadSprite: loadSVGSprite,
        showFallbacks: showEmojiFromFallback
    };

})();