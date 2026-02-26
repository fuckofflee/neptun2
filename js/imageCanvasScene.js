import { CONFIG } from './config.js';
import { PROJECTS } from './projects.js';
import { getCurrentLanguage } from './languageState.js';

async function loadFonts() {
  if (document.getElementById('canvas-fonts')) {
    // Fonts already added, but wait for them to load
    await document.fonts.ready;
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'canvas-fonts';
  let css = '';
  Object.values(CONFIG.FONTS).forEach(f => {
    css += `@font-face { font-family: '${f.family}'; src: url('${f.path}'); font-weight: ${f.weight || 'normal'}; font-style: ${f.style || 'normal'}; }\n`;
  });
  style.innerHTML = css;
  document.head.appendChild(style);
  
  // CRITICAL: Wait for fonts to actually load before continuing
  await document.fonts.ready;
}

export async function launchCanvasScene(imageSrc, renderer, onCloseCallback, projectIndex) {
  await loadFonts(); // WAIT for fonts to load

  renderer.domElement.style.display    = 'none';
  renderer.domElement.style.visibility = 'hidden';

  let container = document.getElementById('project-overlay');
  if (container) {
    if (container._cleanup) container._cleanup();
    container.innerHTML = '';
    container.style.display = 'flex';
  } else {
    container = document.createElement('div');
    container.id = 'project-overlay';
    document.body.appendChild(container);
  }

  Object.assign(container.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    zIndex: '100', overflow: 'hidden',
    display: 'flex', backgroundColor: '#ffffff',
  });

  const cfg = CONFIG.IMAGE_CANVAS;
  const btnCfg = cfg.CLOSE_BUTTON;
  const isCentered = btnCfg.POSITION === 'bottom-center';

  const closeBtn = document.createElement('img');
  closeBtn.src = btnCfg.IMAGE_PATH;

  const btnPos = {};
  switch (btnCfg.POSITION) {
    case 'bottom-center':
      btnPos.bottom = btnCfg.OFFSET_Y; btnPos.left = '50%'; break;
    case 'bottom-left':
      btnPos.bottom = btnCfg.OFFSET_Y; btnPos.left = btnCfg.OFFSET_X; break;
    case 'bottom-right':
      btnPos.bottom = btnCfg.OFFSET_Y; btnPos.right = btnCfg.OFFSET_X; break;
    case 'top-left':
      btnPos.top = btnCfg.OFFSET_Y; btnPos.left = btnCfg.OFFSET_X; break;
    default:
      btnPos.top = btnCfg.OFFSET_Y; btnPos.right = btnCfg.OFFSET_X;
  }

  Object.assign(closeBtn.style, {
    position:   'fixed',
    width:      btnCfg.WIDTH_IDLE,
    height:     btnCfg.HEIGHT_IDLE,
    opacity:    btnCfg.OPACITY_IDLE,
    cursor:     'pointer',
    zIndex:     btnCfg.Z_INDEX,
    userSelect: 'none',
    transition: `width ${btnCfg.TRANSITION}, height ${btnCfg.TRANSITION}, opacity ${btnCfg.TRANSITION}, transform ${btnCfg.TRANSITION}`,
    transform:  isCentered ? 'translateX(-50%) scale(1)' : 'scale(1)',
    ...btnPos,
  });

  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.width   = btnCfg.WIDTH_HOVER;
    closeBtn.style.height  = btnCfg.HEIGHT_HOVER;
    closeBtn.style.opacity = btnCfg.OPACITY_HOVER;
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.width   = btnCfg.WIDTH_IDLE;
    closeBtn.style.height  = btnCfg.HEIGHT_IDLE;
    closeBtn.style.opacity = btnCfg.OPACITY_IDLE;
  });

  closeBtn.addEventListener('mousedown', () => {
    closeBtn.style.transform = isCentered ? `translateX(-50%) scale(${btnCfg.POP_SCALE})` : `scale(${btnCfg.POP_SCALE})`;
  });
  closeBtn.addEventListener('mouseup', () => {
    closeBtn.style.transform = isCentered ? 'translateX(-50%) scale(1)' : 'scale(1)';
  });

  const doClose = () => {
    const leftPanel = container.querySelector('div[style*="flex-direction: column"]');
    const wrappers  = Array.from(container.querySelectorAll('.cnv-right > div > div'));
    const minDelay  = CONFIG.CANVAS_EXIT_FADE_DELAY_MIN ?? 50;
    const maxDelay  = CONFIG.CANVAS_EXIT_FADE_DELAY_MAX ?? 400;
    const speed     = CONFIG.CANVAS_EXIT_FADE_SPEED     ?? 0.12;
    const allItems  = [...wrappers];
    if (leftPanel) allItems.push(leftPanel);

    let completed = 0;
    const onComplete = () => {
      completed++;
      if (completed >= allItems.length) {
        if (container._cleanup) container._cleanup();
        container.style.display = 'none';
        container.innerHTML     = '';
        renderer.domElement.style.display    = 'block';
        renderer.domElement.style.visibility = 'visible';
        if (onCloseCallback) onCloseCallback();
      }
    };

    allItems.forEach(item => {
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      setTimeout(() => {
        item.style.transition = 'none';
        const startOp = parseFloat(getComputedStyle(item).opacity) || 1;
        function fade() {
          const current = parseFloat(item.style.opacity || startOp);
          const next    = Math.max(0, current - speed);
          item.style.opacity = next.toString();
          if (next > 0.01) requestAnimationFrame(fade);
          else onComplete();
        }
        requestAnimationFrame(fade);
      }, delay);
    });
  };
  closeBtn.addEventListener('click', doClose);
  container.appendChild(closeBtn);

  const project    = PROJECTS[projectIndex] || {};
  const folderPath = `${CONFIG.IMAGES_PATH}project${projectIndex + 1}/`;
  loadMediaAndCreate(container, folderPath, project, doClose);
}

