// ============================================================
// ARRANQUE Y BUCLE PRINCIPAL
// ============================================================

import * as THREE from 'three';
import { refs, session, state, log, MAX_TOTAL_STARS, getWorldPosition, isOnWalkableGround, isZoneUnlocked } from './config.js';
import { initToon, initScene, createHouse, updateAllHousesForProfile } from './scene.js';
import { createPlayer, applyAppearance } from './player.js';
import { createHouseInterior, exitHouse } from './house.js';
import { bindUI, updateStarDisplay, updateMissionsBadge, tryOpenNearbyHouse, tryTalkToNPC, openHome, isBossUnlocked } from './ui.js';
import { loadProfiles, saveProfiles, deleteProfile, createProfile, loadProfileIntoSession, saveProfileState, getActiveProfileName, setActiveProfileName } from './storage.js';
import { Sounds } from './audio.js';

// ============================================================
// PANTALLA DE PERFILES
// ============================================================
const profilesScreen = document.getElementById('profiles-screen');
const profilesList = document.getElementById('profiles-list');
const createModal = document.getElementById('create-profile-modal');
let pendingAge = null;

function renderProfilesScreen() {
  const profiles = loadProfiles();
  profilesList.innerHTML = '';
  const names = Object.keys(profiles);
  if (names.length === 0) {
    profilesList.innerHTML = '<div style="text-align:center;font-weight:700;color:#8b6f4c;">Aun no hay perfiles. Crea uno para empezar!</div>';
  }
  names.forEach(name => {
    const p = profiles[name];
    const card = document.createElement('div');
    card.className = 'profile-card';
    const stars = p.totalStars || 0;
    card.innerHTML =
      '<div class="delete-profile" data-name="' + name.replace(/"/g,'&quot;') + '">X</div>' +
      '<div class="avatar">' + (p.age === 9 ? '9' : '11') + '</div>' +
      '<div class="pname">' + name + '</div>' +
      '<div class="page">' + p.age + ' anos</div>' +
      '<div class="pstars">' + stars + ' estrellas</div>';
    card.addEventListener('click', e => {
      if (e.target.classList.contains('delete-profile')) return;
      selectProfile(name);
    });
    const delBtn = card.querySelector('.delete-profile');
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (confirm('Borrar el perfil de ' + name + '?')) {
        deleteProfile(name);
        renderProfilesScreen();
      }
    });
    profilesList.appendChild(card);
  });
}

function selectProfile(name) {
  if (!loadProfileIntoSession(name)) return;
  setActiveProfileName(name);
  profilesScreen.style.display = 'none';
  document.getElementById('hud-name').textContent = name;

  if (!session.sceneInitialized) {
    initToon();
    initScene();
    createPlayer();
    createHouseInterior();
    session.topics.forEach(createHouse);
    session.sceneInitialized = true;
    refs.clock = new THREE.Clock();
    animate();
  } else {
    applyAppearance();
    updateAllHousesForProfile();
  }
  applyAppearance();
  updateStarDisplay();
  updateMissionsBadge();
  refs.player.position.set(0, 0, 5);
  state.x = 0; state.z = 5;
  state.inHouse = false;
  refs.houseInterior.visible = false;
  document.getElementById('btn-exit-house').style.display = 'none';
}

document.getElementById('new-profile-card').addEventListener('click', () => {
  document.getElementById('profile-name').value = '';
  pendingAge = null;
  document.querySelectorAll('#age-options button').forEach(b => b.classList.remove('selected'));
  createModal.classList.add('show');
  document.getElementById('profile-name').focus();
});

document.querySelectorAll('#age-options button').forEach(b => {
  b.addEventListener('click', () => {
    pendingAge = parseInt(b.dataset.age, 10);
    document.querySelectorAll('#age-options button').forEach(x => x.classList.remove('selected'));
    b.classList.add('selected');
  });
});

document.getElementById('cancel-create-btn').addEventListener('click', () => {
  createModal.classList.remove('show');
});

document.getElementById('confirm-create-btn').addEventListener('click', () => {
  const name = document.getElementById('profile-name').value.trim();
  if (!name) { alert('Escribe tu nombre'); return; }
  if (name.length < 2) { alert('El nombre es muy corto'); return; }
  if (!pendingAge) { alert('Elige tu edad'); return; }
  const profiles = loadProfiles();
  if (profiles[name]) { alert('Ya existe un perfil con ese nombre'); return; }
  createProfile(name, pendingAge);
  createModal.classList.remove('show');
  renderProfilesScreen();
  selectProfile(name);
});

document.getElementById('profiles-btn').addEventListener('click', () => {
  if (session.currentProfile) saveProfileState();
  profilesScreen.style.display = 'flex';
  renderProfilesScreen();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (!session.currentProfile) return;
  if (!confirm('Borrar todo el progreso de ' + session.currentProfile.name + '?')) return;
  deleteProfile(session.currentProfile.name);
  localStorage.removeItem('expedicion_matematica_active_profile_v2');
  location.reload();
});

