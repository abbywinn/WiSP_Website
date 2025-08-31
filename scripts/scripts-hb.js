window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});








document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const el = {
    exterior: document.getElementById('rocketExterior'),
    interior: document.getElementById('rocketInterior'),
    parts: document.querySelectorAll('.rocket-part'),
    title: document.querySelector('.title-box'),
    info: document.querySelector('.info-box'),
    heading: document.getElementById('info-heading'),
    text: document.getElementById('info-text'),
    desc: document.querySelector('.section-description'),
    img: document.getElementById('info-img'),
    partInfo: document.querySelector('.part-info-box'), 
    support: document.querySelectorAll('.rocket-support'),
  };

  const partsArray   = [...el.parts];
  const supportArray = [...el.support];
  const rocketTargets = [el.exterior, el.interior, el.title, el.info, ...partsArray, ...supportArray];

  const partData = {
    'nose-cone': {
      name: 'NOSE CONE',
      text: 'Our carbon fiber nosecone features a Von Kármán shape to reduce aerodynamic drag during flight and maintain stability at high speeds.',
      img: 'assets/images/rocket-mk-3/nose-cone.png'
    },
    'main-chute': {
      name: 'MAIN CHUTE',
      text: 'The main chute is a large parachute deployed during the final phase of descent. It drastically reduces the rocket\'s speed in order to achieve a controlled landing.',
      img: 'assets/images/rocket-mk-3/main-chute.png'
    },
    'av-bay': {
      name: 'AVIONICS BAY',
      text: 'The avionics bay is a compartment that houses the Half Badger\'s electronic systems, such as the flight computer and GPS. It is built to protect this equipment from shock loads, heat, and other environmental factors during flight.',
      img: 'assets/images/rocket-mk-3/av-bay.png'
    },
    'drogue-chute': {
      name: 'DROGUE CHUTE',
      text: 'The drogue chute is a smaller parachute that deploys shortly after the rocket reaches apogee. A controlled charge breaks the shear pins to release it. The drogue stabilizes the rocket before the main chute deploys.',
      img: 'assets/images/rocket-mk-3/drogue-chute.png'
    },
    'copvs': {
      name: 'COPV',
      text: 'Half Badger uses one composite overwrapped pressure vessel (COPV) to pressurize the IPA and LOX tanks. High-pressure nitrogen gas is regulated and fed into the propellant tanks to move fuel and oxidizer into the combustion chamber.',
      img: 'assets/images/rocket-mk-3/copv.png'
    },
    'ipa-tank': {
      name: 'IPA TANK',
      text: 'The IPA tank stores isopropyl alcohol, which is used as the fuel in our propulsion system. It is pressurized to maintain a consistent fuel flow to the engine during ignition and flight.',
      img: 'assets/images/rocket-mk-3/ipa-tank.png'
    },
    'lox-tank': {
      name: 'LOX TANK',
      text: 'The LOX tank stores liquid oxygen, which serves as the oxidizer in our propulsion system. Since oxygen boils at -183°C (-297°F), the tank is designed to handle cryogenic conditions.',
      img: 'assets/images/rocket-mk-3/lox-tank.png'
    },
    'fins-nozzle': {
      name: 'FINS & NOZZLE',
      text: 'The Half Badger\'s fins help it fly straight and avoid excessive rotation. The engine nozzle expands and accelerates gases produced by combustion, creating thrust that propels the rocket upward.',
      img: 'assets/images/rocket-mk-3/fins-nozzle.png'
    },
  };

  let glowAnim = null;
  let introComplete = false;

  gsap.set(el.bg1, { autoAlpha: 1 });
  gsap.set([el.interior, el.info, ...partsArray, ...supportArray], { autoAlpha: 0 });
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

function showTable() {
  document.getElementById("default-table-wrapper").style.display = "block";
  el.partInfo.style.display = "none";
}

function showInfo(key) {
  const data = partData[key];
  if (!data) return;

  document.getElementById("default-table-wrapper").style.display = "none";
  el.partInfo.style.display = "flex"; 

  el.heading.textContent = data.name;
  el.text.textContent = data.text;
  el.img.src = data.img;

  gsap.fromTo(el.partInfo, {autoAlpha:0}, {autoAlpha:1, duration:0.3, overwrite:"auto"});
}


  partsArray.forEach(part => {
    const key = part.dataset.part;
    part.addEventListener("mouseenter", () => {
      if (!introComplete) return;
      stopGlow();
      startGlow(part);
      showInfo(key);
    });
part.addEventListener("mouseleave", () => {
  stopGlow();
  if (![...partsArray].some(p => p.matches(":hover"))) {
    showTable();
  }
});
  });

  function playIntro() {
    gsap.killTweensOf(rocketTargets);

    gsap.set([el.interior, el.info, ...partsArray, ...supportArray], { autoAlpha: 0 });
    gsap.set(el.exterior, { x: "100vw", autoAlpha: 1 });
    gsap.set(el.title, { y: 30 });

    gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        introComplete = true;
        showTable(); 

        const avBay = document.querySelector('.rocket-part[data-part="av-bay"]');
        startGlow(avBay);
      }
    })
    .to(el.title, { autoAlpha: 1, y: 0, duration: 1 }, 0)
    .to(el.exterior, { x: 0, autoAlpha: 1, duration: 0.7 }, 0)
    .to(el.exterior, { autoAlpha: 0, duration: 0.2 }, ">")
    .set([el.interior, ...supportArray, ...partsArray], { autoAlpha: 1 }, "<")
    .to(el.info, { autoAlpha: 1, duration: 0.3 }, "<");
  }
  playIntro();


  const fadeTargets = [el.interior, el.info, ...partsArray, ...supportArray].filter(Boolean);

  ScrollTrigger.create({
    trigger: ".next-section",
    start: "top center",
    onEnter: () => {
      gsap.killTweensOf(rocketTargets);
      stopGlow();

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
  const secondSection = document.querySelector(".next-section");

  if (arrow && secondSection) {
    arrow.addEventListener("click", () => {
      secondSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => ScrollTrigger.refresh(), 700);
    });

    ScrollTrigger.create({
      trigger: secondSection,
      start: "top 80%",
      onEnter: () => gsap.to(arrow, { autoAlpha: 0, duration: 0.3 }),
      onLeaveBack: () => gsap.to(arrow, { autoAlpha: 1, duration: 0.3 })
    });
  }
});