async function loadMediaAndCreate(container, folderPath, project, closeCallback) {
  let found = [];
  if (project.mediaFiles && Array.isArray(project.mediaFiles)) {
    found = project.mediaFiles.map(f => folderPath + f);
    const verified = [];
    for (const path of found) {
      if (await mediaExists(path)) verified.push(path);
    }
    found = verified;
  } else {
    const patterns = [
      'cover.jpg', 'cover.png',
      ...Array.from({ length: 30 }, (_, i) => `detail${i + 1}.jpg`),
      ...Array.from({ length: 30 }, (_, i) => `detail${i + 1}.png`),
      ...Array.from({ length: 30 }, (_, i) => `detail${i + 1}.mp4`),
      ...Array.from({ length: 30 }, (_, i) => `detail${i + 1}.mov`),
      ...Array.from({ length: 30 }, (_, i) => `image${i + 1}.jpg`),
      ...Array.from({ length: 30 }, (_, i) => `image${i + 1}.png`),
      ...Array.from({ length: 30 }, (_, i) => `image${i + 1}.mp4`),
      ...Array.from({ length: 30 }, (_, i) => `image${i + 1}.mov`),
    ];
    for (const p of patterns) {
      if (await mediaExists(folderPath + p)) found.push(folderPath + p);
    }
  }
  found.sort();

  const textMap = {};
  (project.slides || []).forEach(s => {
    textMap[s.src.split('/').pop()] = s.text || '';
  });

  const media = found.map(src => ({
    src,
    isVideo: src.endsWith('.mov') || src.endsWith('.mp4'),
    text:    textMap[src.split('/').pop()] || '',
  }));

  buildLayout(container, media, project, closeCallback);
}

function mediaExists(url) {
  return new Promise(resolve => {
    if (url.endsWith('.mov') || url.endsWith('.mp4')) {
      const v = document.createElement('video');
      v.onloadedmetadata = () => resolve(true);
      v.onerror          = () => resolve(false);
      v.src = url;
    } else {
      const i = new Image();
      i.onload  = () => resolve(true);
      i.onerror = () => resolve(false);
      i.src = url;
    }
  });
}

