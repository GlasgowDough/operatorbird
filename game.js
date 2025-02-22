const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 2,
    lift: -30,
    velocity: 0
};

let pipes = [];
let frame = 0;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 100 === 0) {
        let gap = 100;
        let top = Math.random() * (canvas.height - gap);
        pipes.push({
            x: canvas.width,
            width: 50,
            top: top,
            bottom: canvas.height - top - gap
        });
    }
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });
    pipes = pipes.filter(pipe => pipe.x > -pipe.width);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        bird.y = 150;
        bird.velocity = 0;
        pipes = [];
        frame = 0;
    }
}

function checkCollision(bird, pipe) {
    return (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (
            bird.y < pipe.top ||
            bird.y + bird.height > canvas.height - pipe.bottom
        )
    );
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updatePipes();
    updateBird();
    pipes.forEach(pipe => {
        if (checkCollision(bird, pipe)) {
            bird.y = 150;
            bird.velocity = 0;
            pipes = [];
            frame = 0;
        }
    });
    frame++;
    requestAnimationFrame(update);
}

canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
});

update();
