/**
 * MAIN JAVASCRIPT
 * Shared logic for Dual-Track Portfolio
 * Ahmed Elaraby
 */

// Global initialization helper
function initializePortfolio() {
    initPreloader();
    initCustomCursor();
    initMagneticButtons();
    initMobileMenu();
    initProjectModals();
    initScrambleText();
    initAboutParallax();
    initServiceSpotlight();
    initStatsCounter();
    initScrollReveal();
    initLightbox();
}

// ... existing code ...

/**
 * 11. Lightbox Glass Engine
 * Handles immersive image zoom with backdrop blur
 */
function initLightbox() {
    // Create overlay if not exists
    let overlay = document.querySelector('.lightbox-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-close"><i class="fas fa-times"></i></div>
            <img src="" class="lightbox-img">
        `;
        document.body.appendChild(overlay);
    }

    const img = overlay.querySelector('.lightbox-img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    // Click triggers (Applied to gallery items and project images)
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.gallery-item img, .card img, .gallery-item, .card');
        
        // If clicking a container, try to find the image inside
        let sourceImg = e.target.tagName === 'IMG' ? e.target : target?.querySelector('img');
        
        if (sourceImg && target) {
            img.src = sourceImg.src;
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scroll
        }
    });

    const closeLightbox = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    // ESC key close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

// Ensure execution regardless of load state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

/**
 * 1. Preloader logic
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 1500); 
    });
}

/**
 * 2. Custom Cursor Implementation
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const addCursorClass = (className) => cursor.classList.add(className);
    const removeCursorClass = (className) => cursor.classList.remove(className);

    const fsSide = document.querySelector('.side-fullstack');
    const mlSide = document.querySelector('.side-ml');

    if (fsSide) {
        fsSide.addEventListener('mouseenter', () => addCursorClass('code'));
        fsSide.addEventListener('mouseleave', () => removeCursorClass('code'));
    }
    if (mlSide) {
        mlSide.addEventListener('mouseenter', () => addCursorClass('data'));
        mlSide.addEventListener('mouseleave', () => removeCursorClass('data'));
    }

    const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

/**
 * 3. Magnetic Buttons Logic
 */
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-wrap');
    
    magnets.forEach(magnet => {
        const btn = magnet.querySelector('.magnetic-btn');
        if (!btn) return;

        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
            magnet.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        magnet.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            magnet.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * 4. Mobile Menu & Active State Logic
 */
function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links') || document.querySelector('.nav-links-wrap');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active'); // Toggle hamburger animation
        });

        // Auto-close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    const bodyClass = document.body.className; 
    if (bodyClass && typeof window.setActiveTrack === 'function') {
        window.setActiveTrack(bodyClass);
    }

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

/**
 * 5. Project Modal Logic
 */
function initProjectModals() {
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModal = document.querySelector('.close-modal');
    const projectBtns = document.querySelectorAll('.magnetic-btn');

    projectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href === '#' || href.includes('javascript')) {
                e.preventDefault();
                showModal(btn.closest('.card'));
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    function showModal(card) {
        if (!card || !modalOverlay) return;
        const titleElement = card.querySelector('.card-title');
        const descElement = card.querySelector('.card-desc');
        
        const title = titleElement ? titleElement.textContent : 'Project Details';
        const desc = descElement ? descElement.textContent : 'No documentation available.';
        
        modalOverlay.querySelector('h2').textContent = title;
        modalOverlay.querySelector('p').textContent = desc;
        modalOverlay.classList.add('active');
    }
}

/**
 * 6. Scramble text effect for headers
 */
function initScrambleText() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*";
    const elements = document.querySelectorAll('.scramble-text');

    elements.forEach(el => {
        let interval = null;
        
        el.onmouseover = event => {  
            let iteration = 0;
            clearInterval(interval);
            
            interval = setInterval(() => {
                event.target.innerText = event.target.innerText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return event.target.dataset.value[index];
                        }
                        return letters[Math.floor(Math.random() * 26)]
                    })
                    .join("");
                
                if(iteration >= event.target.dataset.value.length){ 
                    clearInterval(interval);
                }
                
                iteration += 1 / 3;
            }, 30);
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    el.dispatchEvent(new Event('mouseover'));
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(el);
    });
}

/**
 * 7. Mouse follow parallax for profile container
 */
function initAboutParallax() {
    const container = document.getElementById('profileContainer');
    const aboutSection = document.getElementById('about');
    if (!container || !aboutSection) return;

    document.addEventListener('mousemove', (e) => {
        const rect = aboutSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
    });
}

/**
 * 8. Mouse spotlight effect for service cards
 */
function initServiceSpotlight() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--x', `${x}%`);
            card.style.setProperty('--y', `${y}%`);
        });
    });
}

/**
 * 9. Advanced Counter Animation for Metrics
 */
function initStatsCounter() {
    const counters = document.querySelectorAll('.counter-val');
    const speed = 2000; 

    const animate = (counter) => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const startTime = performance.now();
        
        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / speed, 1);
            
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentValue = easeProgress * target;
            
            if (target % 1 === 0) {
                counter.innerText = Math.floor(currentValue) + suffix;
            } else {
                counter.innerText = currentValue.toFixed(1) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target + suffix; 
                counter.style.filter = 'drop-shadow(0 0 10px var(--fs-accent))';
                setTimeout(() => counter.style.filter = 'none', 1000);
            }
        };

        requestAnimationFrame(updateCount);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); 

    counters.forEach(counter => observer.observe(counter));
}

/**
 * 10. Scroll Reveal Engine
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const staggerItems = document.querySelectorAll('.reveal-stagger-item');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                
                const staggers = entry.target.querySelectorAll('.reveal-stagger-item');
                staggers.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 100);
                });

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => revealObserver.observe(el));
    
    staggerItems.forEach(item => {
        if (!item.closest('.reveal')) {
            revealObserver.observe(item);
        }
    });
}

/**
 * Shared Track Switcher Highlight
 */
window.setActiveTrack = (track) => {
    const btns = document.querySelectorAll('.switcher-btn');
    btns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.track === track) {
            btn.classList.add('active');
        }
    });
};

