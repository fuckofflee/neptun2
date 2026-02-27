// About Page Content
export const ABOUT = {
  en: {
    title: 'léon river\nmartin-bergot\n\nfrench canadian\nproduct designer\n\n++digital design \nstudent (m1)\nensaama paris',
  },
  fr: {
    title: 'léon river\nmartin-bergot\n\ndesigner produit\nfranco canadien\n\n++étudiant en \nmaster design \nnumérique\nensaama paris',
  },
  fontSize: '85px',
  fontFamily: 'TitleFont',
  fontWeight: 'bold',
  color: '#000000',
  textAlign: 'left',
  letterSpacing: '-5px',
  lineHeight: '0.85',
  marginTop: '20px',
  marginBottom: '40px',
  marginLeft: '20px',
};

// Contact Page Content
export const CONTACT = {
  en: {
    title: 'mail:leonmartinbergot@hotmail.com\ntel:+33 6 52 08 05 88\nig:@neptunhuh\nPARIS\n\n\n\n\n\n\nlooking for an internship\ngetintouchwithmepls',
  },
  fr: {
    title: 'mail:leonmartinbergot@hotmail.com\ntel:+33 6 52 08 05 88\nig:@neptunhuh\nPARIS\n\n\n\n\n\n\nen recherche de stage\ncontactezmoisvp',
  },
  fontSize: '85px',
  fontFamily: 'TitleFont',
  fontWeight: 'bold',
  color: '#000000',
  textAlign: 'left',
  letterSpacing: '-5px',
  lineHeight: '0.85',
  marginTop: '20px',
  marginBottom: '40px',
  marginLeft: '20px',
};

// Global Default Styles (Fallback)
export const DEFAULT_STYLES = {
  TITLE: {
    size: '120px',
    color: '#ffffffff',
    letterSpacing: '-10px',
    marginTop: '-300px',
    marginLeft: '-7px'
  },
  SUBTITLE: {
    size: '24px',
    color: '#000000',
    letterSpacing: '1px',
    marginTop: '10px',
    marginBottom: '30px'
  },
  TEXT: {
    size: '16px',
    color: '#333333',
    letterSpacing: '0.5px',
    lineHeight: '1.8',
    maxWidth: '600px'
  }
};

