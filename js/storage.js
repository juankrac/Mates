// ============================================================
// PERFILES Y LOCALSTORAGE
// ============================================================

import {
  session,
  defaultAppearance,
  defaultAchievements,
  getTodayKey
} from './config.js';

import { buildTopicsForAge } from './content.js';

// ============================================================
// CLAVES DE LOCALSTORAGE
// ============================================================
const PROFILES_KEY = 'expedicion_matematica_profiles_v1';
const ACTIVE_PROFILE_KEY = 'expedicion_matematica_active_v1';

// ============================================================
// CARGAR TODOS LOS PERFILES
// ============================================================
export function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Error cargando perfiles:', e);
    return {};
  }
}

// ============================================================
// GUARDAR TODOS LOS PERFILES
// ============================================================
export function saveProfiles(profiles) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Error guardando perfiles:', e);
  }
}

// ============================================================
// BORRAR UN PERFIL
// ============================================================
export function deleteProfile(name) {
  const profiles = loadProfiles();
  delete profiles[name];
  saveProfiles(profiles);
}

// ============================================================
// CREAR UN PERFIL NUEVO
// ============================================================
export function createProfile(name, age) {
  const profiles = loadProfiles();
  profiles[name] = {
    name: name,
    age: age,
    createdAt: Date.now(),
    stars: {},          // { topicId: numero }
    totalStars: 0,
    appearance: defaultAppearance(),
    achievements: defaultAchievements().map(a => ({ id: a.id, unlocked: false })),
    daily: {
      date: getTodayKey(),
      progress: {
        answersToday: 0,
        starsToday: 0,
        npcsTalkedToday: 0,
        themesCompletedToday: 0,
        npcsSeen: []
      },
      completed: [],
      rewarded: []
    }
  };
  saveProfiles(profiles);
  return profiles[name];
}

// ============================================================
// CARGAR UN PERFIL EN LA SESION ACTUAL
// Coge el perfil de localStorage y rellena:
//   - session.topics (con ejercicios de su edad)
//   - session.totalStars
//   - session.appearance
//   - session.achievements
//   - session.dailyData
//   - session.currentProfile
// ============================================================
export function loadProfileIntoSession(name) {
  const profiles = loadProfiles();
  const p = profiles[name];
  if (!p) return false;

  // Reconstruir topics con los ejercicios de su edad
  session.topics = buildTopicsForAge(p.age);

  // Restaurar las estrellas ganadas por tema
  if (p.stars) {
    session.topics.forEach(t => {
      if (typeof p.stars[t.id] === 'number') {
        t.stars = p.stars[t.id];
      }
    });
  }

  // Total de estrellas
  session.totalStars = session.topics.reduce((acc, t) => acc + t.stars, 0);

  // Restaurar apariencia
  session.appearance = Object.assign(defaultAppearance(), p.appearance || {});

  // Restaurar logros
  session.achievements = defaultAchievements();
  if (p.achievements) {
    p.achievements.forEach(saved => {
      const a = session.achievements.find(x => x.id === saved.id);
      if (a) a.unlocked = saved.unlocked;
    });
  }

  // Restaurar misiones diarias (o crear nuevas si es otro dia)
  if (p.daily && p.daily.date === getTodayKey()) {
    session.dailyData = p.daily;
  } else {
    session.dailyData = {
      date: getTodayKey(),
      progress: {
        answersToday: 0,
        starsToday: 0,
        npcsTalkedToday: 0,
        themesCompletedToday: 0,
        npcsSeen: []
      },
      completed: [],
      rewarded: []
    };
  }

  // Perfil activo
  session.currentProfile = { name: name, age: p.age };

  // Reset indices de ejercicios
  session.ejercicioIndexPorTema = {};

  return true;
}

// ============================================================
// GUARDAR EL ESTADO ACTUAL EN EL PERFIL ACTIVO
// Se llama cada vez que hay un cambio importante:
//   - ganar una estrella
//   - cambiar la apariencia
//   - desbloquear un logro
//   - completar una mision
// ============================================================
export function saveProfileState() {
  if (!session.currentProfile) return;

  const profiles = loadProfiles();
  const p = profiles[session.currentProfile.name];
  if (!p) return;

  // Guardar estrellas por tema
  p.stars = {};
  session.topics.forEach(t => {
    p.stars[t.id] = t.stars;
  });

  // Guardar total
  p.totalStars = session.totalStars;

  // Guardar apariencia (copia profunda)
  p.appearance = JSON.parse(JSON.stringify(session.appearance));

  // Guardar logros
  p.achievements = session.achievements.map(a => ({
    id: a.id,
    unlocked: a.unlocked
  }));

  // Guardar misiones diarias
  p.daily = JSON.parse(JSON.stringify(session.dailyData));

  saveProfiles(profiles);
}

// ============================================================
// PERFIL ACTIVO (persistencia entre sesiones)
// ============================================================
export function getActiveProfileName() {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfileName(name) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, name);
}

export function clearActiveProfileName() {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
}