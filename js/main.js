// ==========================================
// OWL CAROUSEL INITIALIZATION
// ==========================================
$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        navText: [
            '<i class="fa-solid fa-chevron-left"></i>',
            '<i class="fa-solid fa-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            500: {
                items: 2
            },
            768: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });
});

// ==========================================
// RESPONSIVE NAVIGATION MENU
// ==========================================
const menubar = document.querySelector(".hamburger");
const navlinks = document.querySelector(".nav-links");
let navOpen = false;

// Toggle navigation menu
menubar.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!navOpen) {
        // Open navigation
        navlinks.classList.add("show");
        gsap.to(navlinks, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
        });
        navOpen = true;
    } else {
        // Close navigation
        closeNav();
    }
});

// Close navigation function
function closeNav() {
    gsap.to(navlinks, {
        y: -500,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
            navlinks.classList.remove("show");
            gsap.set(navlinks, { clearProps: "all" });
            navOpen = false;
        }
    });
}

// Close navigation when clicking outside
document.addEventListener('click', function (e) {
    if (navOpen && !navlinks.contains(e.target) && !menubar.contains(e.target)) {
        closeNav();
    }
});

// Close navigation when clicking on a link
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navOpen) {
            closeNav();
        }
    });
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// SCROLL ANIMATIONS (GSAP)
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Fade in sections on scroll
const sections = document.querySelectorAll('.our-services, .benefits, .plans, .companies, .idea');

sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.out'
    });
});

// Animate service cards
gsap.from('.service-item', {
    scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 80%'
    },
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out'
});

// Animate pricing cards
gsap.from('.plan', {
    scrollTrigger: {
        trigger: '.plans-pricing',
        start: 'top 80%'
    },
    opacity: 0,
    scale: 0.9,
    stagger: 0.2,
    duration: 0.6,
    ease: 'back.out(1.7)'
});

// ==========================================
// HEADER SHADOW ON SCROLL
// ==========================================
let lastScroll = 0;
const header = document.querySelector('.header-section');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isDecimal = target % 1 !== 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : Math.ceil(target);
            clearInterval(timer);
        } else {
            element.textContent = isDecimal ? current.toFixed(1) : Math.ceil(current);
        }
    }, 16);
}

// Trigger counter animation when visible
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            if (!isNaN(number)) {
                entry.target.textContent = '0';
                animateCounter(entry.target, number);
            }
        }
    });
}, observerOptions);

// Observe all h1 elements in overview cards
document.querySelectorAll('.overview-1 h1, .overview-3 h1, .overview-2 h1').forEach(counter => {
    counterObserver.observe(counter);
});

// ==========================================
// LAZY LOADING FOR IMAGES
// ==========================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// FORM VALIDATION (if you add forms later)
// ==========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Optimize scroll event listeners
const optimizedScroll = throttle(() => {
    // Your scroll code here
}, 100);

window.addEventListener('scroll', optimizedScroll);

// ==========================================
// CONSOLE MESSAGE (Optional)
// ==========================================
console.log('%cProdmast', 'font-size: 24px; font-weight: bold; color: #153f45;');
console.log('%cThe Future of Manufacturing with Latest Technology', 'font-size: 14px; color: #777c90;');
console.log('%cVisit us ', 'font-size: 12px; color: #e3ffcc;');