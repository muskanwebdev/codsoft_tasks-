document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${(index % 4) * 90}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.textContent = isOpen ? "×" : "☰";
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.textContent = "☰";
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }));
  }

  // Typing animation
  const typingElement = document.getElementById("typing-text");
  if (typingElement && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const words = ["Web Developer", "Creative Designer", "Frontend Learner", "Digital Creator"];
    let wordIndex = 0, charIndex = 0, deleting = false;
    function typeEffect() {
      const word = words[wordIndex];
      typingElement.textContent = word.substring(0, charIndex);
      if (!deleting && charIndex < word.length) {
        charIndex++;
        setTimeout(typeEffect, 95);
      } else if (deleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 48);
      } else {
        deleting = !deleting;
        if (!deleting) wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, deleting ? 1150 : 280);
      }
    }
    typeEffect();
  } else if (typingElement) {
    typingElement.textContent = "Web Developer";
  }

  // Animate skill bars when visible
  const skillList = document.querySelector(".skill-list");
  if (skillList && "IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillList.classList.add("visible");
          skillObserver.unobserve(skillList);
        }
      });
    }, { threshold: 0.25 });
    skillObserver.observe(skillList);
  } else if (skillList) {
    skillList.classList.add("visible");
  }

  // Gentle 3D portrait tilt on devices with a mouse
  const portrait = document.querySelector(".portrait-ring");
  if (portrait && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    portrait.addEventListener("mousemove", event => {
      const rect = portrait.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      portrait.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    portrait.addEventListener("mouseleave", () => portrait.style.transform = "");
  }

  // Soft pointer glow and scroll progress (desktop + mobile friendly)
  const progress = document.querySelector(".scroll-progress");
  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, amount))})`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    window.addEventListener("pointermove", event => {
      document.body.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.body.style.setProperty("--mouse-y", `${event.clientY}px`);
    }, { passive: true });
  }

  // Current year
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
});