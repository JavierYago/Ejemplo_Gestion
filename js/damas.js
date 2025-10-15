let checkersBoard = [];
let checkersSelected = null;
let checkersCurrentPlayer = 'red';
let checkersGameMode = 'vs-ai';
let checkersAIDifficulty = 'medio';
let checkersMustCapture = null;
let checkersGameOver = false;
let checkersScore = { red: 12, black: 12 };

function initCheckers(difficulty) {
    checkersAIDifficulty = difficulty;
    checkersGameOver = false;
    checkersCurrentPlayer = 'red';
    checkersSelected = null;
    checkersMustCapture = null;
    checkersScore = { red: 12, black: 12 };
    
    createCheckersBoard();
}

function createCheckersBoard() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="checkers-game">
            <div class="checkers-info">
                <div style="color: #ff6b35;">Rojas: <span id="checkers-red">12</span></div>
                <div>Turno: <span id="checkers-turn" style="color: #ff6b35;">Rojas</span></div>
                <div style="color: #333;">Negras: <span id="checkers-black">12</span></div>
            </div>
            <div class="checkers-mode-selector">
                <button onclick="setCheckersMode('vs-ai')" class="mode-btn active" id="checkers-mode-ai">VS IA</button>
                <button onclick="setCheckersMode('multiplayer')" class="mode-btn" id="checkers-mode-multi">Multijugador</button>
            </div>
            <div class="checkers-board" id="checkers-board"></div>
            <div class="checkers-controls">
                <button onclick="initCheckers(currentDifficulty)">Nueva Partida</button>
            </div>
            <div class="checkers-hint" id="checkers-hint"></div>
        </div>
    `;
    
    initializeCheckersBoard();
    renderCheckersBoard();
}

function setCheckersMode(mode) {
    checkersGameMode = mode;
    
    // Update button highlights
    const aiBtn = document.getElementById('checkers-mode-ai');
    const multiBtn = document.getElementById('checkers-mode-multi');
    
    if (aiBtn && multiBtn) {
        aiBtn.classList.remove('active');
        multiBtn.classList.remove('active');
        
        if (mode === 'vs-ai') {
            aiBtn.classList.add('active');
        } else {
            multiBtn.classList.add('active');
        }
    }
    
    initCheckers(checkersAIDifficulty);
}

function initializeCheckersBoard() {
    checkersBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Colocar fichas negras (arriba)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                checkersBoard[row][col] = { color: 'black', king: false };
            }
        }
    }
    
    // Colocar fichas rojas (abajo)
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                checkersBoard[row][col] = { color: 'red', king: false };
            }
        }
    }
}

function renderCheckersBoard() {
    const board = document.getElementById('checkers-board');
    board.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = 'checkers-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Color del tablero
            if ((row + col) % 2 === 0) {
                cell.classList.add('light');
            } else {
                cell.classList.add('dark');
            }
            
            // Ficha
            const piece = checkersBoard[row][col];
            if (piece) {
                const pieceEl = document.createElement('div');
                pieceEl.className = `checkers-piece ${piece.color}`;
                if (piece.king) {
                    pieceEl.classList.add('king');
                    pieceEl.innerHTML = '<span class="crown">👑</span>';
                }
                cell.appendChild(pieceEl);
            }
            
            // Selección
            if (checkersSelected && checkersSelected.row === row && checkersSelected.col === col) {
                cell.classList.add('selected');
            }
            
            // Movimientos válidos
            if (checkersSelected) {
                const moves = getValidCheckersMoves(checkersSelected.row, checkersSelected.col);
                if (moves.some(m => m.row === row && m.col === col)) {
                    cell.classList.add('valid-move');
                }
            }
            
            cell.onclick = () => handleCheckersCellClick(row, col);
            board.appendChild(cell);
        }
    }
}

function handleCheckersCellClick(row, col) {
    if (checkersGameOver) return;
    
    const piece = checkersBoard[row][col];
    
    // Si hay una ficha seleccionada, intentar mover
    if (checkersSelected) {
        const moves = getValidCheckersMoves(checkersSelected.row, checkersSelected.col);
        const move = moves.find(m => m.row === row && m.col === col);
        
        if (move) {
            makeCheckersMove(checkersSelected.row, checkersSelected.col, row, col, move.captures);
            checkersSelected = null;
            
            // Verificar si puede seguir capturando
            const canContinue = move.captures.length > 0 && canCaptureMore(row, col);
            
            if (canContinue) {
                checkersMustCapture = { row, col };
                checkersSelected = { row, col };
                document.getElementById('checkers-hint').textContent = '¡Debes seguir capturando!';
                document.getElementById('checkers-hint').style.color = '#ff6b35';
            } else {
                checkersMustCapture = null;
                document.getElementById('checkers-hint').textContent = '';
                
                // Cambiar turno
                checkersCurrentPlayer = checkersCurrentPlayer === 'red' ? 'black' : 'red';
                updateCheckersTurn();
                
                // Si es VS IA y es turno de negras
                if (checkersGameMode === 'vs-ai' && checkersCurrentPlayer === 'black' && !checkersGameOver) {
                    setTimeout(() => makeCheckersAIMove(), 500);
                }
            }
        } else {
            checkersSelected = null;
            checkersMustCapture = null;
            document.getElementById('checkers-hint').textContent = '';
        }
    }
    // Seleccionar ficha del jugador actual
    else if (piece && piece.color === checkersCurrentPlayer) {
        if (checkersGameMode === 'multiplayer' || checkersCurrentPlayer === 'red') {
            checkersSelected = { row, col };
        }
    }
    
    renderCheckersBoard();
}

function getValidCheckersMoves(row, col) {
    const piece = checkersBoard[row][col];
    if (!piece) return [];
    
    const moves = [];
    const directions = piece.king ? 
        [[-1, -1], [-1, 1], [1, -1], [1, 1]] : 
        piece.color === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    
    // Movimientos de captura
    for (const [dr, dc] of directions) {
        const jumpRow = row + dr * 2;
        const jumpCol = col + dc * 2;
        const midRow = row + dr;
        const midCol = col + dc;
        
        if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
            const middle = checkersBoard[midRow][midCol];
            const target = checkersBoard[jumpRow][jumpCol];
            
            if (middle && middle.color !== piece.color && !target) {
                moves.push({ 
                    row: jumpRow, 
                    col: jumpCol, 
                    captures: [[midRow, midCol]]
                });
            }
        }
    }
    
    // Si hay capturas obligatorias, solo devolver esas
    if (moves.length > 0) return moves;
    
    // Si debe capturar, no permitir movimientos normales
    if (checkersMustCapture) return [];
    
    // Movimientos normales
    for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (!checkersBoard[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol, captures: [] });
            }
        }
    }
    
    return moves;
}

function canCaptureMore(row, col) {
    const moves = getValidCheckersMoves(row, col);
    return moves.some(m => m.captures.length > 0);
}

function makeCheckersMove(fromRow, fromCol, toRow, toCol, captures) {
    const piece = checkersBoard[fromRow][fromCol];
    
    // Capturar piezas
    for (const [capRow, capCol] of captures) {
        const captured = checkersBoard[capRow][capCol];
        checkersBoard[capRow][capCol] = null;
        checkersScore[captured.color]--;
        document.getElementById(`checkers-${captured.color}`).textContent = checkersScore[captured.color];
    }
    
    // Mover ficha
    checkersBoard[toRow][toCol] = piece;
    checkersBoard[fromRow][fromCol] = null;
    
    // Coronar si llega al otro lado
    if ((piece.color === 'red' && toRow === 0) || (piece.color === 'black' && toRow === 7)) {
        piece.king = true;
    }
    
    // Verificar fin del juego
    if (checkersScore.red === 0) {
        endCheckersGame('black');
    } else if (checkersScore.black === 0) {
        endCheckersGame('red');
    }
}

function makeCheckersAIMove() {
    if (checkersGameOver) return;
    
    let bestMove;
    let depth;
    
    // Configurar profundidad según dificultad
    switch(checkersAIDifficulty) {
        case 'facil':
            depth = 2;
            break;
        case 'medio':
            depth = 4;
            break;
        case 'dificil':
            depth = 6;
            break;
        default:
            depth = 4;
    }
    
    // Para nivel fácil, a veces hacer movimientos aleatorios
    if (checkersAIDifficulty === 'facil' && Math.random() < 0.4) {
        const allMoves = getAllCheckersMovesForColor('black');
        if (allMoves.length > 0) {
            bestMove = allMoves[Math.floor(Math.random() * allMoves.length)];
        }
    } else {
        bestMove = getBestCheckersMove(depth, 'black');
    }
    
    if (!bestMove) {
        endCheckersGame('red');
        return;
    }
    
    makeCheckersMove(bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1], bestMove.captures);
    
    // Verificar si puede seguir capturando
    if (bestMove.captures.length > 0 && canCaptureMore(bestMove.to[0], bestMove.to[1])) {
        setTimeout(() => makeCheckersAIMove(), 500);
    } else {
        checkersCurrentPlayer = 'red';
        updateCheckersTurn();
        renderCheckersBoard();
    }
}

function getAllCheckersMovesForColor(color) {
    const allMoves = [];
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = checkersBoard[row][col];
            if (piece && piece.color === color) {
                const moves = getValidCheckersMoves(row, col);
                for (const move of moves) {
                    allMoves.push({
                        from: [row, col],
                        to: [move.row, move.col],
                        captures: move.captures
                    });
                }
            }
        }
    }
    
    return allMoves;
}

function getBestCheckersMove(depth, color) {
    let bestMove = null;
    let bestValue = color === 'black' ? -Infinity : Infinity;
    const moves = getAllCheckersMovesForColor(color);
    
    // Ordenar movimientos (capturas primero)
    moves.sort((a, b) => b.captures.length - a.captures.length);
    
    for (const move of moves) {
        // Simular movimiento
        const boardBackup = simulateCheckersMove(move);
        
        // Evaluar
        const value = checkersMinimax(depth - 1, -Infinity, Infinity, color === 'red');
        
        // Restaurar
        undoSimulatedCheckersMove(move, boardBackup);
        
        // Actualizar mejor movimiento
        if (color === 'black') {
            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        } else {
            if (value < bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }
    }
    
    return bestMove;
}

function checkersMinimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) {
        return evaluateCheckersBoard();
    }
    
    const color = isMaximizing ? 'black' : 'red';
    const moves = getAllCheckersMovesForColor(color);
    
    if (moves.length === 0) {
        return isMaximizing ? -10000 : 10000;
    }
    
    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const boardBackup = simulateCheckersMove(move);
            const evalScore = checkersMinimax(depth - 1, alpha, beta, false);
            undoSimulatedCheckersMove(move, boardBackup);
            
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const boardBackup = simulateCheckersMove(move);
            const evalScore = checkersMinimax(depth - 1, alpha, beta, true);
            undoSimulatedCheckersMove(move, boardBackup);
            
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function evaluateCheckersBoard() {
    let score = 0;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = checkersBoard[row][col];
            if (piece) {
                let pieceValue = piece.king ? 300 : 100;
                
                // Bonus por posición avanzada
                let positionBonus = 0;
                if (!piece.king) {
                    positionBonus = piece.color === 'black' ? row * 10 : (7 - row) * 10;
                }
                
                // Bonus por estar en el centro
                const centerBonus = (3 - Math.abs(3.5 - col)) * 5;
                
                // Bonus por protección (pieza amiga en diagonal)
                let protectionBonus = 0;
                const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
                for (const [dr, dc] of directions) {
                    const checkRow = row + dr;
                    const checkCol = col + dc;
                    if (checkRow >= 0 && checkRow < 8 && checkCol >= 0 && checkCol < 8) {
                        const neighbor = checkersBoard[checkRow][checkCol];
                        if (neighbor && neighbor.color === piece.color) {
                            protectionBonus += 10;
                        }
                    }
                }
                
                const totalValue = pieceValue + positionBonus + centerBonus + protectionBonus;
                
                if (piece.color === 'black') {
                    score += totalValue;
                } else {
                    score -= totalValue;
                }
            }
        }
    }
    
    // Bonus por movilidad
    const blackMoves = getAllCheckersMovesForColor('black').length;
    const redMoves = getAllCheckersMovesForColor('red').length;
    score += (blackMoves - redMoves) * 8;
    
    // Bonus por capturas disponibles
    const blackCaptures = getAllCheckersMovesForColor('black').filter(m => m.captures.length > 0).length;
    const redCaptures = getAllCheckersMovesForColor('red').filter(m => m.captures.length > 0).length;
    score += (blackCaptures - redCaptures) * 50;
    
    return score;
}

function simulateCheckersMove(move) {
    const backup = {
        fromPiece: checkersBoard[move.from[0]][move.from[1]],
        toPiece: checkersBoard[move.to[0]][move.to[1]],
        capturedPieces: [],
        score: {...checkersScore}
    };
    
    // Guardar piezas capturadas
    for (const [capRow, capCol] of move.captures) {
        backup.capturedPieces.push({
            pos: [capRow, capCol],
            piece: checkersBoard[capRow][capCol]
        });
        checkersBoard[capRow][capCol] = null;
    }
    
    // Mover pieza
    checkersBoard[move.to[0]][move.to[1]] = checkersBoard[move.from[0]][move.from[1]];
    checkersBoard[move.from[0]][move.from[1]] = null;
    
    // Coronar si es necesario
    const piece = checkersBoard[move.to[0]][move.to[1]];
    if (piece && !piece.king) {
        if ((piece.color === 'red' && move.to[0] === 0) || 
            (piece.color === 'black' && move.to[0] === 7)) {
            piece.king = true;
        }
    }
    
    return backup;
}

function undoSimulatedCheckersMove(move, backup) {
    checkersBoard[move.from[0]][move.from[1]] = backup.fromPiece;
    checkersBoard[move.to[0]][move.to[1]] = backup.toPiece;
    
    // Restaurar piezas capturadas
    for (const cap of backup.capturedPieces) {
        checkersBoard[cap.pos[0]][cap.pos[1]] = cap.piece;
    }
    
    checkersScore = backup.score;
}

function updateCheckersTurn() {
    const turnEl = document.getElementById('checkers-turn');
    turnEl.textContent = checkersCurrentPlayer === 'red' ? 'Rojas' : 'Negras';
    turnEl.style.color = checkersCurrentPlayer === 'red' ? '#ff6b35' : '#333';
}

function endCheckersGame(winner) {
    checkersGameOver = true;
    const winnerText = winner === 'red' ? 'Rojas' : 'Negras';
    setTimeout(() => alert(`¡Las ${winnerText} ganan! 🎉`), 100);
}
