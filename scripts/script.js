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
    document.querySelectorAll('.rocket-divider').forEach(el => observeParallaxElement(el));
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const navWrapper = document.getElementById('mobile-nav');
    menuToggle.addEventListener('click', () => {
        navWrapper.classList.toggle('open');
    });
});

const launchDate = new Date("December 15, 2025 10:00:00").getTime();
const countdownElement = document.getElementById("countdown");
function updateCountdown() {
    const now=new Date().getTime();
    const timeLeft = launchDate - now;

    if (timeLeft <= 0){
        document.getElementById("t-minus").innerText = "";
        document.getElementById("countdown-container").innerHTML = "<div class='countdown-title'>LAUNCHED!</div>";
        return;
    }
    const days = Math.floor(timeLeft/(1000*60*60*24))
    const hours = Math.floor((timeLeft%(1000*60*60*24))/(1000*60*60));
    const minutes = Math.floor((timeLeft % (1000*60*60))/(1000*60));
    const seconds = Math.floor((timeLeft % (1000*60))/1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2,'0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

    const delay = 1000 - (now % 1000);
    setTimeout(updateCountdown, delay);
}
updateCountdown();














document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const el = {
    exterior: document.getElementById('rocketExterior'),
    interior: document.getElementById('rocketInterior'),
    parts: document.querySelectorAll('.rocket-part'),
    title: document.querySelector('.title-box'),
    countdown: document.querySelector('.countdown-box'),
    info: document.querySelector('.info-box'),
    heading: document.getElementById('info-heading'),
    text: document.getElementById('info-text'),
    img: document.getElementById('info-img'),
    altBg: document.querySelector('.alt-bg'),
  };

  const partData = {
    'nose-cone': { name: 'Nose Cone', text: 'Von Kármán-shaped nose cone.', img: 'assets/images/rocket/parts/nose-cone.png' },
    'main-chute': { name: 'Main Chute', text: 'Main chute deploys at apogee.', img: 'assets/images/rocket/parts/main-chute.png' },
    'av-bay': { name: 'Avionics Bay', text: 'Avionics bay for flight electronics.', img: 'assets/images/rocket/parts/av-bay.png' },
    'drogue-chute': { name: 'Drogue Chute', text: 'Drogue chute slows descent.', img: 'assets/images/rocket/parts/drogue-chute.png' },
    'copvs': { name: 'COPVs', text: 'COPVs store nitrogen.', img: 'assets/images/rocket/parts/copvs.png' },
    'ipa-tank': { name: 'IPA Tank', text: 'IPA fuel tank.', img: 'assets/images/rocket/parts/ipa-tank.png' },
    'lox-tank': { name: 'LOX Tank', text: 'LOX oxidizer tank.', img: 'assets/images/rocket/parts/lox-tank.png' },
    'fins-nozzle': { name: 'Fins & Nozzle', text: 'Stabilizing fins & engine nozzle.', img: 'assets/images/rocket/parts/fins-nozzle.png' },
  };

  let lastKey = 'av-bay';
  let glowAnim = null;
  let introComplete = false;

  gsap.set([el.interior, el.title, el.countdown, el.info, ...el.parts, el.altBg], { autoAlpha: 0 });
  gsap.set(el.exterior, { x: '100vw', autoAlpha: 1 });
  gsap.set(el.title, { y: 30 });

  gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      introComplete = true;
      showInfo(lastKey);
      startGlow(document.querySelector('[data-part="av-bay"]'));
    }
  })
    .to(el.exterior, { x: 0, duration: 1 }, 0)
    .to(el.title, { autoAlpha: 1, y: 0, duration: 1 }, 0)
    .to(el.exterior, { autoAlpha: 0, duration: 0.5, delay: 0.2 })
    .to(el.interior, { autoAlpha: 1, duration: 0.5 }, '<')
    .to(el.parts, { autoAlpha: 1, stagger: 0, duration: 0.2 }, '<0.3');

  function startGlow(target) {
    glowAnim?.kill();
    glowAnim = gsap.to(target, {
      scale: 1.05,
      filter: 'drop-shadow(0 0 20px rgba(255,255,255,1))',
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }

  function stopGlow() {
    glowAnim?.kill();
    document.querySelectorAll('.rocket-part').forEach(p => gsap.set(p, { clearProps: 'scale,filter' }));
  }

  function showInfo(key) {
    const data = partData[key];
    if (!data) return;
    el.heading.textContent = data.name;
    el.text.textContent = data.text;
    el.img.src = data.img;
    gsap.to(el.info, { autoAlpha: 1, duration: 0.3 });
  }

  el.parts.forEach(part => {
    const key = part.dataset.part;

    part.addEventListener('mouseenter', () => {
      if (!introComplete) return;
      stopGlow();
      startGlow(part);
      lastKey = key;
      showInfo(key);
    });
  });

  ScrollTrigger.create({
    trigger: '#scroll-rocket',
    start: 'top top',
    once: true,
    onEnter: () => {
      stopGlow();

      const scrollTl = gsap.timeline({
        defaults: { ease: 'power2.inOut' }
      });

      scrollTl
        .to([el.title, el.interior, el.parts, el.info], { autoAlpha: 0, duration: 0.3 }, 0)
        .set(el.exterior, { autoAlpha: 1 }, 0.2)
        .to(el.exterior, { x: '-100vw', duration: 1 }, 0.3)
        .to(el.countdown, { autoAlpha: 1, duration: 1 }, 0.8)
        .to(el.altBg, { autoAlpha: 1, duration: 1 }, 0.8);
    },
  });
});