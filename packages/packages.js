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