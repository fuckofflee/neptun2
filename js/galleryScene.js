import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { CONFIG } from './config.js';

export function createGallery() {
  const group = new THREE.Group();
  group.scale.set(1, 1, 1); 

  const w = CONFIG.CUBE_WIDTH / 2;
  const h = CONFIG.CUBE_HEIGHT / 2;
  const d = CONFIG.CUBE_DEPTH / 2;

  const positions = [
    [-w,  h,  d], [ w,  h,  d],
    [ w, -h,  d], [-w, -h,  d],
    [-w,  h, -d], [ w,  h, -d],
    [ w, -h, -d], [-w, -h, -d]
  ];

  const planeW = CONFIG.IMAGE_PIXEL_WIDTH * CONFIG.PIXEL_TO_WORLD;
  const planeH = CONFIG.IMAGE_PIXEL_HEIGHT * CONFIG.PIXEL_TO_WORLD;
  const planeAspect = planeW / planeH;

  const lineMaterial = new THREE.MeshBasicMaterial({
    color: CONFIG.LINE_COLOR,
    transparent: true,
    opacity: CONFIG.LINE_OPACITY
  });

  const textureLoader = new THREE.TextureLoader();

  positions.forEach((pos, i) => {
    const folderName = `project${i + 1}`;
    const texturePath = `${CONFIG.IMAGES_PATH}${folderName}/cover.jpg`;

    const texture = textureLoader.load(texturePath, (tex) => {
        const imageAspect = tex.image.width / tex.image.height;
        tex.center.set(0.5, 0.5);
        if (imageAspect > planeAspect) {
          tex.repeat.set(planeAspect / imageAspect, 1);
        } else {
          tex.repeat.set(1, imageAspect / planeAspect);
        }
    });
    texture.colorSpace = THREE.SRGBColorSpace; 

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1
    });

    const image = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH), material);
    image.position.set(pos[0], pos[1], pos[2]);
    
    const lookTarget = new THREE.Vector3(pos[0] * 2, pos[1] * 2, pos[2] * 2);
    image.lookAt(lookTarget);
    
    image.scale.set(0, 0, 0);
    
    image.userData.isGalleryImage = true; 
    image.userData.projectIndex = i; 

    group.add(image);

    if (CONFIG.SHOW_LINES) {
      const center = new THREE.Vector3(0, 0, 0);
      const target = new THREE.Vector3(pos[0], pos[1], pos[2]);
      const direction = new THREE.Vector3().subVectors(target, center).normalize();
      const totalDistance = center.distanceTo(target);

      const startDist = CONFIG.LINE_START_OFFSET;
      const endDist = totalDistance - CONFIG.LINE_END_OFFSET;

      if (endDist > startDist) {
        const lineLength = endDist - startDist;
        const lineGeo = new THREE.CylinderGeometry(
          CONFIG.LINE_THICKNESS, 
          CONFIG.LINE_THICKNESS, 
          lineLength, 
          8
        );
        const line = new THREE.Mesh(lineGeo, lineMaterial);
        const midDist = startDist + (lineLength / 2);
        const midPoint = direction.clone().multiplyScalar(midDist);
        
        line.position.copy(midPoint);
        line.lookAt(target);
        line.rotateX(Math.PI / 2);
        line.scale.set(0, 0, 0);

        group.add(line);
      }
    }
  });

  return group;
}

