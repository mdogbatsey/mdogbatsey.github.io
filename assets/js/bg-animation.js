/**
 * Animated Background — FEM Triangulation + Math Symbols
 *
 * Two layers representing pillars of the research:
 *   1. FEM Triangulation — deforming mesh of triangles (Scientific Computing)
 *   2. Math Symbols      — drifting notation from numerical analysis (Numerical Methods)
 *
 * Theme-aware (light / dark) and fully composited via canvas2d.
 */
(function () {
  'use strict';

  if (document.body.getAttribute('data-page') !== 'home') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'rd-bg';
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '-1',
    pointerEvents: 'none',
  });
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function rgba(r, g, b, a) { return `rgba(${r},${g},${b},${a.toFixed(3)})`; }

  const PAL = {
    light: {
      femEdge:    [15, 50, 130],
      femFill:    [30, 80, 200],
      math:       [10, 45, 120],
      canvasOp:   0.55,
    },
    dark: {
      femEdge:    [45, 185, 210],
      femFill:    [20, 110, 150],
      math:       [120, 230, 220],
      canvasOp:   0.45,
    },
  };

  function P() { return isDark() ? PAL.dark : PAL.light; }

  // ── FEM Triangulation ────────────────────────────────────────────────────────
  const GRID_COLS = 9, GRID_ROWS = 6;
  let femPts = [];

  function initFEM() {
    femPts = [];
    const cw = W / GRID_COLS, ch = H / GRID_ROWS;
    for (let r = 0; r <= GRID_ROWS; r++) {
      for (let c = 0; c <= GRID_COLS; c++) {
        femPts.push({
          bx: c * cw, by: r * ch,
          ox: (Math.random() - 0.5) * cw * 0.45,
          oy: (Math.random() - 0.5) * ch * 0.45,
          ph: Math.random() * Math.PI * 2,
          sp: 0.00025 + Math.random() * 0.00015,
        });
      }
    }
  }

  function getFEMPos(pt, t) {
    return {
      x: pt.bx + pt.ox * Math.sin(t * pt.sp + pt.ph),
      y: pt.by + pt.oy * Math.cos(t * pt.sp * 0.77 + pt.ph + 1.1),
    };
  }

  function drawFEM(t) {
    const p = P();
    const cols = GRID_COLS + 1;

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const tl = getFEMPos(femPts[r * cols + c], t);
        const tr = getFEMPos(femPts[r * cols + c + 1], t);
        const bl = getFEMPos(femPts[(r + 1) * cols + c], t);
        const br = getFEMPos(femPts[(r + 1) * cols + c + 1], t);

        // Upper-left triangle
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.fillStyle = rgba(...p.femFill, 0.018);
        ctx.fill();
        ctx.strokeStyle = rgba(...p.femEdge, 0.065);
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // Lower-right triangle
        ctx.beginPath();
        ctx.moveTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.fillStyle = rgba(...p.femFill, 0.012);
        ctx.fill();
        ctx.strokeStyle = rgba(...p.femEdge, 0.05);
        ctx.stroke();
      }
    }
  }

  // ── Floating Math Symbols ─────────────────────────────────────────────────────
  const SYMBOLS = [
    '\u2207\u00b2u', '\u2202u/\u2202t', '\u222b\u222b\u222b', '\u03a3\u1d62',
    '\u03bb\u2081', '\u03b5 \u2192 0', '\u0394x\u00b2', '\u222e F\u00b7ds',
    'ADI', 'MIB', 'FEM', 'p-\u0394', '\u2016u\u2016\u2082',
    '\u2207\u00b7F', 'J(u,v)', '\u03ba(A)', 'O(h\u00b2)', 'Ax = b',
    '\u2202v/\u2202t', 'D\u2207\u00b2u',
  ];

  let mathPts = [];

  function initMath() {
    mathPts = SYMBOLS.map(sym => ({
      sym,
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.045,
      vy: (Math.random() - 0.5) * 0.032,
      ph: Math.random() * Math.PI * 2,
      sz: 11 + Math.floor(Math.random() * 8),
    }));
  }

  function drawMath(t) {
    const p = P();
    for (const pt of mathPts) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.x < -90) pt.x = W + 50;
      if (pt.x > W + 70) pt.x = -70;
      if (pt.y < -25) pt.y = H + 15;
      if (pt.y > H + 25) pt.y = -15;

      const pulse = 0.5 + 0.5 * Math.sin(t * 0.00032 + pt.ph);
      ctx.font = `${pt.sz}px "Georgia", "Times New Roman", serif`;
      ctx.fillStyle = rgba(...p.math, 0.055 + pulse * 0.095);
      ctx.fillText(pt.sym, pt.x, pt.y);
    }
  }

  // ── Resize ────────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initFEM();
    initMath();
  }

  function applyOpacity() {
    canvas.style.opacity = P().canvasOp;
  }

  let paused = false;
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) requestAnimationFrame(loop);
  });

  function loop(t) {
    if (paused) return;
    ctx.clearRect(0, 0, W, H);
    drawFEM(t);
    drawMath(t);
    requestAnimationFrame(loop);
  }

  resize();
  applyOpacity();
  window.addEventListener('resize', resize, { passive: true });

  // Re-apply opacity when theme changes
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) themeBtn.addEventListener('click', () => setTimeout(applyOpacity, 50));

  requestAnimationFrame(loop);

}());
