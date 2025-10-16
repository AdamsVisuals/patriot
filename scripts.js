// JavaScript for functionality
document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('.patriot-header');
  const logo = document.querySelector('.patriot-logo');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Hamburger menu functionality
  const menuToggle = document.getElementById('patriot-menu-toggle');
  const navigation = document.getElementById('patriot-navigation');
  const menuClose = document.getElementById('patriot-menu-close');
  
  menuToggle.addEventListener('click', function() {
    navigation.classList.add('active');
  });
  
  menuClose.addEventListener('click', function() {
    navigation.classList.remove('active');
  });
  
  // Search functionality
  const searchToggle = document.getElementById('patriot-search-toggle');
  const searchExpandable = document.getElementById('patriot-search-expandable');
  const searchClose = document.getElementById('patriot-search-close');
  
  searchToggle.addEventListener('click', function() {
    searchExpandable.classList.add('active');
  });
  
  searchClose.addEventListener('click', function() {
    searchExpandable.classList.remove('active');
  });
  
  // Close search when clicking outside (except on the search elements)
  document.addEventListener('click', function(event) {
    const isClickInsideSearch = searchExpandable.contains(event.target) || 
                                searchToggle.contains(event.target);
    
    if (!isClickInsideSearch && searchExpandable.classList.contains('active')) {
      searchExpandable.classList.remove('active');
    }
  });
  
  // Close menu when clicking outside (except on the menu elements)
  document.addEventListener('click', function(event) {
    const isClickInsideMenu = navigation.contains(event.target) || 
                              menuToggle.contains(event.target);
    
    if (!isClickInsideMenu && navigation.classList.contains('active')) {
      navigation.classList.remove('active');
    }
  });
  
  // FIXED: Slideshow functionality - CTA Links Issue Resolved
  const slides = document.querySelectorAll('.patriot-slide');
  const indicators = document.querySelectorAll('.patriot-slide-indicator');
  const prevButton = document.querySelector('.patriot-slide-prev');
  const nextButton = document.querySelector('.patriot-slide-next');
  let currentSlide = 0;

  function showSlide(index) {
      // Hide all slides
      slides.forEach(slide => {
          slide.classList.remove('patriot-active');
      });
      
      // Remove active class from all indicators
      indicators.forEach(indicator => {
          indicator.classList.remove('patriot-active');
      });
      
      // Show the selected slide
      slides[index].classList.add('patriot-active');
      indicators[index].classList.add('patriot-active');
      
      currentSlide = index;
  }

  // Next slide
  function nextSlide() {
      let nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
  }

  // Previous slide
  function prevSlide() {
      let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
  }

  // Event listeners for controls - FIXED: Use proper event handling
  nextButton.addEventListener('click', function(e) {
      e.stopPropagation();
      nextSlide();
  });

  prevButton.addEventListener('click', function(e) {
      e.stopPropagation();
      prevSlide();
  });

  // Event listeners for indicators - FIXED: Use proper event handling
  indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function(e) {
          e.stopPropagation();
          showSlide(index);
      });
  });

  // Auto-advance slides (optional)
  let slideInterval = setInterval(nextSlide, 5000);

  // Pause auto-advance on hover
  const heroSection = document.querySelector('.patriot-hero');

  heroSection.addEventListener('mouseenter', function() {
      clearInterval(slideInterval);
  });

  heroSection.addEventListener('mouseleave', function() {
      slideInterval = setInterval(nextSlide, 5000);
  });
  
  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll('.patriot-nav-list a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navigation.classList.remove('active');
    });
  });
  
  // Handle dropdown on touch devices
  const destinationLink = document.querySelector('.patriot-nav-item > a');
  const dropdown = document.querySelector('.patriot-dropdown');
  
  // Add touch event for mobile dropdown
  if ('ontouchstart' in window) {
    let dropdownTimeout;
    
    destinationLink.addEventListener('touchstart', function(e) {
      e.preventDefault();
      
      // Toggle dropdown on tap
      if (dropdown.style.maxHeight && dropdown.style.maxHeight !== '0px') {
        dropdown.style.maxHeight = '0px';
      } else {
        dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
      }
    });
  }
});

