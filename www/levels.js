// levels.js - agrupa as 160 palavras de words.js em 10 níveis (ilhas da
// trilha), respeitando a ordem/curadoria original de words.js. Não
// recalculamos nem reclassificamos sílabas aqui — apenas dividimos a lista
// já curada em blocos de 16 palavras, na mesma ordem em que aparecem no
// arquivo fonte.
const LEVELS = [
  { id: 1, start: 0, end: 16 },
  { id: 2, start: 16, end: 32 },
  { id: 3, start: 32, end: 48 },
  { id: 4, start: 48, end: 64 },
  { id: 5, start: 64, end: 80 },
  { id: 6, start: 80, end: 96 },
  { id: 7, start: 96, end: 112 },
  { id: 8, start: 112, end: 128 },
  { id: 9, start: 128, end: 144 },
  { id: 10, start: 144, end: 160 },
];
