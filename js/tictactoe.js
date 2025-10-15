let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttCurrentPlayer = 'X';
let tttGameOver = false;
let tttScore = { X: 0, O: 0, draws: 0 };
let tttDifficulty = 'medio';
let tttVsComputer = true;

function initTicTacToe(difficulty) {
    tttDifficulty = difficulty;
    tttGameOver = false;
    tttCurrentPlayer = 'X';
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    
    createTicTacToeBoard();
}

function createTicTacToeBoard() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="tictactoe-game">
            <div class="tictactoe-info">
                <div>Jugador X: <span id="ttt-score-x">${tttScore.X}</span></div>
                <div>Empates: <span id="ttt-draws">${tttScore.draws}</span></div>
                <div>Computadora O: <span id="ttt-score-o">${tttScore.O}</span></div>
            </div>
            <div class="tictactoe-status" id="ttt-status">Tu turno (X)</div>
            <div class="tictactoe-board" id="ttt-board"></div>
            <div class="tictactoe-controls">
                <button onclick="initTicTacToe(currentDifficulty)">Nueva Partida</button>
                <button onclick="resetTTTScore()">Reiniciar Marcador</button>
            </div>
        </div>
    `;
    
    const board = document.getElementById('ttt-board');
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.onclick = () => handleTTTClick(i);
        board.appendChild(cell);
    }
}

function handleTTTClick(index) {
    if (tttGameOver || tttBoard[index] !== '' || tttCurrentPlayer !== 'X') return;
    
    makeMove(index, 'X');
    
    if (!tttGameOver && tttVsComputer) {
        setTimeout(() => computerMove(), 500);
    }
}

function makeMove(index, player) {
    tttBoard[index] = player;
    
    const cells = document.querySelectorAll('.ttt-cell');
    cells[index].textContent = player;
    cells[index].classList.add(player === 'X' ? 'player-x' : 'player-o');
    cells[index].classList.add('animate-mark');
    
    const winner = checkWinner();
    
    if (winner) {
        endTTTGame(winner);
    } else if (tttBoard.every(cell => cell !== '')) {
        endTTTGame('draw');
    } else {
        tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function computerMove() {
    if (tttGameOver) return;
    
    let move;
    
    if (tttDifficulty === 'facil') {
        // Movimiento aleatorio
        const available = tttBoard.map((cell, i) => cell === '' ? i : -1).filter(i => i !== -1);
        move = available[Math.floor(Math.random() * available.length)];
    } else if (tttDifficulty === 'medio') {
        // 50% óptimo, 50% aleatorio
        move = Math.random() > 0.5 ? getBestMove() : getRandomMove();
    } else {
        // Movimiento óptimo (minimax)
        move = getBestMove();
    }
    
    makeMove(move, 'O');
}

function getRandomMove() {
    const available = tttBoard.map((cell, i) => cell === '' ? i : -1).filter(i => i !== -1);
    return available[Math.floor(Math.random() * available.length)];
}

function getBestMove() {
    // Primero intentar ganar
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'O';
            if (checkWinner() === 'O') {
                tttBoard[i] = '';
                return i;
            }
            tttBoard[i] = '';
        }
    }
    
    // Bloquear al jugador
    for (let i = 0; i < 9; i++) {
        if (tttBoard[i] === '') {
            tttBoard[i] = 'X';
            if (checkWinner() === 'X') {
                tttBoard[i] = '';
                return i;
            }
            tttBoard[i] = '';
        }
    }
    
    // Tomar el centro si está disponible
    if (tttBoard[4] === '') return 4;
    
    // Tomar una esquina
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => tttBoard[i] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Tomar cualquier espacio disponible
    return getRandomMove();
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            highlightWinningCells(pattern);
            return tttBoard[a];
        }
    }
    
    return null;
}

function highlightWinningCells(pattern) {
    const cells = document.querySelectorAll('.ttt-cell');
    pattern.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function updateStatus() {
    const status = document.getElementById('ttt-status');
    if (tttCurrentPlayer === 'X') {
        status.textContent = 'Tu turno (X)';
        status.style.color = '#00d4ff';
    } else {
        status.textContent = 'Turno de la computadora (O)';
        status.style.color = '#ff6b35';
    }
}

function endTTTGame(result) {
    tttGameOver = true;
    const status = document.getElementById('ttt-status');
    
    if (result === 'draw') {
        status.textContent = '¡Empate!';
        status.style.color = '#ffd700';
        tttScore.draws++;
        document.getElementById('ttt-draws').textContent = tttScore.draws;
    } else if (result === 'X') {
        status.textContent = '¡Ganaste! 🎉';
        status.style.color = '#00ff88';
        tttScore.X++;
        document.getElementById('ttt-score-x').textContent = tttScore.X;
    } else {
        status.textContent = 'La computadora ganó';
        status.style.color = '#ff0066';
        tttScore.O++;
        document.getElementById('ttt-score-o').textContent = tttScore.O;
    }
}

function resetTTTScore() {
    tttScore = { X: 0, O: 0, draws: 0 };
    document.getElementById('ttt-score-x').textContent = 0;
    document.getElementById('ttt-score-o').textContent = 0;
    document.getElementById('ttt-draws').textContent = 0;
    initTicTacToe(tttDifficulty);
}
