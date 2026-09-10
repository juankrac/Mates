// ============================================================
// PERSONAJE 3D
// ============================================================

import * as THREE from 'three';
import { refs, session } from './config.js';
import { toonMat, addOutline } from './scene.js';

export function createPlayer() {
  refs.player = new THREE.Group();
  refs.scene.add(refs.player);
  const parts = refs.parts;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 12), toonMat(0xffe0b2));
  head.position.y = 2; head.castShadow = true;
  refs.player.add(head); addOutline(head, 1.08);
  parts.head = head;

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.2, 8), toonMat(0xffe0b2));
  neck.position.y = 1.55; refs.player.add(neck); addOutline(neck, 1.15);
  parts.neck = neck;

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 0.7, 4, 12), toonMat(0x3d5a99));
  body.position.y = 1; body.castShadow = true;
  refs.player.add(body); addOutline(body, 1.06);
  parts.body = body;

  parts.hairGroup = new THREE.Group();
  refs.player.add(parts.hairGroup);

  const em = new THREE.MeshBasicMaterial({ color: 0x222222 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), em);
  eyeL.position.set(-0.18, 2.05, 0.48); refs.player.add(eyeL);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.18; refs.player.add(eyeR);
  parts.eyeL = eyeL; parts.eyeR = eyeR;

  const pm = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pm);
  pupilL.position.set(-0.18, 2.08, 0.55); refs.player.add(pupilL);
  const pupilR = pupilL.clone(); pupilR.position.x = 0.18; refs.player.add(pupilR);
  parts.pupilL = pupilL; parts.pupilR = pupilR;

  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.025, 6, 12, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0x8b3a1f })
  );
  smile.position.set(0, 1.85, 0.5);
  smile.rotation.x = Math.PI; smile.rotation.z = Math.PI;
  refs.player.add(smile);
  parts.smile = smile;

  const freckleMat = new THREE.MeshBasicMaterial({ color: 0x8b5a2b });
  parts.freckles = [];
  for (let i = 0; i < 6; i++) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), freckleMat);
    const side = i % 2 === 0 ? -1 : 1;
    const idx = Math.floor(i / 2);
    f.position.set(side * (0.15 + idx * 0.08), 1.98 + (idx % 2) * 0.03, 0.51);
    f.visible = false;
    refs.player.add(f);
    parts.freckles.push(f);
  }

  const blushMat = new THREE.MeshBasicMaterial({ color: 0xff8fa3, transparent: true, opacity: 0.7 });
  const blushL = new THREE.Mesh(new THREE.CircleGeometry(0.09, 12), blushMat);
  blushL.position.set(-0.3, 1.92, 0.51); blushL.visible = false; refs.player.add(blushL);
  const blushR = blushL.clone(); blushR.position.x = 0.3; refs.player.add(blushR);
  parts.blushL = blushL; parts.blushR = blushR;

  const armMat = toonMat(0xffe0b2);
  const armL = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.5, 3, 8), armMat);
  armL.position.set(-0.65, 1.05, 0); armL.castShadow = true;
  refs.player.add(armL); addOutline(armL, 1.15);
  const armR = armL.clone(); armR.position.x = 0.65;
  refs.player.add(armR); addOutline(armR, 1.15);
  parts.armL = armL; parts.armR = armR;

  const legMat = toonMat(0x3d5a99);
  const legL = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.5, 3, 8), legMat);
  legL.position.set(-0.22, 0.3, 0); legL.castShadow = true;
  refs.player.add(legL); addOutline(legL, 1.15);
  const legR = legL.clone(); legR.position.x = 0.22;
  refs.player.add(legR); addOutline(legR, 1.15);
  parts.legL = legL; parts.legR = legR;

  parts.accessoriesGroup = new THREE.Group();
  refs.player.add(parts.accessoriesGroup);

  parts.petGroup = new THREE.Group();
  parts.petGroup.position.set(1.3, 0, -0.5);
  refs.scene.add(parts.petGroup);

  refs.player.position.set(0, 0, 5);
}

export function rebuildHair() {
  const parts = refs.parts;
  const appearance = session.appearance;
  if (!parts.hairGroup || !appearance) return;
  while (parts.hairGroup.children.length > 0) {
    const c = parts.hairGroup.children[0];
    parts.hairGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
    if (c.material) c.material.dispose();
  }
  const hm = toonMat(appearance.hairColor);
  const s = appearance.hairStyle;
  if (s === 'short') {
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI*2, 0, Math.PI*0.55), hm);
    h.position.y = 2.18;
    parts.hairGroup.add(h); addOutline(h, 1.12);
  } else if (s === 'long') {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12, 0, Math.PI*2, 0, Math.PI*0.6), hm);
    cap.position.y = 2.15;
    parts.hairGroup.add(cap); addOutline(cap, 1.1);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.0, 0.4), hm);
    back.position.set(0, 1.55, -0.4);
    parts.hairGroup.add(back);
  } else if (s === 'ponytails') {
    const cap2 = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 12, 0, Math.PI*2, 0, Math.PI*0.6), hm);
    cap2.position.y = 2.18;
    parts.hairGroup.add(cap2); addOutline(cap2, 1.1);
    const tL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), hm);
    tL.position.set(-0.65, 2.15, -0.1);
    parts.hairGroup.add(tL); addOutline(tL, 1.15);
    const tR = tL.clone(); tR.position.x = 0.65;
    parts.hairGroup.add(tR); addOutline(tR, 1.15);
  } else if (s === 'curly') {
    const cap3 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 12, 0, Math.PI*2, 0, Math.PI*0.65), hm);
    cap3.position.y = 2.18;
    parts.hairGroup.add(cap3); addOutline(cap3, 1.1);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const cc = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), hm);
      cc.position.set(Math.cos(a) * 0.55, 2.15, Math.sin(a) * 0.55);
      parts.hairGroup.add(cc);
    }
  }
}

