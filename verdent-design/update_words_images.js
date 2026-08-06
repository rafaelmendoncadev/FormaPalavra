const fs = require("fs");
const path = require("path");

const wordsPath = path.join(__dirname, "..", "www", "words.js");
let content = fs.readFileSync(wordsPath, "utf8");

function slugify(word) {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

const re = /\{ word: "([^"]+)", syllables: (\[[^\]]*\]) \}/g;
let count = 0;
const slugs = [];
content = content.replace(re, (match, word, syllablesArr) => {
  count++;
  const slug = slugify(word);
  slugs.push(slug);
  return `{ word: "${word}", syllables: ${syllablesArr}, image: "assets/images/words/${slug}.png" }`;
});

fs.writeFileSync(wordsPath, content, "utf8");
console.log("Entradas atualizadas:", count);
fs.writeFileSync(
  path.join(__dirname, "word_slugs.json"),
  JSON.stringify(slugs, null, 2),
  "utf8"
);
console.log("Slugs unicos:", new Set(slugs).size);
