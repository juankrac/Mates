// ============================================================
// VESTIDOR CON VISTA PREVIA
// ============================================================

import * as THREE from 'three';
import { session, refs, SKIN_COLORS, HAIR_COLORS, EYE_COLORS, OUTFIT_COLORS, UNLOCKS, isUnlocked, defaultAppearance, log } from './config.js';
import { toonMat, addOutline } from './scene.js';
import { applyAppearance } from './player.js';
import { Sounds } from './audio.js';
import { saveProfileState } from './storage.js';

export function initPreviewScene() {
  if (refs.previewRenderer) return;
  const canvas = document.getElementById('customize-preview-canvas');
  const w = canvas.clientWidth || 320;
  const h = canvas.clientHeight || 400;
  refs.previewRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  refs.previewRenderer.setSize(w, h, false);
  refs.previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  refs.previewRenderer.setClearColor(0xffe0ee, 1);
  refs.previewRenderer.outputColorSpace = THREE.SRGBColorSpace;

  refs.previewScene = new THREE.Scene();
  refs.previewScene.background = new THREE.Color(0xffe0ee);

  refs.previewCamera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
  refs.previewCamera.position.set(0, 2.2, 6);
  refs.previewCamera.lookAt(0, 1.6, 0);

  refs.previewScene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const l1 = new THREE.DirectionalLight(0xffffff, 1.2);
  l1.position.set(3, 8, 5);
  refs.previewScene.add(l1);
  const l2 = new THREE.DirectionalLight(0xffd0e0, 0.5);
  l2.position.set(-3, 4, -3);
  refs.previewScene.add(l2);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(3, 32), toonMat(0xf0d8b8));
  floor.rotation.x = -Math.PI / 2;
  refs.previewScene.add(floor);

  refs.previewCharacter = new THREE.Group();
  refs.previewScene.add(refs.previewCharacter);
  buildPreviewCharacter();
}

export function buildPreviewCharacter() {
  if (!refs.previewCharacter) return;
  while (refs.previewCharacter.children.length > 0) {
    const c = refs.previewCharacter.children[0];
    refs.previewCharacter.remove(c);
    if (c.geometry) c.geometry.dispose();
    if (c.material) c.material.dispose();
  }
  const appearance = session.appearance;
  if (!appearance) return;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), toonMat(appearance.skinColor));
  head.position.y = 2; head.castShadow = true;
  refs.previewCharacter.add(head); addOutline(head, 1.08);

  const bodyColor = appearance.outfitColor === '0xrainbow' ? 0xff6b6b : (parseInt(appearance.outfitColor, 16) || 0x3d5a99);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 0.7, 4, 12), toonMat(bodyColor));
  body.position.y = 1; body.castShadow = true;
  refs.previewCharacter.add(body); addOutline(body, 1.06);

  const armMat = toonMat(appearance.skinColor);
  const aL = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.5, 3, 8), armMat);
  aL.position.set(-0.65, 1.05, 0); refs.previewCharacter.add(aL); addOutline(aL, 1.15);
  const aR = aL.clone(); aR.position.x = 0.65;
  refs.previewCharacter.add(aR); addOutline(aR, 1.15);

  const legMat = toonMat(bodyColor);
  const lL = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.5, 3, 8), legMat);
  lL.position.set(-0.22, 0.3, 0); refs.previewCharacter.add(lL); addOutline(lL, 1.15);
  const lR = lL.clone(); lR.position.x = 0.22;
  refs.previewCharacter.add(lR); addOutline(lR, 1.15);

  // Pelo
  const hm = toonMat(appearance.hairColor);
  const s = appearance.hairStyle;
  if (s === 'short') {
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hm);
    h.position.y = 2.18;
    refs.previewCharacter.add(h); addOutline(h, 1.12);
  } else if (s === 'long') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), hm);
    cap.position.y = 2.15;
    refs.previewCharacter.add(cap); addOutline(cap, 1.1);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.4), hm);
    back.position.set(0, 1.55, -0.4);
    refs.previewCharacter.add(back);
  } else if (s === 'ponytails') {
    const cap2 = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), hm);
    cap2.position.y = 2.18;
    refs.previewCharacter.add(cap2); addOutline(cap2, 1.1);
    const tL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), hm);
    tL.position.set(-0.65, 2.15, -0.1);
    refs.previewCharacter.add(tL); addOutline(tL, 1.15);
    const tR = tL.clone(); tR.position.x = 0.65;
    refs.previewCharacter.add(tR); addOutline(tR, 1.15);
  } else if (s === 'curly') {
    const cap3 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65), hm);
    cap3.position.y = 2.18;
    refs.previewCharacter.add(cap3); addOutline(cap3, 1.1);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const cc = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), hm);
      cc.position.set(Math.cos(a) * 0.55, 2.15, Math.sin(a) * 0.55);
      refs.previewCharacter.add(cc);
    }
  }

  // Ojos
  const em = new THREE.MeshBasicMaterial({ color: appearance.eyeColor });
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), em);
  eL.position.set(-0.18, 2.05, 0.48); refs.previewCharacter.add(eL);
  const eR = eL.clone(); eR.position.x = 0.18; refs.previewCharacter.add(eR);
  if (appearance.eyeStyle === 'happy') {
    eL.scale.y = 0.5; eR.scale.y = 0.5;
  } else if (appearance.eyeStyle === 'sleepy') {
    eL.scale.y = 0.25; eR.scale.y = 0.25;
  }

  // Cara
  if (appearance.face === 'smile' || appearance.face === 'all' || appearance.face === 'freckles' || appearance.face === 'blush') {
    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.13, 0.025, 6, 12, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0x8b3a1f })
    );
    smile.position.set(0, 1.85, 0.5);
    smile.rotation.x = Math.PI; smile.rotation.z = Math.PI;
    refs.previewCharacter.add(smile);
  }
}

