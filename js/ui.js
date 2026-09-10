// ============================================================
// UI: MODALES, HUD, LOGROS, MISIONES, JEFE
// ============================================================

import * as THREE from 'three';
import { refs, session, state, MISSION_TEMPLATES, BOSS_QUESTIONS, MAX_TOTAL_STARS, isZoneUnlocked, ZONES, getTodayKey, log } from './config.js';
import { Sounds, Music } from './audio.js';
import { saveProfileState } from './storage.js';
import { applyAppearance } from './player.js';
import { updateAllHousesForProfile } from './scene.js';
import { openCustomize, closeCustomize } from './customize.js';
import { enterHouse, exitHouse } from './house.js';

// ============================================================
// MODAL DE EJERCICIOS
// ============================================================
export function getSiguienteEjercicio(topic) {
  if (!topic.ejercicios || topic.ejercicios.length === 0) return { q: 'Sin ejercicios', a: '' };
  const idx = session.ejercicioIndexPorTema[topic.id] || 0;
  const ej = topic.ejercicios[idx % topic.ejercicios.length];
  session.ejercicioIndexPorTema[topic.id] = (idx + 1) % topic.ejercicios.length;
  return ej;
}

export function openModal(topic) {
  if (session.modalOpen) return;
  session.modalOpen = true;
  session.currentTopic = topic;
  session.answeredCorrectly = false;
  state.questionStartTime = performance.now();
  document.getElementById('theory-title').textContent = topic.name;
  document.getElementById('theory-icon-big').textContent = topic.icon;
  document.getElementById('theory-text').innerHTML = topic.explicacion || '';
  document.getElementById('theory-example').innerHTML = topic.ejemplo || '';
  document.getElementById('theory-view').style.display = 'block';
  document.getElementById('practice-view').style.display = 'none';
  document.getElementById('modal').classList.add('show');
  Sounds.open();
}
export function closeModal() {
  document.getElementById('modal').classList.remove('show');
  session.modalOpen = false;
  session.currentTopic = null;
}
export function startPractice() {
  if (!session.currentTopic) return;
  const ej = getSiguienteEjercicio(session.currentTopic);
  session.currentTopic._currentQuestion = ej.q;
  session.currentTopic._currentAnswer = ej.a;
  document.getElementById('modal-title').textContent = session.currentTopic.name;
  document.getElementById('question-text').textContent = ej.q;
  const ai = document.getElementById('answer-input');
  ai.value = ''; ai.disabled = false;
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('stars-earned').textContent = '';
  document.getElementById('check-btn').disabled = false;
  document.getElementById('theory-view').style.display = 'none';
  document.getElementById('practice-view').style.display = 'block';
  state.questionStartTime = performance.now();
  ai.focus();
}
export function backToTheory() {
  if (!session.currentTopic) return;
  document.getElementById('theory-title').textContent = session.currentTopic.name;
  document.getElementById('theory-icon-big').textContent = session.currentTopic.icon;
  document.getElementById('theory-text').innerHTML = session.currentTopic.explicacion || '';
  document.getElementById('theory-example').innerHTML = session.currentTopic.ejemplo || '';
  document.getElementById('theory-view').style.display = 'block';
  document.getElementById('practice-view').style.display = 'none';
}
export function checkAnswer() {
  if (!session.currentTopic || session.answeredCorrectly) return;
  const correct = (session.currentTopic._currentAnswer || '').trim().replace(/\s/g, '').toLowerCase().replace(',', '.');
  const user = document.getElementById('answer-input').value.trim().replace(/\s/g, '').toLowerCase().replace(',', '.');
  let isCorrect = false;
  const uN = parseFloat(user), cN = parseFloat(correct);
  if (!isNaN(uN) && !isNaN(cN)) isCorrect = Math.abs(uN - cN) < 0.001;
  else isCorrect = user === correct;
  if (!isCorrect && correct.indexOf('/') !== -1) {
    const p = correct.split('/');
    const n = parseFloat(p[0]), d = parseFloat(p[1]);
    if (!isNaN(n) && !isNaN(d) && d !== 0 && !isNaN(uN)) isCorrect = Math.abs(uN - n/d) < 0.001;
  }
  if (!isCorrect && user.indexOf('/') !== -1) {
    const p = user.split('/');
    const n = parseFloat(p[0]), d = parseFloat(p[1]);
    if (!isNaN(n) && !isNaN(d) && d !== 0 && !isNaN(cN)) isCorrect = Math.abs(n/d - cN) < 0.001;
  }
  const fb = document.getElementById('feedback');
  const se = document.getElementById('stars-earned');
  if (isCorrect) {
    const el = (performance.now() - state.questionStartTime) / 1000;
    if (el < 5) {
      const a = session.achievements.find(x => x.id === 'fast_math');
      if (a && !a.unlocked) { a.unlocked = true; showAchievementToast(a); Sounds.achievement(); saveProfileState(); }
    }
    fb.textContent = 'Correcto!';
    fb.className = 'feedback success';
    trackDaily('answersToday');
    if (session.currentTopic.stars < session.currentTopic.maxStars) {
      const wasComplete = session.currentTopic.stars === session.currentTopic.maxStars - 1;
      session.currentTopic.stars++;
      session.totalStars = session.topics.reduce((a, t) => a + t.stars, 0);
      updateStarDisplay();
      trackDaily('starsToday');
      if (wasComplete) trackDaily('themesCompletedToday');
      saveProfileState();
      session.answeredCorrectly = true;
      document.getElementById('check-btn').disabled = true;
      document.getElementById('answer-input').disabled = true;
      state.celebrating = 2.5;
      if (session.currentTopic.stars === session.currentTopic.maxStars) {
        se.textContent = 'Nivel completado!';
        const h = session.houses.find(x => x.topic.id === session.currentTopic.id);
        if (h) h.roofMat.color.setHex(0xffd700);
        Sounds.complete();
      } else {
        se.textContent = '+1 estrella (' + session.currentTopic.stars + '/' + session.currentTopic.maxStars + ')';
        Sounds.correct();
      }
      checkAchievements();
      updateMissions();
    } else {
      se.textContent = 'Nivel ya completado!';
    }
  } else {
    fb.textContent = 'Intentalo de nuevo';
    fb.className = 'feedback error';
    Sounds.wrong();
  }
}

