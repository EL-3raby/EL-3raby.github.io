// Simple Image Gallery
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentSlideEl = document.querySelector('.current-slide');
    const totalSlidesEl = document.querySelector('.total-slides');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Initialize
    updateCounter();
    showSlide(currentIndex);
    
    // Event Listeners
    prevBtn.addEventListener('click', showPrevSlide);
    nextBtn.addEventListener('click', showNextSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Functions
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current index
        currentIndex = index;
        
        // Update counter
        updateCounter();
    }
    
    function showPrevSlide() {
        let newIndex = currentIndex - 1;
        if (newIndex < 0) newIndex = totalSlides - 1;
        showSlide(newIndex);
    }
    
    function showNextSlide() {
        let newIndex = currentIndex + 1;
        if (newIndex >= totalSlides) newIndex = 0;
        showSlide(newIndex);
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            showSlide(index);
        }
    }
    
    function updateCounter() {
        if (currentSlideEl) {
            currentSlideEl.textContent = currentIndex + 1;
        }
        if (totalSlidesEl) {
            totalSlidesEl.textContent = totalSlides;
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            showPrevSlide();
        } else if (e.key === 'ArrowRight') {
            showNextSlide();
        }
    });
    
    // Auto-play (optional)
    // setInterval(showNextSlide, 5000);
});