// UI Buttons - camera-fixed, SIZE is a SCALE factor applied to actual SVG dimensions
export function createUIButtons() {
  const buttons = [];
  const textureLoader = new THREE.TextureLoader();

  // About button - use actual SVG dimensions
  const aboutTexture = textureLoader.load(CONFIG.ABOUT_BUTTON.SVG_PATH, (texture) => {
    // Get actual pixel dimensions of SVG
    const pixelWidth = texture.image.width;
    const pixelHeight = texture.image.height;
    
    // Apply SIZE as a scale factor to actual dimensions
    const worldWidth = pixelWidth * 0.001 * CONFIG.ABOUT_BUTTON.SIZE;
    const worldHeight = pixelHeight * 0.001 * CONFIG.ABOUT_BUTTON.SIZE;
    
    aboutButton.geometry.dispose();
    aboutButton.geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);
    
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  });
  const aboutMaterial = new THREE.MeshBasicMaterial({
    map: aboutTexture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  // Start with 1x1 square, will resize when texture loads
  const aboutGeometry = new THREE.PlaneGeometry(1, 1);
  const aboutButton = new THREE.Mesh(aboutGeometry, aboutMaterial);
  aboutButton.position.set(
    CONFIG.ABOUT_BUTTON.POSITION_X,
    CONFIG.ABOUT_BUTTON.POSITION_Y,
    CONFIG.ABOUT_BUTTON.POSITION_Z
  );
  aboutButton.scale.set(1, 1, 1);
  aboutButton.userData.isAboutButton = true;
  aboutButton.userData.clickScale = CONFIG.ABOUT_BUTTON.CLICK_SCALE;
  aboutButton.renderOrder = 999;
  buttons.push(aboutButton);

  // Contact button - same approach
  const contactTexture = textureLoader.load(CONFIG.CONTACT_BUTTON.SVG_PATH, (texture) => {
    const pixelWidth = texture.image.width;
    const pixelHeight = texture.image.height;
    
    const worldWidth = pixelWidth * 0.001 * CONFIG.CONTACT_BUTTON.SIZE;
    const worldHeight = pixelHeight * 0.001 * CONFIG.CONTACT_BUTTON.SIZE;
    
    contactButton.geometry.dispose();
    contactButton.geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);
    
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  });
  const contactMaterial = new THREE.MeshBasicMaterial({
    map: contactTexture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  const contactGeometry = new THREE.PlaneGeometry(1, 1);
  const contactButton = new THREE.Mesh(contactGeometry, contactMaterial);
  contactButton.position.set(
    CONFIG.CONTACT_BUTTON.POSITION_X,
    CONFIG.CONTACT_BUTTON.POSITION_Y,
    CONFIG.CONTACT_BUTTON.POSITION_Z
  );
  contactButton.scale.set(1, 1, 1);
  contactButton.userData.isContactButton = true;
  contactButton.userData.clickScale = CONFIG.CONTACT_BUTTON.CLICK_SCALE;
  contactButton.renderOrder = 999;
  buttons.push(contactButton);

  // English button
  const englishTexture = textureLoader.load(CONFIG.ENGLISH_BUTTON.SVG_PATH, (texture) => {
    const pixelWidth = texture.image.width;
    const pixelHeight = texture.image.height;
    
    const worldWidth = pixelWidth * 0.001 * CONFIG.ENGLISH_BUTTON.SIZE;
    const worldHeight = pixelHeight * 0.001 * CONFIG.ENGLISH_BUTTON.SIZE;
    
    englishButton.geometry.dispose();
    englishButton.geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);
    
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  });
  const englishMaterial = new THREE.MeshBasicMaterial({
    map: englishTexture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  const englishGeometry = new THREE.PlaneGeometry(1, 1);
  const englishButton = new THREE.Mesh(englishGeometry, englishMaterial);
  englishButton.position.set(
    CONFIG.ENGLISH_BUTTON.POSITION_X,
    CONFIG.ENGLISH_BUTTON.POSITION_Y,
    CONFIG.ENGLISH_BUTTON.POSITION_Z
  );
  englishButton.scale.set(1, 1, 1);
  englishButton.userData.isEnglishButton = true;
  englishButton.userData.clickScale = CONFIG.ENGLISH_BUTTON.CLICK_SCALE;
  englishButton.renderOrder = 999;
  buttons.push(englishButton);

  // French button
  const frenchTexture = textureLoader.load(CONFIG.FRENCH_BUTTON.SVG_PATH, (texture) => {
    const pixelWidth = texture.image.width;
    const pixelHeight = texture.image.height;
    
    const worldWidth = pixelWidth * 0.001 * CONFIG.FRENCH_BUTTON.SIZE;
    const worldHeight = pixelHeight * 0.001 * CONFIG.FRENCH_BUTTON.SIZE;
    
    frenchButton.geometry.dispose();
    frenchButton.geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);
    
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  });
  const frenchMaterial = new THREE.MeshBasicMaterial({
    map: frenchTexture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  const frenchGeometry = new THREE.PlaneGeometry(1, 1);
  const frenchButton = new THREE.Mesh(frenchGeometry, frenchMaterial);
  frenchButton.position.set(
    CONFIG.FRENCH_BUTTON.POSITION_X,
    CONFIG.FRENCH_BUTTON.POSITION_Y,
    CONFIG.FRENCH_BUTTON.POSITION_Z
  );
  frenchButton.scale.set(1, 1, 1);
  frenchButton.userData.isFrenchButton = true;
  frenchButton.userData.clickScale = CONFIG.FRENCH_BUTTON.CLICK_SCALE;
  frenchButton.renderOrder = 999;
  buttons.push(frenchButton);

  // Language slash separator (non-interactive visual element)
  const slashTexture = textureLoader.load(CONFIG.LANGUAGE_SLASH.SVG_PATH, (texture) => {
    const pixelWidth = texture.image.width;
    const pixelHeight = texture.image.height;
    
    const worldWidth = pixelWidth * 0.001 * CONFIG.LANGUAGE_SLASH.SIZE;
    const worldHeight = pixelHeight * 0.001 * CONFIG.LANGUAGE_SLASH.SIZE;
    
    slashSeparator.geometry.dispose();
    slashSeparator.geometry = new THREE.PlaneGeometry(worldWidth, worldHeight);
    
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  });
  const slashMaterial = new THREE.MeshBasicMaterial({
    map: slashTexture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthTest: false,
  });
  const slashGeometry = new THREE.PlaneGeometry(1, 1);
  const slashSeparator = new THREE.Mesh(slashGeometry, slashMaterial);
  slashSeparator.position.set(
    CONFIG.LANGUAGE_SLASH.POSITION_X,
    CONFIG.LANGUAGE_SLASH.POSITION_Y,
    CONFIG.LANGUAGE_SLASH.POSITION_Z
  );
  slashSeparator.scale.set(1, 1, 1);
  slashSeparator.userData.isLanguageSlash = true;
  slashSeparator.renderOrder = 999;
  buttons.push(slashSeparator);

  return buttons;
}