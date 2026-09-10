// ============================================================
// PERFILES Y LOCALSTORAGE
// ============================================================

import { session, defaultAppearance, defaultAchievements, getTodayKey } from './config.js';
import { buildTopicsForAge } from './content.js';

const PROFILES_KEY = 'expedicion_matematica_profiles_v2';
const ACTIVE_PROFILE_KEY = 'expedicion_matematica_active_profile_v2';

export function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

export function saveProfiles(profiles) {
  try { localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); } catch(e) {}
}

export function deleteProfile(name) {
  const profiles = loadProfiles();
  delete profiles[name];
  saveProfiles(profiles);
}

export function createProfile(name, age) {
  const profiles = loadProfiles();
  profiles[name] = {
    name,
    age,
    createdAt: Date.now(),
    stars: {},
    totalStars: 0,
    appearance: defaultAppearance(),
    achievements: defaultAchievements().map(a => ({ id: a.id, unlocked: false })),
    daily: {
      date: getTodayKey(),
      progress: { answersToday: 0, starsToday: 0, npcsTalkedToday: 0, themesCompletedToday: 0, npcsSeen: [] },
      completed: [], rewarded: []
    }
  };
  saveProfiles(profiles);
  return profiles[name];
}

export function loadProfileIntoSession(name) {
  const profiles = loadProfiles();
  const p = profiles[name];
  if (!p) return false;

  session.topics = buildTopicsForAge(p.age);
  if (p.stars) {
    session.topics.forEach(t => {
      if (typeof p.stars[t.id] === 'number') t.stars = p.stars[t.id];
    });
  }
  session.totalStars = session.topics.reduce((a, t) => a + t.stars, 0);
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
      progress: { answersToday: 0, starsToday: 0, npcsTalkedToday: 0, themesCompletedToday: 0, npcsSeen: [] },
      completed: [], rewarded: []
    };
  }
  session.currentProfile = { name, age: p.age };
  session.ejercicioIndexPorTema = {};
  return true;
}

export function saveProfileState() {
  if (!session.currentProfile) return;
  const profiles = loadProfiles();
  const p = profiles[session.currentProfile.name];
  if (!p) return;
  p.stars = {};
  session.topics.forEach(t => { p.stars[t.id] = t.stars; });
  p.totalStars = session.totalStars;
  p.appearance = JSON.parse(JSON.stringify(session.appearance));
  p.achievements = session.achievements.map(a => ({ id: a.id, unlocked: a.unlocked }));
  p.daily = JSON.parse(JSON.stringify(session.dailyData));
  saveProfiles(profiles);
}

export function getActiveProfileName() {
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfileName(name) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, name);
}