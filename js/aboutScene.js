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

  // Main container - horizontal split
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

  // LEFT: Text + Photo Grid
  const leftContainer = document.createElement('div');
  Object.assign(leftContainer.style, {
    flex: '0 0 50%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  });
  
  // Text at top left
  const title = document.createElement('div');
  Object.assign(title.style, {
    fontSize: CONFIG.ABOUT_SCENE.TEXT.FONT_SIZE,
    fontFamily: CONFIG.ABOUT_SCENE.TEXT.FONT_FAMILY,
    fontWeight: CONFIG.ABOUT_SCENE.TEXT.FONT_WEIGHT,
    color: CONFIG.ABOUT_SCENE.TEXT.COLOR,
    textAlign: CONFIG.ABOUT_SCENE.TEXT.TEXT_ALIGN,
    letterSpacing: CONFIG.ABOUT_SCENE.TEXT.LETTER_SPACING,
    lineHeight: CONFIG.ABOUT_SCENE.TEXT.LINE_HEIGHT,
    marginTop: CONFIG.ABOUT_SCENE.TEXT.MARGIN_TOP,
    marginLeft: CONFIG.ABOUT_SCENE.TEXT.MARGIN_LEFT,
    marginRight: CONFIG.ABOUT_SCENE.TEXT.MARGIN_RIGHT,
  });
  leftContainer.appendChild(title);
  
  const lang = getCurrentLanguage();
  const titleText = ABOUT[lang]?.title || ABOUT.en.title;
  
  setTimeout(() => {
    typewriteInto(title, titleText, 50);
  }, 200);

  // Photo grid (3x2) at bottom left
  const gridCfg = CONFIG.ABOUT_SCENE.PROFILE_GRID;
  if (gridCfg && gridCfg.ENABLED) {
    const photoGrid = document.createElement('div');
    Object.assign(photoGrid.style, {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridCfg.COLUMNS}, ${gridCfg.PHOTO_SIZE})`,
      gridTemplateRows: `repeat(${gridCfg.ROWS}, ${gridCfg.PHOTO_SIZE})`,
      gap: gridCfg.GAP,
      marginTop: gridCfg.MARGIN_TOP,
      marginLeft: gridCfg.MARGIN_LEFT,
      opacity: '0',
    });
    
    // Create 6 photos (3 columns x 2 rows)
    for (let i = 0; i < gridCfg.COLUMNS * gridCfg.ROWS; i++) {
      const img = document.createElement('img');
      img.src = gridCfg.PATH;
      Object.assign(img.style, {
        width: gridCfg.PHOTO_SIZE,
        height: gridCfg.PHOTO_SIZE,
        objectFit: 'cover',
        transform: 'scale(0.8)',
      });
      photoGrid.appendChild(img);
    }
    
    leftContainer.appendChild(photoGrid);
    
    // Fade in grid
    setTimeout(() => {
      function fadeIn() {
        const opacity = parseFloat(photoGrid.style.opacity);
        const nextOpacity = Math.min(1, opacity + 0.05);
        photoGrid.style.opacity = nextOpacity.toString();
        
        const imgs = photoGrid.querySelectorAll('img');
        imgs.forEach(img => {
          const scale = parseFloat(img.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 0.8);
          const nextScale = Math.min(1, scale + 0.02);
          img.style.transform = `scale(${nextScale})`;
        });
        
        if (nextOpacity < 0.99) requestAnimationFrame(fadeIn);
      }
      requestAnimationFrame(fadeIn);
    }, gridCfg.POP_DELAY);
  }

  container.appendChild(leftContainer);

  // RIGHT: CV sections (Skills, Education, Languages, Experience)
  const cvCfg = CONFIG.ABOUT_SCENE.CV;
  if (cvCfg && cvCfg.ENABLED) {
    const rightContainer = document.createElement('div');
    Object.assign(rightContainer.style, {
      flex: '0 0 50%',
      height: '100vh',
      overflowY: 'auto',
      fontSize: cvCfg.FONT_SIZE,
      fontFamily: cvCfg.FONT_FAMILY,
      color: cvCfg.COLOR,
      lineHeight: cvCfg.LINE_HEIGHT,
      marginTop: cvCfg.MARGIN_TOP,
      marginRight: cvCfg.MARGIN_RIGHT,
      paddingLeft: '60px',
      opacity: '0',
    });
    
    // CV content as HTML (you'll need to structure this based on your CV data)
    rightContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px;">
        <div>
          <h3 style="font-size: clamp(12px, 1vw, 16px); font-weight: bold; margin-bottom: 15px;">SKILLS</h3>
          <div style="font-size: ${cvCfg.FONT_SIZE}; line-height: 1.6;">
            Adobe Photoshop +++<br>
            Adobe Indesign +++++<br>
            Adobe Illustrator +++<br>
            Solidworks ++++<br>
            Blender ++++<br>
            Touchdesigner ++++<br>
            VScode +++++<br>
            Unity ++<br>
            Ableton/FL Studio ++<br>
            Drawing ++++<br><br>
            Manual skills +++++++++++++++
          </div>
          
          <h3 style="font-size: clamp(12px, 1vw, 16px); font-weight: bold; margin-top: 40px; margin-bottom: 15px;">LANGUAGES</h3>
          <div style="font-size: ${cvCfg.FONT_SIZE}; line-height: 1.6;">
            French (native language)<br>
            English (fully bilingual)<br>
            Spanish (B2 level)<br>
            Québécois (native dialect)
          </div>
        </div>
        
        <div>
          <h3 style="font-size: clamp(12px, 1vw, 16px); font-weight: bold; margin-bottom: 15px;">EDUCATION</h3>
          <div style="font-size: ${cvCfg.FONT_SIZE}; line-height: 1.6;">
            <strong>2019-2022</strong><br>
            International Baccalaureate<br>
            Lycée la Trinité, Lyon, France<br><br>
            
            <strong>2022-2025</strong><br>
            Product Design Bachelor<br>
            ESAA La Martinière Diderot, Lyon, France<br><br>
            
            <strong>2025-today</strong><br>
            Digital Design Masters<br>
            ENSAAMA, Paris, France
          </div>
          
          <h3 style="font-size: clamp(12px, 1vw, 16px); font-weight: bold; margin-top: 40px; margin-bottom: 15px;">EXPERIENCE/INTERNSHIPS</h3>
          <div style="font-size: ${cvCfg.FONT_SIZE}; line-height: 1.6;">
            <strong>2023</strong><br>
            Furniture Design<br>
            Atelier Malak, Lyon, France<br>
            @atelier_malak_<br><br>
            
            <strong>2024</strong><br>
            Furniture Design<br>
            SOLLEN Design, Bordeaux, France<br>
            @sollendesign
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(rightContainer);
    
    // Fade in CV
    setTimeout(() => {
      function fadeIn() {
        const opacity = parseFloat(rightContainer.style.opacity);
        const nextOpacity = Math.min(1, opacity + 0.05);
        rightContainer.style.opacity = nextOpacity.toString();
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