function buildLayout(container, media, project, closeCallback) {
  const cfg = CONFIG.IMAGE_CANVAS;

  const noBar = document.createElement('style');
  noBar.textContent = `
    .cnv-right::-webkit-scrollbar { display: none; }
    .cnv-right { scrollbar-width: none; }
  `;
  container.appendChild(noBar);

  const layout = document.createElement('div');
  Object.assign(layout.style, { display: 'flex', width: '100%', height: '100%' });

  // LEFT PANEL
  const leftPanel = document.createElement('div');
  Object.assign(leftPanel.style, {
    width:           cfg.LEFT_PANEL.WIDTH,
    height:          '100%',
    backgroundColor: cfg.LEFT_PANEL.BACKGROUND_COLOR,
    padding:         cfg.LEFT_PANEL.PADDING,
    overflowY:       'auto',
    boxSizing:       'border-box',
    opacity:         '0',
    display:         'flex',
    flexDirection:   'column',
    flexShrink:      '0',
  });

  const typewriteEls = [];
  const titleCfg = cfg.LEFT_PANEL.TITLE;
  if (titleCfg.ENABLED) {
    const titleWrapper = document.createElement('div');
    Object.assign(titleWrapper.style, { marginBottom: titleCfg.MARGIN_BOTTOM });
    const lang = getCurrentLanguage();
    const titleText = (typeof project.title === 'object') ? (project.title[lang] || project.title.en) : project.title;
    const segments = (titleText || '').split(' | ');
    (titleCfg.PARTS || []).forEach((part, i) => {
      const text = (i < segments.length) ? segments[i] : '';
      if (!text) return;
      const span = document.createElement('span');
      span.dataset.fullText = text;
      Object.assign(span.style, {
        fontFamily:    part.FONT_FAMILY,
        fontSize:      part.FONT_SIZE,
        fontWeight:    part.FONT_WEIGHT,
        fontStyle:     part.FONT_STYLE,
        color:         part.COLOR,
        letterSpacing: part.LETTER_SPACING,
        lineHeight:    part.LINE_HEIGHT || '1.1',
        textTransform: part.TEXT_TRANSFORM || 'none',
        display:       part.DISPLAY_BLOCK ? 'block' : 'inline',
      });
      titleWrapper.appendChild(span);
      typewriteEls.push(span);
    });
    leftPanel.appendChild(titleWrapper);
  }

  const subCfg = cfg.LEFT_PANEL.SUBTITLE;
  if (subCfg.ENABLED && project.description) {
    const el = document.createElement('div');
    const lang = getCurrentLanguage();
    const descText = (typeof project.description === 'object') ? (project.description[lang] || project.description.en) : project.description;
    el.dataset.fullText = descText;
    Object.assign(el.style, {
      fontFamily:    subCfg.FONT_FAMILY,
      fontSize:      subCfg.FONT_SIZE,
      fontWeight:    subCfg.FONT_WEIGHT,
      fontStyle:     subCfg.FONT_STYLE,
      color:         subCfg.COLOR,
      lineHeight:    subCfg.LINE_HEIGHT,
      letterSpacing: subCfg.LETTER_SPACING,
      marginBottom:  subCfg.MARGIN_BOTTOM,
    });
    leftPanel.appendChild(el);
    typewriteEls.push(el);
  }

  const metaCfg = cfg.LEFT_PANEL.METADATA;
  if (metaCfg.ENABLED && project.metadata) {
    const it = metaCfg.ITEMS;
    const m  = project.metadata;
    [
      [it.DATE,          m.date],
      [it.CLIENT,        m.client],
      [it.COLLABORATION, m.collaboration],
      [it.CATEGORY,      m.category],
    ].forEach(([itemCfg, value]) => {
      if (!itemCfg?.ENABLED || !value) return;
      const el = document.createElement('div');
      el.dataset.fullText = `${itemCfg.LABEL}: ${value}`;
      Object.assign(el.style, {
        fontFamily:    metaCfg.FONT_FAMILY,
        fontSize:      metaCfg.FONT_SIZE,
        color:         metaCfg.COLOR,
        lineHeight:    metaCfg.LINE_HEIGHT,
        letterSpacing: metaCfg.LETTER_SPACING,
        marginBottom:  metaCfg.MARGIN_BOTTOM,
      });
      leftPanel.appendChild(el);
      typewriteEls.push(el);
    });
  }

  layout.appendChild(leftPanel);

  // RIGHT PANEL
  const rightPanel = document.createElement('div');
  rightPanel.className = 'cnv-right';
  Object.assign(rightPanel.style, {
    width:           cfg.RIGHT_PANEL.WIDTH,
    height:          '100%',
    backgroundColor: cfg.RIGHT_PANEL.BACKGROUND_COLOR,
    padding:         cfg.RIGHT_PANEL.PADDING,
    overflowY:       'scroll',
    boxSizing:       'border-box',
  });

  const mediaColumn = document.createElement('div');
  Object.assign(mediaColumn.style, {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'flex-end',
    paddingTop:    cfg.RIGHT_PANEL.SCROLL_PADDING_TOP,
    paddingBottom: cfg.RIGHT_PANEL.SCROLL_PADDING_BOTTOM,
    width:         '100%',
  });

  const mediaItems = buildMediaItems(cfg, media, mediaColumn);

  rightPanel.appendChild(mediaColumn);
  layout.appendChild(rightPanel);
  container.appendChild(layout);

  const onKey = e => { if (e.key === 'Escape') closeCallback(); };
  document.addEventListener('keydown', onKey);
  container._cleanup = () => document.removeEventListener('keydown', onKey);

  leftPanel.style.transition = 'opacity 0.4s';
  requestAnimationFrame(() => { leftPanel.style.opacity = '1'; });

  typewriteSequence(typewriteEls, CONFIG.CANVAS_TEXT_TYPEWRITER_SPEED ?? 40, () => {
    animateMediaIn(mediaItems);
  });
}

