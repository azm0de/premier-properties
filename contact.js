// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    setupContactForm();
    setupFAQ();
    setupFormValidation();
    setupFormSubmission();
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

// Export for potential use in other files
window.ContactPage = {
    validateField,
    submitForm,
    showSuccessMessage
};