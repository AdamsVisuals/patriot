// Toast Notification System
class SafariToast {
    constructor() {
        this.container = document.getElementById('safari-toast-container');
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'safari-toast-container';
        this.container.className = 'safari-toast-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', title = '', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `safari-toast ${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <span class="safari-toast-icon material-symbols-outlined">${icon}</span>
            <div class="safari-toast-content">
                ${title ? `<div class="safari-toast-title">${title}</div>` : ''}
                <div class="safari-toast-message">${message}</div>
            </div>
            <button class="safari-toast-close" onclick="this.parentElement.remove()">
                <span class="material-symbols-outlined">close</span>
            </button>
        `;

        this.container.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove if duration is set
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    success(message, title = 'Success!', duration = 5000) {
        return this.show(message, 'success', title, duration);
    }

    error(message, title = 'Error!', duration = 0) {
        return this.show(message, 'error', title, duration);
    }

    warning(message, title = 'Warning!', duration = 5000) {
        return this.show(message, 'warning', title, duration);
    }

    info(message, title = 'Info', duration = 5000) {
        return this.show(message, 'info', title, duration);
    }
}

// Initialize toast system
const safariToast = new SafariToast();

// Tab Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabChips = document.querySelectorAll('.safari-tab-chip');
    const tabPanes = document.querySelectorAll('.safari-tab-pane');
    
    function switchTab(tabId) {
        tabChips.forEach(chip => chip.classList.remove('safari-tab-active'));
        tabPanes.forEach(pane => pane.classList.remove('safari-tab-active'));
        
        document.querySelector(`.safari-tab-chip[data-tab="${tabId}"]`).classList.add('safari-tab-active');
        document.getElementById(tabId).classList.add('safari-tab-active');
    }
    
    tabChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    switchTab('safari-overview');
});

// Prices Functionality
document.addEventListener('DOMContentLoaded', function() {
    const seasonTabs = document.querySelectorAll('.safari-season-tab');
    const seasonPrices = document.querySelectorAll('.safari-season-prices');
    const seasonNotes = document.querySelectorAll('.safari-season-note');

    function initSeasonTabs() {
        seasonTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const season = this.getAttribute('data-season');
                
                seasonTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                seasonPrices.forEach(prices => prices.classList.remove('active'));
                document.querySelectorAll(`.safari-season-prices.${season}-season`).forEach(prices => {
                    prices.classList.add('active');
                });
                
                seasonNotes.forEach(note => note.classList.remove('active'));
                document.querySelector(`.safari-season-note.${season}-season`).classList.add('active');
            });
        });
    }

    initSeasonTabs();
});

// Modal and Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const bookTourBtn = document.getElementById('safari-book-tour-btn');
    const contactExpertBtn = document.getElementById('safari-contact-expert-btn');
    const bookingModal = document.getElementById('safari-booking-modal');
    const contactModal = document.getElementById('safari-contact-modal');
    const modalCloseBtns = document.querySelectorAll('.safari-modal-close');
    const bookingForm = document.getElementById('safari-booking-form');
    const contactForm = document.getElementById('safari-contact-form');
    const submitBtns = document.querySelectorAll('.safari-submit-btn');
    const startDateInput = document.getElementById('safari-start-date');
    const endDateInput = document.getElementById('safari-end-date');

    // Set minimum dates to today
    const today = new Date().toISOString().split('T')[0];
    if (startDateInput) startDateInput.min = today;
    if (endDateInput) endDateInput.min = today;

    // Open modals
    bookTourBtn.addEventListener('click', () => openModal(bookingModal));
    contactExpertBtn.addEventListener('click', () => openModal(contactModal));

    // Close modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.safari-modal-overlay');
            closeModal(modal);
        });
    });

    // Close modal on backdrop click
    [bookingModal, contactModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.safari-modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // Date validation for booking form
    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', function() {
            const startDate = new Date(this.value);
            const minEndDate = new Date(startDate);
            minEndDate.setDate(minEndDate.getDate() + 1);
            
            endDateInput.min = minEndDate.toISOString().split('T')[0];
            
            if (endDateInput.value && new Date(endDateInput.value) < minEndDate) {
                endDateInput.value = '';
            }
        });

        endDateInput.addEventListener('change', function() {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(this.value);
            
            if (endDate <= startDate) {
                safariToast.warning('End date must be after start date');
                this.value = '';
            }
        });
    }

    // Form submissions
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'booking');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(this, 'contact');
        });
    }

    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form validation styles
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => {
                const fields = form.querySelectorAll('input, select, textarea');
                fields.forEach(field => {
                    field.style.borderColor = '#e9ecef';
                });
            });
        }
    }

    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
            } else {
                field.style.borderColor = '#e9ecef';
            }
        });

        return isValid;
    }

    function submitForm(form, type) {
        if (!validateForm(form)) {
            safariToast.error('Please fill in all required fields');
            return;
        }

        const submitBtn = form.querySelector('.safari-submit-btn');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // AJAX submission
        fetch('process-form.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                data: data
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                safariToast.success(
                    type === 'booking' 
                        ? 'Your booking request has been submitted! Our team will contact you within 24 hours.'
                        : 'Your message has been sent to our safari experts! We\'ll get back to you soon.',
                    'Success!'
                );
                form.reset();
                closeModal(form.closest('.safari-modal-overlay'));
            } else {
                safariToast.error(
                    result.message || 'Something went wrong. Please try again.',
                    'Error!'
                );
            }
        })
        .catch(error => {
            console.error('Error:', error);
            safariToast.error(
                'Failed to submit form. Please check your connection and try again.',
                'Network Error!'
            );
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        });
    }

    // Real-time validation
    const forms = document.querySelectorAll('.safari-booking-form');
    forms.forEach(form => {
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#e9ecef';
                }
            });
        });
    });
});