function typewriteSequence(elements, speed, onDone) {
  let ci = 0;
  function next() {
    if (ci >= elements.length) { if (onDone) onDone(); return; }
    const el   = elements[ci];
    const text = el.dataset.fullText || '';
    let   i    = 0;
    function tick() {
      const chunk = text.slice(0, i).replace(/\n/g, '<br>');
      el.innerHTML = chunk;
      if (i <= text.length) { i++; setTimeout(tick, speed); }
      else { ci++; setTimeout(next, speed * 2); }
    }
    tick();
  }
  setTimeout(next, 200);
}

function typewriteInto(el, text, twCfg) {
  if (el._twTimer) clearTimeout(el._twTimer);
  el.innerHTML = '';
  if (!text) return;
  let i = 0;
  const cur = twCfg.CURSOR ? twCfg.CURSOR_CHAR : '';
  function tick() {
    if (i <= text.length) {
      const chunk = text.slice(0, i).replace(/\n/g, '<br>');
      el.innerHTML = chunk + (i < text.length ? cur : '');
      i++;
      el._twTimer = setTimeout(tick, twCfg.SPEED);
    } else {
      el.innerHTML = text.replace(/\n/g, '<br>');
      el._twTimer = null;
    }
  }
  el._twTimer = setTimeout(tick, 60);
}