// CRITICAL FIX: Ensure CTA links work properly - Add this after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const ctaLinks = document.querySelectorAll('.patriot-slide-cta');
    
    ctaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow the link to work normally - don't prevent default
            console.log('CTA clicked:', this.href);
            // The link will naturally redirect to the href
        });
    });
    
    // Additional safety: Prevent any parent elements from interfering with CTA clicks
    const slides = document.querySelectorAll('.patriot-slide');
    slides.forEach(slide => {
        slide.addEventListener('click', function(e) {
            // If a CTA was clicked, don't do anything else
            if (e.target.closest('.patriot-slide-cta')) {
                return;
            }
        });
    });
});

class PatriotCarousel {
  constructor() {
    this.galleryTrack = document.querySelector('.patriot-gallery-track');
    this.prevBtn = document.querySelector('.patriot-prev-btn');
    this.nextBtn = document.querySelector('.patriot-next-btn');
    this.galleryItems = document.querySelectorAll('.patriot-gallery-item');
    
    this.currentPosition = 0;
    this.itemWidth = 350; // Base width + gap
    this.maxPosition = 0;
    
    this.init();
  }
  
  init() {
    // Calculate max scroll position
    this.calculateMaxPosition();
    
    // Event listeners
    this.prevBtn.addEventListener('click', () => this.scroll('prev'));
    this.nextBtn.addEventListener('click', () => this.scroll('next'));
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.calculateMaxPosition();
      this.updatePosition();
    });
    
    // Intersection Observer for fade-in animation
    this.setupIntersectionObserver();
  }
  
  calculateMaxPosition() {
    const trackWidth = this.galleryTrack.scrollWidth;
    const containerWidth = this.galleryTrack.parentElement.clientWidth;
    this.maxPosition = Math.max(0, trackWidth - containerWidth);
    
    // Update item width based on current viewport
    const firstItem = this.galleryItems[0];
    if (firstItem) {
      const itemStyle = window.getComputedStyle(firstItem);
      const itemWidth = firstItem.offsetWidth;
      const gap = parseInt(itemStyle.marginRight || 0);
      this.itemWidth = itemWidth + gap;
    }
  }
  
  scroll(direction) {
    const containerWidth = this.galleryTrack.parentElement.clientWidth;
    const scrollAmount = Math.floor(containerWidth / this.itemWidth) * this.itemWidth;
    
    if (direction === 'next') {
      this.currentPosition = Math.min(this.currentPosition + scrollAmount, this.maxPosition);
    } else {
      this.currentPosition = Math.max(this.currentPosition - scrollAmount, 0);
    }
    
    this.animateScroll();
    this.updateButtonStates();
  }
  
  animateScroll() {
    this.galleryTrack.style.transform = `translateX(-${this.currentPosition}px)`;
  }
  
  updatePosition() {
    // Ensure current position is still valid after resize
    this.currentPosition = Math.min(this.currentPosition, this.maxPosition);
    this.animateScroll();
    this.updateButtonStates();
  }
  
  updateButtonStates() {
    this.prevBtn.style.opacity = this.currentPosition === 0 ? '0.5' : '1';
    this.nextBtn.style.opacity = this.currentPosition >= this.maxPosition ? '0.5' : '1';
    
    this.prevBtn.style.cursor = this.currentPosition === 0 ? 'not-allowed' : 'pointer';
    this.nextBtn.style.cursor = this.currentPosition >= this.maxPosition ? 'not-allowed' : 'pointer';
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'patriot-fadeIn 0.8s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe gallery items for sequential fade-in
    this.galleryItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.style.opacity = '0';
      observer.observe(item);
    });
  }
}

// Touch/swipe support for mobile
class PatriotTouchHandler {
  constructor(carousel) {
    this.carousel = carousel;
    this.gallery = document.querySelector('.patriot-gallery');
    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;
    
    this.init();
  }
  
  init() {
    this.gallery.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.gallery.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    this.gallery.addEventListener('touchend', () => this.handleTouchEnd());
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.isDragging = true;
  }
  
  handleTouchMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.touches[0].clientX;
  }
  
  handleTouchEnd() {
    if (!this.isDragging) return;
    
    const diff = this.startX - this.currentX;
    const swipeThreshold = 50;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.carousel.scroll('next');
      } else {
        this.carousel.scroll('prev');
      }
    }
    
    this.isDragging = false;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const carousel = new PatriotCarousel();
  new PatriotTouchHandler(carousel);
});

// Fallback for Font Awesome if not loaded
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .patriot-nav-btn::before {
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
    }
    .patriot-prev-btn::before { content: '‹'; }
    .patriot-next-btn::before { content: '›'; }
  `;
  
  // Check if Font Awesome is loaded
  setTimeout(() => {
    const icons = document.querySelectorAll('.patriot-nav-btn i');
    const hasIcons = Array.from(icons).some(icon => window.getComputedStyle(icon).fontFamily.includes('Font Awesome'));
    
    if (!hasIcons) {
      document.head.appendChild(style);
    }
  }, 1000);
});

class PatriotFloatingButton {
  constructor() {
    this.floatingBtn = document.getElementById('patriotBookNowBtn');
    this.bookingModal = document.getElementById('patriotBookingModal');
    this.closeModal = document.querySelector('.patriot-close-modal');
    this.bookingForm = document.getElementById('patriotBookingForm');
    
    this.phoneInput = null;
    this.iti = null;
    this.datePicker = null;
    this.endDatePicker = null;
    
    this.init();
  }
  
  init() {
    // Add pulse animation on load
    setTimeout(() => {
      this.floatingBtn.classList.add('patriot-pulse');
    }, 2000);
    
    // Initialize modal functionality
    this.initModal();
    
    // Initialize form functionality
    this.initForm();
    
    // Handle mobile responsiveness
    this.handleMobileView();
    window.addEventListener('resize', () => this.handleMobileView());
    
    // Add scroll effect - button becomes more compact when scrolling
    this.handleScrollBehavior();
  }
  
  initModal() {
    // Event listeners for modal
    this.floatingBtn.addEventListener('click', () => this.openBookingModal());
    
    if (this.closeModal) {
      this.closeModal.addEventListener('click', () => this.closeBookingModal());
    }
    
    // Close modal when clicking outside
    if (this.bookingModal) {
      this.bookingModal.addEventListener('click', (e) => {
        if (e.target === this.bookingModal) {
          this.closeBookingModal();
        }
      });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.bookingModal.classList.contains('active')) {
        this.closeBookingModal();
      }
    });
  }
  
  initForm() {
    if (!this.bookingForm) return;
    
    // Initialize phone input with country switcher
    this.initPhoneInput();
    
    // Initialize date pickers
    this.initDatePickers();
    
    // Form submission handler
    this.bookingForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    
    // Add input validation
    this.initFormValidation();
  }
  
  initPhoneInput() {
    const phoneInput = document.getElementById('patriotPhone');
    if (phoneInput && window.intlTelInput) {
      this.phoneInput = phoneInput;
      this.iti = window.intlTelInput(phoneInput, {
        initialCountry: "us",
        separateDialCode: true,
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
      });
      
      // Add custom styling for the phone input
      this.stylePhoneInput();
    }
  }
  
  stylePhoneInput() {
    // Add custom styles for the phone input container
    const itiContainer = this.phoneInput.closest('.patriot-form-group');
    if (itiContainer) {
      itiContainer.classList.add('patriot-phone-initialized');
    }
  }
  
  initDatePickers() {
    const startDateInput = document.getElementById('patriotStartDate');
    const endDateInput = document.getElementById('patriotEndDate');
    
    if (startDateInput && window.flatpickr) {
      this.datePicker = flatpickr(startDateInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: (selectedDates, dateStr) => {
          if (this.endDatePicker) {
            this.endDatePicker.set('minDate', dateStr);
          }
        }
      });
    }
    
    if (endDateInput && window.flatpickr) {
      this.endDatePicker = flatpickr(endDateInput, {
        minDate: "today",
        dateFormat: "Y-m-d"
      });
    }
  }
  
  initFormValidation() {
    const inputs = this.bookingForm.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const group = field.closest('.patriot-form-group');
    
    if (!value && field.hasAttribute('required')) {
      group.classList.add('patriot-error');
      return false;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        group.classList.add('patriot-error');
        return false;
      }
    }
    
    group.classList.remove('patriot-error');
    return true;
  }
  
  clearFieldError(field) {
    const group = field.closest('.patriot-form-group');
    group.classList.remove('patriot-error');
  }
  
  async handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = this.validateForm();
    if (!isValid) return;
    
    // Show loading state
    const submitBtn = this.bookingForm.querySelector('.patriot-submit-btn');
    const btnText = submitBtn.querySelector('.patriot-btn-text');
    const btnLoading = submitBtn.querySelector('.patriot-btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    try {
      // Prepare form data
      const formData = new FormData(this.bookingForm);
      
      // Add phone number data
      if (this.iti) {
        const phoneNumber = this.iti.getNumber();
        formData.append('full_phone', phoneNumber);
        formData.append('country_code', this.iti.getSelectedCountryData().iso2);
      }
      
      // Send to backend
      const response = await this.sendFormData(formData);
      
      if (response.success) {
        this.showSuccess();
        this.bookingForm.reset();
        
        // Reset phone input
        if (this.iti) {
          this.iti.setNumber("");
        }
        
        // Close modal after success
        setTimeout(() => {
          this.closeBookingModal();
        }, 2000);
      } else {
        throw new Error(response.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(error.message);
    } finally {
      // Reset button state
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }
  }
  
  validateForm() {
    const requiredFields = this.bookingForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  async sendFormData(formData) {
    // Replace with your actual endpoint
    const response = await fetch('process_booking.php', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  openBookingModal() {
    if (this.bookingModal) {
      this.bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Remove pulse animation when modal opens
      this.floatingBtn.classList.remove('patriot-pulse');
      
      // Reset form when opening modal
      if (this.bookingForm) {
        this.bookingForm.reset();
        if (this.iti) {
          this.iti.setNumber("");
        }
      }
    } else {
      // Fallback action if no modal - redirect to booking page
      window.location.href = '/book-now';
    }
  }
  
  closeBookingModal() {
    if (this.bookingModal) {
      this.bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      
      // Restart pulse animation after modal closes
      setTimeout(() => {
        this.floatingBtn.classList.add('patriot-pulse');
      }, 1000);
    }
  }
  
  handleMobileView() {
    if (window.innerWidth <= 768) {
      this.floatingBtn.classList.add('mobile-icon-only');
    } else {
      this.floatingBtn.classList.remove('mobile-icon-only');
    }
  }
  
  handleScrollBehavior() {
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        // Scrolling down - make button more compact
        this.floatingBtn.style.transform = 'scale(0.95) translateY(-50%)';
        this.floatingBtn.style.opacity = '0.9';
      } else {
        // Scrolling up - restore normal appearance
        this.floatingBtn.style.transform = 'scale(1) translateY(-50%)';
        this.floatingBtn.style.opacity = '1';
      }
      
      lastScrollTop = scrollTop;
    }, { passive: true });
  }
  
  showSuccess() {
    const originalHTML = this.floatingBtn.innerHTML;
    const originalBg = this.floatingBtn.style.background;
    
    this.floatingBtn.innerHTML = '<span class="material-symbols-outlined">check</span> <span class="patriot-btn-text">Booked!</span>';
    this.floatingBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #219653 100%)';
    this.floatingBtn.classList.remove('patriot-pulse');
    
    setTimeout(() => {
      this.floatingBtn.innerHTML = originalHTML;
      this.floatingBtn.style.background = originalBg;
      setTimeout(() => {
        this.floatingBtn.classList.add('patriot-pulse');
      }, 1000);
    }, 3000);
  }
  
  showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'patriot-error-message';
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #e74c3c;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      z-index: 10001;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    errorDiv.textContent = message || 'There was an error submitting your request. Please try again.';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
  
  // Cleanup method for when component is destroyed
  destroy() {
    if (this.iti) {
      this.iti.destroy();
    }
    if (this.datePicker) {
      this.datePicker.destroy();
    }
    if (this.endDatePicker) {
      this.endDatePicker.destroy();
    }
    
    window.removeEventListener('resize', this.handleMobileView);
    window.removeEventListener('scroll', this.handleScrollBehavior);
  }
}

// Alternative simple implementation if no modal needed
function initSimpleFloatingButton() {
  const floatingBtn = document.getElementById('patriotBookNowBtn');
  
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      // Add click animation
      floatingBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        floatingBtn.style.transform = '';
        
        // Redirect to booking page or trigger booking flow
        window.location.href = '/booking';
      }, 150);
    });
    
    // Add pulse animation
    setTimeout(() => {
      floatingBtn.classList.add('patriot-pulse');
    }, 2000);
    
    // Add scroll behavior for simple version too
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        floatingBtn.style.transform = 'scale(0.95)';
        floatingBtn.style.opacity = '0.9';
      } else {
        floatingBtn.style.transform = '';
        floatingBtn.style.opacity = '1';
      }
      
      lastScrollTop = scrollTop;
    }, { passive: true });
  }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Use the full version with modal if available
    if (document.getElementById('patriotBookingModal')) {
      window.patriotFloatingButton = new PatriotFloatingButton();
    } else {
      // Use simple version without modal
      initSimpleFloatingButton();
    }
  } catch (error) {
    console.error('Error initializing Patriot Floating Button:', error);
    // Fallback to simple initialization
    initSimpleFloatingButton();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PatriotFloatingButton, initSimpleFloatingButton };
}

document.addEventListener('DOMContentLoaded', function() {
  const grid = document.querySelector('.destinations-grid');
  const container = document.querySelector('.destinations-container');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');
  const cards = document.querySelectorAll('.destination-card');
  
  const cardWidth = cards[0].offsetWidth + 20; // width + gap
  const visibleCards = Math.floor(container.offsetWidth / cardWidth);
  const totalCards = cards.length;
  let currentPosition = 0;
  const maxPosition = totalCards - visibleCards;
  
  function updateButtons() {
    prevButton.disabled = currentPosition === 0;
    nextButton.disabled = currentPosition >= maxPosition;
  }
  
  function scrollToPosition(position) {
    currentPosition = Math.max(0, Math.min(position, maxPosition));
    const translateX = -currentPosition * cardWidth;
    grid.style.transform = `translateX(${translateX}px)`;
    updateButtons();
  }
  
  prevButton.addEventListener('click', () => {
    scrollToPosition(currentPosition - 1);
  });
  
  nextButton.addEventListener('click', () => {
    scrollToPosition(currentPosition + 1);
  });
  
  // Initialize button states
  updateButtons();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const newVisibleCards = Math.floor(container.offsetWidth / cardWidth);
    const newMaxPosition = Math.max(0, totalCards - newVisibleCards);
    if (currentPosition > newMaxPosition) {
      scrollToPosition(newMaxPosition);
    } else {
      updateButtons();
    }
  });
});

// JavaScript for Auto Year Updater
document.addEventListener('DOMContentLoaded', function() {
  // Auto update copyright year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Add smooth scrolling for footer links
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// JavaScript for Luxury Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.querySelector('.luxury-back-to-top');
  let lastScrollTop = 0;
  let isScrollingDown = true;
  let scrollTimeout;

  function updateBackToTopButton() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    // Determine scroll direction
    isScrollingDown = scrollTop > lastScrollTop;
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    
    // Show/hide button based on scroll position
    if (scrollTop > 300) {
      backToTopButton.classList.add('visible');
      
      // Update fill percentage based on scroll progress
      const fillClass = `scroll-${Math.min(100, Math.floor(scrollPercentage / 10) * 10)}`;
      
      // Remove all scroll percentage classes
      backToTopButton.classList.remove(
        'scroll-10', 'scroll-20', 'scroll-30', 'scroll-40', 'scroll-50',
        'scroll-60', 'scroll-70', 'scroll-80', 'scroll-90', 'scroll-100'
      );
      
      // Add current scroll percentage class
      backToTopButton.classList.add(fillClass);
      
      // Add scrolling direction class
      if (isScrollingDown) {
        backToTopButton.classList.remove('scrolling-up');
      } else {
        backToTopButton.classList.add('scrolling-up');
        
        // Reset fill when scrolling up
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (backToTopButton.classList.contains('scrolling-up')) {
            backToTopButton.classList.remove(
              'scroll-10', 'scroll-20', 'scroll-30', 'scroll-40', 'scroll-50',
              'scroll-60', 'scroll-70', 'scroll-80', 'scroll-90', 'scroll-100'
            );
          }
        }, 100);
      }
    } else {
      backToTopButton.classList.remove('visible');
      backToTopButton.classList.remove(
        'scroll-10', 'scroll-20', 'scroll-30', 'scroll-40', 'scroll-50',
        'scroll-60', 'scroll-70', 'scroll-80', 'scroll-90', 'scroll-100',
        'scrolling-up'
      );
    }
  }

  // Throttled scroll event
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Scroll to top function
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Reset button state immediately
    backToTopButton.classList.remove(
      'scroll-10', 'scroll-20', 'scroll-30', 'scroll-40', 'scroll-50',
      'scroll-60', 'scroll-70', 'scroll-80', 'scroll-90', 'scroll-100',
      'scrolling-up'
    );
  }

  // Event listeners
  if (backToTopButton) {
    window.addEventListener('scroll', throttle(updateBackToTopButton, 50));
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Initialize button state
    updateBackToTopButton();
  }
});

// Leaflet Map Integration
document.addEventListener('DOMContentLoaded', function() {
    // Tanzania center coordinates
    const tanzaniaCenter = [-6.3690, 34.8888];
    
    // Initialize map
    const map = L.map('leafletMap', {
        zoomControl: false,
        attributionControl: false
    }).setView(tanzaniaCenter, 6);

    // Add OpenStreetMap tiles with custom styling
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Custom CSS for map controls
    const customControl = L.control.attribution({position: 'bottomright'});
    customControl.setPrefix('OpenStreetMap');
    customControl.addTo(map);

    // National Parks Data
    const nationalParks = [
        {
            name: "Serengeti National Park",
            position: [-2.3333, 34.8333],
            region: "northern",
            description: "Famous for the Great Migration and vast savannah plains. Home to the Big Five and UNESCO World Heritage Site.",
            highlights: "Great Migration • Big Five • Balloon Safaris"
        },
        {
            name: "Ngorongoro Conservation Area",
            position: [-3.1945, 35.4890],
            region: "northern",
            description: "World's largest intact volcanic caldera with one of the densest populations of large mammals.",
            highlights: "World Heritage Site • Big Five • Crater Floor"
        },
        {
            name: "Tarangire National Park",
            position: [-3.8333, 36.0000],
            region: "northern",
            description: "Known for large elephant herds, ancient baobab trees, and diverse bird species.",
            highlights: "Elephant Herds • Baobab Trees • Bird Watching"
        },
        {
            name: "Lake Manyara National Park",
            position: [-3.5833, 35.7500],
            region: "northern",
            description: "Famous for tree-climbing lions, diverse ecosystems, and flamingo-filled lake.",
            highlights: "Tree Lions • Diverse Habitats • Flamingos"
        },
        {
            name: "Ruaha National Park",
            position: [-7.6833, 34.9333],
            region: "southern",
            description: "Tanzania's largest national park with rugged wilderness and strong lion populations.",
            highlights: "Largest Park • Walking Safaris • Lion Populations"
        },
        {
            name: "Nyerere National Park",
            position: [-8.0000, 38.0000],
            region: "southern",
            description: "Vast wilderness area with rivers, lakes, and excellent boating safari opportunities.",
            highlights: "Boating Safaris • Remote Wilderness • River Systems"
        },
        {
            name: "Katavi National Park",
            position: [-6.8333, 31.2500],
            region: "western",
            description: "Remote park known for massive buffalo herds and dramatic predator-prey interactions.",
            highlights: "Buffalo Herds • Remote • Predator Action"
        },
        {
            name: "Mahale Mountains National Park",
            position: [-6.1333, 29.7500],
            region: "western",
            description: "Home to wild chimpanzees on the shores of Lake Tanganyika in spectacular mountain scenery.",
            highlights: "Chimpanzee Tracking • Lake Tanganyika • Mountains"
        },
        {
            name: "Zanzibar Archipelago",
            position: [-6.1333, 39.3167],
            region: "coastal",
            description: "Pristine beaches, historic Stone Town, and rich cultural heritage with turquoise waters.",
            highlights: "Beaches • Stone Town • Cultural Heritage"
        }
    ];

    // Region colors
    const regionColors = {
        northern: '#e74c3c',
        southern: '#3498db',
        western: '#9b59b6',
        coastal: '#27ae60'
    };

    // Create custom icon function
    function createCustomIcon(region) {
        return L.divIcon({
            className: 'custom-leaflet-marker',
            html: `<div class="marker-pin ${region}" style="background-color: ${regionColors[region]}"></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
    }

    // Create markers for each national park
    nationalParks.forEach(park => {
        const customIcon = createCustomIcon(park.region);
        
        const marker = L.marker(park.position, { icon: customIcon }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="leaflet-popup-content">
                <h3>${park.name}</h3>
                <p>${park.description}</p>
                <p class="highlight">${park.highlights}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            className: 'custom-leaflet-popup',
            maxWidth: 300
        });
    });

    // Custom zoom controls
    document.querySelector('.zoom-in').addEventListener('click', () => {
        map.zoomIn();
    });

    document.querySelector('.zoom-out').addEventListener('click', () => {
        map.zoomOut();
    });

    document.querySelector('.reset-view').addEventListener('click', () => {
        map.setView(tanzaniaCenter, 6);
    });

    // Add scale control
    L.control.scale({
        imperial: false,
        position: 'bottomleft'
    }).addTo(map);
});

