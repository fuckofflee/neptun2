// Global language state - shared across all scenes
let currentLanguage = 'en'; // Default language
let opacityUpdateCallback = null;

export function getCurrentLanguage() {
  return currentLanguage;
}

export function setCurrentLanguage(lang) {
  if (lang === 'en' || lang === 'fr') {
    currentLanguage = lang;
    if (opacityUpdateCallback) {
      opacityUpdateCallback(lang);
    }
  }
}

export function setOpacityUpdateCallback(callback) {
  opacityUpdateCallback = callback;
}