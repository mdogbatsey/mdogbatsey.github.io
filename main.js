// Dark mode toggle with localStorage
(function () {
  const html = document.documentElement;
  const toggleBtn = document.querySelector("[data-theme-toggle]");

  const saved = window.localStorage.getItem("tk-theme");
  if (saved === "dark" || saved === "light") {
    html.setAttribute("data-theme", saved);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "light";
      const next = current === "light" ? "dark" : "light";
      html.setAttribute("data-theme", next);
      window.localStorage.setItem("tk-theme", next);
      toggleBtn.textContent = next === "light" ? "Dark mode" : "Light mode";
    });

    // initialize label
    const current = html.getAttribute("data-theme") || "light";
    toggleBtn.textContent = current === "light" ? "Dark mode" : "Light mode";
  }

  // highlight active nav link based on body data-page
  const page = document.body.getAttribute("data-page");
  if (page) {
    const link = document.querySelector(`.nav-links a[data-page="${page}"]`);
    if (link) link.classList.add("is-active");
  }
})();
