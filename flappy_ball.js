canvas = document.getElementById('cvs');
context = canvas.getContext('2d');
var displayX = canvas.width;
var displayY = canvas.height;
var pipes = [];
var jumpTimer = 0;
var doJump = false;
var isStart = false;
var isDie = false;
var score = 0;
var ball = { x: displayX / 2 - 100, y: displayY / 2, w: 10, h: 10 };
var interval = null;

// check if clicked key equals 'Space'
document.body.onkeyup = function (e) {
    if (!isDie) {
        if (e.keyCode == 32 && ball.y > 18) {
            isStart = true;
            doJump = true;
            jumpTimer = 20;
        }
        if (e.key === "Escape") {
            drawStartScreen();
        }
    }
}

function drawStartScreen() {
    isStart = false;
    isDie = false;
    context.fillStyle = 'red';
    context.font = "40px Verdana";
    context.fillText("Press Space button to start", displayX / 2 - 300, displayY / 2);
}

function createPipe() {
    // pipeH => pipes Height
    let pipeH = Math.floor(Math.random() * (500 - 300) + 300);
    // pipeW => pipes Width
    let pipeW = Math.floor(Math.random() * (70 - 60) + 60);

    let bottomPipeY = displayY - pipeH + 250;
    let topPipeY = bottomPipeY - pipeH - Math.floor(Math.random() * (400 - 250) + 250);
    //dx  => X position for current pipes or random (200, 300) position for next pipes
    let dx = displayX - 250;
    if (pipes.length > 0) {
        dx = pipes[pipes.length - 1].x + Math.floor(Math.random() * (300 - 200) + 200);
    }
    pipes.push({ x: dx, y: bottomPipeY, w: pipeW, h: pipeH });
    pipes.push({ x: dx, y: topPipeY, w: pipeW, h: pipeH + 50 });
}

function drawGame() {
    context.clearRect(0, 0, displayX, displayY);
    context.font = "20px Verdana";
    context.fillStyle = 'green';
    for (let pipe of pipes) {
        context.fillRect(pipe.x, pipe.y, pipe.w, pipe.h);
    }
    context.fillStyle = 'red';
    context.fillText(`Max Score: ${~~score}`, 20, displayY - 20);
}

function movePipes() {
    for (pipe of pipes) {
        pipe.x -= 1;
        if (pipe.x < -100) {
            pipes.shift();
            createPipe();
        }
    }
}

function isCollide(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
        return true;
    }
}

function checkCollision() {
    for (let pipe of pipes) {
        if (ball.x === pipe.x + pipe.w) {
            score += 0.5;
        }
        if (isCollide(pipe, ball)) {
            //console.log(pipe, ball);
            drawStartScreen();
            isDie = true;
        }
        if (ball.y >= displayY) {
            reload()
        }
    }
}
function drawBallRadius(radius, color) {
    context.beginPath();
    context.arc(ball.x, ball.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.stroke();
    context.closePath();
}
function drawBall() {
    drawBallRadius(15, 'red');
    drawBallRadius(13, 'yellow');
}

function fly() {
    if (jumpTimer >= -20) {
        ball.y -= jumpTimer / 2;
        jumpTimer -= 1;
    } else {
        ball.y -= -7;
        doJump = false;
    }
}

function draw() {
    drawGame();
    drawBall();
    if (isDie) {
        fly();
    }
    else if (isStart) {
        movePipes();
        fly();
    } else {
        drawStartScreen();
    }
    checkCollision();
}

function reload() {
    clearInterval(interval);
    ball = { x: displayX / 2 - 100, y: displayY / 2, w: 15, h: 15 };
    pipes = [];
    drawStartScreen();
    start();
}

function start() {
    for (let i = 1; i < 11; i++) {
        createPipe();
    }
    interval = setInterval(draw, 10);
}

start();