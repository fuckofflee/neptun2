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

  // TWO-COLUMN LAYOUT: Text left, images right
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
  const textContainer = document.createElement('div');
  Object.assign(textContainer.style, {
    flex: '0 0 auto',
    marginTop: CONFIG.ABOUT_SCENE.TEXT.MARGIN_TOP,
    marginLeft: CONFIG.ABOUT_SCENE.TEXT.MARGIN_LEFT,
    marginRight: CONFIG.ABOUT_SCENE.TEXT.MARGIN_RIGHT,
    maxWidth: '50%',
  });
  
  const title = document.createElement('div');
  Object.assign(title.style, {
    fontSize: CONFIG.ABOUT_SCENE.TEXT.FONT_SIZE,
    fontFamily: CONFIG.ABOUT_SCENE.TEXT.FONT_FAMILY,
    fontWeight: CONFIG.ABOUT_SCENE.TEXT.FONT_WEIGHT,
    color: CONFIG.ABOUT_SCENE.TEXT.COLOR,
    textAlign: CONFIG.ABOUT_SCENE.TEXT.TEXT_ALIGN,
    letterSpacing: CONFIG.ABOUT_SCENE.TEXT.LETTER_SPACING,
    lineHeight: CONFIG.ABOUT_SCENE.TEXT.LINE_HEIGHT,
  });
  textContainer.appendChild(title);
  container.appendChild(textContainer);
  
  const lang = getCurrentLanguage();
  const titleText = ABOUT[lang]?.title || ABOUT.en.title;
  
  setTimeout(() => {
    typewriteInto(title, titleText, 50);
  }, 200);

  // RIGHT: Images
  const imagesContainer = document.createElement('div');
  Object.assign(imagesContainer.style, {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '40px',
    marginTop: CONFIG.ABOUT_SCENE.PROFILE_IMAGE.MARGIN_TOP,
    marginRight: CONFIG.ABOUT_SCENE.PROFILE_IMAGE.MARGIN_RIGHT,
  });

  // Profile image
  const profileImg = document.createElement('img');
  profileImg.src = CONFIG.ABOUT_SCENE.PROFILE_IMAGE.PATH;
  Object.assign(profileImg.style, {
    width: CONFIG.ABOUT_SCENE.PROFILE_IMAGE.WIDTH,
    height: CONFIG.ABOUT_SCENE.PROFILE_IMAGE.HEIGHT,
    transform: 'scale(0.65)',
    opacity: '0',
  });
  imagesContainer.appendChild(profileImg);
  
  setTimeout(() => {
    function popIn() {
      const scale = parseFloat(profileImg.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 0.65);
      const opacity = parseFloat(profileImg.style.opacity);
      const nextScale = Math.min(1, scale + 0.12);
      const nextOpacity = Math.min(1, opacity + 0.12);
      profileImg.style.transform = `scale(${nextScale})`;
      profileImg.style.opacity = nextOpacity.toString();
      if (nextScale < 0.99) requestAnimationFrame(popIn);
    }
    requestAnimationFrame(popIn);
  }, CONFIG.ABOUT_SCENE.PROFILE_IMAGE.POP_DELAY);

  // CV
  const cvCfg = CONFIG.ABOUT_SCENE.CV;
  if (cvCfg && cvCfg.ENABLED) {
    const cvPath = lang === 'fr' ? cvCfg.PATH_FR : cvCfg.PATH_EN;
    const cvImg = document.createElement('img');
    cvImg.src = cvPath;
    Object.assign(cvImg.style, {
      width: cvCfg.WIDTH,
      height: cvCfg.HEIGHT,
      transform: 'scale(0.95)',
      opacity: '0',
    });
    imagesContainer.appendChild(cvImg);
    
    setTimeout(() => {
      function cvPopIn() {
        const scale = parseFloat(cvImg.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 0.95);
        const opacity = parseFloat(cvImg.style.opacity);
        const nextScale = Math.min(1, scale + 0.12);
        const nextOpacity = Math.min(1, opacity + 0.12);
        cvImg.style.transform = `scale(${nextScale})`;
        cvImg.style.opacity = nextOpacity.toString();
        if (nextScale < 0.99) requestAnimationFrame(cvPopIn);
      }
      requestAnimationFrame(cvPopIn);
    }, cvCfg.POP_DELAY);
  }

  container.appendChild(imagesContainer);

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
