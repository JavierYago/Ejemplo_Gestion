let breakoutCanvas = null;
let breakoutCtx = null;
let breakoutBall = { x: 0, y: 0, dx: 3, dy: -3, radius: 8 };
let breakoutPaddle = { x: 0, width: 80, height: 12 };
let breakoutBricks = [];
let breakoutScore = 0;
let breakoutLives = 3;
let breakoutLevel = 1;
let breakoutGameOver = false;
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 400;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 55;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 10;

const BRICK_COLORS = [
    '#ff0066', '#ff6b35', '#ffd700', '#00ff88', '#00d4ff', '#9d4edd'
];

function initBreakout(difficulty) {
    breakoutScore = 0;
    breakoutLives = 3;
    breakoutLevel = 1;
    breakoutGameOver = false;
    
    const speeds = {
        'facil': { dx: 2, dy: -2 },
        'medio': { dx: 3, dy: -3 },
        'dificil': { dx: 4, dy: -4 }
    };
    const speed = speeds[difficulty];
    breakoutBall.dx = speed.dx;
    breakoutBall.dy = speed.dy;
    
    createBreakoutBoard();
}

function createBreakoutBoard() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="breakout-game">
            <div class="breakout-info">
                <div>Puntos: <span id="breakout-score">0</span></div>
                <div>Vidas: <span id="breakout-lives">❤️❤️❤️</span></div>
                <div>Nivel: <span id="breakout-level">1</span></div>
            </div>
            <canvas id="breakoutCanvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}"></canvas>
            <div class="breakout-controls">
                <button onclick="initBreakout(currentDifficulty)">Nuevo Juego</button>
                <p style="color: #00d4ff; margin-top: 10px;">Usa el ratón o ← → para mover la paleta</p>
            </div>
        </div>
    `;
    
    breakoutCanvas = document.getElementById('breakoutCanvas');
    breakoutCtx = breakoutCanvas.getContext('2d');
    
    breakoutPaddle.x = (CANVAS_WIDTH - breakoutPaddle.width) / 2;
    breakoutBall.x = CANVAS_WIDTH / 2;
    breakoutBall.y = CANVAS_HEIGHT - 40;
    
    initBricks();
    
    breakoutCanvas.addEventListener('mousemove', handleBreakoutMouseMove);
    document.addEventListener('keydown', handleBreakoutKeypress);
    
    startBreakoutGame();
}

function initBricks() {
    breakoutBricks = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
        breakoutBricks[row] = [];
        for (let col = 0; col < BRICK_COLS; col++) {
            breakoutBricks[row][col] = {
                x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
                y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
                status: 1,
                color: BRICK_COLORS[row % BRICK_COLORS.length]
            };
        }
    }
}

function handleBreakoutMouseMove(e) {
    const rect = breakoutCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    if (mouseX > 0 && mouseX < CANVAS_WIDTH) {
        breakoutPaddle.x = mouseX - breakoutPaddle.width / 2;
    }
}

function handleBreakoutKeypress(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        breakoutPaddle.x = Math.max(0, breakoutPaddle.x - 20);
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        breakoutPaddle.x = Math.min(CANVAS_WIDTH - breakoutPaddle.width, breakoutPaddle.x + 20);
    }
}

function startBreakoutGame() {
    clearInterval(window.breakoutInterval);
    window.breakoutInterval = setInterval(updateBreakout, 1000/60);
}

function updateBreakout() {
    if (breakoutGameOver) return;
    
    // Mover la bola
    breakoutBall.x += breakoutBall.dx;
    breakoutBall.y += breakoutBall.dy;
    
    // Colisión con paredes
    if (breakoutBall.x + breakoutBall.radius > CANVAS_WIDTH || breakoutBall.x - breakoutBall.radius < 0) {
        breakoutBall.dx = -breakoutBall.dx;
    }
    
    if (breakoutBall.y - breakoutBall.radius < 0) {
        breakoutBall.dy = -breakoutBall.dy;
    }
    
    // Colisión con la paleta
    if (breakoutBall.y + breakoutBall.radius > CANVAS_HEIGHT - breakoutPaddle.height) {
        if (breakoutBall.x > breakoutPaddle.x && breakoutBall.x < breakoutPaddle.x + breakoutPaddle.width) {
            // Cambiar ángulo según dónde golpee la paleta
            const hitPos = (breakoutBall.x - breakoutPaddle.x) / breakoutPaddle.width;
            const angle = (hitPos - 0.5) * Math.PI / 3;
            const speed = Math.sqrt(breakoutBall.dx * breakoutBall.dx + breakoutBall.dy * breakoutBall.dy);
            breakoutBall.dx = speed * Math.sin(angle);
            breakoutBall.dy = -speed * Math.cos(angle);
        }
    }
    
    // Bola cae
    if (breakoutBall.y - breakoutBall.radius > CANVAS_HEIGHT) {
        breakoutLives--;
        updateLives();
        
        if (breakoutLives > 0) {
            resetBall();
        } else {
            endBreakoutGame();
        }
    }
    
    // Colisión con ladrillos
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
            const brick = breakoutBricks[row][col];
            if (brick.status === 1) {
                if (breakoutBall.x > brick.x && 
                    breakoutBall.x < brick.x + BRICK_WIDTH &&
                    breakoutBall.y > brick.y && 
                    breakoutBall.y < brick.y + BRICK_HEIGHT) {
                    
                    breakoutBall.dy = -breakoutBall.dy;
                    brick.status = 0;
                    breakoutScore += 10 * breakoutLevel;
                    document.getElementById('breakout-score').textContent = breakoutScore;
                    
                    // Verificar si quedan ladrillos
                    if (checkAllBricksDestroyed()) {
                        nextLevel();
                    }
                }
            }
        }
    }
    
    drawBreakout();
}

function drawBreakout() {
    // Fondo
    breakoutCtx.fillStyle = '#0a0a15';
    breakoutCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Partículas de fondo
    breakoutCtx.fillStyle = 'rgba(0, 212, 255, 0.05)';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * CANVAS_WIDTH;
        const y = Math.random() * CANVAS_HEIGHT;
        breakoutCtx.fillRect(x, y, 2, 2);
    }
    
    // Dibujar ladrillos
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
            const brick = breakoutBricks[row][col];
            if (brick.status === 1) {
                drawBrick(brick);
            }
        }
    }
    
    // Dibujar bola con efecto de brillo
    const ballGradient = breakoutCtx.createRadialGradient(
        breakoutBall.x, breakoutBall.y, 0,
        breakoutBall.x, breakoutBall.y, breakoutBall.radius
    );
    ballGradient.addColorStop(0, '#ffffff');
    ballGradient.addColorStop(0.5, '#00d4ff');
    ballGradient.addColorStop(1, '#0099cc');
    
    breakoutCtx.fillStyle = ballGradient;
    breakoutCtx.shadowColor = '#00d4ff';
    breakoutCtx.shadowBlur = 20;
    breakoutCtx.beginPath();
    breakoutCtx.arc(breakoutBall.x, breakoutBall.y, breakoutBall.radius, 0, Math.PI * 2);
    breakoutCtx.fill();
    breakoutCtx.shadowBlur = 0;
    
    // Dibujar paleta
    const paddleGradient = breakoutCtx.createLinearGradient(
        breakoutPaddle.x, CANVAS_HEIGHT - breakoutPaddle.height,
        breakoutPaddle.x, CANVAS_HEIGHT
    );
    paddleGradient.addColorStop(0, '#ffd700');
    paddleGradient.addColorStop(1, '#ff6b35');
    
    breakoutCtx.fillStyle = paddleGradient;
    breakoutCtx.shadowColor = '#ffd700';
    breakoutCtx.shadowBlur = 15;
    breakoutCtx.fillRect(breakoutPaddle.x, CANVAS_HEIGHT - breakoutPaddle.height, breakoutPaddle.width, breakoutPaddle.height);
    
    // Brillo en la paleta
    breakoutCtx.shadowBlur = 0;
    breakoutCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    breakoutCtx.fillRect(breakoutPaddle.x, CANVAS_HEIGHT - breakoutPaddle.height, breakoutPaddle.width, 3);
}

function drawBrick(brick) {
    // Gradiente del ladrillo
    const gradient = breakoutCtx.createLinearGradient(
        brick.x, brick.y, brick.x, brick.y + BRICK_HEIGHT
    );
    gradient.addColorStop(0, brick.color);
    gradient.addColorStop(1, adjustBrightness(brick.color, -40));
    
    breakoutCtx.fillStyle = gradient;
    breakoutCtx.shadowColor = brick.color;
    breakoutCtx.shadowBlur = 10;
    breakoutCtx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
    
    // Brillo superior
    breakoutCtx.shadowBlur = 0;
    breakoutCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    breakoutCtx.fillRect(brick.x, brick.y, BRICK_WIDTH, 3);
    
    // Borde
    breakoutCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    breakoutCtx.lineWidth = 2;
    breakoutCtx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
}

function adjustBrightness(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
           (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
           .toString(16).slice(1);
}

function checkAllBricksDestroyed() {
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
            if (breakoutBricks[row][col].status === 1) {
                return false;
            }
        }
    }
    return true;
}

function nextLevel() {
    breakoutLevel++;
    document.getElementById('breakout-level').textContent = breakoutLevel;
    
    // Verificar victoria - completar nivel 10
    if (breakoutLevel > 10) {
        winBreakoutGame();
        return;
    }
    
    // Incrementar velocidad
    const speedIncrease = 1.1;
    breakoutBall.dx *= speedIncrease;
    breakoutBall.dy *= speedIncrease;
    
    initBricks();
    resetBall();
}

function resetBall() {
    breakoutBall.x = CANVAS_WIDTH / 2;
    breakoutBall.y = CANVAS_HEIGHT - 40;
    breakoutBall.dx = Math.abs(breakoutBall.dx) * (Math.random() > 0.5 ? 1 : -1);
    breakoutBall.dy = -Math.abs(breakoutBall.dy);
}

function updateLives() {
    const hearts = '❤️'.repeat(breakoutLives);
    document.getElementById('breakout-lives').textContent = hearts || '💀';
}

function endBreakoutGame() {
    breakoutGameOver = true;
    clearInterval(window.breakoutInterval);
    setTimeout(() => alert(`¡Juego terminado!\nPuntuación: ${breakoutScore}\nNivel alcanzado: ${breakoutLevel}`), 100);
}

function winBreakoutGame() {
    breakoutGameOver = true;
    clearInterval(window.breakoutInterval);
    setTimeout(() => alert(`¡VICTORIA TOTAL! 🏆\n¡Completaste los 10 niveles!\nPuntuación final: ${breakoutScore}`), 100);
}
