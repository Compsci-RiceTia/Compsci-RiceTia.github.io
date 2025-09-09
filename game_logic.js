/**
 * Name: Tia Rice
 * Project Name: Lossy Compression: The Game
 * Description: Interactive browser-based game that visualizes lossy compression 
 * Date: 9/9/2025
 */

const list_of_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const list_of_sentences = [
  "Hi! How are you doing?",
  "The weather in Sacramento is nice.",
  "Lossy compression removes data.",
  "Signal processing is powerful."
];

const fontOptions = [
  "Brush Script MT, cursive",
  "Comic Sans MS, cursive",
  "Impact, fantasy",
  "Courier New, monospace",
  "Times New Roman, serif"
];

let selected_letters = []; // store letters manipulated
let selected_sentence = ""; 
let manipulated_sentence = "";
let gameActive = false; // if game active check user input
let currentMode = ""; 

// title distortion for header
const title = "Lossy Compression:<br>The Game";
const titleHeader = document.getElementById("titleHeader");

let distortedTitle = "";

for (let i = 0; i < title.length; i++) {
  const char = title[i];

  // if <br> tag don't distort but add to title still
  if (char === "<" || char === "b" || char === "r" || char === ">") {
    distortedTitle += char;
  } else {
    const font = fontOptions[Math.floor(Math.random() * fontOptions.length)];
    distortedTitle += `<span style="font-family:${font}">${char}</span>`;
  }
}

titleHeader.innerHTML = `<h1>${distortedTitle}</h1>`;


/**
 * Sets the current game mode and initializes the game screen
 * Hides the mode selection UI and starts a new sentence
 * 
 * @param {string} mode - The selected compression mode ("remove" or "font").
 */
function selectMode(mode) {
  currentMode = mode;
  document.getElementById("modeScreen").style.display = "none"; // hide selection screen
  document.getElementById("gameScreen").style.display = "flex"; // show game
  startNewSentence();
}

/**
 * Resets the game state and UI elements
 * Returns the user to the mode selection screen
 */
function goBack() {
  document.getElementById("gameScreen").style.display = "none"; // hide game
  document.getElementById("modeScreen").style.display = "flex"; // show selection
  selected_letters = []; // reset letters used in manipulation
  selected_sentence = ""; // clear test sentence
  manipulated_sentence = ""; // clear manipulated sentence
  document.getElementById("compressedDisplay").innerHTML = ""; // stop display of compressed sentence
  document.getElementById("userGuess").value = ""; // reset user guess
  document.getElementById("feedback").innerHTML = ""; // remove feedback to gues
  gameActive = false;
}

/**
 * Applies random font styles to each alpha in the sentence
 * 
 * @param {string} sentence - The sentence to distort
 * @returns {string} - The HTML string with distorted fonts
 */
function distortWithFonts(sentence) {
  eachLetter = sentence.split("");
  let distorted = "";
  for (let i=0; i < eachLetter.length; i++){
    const currentChar = eachLetter[i];
    if (/[a-zA-Z]/.test(currentChar)){
      const font = fontOptions[Math.floor(Math.random() * fontOptions.length)];
      distorted += `<span style="font-family:${font}">${currentChar}</span>`;
    } 
    else {
      distorted += currentChar;
    }
  }
  return distorted;
}

/**
 * Removes a randomly selected unused letter from the original sentence
 * Updates and displays the manipulated sentence
 */
function removeNextLetter() {
  if (!gameActive || currentMode !== "remove") return;

  // check if sentence has lost too much info
  if (manipulated_sentence.replace(/[^a-zA-Z]/g, '').length <= 15) {
    document.getElementById("feedback").innerHTML = "<strong>Too much information was lost. Moving to a new sentence.</strong>";
    selected_letters = [];
    setTimeout(startNewSentence, 2000);
    return;
  }

  // remove a letter in every compressed sentence
  let new_letter = list_of_letters[Math.floor(Math.random() * list_of_letters.length)];
  while (
    !selected_sentence.toUpperCase().includes(new_letter) ||
    selected_letters.includes(new_letter)
  ) {
    new_letter = list_of_letters[Math.floor(Math.random() * list_of_letters.length)];
  }

  selected_letters.push(new_letter); // store all letters removed

  manipulated_sentence = selected_sentence;

  for (let i = 0; i < selected_letters.length; i++) {
      const letter = selected_letters[i];
      const regex = new RegExp(letter, "gi"); // remove all occurrences of letter, case-insensitive
      manipulated_sentence = manipulated_sentence.replace(regex, "");
    }
  document.getElementById("compressedDisplay").innerText = manipulated_sentence;
}

/**
 * Initializes a new sentence and applies the selected compression mode
 */
function startNewSentence() {
  selected_sentence = list_of_sentences[Math.floor(Math.random() * list_of_sentences.length)];
  manipulated_sentence = selected_sentence;
  gameActive = true;

  if (currentMode === "remove") {
    for (let i = 0; i < selected_letters.length; i++) {
      const letter = selected_letters[i];
      const regex = new RegExp(letter, "gi"); // remove all occurrences of letter, case-insensitive
      manipulated_sentence = manipulated_sentence.replace(regex, "");
    }
    document.getElementById("compressedDisplay").innerText = manipulated_sentence;
    removeNextLetter();
  } else if (currentMode === "font") {
    document.getElementById("compressedDisplay").innerHTML = distortWithFonts(manipulated_sentence);
  }

  document.getElementById("userGuess").value = "";
  document.getElementById("feedback").innerHTML = "";
}


/**
 * Compares the user's guess to the original sentence
 * Provides feedback and starts a new round
 */
function checkGuess() {
  if (!gameActive) return;

  const guess = document.getElementById("userGuess").value.toUpperCase();
  const original = selected_sentence.toUpperCase();

  if (guess === original) {
    document.getElementById("feedback").innerHTML = "<strong>Correct! Moving to a new sentence.</strong>";
    setTimeout(startNewSentence, 2000);
    return;
  }

  // collect amount correct in user's guess
  let score = 0; 
  for (let i = 0; i < original.length; i++) {
    if (guess[i] === original[i]) {
      score++;
    }
  }

  const accuracy = Math.round((score / original.length) * 100);

  if (accuracy < 80) {
    document.getElementById("feedback").innerHTML = "<strong>See? Lossy compression affects clarity.</strong>";
  } else {
    document.getElementById("feedback").innerHTML = "<strong>Great reconstruction! You beat the compression.</strong>";
  }

  setTimeout(startNewSentence, 2000);
}

// Allow Enter key
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userGuess").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      checkGuess();
    }
  });
});

