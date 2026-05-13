// CANVAS

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// UI

const menu = document.getElementById("menu");
const shop = document.getElementById("shop");
const leaderboard = document.getElementById("leaderboard");
const scoreText = document.getElementById("scoreText");
const coinsText = document.getElementById("coins");


// GAME VARIABLES

let gameStarted = false;

let gravity = 0.5;

let score = 0;

let coins = localStorage.getItem("coins");

if (coins == null) {

  coins = 0;

}

coinsText.innerText = coins;


// CHARACTER

let birdColor = localStorage.getItem("birdColor");

if (birdColor == null) {

  birdColor = "yellow";

}


// BIRD

const bird = {

  x: 100,
  y: 300,
  width: 50,
  height: 50,
  velocity: 0

};


// PIPES

let pipes = [];


// START GAME

function startGame() {

  menu.style.display = "none";

  canvas.style.display = "block";

  scoreText.style.display = "block";

  gameStarted = true;

  score = 0;

  bird.y = 300;

  bird.velocity = 0;

  pipes = [];

  gameLoop();

}


// GAME LOOP

function gameLoop() {

  if (!gameStarted) return;

  requestAnimationFrame(gameLoop);

  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // BIRD PHYSICS

  bird.velocity += gravity;

  bird.y += bird.velocity;


  // DRAW BIRD

  ctx.fillStyle = birdColor;

  ctx.fillRect(

    bird.x,
    bird.y,
    bird.width,
    bird.height

  );


  // CREATE PIPES

  if (Math.random() < 0.02) {

    let pipeTop = Math.random() * 300 + 50;

    pipes.push({

      x: canvas.width,
      top: pipeTop,
      passed: false

    });

  }


  // DRAW PIPES

  for (let i = 0; i < pipes.length; i++) {

    let pipe = pipes[i];

    pipe.x -= 4;

    ctx.fillStyle = "green";


    // TOP PIPE

    ctx.fillRect(

      pipe.x,
      0,
      80,
      pipe.top

    );


    // BOTTOM PIPE

    ctx.fillRect(

      pipe.x,
      pipe.top + 180,
      80,
      canvas.height

    );


    // SCORE

    if (!pipe.passed && pipe.x < bird.x) {

      pipe.passed = true;

      score++;

      scoreText.innerText = score;

    }


    // COLLISION

    if (

      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + 80 &&

      (

        bird.y < pipe.top ||

        bird.y + bird.height > pipe.top + 180

      )

    ) {

      gameOver();

    }

  }


  // FLOOR COLLISION

  if (

    bird.y + bird.height > canvas.height ||

    bird.y < 0

  ) {

    gameOver();

  }

}


// TOUCH CONTROL

window.addEventListener("touchstart", function () {

  if (gameStarted) {

    bird.velocity = -8;

  }

});


// GAME OVER

function gameOver() {

  gameStarted = false;

  coins = Number(coins) + score;

  localStorage.setItem("coins", coins);

  coinsText.innerText = coins;

  saveScore(score);

  alert("Game Over\nScore: " + score);

  location.reload();

}


// SHOP

function openShop() {

  menu.style.display = "none";

  shop.style.display = "block";

}

function closeShop() {

  shop.style.display = "none";

  menu.style.display = "block";

}


// CHARACTER SELECT

function selectCharacter(color) {

  birdColor = color;

  localStorage.setItem("birdColor", color);

  alert("Character Selected!");

}


// LEADERBOARD

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


function openLeaderboard() {

  menu.style.display = "none";

  leaderboard.style.display = "block";

  let list = document.getElementById("leaderboardList");

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


function closeLeaderboard() {

  leaderboard.style.display = "none";

  menu.style.display = "block";

}
