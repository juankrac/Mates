// ============================================================
// ESCENA 3D: inicializacion y constructores de objetos
// ============================================================

import * as THREE from 'three';
import {
  ZONES,
  TOPICS_BASE,
  BOSS_POS,
  HOME_POS,
  refs,
  session,
  state,
  getWorldPosition
} from './config.js';

// ============================================================
// GRADIENT MAP + MATERIALES TOON + OUTLINES
// ============================================================

let TOON_GRADIENT = null;

export function initToon() {
  const steps = 4;
  const data = new Uint8Array(steps);
  for (let i = 0; i < steps; i++) {
    data[i] = Math.round((i / (steps - 1)) * 255);
  }
  const tex = new THREE.DataTexture(data, steps, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  TOON_GRADIENT = tex;
}

export function toonMat(color) {
  return new THREE.MeshToonMaterial({
    color: color,
    gradientMap: TOON_GRADIENT
  });
}

const OUTLINE_MAT = new THREE.MeshBasicMaterial({
  color: 0x1a1a1a,
  side: THREE.BackSide
});

export function addOutline(mesh, thickness = 1.05) {
  try {
    if (!mesh || !mesh.geometry || !mesh.material || !mesh.parent) return null;
    const outline = new THREE.Mesh(mesh.geometry, OUTLINE_MAT);
    outline.position.copy(mesh.position);
    outline.rotation.copy(mesh.rotation);
    outline.scale.copy(mesh.scale).multiplyScalar(thickness);
    mesh.parent.add(outline);
    return outline;
  } catch (e) {
    return null;
  }
}

// ============================================================
// CONSTRUCTORES DE OBJETOS DEL MUNDO
// ============================================================

export function createTree(x, z, scale = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.35, 1.4, 8),
    toonMat(0xa86b3b)
  );
  trunk.position.y = 0.7;
  trunk.castShadow = true;
  g.add(trunk);
  addOutline(trunk, 1.15);

  for (let i = 0; i < 3; i++) {
    const l = new THREE.Mesh(
      new THREE.ConeGeometry(1.3 - i * 0.3, 1.6 - i * 0.3, 8),
      toonMat(0x7ed87e)
    );
    l.position.y = 1.9 + i * 0.75;
    l.castShadow = true;
    g.add(l);
    addOutline(l, 1.12);
  }

  g.position.set(x, 0, z);
  g.rotation.y = Math.random() * Math.PI * 2;
  g.scale.set(scale, scale, scale);
  return g;
}

export function createLamppost(x, z) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 4, 8),
    toonMat(0x4a4a4a)
  );
  pole.position.y = 2;
  pole.castShadow = true;
  g.add(pole);
  addOutline(pole, 1.15);

  const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    toonMat(0xffe066)
  );
  lamp.position.y = 4.2;
  g.add(lamp);
  addOutline(lamp, 1.15);

  g.position.set(x, 0, z);
  return g;
}

export function createBridge(x1, z1, x2, z2) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  const angle = Math.atan2(dx, dz);

  const g = new THREE.Group();

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.3, len),
    toonMat(0xd9a066)
  );
  deck.position.set(0, 0.15, len / 2);
  deck.receiveShadow = true;
  g.add(deck);
  addOutline(deck, 1.06);

  const numPosts = Math.floor(len / 3);
  for (let i = 0; i <= numPosts; i++) {
    const pz = (i / numPosts) * len;
    const postL = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1.1, 0.15),
      toonMat(0x8b5a2b)
    );
    postL.position.set(-1.4, 0.65, pz);
    g.add(postL);
    addOutline(postL, 1.15);

    const postR = postL.clone();
    postR.position.x = 1.4;
    g.add(postR);
  }

  const railL = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, len),
    toonMat(0x8b5a2b)
  );
  railL.position.set(-1.4, 1.2, len / 2);
  g.add(railL);

  const railR = railL.clone();
  railR.position.x = 1.4;
  g.add(railR);

  g.position.set(x1, 0, z1);
  g.rotation.y = angle;
  return g;
}

