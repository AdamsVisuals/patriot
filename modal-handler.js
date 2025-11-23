// Modal Form Handler for collection pages with Toast Notifications
class ModalFormHandler {
    constructor() {
        this.initForms();
        this.setupToastContainer();
    }

    initForms() {
        // Question Form
        this.questionForm = document.querySelector('.luxury-question-form');
        // Expert Form
        this.expertForm = document.querySelector('.luxury-expert-form');

        this.bindFormEvents();
    }

    bindFormEvents() {
        // Question Form Submission
        if (this.questionForm) {
            this.questionForm.addEventListener('submit', (e) => this.handleFormSubmit(e, 'question'));
        }

        // Expert Form Submission
        if (this.expertForm) {
            this.expertForm.addEventListener('submit', (e) => this.handleFormSubmit(e, 'expert'));
        }
    }

    setupToastContainer() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(toastContainer);
        }
    }

    showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = 'Sending...';
        button.disabled = true;
        return originalText;
    }

    resetButton(button, originalText) {
        button.innerHTML = originalText;
        button.disabled = false;
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const toastId = 'toast-' + Date.now();
        
        // Set styles based on type
        const typeStyles = {
            success: {
                background: '#4CAF50',
                icon: '✓'
            },
            error: {
                background: '#f44336',
                icon: '✕'
            },
            info: {
                background: '#2196F3',
                icon: 'ℹ'
            },
            warning: {
                background: '#ff9800',
                icon: '⚠'
            }
        };

        const style = typeStyles[type] || typeStyles.info;

        toast.id = toastId;
        toast.className = 'luxury-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${style.icon}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        toast.style.cssText = `
            background: ${style.background};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease-out;
            transition: all 0.3s ease;
            max-width: 400px;
        `;

        const toastContent = toast.querySelector('.toast-content');
        toastContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const toastIcon = toast.querySelector('.toast-icon');
        toastIcon.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            flex-shrink: 0;
        `;

        const toastMessage = toast.querySelector('.toast-message');
        toastMessage.style.cssText = `
            flex: 1;
            font-size: 14px;
            line-height: 1.4;
        `;

        const toastClose = toast.querySelector('.toast-close');
        toastClose.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;

        toastClose.addEventListener('mouseenter', () => {
            toastClose.style.opacity = '1';
        });

        toastClose.addEventListener('mouseleave', () => {
            toastClose.style.opacity = '0.8';
        });

        // Add to container
        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.getElementById(toastId)) {
                this.removeToast(toastId);
            }
        }, 5000);

        return toastId;
    }

    removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }

    clearFormErrors(form) {
        const existingErrors = form.querySelectorAll('.field-error');
        existingErrors.forEach(error => error.remove());
        
        const errorInputs = form.querySelectorAll('.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }

    showFieldError(input, message) {
        // Remove existing error for this field
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error class to input
        input.classList.add('error');

        // Create error message element
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            color: #f44336;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;

        input.parentNode.appendChild(errorEl);
    }

    async handleFormSubmit(e, formType) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = this.showLoading(submitBtn);

        // Clear previous errors
        this.clearFormErrors(form);

        const formData = new FormData(form);
        
        // Add form type and page information
        formData.append('form_type', this.getFormType(formType));
        formData.append('page_url', window.location.href);

        try {
            const response = await fetch('../contact-form.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showToast(result.message, 'success');
                form.reset();
                
                // Close modal after successful submission
                const modal = form.closest('.luxury-question-modal, .luxury-expert-modal');
                if (modal) {
                    setTimeout(() => {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }, 1000);
                }
            } else {
                // Show field-specific errors if available
                if (result.errors && Array.isArray(result.errors)) {
                    result.errors.forEach(error => {
                        this.showToast(error, 'error');
                    });
                } else {
                    this.showToast(result.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            this.showToast('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.resetButton(submitBtn, originalText);
        }
    }

    getFormType(formType) {
        const path = window.location.pathname;
        
        if (formType === 'question') {
            return 'question';
        }
        
        // Determine expert form type based on current page
        if (path.includes('beach.html')) return 'beach_expert';
        if (path.includes('cultural.html')) return 'cultural_expert';
        if (path.includes('family-safaris.html')) return 'family_expert';
        if (path.includes('honeymoon.html')) return 'honeymoon_expert';
        if (path.includes('treks.html')) return 'trekking_expert';
        return 'general_expert';
    }
}

// Add CSS animations for toasts
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .luxury-toast {
        animation: slideInRight 0.3s ease-out;
    }
    
    .luxury-toast.slide-out {
        animation: slideOutRight 0.3s ease-in;
    }
    
    /* Responsive design for toasts */
    @media (max-width: 768px) {
        #toast-container {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .luxury-toast {
            max-width: none !important;
        }
    }
    
    /* Form Validation Styles */
    .luxury-form-input.error,
    .luxury-form-textarea.error,
    .luxury-form-select.error {
        border-color: #f44336;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.1);
    }
    
    .field-error {
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    }
    
    /* Loading state */
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(toastStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModalFormHandler();
});