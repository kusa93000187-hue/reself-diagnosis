/* ============================================================
   Re:Self Courage — 人生の主導権診断 v2
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   診断データ
   ============================================================ */

const QUESTIONS = [
  { text: '何かを決める時、自分より相手を優先することが多い',   category: '自分軸',   catIndex: 0 },
  { text: '頼まれると断れないことが多い',                       category: '自分軸',   catIndex: 0 },
  { text: '周りの期待に応えようとしてしまう',                   category: '自分軸',   catIndex: 0 },
  { text: '本当は嫌でも我慢してしまう',                         category: '自分軸',   catIndex: 0 },
  { text: '自分が本当にやりたいことが分からない',               category: '本音',     catIndex: 1 },
  { text: '自分の気持ちより正しさを優先してしまう',             category: '本音',     catIndex: 1 },
  { text: '本音を言うのが怖い',                                 category: '本音',     catIndex: 1 },
  { text: 'モヤモヤしてもそのままにしてしまう',                 category: '本音',     catIndex: 1 },
  { text: '自分に自信がない',                                   category: '自己信頼', catIndex: 2 },
  { text: '失敗すると自分を責める',                             category: '自己信頼', catIndex: 2 },
  { text: '他人と比べて落ち込む',                               category: '自己信頼', catIndex: 2 },
  { text: '「私なんて」と思うことがある',                       category: '自己信頼', catIndex: 2 },
  { text: '変わりたいと思いながら動けない',                     category: '行動力',   catIndex: 3 },
  { text: 'タイミングを待ってしまう',                           category: '行動力',   catIndex: 3 },
  { text: 'やりたいことより失敗しないことを選ぶ',               category: '行動力',   catIndex: 3 },
  { text: '人生を自分で選んでいる感覚が少ない',                 category: '行動力',   catIndex: 3 },
  { text: '今の自分を好きと言えない',                           category: '自己受容', catIndex: 4 },
  { text: '頑張っていない自分には価値がないと思う',             category: '自己受容', catIndex: 4 },
  { text: 'もっとちゃんとしなければと思う',                     category: '自己受容', catIndex: 4 },
  { text: 'ありのままの自分を受け入れられていない',             category: '自己受容', catIndex: 4 },
];

const CATEGORY_NAMES = ['自分軸', '本音', '自己信頼', '行動力', '自己受容'];

/* ============================================================
   タイプデータ（感情が動く文章で全書き直し）
   ============================================================ */
