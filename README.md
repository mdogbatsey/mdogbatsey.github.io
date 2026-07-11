# Hi there, I'm Matthias Dogbatsey! 👋

I am a **Ph.D. Candidate in Mathematics** at the [University of Alabama](https://www.ua.edu), specializing in **Scientific Computing**, **Mathematical Biology**, and **Numerical Analysis**.

My research focuses on developing high-order numerical schemes for partial differential equations (PDEs), with applications in biomolecular solvation (Poisson-Boltzmann) and hyperbolic conservation laws (Euler equations).

---

### 🔭 Current Research
- **Continuum Solvation Models:** Developing variational implicit solvent models using Size-Modified Poisson-Boltzmann theory.
- **Numerical Methods:** Implementation of MIB (Matched Interface and Boundary) and ADI (Alternating Direction Implicit) methods.
- **Social Dynamics:** Mathematical modeling of gang dynamics and intervention strategies.

### 🛠️ Languages & Tools
<p>
  <img src="https://img.shields.io/badge/Fortran-%23734F96.svg?style=for-the-badge&logo=fortran&logoColor=white" alt="Fortran" />
  <img src="https://img.shields.io/badge/MATLAB-%23e16737.svg?style=for-the-badge&logo=mathworks&logoColor=white" alt="MATLAB" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/R-%23276DC3.svg?style=for-the-badge&logo=r&logoColor=white" alt="R" />
  <img src="https://img.shields.io/badge/LaTeX-47A141?style=for-the-badge&logo=latex&logoColor=white" alt="LaTeX" />
  <img src="https://img.shields.io/badge/HPC-workflows-black?style=for-the-badge" alt="HPC" />
</p>

---

### 📫 Connect with me
- **Website:** [mdogbatsey.github.io](https://mdogbatsey.github.io)
- **Google Scholar:** [Matthias Dogbatsey](https://scholar.google.com/citations?user=avyudjUAAAAJ&hl=en)
- **LinkedIn:** [linkedin.com/in/mdogbatsey](https://www.linkedin.com/in/mdogbatsey)
- **Email:** `mdogbatsey@crimson.ua.edu`

---
<!-- <p align="left">
  <img src="https://github-readme-stats.vercel.app/api?username=mdogbatsey&show_icons=true&theme=minimal" alt="Matthias's GitHub stats" />
</p> -->

---

### 🧩 Maintaining this site

This is a plain static HTML site (no build step at deploy time), but the nav
and footer are kept as single-source-of-truth files so they can't drift
between pages:

- Edit `partials/header.html` or `partials/footer.html`.
- Run `python3 scripts/build_partials.py` to propagate the change into every
  page (between the `BEGIN/END` marker comments in each `.html` file).
- `python3 scripts/build_partials.py --check` exits non-zero if any page is
  out of sync — useful to run before committing.

`404.html` intentionally has a different nav (it's a noindex error page), so
it only picks up the shared footer.