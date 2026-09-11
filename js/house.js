// ============================================================
// INTERIOR DE LA CASA: salon, cocina, habitacion y bano
// ============================================================

import * as THREE from 'three';
import { refs, session, state } from './config.js';
import { toonMat, addOutline } from './scene.js';

// ============================================================
// CREAR EL INTERIOR DE LA CASA
// ============================================================
export function createHouseInterior() {
  if (refs.houseInterior) return;

  refs.houseInterior = new THREE.Group();
  refs.scene.add(refs.houseInterior);

  // --- Suelo ---
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.2, 20),
    toonMat(0xd9c9a8)
  );
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  refs.houseInterior.add(floor);

  // --- Paredes ---
  function wall(w, h, d, x, y, z) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      toonMat(0xfff0d8)
    );
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    refs.houseInterior.add(m);
    addOutline(m, 1.03);
  }

  wall(20, 5, 0.3, 0, 2.5, -10);   // fondo norte
  wall(20, 5, 0.3, 0, 2.5, 10);    // frente sur
  wall(0.3, 5, 20, -10, 2.5, 0);   // izquierda
  wall(0.3, 5, 20, 10, 2.5, 0);    // derecha

  // --- Puerta de salida ---
  const exitDoor = new THREE.Mesh(
    new THREE.BoxGeometry(2, 3, 0.1),
    toonMat(0x8b5a2b)
  );
  exitDoor.position.set(0, 1.5, 9.85);
  refs.houseInterior.add(exitDoor);

  // --- Tabiques internos ---
  const tab1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 4, 8),
    toonMat(0xffe0c0)
  );
  tab1.position.set(-3, 2, -6);
  tab1.castShadow = true;
  refs.houseInterior.add(tab1);
  addOutline(tab1, 1.05);

  const tab2 = new THREE.Mesh(
    new THREE.BoxGeometry(12, 4, 0.3),
    toonMat(0xffe0c0)
  );
  tab2.position.set(-4, 2, -2);
  tab2.castShadow = true;
  refs.houseInterior.add(tab2);
  addOutline(tab2, 1.05);

  const tab3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 4, 6),
    toonMat(0xffe0c0)
  );
  tab3.position.set(4, 2, -7);
  tab3.castShadow = true;
  refs.houseInterior.add(tab3);
  addOutline(tab3, 1.05);

  const tab4 = new THREE.Mesh(
    new THREE.BoxGeometry(6, 4, 0.3),
    toonMat(0xffe0c0)
  );
  tab4.position.set(7, 2, -4);
  tab4.castShadow = true;
  refs.houseInterior.add(tab4);
  addOutline(tab4, 1.05);

  // ==========================================================
  // MUEBLES DEL SALON
  // ==========================================================

  const sofa = new THREE.Group();

  const sofaBase = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.8, 1.2),
    toonMat(0xff6b6b)
  );
  sofaBase.position.set(0, 0.4, 0);
  sofa.add(sofaBase);
  addOutline(sofaBase, 1.05);

  const sofaBack = new THREE.Mesh(
    new THREE.BoxGeometry(3, 0.8, 0.2),
    toonMat(0xff8b8b)
  );
  sofaBack.position.set(0, 1.2, -0.5);
  sofa.add(sofaBack);
  addOutline(sofaBack, 1.05);

  sofa.position.set(-6, 0, 3);
  refs.houseInterior.add(sofa);
  refs.houseObstacles.push({ x1: -7.6, x2: -4.4, z1: 2.3, z2: 3.7 });

  const table = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.9, 0.15, 16),
    toonMat(0xa86b3b)
  );
  table.position.set(-3, 0.7, 3);
  refs.houseInterior.add(table);
  addOutline(table, 1.05);

  const tableLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.7, 8),
    toonMat(0x8b5a2b)
  );
  tableLeg.position.set(-3, 0.35, 3);
  refs.houseInterior.add(tableLeg);
  addOutline(tableLeg, 1.15);

  refs.houseObstacles.push({ x1: -3.9, x2: -2.1, z1: 2.1, z2: 3.9 });

  const tv = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1.2, 0.15),
    toonMat(0x1a1a1a)
  );
  tv.position.set(-6, 2, -1.7);
  refs.houseInterior.add(tv);
  addOutline(tv, 1.05);
  refs.houseObstacles.push({ x1: -7, x2: -5, z1: -1.9, z2: -1.5 });

  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 32),
    toonMat(0xffd966)
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(-3, 0.02, 3.5);
  refs.houseInterior.add(rug);

  // ==========================================================
  // MUEBLES DE LA COCINA
  // ==========================================================

  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1, 1.2),
    toonMat(0xf0d8b8)
  );
  counter.position.set(7, 0.5, 3);
  counter.castShadow = true;
  refs.houseInterior.add(counter);
  addOutline(counter, 1.04);
  refs.houseObstacles.push({ x1: 4.9, x2: 9.1, z1: 2.3, z2: 3.7 });

  const fridge = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.5, 1),
    toonMat(0xf0f0f0)
  );
  fridge.position.set(8.5, 1.25, 7);
  refs.houseInterior.add(fridge);
  addOutline(fridge, 1.04);
  refs.houseObstacles.push({ x1: 7.9, x2: 9.1, z1: 6.4, z2: 7.6 });

  for (let i = 0; i < 2; i++) {
    const burner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.05, 16),
      toonMat(0x1a1a1a)
    );
    burner.position.set(6 + i * 0.7, 1.02, 3);
    refs.houseInterior.add(burner);
  }

  // ==========================================================
  // MUEBLES DE LA HABITACION
  // ==========================================================

  const bed = new THREE.Group();

  const bedBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.5, 1.8),
    toonMat(0xffffff)
  );
  bedBase.position.y = 0.25;
  bed.add(bedBase);
  addOutline(bedBase, 1.05);

  const mattress = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.3, 1.8),
    toonMat(0xffd1e8)
  );
  mattress.position.y = 0.65;
  bed.add(mattress);

  const pillow = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.2, 0.5),
    toonMat(0xffffff)
  );
  pillow.position.set(-0.7, 0.85, 0);
  bed.add(pillow);

  bed.position.set(-7, 0, -7);
  refs.houseInterior.add(bed);
  refs.houseObstacles.push({ x1: -8.4, x2: -5.6, z1: -8.1, z2: -5.9 });

  const wardrobe = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 3, 1),
    toonMat(0xa86b3b)
  );
  wardrobe.position.set(-5, 1.5, -9);
  refs.houseInterior.add(wardrobe);
  addOutline(wardrobe, 1.04);
  refs.houseObstacles.push({ x1: -5.9, x2: -4.1, z1: -9.6, z2: -8.4 });

  const nightstand = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    toonMat(0xa86b3b)
  );
  nightstand.position.set(-4.5, 0.4, -7);
  refs.houseInterior.add(nightstand);
  addOutline(nightstand, 1.05);
  refs.houseObstacles.push({ x1: -5, x2: -4, z1: -7.5, z2: -6.5 });

  // ==========================================================
  // MUEBLES DEL BANO
  // ==========================================================

  const bathtub = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.8, 1.4),
    toonMat(0xffffff)
  );
  bathtub.position.set(7.5, 0.4, -8);
  refs.houseInterior.add(bathtub);
  addOutline(bathtub, 1.05);
  refs.houseObstacles.push({ x1: 6.1, x2: 8.9, z1: -8.8, z2: -7.2 });

  const sink = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.2, 0.7),
    toonMat(0xffffff)
  );
  sink.position.set(5, 0.9, -5);
  refs.houseInterior.add(sink);
  addOutline(sink, 1.05);

  const sinkPed = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.2, 0.9, 8),
    toonMat(0xffffff)
  );
  sinkPed.position.set(5, 0.45, -5);
  refs.houseInterior.add(sinkPed);

  const mirror = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, 0.1),
    toonMat(0xc8f0ff)
  );
  mirror.position.set(5, 2.2, -5.4);
  refs.houseInterior.add(mirror);
  addOutline(mirror, 1.05);

  const toilet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.4, 0.8, 12),
    toonMat(0xffffff)
  );
  toilet.position.set(8.5, 0.4, -5);
  refs.houseInterior.add(toilet);
  addOutline(toilet, 1.05);
  refs.houseObstacles.push({ x1: 8, x2: 9, z1: -5.5, z2: -4.5 });

  // ==========================================================
  // TECHO
  // ==========================================================
  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.2, 20),
    toonMat(0xfff0d8)
  );
  ceiling.position.y = 5;
  refs.houseInterior.add(ceiling);

  // ==========================================================
  // CARTELES DE ZONA
  // ==========================================================
  function addZoneSign(text, x, z, color) {
    const cv = document.createElement('canvas');
    cv.width = 256;
    cv.height = 128;
    const ctx = cv.getContext('2d');

    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 10;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(10, 10, 236, 108, 30);
    } else {
      ctx.rect(10, 10, 236, 108);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 44px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    const tex = new THREE.CanvasTexture(cv);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, depthTest: false })
    );
    sprite.scale.set(3, 1.5, 1);
    sprite.position.set(x, 3.5, z);
    refs.houseInterior.add(sprite);
  }

  addZoneSign('SALON',      -5, 5,  0xffd966);
  addZoneSign('COCINA',      6, 5,  0xffa94d);
  addZoneSign('HABITACION', -7, -3, 0xffb3d9);
  addZoneSign('BANO',        7, -3, 0x9be0ff);

  // ==========================================================
  // LUCES INTERIORES (para que se vea bien dentro)
  // ==========================================================
  const interiorLight = new THREE.PointLight(0xffffff, 1.5, 40, 1);
  interiorLight.position.set(0, 4.5, 0);
  refs.houseInterior.add(interiorLight);

  const interiorLight2 = new THREE.PointLight(0xfff0d0, 0.8, 30, 1);
  interiorLight2.position.set(-6, 3, -6);
  refs.houseInterior.add(interiorLight2);

  const interiorLight3 = new THREE.PointLight(0xfff0d0, 0.8, 30, 1);
  interiorLight3.position.set(6, 3, -6);
  refs.houseInterior.add(interiorLight3);

  // Empieza oculto
  refs.houseInterior.visible = false;

  console.log('[house] Interior creado. Hijos:', refs.houseInterior.children.length);
}

