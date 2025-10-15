let sudokuBoard = [];
let sudokuSolution = [];
let sudokuSelectedCell = null;
let sudokuErrors = 0;

function initSudoku(difficulty) {
    sudokuErrors = 0;
    sudokuSelectedCell = null;
    createSudokuBoard(difficulty);
}

function createSudokuBoard(difficulty) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div>
            <div class="sudoku-info">
                <div>Errores: <span id="sudoku-errors">0</span></div>
                <div><span id="sudoku-status">🧩</span></div>
            </div>
            <div class="sudoku-board" id="sudoku-board"></div>
            <div class="sudoku-controls">
                <button onclick="checkSudoku()">Verificar</button>
                <button onclick="solveSudoku()">Resolver</button>
                <button onclick="initSudoku('${difficulty}')">Nuevo Juego</button>
            </div>
        </div>
    `;
    
    generateSudoku(difficulty);
    renderSudokuBoard();
    
    document.addEventListener('keydown', handleSudokuKeypress);
}

function generateSudoku(difficulty) {
    sudokuBoard = Array(9).fill().map(() => Array(9).fill(0));
    
    fillSudoku(sudokuBoard);
    sudokuSolution = sudokuBoard.map(row => [...row]);
    
    const cellsToRemove = {
        'facil': 30,
        'medio': 40,
        'dificil': 50
    };
    
    const toRemove = cellsToRemove[difficulty];
    let removed = 0;
    
    while (removed < toRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (sudokuBoard[row][col] !== 0) {
            sudokuBoard[row][col] = 0;
            removed++;
        }
    }
}

function fillSudoku(board) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                shuffle(numbers);
                
                for (let num of numbers) {
                    if (isValidSudoku(board, i, j, num)) {
                        board[i][j] = num;
                        
                        if (fillSudoku(board)) {
                            return true;
                        }
                        
                        board[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValidSudoku(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }
    
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderSudokuBoard() {
    const board = document.getElementById('sudoku-board');
    board.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const isFixed = sudokuSolution[row][col] !== 0 && sudokuBoard[row][col] !== 0;
            
            // Aplicar estilos según posición para mejor separación visual
            let cellStyle = '';
            
            // Bordes más gruesos cada 3 celdas
            if (col % 3 === 2 && col !== 8) {
                cellStyle += 'border-right: 3px solid rgba(255, 215, 0, 0.5) !important; ';
            }
            if (row % 3 === 2 && row !== 8) {
                cellStyle += 'border-bottom: 3px solid rgba(255, 215, 0, 0.5) !important; ';
            }
            
            // Fondo alternado para los bloques 3x3
            const blockRow = Math.floor(row / 3);
            const blockCol = Math.floor(col / 3);
            if ((blockRow + blockCol) % 2 === 0) {
                cell.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            } else {
                cell.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }
            
            cell.style.cssText += cellStyle;
            
            if (isFixed) {
                cell.classList.add('fixed');
                cell.style.background = `
                    linear-gradient(135deg, 
                        rgba(245, 87, 108, 0.3) 0%, 
                        rgba(240, 147, 251, 0.3) 100%
                    )
                `;
                cell.style.fontWeight = '900';
                cell.style.color = '#fff';
                cell.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.5)';
            }
            
            if (sudokuBoard[row][col] !== 0) {
                cell.textContent = sudokuBoard[row][col];
            }
            
            if (!isFixed) {
                cell.addEventListener('click', () => selectSudokuCell(row, col));
                cell.style.cursor = 'pointer';
                
                // Efecto hover para celdas editables
                cell.addEventListener('mouseenter', () => {
                    if (!cell.classList.contains('selected')) {
                        cell.style.background = 'rgba(79, 172, 254, 0.15)';
                        cell.style.transform = 'scale(1.05)';
                        cell.style.zIndex = '10';
                    }
                });
                
                cell.addEventListener('mouseleave', () => {
                    if (!cell.classList.contains('selected')) {
                        const blockRow = Math.floor(row / 3);
                        const blockCol = Math.floor(col / 3);
                        if ((blockRow + blockCol) % 2 === 0) {
                            cell.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        } else {
                            cell.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                        }
                        cell.style.transform = 'scale(1)';
                        cell.style.zIndex = '1';
                    }
                });
            }
            
            board.appendChild(cell);
        }
    }
}

function selectSudokuCell(row, col) {
    sudokuSelectedCell = { row, col };
    
    document.querySelectorAll('.sudoku-cell').forEach(cell => {
        cell.classList.remove('selected');
    });
    
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('selected');
}

function handleSudokuKeypress(e) {
    if (!sudokuSelectedCell) return;
    
    const key = e.key;
    const { row, col } = sudokuSelectedCell;
    
    if (key >= '1' && key <= '9') {
        const num = parseInt(key);
        sudokuBoard[row][col] = num;
        
        if (sudokuSolution[row][col] !== num) {
            sudokuErrors++;
            document.getElementById('sudoku-errors').textContent = sudokuErrors;
            
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('error');
            setTimeout(() => cell.classList.remove('error'), 500);
        }
        
        renderSudokuBoard();
        checkSudokuWin();
    } else if (key === 'Backspace' || key === 'Delete') {
        sudokuBoard[row][col] = 0;
        renderSudokuBoard();
    }
}

function checkSudoku() {
    let correct = true;
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuBoard[row][col] !== 0 && sudokuBoard[row][col] !== sudokuSolution[row][col]) {
                correct = false;
            }
        }
    }
    
    if (correct) {
        alert('¡Vas bien! 👍');
    } else {
        alert('Hay algunos errores. ¡Sigue intentando! 💪');
    }
}

function solveSudoku() {
    sudokuBoard = sudokuSolution.map(row => [...row]);
    renderSudokuBoard();
    document.getElementById('sudoku-status').textContent = '✅';
}

function checkSudokuWin() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuBoard[row][col] === 0 || sudokuBoard[row][col] !== sudokuSolution[row][col]) {
                return;
            }
        }
    }
    
    document.getElementById('sudoku-status').textContent = '🎉';
    setTimeout(() => alert('¡Felicidades! Completaste el Sudoku 🎉'), 100);
}