export function animatePreview() {
  if (!refs.previewRenderer) return;
  requestAnimationFrame(animatePreview);
  if (refs.previewCharacter) refs.previewCharacter.rotation.y += 0.01;
  refs.previewRenderer.render(refs.previewScene, refs.previewCamera);
}

export function buildOptions() {
  const appearance = session.appearance;
  const totalStars = session.totalStars;

  const so = document.getElementById('skin-options');
  so.innerHTML = '';
  SKIN_COLORS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'color-swatch' + (appearance.skinColor === c ? ' selected' : '');
    b.style.background = '#' + c.toString(16).padStart(6, '0');
    b.onclick = () => { appearance.skinColor = c; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    so.appendChild(b);
  });

  const hso = document.getElementById('hair-style-options');
  hso.innerHTML = '';
  [['short', 'Corto'], ['long', 'Largo'], ['ponytails', 'Coletas'], ['curly', 'Rizado']].forEach(pair => {
    const b = document.createElement('button');
    b.className = (appearance.hairStyle === pair[0] ? 'selected' : '');
    b.textContent = pair[1];
    b.onclick = () => { appearance.hairStyle = pair[0]; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    hso.appendChild(b);
  });

  const hco = document.getElementById('hair-color-options');
  hco.innerHTML = '';
  HAIR_COLORS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'color-swatch' + (appearance.hairColor === c ? ' selected' : '');
    b.style.background = '#' + c.toString(16).padStart(6, '0');
    b.onclick = () => { appearance.hairColor = c; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    hco.appendChild(b);
  });

  const eso = document.getElementById('eye-style-options');
  eso.innerHTML = '';
  [['round', 'Redondos'], ['happy', 'Felices'], ['sparkle', 'Brillantes'], ['sleepy', 'Dormilones']].forEach(pair => {
    const b = document.createElement('button');
    b.className = (appearance.eyeStyle === pair[0] ? 'selected' : '');
    b.textContent = pair[1];
    b.onclick = () => { appearance.eyeStyle = pair[0]; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    eso.appendChild(b);
  });

  const eco = document.getElementById('eye-color-options');
  eco.innerHTML = '';
  EYE_COLORS.forEach(c => {
    const b = document.createElement('button');
    b.className = 'color-swatch' + (appearance.eyeColor === c ? ' selected' : '');
    b.style.background = '#' + c.toString(16).padStart(6, '0');
    b.onclick = () => { appearance.eyeColor = c; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    eco.appendChild(b);
  });

  const fo = document.getElementById('face-options');
  fo.innerHTML = '';
  [['smile', 'Sonrisa'], ['freckles', 'Pecas'], ['blush', 'Mofletes'], ['all', 'Todo']].forEach(pair => {
    const b = document.createElement('button');
    b.className = (appearance.face === pair[0] ? 'selected' : '');
    b.textContent = pair[1];
    b.onclick = () => { appearance.face = pair[0]; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    fo.appendChild(b);
  });

  const oso = document.getElementById('outfit-style-options');
  oso.innerHTML = '';
  [['dress', 'Vestido'], ['tshirt', 'Camiseta'], ['uniform', 'Uniforme'], ['overalls', 'Peto']].forEach(pair => {
    const unlocked = isUnlocked('outfits', pair[0]);
    const b = document.createElement('button');
    b.className = (appearance.outfitStyle === pair[0] ? 'selected' : '') + (unlocked ? '' : ' locked');
    b.textContent = pair[1] + (unlocked ? '' : ' (' + UNLOCKS.outfits[pair[0]] + ')');
    b.onclick = () => { if (!unlocked) return; appearance.outfitStyle = pair[0]; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    oso.appendChild(b);
  });

  const oco = document.getElementById('outfit-color-options');
  oco.innerHTML = '';
  OUTFIT_COLORS.forEach(c => {
    const unlocked = c === '0xrainbow' ? totalStars >= 70 : isUnlocked('outfitColors', c);
    const b = document.createElement('button');
    let cls = 'color-swatch';
    if (String(appearance.outfitColor) === c) cls += ' selected';
    if (!unlocked) cls += ' locked';
    if (c === '0xffd700') cls += ' golden';
    if (c === '0xrainbow') cls += ' rainbow';
    b.className = cls;
    if (c !== '0xffd700' && c !== '0xrainbow') {
      b.style.background = '#' + parseInt(c, 16).toString(16).padStart(6, '0');
    }
    b.onclick = () => { if (!unlocked) return; appearance.outfitColor = c; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    oco.appendChild(b);
  });
  document.getElementById('outfit-lock-info').textContent = totalStars + ' estrellas';

  const ao = document.getElementById('accessory-options');
  ao.innerHTML = '';
  [['none', 'Ninguno'], ['cap', 'Gorra'], ['glasses', 'Gafas'], ['backpack', 'Mochila'], ['all', 'Todo']].forEach(pair => {
    const unlocked = isUnlocked('accessories', pair[0]);
    const b = document.createElement('button');
    b.className = (appearance.accessory === pair[0] ? 'selected' : '') + (unlocked ? '' : ' locked');
    b.textContent = pair[1] + (unlocked ? '' : ' (' + UNLOCKS.accessories[pair[0]] + ')');
    b.onclick = () => { if (!unlocked) return; appearance.accessory = pair[0]; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    ao.appendChild(b);
  });

  const po = document.getElementById('pet-options');
  po.innerHTML = '';
  [['none', 'Ninguna'], ['cat', 'Gato'], ['dog', 'Perro'], ['bird', 'Pajaro']].forEach(pair => {
    const unlocked = isUnlocked('pets', pair[0]);
    const b = document.createElement('button');
    b.className = (appearance.pet === pair[0] ? 'selected' : '') + (unlocked ? '' : ' locked');
    b.textContent = pair[1] + (unlocked ? '' : ' (' + UNLOCKS.pets[pair[0]] + ')');
    b.onclick = () => { if (!unlocked) return; appearance.pet = pair[0]; applyAppearance(); buildOptions(); updatePreview(); Sounds.change(); };
    po.appendChild(b);
  });
}

export function updatePreview() {
  buildPreviewCharacter();
}

export function openCustomize() {
  session.customizing = true;
  session.keys = {};
  buildOptions();
  document.getElementById('customize-modal').classList.add('show');
  initPreviewScene();
  if (!refs.previewRenderer._animating) {
    refs.previewRenderer._animating = true;
    animatePreview();
  }
}

export function closeCustomize() {
  session.customizing = false;
  document.getElementById('customize-modal').classList.remove('show');
  saveProfileState();
}