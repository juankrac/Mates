/* =========================================================================
   LÓGICA DEL JUEGO
   ========================================================================= */

const STORAGE_KEY = "expedicion-matematica-progreso";
const QUESTIONS_PER_ROUND = 10;

let state = {
  topic: null,
  level: 1,
  qIndex: 0,
  score: 0,
  streak: 0,
  bestStreak: 0,
  currentQ: null,
  answered: false
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
function getTopicStars(topicId) {
  const p = loadProgress();
  return (p[topicId] && p[topicId].stars) || [0, 0, 0];
}
function setTopicStars(topicId, level, stars) {
  const p = loadProgress();
  if (!p[topicId]) p[topicId] = { stars: [0, 0, 0] };
  if (stars > p[topicId].stars[level - 1]) p[topicId].stars[level - 1] = stars;
  saveProgress(p);
}

// -------------------------------------------------------------- pantallas
const screens = {
  menu: document.getElementById("screen-menu"),
  levels: document.getElementById("screen-levels"),
  game: document.getElementById("screen-game"),
  results: document.getElementById("screen-results")
};
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// -------------------------------------------------------------- menú principal
function renderMenu() {
  const grid = document.getElementById("topics-grid");
  grid.innerHTML = "";
  TOPICS.forEach(topic => {
    const stars = getTopicStars(topic.id);
    const totalStars = stars.reduce((a, b) => a + b, 0);
    const card = document.createElement("button");
    card.className = "topic-card";
    card.style.setProperty("--topic-color", topic.color);
    card.innerHTML = `
      <span class="topic-icon">${topic.icon}</span>
      <span class="topic-name">${topic.name}</span>
      <span class="topic-desc">${topic.desc}</span>
      <span class="topic-stars">${"⭐".repeat(totalStars)}${"☆".repeat(9 - totalStars)}</span>
    `;
    card.addEventListener("click", () => openLevels(topic));
    grid.appendChild(card);
  });

  const totalPossible = TOPICS.length * 9;
  let totalEarned = 0;
  TOPICS.forEach(t => totalEarned += getTopicStars(t.id).reduce((a, b) => a + b, 0));
  document.getElementById("total-progress").textContent = `${totalEarned} / ${totalPossible} ⭐`;
}

// -------------------------------------------------------------- selección de nivel
function openLevels(topic) {
  state.topic = topic;
  document.getElementById("levels-title").textContent = `${topic.icon} ${topic.name}`;
  const wrap = document.getElementById("levels-list");
  wrap.innerHTML = "";
  const stars = getTopicStars(topic.id);
  const labels = ["Nivel 1 · Explorador", "Nivel 2 · Aventurero", "Nivel 3 · Experto"];
  labels.forEach((label, i) => {
    const lvl = i + 1;
    const locked = lvl > 1 && stars[i - 1] === 0;
    const btn = document.createElement("button");
    btn.className = "level-card" + (locked ? " locked" : "");
    btn.style.setProperty("--topic-color", topic.color);
    btn.innerHTML = `
      <span class="level-label">${label}</span>
      <span class="level-stars">${"⭐".repeat(stars[i])}${"☆".repeat(3 - stars[i])}</span>
      ${locked ? '<span class="level-lock">🔒 Supera el nivel anterior</span>' : ""}
    `;
    if (!locked) btn.addEventListener("click", () => startGame(topic, lvl));
    wrap.appendChild(btn);
  });
  showScreen("levels");
}

// -------------------------------------------------------------- partida
function startGame(topic, level) {
  state.topic = topic;
  state.level = level;
  state.qIndex = 0;
  state.score = 0;
  state.streak = 0;
  state.bestStreak = 0;
  document.getElementById("game-topic-name").textContent = `${topic.icon} ${topic.name} · Nivel ${level}`;
  document.getElementById("game-topic-name").style.color = topic.color;
  showScreen("game");
  nextQuestion();
}

function nextQuestion() {
  if (state.qIndex >= QUESTIONS_PER_ROUND) return endGame();
  state.qIndex++;
  state.answered = false;
  const generator = state.topic.levels[state.level - 1];
  state.currentQ = generator();

  document.getElementById("progress-fill").style.width = `${((state.qIndex - 1) / QUESTIONS_PER_ROUND) * 100}%`;
  document.getElementById("question-counter").textContent = `Pregunta ${state.qIndex} / ${QUESTIONS_PER_ROUND}`;
  document.getElementById("streak-counter").textContent = state.streak > 1 ? `🔥 Racha: ${state.streak}` : "";
  document.getElementById("question-text").textContent = state.currentQ.text;
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "feedback";

  const answerArea = document.getElementById("answer-area");
  answerArea.innerHTML = "";

  if (state.currentQ.choices) {
    state.currentQ.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = choice;
      btn.addEventListener("click", () => submitAnswer(choice, btn));
      answerArea.appendChild(btn);
    });
  } else {
    const form = document.createElement("form");
    form.className = "input-form";
    form.innerHTML = `
      <input type="text" inputmode="decimal" autocomplete="off" id="answer-input" placeholder="Tu respuesta" />
      ${state.currentQ.unit ? `<span class="unit-label">${state.currentQ.unit}</span>` : ""}
      <button type="submit" class="submit-btn">Comprobar</button>
    `;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = document.getElementById("answer-input").value.trim();
      submitAnswer(val);
    });
    answerArea.appendChild(form);
    setTimeout(() => document.getElementById("answer-input")?.focus(), 50);
  }
}