export function createHouse(topic) {
  const wp = getWorldPosition(topic);
  const g = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    toonMat(0xfff5e0)
  );
  base.position.y = 1.5;
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);
  addOutline(base, 1.05);

  const roofMat = toonMat(topic.color);
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.3, 2.2, 4),
    roofMat
  );
  roof.position.y = 4.1;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  g.add(roof);
  addOutline(roof, 1.06);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.8, 0.1),
    toonMat(0x8b5a2b)
  );
  door.position.set(0, 0.9, 2.01);
  g.add(door);

  const w1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.9, 0.1),
    toonMat(0x9be0ff)
  );
  w1.position.set(-1.2, 1.7, 2.01);
  g.add(w1);
  const w2 = w1.clone();
  w2.position.x = 1.2;
  g.add(w2);

  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 256;
  const ctx = cv.getContext('2d');
  ctx.beginPath();
  ctx.arc(128, 128, 110, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.fill();
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 12;
  ctx.stroke();
  ctx.font = 'bold 160px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1a1a1a';
  ctx.fillText(topic.icon, 128, 140);
  const tex = new THREE.CanvasTexture(cv);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  sprite.scale.set(2.2, 2.2, 2.2);
  sprite.position.y = 6.2;
  g.add(sprite);

  const lc = document.createElement('canvas');
  lc.width = 512;
  lc.height = 96;
  const lctx = lc.getContext('2d');
  lctx.fillStyle = 'rgba(254, 247, 224, 0.95)';
  lctx.strokeStyle = '#1a1a1a';
  lctx.lineWidth = 8;
  lctx.beginPath();
  if (lctx.roundRect) {
    lctx.roundRect(4, 4, 504, 88, 30);
  } else {
    lctx.rect(4, 4, 504, 88);
  }
  lctx.fill();
  lctx.stroke();
  lctx.fillStyle = '#1a1a1a';
  lctx.font = 'bold 38px Arial';
  lctx.textAlign = 'center';
  lctx.textBaseline = 'middle';
  const name = topic.name.length > 20 ? topic.name.slice(0, 18) + '...' : topic.name;
  lctx.fillText(name, 256, 50);
  const ltex = new THREE.CanvasTexture(lc);
  const lsprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ltex, depthTest: false }));
  lsprite.scale.set(5, 0.95, 1);
  lsprite.position.y = 7.4;
  g.add(lsprite);

  g.position.set(wp.x, 0, wp.z);
  g.rotation.y = Math.atan2(-wp.x, -wp.z);
  refs.scene.add(g);

  session.houses.push({
    topic: topic,
    mesh: g,
    x: wp.x,
    z: wp.z,
    zone: topic.zone,
    roofMat: roofMat
  });

  if (topic.stars >= topic.maxStars) {
    roofMat.color.setHex(0xffd700);
  }
}

export function createHome() {
  const g = new THREE.Group();

  const hb = new THREE.Mesh(
    new THREE.BoxGeometry(5, 3.5, 5),
    toonMat(0xffd1e8)
  );
  hb.position.y = 1.75;
  hb.castShadow = true;
  hb.receiveShadow = true;
  g.add(hb);
  addOutline(hb, 1.05);

  const hr = new THREE.Mesh(
    new THREE.ConeGeometry(4, 2.8, 4),
    toonMat(0xff9ff3)
  );
  hr.position.y = 4.9;
  hr.rotation.y = Math.PI / 4;
  hr.castShadow = true;
  g.add(hr);
  addOutline(hr, 1.06);

  const hd = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 2.1, 0.1),
    toonMat(0x8b5a2b)
  );
  hd.position.set(0, 1.05, 2.51);
  g.add(hd);

  const hw = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 0.1),
    toonMat(0xfff5b0)
  );
  hw.position.set(-1.5, 2, 2.51);
  g.add(hw);

  const hw2 = hw.clone();
  hw2.position.x = 1.5;
  g.add(hw2);

  const lc = document.createElement('canvas');
  lc.width = 512;
  lc.height = 96;
  const lctx = lc.getContext('2d');
  lctx.fillStyle = 'rgba(255, 209, 232, 0.95)';
  lctx.strokeStyle = '#1a1a1a';
  lctx.lineWidth = 8;
  lctx.beginPath();
  if (lctx.roundRect) {
    lctx.roundRect(4, 4, 504, 88, 30);
  } else {
    lctx.rect(4, 4, 504, 88);
  }
  lctx.fill();
  lctx.stroke();
  lctx.fillStyle = '#1a1a1a';
  lctx.font = 'bold 42px Arial';
  lctx.textAlign = 'center';
  lctx.textBaseline = 'middle';
  lctx.fillText('MI CASA', 256, 50);
  const ltex = new THREE.CanvasTexture(lc);
  const lsprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ltex, depthTest: false }));
  lsprite.scale.set(5, 0.95, 1);
  lsprite.position.y = 7.8;
  g.add(lsprite);

  g.position.set(HOME_POS.x, 0, HOME_POS.z);
  g.rotation.y = Math.atan2(-HOME_POS.x, -HOME_POS.z);
  refs.scene.add(g);
  refs.homeGroup = g;
}

