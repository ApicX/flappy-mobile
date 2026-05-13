const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreText =
document.getElementById("score");


// ===================
// BIRD
// ===================

const bird = {

  x:100,
  y:300,

  width:40,
  height:40,

  velocity:0

};

let gravity = 0.5;


// ===================
// GAME
// ===================

let score = 0;

let gameOver = false;


// ===================
// PIPES
// ===================

let pipes = [];

const pipeWidth = 80;

const pipeGap = 220;

const pipeSpeed = 3;

let frame = 0;


// ===================
// CREATE PIPE
// ===================

function createPipe(){

  let topHeight =
    Math.random() * 250 + 50;

  pipes.push({

    x:canvas.width,

    top:topHeight

  });

}


// ===================
// UPDATE
// ===================

function update(){

  if(gameOver) return;

  requestAnimationFrame(update);

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // ===================
  // BIRD
  // ===================

  bird.velocity += gravity;

  bird.y += bird.velocity;

  ctx.fillStyle = "red";

  ctx.fillRect(

    bird.x,
    bird.y,

    bird.width,
    bird.height

  );


  // ===================
  // CREATE PIPES
  // ===================

  frame++;

  if(frame % 120 === 0){

    createPipe();

  }


  // ===================
  // DRAW PIPES
  // ===================

  for(let i=0;i<pipes.length;i++){

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

    ctx.fillRect(

      pipe.x,
      bottomY,

      pipeWidth,
      canvas.height - bottomY

    );


    // ===================
    // SCORE
    // ===================

    if(pipe.x + pipeWidth === bird.x){

      score++;

      scoreText.innerText = score;

    }


    // ===================
    // COLLISION
    // ===================

    if(

      bird.x + bird.width > pipe.x &&

      bird.x < pipe.x + pipeWidth

    ){

      if(

        bird.y < pipe.top ||

        bird.y + bird.height >

        bottomY

      ){

        endGame();

      }

    }

  }


  // ===================
  // FLOOR / SKY
  // ===================

  if(

    bird.y < 0 ||

    bird.y + bird.height >

    canvas.height

  ){

    endGame();

  }

}


// ===================
// TOUCH
// ===================

window.addEventListener(

  "touchstart",

  ()=>{

    bird.velocity = -8;

  }

);


// ===================
// GAME OVER
// ===================

function endGame(){

  gameOver = true;

  alert("Game Over");

  location.reload();

}


// START GAME

update();
