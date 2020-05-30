const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const framerate = 60;

let score = 0;

// prevents ball from recognizing collision more than once (per multiple frames)
let colliding = false;

const player = {
    x : 25,
    y : canvas.height / 2 - 80 / 2,
    width: 10,
    height: 80,
    color: "#96031A",
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

// draws rectangle of width w and height h to the screen at point (x, y)
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// draws circle of given radius r to the screen at point (x, y)
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// draws score text
function drawText(text, color) {
    context.fillStyle = color;
    context.font = "700 10em Poppins";
    context.textBaseline = 'middle';
    context.textAlign = "center"; 
    context.fillText(text, canvas.width / 2, canvas.height / 2 + 20);
}

// updates canvas looks
function draw() {
    // clears screen
    drawRect(0, 0, canvas.width, canvas.height, "#FBFFFE");

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawText(score, "#00000030");
}

// checks for mouse movement to change players y coordinate
canvas.addEventListener("mousemove", movePlayer);

function movePlayer(evt) {
    let rect = canvas.getBoundingClientRect();

    // normalizes cursor position based on scrolling position
    player.y = evt.clientY - rect.top - player.height / 2;
}

// checks for mouse click to reset game to initial state
canvas.addEventListener("mousedown", resetGame);

// sets all stats to their initial values
function resetGame() {
    score = 0;
    ball.x = canvas.width / 2 - 100;
    ball.y = canvas.width / 2;
    ball.velX = 4;
    ball.velY = 4;
    ball.speed = 4;
}

function collision() {
    // returns ball's coordinates
    let bTop = ball.y - ball.radius / 2;
    let bBottom = ball.y + ball.radius / 2;
    let bLeft = ball.x - ball.radius / 2;
    let bRight = ball.x + ball.radius / 2;

    // returns player's coordinates
    let pTop = player.y;
    let pBottom = player.y + player.height;
    let pLeft = player.x;
    let pRight = player.x + player.width;

    // compares overlapping points of player and ball
    return bRight > pLeft && bBottom > pTop && bLeft < pRight && bTop < pBottom;
}

// checks whether ball is outside the left screen bound
function gameOver() {
    return ball.x + ball.radius < 0;
}

function update() {
    ball.x += ball.velX;
    ball.y += ball.velY;

    // switches ball's direction if it hits walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
        ball.velY *= -1;
    if (ball.x + ball.radius> canvas.width)
        ball.velX *= -1;

    // changes states if colliding
    if (collision() && !colliding) {
        // retrieves point of collision to provide different behavior based on where it happened
        let collidePoint = ball.y - (player.y + player.height);
        collidePoint = collidePoint / player.height / 2;
        
        // switches ball's direction
        let angle = collidePoint * Math.PI / 4;
        ball.velX = ball.speed * Math.cos(angle);
        ball.velY = ball.speed * Math.sin(angle);
        ball.speed += 0.1;
        score++;

        // prevents multiple collisions between frames when ball hasn't left yet
        colliding = true;
    }

    if (!collision()) colliding = false;

    if (gameOver()) {
        resetGame();
    }
}

// clears screen and draws each frame
function loop() {
    update();
    draw();
}

// updates screen at given rate (per second)
setInterval(loop, 1000 / framerate);