export function rebuildAccessories() {
  const parts = refs.parts;
  const appearance = session.appearance;
  if (!parts.accessoriesGroup || !appearance) return;
  while (parts.accessoriesGroup.children.length > 0) {
    const c = parts.accessoriesGroup.children[0];
    parts.accessoriesGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
    if (c.material) c.material.dispose();
  }
  const a = appearance.accessory;
  if (a === 'cap' || a === 'all') {
    const cm = toonMat(0xff6b6b);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI*2, 0, Math.PI*0.5), cm);
    cap.position.y = 2.35;
    parts.accessoriesGroup.add(cap); addOutline(cap, 1.12);
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.5), cm);
    v.position.set(0, 2.32, 0.45);
    parts.accessoriesGroup.add(v);
  }
  if (a === 'glasses' || a === 'all') {
    const fm = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
    const lm = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 });
    [-0.18, 0.18].forEach(x => {
      const l = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), lm);
      l.position.set(x, 2.05, 0.57);
      parts.accessoriesGroup.add(l);
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 6, 16), fm);
      r.position.set(x, 2.05, 0.58);
      parts.accessoriesGroup.add(r);
    });
  }
  if (a === 'backpack' || a === 'all') {
    const pm = toonMat(0x8b5a2b);
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.35), pm);
    pack.position.set(0, 1.1, -0.6);
    parts.accessoriesGroup.add(pack);
  }
}

export function rebuildPet() {
  const parts = refs.parts;
  const appearance = session.appearance;
  if (!parts.petGroup || !appearance) return;
  while (parts.petGroup.children.length > 0) {
    const c = parts.petGroup.children[0];
    parts.petGroup.remove(c);
    if (c.geometry) c.geometry.dispose();
    if (c.material) c.material.dispose();
  }
  const p = appearance.pet;
  if (p === 'cat') {
    const m = toonMat(0xffa94d);
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), m);
    b.position.y = 0.35; b.castShadow = true;
    parts.petGroup.add(b); addOutline(b, 1.12);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), m);
    h.position.set(0, 0.6, 0.15);
    parts.petGroup.add(h); addOutline(h, 1.15);
  } else if (p === 'dog') {
    const m2 = toonMat(0x8b5a2b);
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 10), m2);
    b2.position.y = 0.35; b2.castShadow = true;
    parts.petGroup.add(b2); addOutline(b2, 1.12);
    const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), m2);
    h2.position.set(0, 0.62, 0.18);
    parts.petGroup.add(h2); addOutline(h2, 1.15);
  } else if (p === 'bird') {
    const m3 = toonMat(0x4ecdc4);
    const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), m3);
    b3.position.y = 0.4; b3.castShadow = true;
    parts.petGroup.add(b3); addOutline(b3, 1.15);
    const h3 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), m3);
    h3.position.set(0, 0.6, 0.1);
    parts.petGroup.add(h3); addOutline(h3, 1.18);
  }
}

export function applyAppearance() {
  const parts = refs.parts;
  const appearance = session.appearance;
  if (!refs.player || !appearance) return;
  parts.head.material.color.setHex(appearance.skinColor);
  parts.neck.material.color.setHex(appearance.skinColor);
  parts.armL.material.color.setHex(appearance.skinColor);
  parts.armR.material.color.setHex(appearance.skinColor);
  rebuildHair();
  parts.eyeL.material.color.setHex(appearance.eyeColor);
  parts.eyeR.material.color.setHex(appearance.eyeColor);
  const es = appearance.eyeStyle;
  parts.eyeL.scale.set(1, 1, 1); parts.eyeR.scale.set(1, 1, 1);
  parts.pupilL.visible = true; parts.pupilR.visible = true;
  if (es === 'happy') {
    parts.eyeL.scale.set(1, 0.5, 1); parts.eyeR.scale.set(1, 0.5, 1);
    parts.pupilL.visible = false; parts.pupilR.visible = false;
  } else if (es === 'sparkle') {
    parts.eyeL.scale.set(1.2, 1.2, 1.2); parts.eyeR.scale.set(1.2, 1.2, 1.2);
  } else if (es === 'sleepy') {
    parts.eyeL.scale.set(1, 0.25, 1); parts.eyeR.scale.set(1, 0.25, 1);
    parts.pupilL.visible = false; parts.pupilR.visible = false;
  }
  const face = appearance.face;
  parts.smile.visible = (face === 'smile' || face === 'all' || face === 'freckles' || face === 'blush');
  parts.freckles.forEach(f => f.visible = (face === 'freckles' || face === 'all'));
  parts.blushL.visible = (face === 'blush' || face === 'all');
  parts.blushR.visible = (face === 'blush' || face === 'all');
  const oc = String(appearance.outfitColor);
  let numColor;
  if (oc === '0xrainbow' || oc === 'rainbow') numColor = 0xff6b6b;
  else {
    numColor = parseInt(oc, 16);
    if (isNaN(numColor)) numColor = 0x3d5a99;
  }
  parts.body.material.color.setHex(numColor);
  parts.legL.material.color.setHex(numColor);
  parts.legR.material.color.setHex(numColor);
  if (oc === '0xrainbow' || oc === 'rainbow') {
    parts.legL.material.color.setHex(0x845ef7);
    parts.legR.material.color.setHex(0x51cf66);
  }
  rebuildAccessories();
  rebuildPet();
}