export function createNPC(x, z, color, name, hints) {
  const g = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 0.7, 4, 12),
    toonMat(color)
  );
  body.position.y = 1;
  body.castShadow = true;
  g.add(body);
  addOutline(body, 1.08);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 12),
    toonMat(0xffe0b2)
  );
  head.position.y = 2;
  head.castShadow = true;
  g.add(head);
  addOutline(head, 1.08);

  const hatMat = toonMat(0x4a2c17);
  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(0.7, 0.6, 8),
    hatMat
  );
  hat.position.y = 2.55;
  g.add(hat);

  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 0.05, 12),
    hatMat
  );
  brim.position.y = 2.3;
  g.add(brim);

  const em = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), em);
  e1.position.set(-0.18, 2.05, 0.48);
  g.add(e1);
  const e2 = e1.clone();
  e2.position.x = 0.18;
  g.add(e2);

  g.position.set(x, 0, z);
  g.rotation.y = Math.random() * Math.PI * 2;
  refs.scene.add(g);

  session.npcs.push({
    mesh: g,
    x: x,
    z: z,
    name: name,
    hints: hints,
    hintIndex: 0
  });
}

export function createBossLair() {
  const g = new THREE.Group();

  const big = new THREE.Mesh(
    new THREE.DodecahedronGeometry(5),
    toonMat(0x6a5a5a)
  );
  big.position.y = 3;
  big.castShadow = true;
  g.add(big);
  addOutline(big, 1.04);

  const ent = new THREE.Mesh(
    new THREE.CircleGeometry(1.6, 16),
    new THREE.MeshBasicMaterial({ color: 0x0a0a0a, side: THREE.DoubleSide })
  );
  ent.position.set(0, 1.8, 4.5);
  g.add(ent);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), eyeMat);
  e1.position.set(-0.5, 2, 4.6);
  g.add(e1);
  const e2 = e1.clone();
  e2.position.x = 0.5;
  g.add(e2);

  g.position.set(BOSS_POS.x, 0, BOSS_POS.z);
  g.rotation.y = Math.PI;
  refs.scene.add(g);
}