// ============================================================
// ENTRAR EN LA CASA
// ============================================================
export function enterHouse() {
  if (state.inHouse) return;
  state.inHouse = true;

  // Colocar al jugador en el centro-sur del interior
  state.x = 0;
  state.z = 7;
  refs.player.position.set(state.x, 0, state.z);
  refs.player.rotation.y = Math.PI;

  // Ocultar exterior
  session.houses.forEach(h => { h.mesh.visible = false; });
  session.npcs.forEach(n => { n.mesh.visible = false; });
  if (refs.homeGroup) refs.homeGroup.visible = false;

  // Forzar visibilidad del interior y TODOS sus hijos
  if (refs.houseInterior) {
    refs.houseInterior.visible = true;
    refs.houseInterior.traverse(obj => {
      obj.visible = true;
    });
    console.log('[house] Interior visible. Hijos:', refs.houseInterior.children.length);
  } else {
    console.error('[house] ¡NO EXISTE refs.houseInterior!');
  }

  // Colocar la camara dentro (de golpe, sin animacion)
  refs.camera.position.set(0, 12, 18);
  refs.camera.lookAt(0, 0, 0);

  // Ajustar botones
  document.getElementById('btn-enter').disabled = true;
  document.getElementById('btn-talk').disabled = true;
  document.getElementById('btn-boss').disabled = true;
  document.getElementById('btn-home').disabled = true;
  document.getElementById('btn-exit-house').style.display = 'flex';

  document.getElementById('hint').innerHTML = 'Explora la casa! Pulsa SALIR DE CASA cuando quieras salir.';

  console.log('[house] Entrando. Camara:', refs.camera.position);
  console.log('[house] Interior visible:', refs.houseInterior ? refs.houseInterior.visible : 'no existe');
}

// ============================================================
// SALIR DE LA CASA
// ============================================================
export function exitHouse() {
  if (!state.inHouse) return;
  state.inHouse = false;

  state.x = 8;
  state.z = 12;
  refs.player.position.set(state.x, 0, state.z);

  if (refs.houseInterior) {
    refs.houseInterior.visible = false;
  }

  session.houses.forEach(h => { h.mesh.visible = true; });
  session.npcs.forEach(n => { n.mesh.visible = true; });
  if (refs.homeGroup) refs.homeGroup.visible = true;

  document.getElementById('btn-exit-house').style.display = 'none';

  console.log('[house] Saliendo de la casa');
}