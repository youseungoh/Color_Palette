/* ═══════════════════════════════
   COLOR UTILITIES
═══════════════════════════════ */
function hexToRgb(hex) {
  const c = hex.replace('#', '');
  if (c.length !== 6) return null;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) };
}
function rgbToHsb(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : Math.round((d / max) * 100), b: Math.round(max * 100) };
}
function hsbToRgb(h, s, b) {
  s /= 100; b /= 100;
  const k = n => (n + h / 60) % 6;
  const f = n => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return { r: Math.round(f(5) * 255), g: Math.round(f(3) * 255), b: Math.round(f(1) * 255) };
}
function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}
function getLuminance(r, g, b) {
  const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return ((hi + 0.05) / (lo + 0.05)).toFixed(2);
}
function isValidHex(hex) { return /^#[0-9A-Fa-f]{6}$/.test(hex); }

function generatePalette(hex, type) {
  const rgb = hexToRgb(hex); if (!rgb) return [hex];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const mix = (h, s, l) => rgbToHex(...Object.values(hslToRgb(((h % 360) + 360) % 360, Math.max(0, Math.min(100, s)), Math.max(0, Math.min(100, l)))));
  switch (type) {
    case 'complementary': return [hex, mix(hsl.h + 150, hsl.s, hsl.l), mix(hsl.h + 165, hsl.s * 0.6, hsl.l + 10), mix(hsl.h + 195, hsl.s * 0.6, hsl.l + 10), mix(hsl.h + 180, hsl.s, hsl.l)];
    case 'analogous':     return [-40, -20, 0, 20, 40].map(o => mix(hsl.h + o, hsl.s, hsl.l));
    case 'triadic':       return [0, 60, 120, 240, 300].map(o => mix(hsl.h + o, hsl.s, hsl.l));
    case 'monochromatic': return [20, 35, 50, 65, 80].map(l => mix(hsl.h, hsl.s, l));
    case 'split':         return [0, 150, 165, 195, 210].map(o => mix(hsl.h + o, hsl.s, hsl.l));
    default: return [hex];
  }
}

/* ═══════════════════════════════
   TREND PALETTES
═══════════════════════════════ */
const TRENDS = [
  { name: 'Mocha Mousse',      desc: 'Pantone 2025',       colors: ['#A0785A','#C4956A','#E8C9A0','#6B4F3A','#D4A574'] },
  { name: 'Digital Lavender',  desc: '2024 Wellness',      colors: ['#B8A9C9','#D4C5E2','#8E7BAB','#F0E6FF','#6B5B8E'] },
  { name: 'Neon Noir',         desc: 'Cyberpunk Dark',     colors: ['#0D0D0D','#1A1A2E','#16213E','#0F3460','#E94560'] },
  { name: 'Sage & Terracotta', desc: 'Natural Earth',      colors: ['#8B9D77','#C4A882','#D4956A','#E8D5B7','#6B7F5E'] },
  { name: 'Ocean Depth',       desc: 'Deep Blue Modern',   colors: ['#0077B6','#00B4D8','#90E0EF','#CAF0F8','#03045E'] },
  { name: 'Sunset Gradient',   desc: 'Vivid Warm',         colors: ['#FF6B6B','#FFE66D','#FF8E53','#C62A88','#4ECDC4'] },
  { name: 'Minimal Mono',      desc: 'Grayscale',          colors: ['#FFFFFF','#D9D9D9','#8C8C8C','#404040','#0A0A0A'] },
  { name: 'Botanica',          desc: 'Green Palette',      colors: ['#2D6A4F','#40916C','#74C69D','#B7E4C7','#1B4332'] },
];

/* 추천 단색 그룹 */
const QUICK_GROUPS = [
  {
    group: 'Dark App Buttons',
    desc: '검정 배경에 어울리는 버튼 색상',
    colors: [
      { hex: '#7C3AED', name: 'Electric Violet' },
      { hex: '#2563EB', name: 'Royal Blue'      },
      { hex: '#059669', name: 'Neon Green'       },
      { hex: '#DC2626', name: 'Signal Red'       },
      { hex: '#D97706', name: 'Amber'            },
      { hex: '#DB2777', name: 'Hot Magenta'      },
      { hex: '#0891B2', name: 'Cyan'             },
      { hex: '#4F46E5', name: 'Indigo'           },
      { hex: '#EA580C', name: 'Burnt Orange'     },
      { hex: '#16A34A', name: 'Jade'             },
      { hex: '#9333EA', name: 'Purple'           },
      { hex: '#E2E8F0', name: 'Ghost White'      },
    ],
  },
  {
    group: 'Popular',
    desc: '자주 쓰이는 추천 색상',
    colors: [
      { hex: '#B76E79', name: 'Rose Gold'    },
      { hex: '#3EB489', name: 'Mint'         },
      { hex: '#6C9BD2', name: 'Sky Blue'     },
      { hex: '#F4A261', name: 'Sandy Orange' },
      { hex: '#9B72CF', name: 'Lavender'     },
      { hex: '#2EC4B6', name: 'Teal'         },
      { hex: '#FFD166', name: 'Honey Yellow' },
      { hex: '#06D6A0', name: 'Emerald'      },
      { hex: '#EF476F', name: 'Hot Pink'     },
      { hex: '#8D99AE', name: 'Cool Gray'    },
      { hex: '#FFAFCC', name: 'Baby Pink'    },
      { hex: '#CDB4DB', name: 'Soft Purple'  },
    ],
  },
];

/* ═══════════════════════════════
   STATE
═══════════════════════════════ */
const state = {
  hex: '#6C9BD2',
  hsb: { h: 210, s: 50, b: 82 },
  paletteType: 'complementary',
  history: JSON.parse(localStorage.getItem('chromia_history') || '[]'),
  saved:   JSON.parse(localStorage.getItem('chromia_saved')   || '[]'),
  sidebarTab: 'quick',
};

/* ═══════════════════════════════
   COLOR WHEEL
═══════════════════════════════ */
const canvas  = document.getElementById('colorWheel');
const ctx     = canvas.getContext('2d');
const SIZE    = 260;
const CENTER  = SIZE / 2;
const RADIUS  = SIZE / 2 - 2;

function drawWheel() {
  const img = ctx.createImageData(SIZE, SIZE);
  const d   = img.data;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - CENTER, dy = y - CENTER;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > RADIUS) continue;
      const angle = Math.atan2(-dy, dx);
      const h = ((angle * 180 / Math.PI) + 360) % 360;
      const s = (dist / RADIUS) * 100;
      const rgb = hsbToRgb(h, s, state.hsb.b);
      const i = (y * SIZE + x) * 4;
      d[i] = rgb.r; d[i + 1] = rgb.g; d[i + 2] = rgb.b; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  updateThumbPos();
}

