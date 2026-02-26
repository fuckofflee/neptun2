import { ABOUT } from './projects.js';
import { CONFIG } from './config.js';
import { getCurrentLanguage } from './languageState.js';

async function loadFonts() {
  if (document.getElementById('about-fonts')) {
    await document.fonts.ready;
    return;
  }
  const style = document.createElement('style');
  style.id = 'about-fonts';
  let css = '';
  Object.values(CONFIG.FONTS).forEach(f => {
    css += `@font-face { font-family: '${f.family}'; src: url('${f.path}'); font-weight: ${f.weight || 'normal'}; font-style: ${f.style || 'normal'}; }\n`;
  });
  style.innerHTML = css;
  document.head.appendChild(style);
  await document.fonts.ready;
}

function typewriteInto(el, text, speed = 40) {
  el.innerHTML = '';
  if (!text) return;
  let i = 0;
  function tick() {
    if (i <= text.length) {
      el.innerHTML = text.slice(0, i).replace(/\n/g, '<br>');
      i++;
      setTimeout(tick, speed);
    }
  }
  tick();
}

export async function launchAboutScene(renderer, onCloseCallback) {
  await loadFonts();
  
  renderer.domElement.style.display    = 'none';
  renderer.domElement.style.visibility = 'hidden';

  let container = document.getElementById('about-overlay');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'flex';
  } else {
    container = document.createElement('div');
    container.id = 'about-overlay';
    document.body.appendChild(container);
  }

  Object.assign(container.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '100',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'left',
  });

  const btnCfg = CONFIG.IMAGE_CANVAS.CLOSE_BUTTON;
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
  
  const title = document.createElement('div');
  Object.assign(title.style, {
    fontSize: ABOUT.fontSize,
    fontFamily: ABOUT.fontFamily,
    fontWeight: ABOUT.fontWeight,
    color: ABOUT.color,
    textAlign: ABOUT.textAlign,
    letterSpacing: ABOUT.letterSpacing,
    lineHeight: ABOUT.lineHeight,
    marginTop: ABOUT.marginTop,
    marginBottom: ABOUT.marginBottom,
    marginLeft: ABOUT.marginLeft,
    marginRight: ABOUT.marginRight,
  });
  container.appendChild(title);
  
  const lang = getCurrentLanguage();
  const titleText = ABOUT[lang]?.title || ABOUT.en.title;
  
  setTimeout(() => {
    typewriteInto(title, titleText, 50);
  }, 200);

  // Add image with pop-in animation (if configured)
  const imgCfg = CONFIG.ABOUT_IMAGE;
  if (imgCfg && imgCfg.PATH) {
    const img = document.createElement('img');
    img.src = imgCfg.PATH;
    Object.assign(img.style, {
      position: 'absolute',
      left: imgCfg.POSITION_X,
      top: imgCfg.POSITION_Y,
      transform: `${imgCfg.TRANSFORM} scale(0.65)`,
      width: imgCfg.WIDTH,
      height: imgCfg.HEIGHT,
      marginTop: imgCfg.MARGIN_TOP,
      opacity: '0',
      transition: 'none',
    });
    container.appendChild(img);
    
    // Pop-in animation using POP_DELAY from config
    const popSpeed = CONFIG.CANVAS_MEDIA_POP_SPEED || 0.12;
    const delay = imgCfg.POP_DELAY || 0;
    
    setTimeout(() => {
      function popIn() {
        const currentScale = parseFloat(img.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 0.65);
        const currentOpacity = parseFloat(img.style.opacity);
        const nextScale = Math.min(1, currentScale + popSpeed);
        const nextOpacity = Math.min(1, currentOpacity + popSpeed);
        img.style.transform = `${imgCfg.TRANSFORM} scale(${nextScale})`;
        img.style.opacity = nextOpacity.toString();
        if (nextScale < 0.99 || nextOpacity < 0.99) {
          requestAnimationFrame(popIn);
        }
      }
      requestAnimationFrame(popIn);
    }, delay);
  }

  // Add CV as JPG image (if configured and enabled)
  const cvCfg = CONFIG.ABOUT_CV;
  if (cvCfg && cvCfg.ENABLED) {
    const lang = getCurrentLanguage();
    const cvPath = lang === 'fr' ? cvCfg.PATH_FR : cvCfg.PATH_EN;
    
    const cvImg = document.createElement('img');
    cvImg.src = cvPath;
    Object.assign(cvImg.style, {
      position: 'absolute',
      left: cvCfg.POSITION_X,
      top: cvCfg.POSITION_Y,
      transform: `${cvCfg.TRANSFORM} scale(0.95)`,
      width: cvCfg.WIDTH,
      height: cvCfg.HEIGHT,
      opacity: '0',
      transition: 'none',
    });
    container.appendChild(cvImg);
    
    // Pop-in animation using POP_DELAY from config
    const cvPopSpeed = CONFIG.CANVAS_MEDIA_POP_SPEED || 0.12;
    const cvDelay = cvCfg.POP_DELAY || 0;
    
    setTimeout(() => {
      function cvPopIn() {
        const currentScale = parseFloat(cvImg.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 0.65);
        const currentOpacity = parseFloat(cvImg.style.opacity);
        const nextScale = Math.min(1, currentScale + cvPopSpeed);
        const nextOpacity = Math.min(1, currentOpacity + cvPopSpeed);
        cvImg.style.transform = `${cvCfg.TRANSFORM} scale(${nextScale})`;
        cvImg.style.opacity = nextOpacity.toString();
        if (nextScale < 0.99 || nextOpacity < 0.99) {
          requestAnimationFrame(cvPopIn);
        }
      }
      requestAnimationFrame(cvPopIn);
    }, cvDelay);
  }

  closeBtn.addEventListener('click', () => {
    // Fade out like canvas scene - include profile image and CV
    const allItems = [title, closeBtn];
    if (imgCfg && imgCfg.PATH) {
      const img = container.querySelector('img[src*="profile"]');
      if (img) allItems.push(img);
    }
    if (cvCfg && cvCfg.ENABLED) {
      const cvImg = container.querySelector('img[src*="cv"]');
      if (cvImg) allItems.push(cvImg);
    }
    const minDelay = CONFIG.CANVAS_EXIT_FADE_DELAY_MIN ?? 50;
    const maxDelay = CONFIG.CANVAS_EXIT_FADE_DELAY_MAX ?? 500;
    const speed    = CONFIG.CANVAS_EXIT_FADE_SPEED     ?? 0.008;
    
    let completed = 0;
    const onComplete = () => {
      completed++;
      if (completed >= allItems.length) {
        container.style.display = 'none';
        renderer.domElement.style.display = 'block';
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
          const next = Math.max(0, current - speed);
          item.style.opacity = next.toString();
          if (next > 0.01) requestAnimationFrame(fade);
          else onComplete();
        }
        requestAnimationFrame(fade);
      }, delay);
    });
  });
  container.appendChild(closeBtn);

  const onKey = e => { if (e.key === 'Escape') closeBtn.click(); };
  document.addEventListener('keydown', onKey);
  container._cleanup = () => document.removeEventListener('keydown', onKey);
}
