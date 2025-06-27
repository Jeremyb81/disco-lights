const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('#startButton');
const score = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');
const backgroundMusic = document.getElementById('backgroundMusic');
const whackSound = document.getElementById('whackSound');

let time = 0;
let timer;
let lastHole = null;
let points = 0;
let difficulty = "hard";
let gameIsRunning = false;

function playMusic() {
  backgroundMusic.play().catch(err => {
    console.warn("Autoplay prevented:", err);
  });
}

function stopMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setDelay(difficulty) {
  if (difficulty === "easy") return 1500;
  if (difficulty === "normal") return 1000;
  return randomInteger(600, 1200);
}

function chooseHole(holes) {
  let hole;
  do {
    const index = randomInteger(0, holes.length - 1);
    hole = holes[index];
  } while (hole === lastHole);
  lastHole = hole;
  return hole;
}

function toggleVisibility(hole) {
  const mole = hole.querySelector('.mole');
  mole.classList.toggle('show');
}

function showUp() {
  const delay = setDelay(difficulty);
  const hole = chooseHole(holes);
  toggleVisibility(hole);
  setTimeout(() => {
    toggleVisibility(hole);
    if (time > 0) {
      showUp();
    } else {
      stopGame();
    }
  }, delay);
}

function updateScore() {
  points++;
  score.textContent = points;
  return points;
}

function clearScore() {
  points = 0;
  score.textContent = points;
  return points;
}

function updateTimer() {
  time--;
  timerDisplay.textContent = time;
  if (time <= 0) {
    clearInterval(timer);
    stopGame();
  }
  return time;
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
  return timer;
}

function whack(event) {
  updateScore();
  event.target.classList.remove('show');

  if (whackSound) {
    whackSound.currentTime = 0; // rewind to start
    whackSound.play().catch(err => {
      console.warn("Whack sound could not play:", err);
    });
  }

  return points;
}

function setEventListeners() {
  moles.forEach(mole => mole.addEventListener('click', whack));
  return moles;
}

function setDuration(duration) {
  time = duration;
  timerDisplay.textContent = time;
  return time;
}

function stopGame() {
  clearInterval(timer);
  stopMusic();
  gameIsRunning = false;
  moles.forEach(mole => mole.classList.remove('show'));
  return "game stopped";
}

function startGame() {
  if (gameIsRunning) return;
  gameIsRunning = true;

  clearScore();
  setDuration(30);
  setEventListeners();
  startTimer();
  showUp();
  playMusic();

  return "game started";
}

moles.forEach(mole => {
  mole.style.cursor = 'pointer';
});

startButton.addEventListener('click', startGame);
backgroundMusic.volume = 0.2; //  
whackSound.volume = 0.7; // 70% volume