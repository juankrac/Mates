# 🧭 Expedición Matemática

Aplicación web para repasar **todo el temario de matemáticas de 6º de Primaria** jugando: cada tema tiene 3 niveles de dificultad, preguntas generadas al azar (nunca se repite exactamente la misma partida), rachas de aciertos, puntos y estrellas que se guardan en el propio navegador.

No necesita instalación, servidor ni base de datos: son solo HTML, CSS y JavaScript "puro" (sin frameworks), así que funciona directamente en GitHub Pages.

## Temario incluido

1. Números y operaciones (sumas, restas, multiplicaciones, divisiones, potencias, raíces)
2. Divisibilidad (múltiplos, divisores, primos, m.c.m., M.C.D.)
3. Fracciones (equivalencias, sumas/restas, fracción de una cantidad)
4. Números decimales (operaciones y redondeo)
5. Porcentajes y proporcionalidad
6. Geometría (perímetros, áreas, ángulos, cuerpos geométricos)
7. Medidas (longitud, masa, capacidad, tiempo)
8. Problemas de la vida real
9. Estadística y probabilidad (media, moda, probabilidad)

Cada tema tiene 3 niveles (Explorador, Aventurero, Experto) con 10 preguntas por ronda. Al terminar una ronda se ganan de 1 a 3 estrellas según la puntuación.

## Cómo subirlo a GitHub y publicarlo (paso a paso)

1. **Crea un repositorio nuevo** en GitHub (por ejemplo, `expedicion-matematica`). Puede ser público.
2. **Sube estos archivos** a ese repositorio. Puedes hacerlo:
   - Desde la web de GitHub: botón "Add file" → "Upload files", arrastra toda la carpeta (o su contenido) y confirma el commit.
   - O desde la terminal, dentro de esta carpeta:
     ```bash
     git init
     git add .
     git commit -m "Primera versión de Expedición Matemática"
     git branch -M main
     git remote add origin https://github.com/TU-USUARIO/expedicion-matematica.git
     git push -u origin main
     ```
3. **Activa GitHub Pages**:
   - En el repositorio, ve a **Settings → Pages**.
   - En "Source" (o "Build and deployment"), elige la rama `main` y la carpeta `/ (root)`.
   - Guarda. GitHub tardará uno o dos minutos en publicarlo.
4. **Accede a tu app**: GitHub te dará una URL parecida a `https://TU-USUARIO.github.io/expedicion-matematica/`. Esa es la dirección para jugar desde cualquier ordenador, tablet o móvil.

No hace falta tocar nada más: el sitio es 100% estático.

## Estructura del proyecto

```
expedicion-matematica/
├── index.html          → estructura de la app (pantallas)
├── css/style.css        → estilos visuales
├── js/data.js            → banco de ejercicios (todo el temario, por niveles)
├── js/game.js             → lógica del juego, puntuación y progreso guardado
└── README.md
```

## Cómo añadir o modificar ejercicios

Todos los ejercicios se generan en `js/data.js`. Cada tema (`TOPICS`) tiene un array `levels` con 3 funciones (una por nivel). Cada función devuelve un objeto:

```js
{ text: "Enunciado de la pregunta", answer: 42 }
```

o, si quieres que la pregunta sea de opción múltiple:

```js
{ text: "Enunciado", answer: "8", choices: ["6", "7", "8", "9"] }
```

Puedes copiar cualquier función existente como plantilla y ajustar los números o el enunciado para crear más variedad.

## Progreso y datos

El progreso (estrellas por tema y nivel) se guarda con `localStorage` en el propio navegador del dispositivo donde se juega. No se envía ningún dato a ningún servidor. Si se borra el historial/datos del navegador, el progreso se reinicia.
