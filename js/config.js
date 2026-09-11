// ============================================================
// CONFIGURACION GLOBAL
// ============================================================

import * as THREE from 'three';

// ============================================================
// ZONAS DEL MAPA
// ============================================================
export const ZONES = {
  pueblo:  { name: 'Pueblo',  unlockStars: 0,  offset: { x: 0,  z: 0 } },
  bosque:  { name: 'Bosque',  unlockStars: 10, offset: { x: 0,  z: -70 } },
  montana: { name: 'Montana', unlockStars: 30, offset: { x: 70, z: 0 } }
};

// ============================================================
// TEMAS BASE (estructura, sin contenido)
// ============================================================
export const TOPICS_BASE = [
  { id: 'numeros',       name: 'Numeros',       icon: '1', color: 0xff6b6b, zone: 'pueblo', position: { x: -14, z: -14 } },
  { id: 'divisibilidad', name: 'Divisibilidad', icon: '2', color: 0x4ecdc4, zone: 'pueblo', position: { x: -7,  z: -16 } },
  { id: 'fracciones',    name: 'Fracciones',    icon: '3', color: 0xffa94d, zone: 'pueblo', position: { x: 0,   z: -16 } },
  { id: 'decimales',     name: 'Decimales',     icon: '4', color: 0x845ef7, zone: 'pueblo', position: { x: 7,   z: -16 } },
  { id: 'porcentajes',   name: 'Porcentajes',   icon: '5', color: 0xff922b, zone: 'pueblo', position: { x: 14,  z: -14 } },
  { id: 'geometria',     name: 'Geometria',     icon: '6', color: 0x51cf66, zone: 'pueblo', position: { x: 16,  z: 0 } },
  { id: 'medidas',       name: 'Medidas',       icon: '7', color: 0x22b8cf, zone: 'pueblo', position: { x: 16,  z: 12 } },
  { id: 'problemas',     name: 'Problemas',     icon: '8', color: 0xf06595, zone: 'pueblo', position: { x: 0,   z: 17 } },
  { id: 'estadistica',   name: 'Estadistica',   icon: '9', color: 0x748ffc, zone: 'pueblo', position: { x: -14, z: 14 } },
  { id: 'potencias',     name: 'Potencias',     icon: 'P', color: 0xff7675, zone: 'bosque', position: { x: -8,  z: -12 } },
  { id: 'enteros',       name: 'Enteros',       icon: 'E', color: 0x74b9ff, zone: 'bosque', position: { x: 0,   z: -15 } },
  { id: 'algebra',       name: 'Algebra',       icon: 'A', color: 0xa29bfe, zone: 'bosque', position: { x: 8,   z: -12 } },
  { id: 'ecuaciones',    name: 'Ecuaciones',    icon: 'X', color: 0xfab1a0, zone: 'montana', position: { x: -6, z: 0 } },
  { id: 'probabilidad',  name: 'Probabilidad',  icon: 'D', color: 0xffd93d, zone: 'montana', position: { x: 6,  z: 0 } }
];

export const MAX_TOTAL_STARS = TOPICS_BASE.length * 9;

// ============================================================
// MISIONES DIARIAS
// ============================================================
export const MISSION_TEMPLATES = [
  { id: 'answer5',  icon: 'E', name: 'Estudiosa',           desc: 'Responde 5 preguntas',         target: 5, reward: 2, field: 'answersToday' },
  { id: 'stars3',   icon: '*', name: 'Cazadora estrellas',  desc: 'Gana 3 estrellas hoy',         target: 3, reward: 2, field: 'starsToday' },
  { id: 'talk2',    icon: 'C', name: 'Charlatana',          desc: 'Habla con 2 aldeanos',         target: 2, reward: 1, field: 'npcsTalkedToday' },
  { id: 'oneTheme', icon: 'H', name: 'Especialista',        desc: 'Completa un tema hoy',         target: 1, reward: 3, field: 'themesCompletedToday' }
];

// ============================================================
// DESBLOQUEOS DE PERSONALIZACION
// ============================================================
export const UNLOCKS = {
  outfits: {
    dress: 0,
    tshirt: 0,
    uniform: 10,
    overalls: 20
  },
  outfitColors: {
    '0x3d5a99': 0,
    '0xff6b6b': 0,
    '0x4ecdc4': 0,
    '0xffa94d': 0,
    '0x845ef7': 5,
    '0x51cf66': 10,
    '0xf06595': 15,
    '0xffd93d': 25,
    '0xffffff': 30,
    '0x2c2c2c': 40,
    '0xffd700': 50,
    '0xrainbow': 70
  },
  accessories: {
    none: 0,
    cap: 3,
    glasses: 8,
    backpack: 15,
    all: 35
  },
  pets: {
    none: 0,
    cat: 12,
    dog: 25,
    bird: 45
  }
};

