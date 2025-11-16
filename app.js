// i18next Initialization
let i18nextInstance = null;

async function initI18next() {
  i18nextInstance = i18next.createInstance();
  
  await i18nextInstance
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: 'ja',
      debug: false,
      resources: {
        ja: {
          translation: await fetch('./locales/ja/translation.json').then(r => r.json())
        },
        en: {
          translation: await fetch('./locales/en/translation.json').then(r => r.json())
        },
        'zh-Hant': {
          translation: await fetch('./locales/zh-Hant/translation.json').then(r => r.json())
        },
        'zh-Hans': {
          translation: await fetch('./locales/zh-Hans/translation.json').then(r => r.json())
        },
        ko: {
          translation: await fetch('./locales/ko/translation.json').then(r => r.json())
        }
      }
    });
  
  // Update UI with translations
  updateTranslations();
  
  // Setup language selector
  const langSelect = document.getElementById('languageSelect');
  langSelect.value = i18nextInstance.language;
  langSelect.addEventListener('change', (e) => {
    i18nextInstance.changeLanguage(e.target.value).then(() => {
      updateTranslations();
      updateSelectOptions();
      updateInitialText();
      updateFooterText();
      render();
    });
  });
}

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key.startsWith('[')) {
      // Handle attributes like [placeholder]
      const match = key.match(/\[(\w+)\](.+)/);
      if (match) {
        const attr = match[1];
        const transKey = match[2];
        el.setAttribute(attr, i18nextInstance.t(transKey));
      }
    } else {
      el.textContent = i18nextInstance.t(key);
    }
  });
  
  // Update title
  document.title = i18nextInstance.t('title');
}

function updateSelectOptions() {
  // Update select options that have data-i18n
  document.querySelectorAll('select option[data-i18n]').forEach(option => {
    const key = option.getAttribute('data-i18n');
    option.textContent = i18nextInstance.t(key);
  });
}

function updateInitialText() {
  const lang = i18nextInstance.language;
  if (lang === 'en') {
    els.text.value = 
      "Is Japan going to repeat the mistakes of militarism again?\n\n" +
      "Is it going to make enemies of the Chinese people and Asian people again?\n\n" +
      "Is it trying to overturn the post-war international order?";
  } else if (lang === 'ko') {
    els.text.value = 
      "일본이 다시 군국주의의 실수를 반복하려는가\n\n" +
      "다시 중국 인민과 아시아 인민을 적으로 돌리려는가\n\n" +
      "전후 국제 질서를 뒤엎으려 하는가";
  } else if (lang === 'zh-Hans') {
    els.text.value = 
      "日本是否要再次重蹈军国主义的错误\n\n" +
      "是否要再次与中国人民和亚洲人民为敌\n\n" +
      "是否要颠覆战后的国际秩序";
  } else if (lang === 'zh-Hant') {
    els.text.value = 
      "日本是否要再次重蹈軍國主義的錯誤\n\n" +
      "是否要再次與中國人民和亞洲人民為敵\n\n" +
      "是否要顛覆戰後的國際秩序";
  } else {
    // Japanese default
    els.text.value = 
      "日本は再び軍国主義の過ちを繰り返すつもりなのか\n\n" +
      "再び中国人民とアジア人民を敵に回すつもりなのか\n\n" +
      "戦後の国際秩序を覆そうとしているのか";
  }
}

function updateFooterText() {
  const currentBg = els.bgSelect.value;
  els.footerText.value = getFooterText(currentBg);
}

// Constants
const HIGHLIGHT_COLOR = "#D8AE5C";
const FLAG_DEFAULT_CODES = { flag1: 'CN', flag2: 'JP' };
const BACKGROUND_TYPES = {
  FOREIGN_AFFAIRS: 'background.png',
  DEFENSE: 'background2.png',
  MAO_NING: 'background3.png'
};

