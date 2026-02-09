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

  inputEl.value = filterInput(inputEl.value, alphabet);
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
  const text = inputEl.value;

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

  outputEl.value = result;
}


// Работа с файлами
loadFileBtn.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return;

  const text = await file.text();
  inputEl.value = text.toUpperCase();
  applyInputRestriction();
};

downloadBtn.onclick = () => {
  const blob = new Blob([outputEl.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "result.txt";
  a.click();

  URL.revokeObjectURL(url);
};


// алгоритмы
function encryptColumnar(text, key) {
  // TODO: улучшенный столбцовый метод
  return text;
}

function decryptColumnar(text, key) {
  // TODO
  return text;
}

function encryptVigenereAutokey(text, key) {
  // TODO
  return text;
}

function decryptVigenereAutokey(text, key) {
  // TODO
  return text;
}