// ============================================================
// PALETAS DE COLORES
// ============================================================
export const SKIN_COLORS = [0xffe0b2, 0xf1c27d, 0xd9a066, 0xa86a3d, 0x6b4226, 0xffdab9];
export const HAIR_COLORS = [0x4a2c17, 0x1a1a1a, 0x8b5a2b, 0xd4a373, 0xffd93d, 0xff6b6b, 0x9b59b6, 0x3498db];
export const EYE_COLORS  = [0x222222, 0x4a2c17, 0x2e86de, 0x10ac84, 0x8e44ad, 0x6b4226, 0x576574];
export const OUTFIT_COLORS = [
  '0x3d5a99', '0xff6b6b', '0x4ecdc4', '0xffa94d',
  '0x845ef7', '0x51cf66', '0xf06595', '0xffd93d',
  '0xffffff', '0x2c2c2c', '0xffd700', '0xrainbow'
];

// ============================================================
// PREGUNTAS DEL JEFE FINAL
// ============================================================
export const BOSS_QUESTIONS = [
  { q: '7 x 8?',              a: '56' },
  { q: '144 / 12?',           a: '12' },
  { q: 'MCM de 4 y 6',        a: '12' },
  { q: '3/4 + 1/4 (ej: 1)',   a: '1'  },
  { q: '25% de 80',           a: '20' },
  { q: '2^3 + 3^2',           a: '17' },
  { q: '(-8) + 5',            a: '-3' },
  { q: '4x=32, x?',           a: '8'  },
  { q: 'cm en 0,75 m',        a: '75' },
  { q: 'Media de 5, 10, 15',  a: '10' }
];

// ============================================================
// POSICIONES FIJAS
// ============================================================
export const HOME_POS = { x: 8, z: 8 };
export const BOSS_POS = { x: ZONES.montana.offset.x + 15, z: ZONES.montana.offset.z - 15 };

// ============================================================
// ESTADO GLOBAL DEL JUEGO
// ============================================================
export const state = {
  x: 0, z: 5,
  speed: 9,
  keys: {},
  nearHouse: null,
  nearNPC: null,
  nearBoss: false,
  nearHome: false,
  walkCycle: 0,
  stepTimer: 0,
  celebrating: 0,
  customizing: false,
  questionStartTime: 0,
  inHouse: false
};

// ============================================================
// SESION ACTUAL (perfil activo, topics, apariencia, etc)
// ============================================================
export const session = {
  currentProfile: null,      // { name, age }
  topics: [],                // topics completos de la edad actual
  totalStars: 0,
  appearance: null,          // apariencia del personaje
  achievements: [],          // logros del perfil
  dailyData: null,           // misiones diarias
  ejercicioIndexPorTema: {}, // indice de ejercicio por tema
  houses: [],                // referencias a las casitas 3D
  npcs: [],                  // referencias a los NPCs 3D
  lampposts: [],             // referencias a las farolas 3D
  sceneInitialized: false,
  modalOpen: false,
  currentTopic: null,
  answeredCorrectly: false,
  bossModalOpen: false,
  bossIndex: 0,
  bossResults: []
};

// ============================================================
// REFERENCIAS 3D (se llenan al inicializar la escena)
// ============================================================
export const refs = {
  scene: null,
  camera: null,
  renderer: null,
  player: null,
  parts: {},
  waterBall: null,
  homeGroup: null,
  houseInterior: null,
  houseObstacles: [],
  previewRenderer: null,
  previewScene: null,
  previewCamera: null,
  previewCharacter: null,
  clock: null
};

// ============================================================
// FUNCIONES HELPERS
// ============================================================

/**
 * Escribe un mensaje de log en consola y en el panel de debug
 */
export function log(msg, isError) {
  console.log(msg);
  const debugEl = document.getElementById('debug');
  if (!debugEl) return;
  if (isError) {
    debugEl.textContent = msg;
    debugEl.classList.add('error');
    debugEl.style.display = 'block';
  }
}

/**
 * Devuelve la clave de fecha de hoy (YYYY-MM-DD)
 */
export function getTodayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

/**
 * Devuelve la posicion mundial de un tema (sumando offset de su zona)
 */
