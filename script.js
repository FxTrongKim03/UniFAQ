document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.header__mobile-toggle');
    const navList = document.querySelector('.header__nav-list');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact__form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // In a real application, you would send the form data to a server
                alert('Thank you for your question! We will get back to you within 24 hours.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Example question click
    const exampleItems = document.querySelectorAll('.examples__item');
    exampleItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            document.querySelector('.header__search-input').value = text;
            
            // Scroll to search
            document.querySelector('.header__search-input').focus();
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'var(--shadow)';
        }
    });

    // Video modal functionality
    const videoTrigger = document.getElementById('videoTrigger');
    const videoModal = document.getElementById('videoModal');
    const closeModal = document.querySelector('.close-modal');
    const youtubeVideo = document.getElementById('youtubeVideo');

    if (videoTrigger && videoModal) {
        // Mở modal khi click vào placeholder
        videoTrigger.addEventListener('click', function() {
            videoModal.style.display = 'block';
            // Thêm video ID thực tế của bạn vào đây
            youtubeVideo.src = "https://www.youtube.com/embed/YgzY7GKN9Yg?autoplay=1";
        });
        
        // Đóng modal
        closeModal.addEventListener('click', function() {
            videoModal.style.display = 'none';
            youtubeVideo.src = ""; // Dừng video khi đóng
        });
        
        // Đóng modal khi click bên ngoài
        window.addEventListener('click', function(event) {
            if (event.target === videoModal) {
                videoModal.style.display = 'none';
                youtubeVideo.src = ""; // Dừng video khi đóng
            }
        });
    }
});