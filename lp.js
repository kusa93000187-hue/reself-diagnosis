/* ============================================================
   Re:Self Courage — LP
   lp.js
   ============================================================ */

'use strict';

/* ============================================================
   夜空パーティクル（Canvas）
   ============================================================ */
const canvas = document.getElementById('lpCanvas');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 5000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.65 + 0.15,
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

function drawStars(time) {
  stars.forEach(s => {
    const flicker = Math.sin(time * s.speed * 55 + s.phase) * 0.28 + 0.72;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,220,${s.alpha * flicker})`;
    ctx.fill();
  });
}

/* ============================================================
   金の光の粒（ゴールドダスト）
   ============================================================ */

/* #FFD86A (255,216,106) → #FFE9B3 (255,233,179) を補間 */
function pickGoldColor(t) {
  const g = Math.round(216 + (233 - 216) * t);
  const b = Math.round(106 + (179 - 106) * t);
  return [255, g, b];
}

let goldDust = [];
const GOLD_COUNT = 50;

function initGoldDust() {
  goldDust = [];
  for (let i = 0; i < GOLD_COUNT; i++) {
    /* 小さい粒を多めに、ときどき少し大きい粒を混ぜる */
    const sizeBias = Math.random();
    const r = sizeBias < 0.75
      ? Math.random() * 1.2 + 0.4   /* 細かい埃: 0.4〜1.6px */
      : Math.random() * 1.2 + 1.6;  /* やや大きめ: 1.6〜2.8px */

    goldDust.push({
      x:          Math.random() * canvas.width,
      y:          Math.random() * canvas.height,
      r:          r,
      color:      pickGoldColor(Math.random()),
      baseAlpha:  Math.random() * 0.18 + 0.04,   /* 0.04〜0.22（控えめ） */
      speedY:     Math.random() * 0.20 + 0.05,   /* 0.05〜0.25px/frame */
      driftAmp:   Math.random() * 0.055 + 0.012, /* 水平ゆらぎ振幅 px/frame */
      driftSpeed: Math.random() * 0.010 + 0.004, /* 角周波数（1周期 ≈ 7〜25秒） */
      driftAngle: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.014 + 0.005, /* opacity呼吸（1周期 ≈ 7〜20秒） */
      pulseAngle: Math.random() * Math.PI * 2,
      glow:       r * 3.5 + Math.random() * 5 + 3,
    });
  }
}

function drawGoldDust() {
  goldDust.forEach(p => {
    p.y -= p.speedY;

    p.driftAngle += p.driftSpeed;
    p.x += Math.sin(p.driftAngle) * p.driftAmp;

    if (p.y < -p.r * 8) {
      p.y = canvas.height + p.r * 2;
      p.x = Math.random() * canvas.width;
    }
    if (p.x < -16) p.x = canvas.width + 16;
    if (p.x > canvas.width + 16) p.x = -16;

    p.pulseAngle += p.pulseSpeed;
    const pulse = 0.45 + 0.55 * Math.sin(p.pulseAngle);
    const alpha = p.baseAlpha * pulse;
    if (alpha < 0.008) return;

    const [cr, cg, cb] = p.color;
    ctx.save();
    ctx.shadowColor = `rgba(${cr},${cg},${cb},0.70)`;
    ctx.shadowBlur  = p.glow;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
    ctx.fill();
    ctx.restore();
  });
}

/* ============================================================
   メインアニメーションループ
   ============================================================ */
function animateAll(time = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars(time);
  drawGoldDust();
  requestAnimationFrame(animateAll);
}

window.addEventListener('resize', () => { resizeCanvas(); initStars(); initGoldDust(); });
resizeCanvas();
initStars();
initGoldDust();
animateAll();

/* ============================================================
   スクロールで reveal（IntersectionObserver）
   ============================================================ */
function setupReveal() {
  const items = document.querySelectorAll('.reveal');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      /* 同じ親に属する兄弟要素に stagger delay を付与 */
      const parent = entry.target.parentElement;
      const siblings = [...parent.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = idx >= 0 ? `${idx * 0.10}s` : '0s';

      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}

/* ============================================================
   スティッキーヘッダー（FVを過ぎたら表示）
   ============================================================ */
function setupHeader() {
  const header = document.getElementById('lpHeader');
  const fv     = document.getElementById('s-fv');

  const io = new IntersectionObserver(([entry]) => {
    header.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0.05 });

  io.observe(fv);
}

/* ============================================================
   スクロール位置に応じて星の透明度を下げる（夜→夜明け演出）
   ============================================================ */
function setupScrollFade() {
  const totalH = document.body.scrollHeight - window.innerHeight;

  window.addEventListener('scroll', () => {
    const pct = Math.min(window.scrollY / totalH, 1);
    /* 後半セクションほど星が薄くなる（最大60%減） */
    const fadeAlpha = 1 - pct * 0.60;
    canvas.style.opacity = fadeAlpha.toFixed(3);
  }, { passive: true });
}

/* ============================================================
   スムーズスクロール（anchorリンク対応）
   ============================================================ */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================================
   モックバーのアニメーション（画面内に入ったとき）
   ============================================================ */
function setupMockBars() {
  const frame = document.querySelector('.preview-showcase');
  if (!frame) return;

  const fills = frame.querySelectorAll('.mock-bar-fill');

  /* 一旦幅を0にリセットしてからアニメーション */
  fills.forEach(el => {
    el.dataset.target = el.style.width;
    el.style.width = '0%';
    el.style.transition = 'width 1.2s cubic-bezier(0.16,1,0.3,1)';
  });

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    fills.forEach((el, i) => {
      setTimeout(() => { el.style.width = el.dataset.target; }, i * 120);
    });
    io.unobserve(entry.target);
  }, { threshold: 0.3 });

  io.observe(frame);
}

/* ============================================================
   パララックス（FV ヒーロー背景）
   ============================================================ */
function setupParallax() {
  const isMobile = () => window.innerWidth < 768;

  /* 各パララックスレイヤーの設定 */
  const LAYERS = [
    {
      id:      'fvParallax',
      section: 's-fv',
      speed:   { mobile: 0.10, desktop: 0.22 },
    },
    {
      id:      'aboutBg',
      section: 's-about',
      speed:   { mobile: 0.08, desktop: 0.18 },
    },
  ].map(cfg => ({
    ...cfg,
    el:  document.getElementById(cfg.id),
    sec: document.getElementById(cfg.section),
  })).filter(l => l.el && l.sec);

  if (!LAYERS.length) return;

  let ticking = false;

  function applyAll() {
    const scrollY = window.scrollY;
    const mobile  = isMobile();

    LAYERS.forEach(({ el, sec, speed }) => {
      const secBottom = sec.getBoundingClientRect().top + scrollY + sec.offsetHeight;
      const secTop    = sec.getBoundingClientRect().top + scrollY;

      /* セクション範囲外は更新しない */
      if (scrollY > secBottom || scrollY + window.innerHeight < secTop) return;

      const sp = mobile ? speed.mobile : speed.desktop;
      /* セクション先頭からの相対スクロール量でパララックス量を計算 */
      const relScroll = Math.max(0, scrollY - secTop + window.innerHeight);
      el.style.transform = `translateY(${(relScroll * sp).toFixed(2)}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(applyAll);
      ticking = true;
    }
  }, { passive: true });

  /* 初期位置を適用 */
  applyAll();
}

