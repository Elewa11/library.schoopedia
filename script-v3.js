/**
 * SchooPedia v3 — Hybrid Premium Interactions
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. PREMIUM CUSTOM CURSOR
    const dot = document.createElement('div');
    const circle = document.createElement('div');
    dot.className = 'cursor-dot';
    circle.className = 'cursor-circle';
    document.body.appendChild(dot);
    document.body.appendChild(circle);

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.opacity = '1';
        circle.style.opacity = '1';
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const animateCursor = () => {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        circle.style.transform = `translate(${circleX - 13}px, ${circleY - 13}px)`;
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Cursor Interactions
    const interactiveElements = document.querySelectorAll('a, button, .premium-card, .btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => circle.classList.add('cursor-active'));
        el.addEventListener('mouseleave', () => circle.classList.remove('cursor-active'));
    });


    // 2. ADVANCED SCROLL REVEAL & STAGGERING
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a stagger parent, ensure children animate
                if (entry.target.classList.contains('stagger')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.transitionDelay = `${i * 0.1}s`;
                    }
                }
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.05,
        rootMargin: '0px'
    });

    document.querySelectorAll('[data-reveal], .stagger').forEach(el => {
        revealObserver.observe(el);
    });

    // Mark as ready
    document.body.classList.add('js-ready');


    // 3. PARALLAX EFFECTS
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Parallax for Hero Elements
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
        }

        const halos = document.querySelectorAll('.ambient-glow');
        halos.forEach((halo, index) => {
            const speed = (index + 1) * 0.05;
            halo.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // 4. NAVBAR DYNAMICS
        const navbar = document.querySelector('.navbar');
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Theme Detection
        const sections = document.querySelectorAll('section, footer');
        let currentSurface = 'dark';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 80 && rect.bottom >= 80) {
                if (section.classList.contains('surface-light') || section.classList.contains('surface-tint')) {
                    currentSurface = 'light';
                } else {
                    currentSurface = 'dark';
                }
            }
        });

        if (currentSurface === 'light') {
            document.body.classList.add('surface-light-active');
        } else {
            document.body.classList.remove('surface-light-active');
        }
    });


    // 5. LANGUAGE TOGGLE
    window.toggleLanguage = () => {
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
    };

    // Load saved language
    const savedLang = localStorage.getItem('schoopedia_lang');
    if (savedLang) {
        document.body.classList.remove('lang-ar', 'lang-en');
        document.body.classList.add(`lang-${savedLang}`);
        document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', savedLang);
    }


    // 5. MOBILE MENU
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });


    // 6. METRICS ANIMATION (Counter)
    const animateCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const speed = 200;
            const updateCount = () => {
                const count = +counter.innerText.replace(/[+,]/g, '');
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = '+' + target.toLocaleString();
                }
            };
            updateCount();
        });
    };

    // Trigger counters when metrics section is visible
    const metricsSection = document.querySelector('.metrics');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(metricsSection);
    }
});