// ============================================================
// ESTRELLAS
// ============================================================
export function updateStarDisplay() {
  document.getElementById('star-counter').textContent = session.totalStars;
  document.getElementById('star-max').textContent = MAX_TOTAL_STARS;
}

// ============================================================
// LOGROS
// ============================================================
export function showAchievementToast(a) {
  const toast = document.getElementById('achievement-toast');
  document.getElementById('toast-name').textContent = a.name;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}
export function checkAchievements() {
  session.achievements.forEach(a => {
    if (!a.unlocked && a.check()) {
      a.unlocked = true;
      showAchievementToast(a);
      Sounds.achievement();
      saveProfileState();
    }
  });
}

// ============================================================
// MISIONES
// ============================================================
function getMissionProgress(field) {
  if (!session.dailyData) return 0;
  if (field === 'npcsTalkedToday') return session.dailyData.progress.npcsSeen.length;
  return session.dailyData.progress[field] || 0;
}
export function updateMissions() {
  if (!session.dailyData) return;
  let nuevos = false;
  MISSION_TEMPLATES.forEach(m => {
    if (getMissionProgress(m.field) >= m.target && session.dailyData.completed.indexOf(m.id) === -1) {
      session.dailyData.completed.push(m.id);
      nuevos = true;
    }
  });
  if (nuevos) { saveProfileState(); updateMissionsBadge(); }
}
export function claimMissionReward(mission) {
  if (!session.dailyData) return;
  if (session.dailyData.rewarded.indexOf(mission.id) !== -1) return;
  if (session.dailyData.completed.indexOf(mission.id) === -1) return;
  session.dailyData.rewarded.push(mission.id);
  session.totalStars += mission.reward;
  updateStarDisplay();
  saveProfileState();
  const toast = document.getElementById('mission-toast');
  document.getElementById('mission-toast-name').textContent = mission.name + ' (+' + mission.reward + ')';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
  Sounds.mission();
  checkAchievements();
  updateMissionsBadge();
  renderMissions();
}
export function updateMissionsBadge() {
  const badge = document.getElementById('missions-badge');
  if (!session.dailyData) { badge.style.display = 'none'; return; }
  const pend = MISSION_TEMPLATES.filter(m =>
    session.dailyData.completed.indexOf(m.id) !== -1 && session.dailyData.rewarded.indexOf(m.id) === -1
  );
  if (pend.length > 0) { badge.textContent = pend.length; badge.style.display = 'flex'; }
  else badge.style.display = 'none';
}
export function renderMissions() {
  const list = document.getElementById('missions-list');
  document.getElementById('missions-date').textContent = 'Misiones de hoy';
  list.innerHTML = '';
  MISSION_TEMPLATES.forEach(m => {
    const prog = Math.min(getMissionProgress(m.field), m.target);
    const pct = (prog / m.target) * 100;
    const done = session.dailyData.completed.indexOf(m.id) !== -1;
    const rewarded = session.dailyData.rewarded.indexOf(m.id) !== -1;
    const div = document.createElement('div');
    div.className = 'mission-item' + (done ? ' done' : '');
    let boton = '';
    if (done && !rewarded) boton = ' - <button class="mission-claim-btn" data-mission="' + m.id + '">RECLAMAR!</button>';
    else if (rewarded) boton = ' - OK';
    div.innerHTML = '<div class="mission-icon">' + m.icon + '</div>' +
      '<div class="mission-info">' +
      '<div class="mission-name">' + m.name + (done ? ' OK' : '') + '</div>' +
      '<div class="mission-desc">' + m.desc + '</div>' +
      '<div class="mission-progress"><div class="mission-progress-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="mission-reward">' + prog + '/' + m.target + ' - +' + m.reward + boton + '</div>' +
      '</div>';
    list.appendChild(div);
  });
  list.querySelectorAll('.mission-claim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const m = MISSION_TEMPLATES.find(x => x.id === btn.dataset.mission);
      if (m) claimMissionReward(m);
    });
  });
}
export function trackDaily(field, val = 1) {
  if (!session.dailyData) return;
  if (field === 'npcsTalkedToday') return;
  session.dailyData.progress[field] = (session.dailyData.progress[field] || 0) + val;
  updateMissions();
  saveProfileState();
}
export function trackDailyNPC(npcName) {
  if (!session.dailyData) return;
  if (session.dailyData.progress.npcsSeen.indexOf(npcName) === -1) {
    session.dailyData.progress.npcsSeen.push(npcName);
    updateMissions();
    saveProfileState();
  }
}