function getFooterPrefixes() {
  return {
    FOREIGN_AFFAIRS: i18nextInstance ? i18nextInstance.t('footerForeignAffairs') : '中国外交部報道官',
    DEFENSE: i18nextInstance ? i18nextInstance.t('footerDefense') : '中国国防部報道官'
  };
}
const FLAG_RENDER_CONFIG = {
  sizeRatio: 0.11,
  yRatio: 0.1,
  spacingRatio: 0.05
};
const FALLBACK_FLAGS = [
  {code: "CN", emoji: "🇨🇳", name: "中国"},
  {code: "JP", emoji: "🇯🇵", name: "日本"},
  {code: "US", emoji: "🇺🇸", name: "アメリカ"},
  {code: "KR", emoji: "🇰🇷", name: "韓国"},
  {code: "RU", emoji: "🇷🇺", name: "ロシア"},
  {code: "GB", emoji: "🇬🇧", name: "イギリス"},
  {code: "FR", emoji: "🇫🇷", name: "フランス"},
  {code: "DE", emoji: "🇩🇪", name: "ドイツ"}
];

// DOM Elements
const els = {
  cv: document.getElementById('cv'),
  bgSelect: document.getElementById('bgSelect'),
  text: document.getElementById('text'),
  fontSize: document.getElementById('fontSize'),
  lineHeight: document.getElementById('lineHeight'),
  marginX: document.getElementById('marginX'),
  startY: document.getElementById('startY'),
  textColor: document.getElementById('textColor'),
  shadowBlur: document.getElementById('shadowBlur'),
  fontFamily: document.getElementById('fontFamily'),
  quoteMode: document.getElementById('quoteMode'),
  footerText: document.getElementById('footerText'),
  footerSize: document.getElementById('footerSize'),
  renderBtn: document.getElementById('renderBtn'),
  saveBtn: document.getElementById('saveBtn'),
  highlightGoldBtn: document.getElementById('highlightGoldBtn'),
  flagSelectContainer: document.getElementById('flagSelectContainer'),
  flag1: document.getElementById('flag1'),
  flag2: document.getElementById('flag2')
};

// State
let bgImg = null;
let flagsData = [];

// Utility Functions
function formatDateJP(d) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}年${m}月${day}日`;
}

function getFontFamily() {
  const fontMap = {
    serif: '"Noto Serif JP","Hiragino Mincho ProN","Yu Mincho",serif',
    sans: '"Noto Sans JP","Hiragino Sans","Yu Gothic",sans-serif'
  };
  return fontMap[els.fontFamily.value] || fontMap.sans;
}

function formatDate(d, lang) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  
  if (lang === 'en') {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[m - 1]} ${day}, ${y}`;
  } else if (lang === 'ko') {
    return `${y}년 ${m}월 ${day}일`;
  } else if (lang === 'zh-Hans' || lang === 'zh-Hant') {
    return `${y}年${m}月${day}日`;
  }
  // Japanese default
  return `${y}年${m}月${day}日`;
}

function getFooterText(backgroundType) {
  const lang = i18nextInstance ? i18nextInstance.language : 'ja';
  const today = formatDate(new Date(), lang);
  const prefixes = getFooterPrefixes();
  
  if (backgroundType === BACKGROUND_TYPES.DEFENSE) {
    return `${prefixes.DEFENSE} ${today}`;
  }
  return `${prefixes.FOREIGN_AFFAIRS} ${today}`;
}

// Background Loading
function loadBackground(name) {
  bgImg = new Image();
  bgImg.onload = () => {
    els.cv.width = bgImg.width;
    els.cv.height = bgImg.height;
    render();
  };
  bgImg.src = './' + name;
}

// Flag Data Management
function loadFlags() {
  fetch('./flags.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      flagsData = data;
      populateFlagSelects();
    })
    .catch(error => {
      console.error('国旗データの読み込みに失敗しました:', error);
      flagsData = FALLBACK_FLAGS;
      populateFlagSelects();
    });
}

function createFlagOption(flag, defaultCode) {
  const option = document.createElement('option');
  option.value = flag.emoji;
  option.textContent = `${flag.name} ${flag.emoji}`;
  if (flag.code === defaultCode) option.selected = true;
  return option;
}

