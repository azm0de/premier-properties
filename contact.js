// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    setupContactForm();
    setupFAQ();
    setupFormValidation();
    setupFormSubmission();
    initializeContactMap();
}

// Setup Contact Form
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');

    // Add focus/blur effects
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Initialize focused state for pre-filled inputs
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Auto-format phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }

    // Dynamic form fields based on interest
    const interestSelect = document.getElementById('interest');
    if (interestSelect) {
        interestSelect.addEventListener('change', handleInterestChange);
    }
}

// Setup FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });

            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message') || createErrorMessage(formGroup);

    // Clear previous error state
    formGroup.classList.remove('error');
    errorMessage.style.display = 'none';

    // Validate based on field type
    let isValid = true;
    let message = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
        isValid = false;
        message = 'Please enter a valid phone number';
    }

    if (!isValid) {
        formGroup.classList.add('error');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    return isValid;
}

function createErrorMessage(formGroup) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    formGroup.appendChild(errorMessage);
    return errorMessage;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });
}

function handleFormSubmission(form) {
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    // Check privacy policy agreement
    const privacyCheckbox = document.getElementById('privacy');
    if (!privacyCheckbox.checked) {
        isFormValid = false;
        alert('Please agree to the Privacy Policy and Terms of Service');
    }

    if (!isFormValid) {
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    form.classList.add('loading');

    // Simulate form submission
    setTimeout(() => {
        // In a real application, this would send data to a server
        submitForm(form)
            .then(response => {
                showSuccessMessage();
                form.reset();
                clearFormErrors(form);
            })
            .catch(error => {
                showErrorMessage(error.message);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                form.classList.remove('loading');
            });
    }, 2000);
}

// Mock form submission function
function submitForm(form) {
    return new Promise((resolve, reject) => {
        // Simulate API call
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Form submission data:', data);

        // Simulate success (90% of the time)
        if (Math.random() > 0.1) {
            resolve({ success: true, message: 'Form submitted successfully' });
        } else {
            reject(new Error('Submission failed. Please try again.'));
        }
    });
}

function showSuccessMessage() {
    // Create or show success message
    let successMessage = document.querySelector('.success-message');

    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <strong>Thank you for your inquiry!</strong><br>
            We'll contact you within 24 hours to schedule your consultation.
        `;

        const form = document.getElementById('contact-form');
        form.parentNode.insertBefore(successMessage, form);
    }

    successMessage.classList.add('show');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Hide after 10 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 10000);
}

function showErrorMessage(message) {
    alert(`Error: ${message}`);
}

function clearFormErrors(form) {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    });
}

// Utility Functions
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }

    e.target.value = value;
}

function handleInterestChange(e) {
    const value = e.target.value;
    const budgetGroup = document.getElementById('budget').parentElement;
    const timelineGroup = document.getElementById('timeline').parentElement;

    // Show/hide budget and timeline based on interest
    if (value === 'buying' || value === 'investing') {
        budgetGroup.style.display = 'block';
        timelineGroup.style.display = 'block';
    } else if (value === 'selling') {
        budgetGroup.style.display = 'none';
        timelineGroup.style.display = 'block';
    } else {
        budgetGroup.style.display = 'none';
        timelineGroup.style.display = 'none';
    }
}

// Auto-save form data to localStorage (optional feature)
function setupAutoSave() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    const STORAGE_KEY = 'premier-properties-contact-form';

    // Load saved data
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'checkbox') {
                    field.value = data[key];
                } else if (field && field.type === 'checkbox') {
                    field.checked = data[key];
                }
            });
        } catch (e) {
            console.error('Error loading saved form data:', e);
        }
    }

    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', PremierProperties.debounce(() => {
            saveFormData();
        }, 1000));
    });

    function saveFormData() {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Clear saved data on successful submission
    form.addEventListener('formSubmitted', () => {
        localStorage.removeItem(STORAGE_KEY);
    });
}

// Initialize auto-save if desired
// setupAutoSave();

// Google Maps Integration
let googleMap = null;
let googleMapMarker = null;
let googleMapInfoWindow = null;

// Office location
const officeLocation = {
    name: 'Premier Properties',
    address: '123 Business Park Dr, Texarkana, TX 75503',
    phone: '(555) PREMIER',
    email: 'info@premierproperties.com',
    hours: {
        weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
        saturday: 'Saturday: 10:00 AM - 4:00 PM',
        sunday: 'Sunday: By Appointment'
    },
    lat: 33.425,
    lng: -94.048
};

// Load Google Maps API dynamically
function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.google && window.google.maps) {
            console.log('✓ Google Maps API already loaded');
            resolve();
            return;
        }

        // Google Maps API Key
        const apiKey = 'AIzaSyA-nQtBDrlqsQeFAQfqubQh3RSenqLEE0M';

        console.log('Loading Google Maps API...');

        // Create callback function name
        window.initGoogleMapsCallback = function() {
            console.log('✓ Google Maps API callback fired!');
            delete window.initGoogleMapsCallback;
            resolve();
        };

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;

        // Error handling
        script.onerror = function(error) {
            console.error('✗ Failed to load Google Maps API script', error);
            reject(new Error('Failed to load Google Maps API'));
        };

        // Add timeout
        const timeout = setTimeout(() => {
            console.error('✗ Google Maps API loading timeout');
            reject(new Error('Google Maps API loading timeout'));
        }, 15000);

        // Clear timeout on success
        const originalResolve = resolve;
        resolve = function() {
            clearTimeout(timeout);
            originalResolve();
        };

        document.head.appendChild(script);
    });
}

// Create custom marker SVG
function createCustomMarker() {
    const svg = `
        <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 0C11.193 0 0 11.193 0 25c0 17.5 25 35 25 35s25-17.5 25-35C50 11.193 38.807 0 25 0z" fill="#D4AF37"/>
            <circle cx="25" cy="25" r="15" fill="white"/>
            <text x="25" y="30" font-size="16" font-weight="bold" text-anchor="middle" fill="#D4AF37" font-family="Arial, sans-serif">PP</text>
        </svg>
    `;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// Create info window content
function createInfoWindowContent(location) {
    return `
        <div style="font-family: 'Montserrat', sans-serif; padding: 15px; min-width: 280px;">
            <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 1.2rem; font-weight: 600;">
                Premier Properties - Visit Us Here!
            </h3>
            <div style="margin-bottom: 10px; color: #666; line-height: 1.6;">
                <strong style="color: #D4AF37;">Address:</strong><br/>
                ${location.address}
            </div>
            <div style="margin-bottom: 10px; color: #666;">
                <strong style="color: #D4AF37;">Phone:</strong> ${location.phone}<br/>
                <strong style="color: #D4AF37;">Email:</strong> ${location.email}
            </div>
            <div style="margin-bottom: 15px; color: #666; font-size: 0.9rem;">
                <strong style="color: #D4AF37;">Office Hours:</strong><br/>
                ${location.hours.weekdays}<br/>
                ${location.hours.saturday}<br/>
                ${location.hours.sunday}
            </div>
            <div style="display: flex; gap: 10px;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}"
                   target="_blank"
                   style="display: inline-block; background: #D4AF37; color: white; padding: 10px 18px;
                          text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 0.9rem;
                          transition: background 0.3s ease; text-align: center; flex: 1;"
                   onmouseover="this.style.background='#c5a028'"
                   onmouseout="this.style.background='#D4AF37'">
                    Get Directions
                </a>
                <a href="tel:${location.phone.replace(/\D/g, '')}"
                   style="display: inline-block; background: #1a1a1a; color: white; padding: 10px 18px;
                          text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 0.9rem;
                          transition: background 0.3s ease; text-align: center; flex: 1;"
                   onmouseover="this.style.background='#333'"
                   onmouseout="this.style.background='#1a1a1a'">
                    Call Now
                </a>
            </div>
        </div>
    `;
}

// Initialize Google Maps
function initializeContactMap() {
    console.log('=== INITIALIZING CONTACT MAP ===');

    const mapContainer = document.getElementById('contact-map');
    if (!mapContainer) {
        console.error('✗ Map container not found');
        return;
    }
    console.log('✓ Map container found');

    // Load Google Maps API
    loadGoogleMapsAPI()
        .then(() => {
            console.log('✓ API loaded successfully, creating map...');
            createContactMap();
        })
        .catch(error => {
            console.error('✗ Error loading Google Maps:', error);
            showMapError(mapContainer);
        });
}

// Create Google Map with marker
function createContactMap() {
    console.log('=== CREATING CONTACT MAP ===');

    const mapContainer = document.getElementById('contact-map');

    try {
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            throw new Error('Google Maps API not available');
        }

        // Create map
        googleMap = new google.maps.Map(mapContainer, {
            zoom: 15,
            center: { lat: officeLocation.lat, lng: officeLocation.lng },
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });
        console.log('✓ Map instance created');

        // Create marker
        googleMapMarker = new google.maps.Marker({
            position: { lat: officeLocation.lat, lng: officeLocation.lng },
            map: googleMap,
            title: officeLocation.name,
            icon: {
                url: createCustomMarker(),
                scaledSize: new google.maps.Size(50, 60),
                anchor: new google.maps.Point(25, 60)
            },
            animation: google.maps.Animation.DROP
        });
        console.log('✓ Marker created');

        // Create info window
        googleMapInfoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(officeLocation)
        });

        // Add click listener to marker
        googleMapMarker.addListener('click', () => {
            googleMapInfoWindow.open(googleMap, googleMapMarker);
        });

        // Open info window by default after a short delay
        setTimeout(() => {
            googleMapInfoWindow.open(googleMap, googleMapMarker);
        }, 500);

        console.log('=== ✓ CONTACT MAP CREATED SUCCESSFULLY ===');

    } catch (error) {
        console.error('=== ✗ ERROR CREATING CONTACT MAP ===');
        console.error('Error details:', error);
        showMapError(mapContainer);
    }
}

// Show error message
function showMapError(mapContainer) {
    mapContainer.innerHTML = `
        <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            font-family: 'Montserrat', sans-serif;
            padding: 40px 20px;
        ">
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; backdrop-filter: blur(10px); max-width: 500px;">
                <svg style="width: 64px; height: 64px; margin-bottom: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <h3 style="margin: 0 0 15px 0; font-size: 1.5rem;">Unable to Load Map</h3>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">
                    The Google Maps API could not be loaded. Please check your API key configuration.
                </p>
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">
                    You can still visit us at:<br/>
                    ${officeLocation.address}
                </p>
            </div>
        </div>
    `;
}

// Export for potential use in other files
window.ContactPage = {
    validateField,
    submitForm,
    showSuccessMessage,
    initializeContactMap
};