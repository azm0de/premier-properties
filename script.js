/* ============================================================================
   Premier Properties — Shared interactions
   Clean, dependency-free. Light theme only (no dark-mode/extension hacks).
   ========================================================================== */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        setupNavbar();
        setupMobileMenu();
        setupSmoothScroll();
        setupScrollReveal();
        setupCounters();
        setCurrentYear();
    });

    /* --- Navbar: solid state on scroll ------------------------------------ */
    function setupNavbar() {
        var navbar = document.getElementById('navbar');
        if (!navbar) return;

        var ticking = false;
        function update() {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    }

    /* --- Mobile menu ------------------------------------------------------ */
    function setupMobileMenu() {
        var hamburger = document.getElementById('hamburger');
        var navMenu = document.getElementById('nav-menu');
        if (!hamburger || !navMenu) return;

        function close() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
        function toggle() {
            var open = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
            hamburger.setAttribute('aria-expanded', String(open));
        }

        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('tabindex', '0');

        hamburger.addEventListener('click', toggle);
        hamburger.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });

        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (navMenu.classList.contains('active')) close();
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) close();
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) close();
        });
    }

    /* --- Smooth scroll for in-page anchors -------------------------------- */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            var id = link.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            link.addEventListener('click', function (e) {
                var target = document.querySelector(id);
                if (!target) return;
                e.preventDefault();
                var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
                var top = target.getBoundingClientRect().top + window.scrollY - navH;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* --- Scroll reveal ---------------------------------------------------- */
    function setupScrollReveal() {
        var items = document.querySelectorAll('[data-reveal]');
        if (!items.length) return;

        if (!('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        items.forEach(function (el, i) {
            // Auto-stagger groups of siblings unless an explicit delay is set
            if (!el.style.getPropertyValue('--reveal-delay') && el.hasAttribute('data-reveal-stagger')) {
                el.style.setProperty('--reveal-delay', (i % 6) * 0.08 + 's');
            }
            observer.observe(el);
        });
    }

    /* --- Animated counters ------------------------------------------------ */
    function setupCounters() {
        var nums = document.querySelectorAll('.stat-number');
        if (!nums.length) return;

        if (!('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        nums.forEach(function (n) { observer.observe(n); });

        function animate(el) {
            var raw = el.textContent.trim();
            var match = raw.match(/[\d,.]+/);
            if (!match) return;

            var target = parseFloat(match[0].replace(/,/g, ''));
            var prefix = raw.slice(0, match.index);
            var suffix = raw.slice(match.index + match[0].length);
            var hasComma = match[0].indexOf(',') > -1;
            var decimals = (match[0].split('.')[1] || '').length;
            var duration = 1600;
            var start = null;

            function frame(ts) {
                if (start === null) start = ts;
                var p = Math.min((ts - start) / duration, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                var val = target * eased;
                var out = decimals ? val.toFixed(decimals) : Math.round(val).toString();
                if (hasComma) out = Number(out).toLocaleString('en-US');
                el.textContent = prefix + out + suffix;
                if (p < 1) requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }
    }

    /* --- Footer year ------------------------------------------------------ */
    function setCurrentYear() {
        document.querySelectorAll('[data-year]').forEach(function (el) {
            el.textContent = new Date().getFullYear();
        });
    }

    window.PremierProperties = { version: '2.0' };
})();
