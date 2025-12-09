// Contact Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactModal = document.getElementById('northernContactModal');
    const modalOverlay = document.getElementById('northernModalOverlay');
    const modalClose = document.getElementById('northernModalClose');
    const contactForm = document.getElementById('northernContactForm');
    const submitBtn = document.getElementById('northernSubmitBtn');
    const submitText = submitBtn.querySelector('.northern-submit-text');
    const submitSpinner = submitBtn.querySelector('.northern-submit-spinner');
    const toastContainer = document.getElementById('northernToastContainer');
    
    // Open modal when CTA button is clicked
    document.querySelector('.northern-cta-primary').addEventListener('click', function() {
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal functions
    function closeModal() {
        contactModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Form validation
    function validateField(field, errorElement) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
        
        if (isValid) {
            field.style.borderColor = '#e0e0e0';
            errorElement.classList.remove('show');
        } else {
            field.style.borderColor = '#dc2626';
            errorElement.classList.add('show');
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            input.addEventListener('blur', () => validateField(input, errorElement));
            input.addEventListener('input', () => {
                if (errorElement.classList.contains('show')) {
                    validateField(input, errorElement);
                }
            });
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const errorElement = document.getElementById(field.id + 'Error');
            if (errorElement && !validateField(field, errorElement)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            showToast('error', 'Validation Error', 'Please fill in all required fields correctly.');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitSpinner.style.display = 'block';
        
        try {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Add checkbox values
            data.interests = Array.from(contactForm.querySelectorAll('input[name="interests[]"]:checked'))
                                .map(checkbox => checkbox.value);
            
            const response = await fetch('/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('success', 'Message Sent!', 'We\'ll get back to you within 24 hours.');
                contactForm.reset();
                setTimeout(closeModal, 2000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
            
        } catch (error) {
            console.error('Error:', error);
            showToast('error', 'Error', 'Failed to send message. Please try again or contact us directly.');
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            submitText.style.display = 'block';
            submitSpinner.style.display = 'none';
        }
    });
    
    // Toast notification function
    function showToast(type, title, message) {
        const toast = document.createElement('div');
        toast.className = `northern-toast ${type}`;
        toast.innerHTML = `
            <span class="material-symbols-outlined northern-toast-icon">
                ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'warning'}
            </span>
            <div class="northern-toast-content">
                <h4 class="northern-toast-title">${title}</h4>
                <p class="northern-toast-message">${message}</p>
            </div>
            <button class="northern-toast-close">
                <span class="material-symbols-outlined">close</span>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            removeToast(toast);
        }, 5000);
        
        // Manual close
        const closeBtn = toast.querySelector('.northern-toast-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeToast(toast);
        });
        
        // Remove toast function
        function removeToast(toastElement) {
            toastElement.classList.add('hiding');
            setTimeout(() => {
                if (toastElement.parentNode) {
                    toastElement.parentNode.removeChild(toastElement);
                }
            }, 300);
        }
    }
});

// Safari Planning Modal - Vanilla JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const safariBtn = document.getElementById('safari-planning-btn');
    const safariModal = document.getElementById('safari-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const safariForm = document.getElementById('safari-form');
    const formSubmit = document.getElementById('form-submit');
    const formSpinner = document.getElementById('form-spinner');
    const formMessages = document.getElementById('form-messages');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const messageCloseButtons = document.querySelectorAll('.message-close');
    
    // Open Modal
    safariBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
    
    // Close Modal (multiple ways)
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Close message buttons
    messageCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeMessages();
            if (this.closest('.success')) {
                closeModal();
            }
        });
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !safariModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Form Submission
    safariForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitForm();
    });
    
    // Open Modal Function
    function openModal() {
        safariModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Trigger animation
        setTimeout(() => {
            safariModal.style.opacity = '1';
        }, 10);
    }
    
    // Close Modal Function
    function closeModal() {
        safariModal.style.opacity = '0';
        
        setTimeout(() => {
            safariModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            resetForm();
        }, 300);
    }
    
    // Close Messages Function
    function closeMessages() {
        formMessages.classList.add('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }
    
    // Reset Form Function
    function resetForm() {
        safariForm.reset();
        closeMessages();
    }
    
    // Form Submission Function
    function submitForm() {
        // Validate form
        if (!validateForm()) {
            showError('Please fill in all required fields correctly.');
            return;
        }
        
        // Show loading state
        formSubmit.disabled = true;
        formSpinner.classList.remove('hidden');
        
        // Prepare form data
        const formData = new FormData(safariForm);
        const formObject = {};
        
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        // Send AJAX request
        fetch('send_safari_request.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading state
            formSubmit.disabled = false;
            formSpinner.classList.add('hidden');
            
            if (data.success) {
                showSuccess();
            } else {
                showError(data.message || 'There was an error submitting your request.');
            }
        })
        .catch(error => {
            // Hide loading state
            formSubmit.disabled = false;
            formSpinner.classList.add('hidden');
            
            showError('Network error. Please check your connection and try again.');
            console.error('Error:', error);
        });
    }
    
    // Form Validation Function
    function validateForm() {
        const requiredFields = safariForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#f44336';
                
                field.addEventListener('input', function() {
                    this.style.borderColor = '#d0d0d0';
                }, { once: true });
            }
        });
        
        // Email validation
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailField.value && !emailRegex.test(emailField.value)) {
            isValid = false;
            emailField.style.borderColor = '#f44336';
            showError('Please enter a valid email address.');
            
            emailField.addEventListener('input', function() {
                this.style.borderColor = '#d0d0d0';
            }, { once: true });
        }
        
        return isValid;
    }
    
    // Show Success Message
    function showSuccess() {
        formMessages.classList.remove('hidden');
        successMessage.classList.remove('hidden');
        
        // Scroll to top of modal
        document.querySelector('.modal-content').scrollTop = 0;
    }
    
    // Show Error Message
    function showError(message) {
        formMessages.classList.remove('hidden');
        errorMessage.classList.remove('hidden');
        errorText.textContent = message;
        
        // Scroll to top of modal
        document.querySelector('.modal-content').scrollTop = 0;
    }
    
    // Phone input formatting (optional enhancement)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (!value.startsWith('+')) {
                    value = '+' + value;
                }
                
                // Format as +X (XXX) XXX-XXXX
                if (value.length > 3) {
                    value = value.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4}).*/, '$1 ($2) $3-$4');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Date input formatting (optional enhancement)
    const dateInput = document.getElementById('travel-dates');
    if (dateInput) {
        dateInput.addEventListener('focus', function() {
            this.type = 'text';
            this.addEventListener('blur', function() {
                this.type = 'text';
            });
        });
        
        // Simple date format guidance
        dateInput.setAttribute('title', 'Format: MM/DD/YYYY - MM/DD/YYYY');
    }
});