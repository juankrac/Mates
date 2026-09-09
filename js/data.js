/* =========================================================================
   BANCO DE EJERCICIOS
   Cada tema tiene un generador por nivel (1 = fácil, 2 = medio, 3 = difícil).
   Un generador devuelve: { text, answer, choices?, hint, unit? }
   - Si "choices" existe, se muestra como pregunta de opción múltiple.
   - Si no, se muestra como campo numérico para escribir la respuesta.
   ========================================================================= */

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndFloat(min, max, decimals) {
  const f = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * f) / f;
}
function shuffle(arr) { return arr.sort(() => Math.random() - 0.5); }
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
function simplifyFrac(n, d) { const g = gcd(n, d) || 1; return [n / g, d / g]; }

// Genera opciones múltiples: la correcta + 3 distractores razonables
function choicesAround(correct, spread, decimals = 0) {
  const set = new Set([correct]);
  while (set.size < 4) {
    const delta = rnd(-spread, spread);
    let val = correct + delta;
    if (decimals > 0) val = Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
    if (delta !== 0) set.add(val);
  }
  return shuffle(Array.from(set)).map(String);
}

const TOPICS = [
  // ---------------------------------------------------------------- 1
  {
    id: "numeros",
    name: "Números y operaciones",
    icon: "🔢",
    color: "#2F8F7A",
    desc: "Sumas, restas, multiplicaciones, divisiones y potencias",
    levels: [
      () => {
        const ops = ["+", "-"];
        const op = ops[rnd(0, 1)];
        const a = rnd(100, 999), b = rnd(10, 999);
        const answer = op === "+" ? a + b : Math.max(a, b) - Math.min(a, b);
        const [x, y] = op === "+" ? [a, b] : [Math.max(a, b), Math.min(a, b)];
        return { text: `${x} ${op} ${y} =`, answer };
      },
      () => {
        const a = rnd(12, 99), b = rnd(3, 12);
        const type = rnd(0, 1);
        if (type === 0) return { text: `${a} × ${b} =`, answer: a * b };
        const prod = a * b;
        return { text: `${prod} ÷ ${b} =`, answer: a };
      },
      () => {
        const type = rnd(0, 1);
        if (type === 0) {
          const base = rnd(2, 9), exp = rnd(2, 3);
          return { text: `${base}² es ${base}×${base}. Calcula ${base}${exp === 3 ? "³" : "²"} =`, answer: Math.pow(base, exp) };
        }
        const root = rnd(2, 12);
        return { text: `√${root * root} =`, answer: root, hint: "Busca el número que multiplicado por sí mismo da el resultado." };
      }
    ]
  },
  // ---------------------------------------------------------------- 2
  {
    id: "divisibilidad",
    name: "Divisibilidad",
    icon: "🧩",
    color: "#3D6FB4",
    desc: "Múltiplos, divisores, números primos, MCM y MCD",
    levels: [
      () => {
        const n = rnd(2, 12);
        const mult = n * rnd(2, 9);
        const wrong = mult + rnd(1, n - 1 || 1);
        const options = shuffle([mult, wrong, wrong + n, mult + n]).map(String);
        return { text: `¿Cuál de estos números es múltiplo de ${n}?`, answer: String(mult), choices: [...new Set(options)].slice(0, 4) };
      },
      () => {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
        const notPrimes = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21];
        const isPrimeQ = Math.random() < 0.5;
        const n = isPrimeQ ? primes[rnd(0, primes.length - 1)] : notPrimes[rnd(0, notPrimes.length - 1)];
        return { text: `¿Es primo el número ${n}?`, answer: isPrimeQ ? "Sí" : "No", choices: shuffle(["Sí", "No"]) };
      },
      () => {
        const a = rnd(2, 10), b = rnd(2, 10);
        const useLCM = Math.random() < 0.5;
        const answer = useLCM ? lcm(a, b) : gcd(a, b);
        return { text: `Calcula el ${useLCM ? "m.c.m." : "M.C.D."} de ${a} y ${b} =`, answer };
      }
    ]
  },
  // ---------------------------------------------------------------- 3
  {
    id: "fracciones",
    name: "Fracciones",
    icon: "🍕",
    color: "#D9852F",
    desc: "Equivalencias, operaciones y fracción de una cantidad",
    levels: [
      () => {
        const d = rnd(2, 6), k = rnd(2, 5);
        const n = rnd(1, d - 1);
        const answer = `${n * k}/${d * k}`;
        const wrong1 = `${n * k + 1}/${d * k}`, wrong2 = `${n}/${d * k}`, wrong3 = `${n * (k + 1)}/${d * k}`;
        return { text: `¿Qué fracción es equivalente a ${n}/${d}?`, answer, choices: shuffle([answer, wrong1, wrong2, wrong3]) };
      },
      () => {
        const d = rnd(2, 8);
        const n1 = rnd(1, d - 1), n2 = rnd(1, d - 1);
        const opPlus = Math.random() < 0.5;
        const resNum = opPlus ? n1 + n2 : Math.max(n1, n2) - Math.min(n1, n2);
        const [sn, sd] = simplifyFrac(resNum, d);
        const [big, small] = opPlus ? [n1, n2] : [Math.max(n1, n2), Math.min(n1, n2)];
        return { text: `${big}/${d} ${opPlus ? "+" : "-"} ${small}/${d} = (simplifica si puedes)`, answer: `${sn}/${sd}`, hint: "Deja el resultado con el denominador más pequeño posible." };
      },
      () => {
        const d = [2, 3, 4, 5, 6][rnd(0, 4)];
        const n = rnd(1, d - 1);
        const base = d * rnd(2, 8);
        const answer = (base / d) * n;
        return { text: `Calcula ${n}/${d} de ${base} =`, answer };
      }
    ]
  },
  // ---------------------------------------------------------------- 4
  {
    id: "decimales",
    name: "Números decimales",
    icon: "🔬",
    color: "#8E4FBE",
    desc: "Sumas, restas, multiplicaciones y redondeo de decimales",
    levels: [
      () => {
        const a = rndFloat(1, 99, 1), b = rndFloat(1, 99, 1);
        const opPlus = Math.random() < 0.5;
        const answer = Math.round((opPlus ? a + b : Math.max(a, b) - Math.min(a, b)) * 10) / 10;
        const [x, y] = opPlus ? [a, b] : [Math.max(a, b), Math.min(a, b)];
        return { text: `${x} ${opPlus ? "+" : "-"} ${y} =`, answer };
      },
      () => {
        const a = rndFloat(1, 20, 1), b = rnd(2, 9);
        const answer = Math.round(a * b * 100) / 100;
        return { text: `${a} × ${b} =`, answer };
      },
      () => {
        const a = rndFloat(1, 100, 2);
        const decimals = rnd(0, 1);
        const factor = Math.pow(10, decimals);
        const answer = Math.round(a * factor) / factor;
        return { text: `Redondea ${a} a ${decimals === 0 ? "las unidades" : "las décimas"} =`, answer };
      }
    ]
  },
  // ---------------------------------------------------------------- 5
  {
    id: "porcentajes",
    name: "Porcentajes y proporcionalidad",
    icon: "📊",
    color: "#C24545",
    desc: "Calcular porcentajes y resolver problemas de proporcionalidad",
    levels: [
      () => {
        const pct = [10, 20, 25, 50][rnd(0, 3)];
        const total = rnd(2, 20) * (100 / pct);
        const answer = (total * pct) / 100;
        return { text: `¿Cuánto es el ${pct}% de ${total}?`, answer };
      },
      () => {
        const total = rnd(20, 200);
        const pct = [5, 10, 15, 20, 25, 40, 50, 75][rnd(0, 7)];
        const answer = Math.round((total * pct) / 100);
        return { text: `Calcula el ${pct}% de ${total} =`, answer };
      },
      () => {
        const a = rnd(2, 10), b = rnd(2, 10) * a;
        const c = rnd(2, 12);
        const answer = (b / a) * c;
        return { text: `Si ${a} lápices cuestan ${b} €, ¿cuánto cuestan ${c} lápices?`, answer, hint: "Calcula primero cuánto cuesta 1 lápiz." };
      }
    ]
  },
  // ---------------------------------------------------------------- 6
  {
    id: "geometria",
    name: "Geometría",
    icon: "📐",
    color: "#2B7FB0",
    desc: "Perímetros, áreas, ángulos y cuerpos geométricos",
    levels: [
      () => {
        const l = rnd(3, 20);
        const shape = Math.random() < 0.5 ? "cuadrado" : "rectángulo";
        if (shape === "cuadrado") return { text: `¿Cuál es el perímetro de un cuadrado de lado ${l} cm?`, answer: l * 4, unit: "cm" };
        const w = rnd(3, 20);
        return { text: `¿Cuál es el perímetro de un rectángulo de ${l} cm de base y ${w} cm de altura?`, answer: (l + w) * 2, unit: "cm" };
      },
      () => {
        const shape = rnd(0, 2);
        if (shape === 0) { const l = rnd(3, 15); return { text: `¿Cuál es el área de un cuadrado de lado ${l} cm?`, answer: l * l, unit: "cm²" }; }
        if (shape === 1) { const b = rnd(3, 15), h = rnd(3, 15); return { text: `¿Cuál es el área de un rectángulo de base ${b} cm y altura ${h} cm?`, answer: b * h, unit: "cm²" }; }
        const b = rnd(4, 16), h = rnd(3, 12);
        return { text: `¿Cuál es el área de un triángulo de base ${b} cm y altura ${h} cm?`, answer: (b * h) / 2, unit: "cm²" };
      },
      () => {
        const type = rnd(0, 1);
        if (type === 0) {
          const a1 = rnd(20, 150);
          return { text: `Dos ángulos son complementarios (suman 90°). Si uno mide ${a1}°, ¿cuánto mide el otro?`, answer: 90 - (a1 % 90 || a1 % 90) };
        }
        const faces = { cubo: 6, "prisma triangular": 5, pirámide_cuadrada: 5, tetraedro: 4 };
        const names = Object.keys(faces);
        const chosen = names[rnd(0, names.length - 1)];
        return { text: `¿Cuántas caras tiene un ${chosen.replace("_", " ")}?`, answer: faces[chosen] };
      }
    ]
  },
  // ---------------------------------------------------------------- 7
  {
    id: "medidas",
    name: "Medidas",
    icon: "⏱️",
    color: "#2FA0A0",
    desc: "Longitud, masa, capacidad y tiempo",
    levels: [
      () => {
        const km = rnd(1, 20);
        return { text: `${km} km = ? m`, answer: km * 1000 };
      },
      () => {
        const units = [
          { from: "kg", to: "g", factor: 1000, max: 15 },
          { from: "l", to: "ml", factor: 1000, max: 15 },
          { from: "m", to: "cm", factor: 100, max: 20 }
        ];
        const u = units[rnd(0, units.length - 1)];
        const val = rnd(1, u.max);
        return { text: `${val} ${u.from} = ? ${u.to}`, answer: val * u.factor };
      },
      () => {
        const h = rnd(1, 5), m = rnd(10, 50);
        const addMin = rnd(15, 90);
        let totalMin = h * 60 + m + addMin;
        const newH = Math.floor(totalMin / 60), newM = totalMin % 60;
        return { text: `Son las ${h}:${String(m).padStart(2, "0")}. ¿Qué hora será dentro de ${addMin} minutos? (formato H:MM, sin ceros a la izquierda en la hora)`, answer: `${newH}:${String(newM).padStart(2, "0")}` };
      }
    ]
  },
  // ---------------------------------------------------------------- 8
  {
    id: "problemas",
    name: "Problemas",
    icon: "🧠",
    color: "#B0562B",
    desc: "Razonamiento y problemas de la vida real",
    levels: [
      () => {
        const precio = rnd(2, 20), cant = rnd(2, 10);
        return { text: `Marta compra ${cant} cuadernos que cuestan ${precio} € cada uno. ¿Cuánto paga en total?`, answer: precio * cant, unit: "€" };
      },
      () => {
        const total = rnd(20, 100), gasta = rnd(5, total - 5);
        return { text: `Tenías ${total} € y has gastado ${gasta} €. ¿Cuánto dinero te queda?`, answer: total - gasta, unit: "€" };
      },
      () => {
        const velocidad = rnd(40, 100), horas = rnd(2, 5);
        return { text: `Un coche viaja a ${velocidad} km/h durante ${horas} horas. ¿Cuántos km recorre?`, answer: velocidad * horas, unit: "km" };
      }
    ]
  },
  // ---------------------------------------------------------------- 9
  {
    id: "estadistica",
    name: "Estadística y probabilidad",
    icon: "🎲",
    color: "#6B4FA0",
    desc: "Media, moda y probabilidad de sucesos",
    levels: [
      () => {
        const n = rnd(4, 6);
        const nums = Array.from({ length: n }, () => rnd(1, 20));
        const sum = nums.reduce((a, b) => a + b, 0);
        const answer = Math.round((sum / n) * 100) / 100;
        return { text: `Calcula la media de: ${nums.join(", ")}`, answer, hint: "Suma todos los valores y divide entre cuántos son." };
      },
      () => {
        const n = rnd(6, 8);
        const pool = [rnd(1, 10), rnd(1, 10), rnd(1, 10)];
        const nums = Array.from({ length: n }, () => pool[rnd(0, 2)]);
        const counts = {};
        nums.forEach(x => counts[x] = (counts[x] || 0) + 1);
        const moda = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        return { text: `¿Cuál es la moda (el valor que más se repite) de: ${nums.join(", ")}?`, answer: Number(moda) };
      },
      () => {
        const total = [6, 10][rnd(0, 1)];
        const fav = rnd(1, total - 1);
        const [sn, sd] = simplifyFrac(fav, total);
        return { text: `Una bolsa tiene ${total} bolas numeradas del 1 al ${total}. ¿Qué probabilidad hay de sacar un número menor o igual que ${fav}? (como fracción simplificada, ej: 1/2)`, answer: `${sn}/${sd}` };
      }
    ]
  }
];
