import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/OBJLoader.js';
import { CONFIG } from './config.js';
import { createGallery, createUIButtons } from './galleryScene.js';
import { setupGalleryAnimation, cleanupGalleryAnimation } from './galleryAnimation.js';
import { getCurrentLanguage } from './languageState.js';

let scene, camera, renderer;
let mainObject, secondObject, galleryGroup;
let uiButtons = [];

// --- ARROW VARIABLES ---
let arrowSprite = null;
let isArrowClicked = false;     // State for click animation
let isHoveringObject = false;   // State for hover detection
let arrowTargetOpacity = 0;     // Target opacity for smooth transitions

// --- CURSOR PHYSICS VARIABLES ---
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let cursorScale = 1;
let cursorEl = null;

// Interaction State
let isDragging = false;
let dragStartX = 0, dragStartY = 0, dragDistance = 0;
let previousMousePosition = { x: 0, y: 0 };

// Independent Momentum/Orbit State
let dragTarget = null;
let mainMomentum = { x: 0, y: 0 };
let secondMomentum = { x: 0, y: 0 }; 
let galleryMomentum = { x: 0, y: 0 };

let galleryState = 'CLOSED'; 

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

init();
animateCursor(); 
animate();

function init() {
  if (CONFIG.FAVICON_PATH) {
    let link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = CONFIG.FAVICON_PATH;
    document.head.appendChild(link);
  }

  initCustomCursor();

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(CONFIG.FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = CONFIG.CAMERA_DISTANCE;

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace; 

  const ambientLight = new THREE.AmbientLight(0xffffff, CONFIG.AMBIENT_LIGHT_INTENSITY);
  scene.add(ambientLight);

  if (CONFIG.USE_DIRECTIONAL_LIGHT) {
    const dirLight = new THREE.DirectionalLight(0xffffff, CONFIG.DIRECTIONAL_LIGHT_INTENSITY);
    dirLight.position.set(5, 10, 7); 
    scene.add(dirLight);
  }

  // Create the Arrow Sprite (initially hidden)
  createArrowSprite();

  loadModelAssets();

  window.addEventListener('resize', onResize);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('click', onMouseClick);
}

function initCustomCursor() {
  if (CONFIG.CURSOR.SIZE === 0) return;

  cursorEl = document.createElement('div');
  cursorEl.id = 'liquid-cursor';
  document.body.appendChild(cursorEl);

  const css = `
    * { cursor: none !important; }
    #liquid-cursor {
      position: fixed;
      top: 0; left: 0;
      width: ${CONFIG.CURSOR.SIZE}px;
      height: ${CONFIG.CURSOR.SIZE}px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      background: ${CONFIG.CURSOR.GLASS_BACKGROUND};
      box-shadow: ${CONFIG.CURSOR.GLASS_SHADOWS};
      backdrop-filter: blur(${CONFIG.CURSOR.BLUR});
      -webkit-backdrop-filter: blur(${CONFIG.CURSOR.BLUR});
      transform: translate(-50%, -50%);
      transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      will-change: transform;
    }
  `;
  
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mousedown', () => {
    cursorScale = CONFIG.CURSOR.CLICK_SCALE;
  });

  document.addEventListener('mouseup', () => {
    cursorScale = 1;
  });
}

function animateCursor() {
  requestAnimationFrame(animateCursor);
  if (!cursorEl) return;
  const delay = CONFIG.CURSOR.DELAY || 0.15;
  cursorX += (mouseX - cursorX) * delay;
  cursorY += (mouseY - cursorY) * delay;
  const halfSize = CONFIG.CURSOR.SIZE / 2;
  cursorEl.style.transform = `translate3d(${cursorX - halfSize}px, ${cursorY - halfSize}px, 0) scale(${cursorScale})`;
}

function createArrowSprite() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(CONFIG.ARROW.PATH);
  
  texture.minFilter = THREE.LinearFilter;
  
  const material = new THREE.SpriteMaterial({ 
      map: texture, 
      color: 0xffffff,
      transparent: true,
      opacity: CONFIG.ARROW.HIDDEN_OPACITY, // Start hidden
      depthTest: false,
      depthWrite: false
  });
  
  arrowSprite = new THREE.Sprite(material);
  
  // Set Fixed Position from Config
  arrowSprite.position.set(CONFIG.ARROW.POSITION_X, CONFIG.ARROW.POSITION_Y, 0);
  
  // Set Size
  const size = CONFIG.ARROW.SIZE || 2;
  arrowSprite.scale.set(size, size, 1);
  
  scene.add(arrowSprite);
}