// ============================================================
// CONTROLES
// ============================================================
window.addEventListener('keydown', e => {
  if (session.modalOpen) {
    if (e.key === 'Enter') { e.preventDefault(); import('./ui.js').then(m => m.checkAnswer()); }
    if (e.key === 'Escape') import('./ui.js').then(m => m.closeModal());
    return;
  }
  if (session.bossModalOpen) {
    if (e.key === 'Enter') { e.preventDefault(); import('./ui.js').then(m => m.bossAttack()); }
    if (e.key === 'Escape') import('./ui.js').then(m => m.closeBossModal());
    return;
  }
  if (session.customizing) {
    if (e.key === 'Escape') import('./customize.js').then(m => m.closeCustomize());
    return;
  }
  const k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd', 'q', 'e'].indexOf(k) !== -1) {
    e.preventDefault();
  }
  state.keys[k] = true;
  if (k === ' ' || k === 'e') tryOpenNearbyHouse();
  if (k === 'q') tryTalkToNPC();
});
window.addEventListener('keyup', e => {
  state.keys[e.key.toLowerCase()] = false;
});

function bindTouch(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('touchstart', e => { e.preventDefault(); state.keys[key] = true; }, { passive: false });
  el.addEventListener('touchend', e => { e.preventDefault(); state.keys[key] = false; });
  el.addEventListener('touchcancel', e => { e.preventDefault(); state.keys[key] = false; });
  el.addEventListener('mousedown', e => { e.preventDefault(); state.keys[key] = true; });
  el.addEventListener('mouseup', e => { e.preventDefault(); state.keys[key] = false; });
  el.addEventListener('mouseleave', e => { e.preventDefault(); state.keys[key] = false; });
}
bindTouch('t-up', 'arrowup');
bindTouch('t-down', 'arrowdown');
bindTouch('t-left', 'arrowleft');
bindTouch('t-right', 'arrowright');

// ============================================================
// BUCLE PRINCIPAL
// ============================================================
const tempCamPos = new THREE.Vector3();
const tempLookAt = new THREE.Vector3();
let frames = 0;

