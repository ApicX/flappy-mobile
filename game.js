// ======================
// CANVAS
// ======================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// ======================
// UI
// ======================

const menu = document.getElementById("menu");
const shop = document.getElementById("shop");
const leaderboard = document.getElementById("leaderboard");

const scoreText = document.getElementById("scoreText");
const coinsText = document.getElementById("coins");


// ======================
// GAME VARIABLES
// ======================

let gameStarted = false;

let gravity = 0.5;

let score = 0;


// ======================
// COINS
// ======================

let coins = localStorage.getItem("coins");

if (coins == null) {

  coins = 0;

}

coinsText.innerText = coins;


// ======================
// CHARACTER
// ======================

let birdColor = localStorage.getItem("birdColor");

if (birdColor == null) {

  birdColor = "red";

}


// ======================
// BIRD
// ======================

const bird = {

  x: 120,
  y: 300,

  width: 50,
  height: 50,

  velocity: 0

};


// ======================
// PIPE SETTINGS
// ======================

let pipes = [];

let pipeWidth = 90;

let pipeGap = 260;

let pipeSpeed = 4;


// ======================
// CREATE PIPE
// ======================

function createPipe() {

  let minHeight = 100;

  let maxHeight = canvas.height - pipeGap - 100;

  let pipeTop = Math.random() *

    (maxHeight - minHeight)

    + minHeight;

  pipes.push({

    x: canvas.width,

    top: pipeTop,

    passed: false

  });

}


// ======================
// PIPE SPAWN TIMER
// ======================

setInterval(() => {

  if (gameStarted) {

    createPipe();

  }

}, 2000);


// ======================
// START GAME
// ======================

function startGame() {

  menu.style.display = "none";

  canvas.style.display = "block";

  scoreText.style.display = "block";

  gameStarted = true;

  score = 0;

  scoreText.innerText = score;

  bird.y = 300;

  bird.velocity = 0;

  pipes = [];

  gameLoop();

}


// ======================
// GAME LOOP
// ======================

function gameLoop() {

  if (!gameStarted) return;

  requestAnimationFrame(gameLoop);

  ctx.clearRect(

    0,
    0,

    canvas.width,
    canvas.height

  );


  // ======================
  // BIRD PHYSICS
  // ======================

  bird.velocity += gravity;

  bird.y += bird.velocity;


  // ======================
  // DRAW BIRD
  // ======================

  ctx.fillStyle = birdColor;

  ctx.fillRect(

    bird.x,
    bird.y,

    bird.width,
    bird.height

  );


  // ======================
  // DRAW PIPES
  // ======================

  for (let i = pipes.length - 1; i >= 0; i--) {

    let pipe = pipes[i];

    pipe.x -= pipeSpeed;

    ctx.fillStyle = "green";


    // ======================
    // TOP PIPE
    // ======================

    ctx.fillRect(

      pipe.x,
      0,

      pipeWidth,
      pipe.top

    );


    // ======================
    // BOTTOM PIPE
    // ======================

    let bottomY = pipe.top + pipeGap;

    let bottomHeight =

      canvas.height - bottomY;

    ctx.fillRect(

      pipe.x,
      bottomY,

      pipeWidth,
      bottomHeight

    );


    // ======================
    // SCORE
    // ======================

    if (

      !pipe.passed &&
      pipe.x + pipeWidth < bird.x

    ) {

      pipe.passed = true;

      score++;

      scoreText.innerText = score;

    }


    // ======================
    // REMOVE OLD PIPES
    // ======================

    if (pipe.x + pipeWidth < 0) {

      pipes.splice(i, 1);

    }


    // ======================
    // COLLISION
    // ======================

    if (

      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth &&

      (

        bird.y < pipe.top ||

        bird.y + bird.height >

        bottomY

      )

    ) {

      gameOver();

    }

  }


  // ======================
  // FLOOR / SKY COLLISION
  // ======================

  if (

    bird.y + bird.height > canvas.height ||

    bird.y < 0

  ) {

    gameOver();

  }

}


// ======================
// TOUCH CONTROLS
// ======================

window.addEventListener(

  "touchstart",

  function () {

    if (gameStarted) {

      bird.velocity = -9;

    }

  }

);


// ======================
// GAME OVER
// ======================

function gameOver() {

  gameStarted = false;

  coins = Number(coins) + score;

  localStorage.setItem(

    "coins",
    coins

  );

  coinsText.innerText = coins;

  saveScore(score);

  alert(

    "Game Over\nScore: " + score

  );

  location.reload();

}


// ======================
// SHOP
// ======================

function openShop() {

  menu.style.display = "none";

  shop.style.display = "block";

}


function closeShop() {

  shop.style.display = "none";

  menu.style.display = "block";

}


// ======================
// CHARACTER SELECT
// ======================

function selectCharacter(color) {

  birdColor = color;

  localStorage.setItem(

    "birdColor",
    color

  );

  alert("Character Selected!");

}


// ======================
// SAVE LEADERBOARD
// ======================

function saveScore(score) {

  let scores = JSON.parse(

    localStorage.getItem("scores")

  ) || [];

  scores.push(score);

  scores.sort((a, b) => b - a);

  scores = scores.slice(0, 10);

  localStorage.setItem(

    "scores",

    JSON.stringify(scores)

  );

}


// ======================
// OPEN LEADERBOARD
// ======================

function openLeaderboard() {

  menu.style.display = "none";

  leaderboard.style.display = "block";

  let list = document.getElementById(

    "leaderboardList"

  );

  list.innerHTML = "";

  let scores = JSON.parse(

    localStorage.getItem("scores")

  ) || [];


  for (let i = 0; i < scores.length; i++) {

    let li = document.createElement("li");

    li.innerText =

      (i + 1) + ". " + scores[i];

    list.appendChild(li);

  }

}


// ======================
// CLOSE LEADERBOARD
// ======================

function closeLeaderboard() {

  leaderboard.style.display = "none";

  menu.style.display = "block";

}