// ============================================================
// INICIALIZAR LA ESCENA DEL MUNDO EXTERIOR
// ============================================================
export function initScene() {
  const container = document.getElementById('canvas-container');

  refs.scene = new THREE.Scene();

  const SKY_COLOR = new THREE.Color(0x87ceeb);
  refs.scene.background = SKY_COLOR.clone();
  refs.scene.fog = new THREE.Fog(0x87ceeb, 100, 260);

  refs.camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );

  refs.renderer = new THREE.WebGLRenderer({ antialias: true });
  refs.renderer.setSize(window.innerWidth, window.innerHeight);
  refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  refs.renderer.shadowMap.enabled = true;
  refs.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  refs.renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(refs.renderer.domElement);

  refs.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  refs.scene.add(new THREE.HemisphereLight(0xc8e8ff, 0x7aa87a, 0.7));

  const sun = new THREE.DirectionalLight(0xfff2c0, 1.1);
  sun.position.set(40, 60, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.bottom = -100;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 250;
  refs.scene.add(sun);

  // Plano azul de fondo
  const waterPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshBasicMaterial({ color: 0x6cb8e6 })
  );
  waterPlane.rotation.x = -Math.PI / 2;
  waterPlane.position.y = -0.5;
  refs.scene.add(waterPlane);

  // Suelos de las 3 zonas
  Object.keys(ZONES).forEach(id => {
    const zone = ZONES[id];
    const color = id === 'bosque' ? 0xb8f0b8 : (id === 'montana' ? 0xe0c8a8 : 0xc8f0c0);

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      new THREE.MeshBasicMaterial({ color: color })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(zone.offset.x, 0, zone.offset.z);
    refs.scene.add(mesh);

    const edge = new THREE.Mesh(
      new THREE.RingGeometry(29.7, 30.3, 64),
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.DoubleSide })
    );
    edge.rotation.x = -Math.PI / 2;
    edge.position.set(zone.offset.x, 0.05, zone.offset.z);
    refs.scene.add(edge);
  });

  const pathMesh = new THREE.Mesh(
    new THREE.RingGeometry(18, 21, 64),
    new THREE.MeshBasicMaterial({ color: 0xf0d8b8 })
  );
  pathMesh.rotation.x = -Math.PI / 2;
  pathMesh.position.y = 0.02;
  refs.scene.add(pathMesh);

  const fountain = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2.2, 0.6, 24),
    toonMat(0xd0d0d0)
  );
  fountain.position.y = 0.3;
  fountain.castShadow = true;
  refs.scene.add(fountain);
  addOutline(fountain, 1.06);

  const fountainTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16),
    toonMat(0xb0b0b0)
  );
  fountainTop.position.y = 1.35;
  refs.scene.add(fountainTop);
  addOutline(fountainTop, 1.1);

  refs.waterBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 12),
    toonMat(0x9be0ff)
  );
  refs.waterBall.position.y = 2.2;
  refs.scene.add(refs.waterBall);
  addOutline(refs.waterBall, 1.08);

  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r = 26 + Math.random() * 2;
    refs.scene.add(createTree(Math.cos(a) * r, Math.sin(a) * r, 0.9 + Math.random() * 0.3));
  }

  for (let i = 0; i < 30; i++) {
    const bx = ZONES.bosque.offset.x + (Math.random() - 0.5) * 50;
    const bz = ZONES.bosque.offset.z + (Math.random() - 0.5) * 50;
    if (Math.hypot(bx - ZONES.bosque.offset.x, bz - ZONES.bosque.offset.z) < 12) continue;
    refs.scene.add(createTree(bx, bz, 0.9 + Math.random() * 0.4));
  }

  for (let i = 0; i < 20; i++) {
    const mx = ZONES.montana.offset.x + (Math.random() - 0.5) * 50;
    const mz = ZONES.montana.offset.z + (Math.random() - 0.5) * 50;
    if (Math.hypot(mx - ZONES.montana.offset.x, mz - ZONES.montana.offset.z) < 14) continue;

    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.7 + Math.random() * 0.4),
      toonMat(0xb0b0b0)
    );
    rock.position.set(mx, 0.5, mz);
    rock.castShadow = true;
    refs.scene.add(rock);
    addOutline(rock, 1.15);
  }

  const flowerColors = [0xff9ff3, 0xffd93d, 0xff8fa3, 0xffffff, 0xc89bff, 0xffb347];
  for (let i = 0; i < 100; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 24 + Math.random() * 14;
    const g = new THREE.Group();

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.5, 5),
      toonMat(0x7ed87e)
    );
    stem.position.y = 0.25;
    g.add(stem);

    const c = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    const petals = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 6),
      toonMat(c)
    );
    petals.position.y = 0.55;
    petals.scale.y = 0.6;
    g.add(petals);

    g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    refs.scene.add(g);
  }

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    refs.scene.add(createLamppost(Math.cos(a) * 19.5, Math.sin(a) * 19.5));
  }

  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const deg = (i / 60) * 360;

    const nearHouse = TOPICS_BASE.filter(t => t.zone === 'pueblo').some(t => {
      const ta = (Math.atan2(t.position.z, t.position.x) * 180 / Math.PI + 360) % 360;
      let d = Math.abs(deg - ta);
      if (d > 180) d = 360 - d;
      return d < 18;
    });
    if (nearHouse) continue;

    const r = 23;
    const fence = new THREE.Group();
    const p = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1, 0.15),
      toonMat(0xc9a77a)
    );
    p.position.y = 0.5;
    p.castShadow = true;
    fence.add(p);

    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.1, 1),
      toonMat(0xc9a77a)
    );
    bar.position.set(0, 0.7, -0.45);
    fence.add(bar);

    fence.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    fence.rotation.y = -a + Math.PI / 2;
    refs.scene.add(fence);
  }

  refs.scene.add(createBridge(0, -26, 0, -44));
  refs.scene.add(createBridge(26, 0, 44, 0));

  refs.camera.position.set(8, 12, 17);
  refs.camera.lookAt(0, 1.5, 5);
}

export function updateAllHousesForProfile() {
  session.houses.forEach(h => {
    refs.scene.remove(h.mesh);
  });
  session.houses = [];
  session.topics.forEach(createHouse);
}

// ============================================================
// ESCENA DE LA CASA (SEPARADA DEL MUNDO)
// ============================================================
export function initHouseScene() {
  if (refs.houseScene) return;

  // Nueva escena, camara y luces SOLO para el interior
  refs.houseScene = new THREE.Scene();
  refs.houseScene.background = new THREE.Color(0xfff0d8);
  refs.houseScene.fog = null; // sin niebla

  refs.houseCamera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );

  // Luces del interior
  refs.houseScene.add(new THREE.AmbientLight(0xffffff, 0.9));
  refs.houseScene.add(new THREE.HemisphereLight(0xfff5e0, 0xc8b090, 0.7));

  const light1 = new THREE.PointLight(0xffffff, 1.5, 40, 1);
  light1.position.set(0, 4.5, 0);
  refs.houseScene.add(light1);

  const light2 = new THREE.PointLight(0xfff0d0, 0.8, 30, 1);
  light2.position.set(-6, 3, -6);
  refs.houseScene.add(light2);

  const light3 = new THREE.PointLight(0xfff0d0, 0.8, 30, 1);
  light3.position.set(6, 3, -6);
  refs.houseScene.add(light3);

  // El grupo del interior se añade a esta escena
  refs.houseInterior = new THREE.Group();
  refs.houseScene.add(refs.houseInterior);

  console.log('[scene] Escena de la casa creada');
}