let buscaminasBoard = [];
let buscaminasRevealed = [];
let buscaminasFlags = [];
let buscaminasMines = [];
let buscaminasRows = 0;
let buscaminasCols = 0;
let buscaminasMineCount = 0;
let buscaminasGameOver = false;

function initBuscaminas(difficulty) {
    const configs = {
        'facil': { rows: 8, cols: 8, mines: 10 },
        'medio': { rows: 12, cols: 12, mines: 20 },
        'dificil': { rows: 16, cols: 16, mines: 40 }
    };
    
    const config = configs[difficulty];
    buscaminasRows = config.rows;
    buscaminasCols = config.cols;
    buscaminasMineCount = config.mines;
    buscaminasGameOver = false;
    
    createBuscaminasBoard();
}

function createBuscaminasBoard() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div>
            <div class="minesweeper-info">
                <div>Minas: <span id="mines-left">${buscaminasMineCount}</span></div>
                <div><span id="game-status">🙂</span></div>
                <div>Tiempo: <span id="timer">0</span>s</div>
            </div>
            <div class="minesweeper-board" id="minesweeper-board"></div>
        </div>
    `;
    
    buscaminasBoard = Array(buscaminasRows).fill().map(() => Array(buscaminasCols).fill(0));
    buscaminasRevealed = Array(buscaminasRows).fill().map(() => Array(buscaminasCols).fill(false));
    buscaminasFlags = Array(buscaminasRows).fill().map(() => Array(buscaminasCols).fill(false));
    
    placeMines();
    calculateNumbers();
    renderBuscaminasBoard();
    startTimer();
}

function placeMines() {
    buscaminasMines = [];
    let placed = 0;
    
    while (placed < buscaminasMineCount) {
        const row = Math.floor(Math.random() * buscaminasRows);
        const col = Math.floor(Math.random() * buscaminasCols);
        
        if (buscaminasBoard[row][col] !== -1) {
            buscaminasBoard[row][col] = -1;
            buscaminasMines.push([row, col]);
            placed++;
        }
    }
}

function calculateNumbers() {
    for (let row = 0; row < buscaminasRows; row++) {
        for (let col = 0; col < buscaminasCols; col++) {
            if (buscaminasBoard[row][col] === -1) continue;
            
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    
                    if (newRow >= 0 && newRow < buscaminasRows && 
                        newCol >= 0 && newCol < buscaminasCols &&
                        buscaminasBoard[newRow][newCol] === -1) {
                        count++;
                    }
                }
            }
            buscaminasBoard[row][col] = count;
        }
    }
}

function renderBuscaminasBoard() {
    const board = document.getElementById('minesweeper-board');
    board.innerHTML = '';
    
    for (let row = 0; row < buscaminasRows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'mine-row';
        
        for (let col = 0; col < buscaminasCols; col++) {
            const cell = document.createElement('div');
            cell.className = 'mine-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (buscaminasRevealed[row][col]) {
                cell.classList.add('revealed');
                if (buscaminasBoard[row][col] === -1) {
                    cell.textContent = '💣';
                    cell.classList.add('mine');
                } else if (buscaminasBoard[row][col] > 0) {
                    cell.textContent = buscaminasBoard[row][col];
                    const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
                    cell.style.color = colors[buscaminasBoard[row][col]];
                }
            } else if (buscaminasFlags[row][col]) {
                cell.classList.add('flagged');
                cell.textContent = '🚩';
            }
            
            cell.addEventListener('click', () => revealCell(row, col));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(row, col);
            });
            
            rowDiv.appendChild(cell);
        }
        board.appendChild(rowDiv);
    }
    
    updateFlagCounter();
}

function revealCell(row, col) {
    if (buscaminasGameOver || buscaminasRevealed[row][col] || buscaminasFlags[row][col]) return;
    
    buscaminasRevealed[row][col] = true;
    
    if (buscaminasBoard[row][col] === -1) {
        gameOver(false);
        return;
    }
    
    if (buscaminasBoard[row][col] === 0) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const newRow = row + dr;
                const newCol = col + dc;
                
                if (newRow >= 0 && newRow < buscaminasRows && 
                    newCol >= 0 && newCol < buscaminasCols &&
                    !buscaminasRevealed[newRow][newCol]) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
    
    renderBuscaminasBoard();
    checkWin();
}

function toggleFlag(row, col) {
    if (buscaminasGameOver || buscaminasRevealed[row][col]) return;
    
    buscaminasFlags[row][col] = !buscaminasFlags[row][col];
    renderBuscaminasBoard();
}

function updateFlagCounter() {
    const flagCount = buscaminasFlags.flat().filter(f => f).length;
    document.getElementById('mines-left').textContent = buscaminasMineCount - flagCount;
}

function checkWin() {
    let revealedCount = 0;
    for (let row = 0; row < buscaminasRows; row++) {
        for (let col = 0; col < buscaminasCols; col++) {
            if (buscaminasRevealed[row][col]) revealedCount++;
        }
    }
    
    if (revealedCount === buscaminasRows * buscaminasCols - buscaminasMineCount) {
        gameOver(true);
    }
}

function gameOver(won) {
    buscaminasGameOver = true;
    clearInterval(window.buscaminasTimer);
    
    if (won) {
        document.getElementById('game-status').textContent = '😎';
        setTimeout(() => alert('¡Ganaste! 🎉'), 100);
    } else {
        document.getElementById('game-status').textContent = '😵';
        for (let i = 0; i < buscaminasMines.length; i++) {
            const [row, col] = buscaminasMines[i];
            buscaminasRevealed[row][col] = true;
        }
        renderBuscaminasBoard();
        setTimeout(() => alert('¡Perdiste! 💥'), 100);
    }
}

function startTimer() {
    let seconds = 0;
    clearInterval(window.buscaminasTimer);
    window.buscaminasTimer = setInterval(() => {
        if (!buscaminasGameOver) {
            seconds++;
            document.getElementById('timer').textContent = seconds;
        }
    }, 1000);
}