function createShinyMaterial(texturePath = null) {
    const materialConfig = {
        metalness: CONFIG.OBJECT_METALNESS || 0.1,
        roughness: CONFIG.OBJECT_SHININESS || 0.005,
        reflectivity: 1,
        clearcoat: 1.0, 
        clearcoatRoughness: 0.0
    };

    if (CONFIG.USE_TEXTURE && texturePath) {
        // Load texture
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);
        texture.colorSpace = THREE.SRGBColorSpace;
        
        // Use texture instead of color
        materialConfig.map = texture;
    } else {
        // Use solid color
        materialConfig.color = new THREE.Color(CONFIG.OBJECT_COLOR);
    }

    return new THREE.MeshPhysicalMaterial(materialConfig);
}

function loadModelAssets() {
  const objLoader = new OBJLoader();

  objLoader.load(CONFIG.MAIN_OBJECT_PATH, (obj) => {
    mainObject = obj;
    mainObject.scale.setScalar(CONFIG.OBJECT_SCALE);
    const speed = CONFIG.MAIN_OBJECT_ROTATION_SPEED;
    mainObject.userData.autoRotation = {
      x: (Math.random() - 0.5) * speed,
      y: (Math.random() - 0.5) * speed,
      z: (Math.random() - 0.5) * speed
    };
    
    // Create material with main object texture
    const mainMaterial = createShinyMaterial(CONFIG.MAIN_OBJECT_TEXTURE);
    mainObject.traverse(c => { if(c.isMesh) c.material = mainMaterial; });
    scene.add(mainObject);
  });

  objLoader.load(CONFIG.SECOND_OBJECT_PATH, (obj) => {
    secondObject = obj;
    secondObject.scale.setScalar(CONFIG.OBJECT_SCALE);
    const speed = CONFIG.SECOND_OBJECT_ROTATION_SPEED;
    secondObject.userData.autoRotation = {
      x: (Math.random() - 0.5) * speed,
      y: (Math.random() - 0.5) * speed,
      z: (Math.random() - 0.5) * speed
    };
    
    // Create material with second object texture
    const secondMaterial = createShinyMaterial(CONFIG.SECOND_OBJECT_TEXTURE);
    secondObject.traverse(c => { if(c.isMesh) c.material = secondMaterial; });
    scene.add(secondObject);
  });
}

function onMouseDown(e) {
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragDistance = 0; 
  previousMousePosition = { x: e.clientX, y: e.clientY };

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if (galleryState === 'OPEN' || galleryState === 'OPENING') {
      dragTarget = galleryGroup;
      galleryMomentum = { x: 0, y: 0 };
      return;
  }

  // Check if hovering over main or second object
  const objectsToCheck = [];
  if (mainObject) objectsToCheck.push(mainObject);
  if (secondObject) objectsToCheck.push(secondObject);

  if (objectsToCheck.length > 0) {
    const intersects = raycaster.intersectObjects(objectsToCheck, true);
    if (intersects.length > 0) {
      let root = intersects[0].object;
      while (root.parent && root.parent !== scene) root = root.parent;
      
      if (root === mainObject) {
          // Trigger arrow click animation
          isArrowClicked = true;
          dragTarget = mainObject;
          mainMomentum = { x: 0, y: 0 };
      } else if (root === secondObject) {
          // Trigger arrow click animation
          isArrowClicked = true;
          dragTarget = secondObject;
          secondMomentum = { x: 0, y: 0 };
      }
    }
  }
}

