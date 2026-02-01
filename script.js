// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  // ====================
  // 1. INITIAL SETUP
  // ====================

  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // ====================
  // 2. MOBILE MENU
  // ====================

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      const isActive = navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isActive);
    });
  }

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (navMenu && hamburger) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ====================
  // 3. REMOVE LANGUAGE TOGGLE FUNCTIONALITY
  // ====================

  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    // Hide language toggle since we're English only
    langToggle.style.display = "none";
  }

  // Set document to English only
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";

  // ====================
  // 4. NAVBAR SCROLL EFFECT
  // ====================

  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.backgroundColor = "var(--color-bg-primary)";
        navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      } else {
        navbar.style.backgroundColor = "rgba(13, 17, 23, 0.95)";
        navbar.style.boxShadow = "none";
      }
    }
  });

  // ====================
  // 5. TYPING EFFECT
  // ====================

  function initTypingEffect() {
    const typingText = document.querySelector(".typing-text");
    if (!typingText) return;

    const words = [
      "Machine Learning Engineer",
      "AI Developer",
      "Python Expert",
      "Freelancer",
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentText = words[textIndex];

      if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1500;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % words.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    // Clear any existing timeout
    if (window.typingTimeout) {
      clearTimeout(window.typingTimeout);
    }

    // Start typing effect
    window.typingTimeout = setTimeout(type, 1000);
  }

  // ====================
  // 6. SCROLL ANIMATIONS
  // ====================

  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");

          // Animate skill bars if this is the skills section
          if (entry.target.id === "skills") {
            setTimeout(animateSkillBars, 300);
          }

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.add("section-hidden");
      observer.observe(section);
    });

    // Observe project cards individually for staggered animation
    const projectCards = document.querySelectorAll(".project-card");
    if (projectCards.length > 0) {
      const cardObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(
                () => {
                  entry.target.classList.add("section-visible");
                },
                parseInt(entry.target.dataset.delay || 100),
              );
              cardObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      projectCards.forEach((card, index) => {
        card.dataset.delay = index * 100 + 100;
        cardObserver.observe(card);
      });
    }
  }

  // ====================
  // 7. SMOOTH SCROLL
  // ====================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
          hamburger.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // ====================
  // 8. PROJECT FILTER
  // ====================

  function initProjectFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        this.classList.add("active");

        const filterValue = this.getAttribute("data-filter");

        // Filter projects
        projectCards.forEach((card) => {
          const categories = card.getAttribute("data-category");

          if (filterValue === "all" || categories.includes(filterValue)) {
            card.style.display = "block";

            // Re-add animation class
            setTimeout(() => {
              card.classList.add("section-visible");
            }, 50);
          } else {
            card.classList.remove("section-visible");
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // ====================
  // 9. SKILL BARS ANIMATION
  // ====================

  function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");

    skillBars.forEach((bar) => {
      const width = bar.getAttribute("data-width");
      bar.style.width = "0%";

      setTimeout(() => {
        bar.style.width = width + "%";
        bar.style.transition = "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
      }, 100);
    });
  }

  // ====================
  // 10. FORM VALIDATION AND SUBMISSION
  // ====================

  function initContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    // Prevent default form submission for AJAX
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Reset states
      resetFormState();

      // Validate form
      if (!validateForm()) return;

      // Show loading state
      setLoadingState(true);

      try {
        // Submit form via Formspree
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Success
          showSuccessMessage();
          contactForm.reset();
        } else {
          // Error from Formspree
          throw new Error("Form submission failed");
        }
      } catch (error) {
        // Network error or other issues
        console.error("Form submission error:", error);
        showErrorMessage();
      } finally {
        // Reset loading state
        setLoadingState(false);
      }
    });

    // Helper functions
    function resetFormState() {
      // Remove error classes
      document.querySelectorAll(".form-group").forEach((group) => {
        group.classList.remove("error");
      });

      // Clear error messages
      document.querySelectorAll(".error-message").forEach((msg) => {
        msg.textContent = "";
      });

      // Hide success/error messages
      const successMsg = document.getElementById("formSuccess");
      const errorMsg = document.getElementById("formError");
      if (successMsg) successMsg.style.display = "none";
      if (errorMsg) errorMsg.style.display = "none";
    }

    function validateForm() {
      let isValid = true;

      // Required fields
      const requiredFields = [
        { id: "name", message: "Name is required" },
        { id: "email", message: "Email is required" },
        { id: "message", message: "Message is required" },
      ];

      requiredFields.forEach((field) => {
        const input = document.getElementById(field.id);
        const formGroup = input.closest(".form-group");

        if (!input.value.trim()) {
          formGroup.classList.add("error");
          formGroup.querySelector(".error-message").textContent = field.message;
          isValid = false;
        }
      });

      // Email validation
      const emailInput = document.getElementById("email");
      const emailGroup = emailInput.closest(".form-group");
      const email = emailInput.value.trim();

      if (email && !isValidEmail(email)) {
        emailGroup.classList.add("error");
        emailGroup.querySelector(".error-message").textContent =
          "Please enter a valid email address";
        isValid = false;
      }

      return isValid;
    }

    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function setLoadingState(isLoading) {
      const submitBtn = contactForm.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;

      if (isLoading) {
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      } else {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }

    function showSuccessMessage() {
      const successMsg = document.getElementById("formSuccess");
      if (successMsg) {
        successMsg.style.display = "block";

        // Scroll to success message
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });

        // Hide after 5 seconds
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 5000);
      }
    }

    function showErrorMessage() {
      const errorMsg = document.getElementById("formError");
      if (errorMsg) {
        errorMsg.style.display = "block";

        // Scroll to error message
        errorMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  // ====================
  // 11. COPY CODE FUNCTION
  // ====================

  function initCopyButtons() {
    const copyButtons = document.querySelectorAll(".copy-btn");

    copyButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const codeBlock = this.closest(".code-snippet");
        const code = codeBlock.querySelector("code").textContent;

        navigator.clipboard
          .writeText(code)
          .then(() => {
            // Show feedback
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            this.style.color = "#2eaadc";

            setTimeout(() => {
              this.innerHTML = originalHTML;
              this.style.color = "";
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
            this.innerHTML = '<i class="fas fa-times"></i>';

            setTimeout(() => {
              this.innerHTML = '<i class="far fa-copy"></i>';
            }, 2000);
          });
      });
    });
  }

  // ====================
  // 12. ACTIVE NAV LINK
  // ====================

  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);

  // ====================
  // 13. REDUCED MOTION PREFERENCE
  // ====================

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (prefersReducedMotion.matches) {
    // Disable typing effect
    if (window.typingTimeout) {
      clearTimeout(window.typingTimeout);
    }

    const typingText = document.querySelector(".typing-text");
    if (typingText) {
      typingText.textContent = "Machine Learning Engineer";
    }

    // Disable scroll animations
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.remove("section-hidden");
    });

    // Disable skill bar animations
    const skillBars = document.querySelectorAll(".skill-progress");
    skillBars.forEach((bar) => {
      const width = bar.getAttribute("data-width");
      bar.style.width = width + "%";
      bar.style.transition = "none";
    });
  }

  // ====================
  // 14. SERVICE WORKER REGISTRATION (PWA)
  // ====================

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      // لا تنتظر load event
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration.scope);
        })
        .catch((err) => {
          console.log("SW registration failed: ", err);
        });
    }
  }

  // Initialize service worker
  registerServiceWorker();

  // ====================
  // 15. OFFLINE DETECTION
  // ====================

  function initOfflineDetection() {
    // Update online/offline status
    function updateOnlineStatus() {
      const statusElement = document.getElementById("onlineStatus");
      if (statusElement) {
        if (navigator.onLine) {
          statusElement.style.display = "none";
        } else {
          statusElement.style.display = "block";
          statusElement.textContent =
            "You are offline. Some features may not work.";
        }
      }
    }

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Initial check
    updateOnlineStatus();
  }

  // ====================
  // 16. INITIALIZE EVERYTHING
  // ====================

  // Initialize all functions
  initTypingEffect();
  initScrollAnimations();
  initProjectFilter();
  initCopyButtons();
  initContactForm();
  initOfflineDetection();
  updateActiveNavLink();

  // Add CSS for animations and error states
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-group.error input,
    .form-group.error textarea {
      border-color: #ff4757 !important;
    }
    
    .form-group .error-message {
      color: #ff4757;
      font-size: 0.9rem;
      margin-top: 0.5rem;
      display: none;
    }
    
    .form-group.error .error-message {
      display: block;
    }
    
    .nav-link.active {
      color: var(--color-primary) !important;
    }
    
    .nav-link.active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);

  // ====================
  // 17. PAGE LOAD ANIMATION
  // ====================

  // Fade in page content
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.5s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});