const TYPES = [
  {
    level:    'Lv.1',
    name:     '自分軸安定タイプ',
    minScore: 80,

    /* 感情の手紙 */
    letter: `あなたは、自分のことをちゃんと見てあげられています。

それって、当たり前のようで、
実はとても難しいことなんです。

流されそうになる場面でも、
「私はどうしたいんだろう」と立ち止まれた。
その積み重ねが、今のあなたをつくっています。

ときに揺れることがあっても、
それはあなたが弱いからじゃない。
それだけ丁寧に、誠実に生きてきた証拠です。

一つだけ聞かせてください。
「もっと自由に生きていいんだ」って、
自分に言えていますか？

これからのあなたには、
もっと肩の力を抜いて、
もっと自分を甘やかして、
もっと軽やかに生きる場所が待っています。

あなたにはもう、その資格があります。`,

    state: '自分の感覚や直感を大切にできています。\n他者の意見を受け入れながらも、\n自分らしい判断ができている状態です。',

    scoreComment: '人生の主導権を\nしっかり握れています。',

    steps: [
      '今日感じた「好き」を一つ、声に出してみる',
      '直感を信じて、今日だけ即決してみる',
      '「もっと甘えていい」と、自分に言ってあげる',
    ],

    cheer: 'あなたらしく、生きていい。\nそのままのあなたで、十分すぎるほど美しい。\nこれからの人生が、もっと豊かになっていくように。',

    strength: `自分の軸を持ちながら、相手の気持ちにも寄り添える。\nそのバランス感覚が、あなたの一番の強みです。`,

    challenge: `「これで本当に良かった？」と自問しすぎて、\nせっかく出した答えに迷いが生まれることがあります。`,

    bridge: `診断は、ここで終わります。\nでも、あなたの人生は\nここから始まります。`,

    ctaSub: '今の安定をさらに深める\n個別相談を、無料でご提供しています。',
  },
  {
    level:    'Lv.2',
    name:     '自分軸回復期',
    minScore: 60,

    letter: `何かが変わり始めていること、感じていますか？

以前より少しだけ、
「私はどうしたいんだろう」って思う瞬間が増えてきた。
小さな違和感に、気づけるようになってきた。

その変化は、偶然じゃないんです。
あなたが少しずつ、
自分に正直になろうとしているから。

まだ不安定な部分があっても、揺れていても大丈夫。
「ちゃんと自分軸で生きなきゃ」って
焦らなくていい。

今のあなたに必要なのは、もっと頑張ることじゃなくて、
自分を責めない練習です。

「これでよかったのかな」じゃなくて、
「これが、今の私の選択だ」と思えるように。

一緒に、育てていきましょう。`,

    state: '自分の気持ちに気づき始めているけれど、\nまだ他者軸と自分軸が混在している段階です。\n変化の途中にいます。',

    scoreComment: '少しずつ、主導権を\n取り戻している途中です。',

    steps: [
      '今日一つだけ、自分の気持ちを優先してみる',
      '「本当はどうしたかった？」を夜に書いてみる',
      '心が軽くなる時間を、15分だけ確保する',
    ],

    cheer: '焦らなくていいんです。\nあなたのペースで、ゆっくりでいい。\nその一歩一歩が、確かにあなたを変えています。',

    strength: `変わりたいという意欲と、自分を振り返る誠実さを持っています。\n気づける人だからこそ、変われる。`,

    challenge: `決断した後に「あれで良かったのか」と揺れ戻すことがあります。\n自分より他者の評価を先に気にしてしまう傾向があります。`,

    bridge: `一人で、抱えなくていい。\nあなたの答えを、\n一緒に見つけましょう。`,

    ctaSub: '変化の途中にいるあなたへ。\n一緒に整理する時間を、無料でご提供しています。',
  },
  {
    level:    'Lv.3',
    name:     '他人軸優勢期',
    minScore: 40,

    letter: `ずっと、誰かのために頑張ってきたんだね。

「断ったら申し訳ない」
「私さえ我慢すれば、うまくいく」
「相手を怒らせるくらいなら、自分が折れればいい」

そんな言葉を、何度も心の中でつぶやいてきたんじゃないかな。

あなたは弱いんじゃない。
優しすぎるくらい、優しい人なんです。

でも、その優しさは今、
少しずつあなた自身を削っています。

本音が分からなくなってきていませんか？
何が好きで、何が嫌いで、
本当はどうしたいのか。

大丈夫。本音は消えていません。
ただ、長い間「後回し」にされてきただけです。

今日から、一つだけ聞いてあげてください。
「本当はどうしたかった？」って。
あなたの声は、ちゃんとそこにあります。`,

    state: '他者の気持ちや期待を優先することが\nいつの間にか当たり前になっている状態です。\n自分の本音を出すことへの怖さがあるかもしれません。',

    scoreComment: '今が、本音に気づく\n大切なタイミングです。',

    steps: [
      '嫌だったことを一つ、紙に書き出してみる',
      '小さな「NO」を一つだけ練習してみる',
      '誰にも見せない日記に「本当はどう感じた？」と書く',
    ],

    cheer: 'あなたの本音は、消えていません。\nただ、長い間眠っていただけです。\n今日から少しずつ、あなた自身の声を聞かせてあげてください。',

    strength: `場の空気を読み、周囲を気にかける優しさは本物の強みです。\nその細やかさは、誰もが持てるものではありません。`,

    challenge: `自分の気持ちより「正しいかどうか」を先に考えてしまい、\n本音を出す前に抑え込んでしまうことがあります。`,

    bridge: `あなたは、変わっていい。\nその一歩を、\n一緒に踏み出しましょう。`,

    ctaSub: '本音を出す練習を、\n安心できる場所でしませんか。\n初回無料でお話を聞かせてください。',
  },
  {
    level:    'Lv.4',
    name:     '人生再起動期',
    minScore: 0,

    letter: `ここまで来てくれて、ありがとう。

今、苦しいですか？

「頑張っているのに、何かが違う」
「自分のことが、もう分からない」
「このまま生きていていいのか、分からなくなってきた」

そんな声が、胸の奥に積み重なっていませんか。

あなたは、壊れていません。
おかしくなんかない。

ただ、長い間、自分を後回しにしすぎて、
心が「もう限界だよ」って言い始めているだけです。

疲れて当然。
苦しくて当然。
もうこれ以上頑張れないと感じて、当然です。

一つだけ、覚えていてほしいことがあります。
どんなに迷子になっても、
自分に戻る道は、必ずある。

今がそのタイミングです。

あなたの人生は、今日ここから、
始め直せます。`,

    state: '長い間、自分よりも他者や「べき」を\n優先してきた疲れが積み重なっている状態です。\n今こそ、自分と向き合う最初の一歩が必要です。',

    scoreComment: '今が、人生を\n選び直すタイミングです。',

    steps: [
      '今日一日、自分を責めることをやめてみる',
      '「本当はどんな人生を送りたい？」を紙に書いてみる',
      '信頼できる人に、今の気持ちを少しだけ話してみる',
    ],

    cheer: '人生は、今日からでも変えられます。\nあなたには、その力があります。\n一人で抱え込まないで。\nそっと、手を伸ばしてみてください。',

    strength: `今ここで立ち止まり、自分と向き合おうとしている。\nその勇気こそが、これからのあなたの土台になります。`,

    challenge: `長年の「我慢する」習慣が積み重なり、\n自分の本音が何かを感じること自体が難しくなっています。`,

    bridge: `一人で、抱えないでください。\nあなたの声を、\n聞かせてください。`,

    ctaSub: 'あなたのことを、\nもっと知らせてください。\n初回無料・完全オンラインで対応しています。',
  },
];