// COMPLETELY NEW APPROACH - NO WRAPPER TRICKS
// Each item = inline-block container at right edge
// Text positioned absolutely to left of container
// Container width/height = media width/height exactly
function buildMediaItems(cfg, media, mediaColumn) {
  const mediaCfg = cfg.RIGHT_PANEL.MEDIA;
  const itxtCfg  = cfg.IMAGE_TEXT;
  const spacing  = mediaCfg.SPACING;
  let   expanded = null;
  const items    = [];

  media.forEach((mediaData) => {
    const naturalH = mediaCfg.HEIGHT;

    // Container holds media + text, sized to media dimensions
    const container = document.createElement('div');
    Object.assign(container.style, {
      position:    'relative',
      display:     'inline-block',
      marginBottom: `${spacing}px`,
      marginLeft:   'auto',  // push to right
      cursor:       mediaCfg.HOVER.CURSOR,
      opacity:      '0',
      transform:    'scale(0.65)',
      transformOrigin: 'right center',
    });

    let mediaEl;
    if (mediaData.isVideo) {
      mediaEl = document.createElement('video');
      mediaEl.src         = mediaData.src;
      mediaEl.loop        = cfg.VIDEO.LOOP;
      mediaEl.muted       = cfg.VIDEO.MUTED;
      mediaEl.playsInline = true;
      mediaEl.controls    = cfg.VIDEO.CONTROLS;
      mediaEl.onloadedmetadata = () => {
        const w = (mediaEl.videoWidth / mediaEl.videoHeight) * naturalH;
        mediaEl.style.width  = `${w}px`;
        mediaEl.style.height = `${naturalH}px`;
        mediaEl._naturalWidth = w;
      };
      mediaEl.onerror = (e) => console.error(`Video load failed: ${mediaData.src}`, e);
      if (cfg.VIDEO.AUTOPLAY) {
        mediaEl.autoplay = true;
        mediaEl.play().catch(() => {});
      } else if (cfg.VIDEO.HOVER_PLAY) {
        container.addEventListener('mouseenter', () => mediaEl.play());
        container.addEventListener('mouseleave', () => mediaEl.pause());
      }
    } else {
      mediaEl = document.createElement('img');
      mediaEl.src = mediaData.src;
      mediaEl.onload = () => {
        const w = (mediaEl.naturalWidth / mediaEl.naturalHeight) * naturalH;
        mediaEl.style.width  = `${w}px`;
        mediaEl.style.height = `${naturalH}px`;
        mediaEl._naturalWidth = w;
      };
      mediaEl.onerror = (e) => console.error(`Image load failed: ${mediaData.src}`, e);
    }

    Object.assign(mediaEl.style, {
      display:         'block',
      objectFit:       'cover',
      userSelect:      'none',
      transformOrigin: 'right center',
      transition:      `transform ${mediaCfg.HOVER.TRANSITION_DURATION} ease, width ${mediaCfg.EXPAND.TRANSITION_DURATION} ease-in-out, height ${mediaCfg.EXPAND.TRANSITION_DURATION} ease-in-out`,
    });
    container.appendChild(mediaEl);

    // Text sticks to LEFT edge of media
    let textEl = null;
    if (itxtCfg.ENABLED) {
      textEl = document.createElement('div');
      Object.assign(textEl.style, {
        position:      'absolute',
        top:           '0',
        right:         '100%',  // immediately left of media
        width:         '200px',
        paddingTop:    itxtCfg.PADDING_TOP,
        paddingBottom: itxtCfg.PADDING_BOTTOM,
        paddingLeft:   itxtCfg.PADDING_LEFT,
        paddingRight:  itxtCfg.PADDING_RIGHT,
        fontFamily:    itxtCfg.FONT_FAMILY,
        fontSize:      itxtCfg.FONT_SIZE,
        fontWeight:    itxtCfg.FONT_WEIGHT,
        fontStyle:     itxtCfg.FONT_STYLE,
        color:         itxtCfg.COLOR,
        lineHeight:    itxtCfg.LINE_HEIGHT,
        letterSpacing: itxtCfg.LETTER_SPACING,
        textAlign:     itxtCfg.TEXT_ALIGN,
        overflow:      'hidden',
        maxHeight:     '0',
        opacity:       '0',
        transition:    `max-height ${mediaCfg.EXPAND.TRANSITION_DURATION} ease, opacity 0.3s ease`,
      });
      container.appendChild(textEl);
    }

    // HOVER - transform only
    if (mediaCfg.HOVER.ENABLED) {
      container.addEventListener('mouseenter', () => {
        if (expanded === container) return;
        mediaEl.style.transform = `scale(${mediaCfg.HOVER.SCALE})`;
      });
      container.addEventListener('mouseleave', () => {
        if (expanded === container) return;
        mediaEl.style.transform = 'scale(1)';
      });
    }

    // CLICK - change actual size, spacing maintained automatically by marginBottom
    if (mediaCfg.EXPAND.ENABLED) {
      container.addEventListener('click', () => {
        const scale = mediaCfg.EXPAND.SCALE;

        // Collapse previous
        if (expanded && expanded !== container) {
          const prevMedia = expanded.querySelector('img, video');
          const prevW     = prevMedia._naturalWidth;
          prevMedia.style.transform = 'scale(1)';
          prevMedia.style.width  = `${prevW}px`;
          prevMedia.style.height = `${naturalH}px`;
          const prevText = expanded._textEl;
          if (prevText) { 
            prevText.style.maxHeight = '0'; 
            prevText.style.opacity = '0'; 
            prevText.innerHTML = ''; 
          }
        }

        if (expanded === container) {
          // Collapse current
          const w = mediaEl._naturalWidth;
          mediaEl.style.transform = 'scale(1)';
          mediaEl.style.width  = `${w}px`;
          mediaEl.style.height = `${naturalH}px`;
          if (textEl) { 
            textEl.style.maxHeight = '0'; 
            textEl.style.opacity = '0'; 
            textEl.innerHTML = ''; 
          }
          expanded = null;
        } else {
          // Expand current
          const w = mediaEl._naturalWidth;
          mediaEl.style.transform = 'scale(1)';
          mediaEl.style.width  = `${w * scale}px`;
          mediaEl.style.height = `${naturalH * scale}px`;
          if (textEl && mediaData.text) {
            const lang = getCurrentLanguage();
            const textContent = (typeof mediaData.text === 'object') ? (mediaData.text[lang] || mediaData.text.en) : mediaData.text;
            textEl.style.maxHeight = '400px';
            textEl.style.opacity   = '1';
            typewriteInto(textEl, textContent, itxtCfg.TYPEWRITER);
          }
          expanded = container;
        }
      });
    }

    container._textEl = textEl;
    mediaColumn.appendChild(container);
    items.push(container);
  });

  return items;
}

function animateMediaIn(mediaItems) {
  const minDelay = CONFIG.CANVAS_MEDIA_POP_DELAY_MIN ?? 100;
  const maxDelay = CONFIG.CANVAS_MEDIA_POP_DELAY_MAX ?? 800;
  mediaItems.forEach(item => {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    setTimeout(() => {
      item.style.transition = 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)';
      item.style.opacity    = '1';
      item.style.transform  = 'scale(1)';
    }, delay);
  });
}