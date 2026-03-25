// main.js — Matthias Dogbatsey
// Dark mode · Active nav · Particles sync · Scroll reveal · Footer year

(function () {
  const html       = document.documentElement;
  const toggleBtn  = document.querySelector("[data-theme-toggle]");

  // ── Particle colors tuned to the blue theme ────────────────
  const particleColors = {
    light: "#1B3B5A",  // Deep navy on light background
    dark:  "#3b82f6"   // Bright blue on dark background
  };

  // ── Particles theme sync ───────────────────────────────────
  function updateParticlesTheme(theme) {
    if (window.pJSDom && window.pJSDom.length > 0) {
      const pJS   = window.pJSDom[0].pJS;
      const color = particleColors[theme];
      pJS.particles.color.value       = color;
      pJS.particles.line_linked.color = color;
      pJS.fn.particlesRefresh();
    }
  }

  // ── 1. Initial theme setup ─────────────────────────────────
  const saved       = window.localStorage.getItem("tk-theme");
  let currentTheme  = "light";

  if (saved === "dark" || saved === "light") {
    currentTheme = saved;
    html.setAttribute("data-theme", currentTheme);
  }

  // Sync particles once the page (and particles canvas) has loaded
  window.addEventListener("load", () => {
    updateParticlesTheme(currentTheme);
  });

  // ── 2. Toggle button ───────────────────────────────────────
  function setToggleLabel(theme) {
    if (toggleBtn) {
      toggleBtn.textContent = theme === "light" ? "Dark" : "Light";
    }
  }

  setToggleLabel(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "light";
      const next    = current === "light" ? "dark" : "light";

      html.setAttribute("data-theme", next);
      window.localStorage.setItem("tk-theme", next);
      setToggleLabel(next);
      updateParticlesTheme(next);
    });
  }

  // ── 3. Active nav link ─────────────────────────────────────
  const page = document.body.getAttribute("data-page");
  if (page) {
    const activeLink = document.querySelector(`.nav-links a[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add("is-active");
  }

  // ── 4. Scroll-triggered card reveal ───────────────────────
  if ("IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".card, .image-card, .section-heading, .pub-list li, .talk-item, .news-item, .awards-table tr"
    );

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity   = "1";
            entry.target.style.transform = "translateY(0)";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -32px 0px" }
    );

    revealTargets.forEach((el, i) => {
      // Skip elements already in the viewport on load (hero area)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) return;

      el.style.opacity    = "0";
      el.style.transform  = "translateY(16px)";
      el.style.transition = `opacity 0.45s ease ${Math.min(i * 0.03, 0.25)}s,
                             transform 0.45s ease ${Math.min(i * 0.03, 0.25)}s`;
      observer.observe(el);
    });
  }

  // ── 5. Footer year ─────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── 6. Mobile Hamburger Menu ───────────────────────────────
  const hamburger = document.querySelector(".hamburger-menu");
  const navLinks  = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ── 7. Scroll Progress Bar ─────────────────────────────────
  const scrollBar = document.querySelector(".scroll-progress-bar");
  if (scrollBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      scrollBar.style.width = Math.max(0, Math.min(100, scrollPercentage)) + "%";
    }, { passive: true });
  }

  // ── 8. 3D Tilt Effect on Headshot ─────────────────────────
  const headshot = document.querySelector(".hero-headshot");
  if (headshot) {
    headshot.addEventListener("mousemove", (e) => {
      const rect = headshot.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xRot = 15 * ((y - rect.height / 2) / (rect.height / 2));
      const yRot = -15 * ((x - rect.width / 2) / (rect.width / 2));
      headshot.style.transform = `perspective(1000px) scale(1.025) rotateX(${xRot}deg) rotateY(${yRot}deg)`;
    });
    headshot.addEventListener("mouseleave", () => {
      headshot.style.transform = "perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)";
    });
  }

})();
