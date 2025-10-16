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
        
        // Verificar victoria - si la serpiente llena todo el tablero
        const maxCells = maxPos * maxPos;
        if (snake.length === maxCells) {
            winSnakeGame();
            return;
        }
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
    
    // Dibujar serpiente con bordes redondeados y efecto 3D mejorado
    snake.forEach((segment, index) => {
        const x = segment.x * snakeGridSize;
        const y = segment.y * snakeGridSize;
        const size = snakeGridSize - 4;
        const radius = 6; // Radio para bordes redondeados
        
        ctx.save();
        
        if (index === 0) {
            // Cabeza con gradiente brillante y bordes redondeados
            const gradient = ctx.createRadialGradient(x + size/2 + 2, y + size/2 + 2, 0, x + size/2 + 2, y + size/2 + 2, size);
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(0.4, '#00dd77');
            gradient.addColorStop(0.7, '#00bb55');
            gradient.addColorStop(1, '#009944');
            ctx.fillStyle = gradient;
            
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 20;
            
            // Dibujar rectángulo redondeado para la cabeza
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, size, size, radius);
            ctx.fill();
            
            // Brillo superior
            ctx.shadowBlur = 0;
            const highlightGradient = ctx.createLinearGradient(x + 2, y + 2, x + 2, y + size/2);
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
            highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = highlightGradient;
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, size, size/2, [radius, radius, 0, 0]);
            ctx.fill();
            
            // Ojos de la serpiente con brillo
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#fff';
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x + 7, y + 7, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + size - 5, y + 7, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + 7.5, y + 7.5, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + size - 4.5, y + 7.5, 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Cuerpo con gradiente verde y bordes redondeados
            const bodyGradient = ctx.createRadialGradient(x + size/2 + 2, y + size/2 + 2, 0, x + size/2 + 2, y + size/2 + 2, size);
            const intensity = 1 - (index / snake.length) * 0.4;
            bodyGradient.addColorStop(0, `rgba(0, 221, 119, ${intensity})`);
            bodyGradient.addColorStop(0.5, `rgba(0, 187, 85, ${intensity})`);
            bodyGradient.addColorStop(1, `rgba(0, 153, 68, ${intensity})`);
            ctx.fillStyle = bodyGradient;
            
            ctx.shadowColor = '#00cc66';
            ctx.shadowBlur = 10;
            
            // Dibujar rectángulo redondeado para el cuerpo
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, size, size, radius - 1);
            ctx.fill();
            
            // Brillo superior en el cuerpo
            ctx.shadowBlur = 0;
            const bodyHighlight = ctx.createLinearGradient(x + 2, y + 2, x + 2, y + size/2);
            bodyHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
            bodyHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = bodyHighlight;
            ctx.beginPath();
            ctx.roundRect(x + 2, y + 2, size, size/2, [radius - 1, radius - 1, 0, 0]);
            ctx.fill();
            
            // Escamas/textura sutil
            ctx.fillStyle = `rgba(255, 255, 255, ${0.08 * intensity})`;
            ctx.beginPath();
            ctx.roundRect(x + size/2, y + 4, 2, size - 4, 1);
            ctx.fill();
        }
        
        ctx.restore();
    });
    
    // Dibujar comida con efecto pulsante y bordes redondeados
    const fx = food.x * snakeGridSize;
    const fy = food.y * snakeGridSize;
    const fsize = snakeGridSize - 4;
    
    const time = Date.now() / 200;
    const pulse = Math.sin(time) * 0.3 + 1;
    
    ctx.save();
    
    // Aura de la comida
    const foodAura = ctx.createRadialGradient(fx + fsize/2 + 2, fy + fsize/2 + 2, 0, fx + fsize/2 + 2, fy + fsize/2 + 2, fsize * pulse);
    foodAura.addColorStop(0, 'rgba(255, 107, 53, 0.8)');
    foodAura.addColorStop(0.5, 'rgba(255, 107, 53, 0.4)');
    foodAura.addColorStop(1, 'rgba(255, 107, 53, 0)');
    ctx.fillStyle = foodAura;
    ctx.fillRect(fx - 3, fy - 3, fsize + 10, fsize + 10);
    
    // Comida principal circular con gradiente
    const foodGradient = ctx.createRadialGradient(fx + fsize/2 + 2, fy + fsize/2 + 2, 0, fx + fsize/2 + 2, fy + fsize/2 + 2, fsize/2);
    foodGradient.addColorStop(0, '#ff8866');
    foodGradient.addColorStop(0.4, '#ff6b35');
    foodGradient.addColorStop(0.8, '#f7931e');
    foodGradient.addColorStop(1, '#cc5500');
    ctx.fillStyle = foodGradient;
    
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(fx + fsize/2 + 2, fy + fsize/2 + 2, fsize/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Brillo en la comida (más grande y realista)
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(fx + fsize/2 - 1, fy + fsize/2 - 1, fsize/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pequeño reflejo adicional
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(fx + fsize/2 + 3, fy + fsize/2 + 3, fsize/6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    ctx.shadowBlur = 0;
}

function endSnakeGame() {
    snakeGameOver = true;
    clearInterval(window.snakeInterval);
    document.getElementById('snake-status').textContent = '💀';
    setTimeout(() => alert(`¡Juego terminado! Puntuación: ${snakeScore}`), 100);
}

function winSnakeGame() {
    snakeGameOver = true;
    clearInterval(window.snakeInterval);
    document.getElementById('snake-status').textContent = '🏆';
    setTimeout(() => alert(`¡VICTORIA PERFECTA! 🎉\n¡Llenaste todo el tablero!\nPuntuación: ${snakeScore}`), 100);
}

function restartSnake() {
    initSnake(currentDifficulty);
}