export function getWorldPosition(topic) {
  const zone = ZONES[topic.zone];
  return {
    x: topic.position.x + zone.offset.x,
    z: topic.position.z + zone.offset.z
  };
}

/**
 * Comprueba si una zona esta desbloqueada segun las estrellas actuales
 */
export function isZoneUnlocked(zoneId) {
  return session.totalStars >= ZONES[zoneId].unlockStars;
}

/**
 * Comprueba si una opcion de personalizacion esta desbloqueada
 */
export function isUnlocked(cat, val) {
  const map = UNLOCKS[cat];
  if (!map) return true;
  const key = String(val);
  const req = map[key];
  if (req === undefined) return true;
  return session.totalStars >= req;
}

/**
 * Devuelve la apariencia por defecto del personaje
 */
export function defaultAppearance() {
  return {
    skinColor: 0xffe0b2,
    hairStyle: 'short',
    hairColor: 0x4a2c17,
    eyeStyle: 'round',
    eyeColor: 0x222222,
    face: 'smile',
    outfitStyle: 'dress',
    outfitColor: '0x3d5a99',
    accessory: 'none',
    pet: 'none'
  };
}

/**
 * Devuelve la lista de logros por defecto
 */
export function defaultAchievements() {
  return [
    { id: 'first_star',  icon: '*', name: 'Primera estrella',  desc: 'Consigue 1 estrella',                check: () => session.totalStars >= 1,                     unlocked: false },
    { id: 'ten_stars',   icon: '*', name: 'Coleccionista',     desc: '10 estrellas',                       check: () => session.totalStars >= 10,                    unlocked: false },
    { id: 'fast_math',   icon: '!', name: 'Matematica veloz',  desc: 'Acierta en menos de 5 s',            check: () => false,                                       unlocked: false },
    { id: 'first_house', icon: '#', name: 'Primera casita',    desc: 'Completa un tema',                   check: () => session.topics.some(t => t.stars >= t.maxStars), unlocked: false },
    { id: 'explorer',    icon: 'T', name: 'Exploradora',       desc: 'Desbloquea el Bosque',               check: () => session.totalStars >= 10,                    unlocked: false },
    { id: 'mountaineer', icon: 'M', name: 'Montanera',         desc: 'Desbloquea la Montana',              check: () => session.totalStars >= 30,                    unlocked: false },
    { id: 'boss_slayer', icon: 'B', name: 'Cazadora de Jefes', desc: 'Derrota al jefe',                    check: () => false,                                       unlocked: false },
    { id: 'all_stars',   icon: '*', name: 'Maestria total',    desc: 'Todas las estrellas',                check: () => session.totalStars >= MAX_TOTAL_STARS,       unlocked: false }
  ];
}

/**
 * Comprueba si una posicion (x, z) esta sobre suelo caminable.
 * Tiene en cuenta las 3 zonas principales y los puentes.
 * Si el jugador esta dentro de la casa, usa los limites del interior.
 */
export function isOnWalkableGround(x, z) {
  if (state.inHouse) {
    // Limites interiores de la casa: cuadrado -9.5 a 9.5
    if (x < -9.5 || x > 9.5 || z < -9.5 || z > 9.5) return false;
    // Comprobar obstaculos (muebles)
    for (let i = 0; i < refs.houseObstacles.length; i++) {
      const o = refs.houseObstacles[i];
      if (x >= o.x1 && x <= o.x2 && z >= o.z1 && z <= o.z2) return false;
    }
    return true;
  }
  // Exterior: 3 zonas
  if (x >= -28 && x <= 28 && z >= -28 && z <= 28) return true;      // Pueblo
  if (x >= -28 && x <= 28 && z >= -98 && z <= -42) return true;     // Bosque
  if (x >= 42 && x <= 98 && z >= -28 && z <= 28) return true;       // Montana
  // Puente Pueblo-Bosque
  if (x >= -1.5 && x <= 1.5 && z >= -44 && z <= -26) return true;
  // Puente Pueblo-Montana
  if (x >= 26 && x <= 44 && z >= -1.5 && z <= 1.5) return true;
  return false;
}

/**
 * Crea un gradient map para el efecto toon (4 niveles de sombra)
 */
export function makeGradientMap(steps) {
  steps = steps || 4;
  const data = new Uint8Array(steps);
  for (let i = 0; i < steps; i++) data[i] = Math.round((i / (steps - 1)) * 255);
  const tex = new THREE.DataTexture(data, steps, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}