// ============================================================
// JEFE
// ============================================================
export function isBossUnlocked() { return session.totalStars >= 40; }
export function openBossModal() {
  if (!isBossUnlocked()) { alert('Necesitas 40 estrellas.'); return; }
  if (!state.nearBoss) { alert('Acercate a la cueva.'); return; }
  session.bossModalOpen = true;
  session.bossIndex = 0;
  session.bossResults = [];
  renderBossQuestion();
  document.getElementById('boss-modal').classList.add('show');
  Sounds.bossRoar();
}
export function closeBossModal() {
  document.getElementById('boss-modal').classList.remove('show');
  session.bossModalOpen = false;
}
export function renderBossQuestion() {
  if (session.bossIndex >= BOSS_QUESTIONS.length) { finishBoss(true); return; }
  const q = BOSS_QUESTIONS[session.bossIndex];
  document.getElementById('boss-question').textContent = q.q;
  const ai = document.getElementById('boss-answer-input');
  ai.value = ''; ai.focus();
  document.getElementById('boss-feedback').textContent = '';
  document.getElementById('boss-feedback').className = 'feedback';
  const hp = ((BOSS_QUESTIONS.length - session.bossIndex) / BOSS_QUESTIONS.length) * 100;
  document.getElementById('boss-hp-fill').style.width = hp + '%';
  document.getElementById('boss-hp-text').textContent = (BOSS_QUESTIONS.length - session.bossIndex) + ' / ' + BOSS_QUESTIONS.length;
  const pe = document.getElementById('boss-progress');
  pe.innerHTML = '';
  session.bossResults.forEach((r, i) => {
    const d = document.createElement('div');
    d.className = 'punto ' + (r ? 'correct' : 'wrong');
    d.textContent = i + 1;
    pe.appendChild(d);
  });
  const cur = document.createElement('div');
  cur.className = 'punto current';
  cur.textContent = session.bossIndex + 1;
  pe.appendChild(cur);
}
export function bossAttack() {
  if (!session.bossModalOpen) return;
  const q = BOSS_QUESTIONS[session.bossIndex];
  const user = document.getElementById('boss-answer-input').value.trim().replace(/\s/g, '').replace(',', '.').toLowerCase();
  const correct = q.a.replace(/\s/g, '').replace(',', '.').toLowerCase();
  let isCorrect = false;
  const uN = parseFloat(user), cN = parseFloat(correct);
  if (!isNaN(uN) && !isNaN(cN)) isCorrect = Math.abs(uN - cN) < 0.001;
  else isCorrect = user === correct;
  session.bossResults.push(isCorrect);
  if (isCorrect) {
    document.getElementById('boss-feedback').textContent = 'Golpe!';
    document.getElementById('boss-feedback').className = 'feedback success';
    Sounds.bossHit();
    session.bossIndex++;
    setTimeout(() => {
      if (session.bossIndex >= BOSS_QUESTIONS.length) finishBoss(true);
      else renderBossQuestion();
    }, 700);
  } else {
    document.getElementById('boss-feedback').textContent = 'Fallaste! Era ' + q.a;
    document.getElementById('boss-feedback').className = 'feedback error';
    Sounds.wrong();
    setTimeout(() => finishBoss(false), 1500);
  }
}
export function finishBoss(win) {
  session.bossModalOpen = false;
  document.getElementById('boss-modal').classList.remove('show');
  if (win) {
    Sounds.bossWin();
    session.totalStars += 5;
    updateStarDisplay();
    const a = session.achievements.find(x => x.id === 'boss_slayer');
    if (a && !a.unlocked) { a.unlocked = true; showAchievementToast(a); Sounds.achievement(); }
    saveProfileState();
    checkAchievements();
    alert('Has derrotado al jefe! +5 estrellas');
  } else {
    alert('El jefe te vencio. Intentalo otra vez!');
  }
}