// Cookie Consent Functionality
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieModal = document.getElementById('cookieModal');
    const acceptAllBtn = document.getElementById('acceptAll');
    const cookieSettingsBtn = document.getElementById('cookieSettings');
    const modalCloseBtn = document.getElementById('modalClose');
    const savePreferencesBtn = document.getElementById('savePreferences');
    const acceptSelectedBtn = document.getElementById('acceptSelected');
    
    // Check if user has already made a choice
    if (!getCookie('cookie_consent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }
    
    // Accept All Cookies
    acceptAllBtn.addEventListener('click', function() {
        setCookie('cookie_consent', 'all', 365);
        setCookie('analytics_cookies', 'true', 365);
        setCookie('marketing_cookies', 'true', 365);
        setCookie('preferences_cookies', 'true', 365);
        hideBanner();
    });
    
    // Open Settings Modal
    cookieSettingsBtn.addEventListener('click', function() {
        cookieModal.classList.add('show');
    });
    
    // Close Modal
    modalCloseBtn.addEventListener('click', function() {
        cookieModal.classList.remove('show');
    });
    
    // Save Preferences
    savePreferencesBtn.addEventListener('click', function() {
        const analytics = document.getElementById('analyticsCookies').checked;
        const marketing = document.getElementById('marketingCookies').checked;
        const preferences = document.getElementById('preferencesCookies').checked;
        
        setCookie('cookie_consent', 'custom', 365);
        setCookie('analytics_cookies', analytics.toString(), 365);
        setCookie('marketing_cookies', marketing.toString(), 365);
        setCookie('preferences_cookies', preferences.toString(), 365);
        
        cookieModal.classList.remove('show');
        hideBanner();
    });
    
    // Accept Selected
    acceptSelectedBtn.addEventListener('click', function() {
        const analytics = document.getElementById('analyticsCookies').checked;
        const marketing = document.getElementById('marketingCookies').checked;
        const preferences = document.getElementById('preferencesCookies').checked;
        
        setCookie('cookie_consent', 'custom', 365);
        setCookie('analytics_cookies', analytics.toString(), 365);
        setCookie('marketing_cookies', marketing.toString(), 365);
        setCookie('preferences_cookies', preferences.toString(), 365);
        
        cookieModal.classList.remove('show');
        hideBanner();
    });
    
    // Close modal when clicking outside
    cookieModal.addEventListener('click', function(e) {
        if (e.target === cookieModal) {
            cookieModal.classList.remove('show');
        }
    });
    
    function hideBanner() {
        cookieBanner.classList.remove('show');
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 500);
    }
    
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
});