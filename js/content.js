// ============================================================
// EJERCICIOS POR EDAD
// ============================================================

import { TOPICS_BASE } from './config.js';

// ============================================================
// CONTENIDO POR EDAD
// Cada edad tiene un objeto con la explicacion, ejemplo y 10
// ejercicios por cada tema. Los temas que no aparezcan usan el
// contenido por defecto (vacio).
// ============================================================
export const CONTENT_BY_AGE = {

  // ==========================================================
  // CONTENIDO PARA 11 ANOS (6º de Primaria - el original)
  // ==========================================================
  '11': {
    'numeros': {
      explicacion: 'Los numeros naturales sirven para contar y ordenar. Al sumar juntamos cantidades, al restar quitamos, al multiplicar sumamos varias veces lo mismo y al dividir repartimos.',
      ejemplo: '15 + 27 = <b>42</b>.',
      ejercicios: [
        { q: 'Cuanto es 15 + 27?',       a: '42' },
        { q: 'Cuanto es 48 - 19?',       a: '29' },
        { q: 'Cuanto es 7 x 8?',         a: '56' },
        { q: 'Cuanto es 63 / 7?',        a: '9' },
        { q: 'Cuanto es 125 + 87?',      a: '212' },
        { q: 'Cuanto es 300 - 145?',     a: '155' },
        { q: 'Cuanto es 12 x 11?',       a: '132' },
        { q: 'Cuanto es 144 / 12?',      a: '12' },
        { q: 'Cuanto es 256 + 178?',     a: '434' },
        { q: 'Cuanto es 25 x 4?',        a: '100' }
      ]
    },
    'divisibilidad': {
      explicacion: 'El MCD (Maximo Comun Divisor) es el divisor mas grande que comparten dos numeros. El MCM (Minimo Comun Multiplo) es el menor multiplo que comparten.',
      ejemplo: 'MCD(12, 18) = <b>6</b>.',
      ejercicios: [
        { q: 'MCD de 12 y 18',           a: '6' },
        { q: 'MCD de 8 y 12',            a: '4' },
        { q: 'MCD de 15 y 25',           a: '5' },
        { q: 'MCM de 4 y 6',             a: '12' },
        { q: 'MCM de 3 y 5',             a: '15' },
        { q: 'MCM de 6 y 8',             a: '24' },
        { q: 'Es 7 primo? (si/no)',      a: 'si' },
        { q: 'Es 15 primo? (si/no)',     a: 'no' },
        { q: 'MCD de 24 y 36',           a: '12' },
        { q: 'MCM de 10 y 15',           a: '30' }
      ]
    },
    'fracciones': {
      explicacion: 'Una fraccion representa partes de un todo. Para sumar o restar necesitamos el mismo denominador.',
      ejemplo: '1/2 + 1/4 = 2/4 + 1/4 = <b>3/4</b>.',
      ejercicios: [
        { q: '1/2 + 1/4 (ej: 3/4)',      a: '3/4' },
        { q: '1/3 + 1/3 (ej: 2/3)',      a: '2/3' },
        { q: '3/5 - 1/5 (ej: 2/5)',      a: '2/5' },
        { q: '1/2 + 1/3 (ej: 5/6)',      a: '5/6' },
        { q: '2/3 + 1/6 (ej: 5/6)',      a: '5/6' },
        { q: '1/4 + 1/4 (ej: 1/2)',      a: '1/2' },
        { q: '3/4 - 1/4 (ej: 1/2)',      a: '1/2' },
        { q: '1/5 + 2/5 (ej: 3/5)',      a: '3/5' },
        { q: '5/6 - 1/6 (ej: 2/3)',      a: '2/3' },
        { q: '1/2 + 3/4 (ej: 5/4)',      a: '5/4' }
      ]
    },
    'decimales': {
      explicacion: 'Alinea las comas al sumar o restar. Multiplica y divide como si no hubiera coma y luego colocala en su sitio.',
      ejemplo: '2,5 + 1,75 = <b>4,25</b>.',
      ejercicios: [
        { q: '2,5 + 1,75',               a: '4,25' },
        { q: '3,4 + 2,6',                a: '6' },
        { q: '5,25 + 3,15',              a: '8,4' },
        { q: '7,8 - 3,2',                a: '4,6' },
        { q: '10,5 - 4,3',               a: '6,2' },
        { q: '1,5 x 2',                  a: '3' },
        { q: '2,5 x 4',                  a: '10' },
        { q: '8,4 / 2',                  a: '4,2' },
        { q: '12,6 / 3',                 a: '4,2' },
        { q: '0,5 + 0,75',               a: '1,25' }
      ]
    },
    'porcentajes': {
      explicacion: 'Un porcentaje es una fraccion con denominador 100. El 20% significa 20 de cada 100.',
      ejemplo: '20% de 150 = 150/5 = <b>30</b>.',
      ejercicios: [
        { q: '20% de 150',               a: '30' },
        { q: '50% de 80',                a: '40' },
        { q: '25% de 200',               a: '50' },
        { q: '10% de 90',                a: '9' },
        { q: '75% de 100',               a: '75' },
        { q: '30% de 200',               a: '60' },
        { q: '15% de 200',               a: '30' },
        { q: '5% de 400',                a: '20' },
        { q: '40% de 250',               a: '100' },
        { q: '60% de 50',                a: '30' }
      ]
    },
    'geometria': {
      explicacion: 'Area = base x altura (rectangulo). Area del triangulo = base x altura / 2. Perimetro es la suma de los lados.',
      ejemplo: 'Rectangulo 8 x 5 -> 8 x 5 = <b>40</b>.',
      ejercicios: [
        { q: 'Area rectangulo 8x5',      a: '40' },
        { q: 'Area rectangulo 6x4',      a: '24' },
        { q: 'Area cuadrado lado 7',     a: '49' },
        { q: 'Area cuadrado lado 9',     a: '81' },
        { q: 'Area triangulo 6x4',       a: '12' },
        { q: 'Area triangulo 10x5',      a: '25' },
        { q: 'Perimetro cuadrado lado 5',a: '20' },
        { q: 'Perimetro rectangulo 8x3', a: '22' },
        { q: 'Area rectangulo 12x5',     a: '60' },
        { q: 'Area cuadrado lado 11',    a: '121' }
      ]
    },
    'medidas': {
      explicacion: '1 m = 100 cm. 1 km = 1000 m. 1 kg = 1000 g. 1 L = 1000 mL.',
      ejemplo: '3,5 m = <b>350 cm</b>.',
      ejercicios: [
        { q: 'cm en 3,5 m',              a: '350' },
        { q: 'cm en 2 m',                a: '200' },
        { q: 'cm en 0,5 m',              a: '50' },
        { q: 'm en 500 cm',              a: '5' },
        { q: 'cm en 1,25 m',             a: '125' },
        { q: 'm en 1200 cm',             a: '12' },
        { q: 'cm en 0,75 m',             a: '75' },
        { q: 'm en 350 cm',              a: '3,5' },
        { q: 'cm en 4 m',                a: '400' },
        { q: 'cm en 1,8 m',              a: '180' }
      ]
    },
    'problemas': {
      explicacion: 'Lee despacio, identifica los datos y elige la operacion adecuada.',
      ejemplo: '4 lapices a 0,75 € -> 0,75 x 4 = <b>3 €</b>.',
      ejercicios: [
        { q: '4 lapices a 0,75. Total?', a: '3' },
        { q: '5 caramelos a 0,20. Total?', a: '1' },
        { q: '25 - 10?',                 a: '15' },
        { q: '3 cajas x 12 huevos?',     a: '36' },
        { q: '4 libros a 15?',           a: '60' },
        { q: '50 - 3x12?',               a: '14' },
        { q: '40 plazas x 5 viajes?',    a: '200' },
        { q: '24 caramelos entre 6?',    a: '4' },
        { q: '3 kg x 2 euros?',          a: '6' },
        { q: '80 km x 3 horas?',         a: '240' }
      ]
    },
    'estadistica': {
      explicacion: 'La media se calcula sumando todos los valores y dividiendo entre cuantos hay.',
      ejemplo: 'Media de 4, 6, 8 -> (4+6+8)/3 = <b>6</b>.',
      ejercicios: [
        { q: 'Media de 4, 6, 8',         a: '6' },
        { q: 'Media de 2, 4, 6',         a: '4' },
        { q: 'Media de 10, 20, 30',      a: '20' },
        { q: 'Media de 5, 5, 5',         a: '5' },
        { q: 'Media de 1, 2, 3, 4',      a: '2,5' },
        { q: 'Media de 8, 10',           a: '9' },
        { q: 'Media de 7, 9, 11',        a: '9' },
        { q: 'Media de 0, 10, 20',       a: '10' },
        { q: 'Media de 6, 8, 10, 12',    a: '9' },
        { q: 'Media de 3, 7, 5',         a: '5' }
      ]
    },
    'potencias': {
      explicacion: 'Una potencia es una multiplicacion repetida. a^n = a por si mismo n veces.',
      ejemplo: '2^5 = 2 x 2 x 2 x 2 x 2 = <b>32</b>.',
      ejercicios: [
        { q: '2 elevado a 5',            a: '32' },
        { q: '3 elevado a 3',            a: '27' },
        { q: '5 elevado a 2',            a: '25' },
        { q: '4 elevado a 2',            a: '16' },
        { q: '10 elevado a 3',           a: '1000' },
        { q: '2 elevado a 4',            a: '16' },
        { q: '6 elevado a 2',            a: '36' },
        { q: '2 elevado a 6',            a: '64' },
        { q: '3 elevado a 4',            a: '81' },
        { q: '7 elevado a 2',            a: '49' }
      ]
    },
    'enteros': {
      explicacion: 'Los enteros incluyen positivos, negativos y el cero. Al sumar avanzamos en la recta numerica.',
      ejemplo: '(-5) + 8 = <b>3</b>.',
      ejercicios: [
        { q: '(-5) + 8',                 a: '3' },
        { q: '(-3) + 7',                 a: '4' },
        { q: '5 - 8',                    a: '-3' },
        { q: '(-2) + (-4)',              a: '-6' },
        { q: '(-10) + 15',               a: '5' },
        { q: '8 - 12',                   a: '-4' },
        { q: '(-7) + 7',                 a: '0' },
        { q: '(-6) - 2',                 a: '-8' },
        { q: '3 - 10',                   a: '-7' },
        { q: '(-1) + 9',                 a: '8' }
      ]
    },
    'algebra': {
      explicacion: 'Usamos letras para representar numeros desconocidos. Hacemos la operacion inversa para despejar la incognita.',
      ejemplo: 'x + 5 = 12 -> x = 12 - 5 = <b>7</b>.',
      ejercicios: [
        { q: 'x + 5 = 12, x?',           a: '7' },
        { q: 'x + 3 = 10, x?',           a: '7' },
        { q: 'x - 4 = 6, x?',            a: '10' },
        { q: 'x + 8 = 15, x?',           a: '7' },
        { q: 'x - 2 = 9, x?',            a: '11' },
        { q: 'x + 10 = 20, x?',          a: '10' },
        { q: 'x - 5 = 5, x?',            a: '10' },
        { q: 'x + 1 = 8, x?',            a: '7' },
        { q: 'x - 7 = 3, x?',            a: '10' },
        { q: 'x + 6 = 14, x?',           a: '8' }
      ]
    },
    'ecuaciones': {
      explicacion: 'Una ecuacion tiene una incognita. Despejamos haciendo la operacion inversa en los dos lados.',
      ejemplo: '3x = 21 -> x = 21 / 3 = <b>7</b>.',
      ejercicios: [
        { q: '3x = 21, x?',              a: '7' },
        { q: '2x = 10, x?',              a: '5' },
        { q: '4x = 20, x?',              a: '5' },
        { q: '5x = 45, x?',              a: '9' },
        { q: '6x = 36, x?',              a: '6' },
        { q: '2x = 18, x?',              a: '9' },
        { q: '7x = 49, x?',              a: '7' },
        { q: '8x = 64, x?',              a: '8' },
        { q: '3x = 27, x?',              a: '9' },
        { q: '9x = 81, x?',              a: '9' }
      ]
    },
    'probabilidad': {
      explicacion: 'La probabilidad se calcula dividiendo los casos favorables entre los casos posibles.',
      ejemplo: 'P(sacar par) = 3/6 = <b>1/2</b>.',
      ejercicios: [
        { q: 'P(par) en un dado (ej: 1/2)',   a: '1/2' },
        { q: 'P(sacar 3) en un dado (ej: 1/6)', a: '1/6' },
        { q: 'P(sacar 6) en un dado (ej: 1/6)', a: '1/6' },
        { q: 'P(cara) al lanzar moneda (ej: 1/2)', a: '1/2' },
        { q: 'P(impar) en un dado (ej: 1/2)', a: '1/2' },
        { q: 'P(mayor que 4) en un dado (ej: 1/3)', a: '1/3' },
        { q: 'P(menor que 3) en un dado (ej: 1/3)', a: '1/3' },
        { q: 'P(sacar 1) en un dado (ej: 1/6)', a: '1/6' },
        { q: 'P(sacar 2 o 4) en un dado (ej: 1/3)', a: '1/3' },
        { q: 'P(cruz) al lanzar moneda (ej: 1/2)', a: '1/2' }
      ]
    }
  },

  // ==========================================================
  // CONTENIDO PARA 9 ANOS (4º de Primaria)
  // ==========================================================
  '9': {
    'numeros': {
      explicacion: 'Sumamos y restamos numeros hasta 100. Multiplicamos con las tablas basicas.',
      ejemplo: '23 + 14 = <b>37</b>.',
      ejercicios: [
        { q: 'Cuanto es 5 + 3?',         a: '8' },
        { q: 'Cuanto es 12 + 4?',        a: '16' },
        { q: 'Cuanto es 20 + 15?',       a: '35' },
        { q: 'Cuanto es 10 - 3?',        a: '7' },
        { q: 'Cuanto es 18 - 6?',        a: '12' },
        { q: 'Cuanto es 25 + 25?',       a: '50' },
        { q: 'Cuanto es 30 - 12?',       a: '18' },
        { q: 'Cuanto es 7 + 8?',         a: '15' },
        { q: 'Cuanto es 14 - 9?',        a: '5' },
        { q: 'Cuanto es 45 + 20?',       a: '65' }
      ]
    },
    'divisibilidad': {
      explicacion: 'Los numeros pares terminan en 0, 2, 4, 6 u 8. Los impares terminan en 1, 3, 5, 7 o 9.',
      ejemplo: '8 es par, 7 no.',
      ejercicios: [
        { q: 'Es 6 par? (si/no)',        a: 'si' },
        { q: 'Es 7 par? (si/no)',        a: 'no' },
        { q: 'Es 10 par? (si/no)',       a: 'si' },
        { q: 'Es 15 par? (si/no)',       a: 'no' },
        { q: 'Es 20 par? (si/no)',       a: 'si' },
        { q: 'Es 33 par? (si/no)',       a: 'no' },
        { q: 'Es 42 par? (si/no)',       a: 'si' },
        { q: 'Es 51 par? (si/no)',       a: 'no' },
        { q: 'Es 100 par? (si/no)',      a: 'si' },
        { q: 'Es 77 par? (si/no)',       a: 'no' }
      ]
    },
    'fracciones': {
      explicacion: '1/2 significa la mitad. 1/4 significa un cuarto.',
      ejemplo: '1/2 + 1/2 = <b>1</b>.',
      ejercicios: [
        { q: '1/2 + 1/2 (ej: 1)',        a: '1' },
        { q: '1/4 + 1/4 (ej: 1/2)',      a: '1/2' },
        { q: '1/3 + 1/3 (ej: 2/3)',      a: '2/3' },
        { q: '2/4 + 1/4 (ej: 3/4)',      a: '3/4' },
        { q: '1/2 + 1/4 (ej: 3/4)',      a: '3/4' },
        { q: '3/4 - 1/4 (ej: 1/2)',      a: '1/2' },
        { q: '1/5 + 1/5 (ej: 2/5)',      a: '2/5' },
        { q: '2/3 - 1/3 (ej: 1/3)',      a: '1/3' },
        { q: '1/6 + 1/6 (ej: 1/3)',      a: '1/3' },
        { q: '4/5 - 2/5 (ej: 2/5)',      a: '2/5' }
      ]
    },
    'decimales': {
      explicacion: 'Los decimales llevan una coma. Sumamos y restamos alineando las comas.',
      ejemplo: '1,5 + 1,5 = <b>3</b>.',
      ejercicios: [
        { q: '1,5 + 1,5',                a: '3' },
        { q: '0,5 + 0,5',                a: '1' },
        { q: '2,5 + 0,5',                a: '3' },
        { q: '1,2 + 1,3',                a: '2,5' },
        { q: '3,0 - 1,5',                a: '1,5' },
        { q: '2,5 - 0,5',                a: '2' },
        { q: '0,25 + 0,25',              a: '0,5' },
        { q: '1,75 + 0,25',              a: '2' },
        { q: '4,5 - 1,5',                a: '3' },
        { q: '5,5 - 2,5',                a: '3' }
      ]
    },
    'porcentajes': {
      explicacion: 'El 50% es la mitad de un numero. El 25% es la cuarta parte.',
      ejemplo: '50% de 20 = <b>10</b>.',
      ejercicios: [
        { q: '50% de 10',                a: '5' },
        { q: '50% de 20',                a: '10' },
        { q: '50% de 40',                a: '20' },
        { q: '50% de 100',               a: '50' },
        { q: '50% de 8',                 a: '4' },
        { q: '50% de 6',                 a: '3' },
        { q: '50% de 30',                a: '15' },
        { q: '50% de 60',                a: '30' },
        { q: '50% de 12',                a: '6' },
        { q: '50% de 50',                a: '25' }
      ]
    },
    'geometria': {
      explicacion: 'El perimetro es la suma de todos los lados. El area del cuadrado es lado x lado.',
      ejemplo: 'Cuadrado de lado 3 -> perimetro = <b>12</b>.',
      ejercicios: [
        { q: 'Perimetro cuadrado lado 3', a: '12' },
        { q: 'Perimetro cuadrado lado 4', a: '16' },
        { q: 'Perimetro cuadrado lado 5', a: '20' },
        { q: 'Area cuadrado lado 3',      a: '9' },
        { q: 'Area cuadrado lado 4',      a: '16' },
        { q: 'Area cuadrado lado 5',      a: '25' },
        { q: 'Perimetro cuadrado lado 2', a: '8' },
        { q: 'Area cuadrado lado 6',      a: '36' },
        { q: 'Perimetro rectangulo 4x2',  a: '12' },
        { q: 'Area rectangulo 4x2',       a: '8' }
      ]
    },
    'medidas': {
      explicacion: '1 m = 100 cm. Para pasar de metros a cm multiplicamos por 100.',
      ejemplo: '2 m = <b>200 cm</b>.',
      ejercicios: [
        { q: 'cm en 1 m',                a: '100' },
        { q: 'cm en 2 m',                a: '200' },
        { q: 'cm en 3 m',                a: '300' },
        { q: 'cm en 0,5 m',              a: '50' },
        { q: 'm en 100 cm',              a: '1' },
        { q: 'm en 200 cm',              a: '2' },
        { q: 'cm en 4 m',                a: '400' },
        { q: 'm en 500 cm',              a: '5' },
        { q: 'cm en 1,5 m',              a: '150' },
        { q: 'm en 300 cm',              a: '3' }
      ]
    },
    'problemas': {
      explicacion: 'Leemos despacio y elegimos la operacion correcta.',
      ejemplo: '3 manzanas a 2 euros -> 3 x 2 = <b>6 euros</b>.',
      ejercicios: [
        { q: '3 manzanas a 2 euros. Total?',   a: '6' },
        { q: '5 caramelos a 1 euro. Total?',   a: '5' },
        { q: 'Tengo 10 euros y gasto 3. Quedan?', a: '7' },
        { q: '2 cajas x 5 huevos?',            a: '10' },
        { q: '4 amigos x 2 caramelos?',        a: '8' },
        { q: '10 - 4?',                        a: '6' },
        { q: '3 + 3 + 3?',                     a: '9' },
        { q: '20 caramelos entre 4?',          a: '5' },
        { q: '2 kg x 3 euros?',                a: '6' },
        { q: '12 - 5?',                        a: '7' }
      ]
    },
    'estadistica': {
      explicacion: 'La media de varios numeros es el valor del medio cuando los ordenamos.',
      ejemplo: 'Media de 2 y 4 = <b>3</b>.',
      ejercicios: [
        { q: 'Media de 2 y 4',           a: '3' },
        { q: 'Media de 1 y 3',           a: '2' },
        { q: 'Media de 5 y 5',           a: '5' },
        { q: 'Media de 2, 4, 6',         a: '4' },
        { q: 'Media de 3, 3, 3',         a: '3' },
        { q: 'Media de 1, 1',            a: '1' },
        { q: 'Media de 10 y 20',         a: '15' },
        { q: 'Media de 4 y 6',           a: '5' },
        { q: 'Media de 2, 6',            a: '4' },
        { q: 'Media de 8, 10',           a: '9' }
      ]
    },
    'potencias': {
      explicacion: 'Un numero al cuadrado es ese numero multiplicado por si mismo.',
      ejemplo: '3 al cuadrado = 3 x 3 = <b>9</b>.',
      ejercicios: [
        { q: '2 al cuadrado',            a: '4' },
        { q: '3 al cuadrado',            a: '9' },
        { q: '4 al cuadrado',            a: '16' },
        { q: '5 al cuadrado',            a: '25' },
        { q: '1 al cuadrado',            a: '1' },
        { q: '6 al cuadrado',            a: '36' },
        { q: '7 al cuadrado',            a: '49' },
        { q: '8 al cuadrado',            a: '64' },
        { q: '9 al cuadrado',            a: '81' },
        { q: '10 al cuadrado',           a: '100' }
      ]
    },
    'enteros': {
      explicacion: 'Los numeros pueden ser positivos o negativos. Los grados bajo cero son negativos.',
      ejemplo: 'Con 5 grados y bajan 2 -> <b>3 grados</b>.',
      ejercicios: [
        { q: '5 - 2',                    a: '3' },
        { q: '8 - 3',                    a: '5' },
        { q: '10 - 7',                   a: '3' },
        { q: '6 - 4',                    a: '2' },
        { q: '9 - 5',                    a: '4' },
        { q: '7 - 6',                    a: '1' },
        { q: '12 - 4',                   a: '8' },
        { q: '15 - 5',                   a: '10' },
        { q: '20 - 10',                  a: '10' },
        { q: '11 - 3',                   a: '8' }
      ]
    },
    'algebra': {
      explicacion: 'Buscamos el numero que falta para que la igualdad sea cierta.',
      ejemplo: '? + 3 = 7 -> ? = <b>4</b>.',
      ejercicios: [
        { q: 'x + 1 = 3, x?',            a: '2' },
        { q: 'x + 2 = 4, x?',            a: '2' },
        { q: 'x + 3 = 7, x?',            a: '4' },
        { q: 'x + 5 = 8, x?',            a: '3' },
        { q: 'x + 4 = 9, x?',            a: '5' },
        { q: 'x + 1 = 10, x?',           a: '9' },
        { q: 'x + 2 = 8, x?',            a: '6' },
        { q: 'x + 6 = 10, x?',           a: '4' },
        { q: 'x + 3 = 9, x?',            a: '6' },
        { q: 'x + 7 = 12, x?',           a: '5' }
      ]
    },
    'ecuaciones': {
      explicacion: 'Buscamos el numero que al multiplicarlo da el resultado.',
      ejemplo: '2 x ? = 6 -> ? = <b>3</b>.',
      ejercicios: [
        { q: '2x = 4, x?',               a: '2' },
        { q: '2x = 6, x?',               a: '3' },
        { q: '2x = 8, x?',               a: '4' },
        { q: '2x = 10, x?',              a: '5' },
        { q: '3x = 6, x?',               a: '2' },
        { q: '3x = 9, x?',               a: '3' },
        { q: '3x = 12, x?',              a: '4' },
        { q: '4x = 8, x?',               a: '2' },
        { q: '5x = 10, x?',              a: '2' },
        { q: '2x = 12, x?',              a: '6' }
      ]
    },
    'probabilidad': {
      explicacion: 'La probabilidad mide las posibilidades de que ocurra algo.',
      ejemplo: 'Moneda: 1/2 para cara.',
      ejercicios: [
        { q: 'P(cara) moneda (ej: 1/2)', a: '1/2' },
        { q: 'P(cruz) moneda (ej: 1/2)', a: '1/2' },
        { q: 'P(sacar 3) dado (ej: 1/6)', a: '1/6' },
        { q: 'P(sacar 6) dado (ej: 1/6)', a: '1/6' },
        { q: 'P(sacar 1) dado (ej: 1/6)', a: '1/6' },
        { q: 'P(par) dado (ej: 1/2)',    a: '1/2' },
        { q: 'P(impar) dado (ej: 1/2)',  a: '1/2' },
        { q: 'P(sacar 2) dado (ej: 1/6)', a: '1/6' },
        { q: 'P(sacar 4) dado (ej: 1/6)', a: '1/6' },
        { q: 'P(sacar 5) dado (ej: 1/6)', a: '1/6' }
      ]
    }
  }
};

// ============================================================
// CONSTRUIR LOS TOPICS COMPLETOS PARA UNA EDAD DADA
// Coge la estructura de TOPICS_BASE y le añade:
//   - explicacion y ejemplo (segun edad)
//   - 10 ejercicios (segun edad)
//   - stars y maxStars
//   - hints genericos
// ============================================================
export function buildTopicsForAge(age) {
  const content = CONTENT_BY_AGE[String(age)] || CONTENT_BY_AGE['11'];
  return TOPICS_BASE.map(t => {
    const c = content[t.id] || { explicacion: '', ejemplo: '', ejercicios: [] };
    return Object.assign({}, t, {
      explicacion: c.explicacion,
      ejemplo: c.ejemplo,
      ejercicios: c.ejercicios,
      stars: 0,
      maxStars: 9,
      hints: ['Piensa despacio.', 'Revisa tu respuesta.']
    });
  });
}