// ============================================================
// INTERACCION CON MUNDO
// ============================================================
export function getNearestTopicToNPC(npc) {
  let best = null, bd = Infinity;
  session.topics.forEach(t => {
    const wp = getWorldPositionLocal(t);
    const d = Math.hypot(wp.x - npc.x, wp.z - npc.z);
    if (d < bd) { bd = d; best = t; }
  });
  return best;
}
function getWorldPositionLocal(topic) {
  const zone = ZONES[topic.zone];
  return { x: topic.position.x + zone.offset.x, z: topic.position.z + zone.offset.z };
}
export function tryOpenNearbyHouse() {
  if (session.modalOpen || session.customizing || session.bossModalOpen) return;
  if (state.inHouse) return;
  if (state.nearHome) { openHome(); return; }
  if (!state.nearHouse) return;
  if (!isZoneUnlocked(state.nearHouse.zone)) {
    alert(ZONES[state.nearHouse.zone].name + ' se desbloquea con ' + ZONES[state.nearHouse.zone].unlockStars + ' estrellas');
    return;
  }
  openModal(state.nearHouse.topic);
}
export function tryTalkToNPC() {
  if (session.modalOpen || session.customizing || session.bossModalOpen) return;
  if (state.inHouse) return;
  if (!state.nearNPC) return;
  const npc = state.nearNPC;
  const nt = getNearestTopicToNPC(npc);
  const hints = nt ? nt.hints : npc.hints;
  const hint = hints[npc.hintIndex % hints.length];
  npc.hintIndex++;
  document.getElementById('npc-name').textContent = npc.name;
  document.getElementById('npc-text').textContent = hint;
  document.getElementById('npc-dialog').style.display = 'block';
  trackDailyNPC(npc.name);
  Sounds.talk();
}

// ============================================================
// CASA
// ============================================================
export function openHome() {
  if (session.modalOpen || session.customizing || session.bossModalOpen) return;
  if (!state.nearHome) return;
  const stats = document.getElementById('home-stats-content');
  const completos = session.topics.filter(t => t.stars >= t.maxStars).length;
  stats.innerHTML =
    '<b>Estrellas totales:</b> ' + session.totalStars + ' / ' + MAX_TOTAL_STARS + '<br>' +
    '<b>Temas completos:</b> ' + completos + ' / ' + session.topics.length + '<br>' +
    '<b>Logros:</b> ' + session.achievements.filter(a => a.unlocked).length + ' / ' + session.achievements.length + '<br>' +
    '<b>Misiones hoy:</b> ' + session.dailyData.completed.length + ' / ' + MISSION_TEMPLATES.length;
  document.getElementById('home-modal').classList.add('show');
  Sounds.home();
}
export function closeHome() {
  document.getElementById('home-modal').classList.remove('show');
}

