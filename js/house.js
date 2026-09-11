// ============================================================
// INTERIOR DE LA CASA: gestion de entrar y salir
// ============================================================

import { refs, session, state } from './config.js';
import { initHouseScene } from './scene.js';

// ============================================================
// CREAR EL INTERIOR (llama a initHouseScene)
// ============================================================
export function createHouseInterior() {
  // Toda la construccion esta ahora en scene.js
  initHouseScene();
}

// ============================================================
// ENTRAR EN LA CASA
// ============================================================
export function enterHouse() {
  if (state.inHouse) return;
  state.inHouse = true;

  // Colocar al jugador
  state.x = 0;
  state.z = 7;
  refs.player.position.set(state.x, 0, state.z);
  refs.player.rotation.y = Math.PI;

  // Añadir el jugador a la escena de la casa
  refs.houseScene.add(refs.player);

  // Ocultar mascota
  if (refs.parts.petGroup) refs.parts.petGroup.visible = false;

  // Colocar la camara de la casa mirando al centro
  refs.houseCamera.position.set(0, 10, 16);
  refs.houseCamera.lookAt(0, 1, 0);

  // Botones
  document.getElementById('btn-enter').disabled = true;
  document.getElementById('btn-talk').disabled = true;
  document.getElementById('btn-boss').disabled = true;
  document.getElementById('btn-home').disabled = true;
  document.getElementById('btn-exit-house').style.display = 'flex';

  document.getElementById('hint').innerHTML = 'Explora la casa! Pulsa SALIR DE CASA cuando quieras salir.';

  console.log('[house] ENTRAR');
  console.log('  houseScene:', !!refs.houseScene);
  console.log('  houseScene hijos:', refs.houseScene ? refs.houseScene.children.length : 0);
  console.log('  houseInterior hijos:', refs.houseInterior ? refs.houseInterior.children.length : 0);
  console.log('  houseInterior esta en scene:', refs.houseScene ? refs.houseScene.children.includes(refs.houseInterior) : false);
  console.log('  camara:', refs.houseCamera.position);
}

// ============================================================
// SALIR DE LA CASA
// ============================================================
export function exitHouse() {
  if (!state.inHouse) return;
  state.inHouse = false;

  // Devolver jugador a la escena del mundo
  refs.scene.add(refs.player);

  state.x = 8;
  state.z = 12;
  refs.player.position.set(state.x, 0, state.z);

  if (refs.parts.petGroup) refs.parts.petGroup.visible = true;

  document.getElementById('btn-exit-house').style.display = 'none';

  console.log('[house] SALIR');
}