import { CONTACT } from './projects.js';
import { CONFIG } from './config.js';
import { getCurrentLanguage } from './languageState.js';

function loadFonts() {
  if (document.getElementById('contact-fonts')) return;
  const style = document.createElement('style');
  style.id = 'contact-fonts';
  let css = '';
  Object.values(CONFIG.FONTS).forEach(f => {
    css += `@font-face { font-family: '${f.family}'; src: url('${f.path}'); font-weight: ${f.weight || 'normal'}; font-style: ${f.style || 'normal'}; }\n`;
  });
  style.innerHTML = css;
  document.head.appendChild(style);
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

export function launchContactScene(renderer, onCloseCallback) {
  loadFonts();
  
  renderer.domElement.style.display    = 'none';
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
    fontSize: CONTACT.fontSize,
    fontFamily: CONTACT.fontFamily,
    fontWeight: CONTACT.fontWeight,
    color: CONTACT.color,
    textAlign: CONTACT.textAlign,
    letterSpacing: CONTACT.letterSpacing,
    lineHeight: CONTACT.lineHeight,
    marginTop: CONTACT.marginTop,
    marginBottom: CONTACT.marginBottom,
    marginLeft: CONTACT.marginLeft,
    marginRight: CONTACT.marginRight,
  });
  container.appendChild(title);
  
  const lang = getCurrentLanguage();
  const titleText = CONTACT[lang]?.title || CONTACT.en.title;
  
  setTimeout(() => {
    typewriteInto(title, titleText, 50);
    
    // Make email and Instagram clickable after typewriter finishes
    setTimeout(() => {
      const emailLink = CONFIG.CONTACT_LINKS.EMAIL;
      const instagramUrl = CONFIG.CONTACT_LINKS.INSTAGRAM_URL;
      
      // Replace email text with clickable link
      const emailRegex = new RegExp(`mail:${emailLink}`, 'g');
      title.innerHTML = title.innerHTML.replace(
        emailRegex,
        `mail:<a href="mailto:${emailLink}" style="color: inherit; text-decoration: underline; cursor: pointer;">${emailLink}</a>`
      );
      
      // Replace Instagram text with clickable link
      title.innerHTML = title.innerHTML.replace(
        'ig:@neptunhuh',
        `ig:<a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; cursor: pointer;">@neptunhuh</a>`
      );
    }, titleText.length * 50 + 100);
  }, 200);

  const content = document.createElement('div');
  Object.assign(content.style, {
    fontSize: CONTACT.contentFontSize,
    fontFamily: CONTACT.contentFontFamily,
    color: CONTACT.contentColor,
    lineHeight: CONTACT.contentLineHeight,
    textAlign: CONTACT.contentTextAlign,
  });
  container.appendChild(content);
  
  const titleLength = (CONTACT.title || '').length;
  setTimeout(() => {
    typewriteInto(content, CONTACT.content || '', 30);
  }, 200 + titleLength * 50 + 300);

  closeBtn.addEventListener('click', () => {
    // Fade out like canvas scene - NO IMAGE
    const allItems = [title, content, closeBtn];
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