function updateThumbPos() {
  const thumb  = document.getElementById('wheelThumb');
  const wrap   = document.querySelector('.wheel-wrap');
  const scale  = (wrap.offsetWidth || SIZE) / SIZE;
  const angle  = state.hsb.h * Math.PI / 180;
  const dist   = (state.hsb.s / 100) * RADIUS;
  thumb.style.left = ((CENTER + Math.cos(angle) * dist) * scale) + 'px';
  thumb.style.top  = ((CENTER - Math.sin(angle) * dist) * scale) + 'px';
}

function pickFromWheel(e) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const cx   = e.touches ? e.touches[0].clientX : e.clientX;
  const cy   = e.touches ? e.touches[0].clientY : e.clientY;
  const dx   = (cx - rect.left) * (SIZE / rect.width) - CENTER;
  const dy   = (cy - rect.top)  * (SIZE / rect.height) - CENTER;
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy), RADIUS);
  const h    = ((Math.atan2(-dy, dx) * 180 / Math.PI) + 360) % 360;
  const s    = (dist / RADIUS) * 100;
  const rgb  = hsbToRgb(h, s, state.hsb.b);
  applyColor(rgbToHex(rgb.r, rgb.g, rgb.b), { h: Math.round(h), s: Math.round(s), b: state.hsb.b });
}

