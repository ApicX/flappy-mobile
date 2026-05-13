// =====================
// CANVAS
// =====================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// =====================
// UI
// =====================

const scoreText =
document.getElementById("scoreText");


// =====================
// GAME VARIABLES
// =====================

let gameRunning = false;

let gravity = 0.5;

let score = 0;

let animationId;


// =====================
// BIRD
// =====================

const bird = {

  x: 120,
  y: 300,

  width: 50,
  height: 50,

  velocity: 0

};


// =====================
// PIPE SETTINGS
// =====================

let pipes = [];

let pipeWidth = 80;

let pipeGap = 250;

let pipeSpeed = 4;

let pipeTimer = 0;


// =====================
// START GAME
// =====================

function startGame() {

  if (gameRunning) return;

  gameRunning = true;

  score = 0;

  pipes = [];

  pipeTimer = 0;

  bird.y = 300;

  bird.velocity = 0;

  scoreText.innerText = score;

  gameLoop();

}


// =====================
// CREATE PIPE
// =====================

function createPipe() {

  let minTop = 50;

  let maxTop = canvas.height
               - pipeGap
               - 50;

  let topHeight =

    Math.random() *

    (maxTop - minTop)

    + minTop;

  pipes.push({

    x: canvas.width,

    top: topHeight,

    scored: false

  });

}


// =====================
// GAME LOOP
// =====================

function gameLoop() {

  if (!gameRunning) return;

  animationId = requestAnimationFrame(gameLoop);


  // CLEAR SCREEN

  ctx.clearRect(

    0,
    0,

    canvas.width,
    canvas.height

  );


  // =====================
  // BIRD
  // =====================

  bird.velocity += gravity;

  bird.y += bird.velocity;


  // DRAW BIRD

  ctx.fillStyle = "red";

  ctx.fillRect(

    bird.x,
    bird.y,

    bird.width,
    bird.height

  );


  // =====================
  // PIPE TIMER
  // =====================

  pipeTimer++;

  if (pipeTimer > 100) {

    createPipe();

    pipeTimer = 0;

  }


  // =====================
  // PIPES
  // =====================

  for (

    let i = pipes.length - 1;

    i >= 0;

    i--

  ) {

    let pipe = pipes[i];

    pipe.x -= pipeSpeed;


    // TOP PIPE

    ctx.fillStyle = "green";

    ctx.fillRect(

      pipe.x,
      0,

      pipeWidth,
      pipe.top

    );


    // BOTTOM PIPE

    let bottomY =

      pipe.top + pipeGap;

    let bottomHeight =

      canvas.height - bottomY;

    ctx.fillRect(

      pipe.x,
      bottomY,

      pipeWidth,
      bottomHeight

    );


    // =====================
    // SCORE
    // =====================

    if (

      !pipe.scored &&

      pipe.x + pipeWidth < bird.x

    ) {

      pipe.scored = true;

      score++;

      scoreText.innerText = score;

    }


    // =====================
    // REMOVE PIPE
    // =====================

    if (

      pipe.x + pipeWidth < 0

    ) {

      pipes.splice(i, 1);

    }


    // =====================
    // COLLISION
    // =====================

    if (

      bird.x + bird.width >

      pipe.x &&

      bird.x <

      pipe.x + pipeWidth

    ) {

      if (

        bird.y < pipe.top ||

        bird.y + bird.height >

        bottomY

      ) {

        gameOver();

      }

    }

  }


  // =====================
  // FLOOR / SKY
  // =====================

  if (

    bird.y < 0 ||

    bird.y + bird.height >

    canvas.height

  ) {

    gameOver();

  }

}


// =====================
// TOUCH CONTROLS
// =====================

window.addEventListener(

  "touchstart",

  () => {

    if (gameRunning) {

      bird.velocity = -9;

    }

  }

);


// =====================
// GAME OVER
// =====================

function gameOver() {

  gameRunning = false;

  cancelAnimationFrame(animationId);

  alert(

    "Game Over\nScore: " + score

  );

  location.reload();

}