// ============================================================
// BINDINGS DE UI
// ============================================================
export function bindUI() {
  document.getElementById('check-btn').addEventListener('click', checkAnswer);
  document.getElementById('close-btn').addEventListener('click', closeModal);
  document.getElementById('theory-close-btn').addEventListener('click', closeModal);
  document.getElementById('start-practice-btn').addEventListener('click', startPractice);
  document.getElementById('back-theory-btn').addEventListener('click', backToTheory);
  document.getElementById('answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); checkAnswer(); }
  });
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) closeModal();
  });

  document.getElementById('home-close-btn').addEventListener('click', closeHome);
  document.getElementById('home-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('home-modal')) closeHome();
  });
  document.getElementById('home-enter-btn').addEventListener('click', () => {
    closeHome(); enterHouse();
  });
  document.getElementById('btn-exit-house').addEventListener('click', exitHouse);

  document.getElementById('btn-enter').addEventListener('click', tryOpenNearbyHouse);
  document.getElementById('btn-talk').addEventListener('click', tryTalkToNPC);
  document.getElementById('btn-boss').addEventListener('click', openBossModal);
  document.getElementById('btn-home').addEventListener('click', openHome);

  document.getElementById('npc-close').addEventListener('click', () => {
    document.getElementById('npc-dialog').style.display = 'none';
  });

  document.getElementById('boss-check-btn').addEventListener('click', bossAttack);
  document.getElementById('boss-close-btn').addEventListener('click', closeBossModal);
  document.getElementById('boss-answer-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); bossAttack(); }
  });
  document.getElementById('boss-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('boss-modal')) closeBossModal();
  });

  document.getElementById('customize-btn').addEventListener('click', openCustomize);
  document.getElementById('customize-close').addEventListener('click', closeCustomize);
  document.getElementById('customize-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('customize-modal')) closeCustomize();
  });

  document.getElementById('achievements-btn').addEventListener('click', () => {
    const list = document.getElementById('achievements-list');
    list.innerHTML = '';
    session.achievements.forEach(a => {
      const d = document.createElement('div');
      d.className = 'ach-item ' + (a.unlocked ? 'unlocked' : 'locked');
      d.innerHTML = '<div class="ach-icon">' + a.icon + '</div>' +
        '<div class="ach-info"><div class="ach-name">' + a.name + (a.unlocked ? ' OK' : ' - bloqueado') + '</div>' +
        '<div class="ach-desc">' + a.desc + '</div></div>';
      list.appendChild(d);
    });
    document.getElementById('achievements-modal').classList.add('show');
  });
  document.getElementById('achievements-close').addEventListener('click', () => {
    document.getElementById('achievements-modal').classList.remove('show');
  });
  document.getElementById('achievements-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('achievements-modal')) document.getElementById('achievements-modal').classList.remove('show');
  });

  document.getElementById('missions-btn').addEventListener('click', () => {
    renderMissions();
    document.getElementById('missions-modal').classList.add('show');
  });
  document.getElementById('missions-close').addEventListener('click', () => {
    document.getElementById('missions-modal').classList.remove('show');
  });
  document.getElementById('missions-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('missions-modal')) document.getElementById('missions-modal').classList.remove('show');
  });

  document.getElementById('photo-btn').addEventListener('click', () => {
    if (session.modalOpen || session.customizing || session.bossModalOpen) return;
    Sounds.photo();
    const flash = document.getElementById('photo-flash');
    flash.style.opacity = '0.85';
    const ids = ['hud', 'top-buttons', 'touch-controls', 'action-buttons', 'hint', 'manga-lines'];
    const els = ids.map(id => document.getElementById(id));
    const vis = els.map(e => e ? e.style.visibility : '');
    els.forEach(e => { if (e) e.style.visibility = 'hidden'; });
    setTimeout(() => {
      refs.renderer.render(refs.scene, refs.camera);
      const dataURL = refs.renderer.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      link.download = 'expedicion-matematica-' + ts + '.png';
      link.href = dataURL; link.click();
      flash.style.opacity = '0';
      const toast = document.getElementById('photo-toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
      els.forEach((e, i) => { if (e) e.style.visibility = vis[i]; });
    }, 200);
  });

  const musicBtn = document.getElementById('music-btn');
  const updateMusicButton = () => {
    musicBtn.textContent = Music.playing ? 'Musica: ON' : 'Musica: OFF';
    musicBtn.className = Music.playing ? 'music-on' : 'music-off';
  };
  musicBtn.addEventListener('click', () => {
    if (Music.playing) Music.stop(); else Music.start();
    updateMusicButton();
  });
  updateMusicButton();

  document.body.addEventListener('click', () => {
    if (window.audioCtx && window.audioCtx.state === 'suspended') window.audioCtx.resume();
  }, { once: true });

  window.addEventListener('resize', () => {
    if (refs.camera && refs.renderer) {
      refs.camera.aspect = window.innerWidth / window.innerHeight;
      refs.camera.updateProjectionMatrix();
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (refs.previewRenderer) {
      const canvas = document.getElementById('customize-preview-canvas');
      if (canvas && canvas.clientWidth > 0) {
        refs.previewRenderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      }
    }
  });
}