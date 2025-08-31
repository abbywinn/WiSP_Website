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
            const sections = document.querySelectorAll('.leadership-section');
            if (sections.length > 1) {
                sections[1].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const observeParallax = (selector) => {
        const element = document.querySelector(selector);
        if (element) observeParallaxElement(element);
    };

    observeParallax('.parallax-section');
    observeParallax('.info-panels-parallax');

    document.querySelectorAll('.leadership-card, .leadership-subtitle, .leadership-title, .fade-in, .rocket-divider, .streak-line-wrapper')
        .forEach(el => observeParallaxElement(el));
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
    bg1: document.querySelector('.starry-bg'),
    bg2: document.querySelector('.alt-bg'),
    support: document.querySelectorAll('.rocket-support'),
  };

  const partsArray   = [...el.parts];
  const supportArray = [...el.support];

  const rocketTargets = [
    el.exterior, el.interior, el.title, el.countdown, el.info,
    ...partsArray, ...supportArray
  ];

  const partData = {
    'nose-cone': { name: 'NOSE CONE', text: 'Our carbon fiber nosecone features a Von Kármán shape to reduce aerodynamic drag during flight and maintain stability at high speeds.', img: 'assets/images/rocket/parts/nose-cone.png' },
    'main-chute': { name: 'MAIN CHUTE', text: 'The main chute is a large parachute deployed during the final phase of descent. It drastically reduces the rocket\'s speed in order to achieve a controlled landing.', img: 'assets/images/rocket/parts/main-chute.png' },
    'av-bay': { name: 'AVIONICS BAY', text: 'The avionics bay is a compartment that houses the Half Badger\'s electronic systems, such as the flight computer and GPS. It is built to protect this equipment from shock loads, heat, and other environmental factors during flight.', img: 'assets/images/rocket/parts/av-bay.png' },
    'drogue-chute': { name: 'DROGUE CHUTE', text: 'The drogue chute is a smaller parachute that deploys shortly after the rocket reaches apogee. At this time, a controlled charge in the charge wells breaks the shear pins to release the chute. The drogue chute stabilizes the rocket during the initial phase of descent before the main chute deploys.', img: 'assets/images/rocket/parts/drogue-chute.png' },
    'copvs': { name: 'DUAL COPVS', text: 'Half Badger uses two composite overwrapped pressure vessels (COPVs) to pressurize the IPA and LOX tanks. High-pressure nitrogen gas is regulated and fed into the propellant tanks to move the fuel and oxidizer into the combustion chamber.', img: 'assets/images/rocket/parts/copvs.png' },
    'ipa-tank': { name: 'IPA TANK', text: 'The IPA tank stores isopropyl alcohol, which is used as the fuel in our propulsion system. The tank is pressurized to maintain a consistent fuel flow to the engine during ignition and flight.', img: 'assets/images/rocket/parts/ipa-tank.png' },
    'lox-tank': { name: 'LOX TANK', text: 'The LOX tank stores liquid oxygen, which serves as the oxidizer in our propulsion system. Since oxygen boils at around -183°C (-297°F) under normal atmospheric pressure, the tank is designed to handle cryogenic conditions. In particular, the end caps are sealed with Teflon O-rings, which are compatible with low temperatures.', img: 'assets/images/rocket/parts/lox-tank.png' },
    'fins-nozzle': { name: 'FINS & NOZZLE', text: 'The Half Badger\'s fins help it to fly straight during flight and avoid excessive rotation. The engine nozzle expands and accelerates gases produced by combustion, creating thrust that propels the rocket upward.', img: 'assets/images/rocket/parts/fins-nozzle.png' },
  };

  let lastKey = 'av-bay';
  let glowAnim = null;
  let introComplete = false;

  gsap.set(el.bg1, { autoAlpha: 1 });
  gsap.set(el.bg2, { autoAlpha: 0 });
  gsap.set([el.interior, el.countdown, el.info, ...partsArray, ...supportArray], { autoAlpha: 0 });
gsap.set(el.exterior, { x: "100vw", autoAlpha: 1 });
  gsap.set(el.title, { y: 30 });

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
    gsap.to(el.info, { autoAlpha: 1, duration: 0.3, overwrite: 'auto' });
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

  function playIntro() {
    gsap.killTweensOf(rocketTargets);


    gsap.set([el.interior, el.countdown, el.info, ...partsArray, ...supportArray], { autoAlpha: 0 });
    gsap.set(el.exterior, { x: "100vw", autoAlpha: 1 });
    gsap.set(el.title, { y: 30 });

    gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        introComplete = true;
        showInfo(lastKey);
        startGlow(document.querySelector('[data-part="av-bay"]'));
      }
    })
    .to(el.title, { autoAlpha: 1, y: 0, duration: 1, overwrite: 'auto' }, 0)