let wheelDrag = false;
canvas.addEventListener('mousedown',  e => { wheelDrag = true;  pickFromWheel(e); });
canvas.addEventListener('touchstart', e => { wheelDrag = true;  pickFromWheel(e); }, { passive: false });
window.addEventListener('mousemove',  e => { if (wheelDrag) pickFromWheel(e); });
window.addEventListener('touchmove',  e => { if (wheelDrag) pickFromWheel(e); }, { passive: false });
window.addEventListener('mouseup',    () => wheelDrag = false);
window.addEventListener('touchend',   () => wheelDrag = false);
window.addEventListener('resize', updateThumbPos);

/* ═══════════════════════════════
   BRIGHTNESS SLIDER
═══════════════════════════════ */
const track  = document.getElementById('brightnessTrack');
const bThumb = document.getElementById('brightnessThumb');
let bDrag = false;

function updateBrightnessUI() {
  const { h, s } = state.hsb;
  const dark   = rgbToHex(...Object.values(hsbToRgb(h, s, 0)));
  const bright = rgbToHex(...Object.values(hsbToRgb(h, s, 100)));
  track.style.background = `linear-gradient(to right,${dark},${bright})`;
  bThumb.style.left = state.hsb.b + '%';
}

function pickBrightness(e) {
  e.preventDefault();
  const rect = track.getBoundingClientRect();
  const cx   = e.touches ? e.touches[0].clientX : e.clientX;
  const b    = Math.round(Math.max(0, Math.min(1, (cx - rect.left) / rect.width)) * 100);
  const rgb  = hsbToRgb(state.hsb.h, state.hsb.s, b);
  applyColor(rgbToHex(rgb.r, rgb.g, rgb.b), { ...state.hsb, b });
}

track.addEventListener('mousedown',  e => { bDrag = true;  pickBrightness(e); });
track.addEventListener('touchstart', e => { bDrag = true;  pickBrightness(e); }, { passive: false });
window.addEventListener('mousemove',  e => { if (bDrag) pickBrightness(e); });
window.addEventListener('touchmove',  e => { if (bDrag) pickBrightness(e); }, { passive: false });
window.addEventListener('mouseup',    () => bDrag = false);
window.addEventListener('touchend',   () => bDrag = false);

/* ═══════════════════════════════
   APPLY COLOR (master update)
═══════════════════════════════ */
function applyColor(hex, hsb) {
  state.hex = hex;
  state.hsb = hsb || (() => { const r = hexToRgb(hex); return r ? rgbToHsb(r.r, r.g, r.b) : { h: 0, s: 0, b: 100 }; })();
  addHistory(hex);
  renderAll();
}

function renderAll() {
  const hex = state.hex;
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };

  /* header */
  document.getElementById('headerHexDot').style.background  = hex;
  document.getElementById('headerHexText').textContent       = hex;

  /* preview */
  const preview = document.getElementById('colorPreview');
  preview.style.background  = hex;
  preview.style.boxShadow   = `0 3px 14px ${hex}44`;

  /* hex input — only update if NOT focused */
  const hexInput = document.getElementById('hexInput');
  if (document.activeElement !== hexInput) {
    hexInput.value = hex;
    hexInput.classList.remove('error');
    document.getElementById('hexError').style.display = 'none';
  }

  /* color values */
  const hsl  = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsb2 = rgbToHsb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  document.getElementById('valRgb').textContent  = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  document.getElementById('valHsl').textContent  = `${hsl.h}°  ${hsl.s}%  ${hsl.l}%`;
  document.getElementById('valHsb').textContent  = `${hsb2.h}°  ${hsb2.s}%  ${hsb2.b}%`;
  document.getElementById('valCmyk').textContent = `${cmyk.c}  ${cmyk.m}  ${cmyk.y}  ${cmyk.k}`;

  /* wcag */
  const wc  = contrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const bc  = contrastRatio(rgb, { r: 0,   g: 0,   b: 0   });
  const cw  = document.getElementById('contrastWhite');
  cw.style.background = hex; cw.style.color = '#fff';
  document.getElementById('ratioWhite').textContent = wc + ':1';
  const cb  = document.getElementById('contrastBlack');
  cb.style.background = hex; cb.style.color = '#000';
  document.getElementById('ratioBlack').textContent = bc + ':1';

  const maxC  = Math.max(parseFloat(wc), parseFloat(bc));
  const aa    = maxC >= 4.5;
  const aaa   = maxC >= 7;
  const aaEl  = document.getElementById('wcagAA');
  const aaaEl = document.getElementById('wcagAAA');
  aaEl.className  = 'wcag-badge ' + (aa  ? 'pass' : 'fail');
  aaEl.textContent  = (aa  ? '✓' : '✗') + ' AA';
  aaaEl.className = 'wcag-badge ' + (aaa ? 'pass' : 'fail');
  aaaEl.textContent = (aaa ? '✓' : '✗') + ' AAA';

  /* wheel & brightness */
  drawWheel();
  updateBrightnessUI();

  /* 색상 프리뷰 카드 */
  const swatch = document.getElementById('colorPreviewSwatch');
  const phex   = document.getElementById('colorPreviewHex');
  const prgb   = document.getElementById('colorPreviewRgb');
  if (swatch) swatch.style.background = hex;
  if (phex)   phex.textContent = hex;
  if (prgb)   prgb.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  /* palette & sidebar */
  renderPalette();
  renderSidebar();
}

