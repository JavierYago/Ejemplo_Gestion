let tetrisBoard = [];
let tetrisCurrentPiece = null;
let tetrisNextPiece = null;
let tetrisScore = 0;
let tetrisLevel = 1;
let tetrisLines = 0;
let tetrisGameOver = false;
let tetrisSpeed = 800;
let tetrisCanvas = null;
let tetrisCtx = null;
let tetrisNextCanvas = null;
let tetrisNextCtx = null;
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;

const PIECES = {
    'I': { shape: [[1,1,1,1]], color: '#00d4ff' },
    'O': { shape: [[1,1],[1,1]], color: '#ffd700' },
    'T': { shape: [[0,1,0],[1,1,1]], color: '#ff6b35' },
    'S': { shape: [[0,1,1],[1,1,0]], color: '#00ff88' },
    'Z': { shape: [[1,1,0],[0,1,1]], color: '#ff0066' },
    'J': { shape: [[1,0,0],[1,1,1]], color: '#0066ff' },
    'L': { shape: [[0,0,1],[1,1,1]], color: '#ff9900' }
};

function initTetris(difficulty) {
    tetrisScore = 0;
    tetrisLevel = 1;
    tetrisLines = 0;
    tetrisGameOver = false;
    
    const speeds = {
        'facil': 1000,
        'medio': 800,
        'dificil': 500
    };
    tetrisSpeed = speeds[difficulty];
    
    createTetrisBoard();
}

