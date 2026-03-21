/**
 * Animated Background — Math · Proteins · FEM Triangulation
 *
 * Three layers, each representing a pillar of the research:
 *
 *   1. FEM Triangulation  — deforming mesh of triangles (Scientific Computing)
 *   2. Protein Backbone   — two slowly writhing chain-of-residues (Biomolecular Solvation)
 *   3. Math Symbols       — drifting notation from numerical analysis (Numerical Methods)
 *
 * All layers are theme-aware (light / dark) and fully composited via canvas2d.
 */
(function () {
  'use strict';

  // ── Homepage guard ────────────────────────────────────────────────────────────
  if (document.body.getAttribute('data-page') !== 'home') return;

  // ── Reduced-motion guard ──────────────────────────────────────────────────────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── Canvas setup ──────────────────────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.id = 'rd-bg';
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    zIndex:        '-1',
    pointerEvents: 'none',
  });
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  // ── Theme ─────────────────────────────────────────────────────────────────────
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function rgba(r, g, b, a) { return `rgba(${r},${g},${b},${a.toFixed(3)})`; }

  const PAL = {
    light: {
      femEdge:    [15,  50, 130],
      femFill:    [30,  80, 200],
      protein:    [10,  55, 140],
      proteinAlt: [40, 110, 210],
      math:       [10,  45, 120],
      canvasOp:   0.55,
    },
    dark: {
      femEdge:    [45, 185, 210],
      femFill:    [20, 110, 150],
      protein:    [70, 195, 175],
      proteinAlt: [100, 230, 205],
      math:       [120, 230, 220],
      canvasOp:   0.50,
    },
  };

  function P() { return isDark() ? PAL.dark : PAL.light; }

  // ── FEM Triangulation ─────────────────────────────────────────────────────────
  let femVerts = [];
  let femTris  = [];

  function buildFEM() {
    femVerts = [];
    femTris  = [];
    const COLS = Math.round(W / 125) + 2;
    const ROWS = Math.round(H / 105) + 2;
    const dx = W / (COLS - 2);
    const dy = H / (ROWS - 2);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        femVerts.push({
          bx:  (c - 0.5) * dx + (Math.random() - 0.5) * dx * 0.42,
          by:  (r - 0.5) * dy + (Math.random() - 0.5) * dy * 0.42,
          px:  0, py: 0,
          ph:  Math.random() * Math.PI * 2,
          fr:  0.00022 + Math.random() * 0.00022,
          am:  5 + Math.random() * 9,
        });
      }
    }
    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        const i = r * COLS + c;
        femTris.push([i, i + 1, i + COLS]);
        femTris.push([i + 1, i + COLS + 1, i + COLS]);
      }
    }
  }

  function drawFEM(t) {
    const p = P();
    for (const v of femVerts) {
      v.px = v.bx + Math.sin(t * v.fr         + v.ph      ) * v.am;
      v.py = v.by + Math.cos(t * v.fr * 0.73  + v.ph + 1.2) * v.am * 0.78;
    }
    ctx.lineWidth = 0.55;
    for (const [a, b, c] of femTris) {
      const A = femVerts[a], B = femVerts[b], C = femVerts[c];
      ctx.beginPath();
      ctx.moveTo(A.px, A.py);
      ctx.lineTo(B.px, B.py);
      ctx.lineTo(C.px, C.py);
      ctx.closePath();
      ctx.strokeStyle = rgba(...p.femEdge, 0.16);
      ctx.fillStyle   = rgba(...p.femFill, 0.025);
      ctx.fill();
      ctx.stroke();
    }
    // Accent some vertices as labelled nodes
    for (let i = 0; i < femVerts.length; i += 7) {
      const v = femVerts[i];
      ctx.beginPath();
      ctx.arc(v.px, v.py, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = rgba(...p.femEdge, 0.30);
      ctx.fill();
    }
  }

//   // ── Protein Backbone ──────────────────────────────────────────────────────────
//   const CHAINS = [
//     { cx: 0.30, cy: 0.22, n: 32, ph: 0.00,  sp: 0.000185 },
//     { cx: 0.70, cy: 0.70, n: 26, ph: 1.85,  sp: 0.000155 },
//   ];
// 
//   function residuePos(chain, i, t) {
//     const angle  = (i / chain.n) * Math.PI * 5.8 + chain.ph + t * chain.sp;
//     const rMajor = 55 + 30 * Math.sin(i * 0.42 + chain.ph);
//     const rMinor = 20 + 12 * Math.cos(i * 0.68 + chain.ph * 1.35);
//     return {
//       x: chain.cx * W + rMajor * Math.cos(angle)        + rMinor * Math.cos(angle * 2.15 + 0.5),
//       y: chain.cy * H + rMajor * Math.sin(angle * 0.73) + rMinor * Math.sin(angle * 1.65 + 0.8),
//     };
//   }
// 
//   function drawProteins(t) {
//     const p = P();
//     for (const chain of CHAINS) {
//       const nodes = [];
//       for (let i = 0; i < chain.n; i++) nodes.push(residuePos(chain, i, t));
// 
//       // Backbone trace
//       ctx.lineWidth = 1.4;
//       ctx.strokeStyle = rgba(...p.protein, 0.38);
//       ctx.beginPath();
//       ctx.moveTo(nodes[0].x, nodes[0].y);
//       for (let i = 1; i < nodes.length; i++) ctx.lineTo(nodes[i].x, nodes[i].y);
//       ctx.stroke();
// 
//       // Sidechain stubs every 3rd residue
//       ctx.lineWidth = 0.85;
//       for (let i = 1; i < nodes.length - 1; i += 3) {
//         const prev = nodes[i - 1], curr = nodes[i], next = nodes[i + 1];
//         const mx = (prev.x + next.x) / 2;
//         const my = (prev.y + next.y) / 2;
//         const scale = (10 + 6 * Math.sin(i * 1.3 + chain.ph)) / 15;
//         ctx.beginPath();
//         ctx.moveTo(curr.x, curr.y);
//         ctx.lineTo(curr.x + (curr.x - mx) * 0.6 * scale,
//                    curr.y + (curr.y - my) * 0.6 * scale);
//         ctx.strokeStyle = rgba(...p.proteinAlt, 0.25);
//         ctx.stroke();
//       }
// 
//       // Residue nodes
//       for (let i = 0; i < nodes.length; i++) {
//         const isCA = (i % 4 === 0);
//         ctx.beginPath();
//         ctx.arc(nodes[i].x, nodes[i].y, isCA ? 3.4 : 1.9, 0, Math.PI * 2);
//         ctx.fillStyle = rgba(...(isCA ? p.proteinAlt : p.protein), isCA ? 0.65 : 0.45);
//         ctx.fill();
//       }
//     }
//   }

  // ── Floating Math Symbols ─────────────────────────────────────────────────────
  const SYMBOLS = [
    '∇²u', '∂u/∂t', '∫∫∫', 'Σᵢ', 'λ₁', 'ε → 0',
    'Δx²', '∮ F·ds', '∂v/∂t', 'D∇²u', '−∇·(a∇u)',
    'ADI', 'MIB', 'FEM', 'p-Δ', '‖u‖₂',
    '∇·F', 'J(u,v)', 'κ(A)', 'O(h²)', 'Ax = b',
  ];

  let mathPts = [];

  function initMath() {
    mathPts = SYMBOLS.map(sym => ({
      sym,
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.045,
      vy:  (Math.random() - 0.5) * 0.032,
      ph:  Math.random() * Math.PI * 2,
      sz:  11 + Math.floor(Math.random() * 8),
    }));
  }

  function drawMath(t) {
    const p = P();
    for (const pt of mathPts) {
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.x < -90)  pt.x = W + 50;
      if (pt.x > W+70) pt.x = -70;
      if (pt.y < -25)  pt.y = H + 15;
      if (pt.y > H+25) pt.y = -15;

      const pulse = 0.5 + 0.5 * Math.sin(t * 0.00032 + pt.ph);
      ctx.font      = `${pt.sz}px "Georgia", "Times New Roman", serif`;
      ctx.fillStyle = rgba(...p.math, 0.055 + pulse * 0.095);
      ctx.fillText(pt.sym, pt.x, pt.y);
    }
  }

  // ── Resize ────────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildFEM();
    initMath();
  }

  // ── Apply opacity once (and on theme change) ──────────────────────────────────
  function applyOpacity() {
    canvas.style.opacity = P().canvasOp;
  }

  // ── Page Visibility — pause when tab is hidden ────────────────────────────────
  let paused = false;
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) requestAnimationFrame(loop);
  });

  // ── Animation loop ────────────────────────────────────────────────────────────
  function loop(t) {
    if (paused) return;
    ctx.clearRect(0, 0, W, H);
    drawFEM(t);
    drawProteins(t);
    drawMath(t);
    requestAnimationFrame(loop);
  }

  // ── Boot ──────────────────────────────────────────────────────────────────────
  resize();
  applyOpacity();
  window.addEventListener('resize', resize);

  // Re-apply opacity whenever the theme toggle fires
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) themeBtn.addEventListener('click', applyOpacity);

  requestAnimationFrame(loop);

}());
