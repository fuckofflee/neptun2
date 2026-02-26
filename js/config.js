export const CONFIG = {
  FAVICON_PATH: './img/neptun.ico?v=2',
  
  USE_DIRECTIONAL_LIGHT: true, 
  DIRECTIONAL_LIGHT_INTENSITY: 2.5,
  AMBIENT_LIGHT_INTENSITY: 1.5, 

  CAMERA_DISTANCE: 20,
  FOV: 50,

  // --- OBJECTS CONFIGURATION ---
  MAIN_OBJECT_PATH: './models/mainObject.obj',
  SECOND_OBJECT_PATH: './models/secondObject.obj',
  
  OBJECT_SCALE: 0.38, 

  // Visual Parameters (Shared)
  OBJECT_COLOR: '#92ff24',    
  OBJECT_SHININESS: 0.0005,     
  OBJECT_METALNESS: 0.01,      

  // Independent Rotation Speeds
  MAIN_OBJECT_ROTATION_SPEED: 0.003, 
  SECOND_OBJECT_ROTATION_SPEED: 0.006, 

  CUBE_WIDTH: 8.5,
  CUBE_HEIGHT: 8.5,
  CUBE_DEPTH: 8.5,

  GALLERY_ROTATION_SPEED: 0.001,    
  
  IMAGE_PIXEL_WIDTH: 1200,
  IMAGE_PIXEL_HEIGHT: 800,
  PIXEL_TO_WORLD: 0.004,

  IMAGE_VIEW_RATIO: 0.4, 
  ANIMATION_SPEED: 0.05,
  EXPANSION_SPEED: 0.03,
  FADE_SPEED: 0.05,
  POP_SPEED: 0.09, 
  POP_RANDOMNESS: 950,
  
  ROTATION_SENSITIVITY: 0.0045,
  ROTATION_DAMPING: 0.95,
  CLICK_DISTANCE_THRESHOLD: 10, 

  SHOW_LINES: true,
  LINE_COLOR: 0x000000,
  LINE_THICKNESS: 0.003,
  LINE_OPACITY: 0.8,
  LINE_START_OFFSET: 3, 
  LINE_END_OFFSET: 0.52,  
  
  OVERLAY: {
    IMAGE: {
        position: 'relative', 
        marginTop: '0px',
        marginBottom: '40px',
        marginLeft: 'auto',
        marginRight: 'auto',
        zIndex: '10'
    },
    TEXT: {
        position: 'absolute', 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', 
        width: '80%',
        maxWidth: '800px',
        textAlign: 'center', 
        zIndex: '20' 
    }
  },
  
  TEXT_ALIGNMENT: 'center', 
  
  FONTS: {
    TITLE: {
      path: './fonts/SFPRODISPLAYBOLD.OTF', 
      family: 'TitleFont',
      weight: 'normal',
      style: 'normal'
    },

    TITLE2: {
      path: './fonts/PerfectoCalligraphy.ttf', 
      family: 'TitleFont2',
      weight: 'normal',
      style: 'normal'
    },

    SUBTITLE: {
      path: './fonts/SFPRODISPLAYMEDIUM.OTF',
      family: 'SubtitleFont',
      weight: 'normal',
      style: 'normal'
    },
    TEXT: {
      path: './fonts/SFPRODISPLAYMEDIUM.OTF',
      family: 'TextFont',
      weight: 'normal',
      style: 'normal'
    }
  },

  IMAGES_PATH: './img/',

  // --- ARROW CONFIGURATION ---
  ARROW: {
    PATH: './img/arrow.svg',
    SIZE: 1,
    POSITION_X: 0,
    POSITION_Y: -3.5,
    HIDDEN_OPACITY: 0,
    VISIBLE_OPACITY: 1,
    APPEAR_SPEED: 0.08,
    DISAPPEAR_SPEED: 0.12,
    CLICK_SCALE: 0.8
  },

  // --- LIQUID GLASS CURSOR CONFIGURATION ---
  CURSOR: {
    SIZE: 20, 
    DELAY: 0, 
    CLICK_SCALE: 0.8,
    GLASS_SHADOWS: `
      inset 1px 1px 3px rgba(255, 255, 255, 0.9),
      inset -1px -1px 5px rgba(0, 0, 0, 0.1),
      inset 0 0 15px rgba(255, 255, 255, 0.3),
      0 4px 15px rgba(0, 0, 0, 0.15)
    `,
    GLASS_BACKGROUND: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
    BLUR: '6px'
  },

  // --- ABOUT & CONTACT BUTTONS (Gallery Scene) ---
  ABOUT_BUTTON: {
    SVG_PATH:   './img/about.svg',
    POSITION_X: -13.75,
    POSITION_Y: 8.6,
    POSITION_Z: 0,
    SIZE:       4,
    CLICK_SCALE: 0.85,
  },

  CONTACT_BUTTON: {
    SVG_PATH:   './img/contact.svg',
    POSITION_X: -11.5,
    POSITION_Y: 8.6,
    POSITION_Z: 0,
    SIZE:       4,
    CLICK_SCALE: 0.85,
  },

  ENGLISH_BUTTON: {
    SVG_PATH:   './img/en.svg',
    POSITION_X: 12.25,
    POSITION_Y: 8.6,
    POSITION_Z: 0,
    SIZE:       4,
    CLICK_SCALE: 0.85,
    OPACITY_ACTIVE: 1.0,
    OPACITY_INACTIVE: 0.5,
  },

  FRENCH_BUTTON: {
    SVG_PATH:   './img/fr.svg',
    POSITION_X: 13.75,
    POSITION_Y: 8.6,
    POSITION_Z: 0,
    SIZE:       4,
    CLICK_SCALE: 0.85,
    OPACITY_ACTIVE: 1.0,
    OPACITY_INACTIVE: 0.5,
  },

  LANGUAGE_SLASH: {
    SVG_PATH:   './img/slash.svg',
    POSITION_X: 13,
    POSITION_Y: 8.6,
    POSITION_Z: 0,
    SIZE:       4,
  },

  // ═══════════════════════════════════════════════════════════
  // ABOUT SCENE - Based on your reference image
  // ═══════════════════════════════════════════════════════════
  ABOUT_SCENE: {
    TEXT: {
      FONT_SIZE:      'clamp(30px, 3.5vw, 60px)',  // Much smaller max
      FONT_FAMILY:    'TitleFont',
      FONT_WEIGHT:    'bold',
      COLOR:          '#000000',
      TEXT_ALIGN:     'left',
      LETTER_SPACING: '-3px',
      LINE_HEIGHT:    '0.9',
      MARGIN_TOP:     '40px',
      MARGIN_LEFT:    '40px',
      MARGIN_RIGHT:   '20px',
    },
    
    // Grid of 6 profile photos (3x2)
    PROFILE_GRID: {
      ENABLED:      true,
      PATH:         './img/profile.png',
      COLUMNS:      3,              // 3 photos wide
      ROWS:         2,              // 2 photos tall
      PHOTO_SIZE:   '120px',        // Each photo size
      GAP:          '20px',         // Gap between photos
      MARGIN_TOP:   '480px',        // Below text
      MARGIN_LEFT:  '40px',
      POP_DELAY:    5500,
    },
    
    // CV sections on the right
    CV: {
      ENABLED:      true,
      PATH_EN:      './img/cvenglish.jpg',
      PATH_FR:      './img/cvfrancais.jpg',
      FONT_SIZE:    'clamp(10px, 0.85vw, 14px)',
      FONT_FAMILY:  'TextFont',
      COLOR:        '#000000',
      LINE_HEIGHT:  '1.4',
      MARGIN_TOP:   '40px',
      MARGIN_RIGHT: '40px',
      POP_DELAY:    5800,
    }
  },

  // ═══════════════════════════════════════════════════════════
  // CONTACT SCENE
  // ═══════════════════════════════════════════════════════════
  CONTACT_SCENE: {
    TEXT: {
      FONT_SIZE:      'clamp(30px, 3.5vw, 60px)',  // Smaller max
      FONT_FAMILY:    'TitleFont',
      FONT_WEIGHT:    'bold',
      COLOR:          '#000000',
      TEXT_ALIGN:     'left',
      LETTER_SPACING: '-3px',
      LINE_HEIGHT:    '0.9',
      MARGIN_TOP:     '40px',
      MARGIN_LEFT:    '40px',
      MARGIN_RIGHT:   '40px',
    }
  },

  // --- CONTACT PAGE LINKS ---
  CONTACT_LINKS: {
    EMAIL: 'leonmartinbergot@hotmail.com',
    INSTAGRAM_URL: 'https://www.instagram.com/neptunhuh/',
  },

  // ═══════════════════════════════════════════════════════════
  // IMAGE CANVAS SCENE
  // ═══════════════════════════════════════════════════════════
  IMAGE_CANVAS: {

    LEFT_PANEL: {
      WIDTH:            '40%',          // Slightly narrower
      BACKGROUND_COLOR: '#ffffff',
      PADDING_TOP:      '40px',
      PADDING_LEFT:     '40px',
      PADDING_RIGHT:    '30px',
      PADDING_BOTTOM:   '40px',

      TITLE: {
        ENABLED: true,
        MARGIN_BOTTOM: '20px',
        PARTS: [
          {
            FONT_FAMILY:    'TitleFont',
            FONT_SIZE:      'clamp(25px, 3.5vw, 48px)',  // Much smaller
            FONT_WEIGHT:    'bold',
            FONT_STYLE:     'normal',
            COLOR:          '#000000',
            LETTER_SPACING: '-2px',
            LINE_HEIGHT:    '0.9',
            DISPLAY_BLOCK:  true
          },
          {
            FONT_FAMILY:    'TitleFont2',
            FONT_SIZE:      'clamp(25px, 2.8vw, 48px)',  // Much smaller
            FONT_WEIGHT:    'normal',
            FONT_STYLE:     'normal',
            COLOR:          '#000000',
            LETTER_SPACING: '0px',
            TEXT_TRANSFORM: 'none',
            DISPLAY_BLOCK:  false
          }
        ]
      },

      SUBTITLE: {
        ENABLED:       true,
        FONT_FAMILY:   'SubtitleFont',
        FONT_SIZE:     'clamp(11px, 1.1vw, 16px)',  // Smaller
        FONT_WEIGHT:   'normal',
        FONT_STYLE:    'italic',
        COLOR:         '#000000',
        LINE_HEIGHT:   '1.3',
        LETTER_SPACING:'0.3px',
        MARGIN_BOTTOM: '20px'
      },

      METADATA: {
        ENABLED:       true,
        FONT_FAMILY:   'TextFont',
        FONT_SIZE:     'clamp(9px, 0.75vw, 11px)',  // Smaller
        FONT_WEIGHT:   'normal',
        COLOR:         '#999999',
        LINE_HEIGHT:   '1.5',
        LETTER_SPACING:'0.2px',
        MARGIN_BOTTOM: '4px',
        ITEMS: {
          DATE:          { LABEL: 'Date',          ENABLED: true },
          CLIENT:        { LABEL: 'Client',        ENABLED: true },
          COLLABORATION: { LABEL: 'Collaboration', ENABLED: true },
          CATEGORY:      { LABEL: 'Category',      ENABLED: true }
        }
      },
    },

    RIGHT_PANEL: {
      WIDTH:                '60%',
      BACKGROUND_COLOR:     '#ffffff',
      PADDING_TOP:          '40px',
      PADDING_RIGHT:        '40px',
      PADDING_LEFT:         '30px',
      PADDING_BOTTOM:       '100px',
      SCROLL_PADDING_TOP:   '0px',
      SCROLL_PADDING_BOTTOM:'100px',

      MEDIA: {
        HEIGHT: 'clamp(120px, 2vh, 220px)',  // MUCH smaller images
        SPACING: 15,

        HOVER: {
          ENABLED:             true,
          SCALE:               1.03,          // Subtle hover
          TRANSITION_DURATION: '0.3s',
          CURSOR:              'pointer'
        },

        EXPAND: {
          ENABLED:             true,
          SCALE:               1.4,            // Smaller expand
          TRANSITION_DURATION: '0.5s'
        }
      }
    },

    CLOSE_BUTTON: {
      IMAGE_PATH:    './img/close.png',
      WIDTH_IDLE:    '28px',
      HEIGHT_IDLE:   '28px',
      OPACITY_IDLE:  0.25,
      WIDTH_HOVER:   '40px',
      HEIGHT_HOVER:  '40px',
      OPACITY_HOVER: 1.0,
      POSITION:      'bottom-center',
      OFFSET_Y:      '32px',
      OFFSET_X:      '40px',
      POP_SCALE:     0.78,
      TRANSITION:    '0.25s cubic-bezier(0.34,1.56,0.64,1)',
      Z_INDEX:       10001
    },

    IMAGE_TEXT: {
      ENABLED:        true,
      FONT_FAMILY:    'TextFont',
      FONT_SIZE:      'clamp(10px, 0.9vw, 13px)',  // Smaller
      FONT_WEIGHT:    'normal',
      FONT_STYLE:     'normal',
      COLOR:          '#444444',
      LINE_HEIGHT:    '1.3',
      LETTER_SPACING: '0.1px',
      TEXT_ALIGN:     'right',
      PADDING_RIGHT:  '8px',
      MARGIN_TOP:     '8px',
      TYPEWRITER: {
        SPEED:       22,
        CURSOR:      true,
        CURSOR_CHAR: '|'
      }
    },

    VIDEO: {
      AUTOPLAY:  true,
      HOVER_PLAY:false,
      LOOP:      true,
      MUTED:     false,
      CONTROLS:  false
    }
  },

  // --- GALLERY INACTIVITY TIMEOUT ---
  GALLERY_INACTIVITY_TIMEOUT: 20000,

  // --- GALLERY ZOOM ANIMATION ---
  GALLERY_FADE_SPEED: 0.05,

  // --- VIDEO CONFIGURATION ---
  VIDEO_AUTOPLAY: false,
  VIDEO_HOVER_PLAY: true,

  // --- CUBE ROTATION TO IMAGE ANIMATION ---
  CUBE_ALIGN_ROTATION_SPEED:  0.07,
  CUBE_ALIGN_FADE_SPEED:      0.04,
  CUBE_ALIGN_PAUSE_MS:        150,
  CUBE_ALIGN_SELECTED_DELAY:  350,

  // --- CANVAS SCENE ENTRANCE ANIMATION ---
  CANVAS_TEXT_TYPEWRITER_SPEED: 10,
  CANVAS_MEDIA_POP_SPEED:       0.12,
  CANVAS_MEDIA_POP_DELAY_MIN:   100,
  CANVAS_MEDIA_POP_DELAY_MAX:   800,

  // --- CANVAS SCENE EXIT ANIMATION ---
  CANVAS_EXIT_FADE_DELAY_MIN:   50,
  CANVAS_EXIT_FADE_DELAY_MAX:   500,
  CANVAS_EXIT_FADE_SPEED:       0.008,
};
