const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const framerate = 60;

let score = 0;
let colliding = false;

const player = {
    x : 25,
    y : canvas.height / 2 - 80 / 2,
    width: 10,
    height: 80,
    color: "#96031A",
    score: 0
}

const ball = {
    x : canvas.width / 2 - 100,
    y : canvas.width / 2,
    radius: 10,
    speed: 4,
    velX: 4,
    velY: 4,
    color: "#FAA916"
}

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawText(text, color) {
    context.fillStyle = color;
    context.font = "700 20em fantasy";
    context.textBaseline = 'middle';
    context.textAlign = "center"; 
    context.fillText(text, canvas.width / 2, canvas.height / 2);
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "#FBFFFE");
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawText(score, "#00000030");
}

canvas.addEventListener("mousemove", movePlayer);

function movePlayer(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
}

canvas.addEventListener("mousedown", resetGame);

function resetGame() {
    score = 0;
    ball.x = canvas.width / 2 - 100;
    ball.y = canvas.width / 2;
    ball.velX = 4;
    ball.velY = 4;
    ball.speed = 4;
}

function collision() {
    let bTop = ball.y - ball.radius / 2;
    let bBottom = ball.y + ball.radius / 2;
    let bLeft = ball.x - ball.radius / 2;
    let bRight = ball.x + ball.radius / 2;

    let pTop = player.y;
    let pBottom = player.y + player.height;
    let pLeft = player.x;
    let pRight = player.x + player.width;

    return bRight > pLeft && bBottom > pTop && bLeft < pRight && bTop < pBottom;
}

function gameOver() {
    return ball.x + ball.radius < 0;
}

function update() {
    ball.x += ball.velX;
    ball.y += ball.velY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
        ball.velY *= -1;
    if (ball.x + ball.radius> canvas.width)
        ball.velX *= -1;

    if (collision() && !colliding) {
        let collidePoint = ball.y - (player.y + player.height);
        collidePoint = collidePoint / player.height / 2;
        let angle = collidePoint * Math.PI / 4;
        ball.velX = ball.speed * Math.cos(angle);
        ball.velY = ball.speed * Math.sin(angle);
        ball.speed += 0.1;
        score++;
        colliding = true;
    }

    if (!collision()) colliding = false;

    if (gameOver()) {
        resetGame();
    }
}

function loop() {
    update();
    draw();
}

setInterval(loop, 1000 / framerate);