function normalize(val) {
  return String(val).trim().replace(",", ".").toLowerCase();
}

function submitAnswer(given, btnEl) {
  if (state.answered) return;
  state.answered = true;
  const correctNorm = normalize(state.currentQ.answer);
  const givenNorm = normalize(given);
  const isCorrect = Number.isFinite(Number(correctNorm)) && Number.isFinite(Number(givenNorm))
    ? Math.abs(Number(correctNorm) - Number(givenNorm)) < 0.01
    : correctNorm === givenNorm;

  const feedback = document.getElementById("feedback");
  const answerArea = document.getElementById("answer-area");
  answerArea.querySelectorAll("button, input").forEach(el => el.disabled = true);

  if (isCorrect) {
    state.streak++;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const bonus = state.streak >= 3 ? 15 : 10;
    state.score += bonus;
    feedback.textContent = state.streak >= 3 ? `¡Correcto! 🔥 Racha de ${state.streak} (+${bonus})` : `¡Correcto! (+${bonus})`;
    feedback.className = "feedback correct";
    if (btnEl) btnEl.classList.add("correct");
  } else {
    state.streak = 0;
    feedback.textContent = `Casi. La respuesta correcta era: ${state.currentQ.answer}${state.currentQ.unit ? " " + state.currentQ.unit : ""}`;
    feedback.className = "feedback incorrect";
    if (btnEl) btnEl.classList.add("incorrect");
    if (answerArea.querySelector(".choice-btn")) {
      answerArea.querySelectorAll(".choice-btn").forEach(b => {
        if (normalize(b.textContent) === correctNorm) b.classList.add("correct");
      });
    }
  }

  document.getElementById("progress-fill").style.width = `${(state.qIndex / QUESTIONS_PER_ROUND) * 100}%`;

  const nextBtn = document.createElement("button");
  nextBtn.className = "next-btn";
  nextBtn.textContent = state.qIndex >= QUESTIONS_PER_ROUND ? "Ver resultados →" : "Siguiente →";
  nextBtn.addEventListener("click", nextQuestion);
  document.getElementById("answer-area").appendChild(nextBtn);
  nextBtn.focus();
}

function endGame() {
  const maxScore = QUESTIONS_PER_ROUND * 15;
  const pct = state.score / maxScore;
  let stars = 1;
  if (pct >= 0.85) stars = 3;
  else if (pct >= 0.6) stars = 2;
  setTopicStars(state.topic.id, state.level, stars);

  document.getElementById("results-stars").textContent = "⭐".repeat(stars) + "☆".repeat(3 - stars);
  document.getElementById("results-score").textContent = `${state.score} puntos`;
  document.getElementById("results-streak").textContent = `Mejor racha: ${state.bestStreak}`;
  const messages = {
    3: "¡Increíble! Dominas este tema.",
    2: "¡Muy bien! Estás cada vez más cerca de dominarlo.",
    1: "¡Sigue practicando, cada intento te hace mejor!"
  };
  document.getElementById("results-message").textContent = messages[stars];
  showScreen("results");
}

// -------------------------------------------------------------- eventos globales
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  document.getElementById("btn-back-levels").addEventListener("click", () => showScreen("menu"));
  document.getElementById("btn-back-menu").addEventListener("click", () => { renderMenu(); showScreen("menu"); });
  document.getElementById("btn-retry").addEventListener("click", () => startGame(state.topic, state.level));
  document.getElementById("btn-results-menu").addEventListener("click", () => { renderMenu(); showScreen("menu"); });
  document.getElementById("btn-results-levels").addEventListener("click", () => openLevels(state.topic));
});
