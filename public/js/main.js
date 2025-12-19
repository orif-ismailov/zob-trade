// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Language dropdown toggle
  const langBtn = document.getElementById('lang-btn');
  const langDropdown = document.getElementById('lang-dropdown');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      langDropdown.classList.add('hidden');
    });

    langDropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
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

  // ========================================
  // Scroll Animations (Intersection Observer)
  // ========================================
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const animation = el.dataset.animate;
          const delay = el.dataset.delay || 0;

          setTimeout(() => {
            el.classList.add('animate-visible');
            el.classList.add(`animate-${animation}`);
          }, delay);

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      el.classList.add('animate-hidden');
      observer.observe(el);
    });
  };

  // Auto-animate sections and cards
  const autoAnimateElements = () => {
    // Animate sections
    document.querySelectorAll('section').forEach((section, index) => {
      if (!section.hasAttribute('data-animate')) {
        section.setAttribute('data-animate', 'fade-up');
        section.setAttribute('data-delay', index * 50);
      }
    });

    // Animate cards with stagger
    document.querySelectorAll('.card, [class*="rounded-xl"][class*="shadow"], [class*="rounded-lg"][class*="bg-white"]').forEach((card, index) => {
      if (!card.hasAttribute('data-animate')) {
        card.setAttribute('data-animate', 'fade-up');
        card.setAttribute('data-delay', (index % 4) * 100);
      }
    });

    // Animate grid items
    document.querySelectorAll('.grid > div').forEach((item, index) => {
      if (!item.hasAttribute('data-animate') && !item.closest('[data-animate]')) {
        item.setAttribute('data-animate', 'fade-up');
        item.setAttribute('data-delay', (index % 6) * 80);
      }
    });
  };

  autoAnimateElements();
  animateOnScroll();

  // ========================================
  // Parallax Effect for Hero Sections
  // ========================================
  const initParallax = () => {
    const heroSections = document.querySelectorAll('section:first-of-type');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      heroSections.forEach(hero => {
        const rate = scrolled * 0.3;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }, { passive: true });
  };

  // Disable parallax on mobile for performance
  if (window.innerWidth > 768) {
    initParallax();
  }

  // ========================================
  // Counter Animation
  // ========================================
  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.counter);
          const duration = 2000;
          const start = 0;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            counter.textContent = current + (counter.dataset.suffix || '');

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + (counter.dataset.suffix || '');
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  };

  animateCounters();

  // ========================================
  // Magnetic Hover Effect for Buttons
  // ========================================
  const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.magnetic-hover, [class*="bg-accent"]');

    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  };

  if (window.innerWidth > 768) {
    initMagneticButtons();
  }
});

// Form validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
}