.to(el.exterior, { x: 0, duration: 0.7, overwrite: 'auto' }, 0)
    .to(el.exterior, { autoAlpha: 1, duration: 0.7, overwrite: 'auto' }, '<')
    .to(el.exterior, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' }, '>')
    .set([el.interior, ...supportArray, ...partsArray], { autoAlpha: 1 }, '<');
  }

  playIntro();

  ScrollTrigger.create({
    trigger: "#scroll-rocket",
    start: "top 30%",
    onEnter: () => {
      gsap.to(el.bg1, { autoAlpha: 0, duration: 0.5, overwrite: 'auto' });
      gsap.to(el.bg2, { autoAlpha: 1, duration: 0.5, overwrite: 'auto' });
    },
    onLeaveBack: () => {
      gsap.to(el.bg1, { autoAlpha: 1, duration: 0.5, overwrite: 'auto' });
      gsap.to(el.bg2, { autoAlpha: 0, duration: 0.5, overwrite: 'auto' });
    }
  });

  const fadeTargets = [...partsArray, ...supportArray, el.interior, el.info].filter(Boolean);

  ScrollTrigger.create({
    trigger: ".dashboard-section",
    start: "top center",
    onEnter: () => {
      gsap.killTweensOf(rocketTargets);
      stopGlow?.();

      gsap.set(fadeTargets, { autoAlpha: 0 });

gsap.set(el.exterior, { autoAlpha: 1, x: 0 });
gsap.to(el.exterior, {
  x: "-100vw",
  duration: 1,
  ease: "power2.inOut",
  overwrite: "auto"
});
    },
    onLeaveBack: () => {
      gsap.killTweensOf(rocketTargets);
      gsap.set(el.exterior, { autoAlpha: 1, x: "-100vw" });
      playIntro();
    }
  });



const arrow = document.querySelector(".scroll-down-arrow");
const firstSection = document.querySelector(".hero-section"); 
const secondSection = document.querySelector(".dashboard-section");

arrow.addEventListener("click", () => {
  secondSection.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 700);
});


ScrollTrigger.create({
  trigger: secondSection,
  start: "top 80%", 
  onEnter: () => gsap.to(arrow, { autoAlpha: 0, duration: 0.3 }),
  onLeaveBack: () => gsap.to(arrow, { autoAlpha: 1, duration: 0.3 })
});

});






































gsap.registerPlugin(ScrollTrigger);

const timeline  = document.querySelector(".timeline-container");
const clock     = document.querySelector(".clock-container");
const toggleBtn = document.querySelector(".timeline-toggle");
const chevron   = toggleBtn?.querySelector(".chevron");
const overlay   = document.querySelector(".timeline-overlay");

const mq = window.matchMedia("(min-width: 1024px)");
const isDesktop = () => mq.matches;

gsap.set([timeline, clock], { x: "100%", opacity: 0 });
gsap.set(overlay, { opacity: 0 });
if (timeline) timeline.style.pointerEvents = "auto"; 


let isOpen = false;

function openTimeline() {
  gsap.to([timeline, clock], {
    x: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power2.inOut",
  });
  gsap.to(toggleBtn, {
    x: -timeline.offsetWidth,
    duration: 0.5,
    ease: "power2.inOut",
  });
  if (!isDesktop()) {
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
    if (chevron) gsap.to(chevron, { rotate: 180, duration: 0.3 });
  }
  isOpen = true;
}

function closeTimeline() {
  gsap.to([timeline, clock], {
    x: "100%",
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => gsap.set([timeline, clock], { opacity: 0 })
  });
  gsap.to(toggleBtn, {
    x: 0, 
    duration: 0.5,
    ease: "power2.inOut",
  });
  if (!isDesktop()) {
    gsap.to(overlay, { opacity: 0, duration: 0.3 });
    if (chevron) gsap.to(chevron, { rotate: 0, duration: 0.3 });
  }
  isOpen = false;
}

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    if (isOpen) closeTimeline();
    else openTimeline();
  });
}
if (overlay) {
  overlay.addEventListener("click", closeTimeline);
}