export const PROJECTS = [
  {
    id: 1,
    title: {
      en: "@stabilis\ncare design\ndiy safety\nprototyping\n2024-25",
      fr: "@stabilis\ncare design\nbricoler en\nsécurité\nprototypage\n2024-25"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@stabilis is a stabilizer for nails and screws. It was originally designed for a friend of mine whose hand was crushed in an escalator. After going through a long healing process, his hand sustained stabilization problems, specifically when DIYing. Stabilis' incorporated magnet and organic elongated shape allows the user to firmly maintain the screws and nails in position on any surface while protecting their precious hands.",
      fr: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@stabilis est un stabilisateur pour clous et vis. Il a été conçu à l'origine pour un ami dont la main a été broyée dans un escalator. Après un long processus de guérison, sa main a conservé des problèmes de stabilisation, en particulier lors du bricolage. La forme organique allongée de Stabilis et son aimant intégré permettent à l'utilisateur de maintenir fermement les vis et les clous en position sur n'importe quelle surface tout en protégeant ses mains."
    },
    mediaFiles: [
      'cover.jpg',
      'detail1.jpg',
      'detail2.jpg',
      'detail3.jpg',
      'detail4.jpg',
      'detail5.jpg',
      'detail6.jpg',
      'detail7.jpg',
      'detail8.jpg',
    ],
    slides: [
      { 
        src: './img/project1/detail1.jpg', 
        text: {
          en: "All the prototypes were hand sculpted using a Dremel.",
          fr: "Tous les prototypes ont été sculptés à la main avec une Dremel."
        }
      },
      { 
        src: './img/project1/detail2.jpg', 
        text: {
          en: "First Prototype: too small for regular sized hands, hands are still too close to the hitting/screwing point.",
          fr: "Premier prototype : trop petit pour des mains de taille normale, les mains sont encore trop proches du point de frappe/vissage."
        }
      },
      { 
        src: './img/project1/detail3.jpg', 
        text: {
          en: "Second Prototype: needs a fulcrum on the back for more stability.",
          fr: "Deuxième prototype : nécessite un point d'appui à l'arrière pour plus de stabilité."
        }
      },
      { 
        src: './img/project1/detail4.jpg', 
        text: {
          en: "Third prototype: back fulcrum is too thin, hands are far enough, magnet is too small for screws.",
          fr: "Troisième prototype : le point d'appui arrière est trop fin, les mains sont assez éloignées, l'aimant est trop petit pour les vis."
        }
      },
      { 
        src: './img/project1/detail5.jpg', 
        text: {
          en: "Final prototype: hand slides under easily, magnet is long enough, hand is far enough to be protected from shocks.",
          fr: "Prototype final : la main glisse facilement en dessous, l'aimant est assez long, la main est assez éloignée pour être protégée des chocs."
        }
      },
      { 
        src: './img/project1/detail6.jpg', 
        text: {
          en: "Test with an electric drill: pass.",
          fr: "Test avec une perceuse électrique : réussi."
        }
      },
      { 
        src: './img/project1/detail7.jpg', 
        text: {
          en: "Test with my friend for whom it was built: pass.",
          fr: "Test avec mon ami pour qui il a été construit : réussi."
        }
      },
    ],
  },
  {
    id: 2,
    title: {
      en: "@icewaves\nlong exposure photography\nfeat louise giraud-moine\n2025",
      fr: "@icewaves\nphotographie longue exposition\nfeat louise giraud-moine\n2025"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@icewaves is a series of photographs taken on a frozen lake near my hometown in Canada. Its intent is to capture movement in what appears to be a lifeless environment. This is also my first attempt at photography.",
      fr: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@icewaves est une série de photographies prises sur un lac gelé près de la ville ou je vivais au Canada. L'objectif est de capturer le mouvement dans ce qui semble être un environnement sans vie. C'est aussi ma première tentative en photographie."
    },
    mediaFiles: [
      'cover.jpg',
      'detail1.jpg',
      'detail2.jpg',
      'detail3.jpg',
      'detail4.jpg',
      'detail5.jpg',
    ],
  },
  {
    id: 3,
    title: {
      en: "@lovesosa\naudioreactive visuals\ncreative coding\np5.js\n2025",
      fr: "@lovesosa\nvisuels audioréactifs\ncodage créatif\np5.js\n2025"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@lovesosa is a tribute website to Chief Keef. The user types in iconic Chief Keef related words to make the visuals appear. The user can then interact with the audioreactive visuals to rotate them around. The 3D visuals are loaded on a WEBGL page allowing for 3D objects display. Accessible at: https://fuckofflee.github.io/LOVESOSA/",
      fr: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@lovesosa est un site web hommage à Chief Keef. L'utilisateur tape des mots emblématiques liés à Chief Keef pour faire apparaître les visuels. Il peut ensuite interagir avec les objets pour les faire tourner sur eux-meme. Les visuels 3D sont chargés sur une page WEBGL permettant l'affichage d'objets 3D. Accessible sur : https://fuckofflee.github.io/LOVESOSA/"
    },
    mediaFiles: [
      'cover2.mp4',
      'detail1.mp4',
      'detail2.mp4',
      'detail3.jpg',
      'detail4.jpg',
    ],
    slides: [
      { 
        src: './img/project3/detail1.mp4', 
        text: {
          en: "First version of the ski mask code. Video displaying was abandoned because it made the website too laggy.",
          fr: "Première version du code du masque de ski. L'affichage de la vidéo a été abandonné car il rendait le site trop lent."
        }
      },
      { 
        src: './img/project3/detail2.mp4', 
        text: {
          en: "First try at displaying the 3D model of Chief Keef with orbitcontrol.",
          fr: "Premier essai d'affichage du modèle 3D de Chief Keef avec orbitcontrol."
        }
      },
      { 
        src: './img/project3/detail3.jpg', 
        text: {
          en: "Modelling process of Chief Keef on Blender.",
          fr: "Processus de modélisation de Chief Keef sur Blender."
        }
      },
      { 
        src: './img/project3/detail4.jpg', 
        text: {
          en: "Clean render of the finished 3D model on Blender.",
          fr: "Rendu propre du modèle 3D terminé sur Blender."
        }
      },
    ],
  },
  {
    id: 4,
    title: {
      en: "@sprayyy\nai recognition\nmediapipe + touchdesigner\n2025",
      fr: "@sprayyy\nreconnaissance ia\nmediapipe + touchdesigner\n2025"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@sprayyy is a visual experiment critic on AI recognition. The goal was to crystallize the impact of AI recognition patterns on street art, most specifically on graffiti artists, often qualified as vandals. By using Mediapipe to recognize humans on the videos and modifying the output, the intent was to anonymize the artists again.",
      fr: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@sprayyy est une expérience visuelle critique de la reconnaissance IA. L'objectif était de cristalliser l'impact des modèles de reconnaissance IA sur l'art de rue, plus spécifiquement sur les graffeurs, souvent qualifiés de vandales. En utilisant Mediapipe pour reconnaître les humains dans les vidéos et en modifiant le résultat, l'intention était d'anonymiser à nouveau les artistes."
    },
    mediaFiles: [
      'image1.mp4',
      'node system.jpg',
    ],
    slides: [
      { 
        src: './img/project4/node system.jpg', 
        text: {
          en: "Overview of the TouchDesigner node system used to create this video. No editing software was used.",
          fr: "Aperçu du système de nodes TouchDesigner utilisé pour créer cette vidéo. Aucun logiciel de montage n'a été utilisé."
        }
      },
    ],
  },
  {
    id: 5,
    title: {
      en: "@internship\nproduct design\nfurniture publishing house\nSOLLEN design\n2024",
      fr: "@stage\ndesign produit\nmaison d'édition de mobilier\nSOLLEN design\n2024"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nIn my second year, I did a 3 months internship at a french furniture publishing house called SOLLEN Design, based in Bordeaux. During this period, I had the chance to work on multiple projects, such as rethinking the main visuals for their website, designing new pieces of furniture to complete an already existing collection, as well as designing and supervising the production of a brand new furniture piece. It was a truly enriching experience despite the company putting another designer's name on my chair design.",
      fr: "\n\n\n\n\n\n\n\n\n\n\n\n\n\nDurant ma deuxième année, j'ai effectué un stage de 3 mois dans une maison d'édition de mobilier française appelée SOLLEN Design, basée à Bordeaux. Pendant cette période, j'ai eu la chance de travailler sur plusieurs projets, tels que repenser les principaux visuels de leur site web, concevoir de nouvelles pièces de mobilier pour compléter une collection déjà existante, ainsi que concevoir et superviser la production d'une toute nouvelle pièce de mobilier. Ce fut une expérience vraiment enrichissante malgré le fait que l'entreprise ait mis le nom d'un autre designer sur mon design de chaise."
    },
    mediaFiles: [
      'cover.jpg',
      'detail1.jpg',
      'detail2.jpg',
      'detail3.jpg',
      'detail4.jpg',
      'detail5.jpg',
      'detail6.jpg',
      'detail7.jpg',
      'detail8.jpg',
    ],
    slides: [
      { 
        src: './img/project5/cover.jpg', 
        text: {
          en: "Ambient 3D scene for the Racine collection. Made on Blender.",
          fr: "Scène 3D d'ambiance pour la collection Racine. Réalisée sur Blender."
        }
      },
      { 
        src: './img/project5/detail1.jpg', 
        text: {
          en: "Ambient 3D scene for the Nuage collection. Made on Blender.",
          fr: "Scène 3D d'ambiance pour la collection Nuage. Réalisée sur Blender."
        }
      },
      { 
        src: './img/project5/detail2.jpg', 
        text: {
          en: "Chair design for the Racine collection. Made on Blender.",
          fr: "Design de chaise pour la collection Racine. Réalisée sur Blender."
        }
      },
      { 
        src: './img/project5/detail3.jpg', 
        text: {
          en: "Barstool design for the Racine collection. Made on Blender.",
          fr: "Design de tabouret de bar pour la collection Racine. Réalisée sur Blender."
        }
      },
      { 
        src: './img/project5/detail4.jpg', 
        text: {
          en: "Footrest design for the Racine lounge chair. Made on Blender.",
          fr: "Design de repose-pied pour la chaise lounge Racine. Réalisée sur Blender."
        }
      },
      { 
        src: './img/project5/detail5.jpg', 
        text: {
          en: "Raw sketches for the chair design.",
          fr: "Esquisses brutes pour la conception de la chaise."
        }
      },
      { 
        src: './img/project5/detail6.jpg', 
        text: {
          en: "Nuage outdoor lounge chair and its footrest that I designed. Made on Blender.",
          fr: "Chaise lounge d'extérieur Nuage et son repose-pied que j'ai designé. Réalisés sur Blender, conçu sur Solidworks."
        }
      },
      { 
        src: './img/project5/detail7.jpg', 
        text: {
          en: "Production supervising for the outdoor Nuage footrest at AARC's workshop.",
          fr: "Supervision de production pour le repose-pied Nuage d'extérieur à l'atelier d'AARC."
        }
      },
      { 
        src: './img/project5/detail8.jpg', 
        text: {
          en: "Staged picture of me working at SOLLEN's head office.",
          fr: "Photo carrément mise en scène de moi travaillant dans les bureaux de SOLLEN."
        }
      },
    ],
  },
  {
    id: 6,
    title: {
      en: "@live.pixels\ncreative coding experiment\np5.js\n2025",
      fr: "@live.pixels\nexpérimentation codage créatif\np5.js\n2025"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@live.pixels is a website made to display creative coding experiments. All the original images are prints of the first Sino-Japanese war (1894-1895) sourced through the national french digital library (Gallica). They were then modified with code to create interesting visual patterns over the image or directly on the image. Accessible at: https://fuckofflee.github.io/LIvE.PiXeLS/",
      fr: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@live.pixels est un site web créé pour afficher mes expérimentations de codage créatif. Toutes les images originales sont des estampes de la première guerre sino-japonaise (1894-1895) provenant de la bibliothèque numérique nationale française (Gallica). Elles ont ensuite été modifiées avec du code pour créer des motifs visuels intéressants sur l'image ou directement dans l'image. Accessible sur : https://fuckofflee.github.io/LIvE.PiXeLS/"
    },
    mediaFiles: [
      'cover2.mp4',
      'detail1.mp4',
      'detail2.mp4',
      'detail3.mp4',
      'detail4.mp4',
      'detail5.mp4',
    ],
  },
  {
    id: 7,
    title: {
      en: "@bare system\nsound system design\nmetalwork\nfeat sohaib acharoui\n2026",
      fr: "@bare system\ndesign système son\nmétallurgie\nfeat sohaib acharoui\n2026"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@bare system is a sound system designed to amplify sound saturation. It was made using parts of a broken surround sound system picked up on the streets of Paris. Its empty structure is made entirely of metal sheets and screws to modify the sound's resonance and saturation by vibrating through the metal. Professional visuals are underway.",
      fr: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n@bare system est un système son conçu pour amplifier la saturation sonore. Il a été fabriqué à partir de pièces d'un système son surround cassé ramassé dans les rues de Paris. Sa structure vide est entièrement faite de tôles et de vis pour modifier la résonance et la saturation du son en vibrant à travers le métal. Des visuels professionnels sont en cours de développement."
    },
    mediaFiles: [
      'cover2.jpg',
      'cover3.mp4',
      'detail1.jpg',
      'detail2.jpg',
      'detail3.jpg',
      'detail4.jpg',
      'detail5.jpg',
      'detail6.jpg',
    ],
    slides: [
      { 
        src: './img/project7/detail1.jpg', 
        text: {
          en: "Metalwork in our school workshop.",
          fr: "Travail du métal dans l'atelier de notre école."
        }
      },
      { 
        src: './img/project7/detail2.jpg', 
        text: {
          en: "Sohaib Acharoui drilling screw holes into metal sheets.",
          fr: "Sohaib Acharoui perçant des trous de vis dans les tôles."
        }
      },
      { 
        src: './img/project7/detail3.jpg', 
        text: {
          en: "Léon River (me) fitting the screws into their sockets.",
          fr: "Léon River (moi) ajustant les vis dans leurs emplacements."
        }
      },
      { 
        src: './img/project7/detail4.jpg', 
        text: {
          en: "First prototype to test the dimensions and the sound saturation.",
          fr: "Premier prototype pour tester les dimensions et la saturation sonore."
        }
      },
      { 
        src: './img/project7/detail6.jpg', 
        text: {
          en: "Soldering process for the electric system after cutting and sanding all the pieces.",
          fr: "Processus de soudure pour le système électrique après découpe et ponçage de toutes les pièces."
        }
      },
    ],
  },
  {
    id: 8,
    title: {
      en: "@telly\ndigital and sound design touchdesigner + ableton\nfeat clara launay+andriana rodchuk\n2025",
      fr: "@telly\nsound design + numérique touchdesigner + ableton\nfeat clara launay+andriana rodchuk\n2025"
    },
    description: {
      en: "\n\n\n\n\n\n\n\n\n\n@telly is a 3D visual displayer for 2D projects. It instances 3D objects, displayed using POPs, and fetches project visuals inside of a folder to display them on the TV screens. A MIDI mapping system was also implemented to control the rotation aspect of the TVs. The sound design was made using recordings of a classmate's voice which were then modified on Ableton to match the visual ambiance of the television visuals.",
      fr: "\n\n\n\n\n\n@telly est un système d'affichage visuel 3D pour projets 2D. Il instancie des objets 3D, affichés via les POPs, et récupère les visuels de projet dans un dossier pour les afficher sur les écrans de télévision. Un système de mapping MIDI a également été implémenté pour contrôler l'aspect rotation des télévisions. Le sound design a été réalisé à partir d'enregistrements de la voix d'un camarade de classe qui ont ensuite été modifiés sur Ableton pour correspondre à l'ambiance visuelle des téléviseurs."
    },
    mediaFiles: [
      'image1.mp4',
      'image2.mp4',
      'image3.mp4',
      'image4.mp4',
      'image5.mp4',
      'image6.mp4',
      'image7.mp4',
    ],
    slides: [
      { 
        src: './img/project8/image4.mp4', 
        text: {
          en: "Overlay of modified voice recordings used to create the ambient sound.",
          fr: "Superposition des enregistrements vocaux modifiés utilisés pour créer le son ambiant."
        }
      },
      { 
        src: './img/project8/image5.mp4', 
        text: {
          en: "Untextured view of the TV system.",
          fr: "Vue sans texture du système de télévision."
        }
      },
      { 
        src: './img/project8/image6.mp4', 
        text: {
          en: "Global overview of the node system.",
          fr: "Aperçu global du système de nœuds."
        }
      },
      { 
        src: './img/project8/image7.mp4', 
        text: {
          en: "File fetching system.",
          fr: "Système de récupération de fichiers."
        }
      },
    ],
  }
];