/* ═══════════════════════════════
   HEX INPUT
═══════════════════════════════ */
const hexInput = document.getElementById('hexInput');
const hexError = document.getElementById('hexError');

/* 포커스 시 현재 값으로 초기화 */
hexInput.addEventListener('focus', () => {
  hexInput.value = state.hex;
  hexInput.select();
  hexInput.classList.remove('error');
  hexError.style.display = 'none';
});

/* 입력 중: 자유롭게 타이핑 허용, 6자리 완성 시 반영 */
hexInput.addEventListener('input', () => {
  hexInput.classList.remove('error');
  hexError.style.display = 'none';

  /* 허용 문자만 남김 (# 와 hex 문자) */
  let val = hexInput.value;
  const digits = val.replace(/[^0-9A-Fa-f]/g, '');

  /* 6자리 완성 → 즉시 반영 */
  if (digits.length === 6) {
    const candidate = '#' + digits.toUpperCase();
    if (isValidHex(candidate)) {
      const rgb = hexToRgb(candidate);
      state.hex = candidate;
      state.hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
      addHistory(state.hex);
      updateUIExceptInput();
    }
  }
});

/* 포커스 해제 시 최종 확정 */
hexInput.addEventListener('blur', () => {
  const val    = hexInput.value.trim();
  const digits = val.replace(/[^0-9A-Fa-f]/g, '');
  const candidate = '#' + digits.toUpperCase();

  if (digits.length === 6 && isValidHex(candidate)) {
    const rgb = hexToRgb(candidate);
    state.hex = candidate;
    state.hsb = rgbToHsb(rgb.r, rgb.g, rgb.b);
    addHistory(state.hex);
    updateUIExceptInput();
  } else if (val === '' || val === '#') {
    /* 빈 입력 → 이전 값 복원 */
  } else {
    hexInput.classList.add('error');
    hexError.style.display = 'block';
  }
  /* 항상 현재 확정 색상으로 복원 */
  hexInput.value = state.hex;
  hexInput.classList.remove('error');
  hexError.style.display = 'none';
});

/* Enter 키로도 확정 */
hexInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') hexInput.blur();
});