/* ============================================================
   夜明けスクロール（背景グラデーションを scroll に連動）
   ============================================================ */
function setupDawnScroll() {
  const bgEl = document.getElementById('bgDawn');
  if (!bgEl) return;

  /* セクション ID → 夜明けフェーズ（0 = 深夜, 4 = 朝の光） */
  const MARKERS = [
    { id: 's-fv',       phase: 0   },
    { id: 's-empathy',  phase: 1   },
    { id: 's-about',    phase: 1.5 },
    { id: 's-features', phase: 2   },
    { id: 's-preview',  phase: 3   },
    { id: 's-consult',  phase: 3.5 },
    { id: 's-cta',      phase: 4   },
  ];

  /* 各フェーズの停止色 [r,g,b] × 4点（0% / 30% / 65% / 100%） */
  const PHASE_COLORS = [
    /* 0: 深いネイビー（FV） */
    [[6,2,26],    [14,5,40],   [24,8,56],    [14,5,30]],
    /* 1: 深い紫（共感） */
    [[8,2,32],    [20,6,58],   [35,10,72],   [22,7,52]],
    /* 2: 朝焼け（診断紹介） */
    [[10,4,35],   [28,8,55],   [65,18,48],   [45,14,28]],
    /* 3: 朝日（結果イメージ・相談） */
    [[12,5,38],   [38,12,58],  [90,28,35],   [100,48,10]],
    /* 4: 柔らかいゴールド（CTA） */
    [[14,6,42],   [42,14,55],  [100,36,28],  [140,72,8]],
  ];

  const POSITIONS = ['0%', '30%', '65%', '100%'];

  function lerpColor(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
  }

  function phaseToColors(phase) {
    const max     = PHASE_COLORS.length - 1;
    const clamped = Math.max(0, Math.min(phase, max));
    const lo      = Math.min(Math.floor(clamped), max - 1);
    const t       = clamped - lo;
    return PHASE_COLORS[lo].map((c, i) => lerpColor(c, PHASE_COLORS[lo + 1][i], t));
  }

  function buildGradient(colors) {
    return 'linear-gradient(to bottom, ' +
      colors.map((c, i) => `rgb(${c[0]},${c[1]},${c[2]}) ${POSITIONS[i]}`).join(', ') +
      ')';
  }

  let markers = [];

  function calcMarkers() {
    markers = MARKERS
      .map(m => {
        const el = document.getElementById(m.id);
        if (!el) return null;
        const y = el.getBoundingClientRect().top + window.scrollY;
        return { y, phase: m.phase };
      })
      .filter(Boolean);
  }

  function getCurrentPhase() {
    const scrollTop = window.scrollY;
    for (let i = markers.length - 1; i >= 0; i--) {
      if (scrollTop >= markers[i].y) {
        if (i === markers.length - 1) return markers[i].phase;
        const span = markers[i + 1].y - markers[i].y;
        const t    = span > 0 ? Math.min(1, (scrollTop - markers[i].y) / span) : 1;
        return markers[i].phase + (markers[i + 1].phase - markers[i].phase) * t;
      }
    }
    return 0;
  }

  let ticking = false;

  function update() {
    bgEl.style.background = buildGradient(phaseToColors(getCurrentPhase()));
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  window.addEventListener('resize', () => { calcMarkers(); update(); }, { passive: true });

  calcMarkers();
  update();
}

/* ============================================================
   初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  setupHeader();
  setupScrollFade();
  setupSmoothScroll();
  setupMockBars();
  setupParallax();
  setupDawnScroll();
});
