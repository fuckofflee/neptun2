import { ABOUT } from './projects.js';
import { CONFIG } from './config.js';
import { getCurrentLanguage } from './languageState.js';

async function loadFonts() {
  if (document.getElementById('about-fonts')) return;
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
  
  renderer.domElement.style.display = 'none';
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    overflow: 'hidden',
  });

  // LEFT: Text
  const leftContainer = document.createElement('div');
  Object.assign(leftContainer.style, {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
  });
  
  const textCfg = CONFIG.ABOUT_SCENE.TEXT;
  const title = document.createElement('div');
  Object.assign(title.style, {
    fontSize: textCfg.FONT_SIZE,
    fontFamily: textCfg.FONT_FAMILY,
    fontWeight: textCfg.FONT_WEIGHT,
    color: textCfg.COLOR,
    textAlign: textCfg.TEXT_ALIGN,
    letterSpacing: textCfg.LETTER_SPACING,
    lineHeight: textCfg.LINE_HEIGHT,
    marginTop: textCfg.MARGIN_TOP,
    marginLeft: textCfg.MARGIN_LEFT,
  });
  leftContainer.appendChild(title);
  
  const lang = getCurrentLanguage();
  const titleText = ABOUT[lang]?.title || ABOUT.en.title;
  
  setTimeout(() => {
    typewriteInto(title, titleText, 50);
  }, 200);

  // Single profile image below text
  const imgCfg = CONFIG.ABOUT_SCENE.IMAGE;
  if (imgCfg && imgCfg.ENABLED) {
    const img = document.createElement('img');
    img.src = imgCfg.PATH;
    Object.assign(img.style, {
      width: imgCfg.WIDTH,
      height: imgCfg.HEIGHT,
      marginTop: imgCfg.MARGIN_TOP,
      marginLeft: imgCfg.MARGIN_LEFT,
      opacity: '0',
      transform: 'scale(0.8)',
    });
    leftContainer.appendChild(img);
    
    setTimeout(() => {
      function fadeIn() {
        const opacity = parseFloat(img.style.opacity);
        const scale = parseFloat(img.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 0.8);
        const nextOpacity = Math.min(1, opacity + 0.05);
        const nextScale = Math.min(1, scale + 0.02);
        img.style.opacity = nextOpacity.toString();
        img.style.transform = `scale(${nextScale})`;
        if (nextOpacity < 0.99) requestAnimationFrame(fadeIn);
      }
      requestAnimationFrame(fadeIn);
    }, imgCfg.POP_DELAY);
  }

  container.appendChild(leftContainer);

  // RIGHT: CV Image
  const cvCfg = CONFIG.ABOUT_SCENE.CV_IMAGE;
  if (cvCfg && cvCfg.ENABLED) {
    const lang = getCurrentLanguage();
    const cvPath = lang === 'fr' ? cvCfg.PATH_FR : cvCfg.PATH_EN;
    
    const cvImg = document.createElement('img');
    cvImg.src = cvPath;
    Object.assign(cvImg.style, {
      width: cvCfg.WIDTH,
      height: cvCfg.HEIGHT,
      marginTop: cvCfg.MARGIN_TOP,
      marginRight: cvCfg.MARGIN_RIGHT,
      opacity: '0',
      transform: 'scale(0.95)',
    });
    container.appendChild(cvImg);
    
    setTimeout(() => {
      function fadeIn() {
        const opacity = parseFloat(cvImg.style.opacity);
        const scale = parseFloat(cvImg.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 0.95);
        const nextOpacity = Math.min(1, opacity + 0.05);
        const nextScale = Math.min(1, scale + 0.01);
        cvImg.style.opacity = nextOpacity.toString();
        cvImg.style.transform = `scale(${nextScale})`;
        if (nextOpacity < 0.99) requestAnimationFrame(fadeIn);
      }
      requestAnimationFrame(fadeIn);
    }, cvCfg.POP_DELAY);
  }

  // Close button
  const btnCfg = CONFIG.IMAGE_CANVAS.CLOSE_BUTTON;
  const closeBtn = document.createElement('img');
  closeBtn.src = btnCfg.IMAGE_PATH;
  
  Object.assign(closeBtn.style, {
    position: 'fixed',
    bottom: btnCfg.OFFSET_Y,
    left: '50%',
    transform: 'translateX(-50%)',
    width: btnCfg.WIDTH_IDLE,
    height: btnCfg.HEIGHT_IDLE,
    opacity: btnCfg.OPACITY_IDLE,
    cursor: 'pointer',
    zIndex: btnCfg.Z_INDEX,
    transition: `all ${btnCfg.TRANSITION}`,
  });
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.width = btnCfg.WIDTH_HOVER;
    closeBtn.style.height = btnCfg.HEIGHT_HOVER;
    closeBtn.style.opacity = btnCfg.OPACITY_HOVER;
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.width = btnCfg.WIDTH_IDLE;
    closeBtn.style.height = btnCfg.HEIGHT_IDLE;
    closeBtn.style.opacity = btnCfg.OPACITY_IDLE;
  });
  
  closeBtn.addEventListener('click', () => {
    container.style.display = 'none';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.visibility = 'visible';
    if (onCloseCallback) onCloseCallback();
  });
  container.appendChild(closeBtn);

  const onKey = e => { if (e.key === 'Escape') closeBtn.click(); };
  document.addEventListener('keydown', onKey);
  container._cleanup = () => document.removeEventListener('keydown', onKey);
}
