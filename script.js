/* ============================================
   SchooPedia 2.0 — Interactive Script
   ============================================ */

// ======================== LANGUAGE TOGGLE ========================
function toggleLanguage() {
    const body = document.body;
    const html = document.documentElement;

    if (body.classList.contains('lang-ar')) {
        body.classList.remove('lang-ar');
        body.classList.add('lang-en');
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
        localStorage.setItem('schoopedia_lang', 'en');
    } else {
        body.classList.remove('lang-en');
        body.classList.add('lang-ar');
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
        localStorage.setItem('schoopedia_lang', 'ar');
    }
}

// Load saved language preference
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('schoopedia_lang');
    if (savedLang === 'en') {
        document.body.classList.remove('lang-ar');
        document.body.classList.add('lang-en');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
});


// ======================== NAVBAR SCROLL ========================
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function handleNavbarScroll() {
    const currentScrollY = window.pageYOffset;

    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


// ======================== ACTIVE NAV LINK TRACKING ========================
(function initActiveNavTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const mobileLinks = document.querySelectorAll('.mobile-nav-overlay a[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    // Build a map: sectionId → [matching link elements]
    const linkMap = {};
    navLinks.forEach(link => {
        const id = link.getAttribute('href').replace('#', '');
        if (!linkMap[id]) linkMap[id] = [];
        linkMap[id].push(link);
    });
    mobileLinks.forEach(link => {
        const id = link.getAttribute('href').replace('#', '');
        if (!linkMap[id]) linkMap[id] = [];
        linkMap[id].push(link);
    });

    let currentActiveId = null;

    function setActive(sectionId) {
        if (sectionId === currentActiveId) return;
        currentActiveId = sectionId;

        // Clear all
        navLinks.forEach(l => l.classList.remove('active'));
        mobileLinks.forEach(l => l.classList.remove('active'));

        // Set new active
        if (linkMap[sectionId]) {
            linkMap[sectionId].forEach(l => l.classList.add('active'));
        }
    }

    const observer = new IntersectionObserver(
        (entries) => {
            // Pick the entry with the largest intersection ratio
            let best = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!best || entry.intersectionRatio > best.intersectionRatio) {
                        best = entry;
                    }
                }
            });
            if (best) {
                setActive(best.target.id);
            }
        },
        {
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the upper-middle of viewport
            threshold: [0, 0.1, 0.2, 0.3]
        }
    );

    sections.forEach(section => observer.observe(section));
})();


// ======================== MOBILE NAVIGATION ========================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
}

function closeMobileNav() {
    if (mobileNav) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }
}


// ======================== MODAL ========================
function openModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('contactModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeMobileNav();
    }
});


// ======================== SCROLL REVEAL ANIMATIONS ========================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all elements with class 'reveal'
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
});


// ======================== COUNTER ANIMATION ========================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function formatNumber(num) {
        if (num >= 1000000) {
            return '+' + (num / 1000000).toFixed(0) + ',000,000';
        }
        if (num >= 1000) {
            return '+' + num.toLocaleString('en-US');
        }
        return '+' + num;
    }

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = formatNumber(current);

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Observe hero stat counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            if (target) {
                animateCounter(entry.target, target, 2500);
            }
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-target]').forEach(el => {
        counterObserver.observe(el);
    });
});


// ======================== PARTICLES SYSTEM ========================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: -1000, y: -1000 };
        this.animationId = null;
        this.isActive = true;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Performance: pause when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                cancelAnimationFrame(this.animationId);
            } else {
                this.isActive = true;
                this.animate();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        // Reduced count for performance
        const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 25000), 60);

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            '90, 173, 224',   // brand blue
            '139, 77, 158',   // brand purple
            '197, 217, 58',   // brand lime
            '245, 201, 41',   // brand yellow
            '107, 191, 78',   // brand green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(90, 173, 224, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }

            // Mouse interaction — gentle push
            const mdx = p.x - this.mouse.x;
            const mdy = p.y - this.mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mDist < 120) {
                const force = (120 - mDist) / 120;
                p.vx += (mdx / mDist) * force * 0.02;
                p.vy += (mdy / mDist) * force * 0.02;
            }

            // Dampen velocity
            p.vx *= 0.999;
            p.vy *= 0.999;
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Init particles on load
window.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particles-canvas');
});


// ======================== SMOOTH SCROLL FOR NAV LINKS ========================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });
});


// ======================== TYPING EFFECT (Optional Enhancement) ========================
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = wait;
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.textContent = this.txt;

        let typeSpeed = 80;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}


// ======================== PARALLAX ON HERO FLOATING CARDS ========================
document.addEventListener('DOMContentLoaded', () => {
    const floatCards = document.querySelectorAll('.hero-float-card');

    if (floatCards.length > 0 && window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            floatCards.forEach((card, index) => {
                const speed = (index + 1) * 8;
                const translateX = x * speed;
                const translateY = y * speed;
                card.style.transform = `translate(${translateX}px, ${translateY}px)`;
            });
        });
    }
});


// ======================== TILT EFFECT ON CARDS ========================
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 1024) return;

    const cards = document.querySelectorAll('.feature-card, .audience-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});


// ======================== NAVBAR ACTIVE SECTION HIGHLIGHT ========================
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--brand-blue)';
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});


// ======================== PERFORMANCE OPTIMIZATION ========================
// Throttle scroll events
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
    };
}

// Lazy load images with native loading
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            // Don't lazy-load logo and hero images
            const isAboveFold = img.closest('.navbar') || img.closest('.hero');
            if (!isAboveFold) {
                img.setAttribute('loading', 'lazy');
            }
        }
    });

    // Handle Contact Form Submission via FormSubmit (Real Email Delivery)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtns = [document.getElementById('submitBtn'), document.getElementById('submitBtnEn')];

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            // Disable buttons and show loading state
            submitBtns.forEach(btn => {
                if(btn) {
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                    const originalText = btn.innerHTML;
                    btn.dataset.originalText = originalText;
                    btn.innerHTML = btn.lang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
                }
            });

            // Gather form data
            const formData = new FormData(contactForm);

            // Send via fetch to formsubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/moamen.elewa@almotahidaeducation.com", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show success
                formStatus.style.display = 'block';
                formStatus.style.background = 'rgba(107, 191, 78, 0.1)';
                formStatus.style.color = 'var(--brand-green)';
                formStatus.innerHTML = 'Message sent successfully! / تم إرسال الرسالة بنجاح!';
                
                // Reset form
                contactForm.reset();
            })
            .catch(error => {
                // Show error
                formStatus.style.display = 'block';
                formStatus.style.background = 'rgba(220, 53, 69, 0.1)';
                formStatus.style.color = '#dc3545';
                formStatus.innerHTML = 'Error sending message. Please try again. / حدث خطأ أثناء الإرسال.';
            })
            .finally(() => {
                // Restore buttons
                submitBtns.forEach(btn => {
                    if(btn) {
                        btn.disabled = false;
                        btn.style.opacity = '1';
                        if(btn.dataset.originalText) {
                            btn.innerHTML = btn.dataset.originalText;
                        }
                    }
                });

                // Hide status after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            });
        });
    }
});

// ======================== METRICS COUNTER ANIMATION ========================
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter[data-count]');
    const speed = 200; // The lower the slower

    const animateCount = (counter) => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText.replace(/,/g, '');
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc).toLocaleString('en-US');
            setTimeout(() => animateCount(counter), 10);
        } else {
            counter.innerText = "+" + target.toLocaleString('en-US');
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCount(counter);
                observer.unobserve(counter); // Ensure it runs once only
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});