function updateUIExceptInput() {
  const hex = state.hex;
  const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };

  document.getElementById('headerHexDot').style.background = hex;
  document.getElementById('headerHexText').textContent = hex;

  const preview = document.getElementById('colorPreview');
  preview.style.background = hex;
  preview.style.boxShadow  = `0 3px 14px ${hex}44`;

  const hsl  = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsb2 = rgbToHsb(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  document.getElementById('valRgb').textContent  = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  document.getElementById('valHsl').textContent  = `${hsl.h}°  ${hsl.s}%  ${hsl.l}%`;
  document.getElementById('valHsb').textContent  = `${hsb2.h}°  ${hsb2.s}%  ${hsb2.b}%`;
  document.getElementById('valCmyk').textContent = `${cmyk.c}  ${cmyk.m}  ${cmyk.y}  ${cmyk.k}`;

  const wc = contrastRatio(rgb, { r: 255, g: 255, b: 255 });
  const bc = contrastRatio(rgb, { r: 0, g: 0, b: 0 });
  const cw = document.getElementById('contrastWhite');
  cw.style.background = hex; cw.style.color = '#fff';
  document.getElementById('ratioWhite').textContent = wc + ':1';
  const cb = document.getElementById('contrastBlack');
  cb.style.background = hex; cb.style.color = '#000';
  document.getElementById('ratioBlack').textContent = bc + ':1';

  const maxC = Math.max(parseFloat(wc), parseFloat(bc));
  const aaEl  = document.getElementById('wcagAA');
  const aaaEl = document.getElementById('wcagAAA');
  aaEl.className   = 'wcag-badge ' + (maxC >= 4.5 ? 'pass' : 'fail');
  aaEl.textContent = (maxC >= 4.5 ? '✓' : '✗') + ' AA';
  aaaEl.className   = 'wcag-badge ' + (maxC >= 7 ? 'pass' : 'fail');
  aaaEl.textContent = (maxC >= 7 ? '✓' : '✗') + ' AAA';

  drawWheel();
  updateBrightnessUI();

  const swatch2 = document.getElementById('colorPreviewSwatch');
  const phex2   = document.getElementById('colorPreviewHex');
  const prgb2   = document.getElementById('colorPreviewRgb');
  if (swatch2) swatch2.style.background = hex;
  if (phex2)   phex2.textContent = hex;
  if (prgb2)   prgb2.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;

  renderPalette();
  renderSidebar();
}

/* ═══════════════════════════════
   COPY ROWS
═══════════════════════════════ */
['Rgb', 'Hsl', 'Hsb', 'Cmyk'].forEach(key => {
  const row = document.getElementById('row' + key);
  row.addEventListener('click', () => {
    const val = document.getElementById('val' + key).textContent;
    navigator.clipboard.writeText(val).then(() => {
      row.classList.add('copied');
      row.querySelector('.copy-hint').textContent = 'copied!';
      showToast(key.toUpperCase() + ' copied');
      setTimeout(() => { row.classList.remove('copied'); row.querySelector('.copy-hint').textContent = 'copy'; }, 1600);
    });
  });
});

document.getElementById('headerHexBadge').addEventListener('click', () => {
  navigator.clipboard.writeText(state.hex).then(() => showToast(state.hex + ' copied'));
});

/* 프리뷰 카드 복사 버튼 */
document.getElementById('colorPreviewCopy').addEventListener('click', () => {
  navigator.clipboard.writeText(state.hex).then(() => showToast(state.hex + ' copied'));
});

/* ═══════════════════════════════
   PALETTE
═══════════════════════════════ */
const PALETTE_TYPES = [
  { id: 'complementary', label: 'Complementary' },
  { id: 'analogous',     label: 'Analogous' },
  { id: 'triadic',       label: 'Triadic' },
  { id: 'monochromatic', label: 'Monochromatic' },
  { id: 'split',         label: 'Split' },
];

function renderPaletteTypes() {
  const wrap = document.getElementById('paletteTypes');
  wrap.innerHTML = '';
  PALETTE_TYPES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'palette-type-btn' + (state.paletteType === t.id ? ' active' : '');
    btn.textContent = t.label;
    btn.onclick = () => { state.paletteType = t.id; renderPaletteTypes(); renderPalette(); };
    wrap.appendChild(btn);
  });
}

function renderPalette() {
  const colors = generatePalette(state.hex, state.paletteType);
  const wrap   = document.getElementById('paletteSwatches');
  wrap.innerHTML = '';
  colors.forEach(c => {
    const div = document.createElement('div');
    div.className = 'palette-swatch';
    div.style.background = c;
    const lbl = document.createElement('div');
    lbl.className = 'swatch-label';
    lbl.textContent = c;
    div.appendChild(lbl);
    div.onclick = () => applyColor(c);
    div.oncontextmenu = e => {
      e.preventDefault();
      navigator.clipboard.writeText(c).then(() => { lbl.textContent = 'COPIED!'; showToast(c + ' copied'); setTimeout(() => lbl.textContent = c, 1500); });
    };
    wrap.appendChild(div);
  });
}

