import { CONTACT } from './projects.js';
import { CONFIG } from './config.js';
import { getCurrentLanguage } from './languageState.js';

async function loadFonts() {
  if (document.getElementById('contact-fonts')) return;
  const style = document.createElement('style');
  style.id = 'contact-fonts';
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

export async function launchContactScene(renderer, onCloseCallback) {
  await loadFonts();
  
  renderer.domElement.style.display = 'none';
  renderer.domElement.style.visibility = 'hidden';

  let container = document.getElementById('contact-overlay');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'flex';
  } else {
    container = document.createElement('div');
    container.id = 'contact-overlay';
    document.body.appendChild(container);
  }

  // Text on left side with margin
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  });

  const title = document.createElement('div');
  Object.assign(title.style, {
    fontSize: CONFIG.CONTACT_SCENE.TEXT.FONT_SIZE,
    fontFamily: CONFIG.CONTACT_SCENE.TEXT.FONT_FAMILY,
    fontWeight: CONFIG.CONTACT_SCENE.TEXT.FONT_WEIGHT,
    color: CONFIG.CONTACT_SCENE.TEXT.COLOR,
    textAlign: CONFIG.CONTACT_SCENE.TEXT.TEXT_ALIGN,
    letterSpacing: CONFIG.CONTACT_SCENE.TEXT.LETTER_SPACING,
    lineHeight: CONFIG.CONTACT_SCENE.TEXT.LINE_HEIGHT,
    marginTop: CONFIG.CONTACT_SCENE.TEXT.MARGIN_TOP,
    marginLeft: CONFIG.CONTACT_SCENE.TEXT.MARGIN_LEFT,
    marginRight: CONFIG.CONTACT_SCENE.TEXT.MARGIN_RIGHT,
  });
  container.appendChild(title);
  
  const lang = getCurrentLanguage();
  const titleText = CONTACT[lang]?.title || CONTACT.en.title;
  
  setTimeout(() => {
    typewriteInto(title, titleText, 50);
    
    // Make email and Instagram clickable
    setTimeout(() => {
      const emailLink = CONFIG.CONTACT_LINKS.EMAIL;
      const instagramUrl = CONFIG.CONTACT_LINKS.INSTAGRAM_URL;
      
      title.innerHTML = title.innerHTML.replace(
        new RegExp(`mail:${emailLink}`, 'g'),
        `mail:<a href="mailto:${emailLink}" style="color: inherit; text-decoration: underline; cursor: pointer;">${emailLink}</a>`
      );
      
      title.innerHTML = title.innerHTML.replace(
        'ig:@neptunhuh',
        `ig:<a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; cursor: pointer;">@neptunhuh</a>`
      );
    }, titleText.length * 50 + 100);
  }, 200);

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
