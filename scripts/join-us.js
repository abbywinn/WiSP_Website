document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".join-us");
  const titleEl = document.querySelector(".section-title");
  const descEl = document.querySelector(".section-description");
  const buttonContainer = document.querySelector(".section-button");
  const container = document.querySelector(".subteam-container");

  const defaultTitle = "JOIN US";
  const defaultDesc = descEl.innerHTML;
  const defaultBg = "url('../assets/images/join-us/join-us-background.png')";

  section.style.backgroundImage = defaultBg;

  const subteams = document.querySelectorAll(
    ".avionics-subteam, .structures-subteam, .testandlaunch-subteam, .propulsion-subteam"
  );

  let activeSubteam = null;

  function reset() {
    if (activeSubteam) {
      activeSubteam.classList.remove("active");
      activeSubteam = null;
    }

  
    gsap.to(section, { duration: 0.5, backgroundImage: defaultBg });
    gsap.to(titleEl, { duration: 0.3, opacity: 0, onComplete: () => {
      titleEl.textContent = defaultTitle;
      gsap.to(titleEl, { duration: 0.3, opacity: 1 });
    }});
    gsap.to(descEl, { duration: 0.3, opacity: 0, onComplete: () => {
      descEl.innerHTML = defaultDesc;
      gsap.to(descEl, { duration: 0.3, opacity: 1 });
    }});


    buttonContainer.innerHTML = "";
  }

  subteams.forEach(st => {
    st.addEventListener("click", (e) => {
      e.stopPropagation();

      if (activeSubteam === st) {
        reset();
        return;
      }

      if (activeSubteam) activeSubteam.classList.remove("active");

      activeSubteam = st;
      st.classList.add("active");

      gsap.to(section, { duration: 0.5, backgroundImage: st.dataset.bg });

      gsap.to(titleEl, { duration: 0.3, opacity: 0, onComplete: () => {
        titleEl.textContent = st.dataset.title;
        gsap.to(titleEl, { duration: 0.3, opacity: 1 });
      }});

      gsap.to(descEl, { duration: 0.3, opacity: 0, onComplete: () => {
        descEl.innerHTML = st.dataset.description;
        gsap.to(descEl, { duration: 0.3, opacity: 1 });
      }});


      buttonContainer.innerHTML = "";
      if (st.dataset.link && st.dataset.linkText) {
        const btn = document.createElement("a");
        btn.href = st.dataset.link;
        btn.textContent = st.dataset.linkText;
        btn.className = "btn-outline";
        buttonContainer.appendChild(btn);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      reset();
    }
  });
});