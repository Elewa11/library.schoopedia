function toggleLanguage() {
    const body = document.body;
    const html = document.documentElement;
    
    if (body.classList.contains('lang-ar')) {
        // Switch to English
        body.classList.remove('lang-ar');
        body.classList.add('lang-en');
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
        localStorage.setItem('schoopedia_lang', 'en');
    } else {
        // Switch to Arabic
        body.classList.remove('lang-en');
        body.classList.add('lang-ar');
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
        localStorage.setItem('schoopedia_lang', 'ar');
    }
}

// Load saved language
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('schoopedia_lang');
    if (savedLang === 'en') {
        document.body.classList.remove('lang-ar');
        document.body.classList.add('lang-en');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
});

// Navbar Scroll Effect
window.onscroll = function() {
    const nav = document.getElementById('navbar');
    if (window.pageYOffset > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
};

// Modal Logic
function openModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Close modal if clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Scroll Animations using Intersection Observer
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section, .feature-card, .metric-item').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
});