function populateFlagSelects() {
  els.flag1.innerHTML = '';
  els.flag2.innerHTML = '';

  flagsData.forEach(flag => {
    els.flag1.appendChild(createFlagOption(flag, FLAG_DEFAULT_CODES.flag1));
    els.flag2.appendChild(createFlagOption(flag, FLAG_DEFAULT_CODES.flag2));
  });
}

// [g]...[/g] を解析して色付きトークン列に変換
function parseTokens(text, baseColor, highlightColor) {
  const tokens = [];
  let i = 0;
  let currentColor = baseColor;
  while (i < text.length) {
    if (text.startsWith("[g]", i)) {
      currentColor = highlightColor;
      i += 3;
      continue;
    }
    if (text.startsWith("[/g]", i)) {
      currentColor = baseColor;
      i += 4;
      continue;
    }
    const ch = text[i];
    tokens.push({ char: ch, color: currentColor });
    i++;
  }
  return tokens;
}

// トークン列を行ごとに分割（自動折り返し）
function layoutTokens(ctx, tokens, maxWidth) {
  const lines = [];
  let currentTokens = [];
  let currentWidth = 0;

  for (const t of tokens) {
    if (t.char === "\n") {
      // 改行で行を確定
      lines.push({ tokens: currentTokens, width: currentWidth });
      currentTokens = [];
      currentWidth = 0;
      continue;
    }

    const w = ctx.measureText(t.char).width;
    if (currentWidth + w > maxWidth && currentTokens.length > 0) {
      // 折り返し
      lines.push({ tokens: currentTokens, width: currentWidth });
      currentTokens = [t];
      currentWidth = w;
    } else {
      currentTokens.push(t);
      currentWidth += w;
    }
  }

  if (currentTokens.length > 0) {
    lines.push({ tokens: currentTokens, width: currentWidth });
  }

  return lines;
}

// Rendering Functions
function drawBackground(ctx, width, height) {
  if (bgImg && bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, width, height);
  } else {
    ctx.fillStyle = "#7a1010";
    ctx.fillRect(0, 0, width, height);
  }
}

