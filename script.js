// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make logo clickable - navigate to index.html
    const logoContainers = document.querySelectorAll('.logo-container, .footer-logo-container');
    
    logoContainers.forEach(logo => {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    });
    
    // Navigation menu toggle for mobile with improved animation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.hamburger')) {
            
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // Navbar background change on scroll with smooth transition
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        // Check scroll position on page load
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Improved smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - navbarHeight - 20, // Added extra padding
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced Gallery Modal with Image Navigation
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    
    function createModal(imgUrl, imgTitle, index) {
        // Remove any existing modals
        const existingModal = document.querySelector('.image-modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        // Set current index
        currentImageIndex = index;
        
        // Create modal elements
        const modal = document.createElement('div');
        modal.classList.add('image-modal');
        
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        
        const closeBtn = document.createElement('span');
        closeBtn.classList.add('modal-close');
        closeBtn.innerHTML = '&times;';
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = imgTitle;
        
        const caption = document.createElement('p');
        caption.textContent = imgTitle;
        
        // Add navigation buttons if there's more than one image
        if (galleryItems.length > 1) {
            const prevBtn = document.createElement('div');
            prevBtn.classList.add('modal-nav', 'modal-prev');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            
            const nextBtn = document.createElement('div');
            nextBtn.classList.add('modal-nav', 'modal-next');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            
            // Navigation functionality
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateGallery(-1);
            });
            
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigateGallery(1);
            });
            
            modalContent.appendChild(prevBtn);
            modalContent.appendChild(nextBtn);
        }
        
        // Assemble and append modal
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(img);
        modalContent.appendChild(caption);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add animation start
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Close modal functionality with animation
        closeBtn.addEventListener('click', function() {
            closeModal(modal, modalContent);
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal, modalContent);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
    }
    
    function closeModal(modal, modalContent) {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
            document.removeEventListener('keydown', handleKeyDown);
        }, 300);
    }
    
    function navigateGallery(direction) {
        let newIndex = currentImageIndex + direction;
        
        // Loop around if at the ends
        if (newIndex < 0) newIndex = galleryItems.length - 1;
        if (newIndex >= galleryItems.length) newIndex = 0;
        
        const newItem = galleryItems[newIndex];
        const bgImage = newItem.style.backgroundImage;
        if (!bgImage) return;
        
        const imgUrl = bgImage.slice(4, -1).replace(/"/g, "");
        const imgTitleEl = newItem.querySelector('.gallery-overlay h3');
        const imgTitle = imgTitleEl ? imgTitleEl.textContent : 'Gallery Image';
        
        createModal(imgUrl, imgTitle, newIndex);
    }
    
    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.image-modal');
            if (modal) {
                const modalContent = modal.querySelector('.modal-content');
                closeModal(modal, modalContent);
            }
        } else if (e.key === 'ArrowLeft') {
            navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
            navigateGallery(1);
        }
    }
    
    // Make gallery items clickable to open modal
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Extract background image URL
            const bgImage = this.style.backgroundImage;
            if (!bgImage) return;
            
            const imgUrl = bgImage.slice(4, -1).replace(/"/g, "");
            const imgTitleEl = this.querySelector('.gallery-overlay h3');
            const imgTitle = imgTitleEl ? imgTitleEl.textContent : 'Gallery Image';
            
            createModal(imgUrl, imgTitle, index);
        });
    });
    
    // Improved Animation for elements on scroll
    const animatedElements = document.querySelectorAll('.service-card, .property-card, .gallery-item, .contact-card, .about-content p, .section-title');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    }
    
    // Function to handle scroll animations with staggered timing
    function handleScrollAnimations() {
        animatedElements.forEach((element, index) => {
            if (isInViewport(element) && !element.classList.contains('animate')) {
                // Add staggered delay based on element index within its parent
                const siblings = Array.from(element.parentNode.children);
                const siblingIndex = siblings.indexOf(element);
                const delay = siblingIndex * 150; // 150ms delay between siblings
                
                setTimeout(() => {
                    element.classList.add('animate');
                }, delay);
            }
        });
    }
    
    // Add animation class initially
    animatedElements.forEach(element => {
        // Add a base class for animations
        element.classList.add('animate-on-scroll');
    });
    
    // Run on scroll
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Initialize animations on page load
    setTimeout(handleScrollAnimations, 300);
    
    // Add enhanced hover effects for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Add Back to Top button
    const backToTopButton = document.createElement('div');
    backToTopButton.classList.add('back-to-top');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add scroll reveal animations for sections
    const sections = document.querySelectorAll('.section');
    
    function revealSection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-revealed');
                observer.unobserve(entry.target);
            }
        });
    }
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(revealSection, {
            root: null,
            threshold: 0.15
        });
        
        sections.forEach(section => {
            section.classList.add('section-hidden');
            sectionObserver.observe(section);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        sections.forEach(section => {
            section.classList.add('section-revealed');
        });
    }
    
    // Enhance images with loading effect
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Only apply to images that are not yet loaded
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.addEventListener('load', function() {
                img.style.opacity = '1';
            });
        }
    });

    // Mobile-specific enhancements
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Fix 100vh issue on mobile browsers (especially iOS)
        const setVhProperty = () => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        // Set the --vh variable when the page loads and when resizing
        setVhProperty();
        window.addEventListener('resize', setVhProperty);
        
        // Add touch-specific behavior
        document.querySelectorAll('.btn, .nav-links a, .gallery-item, .property-card, .contact-card').forEach(item => {
            item.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            item.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
        
        // Touch swipe detection for gallery modal
        setupSwipeListeners();
        
        // Fix for iOS 100vh issue in hero sections
        fixHeroHeight();
        window.addEventListener('resize', fixHeroHeight);
        window.addEventListener('orientationchange', function() {
            // Small delay to ensure correct height after orientation change
            setTimeout(fixHeroHeight, 300);
        });
        
        // Optimize scroll performance on mobile
        optimizeScrollPerformance();
    }
    
    // Touch swipe detection for gallery modal
    function setupSwipeListeners() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', function(e) {
            const modal = document.querySelector('.image-modal');
            if (modal) {
                touchStartX = e.changedTouches[0].screenX;
            }
        }, false);
        
        document.addEventListener('touchend', function(e) {
            const modal = document.querySelector('.image-modal');
            if (modal) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }
        }, false);
        
        function handleSwipe() {
            const threshold = 50; // Minimum distance required for swipe
            
            if (touchEndX < touchStartX - threshold) {
                // Swiped left, show next image
                navigateGallery(1);
            }
            
            if (touchEndX > touchStartX + threshold) {
                // Swiped right, show previous image
                navigateGallery(-1);
            }
        }
    }
    
    // Fix for iOS 100vh issue in hero sections
    function fixHeroHeight() {
        const heroes = document.querySelectorAll('.hero, .property-hero');
        if (heroes.length === 0) return;
        
        const windowHeight = window.innerHeight;
        heroes.forEach(hero => {
            hero.style.height = `${windowHeight}px`;
        });
    }
    
    // Optimize scroll performance on mobile
    function optimizeScrollPerformance() {
        let ticking = false;
        
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrollPosition = window.scrollY;
                    
                    // Navbar transformation
                    const navbar = document.querySelector('.navbar');
                    if (navbar) {
                        if (scrollPosition > 50) {
                            navbar.classList.add('scrolled');
                        } else {
                            navbar.classList.remove('scrolled');
                        }
                    }
                    
                    // Back to top button visibility
                    const backToTopButton = document.querySelector('.back-to-top');
                    if (backToTopButton) {
                        if (scrollPosition > 500) {
                            backToTopButton.classList.add('visible');
                        } else {
                            backToTopButton.classList.remove('visible');
                        }
                    }
                    
                    // Reset ticking flag
                    ticking = false;
                });
                
                ticking = true;
            }
        }
        
        // Replace regular scroll handlers with optimized version
        window.addEventListener('scroll', onScroll, { passive: true });
    }
});