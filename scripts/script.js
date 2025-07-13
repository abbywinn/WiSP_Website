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



const launchDate = new Date("May 27, 2026 10:00:00").getTime();
function pad(num) {
  return String(num).padStart(2, '0');
}
function updateCountdown() {
  const now = new Date().getTime();
  const timeLeft = launchDate - now;
  if (timeLeft <= 0) {
    document.getElementById("t-minus").innerText = "";
    document.getElementById("countdown-container").innerHTML =
      "<div class='countdown-title'>LAUNCHED</div>";
    return;
  }
  const days = Math.floor(timeLeft / (1000*60*60*24));
  const hours = Math.floor((timeLeft % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((timeLeft % (1000*60* 60)) / (1000*60));
  const seconds = Math.floor((timeLeft % (1000*60)) / 1000);
  document.getElementById("days").textContent = pad(days);
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
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
    desc: document.querySelector('.section-description'),
    img: document.getElementById('info-img'),
    bg2: document.querySelector('.alt-bg'),
    support: document.querySelectorAll('.rocket-support'),
  };

  const partsArray = [...el.parts];
  const supportArray = [...el.support];

  const partData = {
    'nose-cone': { 
      name: 'Nose Cone', 
      text: 'Our carbon fiber nosecone features a Von Kármán shape to reduce aerodynamic drag during flight and maintain stability at high speeds.', 
      img: 'assets/images/rocket/parts/nose-cone.png' 
    },
    'main-chute': { 
      name: 'Main Chute', 
      text: 'The main chute is a large parachute deployed during the final phase of descent. It drastically reduces the rocket\'s speed in order to achieve a controlled landing.', 
      img: 'assets/images/rocket/parts/main-chute.png' 
    },
    'av-bay': { 
      name: 'Avionics Bay', 
      text: 'The avionics bay is a compartment that houses the Half Badger\'s electronic systems, such as the flight computer and GPS. It is built to protect this equipment from shock loads, heat, and other environmental factors during flight.', 
      img: 'assets/images/rocket/parts/av-bay.png' 
    },
    'drogue-chute': { 
      name: 'Drogue Chute', 
      text: 'The drogue chute is a smaller parachute that deploys shortly after the rocket reaches apogee. At this time, a controlled charge in the charge wells breaks the shear pins to release the chute. The drogue chute stabilizes the rocket during the initial phase of descent before the main chute deploys.', 
      img: 'assets/images/rocket/parts/drogue-chute.png' 
    },
    'copvs': { 
      name: 'Dual COPVs', 
      text: 'Half Badger uses two composite overwrapped pressure vessels (COPVs) to pressurize the IPA and LOX tanks. High-pressure nitrogen gas is regulated and fed into the propellant tanks to move the fuel and oxidizer into the combustion chamber.', 
      img: 'assets/images/rocket/parts/copvs.png' 
    },
    'ipa-tank': { 
      name: 'IPA Tank', 
      text: 'The IPA tank stores isopropyl alcohol, which is used as the fuel in our propulsion system. The tank is pressurized to maintain a consistent fuel flow to the engine during ignition and flight.', 
      img: 'assets/images/rocket/parts/ipa-tank.png' 
    },
    'lox-tank': { 
      name: 'LOX Tank', 
      text: 'The LOX tank stores liquid oxygen, which serves as the oxidizer in our propulsion system. Since oxygen boils at around -183°C (-297°F) under normal atmospheric pressure, the tank is designed to handle cryogenic conditions. In particular, the end caps are sealed with Teflon O-rings, which are compatible with low temperatures.', 
      img: 'assets/images/rocket/parts/lox-tank.png' 
    },
    'fins-nozzle': { 
      name: 'Fins & Nozzle', 
      text: 'The Half Badger\'s fins help it to fly straight during flight and avoid excessive rotation. The engine nozzle expands and accelerates gases produced by combustion, creating thrust that propels the rocket upward.', 
      img: 'assets/images/rocket/parts/fins-nozzle.png' 
    },
  };

  let lastKey = 'av-bay';
  let glowAnim = null;
  let introComplete = false;
  
gsap.set([el.interior, el.countdown, el.info, ...partsArray, el.altBg], { autoAlpha: 0 });
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
  .to(el.title, { autoAlpha: 1, y: 0, duration: 1 }, 0)
  .to(el.exterior, { x: 0, duration: 0.7 }, 0)
  .to(el.exterior, { autoAlpha: 1, duration: 0.7 }, '<')
  
  .to(el.exterior, { autoAlpha: 0, duration: 0.2 }, '>')
  
  .to(el.interior, { autoAlpha: 1, duration: 0 }, '<')
  .to(supportArray, { autoAlpha: 1, duration: 0 }, '<')
  
  .to(partsArray, { autoAlpha: 1, stagger: 0, duration: 0.1 }, '>');

  function startGlow(target) {
    glowAnim?.kill();
    glowAnim = gsap.to(target, {
      scale: 1.05,
      filter: `
        drop-shadow(0 0 20px rgba(255,255,255,1))
        drop-shadow(0 0 20px rgba(255,255,255,0.5))
      `,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }

  function stopGlow() {
    glowAnim?.kill();
    partsArray.forEach(p => gsap.set(p, { clearProps: 'scale,filter' }));
  }

  function showInfo(key) {
    const data = partData[key];
    if (!data) return;
    el.heading.textContent = data.name;
    el.text.textContent = data.text;
    el.img.src = data.img;
    gsap.to(el.info, { autoAlpha: 1, duration: 0.3 });
  }

  partsArray.forEach(part => {
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
  trigger: "#scroll-rocket",
  start: "top 30%",
  onEnter: () => fadeToAltBackground(true),
  onLeaveBack: () => fadeToAltBackground(false)
});

function fadeToAltBackground(toAlt) {
  const el = {
    bg1: document.querySelector('.starry-bg'),
    bg2: document.querySelector('.alt-bg'),
  };

  if (toAlt) {
    gsap.to(el.bg1, { autoAlpha: 0, duration: 0.5 });
    gsap.to(el.bg2, { autoAlpha: 1, duration: 0.5 });
  } else {
    gsap.to(el.bg1, { autoAlpha: 1, duration: 0.5 });
    gsap.to(el.bg2, { autoAlpha: 0, duration: 0.5 });
  }
}




  const scrollArrow = document.getElementById('scrollArrow');
  if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
      const nextSection = document.getElementById('scroll-rocket');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});