ScrollTrigger.matchMedia({
  "(min-width: 1024px)": function () {
    gsap.set([timeline, clock], { x: "100%", opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: ".dashboard-section", 
      start: "top 80%",
      end: "bottom bottom",
      onEnter: () => {
        gsap.to([timeline, clock], {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      },
      onLeaveBack: () => {
        gsap.to([timeline, clock], {
          x: "100%",
          opacity: 0,
          duration: 0.6,
          ease: "power2.in"
        });
      }
    });

    return () => st.kill();
  },

  "(max-width: 1023px)": function () {
    closeTimeline();

    const stMobile = ScrollTrigger.create({
      trigger: ".dashboard-section",
      start: "top 80%",
      end: "bottom bottom",
      onEnter: () => {},
      onLeave: () => closeTimeline(),
      onLeaveBack: () => closeTimeline()
    });

    return () => stMobile.kill();
  }
});

mq.addEventListener("change", () => {
  if (isDesktop()) gsap.set(overlay, { opacity: 0 });

  if (isDesktop()) {
    gsap.set([timeline, clock], { x: "100%", opacity: 0 });
  } else {
    closeTimeline();
  }

  ScrollTrigger.refresh();
});









gsap.from(".dashboard-bg", {
  autoAlpha: 0,
  y: 50,
  duration: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".dashboard-bg",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});

gsap.from(".stat-wheel", {
  autoAlpha: 0,
  rotate: -180,
  scale: 0.5,
  duration: 1,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: ".stat-wheel",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});

gsap.fromTo(
  ".apogee-metric, .burntime-metric, .impulse-metric, .thrust-metric, .length-metric",
  { autoAlpha: 0, y: 30 },
  {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".apogee-metric",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
);

gsap.from(".title-box2", {
  autoAlpha: 0,
  y: 30,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".dashboard-section",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});

gsap.from(".map-wrapper, .map-heading", {
  autoAlpha: 0,
  y: 40,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".dashboard-section",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});

gsap.fromTo(
  ".map-small",
  { autoAlpha: 0, y: 40 },
  {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".dashboard-section",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    onComplete: () => gsap.set(".map-small", { clearProps: "all" })
  }
);

gsap.from(".map-expanded, .map-img", {
  autoAlpha: 0,
  scale: 0.95,
  duration: 0.8,
  stagger: 0.15,
  ease: "back.out(1.3)",
  scrollTrigger: {
    trigger: ".dashboard-section",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});

document.querySelectorAll(".map-point").forEach((point, i) => {
  gsap.from(point, {
    autoAlpha: 0,
    y: 20,
    scale: 0.8,
    duration: 0.6,
    delay: i * 0.2,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: ".dashboard-section",
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

document.querySelectorAll(".stat-value").forEach(el => {
  const target = parseFloat(el.dataset.target);
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    onEnter: () => {
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power1.out",
        onUpdate: function () {
          if (el.dataset.target.includes(".")) {
            el.innerText = Number(el.innerText).toFixed(1);
          }
        }
      });
    }
  });
});

document.querySelectorAll('.apogee-metric, .burntime-metric, .thrust-metric, .impulse-metric').forEach(metric => {
  const statGroup = metric.querySelector('.stat-group');
  const description = metric.querySelector('.stat-description');

  metric.addEventListener('mouseenter', () => {
    gsap.to(metric, { scale: 1.04, filter: "drop-shadow(0 0 18px rgba(255,255,255,0.85))", duration: 0.3 });
    if (statGroup) gsap.to(statGroup, { opacity: 0, duration: 0.3 });
    if (description) gsap.to(description, { opacity: 1, duration: 0.3 });
  });

  metric.addEventListener('mouseleave', () => {
    gsap.to(metric, { scale: 1, filter: "drop-shadow(0 0 12px rgba(112,112,112,0.8))", duration: 0.3 });
    if (statGroup) gsap.to(statGroup, { opacity: 1, duration: 0.3 });
    if (description) gsap.to(description, { opacity: 0, duration: 0.3 });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const streakTarget = document.querySelector(".streak-line-wrapper");
  if (!streakTarget) return;

  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("streak-animate");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 }).observe(streakTarget);
});




















document.addEventListener("DOMContentLoaded", () => {
  const smallMap = document.querySelector(".map-small");
  const overlay = document.querySelector(".map-overlay");
  const expandedMap = document.querySelector(".map-expanded");
  const closeBtn = document.querySelector(".map-close");


  smallMap.addEventListener("click", () => {
    overlay.style.display = "flex";
    gsap.fromTo(expandedMap, 
      { scale: 0.5, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  });

  function closeMap() {
    gsap.to(expandedMap, {
      scale: 0.5, 
      opacity: 0, 
      duration: 0.4, 
      ease: "power3.in",
      onComplete: () => overlay.style.display = "none"
    });
  }

  closeBtn.addEventListener("click", closeMap);

  overlay.addEventListener("click", closeMap);
  expandedMap.addEventListener("click", closeMap);
});





