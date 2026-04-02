// main.js — Matthias Dogbatsey
// Dark mode · System preference · Active nav · Scroll reveal · Footer year · Back-to-top

(function () {
  const html       = document.documentElement;
  const toggleBtn  = document.querySelector("[data-theme-toggle]");

  // ── 1. Theme setup with system preference fallback ──────────
  const saved = window.localStorage.getItem("tk-theme");
  let currentTheme = "light";

  if (saved === "dark" || saved === "light") {
    currentTheme = saved;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    currentTheme = "dark";
  }

  html.setAttribute("data-theme", currentTheme);
  html.setAttribute("data-theme-set", "true");

  // ── 2. Toggle button ───────────────────────────────────────
  function setToggleLabel(theme) {
    if (toggleBtn) {
      toggleBtn.textContent = theme === "light" ? "Dark" : "Light";
      toggleBtn.setAttribute("aria-label",
        theme === "light" ? "Switch to dark mode" : "Switch to light mode");
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

  // ── 6. Mobile Hamburger Menu with backdrop + Escape key ───
  const hamburger = document.querySelector(".hamburger-menu");
  const navLinks  = document.querySelector(".nav-links");

  // Create backdrop element
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  document.body.appendChild(backdrop);

  function openMenu() {
    navLinks.classList.add("is-open");
    backdrop.style.display = "block";
    requestAnimationFrame(() => backdrop.classList.add("is-visible"));
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navLinks.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => { backdrop.style.display = "none"; }, 280);
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) closeMenu();
    });
  }

  // ── 7. Scroll Progress Bar ─────────────────────────────────
  const scrollBar = document.querySelector(".scroll-progress-bar");
  if (scrollBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      scrollBar.style.width = Math.max(0, Math.min(100, pct)) + "%";
    }, { passive: true });
  }

  // ── 8. Back-to-Top Button ──────────────────────────────────
  const btt = document.createElement("button");
  btt.className = "back-to-top";
  btt.setAttribute("aria-label", "Back to top");
  btt.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(btt);

  window.addEventListener("scroll", () => {
    btt.classList.toggle("is-visible", window.scrollY > 400);
  }, { passive: true });

  btt.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── 9. 3D Tilt Effect on Headshot ─────────────────────────
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
