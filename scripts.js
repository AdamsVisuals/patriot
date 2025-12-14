// Enhanced JavaScript with Wilderness Navigation Integration
(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
  } else {
    initializeAll();
  }

  function initializeAll() {
    // Initialize Wilderness Navigation
    initWildernessNavigation();

    // Initialize all other components
    initHeaderScroll();
    initSearchFunctionality();
    initSlideshow();
    initCarousel();
    initFloatingButton();
    initDestinationsCarousel();
    initAutoYearUpdater();
    initFooterSmoothScroll();
    initBackToTopButton();
    initSafariPlanner();
  }

  // ==================== WILDERNESS NAVIGATION ====================
  function initWildernessNavigation() {
    // DOM Elements
    const nav = document.getElementById('wilderness-nav');
    const navClose = document.getElementById('wilderness-nav-close');
    const navItems = document.querySelectorAll('.wilderness-nav-item.has-dropdown');
    const mobileDropdown = document.querySelector('.wilderness-mobile-dropdown');
    const desktopContentPanel = document.querySelector('.wilderness-content-panel');
    const defaultContent = document.querySelector('.wilderness-default-content');
    const dropdownContents = document.querySelectorAll('.wilderness-dropdown-content');
    
    // State management
    let isMobile = false;
    let isNavOpen = false;
    let activeMobileDropdown = null;
    let desktopHoverTimeout = null;
    let isHoveringContentPanel = false;

    /**
     * Check if current viewport is mobile
     * Uses CSS media query for accurate detection
     */
    function checkIsMobile() {
      isMobile = window.matchMedia('(max-width: 1023px)').matches;
    }

    /**
     * Open the main navigation
     */
    function openNav() {
      if (!nav) return;
      nav.classList.add('active');
      document.body.style.overflow = 'hidden';
      isNavOpen = true;
    }

    /**
     * Close the main navigation
     */
    function closeNav() {
      if (!nav) return;
      nav.classList.remove('active');
      document.body.style.overflow = '';
      isNavOpen = false;
      closeAllMobileDropdowns();
    }

    /**
     * Toggle mobile dropdown for a specific nav item
     * @param {HTMLElement} navItem - The clicked navigation item
     */
    function toggleMobileDropdown(navItem) {
      if (!navItem || !mobileDropdown) return;
      
      const dropdownType = navItem.dataset.dropdown;
      if (!dropdownType) return;
      
      const dropdownContent = document.querySelector(`.wilderness-dropdown-content[data-for-dropdown="${dropdownType}"]`);
      if (!dropdownContent) return;
      
      // Close if clicking the same dropdown
      if (activeMobileDropdown === navItem) {
        closeAllMobileDropdowns();
        return;
      }
      
      // Close any open dropdown first
      closeAllMobileDropdowns();
      
      // Clone and prepare dropdown content for mobile
      const clonedContent = dropdownContent.cloneNode(true);
      clonedContent.classList.add('mobile');
      
      // Create back button
      const backButton = document.createElement('button');
      backButton.className = 'wilderness-mobile-back';
      backButton.innerHTML = `
        <span class="material-symbols-outlined">expand_more</span>
        Back to Menu
      `;
      backButton.addEventListener('click', closeAllMobileDropdowns);
      
      // Build mobile dropdown container
      const container = document.createElement('div');
      container.className = 'wilderness-mobile-dropdown-content';
      container.appendChild(backButton);
      container.appendChild(clonedContent);
      
      // Insert into mobile dropdown area
      mobileDropdown.innerHTML = '';
      mobileDropdown.appendChild(container);
      mobileDropdown.classList.add('active');
      
      // Mark nav item as active and update state
      navItem.classList.add('active');
      activeMobileDropdown = navItem;
      
      // Add click handlers to mobile dropdown links
      const mobileLinks = mobileDropdown.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', closeNav);
      });
    }

    /**
     * Close all mobile dropdowns
     */
    function closeAllMobileDropdowns() {
      if (!mobileDropdown) return;
      
      mobileDropdown.classList.remove('active');
      mobileDropdown.innerHTML = '';
      
      navItems.forEach(item => {
        item.classList.remove('active');
      });
      
      activeMobileDropdown = null;
    }

    /**
     * Handle desktop hover for dropdowns
     * @param {HTMLElement} navItem - The hovered navigation item
     * @param {boolean} isEntering - Whether mouse is entering or leaving
     */
    function handleDesktopHover(navItem, isEntering) {
      if (!desktopContentPanel || !defaultContent) return;
      
      clearTimeout(desktopHoverTimeout);
      
      if (isEntering) {
        const dropdownType = navItem.dataset.dropdown;
        if (!dropdownType) return;
        
        // Hide default content
        defaultContent.classList.remove('active');
        
        // Show corresponding dropdown content
        dropdownContents.forEach(content => {
          content.classList.remove('active');
          if (content.dataset.forDropdown === dropdownType) {
            content.classList.add('active');
          }
        });
      } else {
        // Only revert to default if not hovering content panel
        if (!isHoveringContentPanel) {
          desktopHoverTimeout = setTimeout(() => {
            defaultContent.classList.add('active');
            dropdownContents.forEach(content => {
              content.classList.remove('active');
            });
          }, 100);
        }
      }
    }

    /**
     * Initialize desktop hover interactions
     */
    function initDesktopHover() {
      if (!desktopContentPanel || !defaultContent) return;
      
      // Nav item hover events
      navItems.forEach(item => {
        item.addEventListener('mouseenter', () => handleDesktopHover(item, true));
        item.addEventListener('mouseleave', () => handleDesktopHover(item, false));
      });
      
      // Content panel hover events
      desktopContentPanel.addEventListener('mouseenter', () => {
        isHoveringContentPanel = true;
        clearTimeout(desktopHoverTimeout);
      });
      
      desktopContentPanel.addEventListener('mouseleave', () => {
        isHoveringContentPanel = false;
        desktopHoverTimeout = setTimeout(() => {
          defaultContent.classList.add('active');
          dropdownContents.forEach(content => {
            content.classList.remove('active');
          });
        }, 100);
      });
      
      // Reset to default when leaving nav entirely
      nav.addEventListener('mouseleave', () => {
        if (!isHoveringContentPanel) {
          desktopHoverTimeout = setTimeout(() => {
            defaultContent.classList.add('active');
            dropdownContents.forEach(content => {
              content.classList.remove('active');
            });
          }, 100);
        }
      });
    }

    /**
     * Initialize mobile click interactions
     */
    function initMobileClick() {
      // Event delegation for dropdown toggle buttons
      nav.addEventListener('click', (e) => {
        if (!isMobile || !isNavOpen) return;
        
        const toggleBtn = e.target.closest('.wilderness-dropdown-toggle');
        if (!toggleBtn) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const navItem = toggleBtn.closest('.wilderness-nav-item.has-dropdown');
        if (navItem) {
          toggleMobileDropdown(navItem);
        }
      });
      
      // Close mobile dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (!isMobile || !isNavOpen || !activeMobileDropdown) return;
        
        if (!nav.contains(e.target) || e.target.closest('.wilderness-mobile-back')) {
          closeAllMobileDropdowns();
        }
      });
    }

    /**
     * Setup global navigation controls
     */
    function setupGlobalControls() {
      // Hamburger menu toggle (assumed to exist outside nav)
      const menuToggle = document.querySelector('.wilderness-menu-toggle');
      if (menuToggle) {
        menuToggle.addEventListener('click', openNav);
      }
      
      // Close button
      if (navClose) {
        navClose.addEventListener('click', closeNav);
      }
      
      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isNavOpen) {
          closeNav();
        }
      });
      
      // Close nav when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (!isMobile || !isNavOpen) return;
        
        if (!nav.contains(e.target) && !e.target.closest('.wilderness-menu-toggle')) {
          closeNav();
        }
      });
    }

    /**
     * Initialize based on current viewport
     */
    function initViewportBehavior() {
      checkIsMobile();
      
      if (isMobile) {
        // Clean up desktop hover events
        navItems.forEach(item => {
          item.removeEventListener('mouseenter', handleDesktopHover);
          item.removeEventListener('mouseleave', handleDesktopHover);
        });
        
        if (desktopContentPanel) {
          desktopContentPanel.removeEventListener('mouseenter', () => {});
          desktopContentPanel.removeEventListener('mouseleave', () => {});
        }
        
        // Ensure default content is visible on mobile
        if (defaultContent) {
          defaultContent.classList.add('active');
        }
        
        initMobileClick();
      } else {
        // Clean up mobile click events
        closeAllMobileDropdowns();
        initDesktopHover();
      }
    }

    /**
     * Main initialization function for wilderness navigation
     */
    function init() {
      if (!nav) {
        console.error('Wilderness navigation element not found');
        return;
      }
      
      // Initial viewport setup
      initViewportBehavior();
      setupGlobalControls();
      
      // Handle viewport changes
      window.addEventListener('resize', initViewportBehavior);
      window.addEventListener('orientationchange', initViewportBehavior);
      
      // Expose public API
      window.wildernessNav = {
        open: openNav,
        close: closeNav,
        isOpen: () => isNavOpen
      };
    }

    // Initialize wilderness navigation
    if (nav) {
      init();
    }
  }

  // ==================== EXISTING FUNCTIONALITY (UPDATED) ====================

  // Header scroll effect
  function initHeaderScroll() {
    const header = document.querySelector('.patriot-header');
    const logo = document.querySelector('.patriot-logo');
    
    if (header) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  }

  // Search functionality
  function initSearchFunctionality() {
    const searchToggle = document.getElementById('patriot-search-toggle');
    const searchExpandable = document.getElementById('patriot-search-expandable');
    const searchClose = document.getElementById('patriot-search-close');
    
    if (searchToggle && searchExpandable) {
      searchToggle.addEventListener('click', function() {
        searchExpandable.classList.add('active');
      });
    }
    
    if (searchClose && searchExpandable) {
      searchClose.addEventListener('click', function() {
        searchExpandable.classList.remove('active');
      });
    }
    
    // Close search when clicking outside (except on the search elements)
    document.addEventListener('click', function(event) {
      if (searchExpandable) {
        const isClickInsideSearch = searchExpandable.contains(event.target) || 
                                    (searchToggle && searchToggle.contains(event.target));
        
        if (!isClickInsideSearch && searchExpandable.classList.contains('active')) {
          searchExpandable.classList.remove('active');
        }
      }
    });
  }

  // Slideshow functionality
  function initSlideshow() {
    const slides = document.querySelectorAll('.patriot-slide');
    const indicators = document.querySelectorAll('.patriot-slide-indicator');
    const prevButton = document.querySelector('.patriot-slide-prev');
    const nextButton = document.querySelector('.patriot-slide-next');
    
    if (slides.length > 0 && indicators.length > 0) {
      let currentSlide = 0;
      let slideInterval;

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

      // Event listeners for controls
      if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.stopPropagation();
            nextSlide();
        });
      }

      if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.stopPropagation();
            prevSlide();
        });
      }

      // Event listeners for indicators
      indicators.forEach((indicator, index) => {
          indicator.addEventListener('click', function(e) {
              e.stopPropagation();
              showSlide(index);
          });
      });

      // Auto-advance slides (optional)
      slideInterval = setInterval(nextSlide, 5000);

      // Pause auto-advance on hover
      const heroSection = document.querySelector('.patriot-hero');

      if (heroSection) {
        heroSection.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });

        heroSection.addEventListener('mouseleave', function() {
            slideInterval = setInterval(nextSlide, 5000);
        });
      }
      
      // Initialize first slide
      showSlide(0);
    }

    // Ensure CTA links work properly
    document.addEventListener('click', function(e) {
      if (e.target.closest('.patriot-slide-cta')) {
        // Allow the link to work normally
        console.log('CTA clicked:', e.target.href || e.target.closest('.patriot-slide-cta').href);
      }
    });
  }

  // Patriot Carousel
  function initCarousel() {
    class PatriotCarousel {
      constructor() {
        this.galleryTrack = document.querySelector('.patriot-gallery-track');
        this.prevBtn = document.querySelector('.patriot-prev-btn');
        this.nextBtn = document.querySelector('.patriot-next-btn');
        this.galleryItems = document.querySelectorAll('.patriot-gallery-item');
        
        if (this.galleryTrack) {
          this.currentPosition = 0;
          this.itemWidth = 350; // Base width + gap
          this.maxPosition = 0;
          
          this.init();
        }
      }
      
      init() {
        // Calculate max scroll position
        this.calculateMaxPosition();
        
        // Event listeners
        if (this.prevBtn) {
          this.prevBtn.addEventListener('click', () => this.scroll('prev'));
        }
        if (this.nextBtn) {
          this.nextBtn.addEventListener('click', () => this.scroll('next'));
        }
        
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
        if (this.prevBtn) {
          this.prevBtn.style.opacity = this.currentPosition === 0 ? '0.5' : '1';
          this.prevBtn.style.cursor = this.currentPosition === 0 ? 'not-allowed' : 'pointer';
        }
        if (this.nextBtn) {
          this.nextBtn.style.opacity = this.currentPosition >= this.maxPosition ? '0.5' : '1';
          this.nextBtn.style.cursor = this.currentPosition >= this.maxPosition ? 'not-allowed' : 'pointer';
        }
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
        
        if (this.gallery) {
          this.init();
        }
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

    // Initialize carousel when available
    const carousel = new PatriotCarousel();
    if (carousel.galleryTrack) {
      new PatriotTouchHandler(carousel);
    }
  }

  // Patriot Floating Button
  function initFloatingButton() {
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
        
        if (this.floatingBtn) {
          this.init();
        }
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
        
        // Add scroll effect
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
          if (e.key === 'Escape' && this.bookingModal?.classList.contains('active')) {
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
            this.floatingBtn.style.transform = 'scale(0.95)';
            this.floatingBtn.style.opacity = '0.9';
          } else {
            // Scrolling up - restore normal appearance
            this.floatingBtn.style.transform = 'scale(1)';
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
    }

    // Initialize with error handling
    try {
      if (document.getElementById('patriotBookingModal')) {
        window.patriotFloatingButton = new PatriotFloatingButton();
      }
    } catch (error) {
      console.error('Error initializing Patriot Floating Button:', error);
    }
  }

  // Destinations Carousel
  function initDestinationsCarousel() {
    const destinationsGrid = document.querySelector('.destinations-grid');
    if (destinationsGrid) {
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
        if (prevButton) prevButton.disabled = currentPosition === 0;
        if (nextButton) nextButton.disabled = currentPosition >= maxPosition;
      }
      
      function scrollToPosition(position) {
        currentPosition = Math.max(0, Math.min(position, maxPosition));
        const translateX = -currentPosition * cardWidth;
        destinationsGrid.style.transform = `translateX(${translateX}px)`;
        updateButtons();
      }
      
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          scrollToPosition(currentPosition - 1);
        });
      }
      
      if (nextButton) {
        nextButton.addEventListener('click', () => {
          scrollToPosition(currentPosition + 1);
        });
      }
      
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
    }
  }

  // Auto Year Updater
  function initAutoYearUpdater() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // Footer smooth scroll
  function initFooterSmoothScroll() {
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
  }

  // Back to Top Button
  function initBackToTopButton() {
    const backToTopButton = document.querySelector('.luxury-back-to-top');
    if (backToTopButton) {
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
      window.addEventListener('scroll', throttle(updateBackToTopButton, 50));
      backToTopButton.addEventListener('click', scrollToTop);
      
      // Initialize button state
      updateBackToTopButton();
    }
  }

  // Safari Planner
  function initSafariPlanner() {
    class SafariPlanner {
        constructor() {
            this.modal = document.getElementById('safariPlannerModal');
            this.form = document.getElementById('safariPlannerForm');
            this.toast = document.getElementById('safariToast');
            
            if (this.modal && this.form) {
                this.currentStep = 1;
                this.totalSteps = 4;
                this.init();
            }
        }

        init() {
            // Initialize form state first
            this.initializeForm();
            
            // Event Listeners
            document.getElementById('openSafariPlanner')?.addEventListener('click', () => this.openModal());
            document.getElementById('closeSafariPlanner')?.addEventListener('click', () => this.closeModal());
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Step navigation - use event delegation
            this.form.addEventListener('click', (e) => {
                const nextBtn = e.target.closest('.btn-next');
                const prevBtn = e.target.closest('.btn-prev');
                
                if (nextBtn) {
                    e.preventDefault();
                    const nextStep = parseInt(nextBtn.dataset.next);
                    this.goToNextStep(nextStep);
                } else if (prevBtn) {
                    e.preventDefault();
                    const prevStep = parseInt(prevBtn.dataset.prev);
                    this.goToPrevStep(prevStep);
                }
            });

            // Close modal when clicking outside
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.style.display === 'block') {
                    this.closeModal();
                }
            });

            // Update summary when form changes
            this.form.addEventListener('change', () => this.updateSummary());
        }

        initializeForm() {
            // Show only the first step initially
            const allSteps = this.form.querySelectorAll('.form-step');
            allSteps.forEach((step, index) => {
                if (index === 0) {
                    step.style.display = 'block';
                    step.classList.add('active');
                } else {
                    step.style.display = 'none';
                    step.classList.remove('active');
                }
            });
            
            // Initialize progress indicators
            this.updateProgress();
        }

        openModal() {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Reset form state
            this.currentStep = 1;
            this.initializeForm();
            
            // Add opening animation
            this.modal.style.opacity = '0';
            setTimeout(() => {
                this.modal.style.opacity = '1';
                this.modal.style.transition = 'opacity 0.3s ease';
            }, 10);
        }

        closeModal() {
            this.modal.style.opacity = '0';
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.form.reset();
                this.initializeForm(); // Reset to first step
            }, 300);
        }

        goToNextStep(nextStep) {
            if (this.validateCurrentStep()) {
                this.currentStep = nextStep;
                this.showStep(this.currentStep);
                this.updateProgress();
            }
        }

        goToPrevStep(prevStep) {
            this.currentStep = prevStep;
            this.showStep(this.currentStep);
            this.updateProgress();
        }

        validateCurrentStep() {
            const currentStepEl = this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            const requiredFields = currentStepEl.querySelectorAll('[required]');
            
            let isValid = true;
            let firstInvalidField = null;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    this.highlightInvalidField(field);
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                } else {
                    this.removeInvalidHighlight(field);
                }
            });

            if (!isValid) {
                this.showToast('Please fill in all required fields before continuing.', 'error');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
            }

            return isValid;
        }

        highlightInvalidField(field) {
            field.classList.add('invalid');
        }

        removeInvalidHighlight(field) {
            field.classList.remove('invalid');
        }

        showStep(step) {
            console.log('Showing step:', step); // Debug log
            
            // Hide all steps
            const allSteps = this.form.querySelectorAll('.form-step');
            allSteps.forEach(stepEl => {
                stepEl.style.display = 'none';
                stepEl.classList.remove('active');
            });

            // Show current step
            const currentStepEl = this.form.querySelector(`.form-step[data-step="${step}"]`);
            if (currentStepEl) {
                currentStepEl.style.display = 'block';
                currentStepEl.classList.add('active');
                
                // Add fade-in animation
                currentStepEl.style.opacity = '0';
                setTimeout(() => {
                    currentStepEl.style.opacity = '1';
                    currentStepEl.style.transition = 'opacity 0.3s ease';
                }, 50);
                
                // Focus on first input in the step
                const firstInput = currentStepEl.querySelector('input, select, textarea');
                if (firstInput) {
                    setTimeout(() => firstInput.focus(), 100);
                }
            } else {
                console.error('Step element not found for step:', step);
            }

            // Scroll to top of form section
            const formSection = document.querySelector('.safari-planner-form-section');
            if (formSection) {
                formSection.scrollTop = 0;
            }
        }

        updateProgress() {
            // Update step indicators
            const stepIndicators = this.form.querySelectorAll('.step-indicator');
            stepIndicators.forEach((indicator, index) => {
                const stepNumber = index + 1;
                indicator.classList.remove('active', 'completed');
                
                if (stepNumber === this.currentStep) {
                    indicator.classList.add('active');
                } else if (stepNumber < this.currentStep) {
                    indicator.classList.add('completed');
                }
            });
        }

        updateSummary() {
            // Update summary section with current selections
            const travelers = document.getElementById('travelers');
            const duration = document.getElementById('duration');
            const accommodation = document.getElementById('accommodation');

            // Check if summary elements exist before updating
            const summaryTravelers = document.getElementById('summary-travelers');
            const summaryDuration = document.getElementById('summary-duration');
            const summaryAccommodation = document.getElementById('summary-accommodation');

            if (travelers && summaryTravelers) {
                summaryTravelers.textContent = travelers.value ? travelers.options[travelers.selectedIndex]?.text : '-';
            }

            if (duration && summaryDuration) {
                summaryDuration.textContent = duration.value ? duration.options[duration.selectedIndex]?.text : '-';
            }

            if (accommodation && summaryAccommodation) {
                summaryAccommodation.textContent = accommodation.value ? accommodation.options[accommodation.selectedIndex]?.text : '-';
            }
        }

        async handleSubmit(e) {
            e.preventDefault();
            
            // Validate final step before submission
            if (!this.validateCurrentStep()) {
                return;
            }

            const submitBtn = this.form.querySelector('.safari-planner-submit');
            const submitText = submitBtn.querySelector('.submit-text');
            const submitLoader = submitBtn.querySelector('.submit-loader');
            
            // Show loading state
            submitBtn.disabled = true;
            submitText.style.display = 'none';
            submitLoader.style.display = 'flex';

            try {
                const formData = new FormData(this.form);
                const data = Object.fromEntries(formData.entries());
                
                // Handle multiple selections
                data.destinations = Array.from(formData.getAll('destinations[]'));
                data.interests = Array.from(formData.getAll('interests[]'));

                console.log('Submitting data:', data); // Debug log

                const response = await fetch('safari-planner.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                console.log('Server response:', result); // Debug log

                if (result.success) {
                    this.showToast('Thank you! Your safari plan has been submitted successfully. We\'ll contact you soon!', 'success');
                    setTimeout(() => {
                        this.form.reset();
                        this.closeModal();
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Something went wrong. Please try again.');
                }

            } catch (error) {
                console.error('Error:', error);
                this.showToast(error.message || 'Failed to submit your safari plan. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitText.style.display = 'block';
                submitLoader.style.display = 'none';
            }
        }

        validateForm() {
            const requiredFields = this.form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });
            
            return isValid;
        }

        validateField(field) {
            const value = field.value.trim();
            const group = field.closest('.form-group');
            
            if (!value && field.hasAttribute('required')) {
                group.classList.add('invalid');
                return false;
            }
            
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    group.classList.add('invalid');
                    return false;
                }
            }
            
            group.classList.remove('invalid');
            return true;
        }

        showToast(message, type = 'success') {
            if (this.toast) {
                this.toast.textContent = message;
                this.toast.className = `safari-toast ${type} show`;
                
                setTimeout(() => {
                    this.toast.classList.remove('show');
                }, 5000);
            }
        }
    }

    // Initialize Safari Planner
    new SafariPlanner();
  }

  // Export for modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { wildernessNav };
  }
})();