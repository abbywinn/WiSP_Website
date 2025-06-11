// Header background changing on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const observeParallaxElement = (element) => {
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {threshold: 0.5});

        observer.observe(element);
    };

    const scrollArrow = document.querySelector('.scroll-down-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            const sections=document.querySelectorAll('.leadership-section');
            if (sections.length >1) {
                sections[1].scrollIntoView({behavior: 'smooth'});
            }
        });
    }


    const observeParallax = (selector) => {
        const element = document.querySelector(selector);
        if (element) observeParallaxElement(element);
    };
    observeParallax('.parallax-section');
    observeParallax('.info-panels-parallax');
    document.querySelectorAll('.leadership-card, .leadership-subtitle, .leadership-title, .fade-in').forEach(el => {
        observeParallaxElement(el);
    });
});