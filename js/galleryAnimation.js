import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { CONFIG } from './config.js';
import { launchCanvasScene } from './imageCanvasScene.js';
import { launchAboutScene } from './aboutScene.js';
import { launchContactScene } from './contactScene.js';
import { getCurrentLanguage, setCurrentLanguage, setOpacityUpdateCallback } from './languageState.js';

let currentClickListener    = null;
let currentMouseMoveListener = null;
let inactivityTimeout       = null;
let onInactivityCallback    = null;

export function cleanupGalleryAnimation() {
  if (currentClickListener)     window.removeEventListener('click',     currentClickListener);
  if (currentMouseMoveListener) window.removeEventListener('mousemove', currentMouseMoveListener);
  if (inactivityTimeout)        clearTimeout(inactivityTimeout);
  currentClickListener     = null;
  currentMouseMoveListener = null;
  inactivityTimeout        = null;
  onInactivityCallback     = null;
}

export function setupGalleryAnimation(
  scene, camera, galleryGroup, mainObject, secondObject, renderer, onInactivity
) {
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();
  let   isAnimating = false;

  onInactivityCallback = onInactivity;

  // ── Inactivity timer ────────────────────────────────────────
  function resetInactivityTimer() {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      if (onInactivityCallback) onInactivityCallback();
    }, CONFIG.GALLERY_INACTIVITY_TIMEOUT);
  }
  resetInactivityTimer();
  
  // ── Language button opacity management ─────────────────────
  function updateLanguageButtonOpacity(lang) {
    const englishBtn = scene.children.find(c => c.userData.isEnglishButton);
    const frenchBtn = scene.children.find(c => c.userData.isFrenchButton);
    
    if (englishBtn && frenchBtn) {
      if (lang === 'en') {
        englishBtn.material.opacity = CONFIG.ENGLISH_BUTTON.OPACITY_ACTIVE;
        frenchBtn.material.opacity = CONFIG.FRENCH_BUTTON.OPACITY_INACTIVE;
      } else {
        englishBtn.material.opacity = CONFIG.ENGLISH_BUTTON.OPACITY_INACTIVE;
        frenchBtn.material.opacity = CONFIG.FRENCH_BUTTON.OPACITY_ACTIVE;
      }
      renderer.render(scene, camera);
    }
  }
  
  // Set initial opacity based on current language
  updateLanguageButtonOpacity(getCurrentLanguage());
  
  // Register callback for language changes
  setOpacityUpdateCallback(updateLanguageButtonOpacity);
  
  // Mousemove handler - only for inactivity timer
  function onMouseMove(e) {
    resetInactivityTimer();
  }
  
  currentMouseMoveListener = onMouseMove;
  window.addEventListener('mousemove', currentMouseMoveListener);

  // ── Click handler ────────────────────────────────────────────
  if (currentClickListener) window.removeEventListener('click', currentClickListener);
  currentClickListener = onClick;
  window.addEventListener('click', currentClickListener);

  function onClick(e) {
    if (isAnimating) return;
    resetInactivityTimer();
    mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children, true); // Check all scene objects including UI buttons
    
    // Check for English button
    const englishBtn = hits.find(h => h.object.userData.isEnglishButton)?.object;
    if (englishBtn) {
      const current = getCurrentLanguage();
      if (current !== 'en') {
        animateButtonClick(englishBtn, () => {
          setCurrentLanguage('en');
        });
      }
      return;
    }
    
    // Check for French button
    const frenchBtn = hits.find(h => h.object.userData.isFrenchButton)?.object;
    if (frenchBtn) {
      const current = getCurrentLanguage();
      if (current !== 'fr') {
        animateButtonClick(frenchBtn, () => {
          setCurrentLanguage('fr');
        });
      }
      return;
    }
    
    // Check for About button
    const aboutBtn = hits.find(h => h.object.userData.isAboutButton)?.object;
    if (aboutBtn) {
      animateButtonClick(aboutBtn, () => {
        fadeOutAndLaunch((savedAutoRot) => launchAboutScene(renderer, () => restoreGallery(getAllMaterials(), savedAutoRot)));
      });
      return;
    }
    
    // Check for Contact button
    const contactBtn = hits.find(h => h.object.userData.isContactButton)?.object;
    if (contactBtn) {
      animateButtonClick(contactBtn, () => {
        fadeOutAndLaunch((savedAutoRot) => launchContactScene(renderer, () => restoreGallery(getAllMaterials(), savedAutoRot)));
      });
      return;
    }
    
    // Check for gallery image
    const target = hits.find(h => h.object.userData.isGalleryImage)?.object;
    if (target) startSequence(target);
  }

  // Animate button click (squish then release)
  function animateButtonClick(button, callback) {
    const clickScale = button.userData.clickScale;
    
    // Squish
    button.scale.set(clickScale, clickScale, 1);
    renderer.render(scene, camera);
    
    // Release after 150ms, then callback
    setTimeout(() => {
      button.scale.set(1, 1, 1);
      renderer.render(scene, camera);
      if (callback) callback();
    }, 150);
  }

  // Helper to get all materials for fade restoration (including UI buttons)
  function getAllMaterials() {
    const mats = [];
    scene.children.forEach(c => {
      if (c.material) mats.push(c.material);
      if (c.children) {
        c.children.forEach(child => {
          if (child.material) mats.push(child.material);
        });
      }
    });
    return mats;
  }

  // Fade out scene and launch callback
  function fadeOutAndLaunch(launchCallback) {
    isAnimating = true;
    cleanupGalleryAnimation();
    
    // Save autoRotation before fading out
    const savedAutoRot = galleryGroup ? { ...galleryGroup.userData.autoRotation } : { x: 0, y: 0, z: 0 };
    
    const mats = getAllMaterials();
    const fadeSpeed = CONFIG.GALLERY_FADE_SPEED || 0.05;
    
    function fade() {
      let allDone = true;
      mats.forEach(m => {
        if (m.opacity > 0.01) {
          m.opacity = Math.max(0, m.opacity - fadeSpeed);
          allDone = false;
        }
      });
      renderer.render(scene, camera);
      if (!allDone) {
        requestAnimationFrame(fade);
      } else {
        renderer.domElement.style.display = 'none';
        renderer.domElement.style.visibility = 'hidden';
        launchCallback(savedAutoRot); // Pass savedAutoRot to callback
      }
    }
    requestAnimationFrame(fade);
  }

  // ════════════════════════════════════════════════════════════
  // PHASE 1 — Rotate the cube so the clicked corner faces camera
  // ════════════════════════════════════════════════════════════
  function startSequence(image) {
    isAnimating = true;
    cleanupGalleryAnimation(); // stop listening for more clicks immediately

    // Freeze auto-rotation
    const savedAutoRot = { ...galleryGroup.userData.autoRotation };
    galleryGroup.userData.autoRotation = { x: 0, y: 0, z: 0 };

    // ── Compute target quaternion ──────────────────────────────
    //
    // Each image's LOCAL position IS the corner direction (from origin).
    // After the group rotates, we want:
    //   • cornerWorld direction  →  toward the camera  (+Z in camera space = world +Z since cam is on Z axis)
    //   • up of the group        →  world +Y            (keeps image upright, no roll)
    //
    // We build a rotation matrix whose columns are the three axes we want
    // the group's local axes to map to, then extract a quaternion from it.
    //
    // Let camPos be camera.position (always on +Z axis in this scene).
    // "Face camera" means the corner vector (in world space after rotation)
    // points toward the camera, i.e. equals normalize(camPos).

    const cornerLocal = image.position.clone().normalize(); // direction to corner in group-local space

    // Desired world direction for the corner = toward camera
    const toCamera = camera.position.clone().normalize(); // (0,0,1) in practice

    // We want: groupRotation * cornerLocal = toCamera
    // AND:     groupRotation applied so world-up stays as close to +Y as possible (no roll)
    //
    // Strategy: build the desired orientation of the GROUP from scratch using
    // the constraint that its "forward" axis (in local space = cornerLocal) maps to toCamera.

    // ── Build a rotation that maps cornerLocal → toCamera, roll-free ──
    //
    // "Roll-free" means we further constrain the group's local +Y to stay
    // as close to world +Y as possible.  We do this by orthogonalising:
    //   forward = toCamera  (already known)
    //   right   = forward × worldUp  (then normalise)
    //   up      = right × forward

    const worldUp   = new THREE.Vector3(0, 1, 0);
    const forward   = toCamera.clone();                        // desired world direction of cornerLocal
    const right     = new THREE.Vector3().crossVectors(forward, worldUp).normalize();
    // If forward is exactly ±Y, right will be zero — fall back to world +X
    if (right.lengthSq() < 0.001) right.set(1, 0, 0);
    const up        = new THREE.Vector3().crossVectors(right, forward).normalize();

    // This orthonormal basis (right, up, forward) describes where we want
    // the group's local axes to end up IN WORLD SPACE.
    // But we need: which local axis maps to which world axis?
    //
    // The group has a local "cornerLocal" direction that must become "forward" in world.
    // We need the full group orientation such that:
    //   groupMatrix * cornerLocal = forward (world)
    //
    // Decompose cornerLocal into local X,Y,Z contributions and build accordingly.
    // Simplest correct approach: find the quaternion Q such that
    //   Q * cornerLocal = forward
    // using the minimal-arc quaternion, then additionally rotate around "forward"
    // axis to remove any residual roll (align local up to world up).

    // Step A: minimal arc quaternion from cornerLocal to forward
    const qArc = new THREE.Quaternion().setFromUnitVectors(cornerLocal, forward);

    // Step B: after applying qArc, the group's local +Y has been rotated.
    //         Find where local +Y lands:
    const localY       = new THREE.Vector3(0, 1, 0);
    const rotatedLocalY = localY.clone().applyQuaternion(qArc);

    // Project rotatedLocalY onto the plane perpendicular to forward (remove component along forward)
    const rotatedLocalYPerp = rotatedLocalY.clone()
      .sub(forward.clone().multiplyScalar(rotatedLocalY.dot(forward)))
      .normalize();

    // Project world +Y onto the same plane
    const worldUpPerp = worldUp.clone()
      .sub(forward.clone().multiplyScalar(worldUp.dot(forward)))
      .normalize();

    // Step C: rotation around "forward" axis to align rotatedLocalYPerp → worldUpPerp
    let qRoll = new THREE.Quaternion();
    if (rotatedLocalYPerp.lengthSq() > 0.001 && worldUpPerp.lengthSq() > 0.001) {
      qRoll.setFromUnitVectors(rotatedLocalYPerp, worldUpPerp);
    }

    // Final target quaternion for the group (in world space)
    const targetQuat = qRoll.multiply(qArc);

    // We have the target quaternion in WORLD space.
    // But galleryGroup.quaternion IS its world quaternion (parent is scene).
    // So we can directly slerp to it.

    // ── Shortest-path slerp: if dot product is negative, negate ──
    if (galleryGroup.quaternion.dot(targetQuat) < 0) {
      targetQuat.set(-targetQuat.x, -targetQuat.y, -targetQuat.z, -targetQuat.w);
    }

    const rotSpeed = CONFIG.CUBE_ALIGN_ROTATION_SPEED || 0.04;

    function rotTick() {
      galleryGroup.quaternion.slerp(targetQuat, rotSpeed);

      if (galleryGroup.quaternion.angleTo(targetQuat) < 0.008) {
        galleryGroup.quaternion.copy(targetQuat);
        setTimeout(() => clickPulse(image, savedAutoRot), CONFIG.CUBE_ALIGN_PAUSE_MS || 300);
      } else {
        requestAnimationFrame(rotTick);
      }
      renderer.render(scene, camera);
    }
    requestAnimationFrame(rotTick);
  }

  // ════════════════════════════════════════════════════════════
  // PHASE 2 — Click pulse on the selected image
  // ════════════════════════════════════════════════════════════
  function clickPulse(image, savedAutoRot) {
    const base    = new THREE.Vector3(1, 1, 1);
    const shrunk  = new THREE.Vector3(0.82, 0.82, 0.82);
    let   going   = true;
    let   bounces = 0;

    function tick() {
      if (going) {
        image.scale.lerp(shrunk, 0.28);
        if (image.scale.x <= shrunk.x + 0.01) going = false;
      } else {
        image.scale.lerp(base, 0.22);
        if (image.scale.x >= base.x - 0.01) bounces++;
      }
      renderer.render(scene, camera);
      if (bounces < 1) requestAnimationFrame(tick);
      else fadeOut(image, savedAutoRot);
    }
    requestAnimationFrame(tick);
  }

  // ════════════════════════════════════════════════════════════
  // PHASE 3 — Fade out.  Others fade immediately; selected image
  //            waits CUBE_ALIGN_SELECTED_DELAY ms before fading.
  // ════════════════════════════════════════════════════════════
  function fadeOut(image, savedAutoRot) {
    const fadeSpeed     = CONFIG.CUBE_ALIGN_FADE_SPEED     || 0.045;
    const selectedDelay = CONFIG.CUBE_ALIGN_SELECTED_DELAY ?? 500;

    // Separate selected mesh materials from everything else
    const otherMats    = [];
    const selectedMats = [];

    galleryGroup.children.forEach(c => {
      if (!c.material) return;
      c.material.transparent = true;
      (c === image ? selectedMats : otherMats).push(c.material);
    });
    [mainObject, secondObject].forEach(obj => {
      if (!obj) return;
      obj.traverse(c => {
        if (c.isMesh && c.material) {
          c.material.transparent = true;
          otherMats.push(c.material);
        }
      });
    });

    const allMats = [...otherMats, ...selectedMats];

    // White overlay on top of canvas
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0',
      background: '#ffffff', opacity: '0',
      zIndex: '99', pointerEvents: 'none'
    });
    document.body.appendChild(overlay);

    let selectedFading = false;
    setTimeout(() => { selectedFading = true; }, selectedDelay);

    function tick() {
      // Others: fade every frame from the start
      otherMats.forEach(m => { m.opacity = Math.max(0, m.opacity - fadeSpeed * 3); });

      // Selected: only once the delay has passed
      if (selectedFading) {
        selectedMats.forEach(m => { m.opacity = Math.max(0, m.opacity - fadeSpeed); });
      }

      // White overlay fades in steadily
      overlay.style.opacity = Math.min(1,
        parseFloat(overlay.style.opacity) + fadeSpeed * 1.5
      ).toString();

      renderer.render(scene, camera);

      // Done when selected material(s) are fully gone
      const done = selectedMats.every(m => m.opacity <= 0.01) && selectedFading;
      if (!done) { requestAnimationFrame(tick); return; }

      renderer.domElement.style.display    = 'none';
      renderer.domElement.style.visibility = 'hidden';
      document.body.removeChild(overlay);

      launchCanvasScene(
        image.material.map?.image?.src ?? '',
        renderer,
        () => restoreGallery(allMats, savedAutoRot),
        image.userData.projectIndex
      );
    }
    requestAnimationFrame(tick);
  }

  // ════════════════════════════════════════════════════════════
  // RESTORE — called by canvas close button
  // Fades materials back in randomly (reverse of entrance pop-in)
  // ════════════════════════════════════════════════════════════
  function restoreGallery(materials, savedAutoRot) {
    renderer.domElement.style.display    = 'block';
    renderer.domElement.style.visibility = 'visible';

    // Determine target opacity for each material
    const currentLang = getCurrentLanguage();
    const englishBtn = scene.children.find(c => c.userData.isEnglishButton);
    const frenchBtn = scene.children.find(c => c.userData.isFrenchButton);
    
    // Start all materials at 0, fade in randomly to their correct target opacity
    materials.forEach(m => { m.opacity = 0; });

    const minDelay = CONFIG.CANVAS_MEDIA_POP_DELAY_MIN ?? 100;
    const maxDelay = CONFIG.CANVAS_MEDIA_POP_DELAY_MAX ?? 800;
    const speed    = CONFIG.CANVAS_MEDIA_POP_SPEED     ?? 0.12;

    materials.forEach(m => {
      // Determine target opacity for this material
      let targetOpacity = 1;
      if (englishBtn && m === englishBtn.material) {
        targetOpacity = currentLang === 'en' ? CONFIG.ENGLISH_BUTTON.OPACITY_ACTIVE : CONFIG.ENGLISH_BUTTON.OPACITY_INACTIVE;
      } else if (frenchBtn && m === frenchBtn.material) {
        targetOpacity = currentLang === 'fr' ? CONFIG.FRENCH_BUTTON.OPACITY_ACTIVE : CONFIG.FRENCH_BUTTON.OPACITY_INACTIVE;
      }
      
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      setTimeout(() => {
        function fadeIn() {
          m.opacity = Math.min(targetOpacity, m.opacity + speed);
          renderer.render(scene, camera);
          if (m.opacity < targetOpacity - 0.01) requestAnimationFrame(fadeIn);
        }
        requestAnimationFrame(fadeIn);
      }, delay);
    });

    if (galleryGroup) {
      galleryGroup.userData.autoRotation = savedAutoRot;
    }

    isAnimating = false;

    // Re-attach click listener
    currentClickListener = onClick;
    window.addEventListener('click', currentClickListener);
    resetInactivityTimer();
  }
}