const ANALYZING_MSGS = [
  'あなたの回答を分析しています',
  '5つの視点を照らし合わせています',
  'あなたの現在地を特定しています',
  '結果を構成しています',
];

/* ============================================================
   アプリ状態
   ============================================================ */
let currentQuestion = 0;
let answers = new Array(20).fill(null);
let isTransitioning = false;
let isAnswering = false; // 回答選択後の自動遷移中フラグ

/* ============================================================
   背景（星パーティクル + グラデーション）
   ============================================================ */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx    = bgCanvas.getContext('2d');
let particles  = [];
let bgPhase    = 0;

function resizeCanvas() {
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function initParticles() {
  particles = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 5500);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:     Math.random() * bgCanvas.width,
      y:     Math.random() * bgCanvas.height,
      r:     Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.65 + 0.15,
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    });
  }
}

/* 背景グラデーション（夜→朝日 4段階） */
const BG_STOPS = [
  [[0,'#080315'],[0.4,'#1a0a30'],[0.7,'#2d1245'],[1,'#4a1a55']],  // 夜
  [[0,'#18082a'],[0.3,'#3d1c4f'],[0.55,'#7b3468'],[0.8,'#c05040'],[1,'#e88040']], // 夜明け
  [[0,'#3d1c4f'],[0.3,'#c05040'],[0.6,'#e88a40'],[0.9,'#f5d890'],[1,'#fff8e0']], // 朝焼け
  [[0,'#f0d880'],[0.3,'#fff8e0'],[0.7,'#ffffff'],[1,'#fff8f0']], // 朝日
];

function drawBg(phase) {
  const idx  = Math.min(Math.floor(phase), BG_STOPS.length - 1);
  const next = Math.min(idx + 1, BG_STOPS.length - 1);
  const t    = phase - idx;
  const grad = bgCtx.createLinearGradient(0, 0, bgCanvas.width * 0.55, bgCanvas.height);

  BG_STOPS[idx].forEach((stop, i) => {
    const c1 = hexRgb(stop[1]);
    const c2 = hexRgb(BG_STOPS[next][i][1]);
    const r  = Math.round(c1.r + (c2.r - c1.r) * t);
    const g  = Math.round(c1.g + (c2.g - c1.g) * t);
    const b  = Math.round(c1.b + (c2.b - c1.b) * t);
    grad.addColorStop(stop[0], `rgb(${r},${g},${b})`);
  });

  bgCtx.fillStyle = grad;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
}

function hexRgb(hex) {
  return {
    r: parseInt(hex.slice(1,3),16),
    g: parseInt(hex.slice(3,5),16),
    b: parseInt(hex.slice(5,7),16),
  };
}