function drawFlags(ctx, width, height) {
  if (els.bgSelect.value !== BACKGROUND_TYPES.MAO_NING) return;

  const flag1 = els.flag1.value;
  const flag2 = els.flag2.value;
  const flagSize = Math.min(width * FLAG_RENDER_CONFIG.sizeRatio, height * FLAG_RENDER_CONFIG.sizeRatio);
  const flagY = height * FLAG_RENDER_CONFIG.yRatio;
  const flagSpacing = width * FLAG_RENDER_CONFIG.spacingRatio;
  const totalWidth = flagSize * 2 + flagSpacing;
  const flagX = (width - totalWidth) / 2;

  ctx.save();
  ctx.font = `${flagSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  ctx.fillText(flag1, flagX + flagSize / 2, flagY);
  ctx.fillText(flag2, flagX + flagSize + flagSpacing + flagSize / 2, flagY);
  
  ctx.restore();
}

function drawMainText(ctx, width, height) {
  const fontSize = parseInt(els.fontSize.value, 10) || 80;
  const lineHeight = parseFloat(els.lineHeight.value) || 1.25;
  const marginX = (parseFloat(els.marginX.value) || 10) / 100;
  const startYRatio = (parseFloat(els.startY.value) || 20) / 100;
  const baseColor = els.textColor.value || "#ffffff";
  const shadowBlur = parseInt(els.shadowBlur.value, 10) || 0;

  const areaX = width * marginX;
  const areaW = width - areaX * 2;
  const startY = height * startYRatio;

  let raw = els.text.value;
  if (els.quoteMode.value === "both" && raw.trim()) {
    raw = "“" + raw + "”";
  }

  ctx.save();
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.85)";
  ctx.shadowBlur = shadowBlur;
  ctx.font = `700 ${fontSize}px ${getFontFamily()}`;

  const tokens = parseTokens(raw, baseColor, HIGHLIGHT_COLOR);
  const lines = layoutTokens(ctx, tokens, areaW);
  const linePx = fontSize * lineHeight;

  let y = startY;
  for (const line of lines) {
    const xStart = (width - line.width) / 2;
    let x = xStart;
    for (const t of line.tokens) {
      ctx.fillStyle = t.color;
      ctx.fillText(t.char, x, y);
      x += ctx.measureText(t.char).width;
    }
    y += linePx;
  }
  ctx.restore();
}

function drawFooter(ctx, width, height) {
  const footerText = els.footerText.value.trim();
  if (!footerText) return;

  const fSize = parseInt(els.footerSize.value, 10) || 32;
  const bottomMargin = height * 0.06;
  const baseColor = els.textColor.value || "#ffffff";
  const shadowBlur = parseInt(els.shadowBlur.value, 10) || 0;

  ctx.save();
  ctx.font = `500 ${fSize}px "Noto Serif JP","Hiragino Mincho ProN","Yu Mincho",serif`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.fillStyle = baseColor;
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = shadowBlur;

  const yFooter = height - bottomMargin;
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(width * 0.15, yFooter - fSize * 1.6, width * 0.70, 2);

  ctx.globalAlpha = 1;
  ctx.shadowBlur = shadowBlur;
  ctx.fillText(footerText, width / 2, yFooter);
  ctx.restore();
}

function render() {
  const cv = els.cv;
  const ctx = cv.getContext('2d');
  const width = cv.width;
  const height = cv.height;

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, width, height);
  drawFlags(ctx, width, height);
  drawMainText(ctx, width, height);
  drawFooter(ctx, width, height);
}

// Event Handlers
function handleBackgroundChange() {
  const selected = els.bgSelect.value;
  loadBackground(selected);
  
  const isMaoNing = selected === BACKGROUND_TYPES.MAO_NING;
  els.flagSelectContainer.style.display = isMaoNing ? 'block' : 'none';
  els.footerText.value = getFooterText(selected);
  render();
}

function handleHighlightGold() {
  const ta = els.text;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  if (start === end) return;

  const value = ta.value;
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);
  const GOLD_TAG_OPEN = "[g]";
  const GOLD_TAG_CLOSE = "[/g]";

  ta.value = before + GOLD_TAG_OPEN + selected + GOLD_TAG_CLOSE + after;

  const newPos = before.length + GOLD_TAG_OPEN.length + selected.length + GOLD_TAG_CLOSE.length;
  ta.focus();
  ta.selectionStart = ta.selectionEnd = newPos;
  render();
}

function handleSaveImage() {
  const src = els.cv;
  const scale = 0.5;
  const w = src.width * scale;
  const h = src.height * scale;

  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;

  const offCtx = off.getContext("2d");
  offCtx.drawImage(src, 0, 0, w, h);

  off.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "propaganda.jpg";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/jpeg", 0.92);
}

// Event Listeners Setup
function setupEventListeners() {
  const renderTriggerIds = [
    "text", "fontSize", "lineHeight", "marginX", "startY",
    "textColor", "shadowBlur", "fontFamily", "quoteMode",
    "footerText", "footerSize", "flag1", "flag2"
  ];

  renderTriggerIds.forEach(id => {
    els[id].addEventListener("input", render);
    els[id].addEventListener("change", render);
  });

  els.bgSelect.addEventListener('change', handleBackgroundChange);
  els.highlightGoldBtn.addEventListener('click', handleHighlightGold);
  els.renderBtn.addEventListener("click", render);
  els.saveBtn.addEventListener("click", handleSaveImage);
}

// Initialization
async function init() {
  // Initialize i18next first
  await initI18next();
  
  // Set initial text based on language
  updateInitialText();
  els.footerText.value = getFooterText(BACKGROUND_TYPES.FOREIGN_AFFAIRS);
  els.flagSelectContainer.style.display = 'none';
  
  loadBackground(BACKGROUND_TYPES.FOREIGN_AFFAIRS);
  loadFlags();
  setupEventListeners();
}

window.onload = async () => {
  await init();
  render();
};