function onMouseMove(e) {
  // Update mouse vector for Raycaster
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Check if hovering over objects (only when gallery is closed)
  if (galleryState === 'CLOSED' || galleryState === 'CLOSING') {
    const objectsToCheck = [];
    if (mainObject) objectsToCheck.push(mainObject);
    if (secondObject) objectsToCheck.push(secondObject);

    if (objectsToCheck.length > 0) {
      const intersects = raycaster.intersectObjects(objectsToCheck, true);
      isHoveringObject = intersects.length > 0;
    } else {
      isHoveringObject = false;
    }
  } else {
    isHoveringObject = false;
  }

  // Handle dragging
  if (!isDragging || !dragTarget) return;

  const dx = e.clientX - previousMousePosition.x;
  const dy = e.clientY - previousMousePosition.y;
  
  const sensitivity = CONFIG.ROTATION_SENSITIVITY;
  const moveX = dx * sensitivity;
  const moveY = dy * sensitivity;

  dragTarget.rotation.y += moveX;
  dragTarget.rotation.x += moveY;

  if (dragTarget === mainObject) mainMomentum = { x: moveX, y: moveY };
  else if (dragTarget === secondObject) secondMomentum = { x: moveX, y: moveY };
  else if (dragTarget === galleryGroup) galleryMomentum = { x: moveX, y: moveY };

  previousMousePosition = { x: e.clientX, y: e.clientY };
  
  const totalDx = e.clientX - dragStartX;
  const totalDy = e.clientY - dragStartY;
  dragDistance = Math.sqrt(totalDx * totalDx + totalDy * totalDy);
}

function onMouseUp() {
  isDragging = false;
  dragTarget = null;
  // Reset arrow animation state
  isArrowClicked = false;
}

function onMouseClick(e) {
  // Only trigger gallery if it was a click (not a drag)
  if (dragDistance > CONFIG.CLICK_DISTANCE_THRESHOLD) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  // Check Object Click
  const objectsToCheck = [];
  if (mainObject) objectsToCheck.push(mainObject);
  if (secondObject) objectsToCheck.push(secondObject);

  if (objectsToCheck.length > 0) {
      const hits = raycaster.intersectObjects(objectsToCheck, true);
      if (hits.length > 0) {
         if (galleryState === 'CLOSED' || galleryState === 'CLOSING') {
           launchGallery();
         } else {
           closeGallery();
         }
      }
  }
}

async function launchGallery() {
    if (galleryGroup) scene.remove(galleryGroup);
    galleryGroup = createGallery();
    
    galleryGroup.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
  
    const gSpeed = CONFIG.GALLERY_ROTATION_SPEED;
    galleryGroup.userData.autoRotation = {
      x: (Math.random() - 0.5) * gSpeed,
      y: (Math.random() - 0.5) * gSpeed,
      z: (Math.random() - 0.5) * gSpeed
    };
  
    scene.add(galleryGroup);
    
    // Add UI buttons - AWAIT async function
    uiButtons.forEach(btn => scene.remove(btn));
    uiButtons = await createUIButtons();
    uiButtons.forEach(btn => scene.add(btn));
    
    // Set correct language button opacity based on current language
    const currentLang = getCurrentLanguage();
    const englishBtn = uiButtons.find(btn => btn.userData.isEnglishButton);
    const frenchBtn = uiButtons.find(btn => btn.userData.isFrenchButton);
    
    if (englishBtn && frenchBtn) {
      if (currentLang === 'en') {
        englishBtn.material.opacity = CONFIG.ENGLISH_BUTTON.OPACITY_ACTIVE;
        frenchBtn.material.opacity = CONFIG.FRENCH_BUTTON.OPACITY_INACTIVE;
      } else {
        englishBtn.material.opacity = CONFIG.ENGLISH_BUTTON.OPACITY_INACTIVE;
        frenchBtn.material.opacity = CONFIG.FRENCH_BUTTON.OPACITY_ACTIVE;
      }
    }
    
    galleryState = 'OPENING';
    
    const now = Date.now();
    galleryGroup.children.forEach(child => {
      child.scale.set(0, 0, 0); 
      child.userData.popDelay = now + Math.random() * CONFIG.POP_RANDOMNESS;
    });
  
    // Pass closeGallery as inactivity callback
    setupGalleryAnimation(scene, camera, galleryGroup, mainObject, secondObject, renderer, closeGallery);
  }
  
  function closeGallery() {
    galleryState = 'CLOSING';
    cleanupGalleryAnimation();
    
    // Remove UI buttons when gallery closes
    uiButtons.forEach(btn => scene.remove(btn));
    uiButtons = [];
    
    const now = Date.now();
    if (galleryGroup) {
      galleryGroup.children.forEach(child => {
        child.userData.popDelay = now + Math.random() * CONFIG.POP_RANDOMNESS;
      });
    }
  }