document.getElementById('copyAllBtn').addEventListener('click', () => {
  const colors = generatePalette(state.hex, state.paletteType);
  navigator.clipboard.writeText(colors.join(', ')).then(() => showToast('All colors copied'));
});

document.getElementById('savePaletteBtn').addEventListener('click', () => {
  if (state.saved.length >= 20) { showToast('Max 20 palettes'); return; }
  state.saved.unshift({ id: Date.now(), colors: generatePalette(state.hex, state.paletteType), type: state.paletteType, base: state.hex });
  savePersist();
  showToast('Palette saved');
  renderSidebar();
});

/* ═══════════════════════════════
   SIDEBAR
═══════════════════════════════ */
function svgIcon(name) {
  const icons = {
    palette:  `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    sparkles: `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 3l.7 2.1L7.8 6l-2.1.7L5 8.8l-.7-2.1L2.2 6l2.1-.7z"/></svg>`,
    bookmark:  `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
    clock:     `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    trash:     `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
  };
  return icons[name] || '';
}

function buildSidebarHTML() {
  const tabs = [
    { id: 'quick',   label: 'Colors' },
    { id: 'trend',   label: 'Trends' },
    { id: 'saved',   label: `Saved (${state.saved.length})` },
    { id: 'history', label: 'Recent' },
  ];

  const quickHTML = QUICK_GROUPS.map(g => `
    <div style="margin-bottom:14px">
      <div style="font-size:9.5px;font-weight:700;color:#aaa;letter-spacing:.07em;text-transform:uppercase;margin-bottom:3px">${g.group}</div>
      <div style="font-size:9px;color:#ccc;margin-bottom:8px">${g.desc}</div>
      <div style="display:flex;flex-direction:column;gap:4px">
        ${g.colors.map(q => `
          <div class="quick-chip" data-qhex="${q.hex}" title="${q.hex}">
            <div style="width:28px;height:28px;border-radius:7px;background:${q.hex};flex-shrink:0;border:1px solid rgba(0,0,0,.07)"></div>
            <span style="font-size:10.5px;font-weight:600;color:#333;line-height:1.2">${q.name}<br><span style="font-size:9px;color:#bbb;font-weight:400;font-family:monospace">${q.hex}</span></span>
            <div style="margin-left:auto;width:28px;height:28px;border-radius:7px;background:#111;display:flex;align-items:center;justify-content:center;flex-shrink:0" title="검정 배경 미리보기">
              <div style="width:14px;height:14px;border-radius:4px;background:${q.hex}"></div>
            </div>
          </div>`).join('')}
      </div>
    </div>`).join('');

  const trendHTML = TRENDS.map((p, i) => `
    <div class="trend-card" data-trend="${i}">
      <div class="trend-swatches">${p.colors.map(c => `<div style="flex:1;background:${c}"></div>`).join('')}</div>
      <div class="trend-info"><div class="trend-name">${p.name}</div><div class="trend-desc">${p.desc}</div></div>
    </div>`).join('');

  const savedHTML = state.saved.length === 0
    ? '<div class="empty-msg">No saved palettes</div>'
    : state.saved.map(p => `
      <div class="saved-card">
        <div class="saved-swatches" data-savedid="${p.id}">${p.colors.map(c => `<div style="flex:1;background:${c}"></div>`).join('')}</div>
        <div class="saved-footer">
          <span class="saved-meta">${p.type} · ${p.base}</span>
          <button class="saved-del" data-delid="${p.id}">${svgIcon('trash')}</button>
        </div>
      </div>`).join('');

  const historyHTML = state.history.length === 0
    ? '<div style="font-size:11px;color:#ccc">Select a color to record history</div>'
    : state.history.map(c => `<div class="history-dot" style="background:${c}" data-hcolor="${c}" title="${c}"></div>`).join('');

  return `
    <div class="sidebar-tabs">
      ${tabs.map(t => `<button class="sidebar-tab ${state.sidebarTab === t.id ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}
    </div>
    <div class="tab-content ${state.sidebarTab === 'quick'   ? 'active' : ''}">${quickHTML}</div>
    <div class="tab-content ${state.sidebarTab === 'trend'   ? 'active' : ''}">${trendHTML}</div>
    <div class="tab-content ${state.sidebarTab === 'saved'   ? 'active' : ''}">${savedHTML}</div>
    <div class="tab-content ${state.sidebarTab === 'history' ? 'active' : ''}">
      <div class="history-grid">${historyHTML}</div>
    </div>`;
}

function bindSidebarEvents(root) {
  root.querySelectorAll('.quick-chip').forEach(chip => {
    chip.onclick = () => applyColor(chip.dataset.qhex);
  });
  root.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.onclick = () => { state.sidebarTab = tab.dataset.tab; renderSidebar(); };
  });
  root.querySelectorAll('.trend-card').forEach(card => {
    card.onclick = () => applyColor(TRENDS[card.dataset.trend].colors[0]);
  });
  root.querySelectorAll('.saved-swatches').forEach(sw => {
    sw.onclick = () => { const p = state.saved.find(x => x.id == sw.dataset.savedid); if (p) applyColor(p.colors[0]); };
  });
  root.querySelectorAll('.saved-del').forEach(btn => {
    btn.onclick = () => { state.saved = state.saved.filter(x => x.id != btn.dataset.delid); savePersist(); renderSidebar(); };
  });
  root.querySelectorAll('.history-dot').forEach(dot => {
    dot.onclick = () => applyColor(dot.dataset.hcolor);
  });
}

function renderSidebar() {
  const html = buildSidebarHTML();
  const pc   = document.getElementById('pcSidebar');
  const mob  = document.getElementById('mobileDrawer');
  pc.innerHTML = html;
  bindSidebarEvents(pc);
  if (mob.classList.contains('open')) {
    mob.innerHTML = html;
    bindSidebarEvents(mob);
  }
}

/* ═══════════════════════════════
   HISTORY & PERSIST
═══════════════════════════════ */
function addHistory(hex) {
  state.history = [hex, ...state.history.filter(c => c !== hex)].slice(0, 12);
  localStorage.setItem('chromia_history', JSON.stringify(state.history));
}
function savePersist() {
  localStorage.setItem('chromia_saved', JSON.stringify(state.saved));
}

/* ═══════════════════════════════
   EXPORT
═══════════════════════════════ */
document.getElementById('exportBtn').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('exportDropdown').classList.toggle('open');
});
document.addEventListener('click', () => document.getElementById('exportDropdown').classList.remove('open'));