function drawStars(time) {
  const alpha = Math.max(0, 1 - bgPhase * 0.65);
  if (alpha <= 0.02) return;
  particles.forEach(p => {
    const f = Math.sin(time * p.speed * 55 + p.phase) * 0.28 + 0.72;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255,255,220,${p.alpha * f * alpha})`;
    bgCtx.fill();
  });
}

function animateBg(time = 0) {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  drawBg(bgPhase);
  drawStars(time);
  requestAnimationFrame(animateBg);
}

/* ============================================================
   ステージ遷移
   ============================================================ */
function goToStage(name) {
  if (isTransitioning) return;
  isTransitioning = true;

  const cur  = document.querySelector('.stage:not(.hidden):not(.fade-out)');
  const next = document.getElementById('stage-' + name);
  if (!next || cur === next) { isTransitioning = false; return; }

  if (cur) {
    cur.classList.add('fade-out');
    setTimeout(() => { cur.classList.add('hidden'); cur.classList.remove('fade-out'); }, 380);
  }

  setTimeout(() => {
    next.classList.remove('hidden');
    void next.offsetWidth;
    isTransitioning = false;
  }, 200);
}

/* ============================================================
   クイズ
   ============================================================ */
function startQuiz() {
  currentQuestion = 0;
  answers.fill(null);
  bgPhase = 0.25;
  goToStage('quiz');
  setTimeout(showQuestion, 280);
}

function showQuestion() {
  const q = QUESTIONS[currentQuestion];
  if (!q) return;

  document.getElementById('questionCategory').textContent = q.category;
  document.getElementById('questionText').textContent     = q.text;
  document.getElementById('progressCount').textContent    = `${currentQuestion + 1} / 20`;
  document.getElementById('progressBar').style.width      = `${((currentQuestion + 1) / 20) * 100}%`;

  /* 前問に戻った場合は選択済み回答を復元、未回答なら全解除 */
  const saved = answers[currentQuestion];
  document.querySelectorAll('.answer-btn').forEach(b => {
    b.classList.toggle('selected', saved !== null && parseInt(b.dataset.value) === saved);
  });

  /* 1問目は「前の質問」ボタンを非表示 */
  const btnPrev = document.getElementById('btnPrev');
  btnPrev.classList.toggle('invisible', currentQuestion === 0);

  const card = document.getElementById('questionCard');
  const opts = document.getElementById('answerOptions');
  card.classList.remove('q-exit', 'q-enter');
  opts.classList.remove('q-stagger');
  void card.offsetWidth;
  card.classList.add('q-enter');
  opts.classList.add('q-stagger');

  bgPhase = 0.25 + (currentQuestion / 19) * 1.0;
}

function goToPrevQuestion() {
  /* 自動遷移中・ステージ遷移中・1問目では戻れない */
  if (isAnswering || isTransitioning || currentQuestion === 0) return;
  currentQuestion--;
  showQuestion();
}

function selectAnswer(value) {
  /* 自動遷移中・ステージ遷移中は多重選択を防ぐ */
  if (isAnswering || isTransitioning) return;
  isAnswering = true;

  document.querySelectorAll('.answer-btn').forEach(b => {
    b.classList.toggle('selected', parseInt(b.dataset.value) === value);
  });

  answers[currentQuestion] = value;

  const card = document.getElementById('questionCard');
  card.classList.add('q-exit');

  setTimeout(() => {
    card.classList.remove('q-exit');
    currentQuestion++;
    isAnswering = false;
    if (currentQuestion >= QUESTIONS.length) showAnalyzing();
    else showQuestion();
  }, 300);
}

/* ============================================================
   スコア計算
   ============================================================ */
function calcScores() {
  const catRaw = [0, 0, 0, 0, 0];
  answers.forEach((v, i) => { catRaw[QUESTIONS[i].catIndex] += (v || 3); });

  /* 高いほど課題あり → 反転して主導権スコアへ（各カテゴリ min4, max20, range16） */
  const catPct = catRaw.map(s => Math.round(Math.max(0, Math.min(100, ((20 - s) / 16) * 100))));
  const total  = Math.round(catPct.reduce((a,b) => a+b, 0) / 5);
  return { catPct, total };
}

function getType(total) {
  return TYPES.find(t => total >= t.minScore) || TYPES[TYPES.length - 1];
}

/* ============================================================
   分析中画面
   ============================================================ */
function showAnalyzing() {
  goToStage('analyzing');
  bgPhase = 2.6;

  const el  = document.getElementById('analyzingMsg');
  let   idx = 0;

  el.textContent = ANALYZING_MSGS[0];
  el.classList.remove('fade-out');

  function nextMsg() {
    el.classList.add('fade-out');
    setTimeout(() => {
      idx = (idx + 1) % ANALYZING_MSGS.length;
      el.textContent = ANALYZING_MSGS[idx];
      el.classList.remove('fade-out');
    }, 580);
  }

  const timer = setInterval(nextMsg, 1600);

  setTimeout(() => {
    clearInterval(timer);
    showResult();
  }, 5200);
}

/* ============================================================
   結果表示
   ============================================================ */
function showResult() {
  goToStage('result');
  bgPhase = 3.0;
  setTimeout(renderResult, 450);
}

function renderResult() {
  const { catPct, total } = calcScores();
  const type = getType(total);

  /* テキスト注入 */
  document.getElementById('resultTypeName').textContent = type.name;
  document.getElementById('resultLevel').textContent    = type.level;
  document.getElementById('letterText').textContent     = type.letter;
  document.getElementById('strengthText').textContent   = type.strength;
  document.getElementById('challengeText').textContent  = type.challenge;
  document.getElementById('scoreComment').textContent   = type.scoreComment;
  document.getElementById('bridgeText').textContent     = type.bridge;
  document.getElementById('ctaSub').textContent         = type.ctaSub;

  /* 最初の一歩 */
  const list = document.getElementById('stepsList');
  list.innerHTML = '';
  type.steps.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'step-item';
    el.innerHTML = `<span class="step-num">${i+1}</span><p class="step-text">${s}</p>`;
    list.appendChild(el);
  });

  /* スコアバー */
  const bars = document.getElementById('scoreBars');
  bars.innerHTML = '';
  CATEGORY_NAMES.forEach((name, i) => {
    const el = document.createElement('div');
    el.className = 'score-bar-item';
    el.innerHTML = `
      <div class="score-bar-header">
        <span class="score-bar-name">${name}</span>
        <span class="score-bar-val">${catPct[i]}点</span>
      </div>
      <div class="score-bar-track">
        <div class="score-bar-fill" data-target="${catPct[i]}" style="width:0%"></div>
      </div>`;
    bars.appendChild(el);
  });

  /* IntersectionObserver でカードを順次フェードイン */
  setupRevealObserver();

  /* スコアアニメーション（少し遅らせて、カードが見えてから） */
  setTimeout(() => animateScore(total), 800);

  /* スコアバーアニメーション */
  setTimeout(() => {
    bars.querySelectorAll('.score-bar-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 1200);

  /* レーダーチャート */
  setTimeout(() => drawRadar(catPct), 1000);
}

/* ============================================================
   IntersectionObserver：スクロールで順次フェードイン
   ============================================================ */
function setupRevealObserver() {
  const cards = document.querySelectorAll('#stage-result .reveal-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach((card, i) => {
    /* ページ内の先頭カードは即時表示 */
    card.style.transitionDelay = i < 2 ? `${i * 0.12}s` : '0s';
    io.observe(card);
  });
}

/* ============================================================
   スコアカウントアップ + リングアニメーション
   ============================================================ */
function animateScore(target) {
  const numEl = document.getElementById('scoreNumber');
  const ring  = document.getElementById('scoreRingFill');
  const circ  = 326.7;
  const dur   = 2000;
  const t0    = performance.now();

  function step(now) {
    const p    = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    numEl.textContent = Math.round(ease * target);
    ring.style.strokeDashoffset = circ - circ * ease * target / 100;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   レーダーチャート（Canvas）
   ============================================================ */
function drawRadar(pct) {
  const canvas = document.getElementById('radarChart');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 + 4;
  const maxR = Math.min(W, H) * 0.37;
  const N = 5;
  const step = (Math.PI * 2) / N;
  const offset = -Math.PI / 2;
  const DOT_COLORS = ['#D4AF37','#F2A7C3','#A8D8EA','#AA96DA','#FCBAD3'];

  function pt(i, r) {
    const a = offset + i * step;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function grid() {
    ctx.clearRect(0, 0, W, H);

    /* 同心多角形 */
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(t => {
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const p = pt(i, maxR * t);
        i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    /* 軸線 */
    for (let i = 0; i < N; i++) {
      const p = pt(i, maxR);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.11)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* ラベル */
    ctx.font = '500 11px "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    CATEGORY_NAMES.forEach((name, i) => {
      const p = pt(i, maxR + 23);
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.fillText(name, p.x, p.y);
    });
  }

  const dur = 1000, t0 = performance.now();

  function draw(progress) {
    grid();

    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const r = (pct[i] / 100) * maxR * progress;
      const p = pt(i, r);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grd.addColorStop(0, 'rgba(212,175,55,0.42)');
    grd.addColorStop(1, 'rgba(242,167,195,0.16)');
    ctx.fillStyle = grd;
    ctx.fill();

    ctx.strokeStyle = 'rgba(212,175,55,0.78)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    for (let i = 0; i < N; i++) {
      const r = (pct[i] / 100) * maxR * progress;
      const p = pt(i, r);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = DOT_COLORS[i];
      ctx.fill();
    }
  }

  function animate(now) {
    const t    = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 2);
    draw(ease);
    if (t < 1) requestAnimationFrame(animate);
  }

  grid();
  requestAnimationFrame(animate);
}

/* ============================================================
   リトライ
   ============================================================ */
function retryQuiz() {
  currentQuestion = 0;
  answers.fill(null);
  bgPhase = 0;
  goToStage('opening');
}

/* ============================================================
   初期化
   ============================================================ */
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

resizeCanvas();
initParticles();
animateBg();