function animate() {
  requestAnimationFrame(animate);
  if (!refs.renderer || !refs.scene || !refs.player || !refs.clock) return;
  const dt = Math.min(refs.clock.getDelta(), 0.1);
  const el = refs.clock.elapsedTime;

  if (refs.waterBall) refs.waterBall.position.y = 2.2 + Math.sin(el * 3) * 0.15;

  if (session.customizing) {
    refs.player.rotation.y += dt * 1.2;
    tempCamPos.set(state.x + 3, 3, state.z + 5);
    refs.camera.position.lerp(tempCamPos, 5 * dt);
    tempLookAt.set(state.x, 1.5, state.z);
    refs.camera.lookAt(tempLookAt);
    refs.parts.legL.rotation.x *= 0.9;
    refs.parts.legR.rotation.x *= 0.9;
    refs.parts.armL.rotation.x *= 0.9;
    refs.parts.armR.rotation.x *= 0.9;
    refs.renderer.render(refs.scene, refs.camera);
    return;
  }

  let mx = 0, mz = 0;
  if (state.keys['arrowup'] || state.keys['w']) mz -= 1;
  if (state.keys['arrowdown'] || state.keys['s']) mz += 1;
  if (state.keys['arrowleft'] || state.keys['a']) mx -= 1;
  if (state.keys['arrowright'] || state.keys['d']) mx += 1;

  if (state.celebrating > 0) {
    state.celebrating -= dt;
    refs.player.rotation.y += dt * 8;
    refs.parts.armL.rotation.x = Math.sin(el * 20) * 1.2;
    refs.parts.armR.rotation.x = -Math.sin(el * 20) * 1.2;
    refs.parts.legL.rotation.x = Math.sin(el * 20) * 0.6;
    refs.parts.legR.rotation.x = -Math.sin(el * 20) * 0.6;
    refs.player.position.y = Math.max(0, Math.sin(el * 12) * 0.15);
  } else if (mx !== 0 || mz !== 0) {
    const len = Math.hypot(mx, mz);
    mx /= len; mz /= len;
    const newX = state.x + mx * state.speed * dt;
    const newZ = state.z + mz * state.speed * dt;
    let moved = false;
    if (isOnWalkableGround(newX, newZ)) {
      state.x = newX; state.z = newZ; moved = true;
    } else if (isOnWalkableGround(newX, state.z)) {
      state.x = newX; moved = true;
    } else if (isOnWalkableGround(state.x, newZ)) {
      state.z = newZ; moved = true;
    }
    if (moved) {
      const ta = Math.atan2(mx, mz);
      let d = ta - refs.player.rotation.y;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      refs.player.rotation.y += d * 10 * dt;
      state.walkCycle += dt * 12;
      refs.parts.legL.rotation.x = Math.sin(state.walkCycle) * 0.5;
      refs.parts.legR.rotation.x = -Math.sin(state.walkCycle) * 0.5;
      refs.parts.armL.rotation.x = -Math.sin(state.walkCycle) * 0.5;
      refs.parts.armR.rotation.x = Math.sin(state.walkCycle) * 0.5;
      state.stepTimer += dt;
      if (state.stepTimer > 0.35) { state.stepTimer = 0; Sounds.step(); }
    }
    refs.player.position.y = 0;
  } else {
    refs.parts.legL.rotation.x *= 0.85;
    refs.parts.legR.rotation.x *= 0.85;
    refs.parts.armL.rotation.x *= 0.85;
    refs.parts.armR.rotation.x *= 0.85;
    state.stepTimer = 0.35;
    refs.player.position.y = 0;
  }

  refs.player.position.x = state.x;
  refs.player.position.z = state.z;

  if (refs.parts.petGroup && !state.inHouse) {
    const petTarget = new THREE.Vector3(state.x + 1.3, 0, state.z - 0.8);
    refs.parts.petGroup.position.lerp(petTarget, 3 * dt);
    refs.parts.petGroup.lookAt(state.x, 0, state.z);
  } else if (refs.parts.petGroup) {
    refs.parts.petGroup.position.set(state.x + 1, 0, state.z - 0.5);
  }

  if (!state.inHouse) {
    let nh = null, mh = 5;
    session.houses.forEach(h => {
      const d = Math.hypot(state.x - h.x, state.z - h.z);
      if (d < mh) { mh = d; nh = h; }
    });
    state.nearHouse = nh;

    const distHome = Math.hypot(state.x - 8, state.z - 8);
    state.nearHome = distHome < 5;

    let nn = null, mn = 3.5;
    session.npcs.forEach(n => {
      const d = Math.hypot(state.x - n.x, state.z - n.z);
      if (d < mn) { mn = d; nn = n; }
    });
    state.nearNPC = nn;

    state.nearBoss = Math.hypot(state.x - (70 + 15), state.z - (-15)) < 7;

    document.getElementById('btn-enter').disabled = !nh && !state.nearHome;
    document.getElementById('btn-talk').disabled = !nn;
    document.getElementById('btn-boss').disabled = !state.nearBoss || !isBossUnlocked();
    document.getElementById('btn-home').disabled = !state.nearHome;

    const hintEl = document.getElementById('hint');
    if (state.nearHome) {
      hintEl.innerHTML = 'MI CASA - Pulsa ESPACIO para entrar';
      hintEl.style.opacity = '1';
    } else if (state.nearBoss) {
      hintEl.innerHTML = isBossUnlocked() ? 'Cueva del Jefe! Pulsa DESAFIAR' : 'Cueva: 40 estrellas (tienes ' + session.totalStars + ')';
      hintEl.style.opacity = '1';
    } else if (nh) {
      const z = { pueblo: 'Pueblo', bosque: 'Bosque', montana: 'Montana' }[nh.zone];
      const unlocked = nh.zone === 'pueblo' || (nh.zone === 'bosque' && session.totalStars >= 10) || (nh.zone === 'montana' && session.totalStars >= 30);
      hintEl.innerHTML = unlocked ? nh.topic.name + ' - ESPACIO' : z + ': ' + (nh.zone === 'bosque' ? '10' : '30') + ' estrellas';
      hintEl.style.opacity = '1';
    } else if (nn) {
      hintEl.innerHTML = nn.name + ' - Pulsa Q';
      hintEl.style.opacity = '1';
    } else {
      hintEl.innerHTML = 'WASD/flechas - Cruza los puentes!';
      hintEl.style.opacity = '0.9';
    }
  } else {
    document.getElementById('hint').innerHTML = 'Explora la casa! Pulsa SALIR DE CASA para volver.';
  }

  if (state.celebrating <= 0) {
    tempCamPos.set(state.x + 8, 12, state.z + 12);
    refs.camera.position.lerp(tempCamPos, 5 * dt);
  } else {
    const ca = el * 1.5;
    tempCamPos.set(state.x + Math.cos(ca) * 10, 8, state.z + Math.sin(ca) * 10);
    refs.camera.position.lerp(tempCamPos, 5 * dt);
  }
  tempLookAt.set(state.x, 1.5, state.z);
  refs.camera.lookAt(tempLookAt);

  refs.renderer.render(refs.scene, refs.camera);
  frames++;
  if (frames === 30) log('MANGA OK');
}

// ============================================================
// ARRANQUE
// ============================================================
bindUI();
renderProfilesScreen();