document.getElementById('exportCSS').addEventListener('click', () => {
  const colors = generatePalette(state.hex, state.paletteType);
  const css = `:root {\n  --color-primary: ${state.hex};\n${colors.map((c, i) => `  --palette-${i + 1}: ${c};`).join('\n')}\n}`;
  dlFile('chromia-palette.css', css);
  showToast('CSS exported');
});
document.getElementById('exportJSON').addEventListener('click', () => {
  dlFile('chromia-palette.json', JSON.stringify({ hex: state.hex, palette: generatePalette(state.hex, state.paletteType), saved: state.saved }, null, 2));
  showToast('JSON exported');
});
function dlFile(name, content) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content]));
  a.download = name; a.click();
}

/* ═══════════════════════════════
   MOBILE DRAWER
═══════════════════════════════ */
document.getElementById('drawerToggle').addEventListener('click', () => {
  const btn    = document.getElementById('drawerToggle');
  const drawer = document.getElementById('mobileDrawer');
  const open   = drawer.classList.toggle('open');
  btn.classList.toggle('open', open);
  if (open) { drawer.innerHTML = buildSidebarHTML(); bindSidebarEvents(drawer); }
});

/* ═══════════════════════════════
   TOAST
═══════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ═══════════════════════════════
   INIT
═══════════════════════════════ */
renderPaletteTypes();
applyColor(state.hex, state.hsb);