function animate() {
  requestAnimationFrame(animate);
  const damping = CONFIG.ROTATION_DAMPING;

  if (mainObject) {
    if (dragTarget !== mainObject) {
      mainObject.rotation.y += mainMomentum.x;
      mainObject.rotation.x += mainMomentum.y;
      mainMomentum.x *= damping;
      mainMomentum.y *= damping;
      mainObject.rotation.x += mainObject.userData.autoRotation.x;
      mainObject.rotation.y += mainObject.userData.autoRotation.y;
      mainObject.rotation.z += mainObject.userData.autoRotation.z;
    }
  }

  if (secondObject) {
    if (dragTarget !== secondObject) {
      secondObject.rotation.y += secondMomentum.x;
      secondObject.rotation.x += secondMomentum.y;
      secondMomentum.x *= damping;
      secondMomentum.y *= damping;
      secondObject.rotation.x += secondObject.userData.autoRotation.x;
      secondObject.rotation.y += secondObject.userData.autoRotation.y;
      secondObject.rotation.z += secondObject.userData.autoRotation.z;
    }
  }

  if (galleryGroup) {
    if (dragTarget !== galleryGroup) {
      galleryGroup.rotation.y += galleryMomentum.x;
      galleryGroup.rotation.x += galleryMomentum.y;
      galleryMomentum.x *= damping;
      galleryMomentum.y *= damping;
      
      if (galleryGroup.userData && galleryGroup.userData.autoRotation) {
        galleryGroup.rotation.x += galleryGroup.userData.autoRotation.x;
        galleryGroup.rotation.y += galleryGroup.userData.autoRotation.y;
        galleryGroup.rotation.z += galleryGroup.userData.autoRotation.z;
      }
    }
    
    const now = Date.now();
    const targetScale = new THREE.Vector3(1, 1, 1);
    const zeroScale = new THREE.Vector3(0, 0, 0);
    const popSpeed = CONFIG.POP_SPEED || 0.09;

    if (galleryState === 'OPENING') {
      let allOpened = true;
      galleryGroup.children.forEach(child => {
        if (now > child.userData.popDelay) {
           child.scale.lerp(targetScale, popSpeed);
           if (child.scale.x < 0.99) allOpened = false;
        } else {
           allOpened = false; 
        }
      });
      if (allOpened) galleryState = 'OPEN';

    } else if (galleryState === 'CLOSING') {
      let allClosed = true;
      galleryGroup.children.forEach(child => {
        if (now > child.userData.popDelay) {
           child.scale.lerp(zeroScale, popSpeed);
           if (child.scale.x > 0.01) allClosed = false;
        } else {
            allClosed = false;
        }
      });
      if (allClosed) {
        scene.remove(galleryGroup);
        galleryGroup = null;
        galleryState = 'CLOSED';
      }
    }
  }

  // --- ARROW ANIMATION ---
  if (arrowSprite) {
    const baseSize = CONFIG.ARROW.SIZE || 2;
    
    // Determine target opacity based on hover state and click state
    if (isArrowClicked) {
      // When clicked, start disappearing
      arrowTargetOpacity = CONFIG.ARROW.HIDDEN_OPACITY;
    } else if (isHoveringObject) {
      // When hovering, appear
      arrowTargetOpacity = CONFIG.ARROW.VISIBLE_OPACITY;
    } else {
      // When not hovering, disappear
      arrowTargetOpacity = CONFIG.ARROW.HIDDEN_OPACITY;
    }
    
    // Determine speed based on appearing or disappearing
    const speed = arrowTargetOpacity > arrowSprite.material.opacity 
      ? CONFIG.ARROW.APPEAR_SPEED 
      : CONFIG.ARROW.DISAPPEAR_SPEED;
    
    // Smooth opacity transition
    const currentOpacity = arrowSprite.material.opacity;
    arrowSprite.material.opacity += (arrowTargetOpacity - currentOpacity) * speed;
    
    // Scale animation when clicked
    const targetScale = isArrowClicked ? baseSize * CONFIG.ARROW.CLICK_SCALE : baseSize;
    arrowSprite.scale.x += (targetScale - arrowSprite.scale.x) * 0.2;
    arrowSprite.scale.y += (targetScale - arrowSprite.scale.y) * 0.2;
  }

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}