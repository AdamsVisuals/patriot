    // FAQ Interaction
document.addEventListener('DOMContentLoaded', function() {
    const showModalBtn = document.getElementById('showQuestionModal');
    const closeModalBtn = document.getElementById('closeQuestionModal');
    const questionModal = document.getElementById('questionModal');
    const faqItems = document.querySelectorAll('.luxury-faq-item');
    const questionForm = document.querySelector('.luxury-question-form');
    
    // Show question modal
    showModalBtn.addEventListener('click', () => {
        questionModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close question modal
    closeModalBtn.addEventListener('click', () => {
        questionModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    questionModal.addEventListener('click', (e) => {
        if (e.target === questionModal) {
            questionModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // FAQ accordion functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.luxury-faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Form submission
    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            question: document.getElementById('userQuestion').value
        };
        
        // Here you would typically send the data to your server
        console.log('Question submitted:', formData);
        
        // Show success message (you can replace this with actual form submission)
        alert('Thank you for your question! We will get back to you soon.');
        
        // Reset form and close modal
        questionForm.reset();
        questionModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// CTA Modal Interaction with Flatpickr
document.addEventListener('DOMContentLoaded', function() {
    const showModalBtn = document.getElementById('showExpertModal');
    const closeModalBtn = document.getElementById('closeExpertModal');
    const expertModal = document.getElementById('expertModal');
    const expertForm = document.querySelector('.luxury-expert-form');
    
    // Initialize Flatpickr
    const datepicker = flatpickr("#expertDate", {
        minDate: "today",
        dateFormat: "Y-m-d",
        disableMobile: true, // Better UX on mobile
        position: "auto",
        theme: "light", // Matches our design
        appendTo: document.querySelector('.luxury-expert-form'),
        onReady: function(selectedDates, dateStr, instance) {
            // Custom styling for the calendar
            instance.calendarContainer.classList.add('luxury-datepicker');
        }
    });
    
    // Show expert modal
    showModalBtn.addEventListener('click', () => {
        expertModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close expert modal
    closeModalBtn.addEventListener('click', () => {
        expertModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    expertModal.addEventListener('click', (e) => {
        if (e.target === expertModal) {
            expertModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Form submission
    expertForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('expertName').value,
            email: document.getElementById('expertEmail').value,
            phone: document.getElementById('expertPhone').value,
            date: document.getElementById('expertDate').value,
            family: document.getElementById('expertFamily').value,
            message: document.getElementById('expertMessage').value
        };
        
        // Here you would typically send the data to your server
        console.log('Expert contact form submitted:', formData);
        
        // Show success message
        alert('Thank you! Our safari expert will contact you within 24 hours.');
        
        // Reset form and close modal
        expertForm.reset();
        datepicker.clear();
        expertModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Include Flatpickr CSS in head
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
document.head.appendChild(link);

// Include Flatpickr JS
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
script.onload = function() {
    console.log('Flatpickr loaded successfully');
};
document.head.appendChild(script);