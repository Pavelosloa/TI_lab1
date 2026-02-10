const algoEl = document.getElementById("algo");
const keyEl = document.getElementById("key");
const inputEl = document.getElementById("inputText");
const outputEl = document.getElementById("outputText");
const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const fileInput = document.getElementById("fileInput");
const loadFileBtn = document.getElementById("loadFile");
const downloadBtn = document.getElementById("downloadFile");

const ALPH_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPH_RU = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";


// Ограничение ввода
function filterInput(value, alphabet) {
  value = value.toUpperCase();
  let result = "";
  for (let ch of value) {
    if (alphabet.includes(ch)) {
      result += ch;
    }
  }
  return result;
}

function applyInputRestriction() {
  const algo = algoEl.value;
  const alphabet = algo === "col" ? ALPH_EN : ALPH_RU;

  inputEl.value = filterInput(inputEl.value, alphabet + " ");
  keyEl.value = filterInput(keyEl.value, alphabet);
}

inputEl.addEventListener("input", applyInputRestriction);
keyEl.addEventListener("input", applyInputRestriction);
algoEl.addEventListener("change", applyInputRestriction);


// Кнопки
encryptBtn.onclick = () => run(true);
decryptBtn.onclick = () => run(false);

function run(isEncrypt) {
  const algo = algoEl.value;
  const key = keyEl.value;
  const text = inputEl.value.split(" ").join("");

  if (!key) {
    alert("Введите ключ");
    return;
  }

  let result = "";


  if (algo === "col") {
    result = isEncrypt
      ? encryptColumnar(text, key)
      : decryptColumnar(text, key);
  } else {
    result = isEncrypt
      ? encryptVigenereAutokey(text, key)
      : decryptVigenereAutokey(text, key);
  }

  if (isEncrypt) {
    result = result.match(/.{1,5}/g).join(" ");
  }



  outputEl.value = result;
}


// Работа с файлами
loadFileBtn.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const content = await file.text();

  const lines = content.replace(/\r/g, "").split("\n");

  if (lines.length === 0) return;

  keyEl.value = lines[0].toUpperCase();
  inputEl.value = lines.slice(1).join("\n").toUpperCase();

  applyInputRestriction();
};


downloadBtn.onclick = () => {
  const blob = new Blob([outputEl.value], {type: "text/plain"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "result.txt";
  a.click();

  URL.revokeObjectURL(url);
};


// алгоритмы
function encryptColumnar(text, key) {
  let result = "";

  key = key.toUpperCase();

  let matrix = Array.from({length: key.length}, () => [0]);

  let counter = 1;

  for (let ch of ALPH_EN) {
    if (key.includes(ch)) {
      for (let i = 0; i < key.length; i++) {
        if (key[i] === ch) {
          matrix[i][0] = counter;
          counter++;
        }
      }
    }
  }

  counter = 0;
  for (let ch of text) {
    matrix[counter++].push(ch);
    if (counter > matrix.length - 1) {
      counter = 0;
    }
  }

  for (let i = 1; i <= matrix.length; i++) {
    let col = matrix.find(val => val[0] === i);
    for (let ch of col.slice(1)) {
      result += ch;
    }
  }

  console.log(matrix);
  return result;
}


function decryptColumnar(text, key) {
  key = key.toUpperCase();
  const cols = key.length;
  let result = "";

  // Порядок столбцов
  let order = Array(cols).fill(0);
  let counter = 1;

  for (let ch of ALPH_EN) {
    for (let i = 0; i < cols; i++) {
      if (key[i] === ch) {
        order[i] = counter++;
      }
    }
  }

  // Длины столбцов (в исходном порядке)
  const baseRows = Math.floor(text.length / cols);
  const extra = text.length % cols;

  let colLengths = [];
  for (let i = 0; i < cols; i++) {
    colLengths[i] = baseRows + (i < extra ? 1 : 0);
  }

  // Матрица столбцов
  let columns = Array(cols).fill("").map(() => "");

  let pos = 0;

  // заполняем в порядке ключа (1,2,3...)
  for (let num = 1; num <= cols; num++) {
    let colIndex = order.indexOf(num);
    let len = colLengths[colIndex];

    columns[colIndex] = text.slice(pos, pos + len);
    pos += len;
  }

  // Чтение по строкам
  const maxRows = Math.max(...colLengths);

  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < cols; col++) {
      if (columns[col][row]) {
        result += columns[col][row];
      }
    }
  }

  return result;
}

function encryptVigenereAutokey(text, key) {
  let result = "";
  let autokey = key;

  if (autokey.length > text.length) {
    autokey = autokey.slice(0, text.length);
  } else {
    let counter = 0;
    while (autokey.length < text.length) {
      autokey += text[counter++];
    }
  }
  console.log(autokey);

  for (let i = 0; i < text.length; i++) {
    let charIdx = (ALPH_RU.indexOf(text[i]) + ALPH_RU.indexOf(autokey[i])) % ALPH_RU.length;
    result += ALPH_RU[charIdx];
  }

  return result;
}

function decryptVigenereAutokey(text, key) {
  let result = "";
  let autokey = key;

  for (let i = 0; i < text.length; i++) {
    let charIdx = (ALPH_RU.indexOf(text[i]) - ALPH_RU.indexOf(autokey[i]) + ALPH_RU.length) % ALPH_RU.length;
    result += ALPH_RU[charIdx];
    if (autokey.length < text.length) {
      autokey += ALPH_RU[charIdx];
    }
  }

  return result;
}
