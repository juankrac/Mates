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

const PROFILES_KEY = 'expedicion_matematica_profiles_v2';
const ACTIVE_PROFILE_KEY = 'expedicion_matematica_active_v2';

// ============================================================
// CARGAR TODOS LOS PERFILES
// ============================================================
export function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      console.log('[storage] No hay perfiles guardados');
      return {};
    }
    const parsed = JSON.parse(raw);
    console.log('[storage] Perfiles cargados:', Object.keys(parsed));
    return parsed;
  } catch (e) {
    console.warn('[storage] Error cargando perfiles:', e);
    return {};
  }
}

// ============================================================
// GUARDAR TODOS LOS PERFILES
// ============================================================
export function saveProfiles(profiles) {
  try {
    const json = JSON.stringify(profiles);
    localStorage.setItem(PROFILES_KEY, json);
    console.log('[storage] Perfiles guardados. Total:', Object.keys(profiles).length, 'Tamano:', json.length, 'bytes');
  } catch (e) {
    console.warn('[storage] Error guardando perfiles:', e);
  }
}

// ============================================================
// BORRAR UN PERFIL
// ============================================================
export function deleteProfile(name) {
  const profiles = loadProfiles();
  delete profiles[name];
  saveProfiles(profiles);
  console.log('[storage] Perfil borrado:', name);
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
    stars: {},
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
  console.log('[storage] Perfil creado:', name, age, 'anos');
  return profiles[name];
}

// ============================================================
// CARGAR UN PERFIL EN LA SESION ACTUAL
// ============================================================
export function loadProfileIntoSession(name) {
  const profiles = loadProfiles();
  const p = profiles[name];
  if (!p) {
    console.warn('[storage] Perfil no encontrado:', name);
    return false;
  }

  session.topics = buildTopicsForAge(p.age);

  if (p.stars) {
    session.topics.forEach(t => {
      if (typeof p.stars[t.id] === 'number') {
        t.stars = p.stars[t.id];
      }
    });
  }

  session.totalStars = session.topics.reduce((acc, t) => acc + t.stars, 0);
  session.appearance = Object.assign(defaultAppearance(), p.appearance || {});

  session.achievements = defaultAchievements();
  if (p.achievements) {
    p.achievements.forEach(saved => {
      const a = session.achievements.find(x => x.id === saved.id);
      if (a) a.unlocked = saved.unlocked;
    });
  }

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

  session.currentProfile = { name: name, age: p.age };
  session.ejercicioIndexPorTema = {};

  console.log('[storage] Perfil cargado en sesion:', name);
  return true;
}

// ============================================================
// GUARDAR EL ESTADO ACTUAL EN EL PERFIL ACTIVO
// ============================================================
export function saveProfileState() {
  if (!session.currentProfile) {
    console.warn('[storage] No hay perfil activo, no se guarda');
    return;
  }

  const profiles = loadProfiles();
  const p = profiles[session.currentProfile.name];
  if (!p) {
    console.warn('[storage] No existe el perfil activo en storage');
    return;
  }

  p.stars = {};
  session.topics.forEach(t => {
    p.stars[t.id] = t.stars;
  });

  p.totalStars = session.totalStars;
  p.appearance = JSON.parse(JSON.stringify(session.appearance));
  p.achievements = session.achievements.map(a => ({
    id: a.id,
    unlocked: a.unlocked
  }));
  p.daily = JSON.parse(JSON.stringify(session.dailyData));

  saveProfiles(profiles);
}

// ============================================================
// PERFIL ACTIVO
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