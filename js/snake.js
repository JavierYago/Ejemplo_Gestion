let snake = [];
let snakeDirection = { x: 1, y: 0 };
let food = {};
let snakeScore = 0;
let snakeGameOver = false;
let snakeSpeed = 150;
let snakeGridSize = 20;
let snakeCanvasSize = 400;

function initSnake(difficulty) {
    const speeds = {
        'facil': 200,
        'medio': 150,
        'dificil': 100
    };
    
    snakeSpeed = speeds[difficulty];
    snakeScore = 0;
    snakeGameOver = false;
    snakeDirection = { x: 1, y: 0 };
    
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    
    createSnakeBoard();
    placeFood();
    startSnakeGame();
}

function createSnakeBoard() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="snake-game">
            <div class="snake-info">
                <div>Puntuación: <span id="snake-score">0</span></div>
                <div><span id="snake-status">🐍</span></div>
            </div>
            <canvas id="snakeCanvas" width="${snakeCanvasSize}" height="${snakeCanvasSize}"></canvas>
            <div class="snake-controls">
                <button onclick="restartSnake()">Reiniciar</button>
            </div>
        </div>
    `;
    
    document.addEventListener('keydown', handleSnakeKeypress);
}

function handleSnakeKeypress(e) {
    if (snakeGameOver) return;
    
    const key = e.key;
    
    if ((key === 'ArrowUp' || key === 'w') && snakeDirection.y !== 1) {
        snakeDirection = { x: 0, y: -1 };
    } else if ((key === 'ArrowDown' || key === 's') && snakeDirection.y !== -1) {
        snakeDirection = { x: 0, y: 1 };
    } else if ((key === 'ArrowLeft' || key === 'a') && snakeDirection.x !== 1) {
        snakeDirection = { x: -1, y: 0 };
    } else if ((key === 'ArrowRight' || key === 'd') && snakeDirection.x !== -1) {
        snakeDirection = { x: 1, y: 0 };
    }
}

function placeFood() {
    const maxPos = snakeCanvasSize / snakeGridSize;
    
    do {
        food = {
            x: Math.floor(Math.random() * maxPos),
            y: Math.floor(Math.random() * maxPos)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function startSnakeGame() {
    clearInterval(window.snakeInterval);
    window.snakeInterval = setInterval(updateSnake, snakeSpeed);
}

function updateSnake() {
    if (snakeGameOver) return;
    
    const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };
    
    const maxPos = snakeCanvasSize / snakeGridSize;
    if (head.x < 0 || head.x >= maxPos || head.y < 0 || head.y >= maxPos) {
        endSnakeGame();
        return;
    }
    
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endSnakeGame();
        return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        snakeScore += 10;
        document.getElementById('snake-score').textContent = snakeScore;
        placeFood();
    } else {
        snake.pop();
    }
    
    drawSnake();
}

function drawSnake() {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    
    // Fondo con patrón de cuadrícula
    ctx.fillStyle = '#0a0a15';
    ctx.fillRect(0, 0, snakeCanvasSize, snakeCanvasSize);
    
    // Dibujar cuadrícula sutil
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= snakeCanvasSize / snakeGridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * snakeGridSize, 0);
        ctx.lineTo(i * snakeGridSize, snakeCanvasSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * snakeGridSize);
        ctx.lineTo(snakeCanvasSize, i * snakeGridSize);
        ctx.stroke();
    }
    
    // Dibujar serpiente con efecto 3D
    snake.forEach((segment, index) => {
        const x = segment.x * snakeGridSize;
        const y = segment.y * snakeGridSize;
        const size = snakeGridSize - 3;
        
        if (index === 0) {
            // Cabeza con gradiente brillante
            const gradient = ctx.createRadialGradient(x + size/2, y + size/2, 0, x + size/2, y + size/2, size);
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(0.5, '#00cc66');
            gradient.addColorStop(1, '#009944');
            ctx.fillStyle = gradient;
            
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 15;
            ctx.fillRect(x + 1.5, y + 1.5, size, size);
            
            // Ojos de la serpiente
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fff';
            ctx.fillRect(x + 5, y + 5, 3, 3);
            ctx.fillRect(x + size - 8, y + 5, 3, 3);
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 6, y + 6, 2, 2);
            ctx.fillRect(x + size - 7, y + 6, 2, 2);
        } else {
            // Cuerpo con gradiente verde
            const bodyGradient = ctx.createLinearGradient(x, y, x + size, y + size);
            const intensity = 1 - (index / snake.length) * 0.3;
            bodyGradient.addColorStop(0, `rgba(0, 204, 102, ${intensity})`);
            bodyGradient.addColorStop(1, `rgba(0, 153, 68, ${intensity})`);
            ctx.fillStyle = bodyGradient;
            
            ctx.shadowColor = '#00cc66';
            ctx.shadowBlur = 8;
            ctx.fillRect(x + 1.5, y + 1.5, size, size);
            
            // Escamas/textura
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x + size/2 - 1, y + 2, 2, size - 4);
        }
    });
    
    // Dibujar comida con efecto pulsante
    const fx = food.x * snakeGridSize;
    const fy = food.y * snakeGridSize;
    const fsize = snakeGridSize - 3;
    
    const time = Date.now() / 200;
    const pulse = Math.sin(time) * 0.3 + 1;
    
    // Aura de la comida
    const foodAura = ctx.createRadialGradient(fx + fsize/2, fy + fsize/2, 0, fx + fsize/2, fy + fsize/2, fsize * pulse);
    foodAura.addColorStop(0, 'rgba(255, 107, 53, 0.8)');
    foodAura.addColorStop(0.5, 'rgba(255, 107, 53, 0.4)');
    foodAura.addColorStop(1, 'rgba(255, 107, 53, 0)');
    ctx.fillStyle = foodAura;
    ctx.fillRect(fx - 3, fy - 3, fsize + 6, fsize + 6);
    
    // Comida principal
    const foodGradient = ctx.createRadialGradient(fx + fsize/2, fy + fsize/2, 0, fx + fsize/2, fy + fsize/2, fsize);
    foodGradient.addColorStop(0, '#ff6b35');
    foodGradient.addColorStop(0.6, '#f7931e');
    foodGradient.addColorStop(1, '#cc5500');
    ctx.fillStyle = foodGradient;
    
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(fx + fsize/2, fy + fsize/2, fsize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Brillo en la comida
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(fx + fsize/2 - 2, fy + fsize/2 - 2, fsize/5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
}

function endSnakeGame() {
    snakeGameOver = true;
    clearInterval(window.snakeInterval);
    document.getElementById('snake-status').textContent = '💀';
    setTimeout(() => alert(`¡Juego terminado! Puntuación: ${snakeScore}`), 100);
}

function restartSnake() {
    initSnake(currentDifficulty);
}
