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

    // Fallback to show text or emoji alternatives
    function showEmojiFromFallback() {
        const iconElements = document.querySelectorAll('svg.icon use[href^="#icon-"]');

        const iconMap = {
            'icon-facebook': '📘',
            'icon-instagram': '📷',
            'icon-linkedin': '💼',
            'icon-twitter': '🐦',
            'icon-email': '📧',
            'icon-phone': '📞',
            'icon-location': '📍',
            'icon-clock': '🕒',
            'icon-bed': '🛏️',
            'icon-bath': '🚿',
            'icon-area': '📐',
            'icon-garage': '🚗',
            'icon-building': '🏢',
            'icon-beach': '🌊',
            'icon-pool': '🏊',
            'icon-ski': '⛷️',
            'icon-theater': '🎬',
            'icon-trophy': '🏆',
            'icon-chart': '📈',
            'icon-analytics': '📊',
            'icon-target': '🎯',
            'icon-globe': '🌍',
            'icon-crown': '👑',
            'icon-star': '⭐',
            'icon-diamond': '💎',
            'icon-sparkle': '✨',
            'icon-map': '🗺️',
            'icon-parking': '🅿️',
            'icon-metro': '🚇',
            'icon-amenities': '☕'
        };

        iconElements.forEach(useElement => {
            const href = useElement.getAttribute('href');
            const iconName = href.replace('#', '');
            const emoji = iconMap[iconName];

            if (emoji) {
                const svgElement = useElement.closest('svg');
                if (svgElement) {
                    svgElement.outerHTML = emoji;
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