function createTetrisBoard() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="tetris-game">
            <div class="tetris-info">
                <div>Puntos: <span id="tetris-score">0</span></div>
                <div>Nivel: <span id="tetris-level">1</span></div>
                <div>Líneas: <span id="tetris-lines">0</span></div>
            </div>
            <div class="tetris-main">
                <canvas id="tetrisCanvas" width="${COLS * BLOCK_SIZE}" height="${ROWS * BLOCK_SIZE}"></canvas>
                <div class="tetris-side">
                    <div class="tetris-next">
                        <h3>Siguiente</h3>
                        <canvas id="tetrisNextCanvas" width="100" height="100"></canvas>
                    </div>
                    <div class="tetris-controls-info">
                        <h3>Controles</h3>
                        <p>← → Mover</p>
                        <p>↑ Rotar</p>
                        <p>↓ Bajar</p>
                        <p>Espacio: Soltar</p>
                    </div>
                </div>
            </div>
            <div class="tetris-controls">
                <button onclick="initTetris(currentDifficulty)">Nuevo Juego</button>
                <button onclick="tetrisPause()">Pausar</button>
            </div>
        </div>
    `;
    
    tetrisCanvas = document.getElementById('tetrisCanvas');
    tetrisCtx = tetrisCanvas.getContext('2d');
    tetrisNextCanvas = document.getElementById('tetrisNextCanvas');
    tetrisNextCtx = tetrisNextCanvas.getContext('2d');
    
    tetrisBoard = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    
    tetrisNextPiece = createPiece();
    spawnPiece();
    
    document.addEventListener('keydown', handleTetrisKeypress);
    startTetrisGame();
}

function createPiece() {
    const pieces = Object.keys(PIECES);
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    return {
        type: type,
        shape: PIECES[type].shape,
        color: PIECES[type].color,
        x: Math.floor(COLS / 2) - 1,
        y: 0
    };
}

function spawnPiece() {
    tetrisCurrentPiece = tetrisNextPiece;
    tetrisNextPiece = createPiece();
    
    if (!canMove(tetrisCurrentPiece, 0, 0)) {
        endTetrisGame();
    }
    
    drawTetris();
    drawNextPiece();
}

function canMove(piece, offsetX, offsetY) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x + offsetX;
                const newY = piece.y + y + offsetY;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return false;
                }
                
                if (newY >= 0 && tetrisBoard[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function movePiece(dx, dy) {
    if (!tetrisGameOver && canMove(tetrisCurrentPiece, dx, dy)) {
        tetrisCurrentPiece.x += dx;
        tetrisCurrentPiece.y += dy;
        drawTetris();
        return true;
    }
    return false;
}

function rotatePiece() {
    if (tetrisGameOver) return;
    
    const rotated = tetrisCurrentPiece.shape[0].map((_, i) =>
        tetrisCurrentPiece.shape.map(row => row[i]).reverse()
    );
    
    const oldShape = tetrisCurrentPiece.shape;
    tetrisCurrentPiece.shape = rotated;
    
    if (!canMove(tetrisCurrentPiece, 0, 0)) {
        tetrisCurrentPiece.shape = oldShape;
    }
    
    drawTetris();
}

function dropPiece() {
    while (movePiece(0, 1)) {}
}

function lockPiece() {
    for (let y = 0; y < tetrisCurrentPiece.shape.length; y++) {
        for (let x = 0; x < tetrisCurrentPiece.shape[y].length; x++) {
            if (tetrisCurrentPiece.shape[y][x]) {
                const boardY = tetrisCurrentPiece.y + y;
                const boardX = tetrisCurrentPiece.x + x;
                if (boardY >= 0) {
                    tetrisBoard[boardY][boardX] = tetrisCurrentPiece.color;
                }
            }
        }
    }
    
    clearLines();
    spawnPiece();
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (tetrisBoard[y].every(cell => cell !== 0)) {
            tetrisBoard.splice(y, 1);
            tetrisBoard.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        tetrisLines += linesCleared;
        const points = [0, 100, 300, 500, 800];
        tetrisScore += points[linesCleared] * tetrisLevel;
        tetrisLevel = Math.floor(tetrisLines / 10) + 1;
        
        document.getElementById('tetris-score').textContent = tetrisScore;
        document.getElementById('tetris-level').textContent = tetrisLevel;
        document.getElementById('tetris-lines').textContent = tetrisLines;
        
        // Verificar victoria - llegar al nivel 15 o 100 líneas
        if (tetrisLevel >= 15 || tetrisLines >= 100) {
            winTetrisGame();
        }
    }
}

function drawTetris() {
    // Fondo
    tetrisCtx.fillStyle = '#0a0a15';
    tetrisCtx.fillRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
    
    // Cuadrícula
    tetrisCtx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    tetrisCtx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
        tetrisCtx.beginPath();
        tetrisCtx.moveTo(i * BLOCK_SIZE, 0);
        tetrisCtx.lineTo(i * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        tetrisCtx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
        tetrisCtx.beginPath();
        tetrisCtx.moveTo(0, i * BLOCK_SIZE);
        tetrisCtx.lineTo(COLS * BLOCK_SIZE, i * BLOCK_SIZE);
        tetrisCtx.stroke();
    }
    
    // Bloques fijos
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (tetrisBoard[y][x]) {
                drawBlock(tetrisCtx, x * BLOCK_SIZE, y * BLOCK_SIZE, tetrisBoard[y][x]);
            }
        }
    }
    
    // Pieza actual
    if (tetrisCurrentPiece) {
        for (let y = 0; y < tetrisCurrentPiece.shape.length; y++) {
            for (let x = 0; x < tetrisCurrentPiece.shape[y].length; x++) {
                if (tetrisCurrentPiece.shape[y][x]) {
                    drawBlock(
                        tetrisCtx,
                        (tetrisCurrentPiece.x + x) * BLOCK_SIZE,
                        (tetrisCurrentPiece.y + y) * BLOCK_SIZE,
                        tetrisCurrentPiece.color
                    );
                }
            }
        }
    }
}

function drawBlock(ctx, x, y, color) {
    // Sombra exterior
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    
    // Bloque principal
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    
    // Brillo superior
    const gradient = ctx.createLinearGradient(x, y, x, y + BLOCK_SIZE);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE / 2);
    
    // Borde
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 1.5, y + 1.5, BLOCK_SIZE - 3, BLOCK_SIZE - 3);
}

function drawNextPiece() {
    tetrisNextCtx.fillStyle = '#0a0a15';
    tetrisNextCtx.fillRect(0, 0, 100, 100);
    
    if (tetrisNextPiece) {
        const offsetX = (100 - tetrisNextPiece.shape[0].length * BLOCK_SIZE) / 2;
        const offsetY = (100 - tetrisNextPiece.shape.length * BLOCK_SIZE) / 2;
        
        for (let y = 0; y < tetrisNextPiece.shape.length; y++) {
            for (let x = 0; x < tetrisNextPiece.shape[y].length; x++) {
                if (tetrisNextPiece.shape[y][x]) {
                    drawBlock(
                        tetrisNextCtx,
                        offsetX + x * BLOCK_SIZE,
                        offsetY + y * BLOCK_SIZE,
                        tetrisNextPiece.color
                    );
                }
            }
        }
    }
}

function startTetrisGame() {
    clearInterval(window.tetrisInterval);
    window.tetrisInterval = setInterval(() => {
        if (!tetrisGameOver) {
            if (!movePiece(0, 1)) {
                lockPiece();
            }
        }
    }, tetrisSpeed);
}

function handleTetrisKeypress(e) {
    if (tetrisGameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
            movePiece(1, 0);
            break;
        case 'ArrowDown':
        case 's':
            movePiece(0, 1);
            break;
        case 'ArrowUp':
        case 'w':
            rotatePiece();
            break;
        case ' ':
            e.preventDefault();
            dropPiece();
            break;
    }
}

function tetrisPause() {
    if (window.tetrisInterval) {
        clearInterval(window.tetrisInterval);
        window.tetrisInterval = null;
        alert('Pausado - Presiona OK para continuar');
        startTetrisGame();
    }
}

function endTetrisGame() {
    tetrisGameOver = true;
    clearInterval(window.tetrisInterval);
    setTimeout(() => alert(`¡Juego terminado!\nPuntuación: ${tetrisScore}\nNivel: ${tetrisLevel}`), 100);
}

function winTetrisGame() {
    tetrisGameOver = true;
    clearInterval(window.tetrisInterval);
    setTimeout(() => alert(`¡VICTORIA! 🎉\n¡Alcanzaste el nivel ${tetrisLevel}!\nPuntuación final: ${tetrisScore}\nLíneas completadas: ${tetrisLines}`), 100);
}
