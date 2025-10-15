let chessBoard = [];
let chessSelected = null;
let chessCurrentPlayer = 'white';
let chessGameMode = 'vs-ai'; // 'vs-ai' o 'multiplayer'
let chessAIDifficulty = 'medio';
let chessMoveHistory = [];
let chessKingPositions = { white: [7, 4], black: [0, 4] };
let chessGameOver = false;

const CHESS_PIECES = {
    'white': {
        'king': '♔', 'queen': '♕', 'rook': '♖', 'bishop': '♗', 'knight': '♘', 'pawn': '♙'
    },
    'black': {
        'king': '♚', 'queen': '♛', 'rook': '♜', 'bishop': '♝', 'knight': '♞', 'pawn': '♟'
    }
};

const PIECE_VALUES = {
    'pawn': 1, 'knight': 3, 'bishop': 3, 'rook': 5, 'queen': 9, 'king': 1000
};

function initChess(difficulty) {
    chessAIDifficulty = difficulty;
    chessGameOver = false;
    chessCurrentPlayer = 'white';
    chessMoveHistory = [];
    chessSelected = null;
    
    createChessBoard();
}

function createChessBoard() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="chess-game">
            <div class="chess-info">
                <div>Turno: <span id="chess-turn" style="color: #ffd700;">Blancas</span></div>
                <div id="chess-mode-display">Modo: <span style="color: #00d4ff;">VS IA</span></div>
            </div>
            <div class="chess-mode-selector">
                <button onclick="setChessMode('vs-ai')" class="mode-btn active" id="mode-ai">VS IA</button>
                <button onclick="setChessMode('multiplayer')" class="mode-btn" id="mode-multi">Multijugador</button>
            </div>
            <div class="chess-board" id="chess-board"></div>
            <div class="chess-controls">
                <button onclick="initChess(currentDifficulty)">Nueva Partida</button>
                <button onclick="undoChessMove()">Deshacer</button>
            </div>
            <div class="chess-captured">
                <div>
                    <h4 style="color: #00d4ff;">Capturadas (Negras)</h4>
                    <div id="captured-black"></div>
                </div>
                <div>
                    <h4 style="color: #ffd700;">Capturadas (Blancas)</h4>
                    <div id="captured-white"></div>
                </div>
            </div>
        </div>
    `;
    
    initializeChessBoard();
    renderChessBoard();
}

function setChessMode(mode) {
    chessGameMode = mode;
    
    // Update button highlights
    const aiBtn = document.getElementById('mode-ai');
    const multiBtn = document.getElementById('mode-multi');
    
    if (aiBtn && multiBtn) {
        aiBtn.classList.remove('active');
        multiBtn.classList.remove('active');
        
        if (mode === 'vs-ai') {
            aiBtn.classList.add('active');
            document.getElementById('chess-mode-display').innerHTML = 'Modo: <span style="color: #00d4ff;">VS IA</span>';
        } else {
            multiBtn.classList.add('active');
            document.getElementById('chess-mode-display').innerHTML = 'Modo: <span style="color: #ff6b35;">Multijugador</span>';
        }
    }
    
    initChess(chessAIDifficulty);
}

function initializeChessBoard() {
    // Tablero vacío
    chessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Peones
    for (let i = 0; i < 8; i++) {
        chessBoard[1][i] = { type: 'pawn', color: 'black' };
        chessBoard[6][i] = { type: 'pawn', color: 'white' };
    }
    
    // Piezas negras
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
        chessBoard[0][i] = { type: backRow[i], color: 'black' };
        chessBoard[7][i] = { type: backRow[i], color: 'white' };
    }
    
    chessKingPositions = { white: [7, 4], black: [0, 4] };
}

function renderChessBoard() {
    const board = document.getElementById('chess-board');
    board.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Color del tablero
            if ((row + col) % 2 === 0) {
                cell.classList.add('light');
            } else {
                cell.classList.add('dark');
            }
            
            // Pieza
            const piece = chessBoard[row][col];
            if (piece) {
                const pieceEl = document.createElement('div');
                pieceEl.className = `chess-piece ${piece.color}`;
                pieceEl.textContent = CHESS_PIECES[piece.color][piece.type];
                cell.appendChild(pieceEl);
            }
            
            // Selección
            if (chessSelected && chessSelected.row === row && chessSelected.col === col) {
                cell.classList.add('selected');
            }
            
            cell.onclick = () => handleChessCellClick(row, col);
            board.appendChild(cell);
        }
    }
}

function handleChessCellClick(row, col) {
    if (chessGameOver) return;
    
    const piece = chessBoard[row][col];
    
    // Si hay una pieza seleccionada, intentar mover
    if (chessSelected) {
        if (isValidChessMoveWithCheck(chessSelected.row, chessSelected.col, row, col, chessCurrentPlayer)) {
            const capturedKing = makeChessMove(chessSelected.row, chessSelected.col, row, col);
            chessSelected = null;
            
            // Si capturó el rey, fin del juego
            if (capturedKing) {
                endChessGame(chessCurrentPlayer, 'capture');
                renderChessBoard();
                return;
            }
            
            // Cambiar turno
            chessCurrentPlayer = chessCurrentPlayer === 'white' ? 'black' : 'white';
            updateChessTurn();
            
            // Verificar jaque mate o jaque
            if (isKingInCheck(chessCurrentPlayer)) {
                if (isCheckmate(chessCurrentPlayer)) {
                    // Jaque mate - el jugador anterior gana
                    const winner = chessCurrentPlayer === 'white' ? 'black' : 'white';
                    endChessGame(winner, 'checkmate');
                    renderChessBoard();
                    return;
                } else {
                    showCheckWarning();
                }
            } else {
                // Verificar ahogado (no hay movimientos legales pero no está en jaque)
                const validMoves = getAllValidMoves(chessCurrentPlayer);
                if (validMoves.length === 0) {
                    endChessGame(null, 'stalemate');
                    renderChessBoard();
                    return;
                }
            }
            
            // Si es VS IA y es turno de negras
            if (chessGameMode === 'vs-ai' && chessCurrentPlayer === 'black' && !chessGameOver) {
                setTimeout(() => makeAIMove(), 500);
            }
        } else {
            chessSelected = null;
        }
    }
    // Seleccionar pieza del jugador actual
    else if (piece && piece.color === chessCurrentPlayer) {
        // En modo multijugador, permitir seleccionar
        // En modo IA, solo permitir si es blancas
        if (chessGameMode === 'multiplayer' || chessCurrentPlayer === 'white') {
            chessSelected = { row, col };
        }
    }
    
    renderChessBoard();
}

function showCheckWarning() {
    const color = chessCurrentPlayer === 'white' ? 'Blancas' : 'Negras';
    const gameArea = document.getElementById('game-area');
    const existingWarning = document.querySelector('.check-warning');
    if (existingWarning) existingWarning.remove();
    
    const warning = document.createElement('div');
    warning.className = 'check-warning';
    warning.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255, 0, 0, 0.9); color: white; padding: 20px 40px; border-radius: 10px; font-size: 24px; font-weight: bold; z-index: 1000; box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);';
    warning.textContent = `¡JAQUE! ${color} en peligro`;
    gameArea.appendChild(warning);
    
    setTimeout(() => warning.remove(), 2000);
}

function isValidChessMoveWithCheck(fromRow, fromCol, toRow, toCol, playerColor) {
    // Primero verificar si el movimiento es válido básicamente
    if (!isValidChessMove(fromRow, fromCol, toRow, toCol)) {
        return false;
    }
    
    // Simular el movimiento para ver si deja al rey en jaque
    const backup = simulateMove({
        from: [fromRow, fromCol],
        to: [toRow, toCol]
    });
    
    const kingInCheck = isKingInCheck(playerColor);
    
    // Deshacer simulación
    undoSimulatedMove({ from: [fromRow, fromCol], to: [toRow, toCol] }, backup);
    
    // El movimiento es válido solo si NO deja al rey en jaque
    return !kingInCheck;
}

function isValidChessMove(fromRow, fromCol, toRow, toCol) {
    const piece = chessBoard[fromRow][fromCol];
    const target = chessBoard[toRow][toCol];
    
    // No mover a casilla ocupada por pieza propia
    if (target && target.color === piece.color) return false;
    
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    switch (piece.type) {
        case 'pawn':
            return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, rowDiff, colDiff, target);
        case 'rook':
            return isValidRookMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
        case 'knight':
            return Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1 || 
                   Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2;
        case 'bishop':
            return isValidBishopMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
        case 'queen':
            return isValidRookMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) ||
                   isValidBishopMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
        case 'king':
            return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
    }
    
    return false;
}

function isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, rowDiff, colDiff, target) {
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;
    
    // Movimiento hacia adelante
    if (colDiff === 0 && !target) {
        if (rowDiff === direction) return true;
        if (fromRow === startRow && rowDiff === direction * 2 && !chessBoard[fromRow + direction][fromCol]) return true;
    }
    
    // Captura diagonal
    if (Math.abs(colDiff) === 1 && rowDiff === direction && target) return true;
    
    return false;
}

function isValidRookMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
    if (rowDiff !== 0 && colDiff !== 0) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
    if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol);
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
        if (chessBoard[currentRow][currentCol]) return false;
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

function makeChessMove(fromRow, fromCol, toRow, toCol) {
    const piece = chessBoard[fromRow][fromCol];
    const captured = chessBoard[toRow][toCol];
    
    // Verificar si captura el rey (fin inmediato)
    const capturedKing = captured && captured.type === 'king';
    
    // Guardar movimiento para deshacer
    chessMoveHistory.push({
        from: [fromRow, fromCol],
        to: [toRow, toCol],
        piece: piece,
        captured: captured
    });
    
    // Capturar pieza
    if (captured) {
        addCapturedPiece(captured);
    }
    
    // Mover pieza
    chessBoard[toRow][toCol] = piece;
    chessBoard[fromRow][fromCol] = null;
    
    // Actualizar posición del rey
    if (piece.type === 'king') {
        chessKingPositions[piece.color] = [toRow, toCol];
    }
    
    // Promoción de peón
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
        chessBoard[toRow][toCol] = { type: 'queen', color: piece.color };
    }
    
    return capturedKing;
}

function isKingInCheck(color) {
    const kingPos = chessKingPositions[color];
    if (!kingPos) return false;
    
    const opponent = color === 'white' ? 'black' : 'white';
    
    // Verificar si alguna pieza enemiga puede atacar al rey
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = chessBoard[row][col];
            if (piece && piece.color === opponent) {
                // Usar validación básica sin verificar jaque para evitar recursión
                if (isValidChessMoveBasic(row, col, kingPos[0], kingPos[1])) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

function isValidChessMoveBasic(fromRow, fromCol, toRow, toCol) {
    const piece = chessBoard[fromRow][fromCol];
    const target = chessBoard[toRow][toCol];
    
    if (!piece) return false;
    
    // No mover a casilla ocupada por pieza propia
    if (target && target.color === piece.color) return false;
    
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    
    switch (piece.type) {
        case 'pawn':
            return isValidPawnMove(piece, fromRow, fromCol, toRow, toCol, rowDiff, colDiff, target);
        case 'rook':
            return isValidRookMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
        case 'knight':
            return Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1 || 
                   Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2;
        case 'bishop':
            return isValidBishopMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
        case 'queen':
            return isValidRookMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) ||
                   isValidBishopMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
        case 'king':
            return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
    }
    
    return false;
}

function isCheckmate(color) {
    // Primero verificar si está en jaque
    if (!isKingInCheck(color)) return false;
    
    // Verificar si hay algún movimiento legal que salve al rey
    const moves = getAllValidMoves(color);
    return moves.length === 0;
}

// Tablas de posición para evaluación
const PAWN_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];

const QUEEN_TABLE = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];

const KING_TABLE = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
];

function makeAIMove() {
    if (chessGameOver) return;
    
    const moves = getAllValidMoves('black');
    if (moves.length === 0) {
        // No hay movimientos válidos
        if (isKingInCheck('black')) {
            // Jaque mate - las blancas ganan
            endChessGame('white', 'checkmate');
        } else {
            // Ahogado - tablas
            endChessGame(null, 'stalemate');
        }
        return;
    }
    
    let bestMove;
    let depth;
    
    // Configurar profundidad según dificultad
    switch(chessAIDifficulty) {
        case 'facil':
            depth = 1;
            break;
        case 'medio':
            depth = 3;
            break;
        case 'dificil':
            depth = 4;
            break;
        default:
            depth = 3;
    }
    
    // Para nivel fácil, a veces hacer movimientos aleatorios
    if (chessAIDifficulty === 'facil' && Math.random() < 0.3) {
        bestMove = moves[Math.floor(Math.random() * moves.length)];
    } else {
        bestMove = getBestMoveWithMinimax(depth, 'black');
    }
    
    if (bestMove) {
        const capturedKing = makeChessMove(bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1]);
        
        // Si capturó el rey, fin del juego
        if (capturedKing) {
            endChessGame('black', 'capture');
            renderChessBoard();
            return;
        }
    }
    
    chessCurrentPlayer = 'white';
    updateChessTurn();
    
    // Verificar jaque mate o jaque para las blancas
    if (isKingInCheck('white')) {
        if (isCheckmate('white')) {
            // Jaque mate - las negras ganan
            endChessGame('black', 'checkmate');
            renderChessBoard();
            return;
        } else {
            showCheckWarning();
        }
    } else {
        // Verificar ahogado
        const validMoves = getAllValidMoves('white');
        if (validMoves.length === 0) {
            endChessGame(null, 'stalemate');
            renderChessBoard();
            return;
        }
    }
    
    renderChessBoard();
}

function getAllValidMoves(color) {
    const moves = [];
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = chessBoard[fromRow][fromCol];
            if (piece && piece.color === color) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidChessMoveWithCheck(fromRow, fromCol, toRow, toCol, color)) {
                            moves.push({
                                from: [fromRow, fromCol],
                                to: [toRow, toCol],
                                piece: piece,
                                captured: chessBoard[toRow][toCol]
                            });
                        }
                    }
                }
            }
        }
    }
    return moves;
}

function getBestMoveWithMinimax(depth, color) {
    let bestMove = null;
    let bestValue = color === 'black' ? -Infinity : Infinity;
    const moves = getAllValidMoves(color);
    
    // Ordenar movimientos (capturas primero, luego jaques)
    moves.sort((a, b) => {
        const aCapture = a.captured ? PIECE_VALUES[a.captured.type] : 0;
        const bCapture = b.captured ? PIECE_VALUES[b.captured.type] : 0;
        
        // Priorizar captura del rey
        if (a.captured && a.captured.type === 'king') return -1;
        if (b.captured && b.captured.type === 'king') return 1;
        
        return bCapture - aCapture;
    });
    
    // Verificar si algún movimiento da jaque mate inmediato
    for (const move of moves) {
        const boardBackup = simulateMove(move);
        
        // Verificar si este movimiento da jaque mate
        const opponentColor = color === 'white' ? 'black' : 'white';
        const opponentInCheck = isKingInCheck(opponentColor);
        const opponentMoves = getAllValidMoves(opponentColor);
        
        if (opponentInCheck && opponentMoves.length === 0) {
            // ¡Jaque mate! Este es el mejor movimiento posible
            undoSimulatedMove(move, boardBackup);
            return move;
        }
        
        undoSimulatedMove(move, boardBackup);
    }
    
    // Si no hay jaque mate inmediato, usar minimax normal
    for (const move of moves) {
        // Simular movimiento
        const boardBackup = simulateMove(move);
        
        // Evaluar
        const value = minimax(depth - 1, -Infinity, Infinity, color === 'white');
        
        // Restaurar
        undoSimulatedMove(move, boardBackup);
        
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

function minimax(depth, alpha, beta, isMaximizing) {
    // Verificar jaque mate o ahogado primero
    const currentColor = isMaximizing ? 'black' : 'white';
    const moves = getAllValidMoves(currentColor);
    
    if (moves.length === 0) {
        if (isKingInCheck(currentColor)) {
            // Jaque mate - retornar valor extremo ajustado por profundidad
            // Mientras más rápido el mate, mejor
            return isMaximizing ? (-100000 + depth * 100) : (100000 - depth * 100);
        } else {
            // Ahogado - tablas
            return 0;
        }
    }
    
    if (depth === 0) {
        return evaluateBoard();
    }
    
    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const boardBackup = simulateMove(move);
            const evalScore = minimax(depth - 1, alpha, beta, false);
            undoSimulatedMove(move, boardBackup);
            
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break; // Poda alfa-beta
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const boardBackup = simulateMove(move);
            const evalScore = minimax(depth - 1, alpha, beta, true);
            undoSimulatedMove(move, boardBackup);
            
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break; // Poda alfa-beta
        }
        return minEval;
    }
}

function evaluateBoard() {
    let score = 0;
    
    // Verificar si el rey negro fue capturado
    let whiteKingExists = false;
    let blackKingExists = false;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = chessBoard[row][col];
            if (piece) {
                if (piece.type === 'king') {
                    if (piece.color === 'white') whiteKingExists = true;
                    if (piece.color === 'black') blackKingExists = true;
                }
                
                let pieceValue = PIECE_VALUES[piece.type] * 100;
                let positionValue = getPositionValue(piece, row, col);
                
                const totalValue = pieceValue + positionValue;
                
                if (piece.color === 'black') {
                    score += totalValue;
                } else {
                    score -= totalValue;
                }
            }
        }
    }
    
    // Si falta un rey, fin del juego
    if (!blackKingExists) return -100000;
    if (!whiteKingExists) return 100000;
    
    // Bonus por movilidad
    const blackMoves = getAllValidMoves('black').length;
    const whiteMoves = getAllValidMoves('white').length;
    score += (blackMoves - whiteMoves) * 5;
    
    // Penalización si el rey está en jaque
    if (isKingInCheck('black')) score -= 50;
    if (isKingInCheck('white')) score += 50;
    
    return score;
}

function getPositionValue(piece, row, col) {
    let table;
    
    switch(piece.type) {
        case 'pawn':
            table = PAWN_TABLE;
            break;
        case 'knight':
            table = KNIGHT_TABLE;
            break;
        case 'bishop':
            table = BISHOP_TABLE;
            break;
        case 'rook':
            table = ROOK_TABLE;
            break;
        case 'queen':
            table = QUEEN_TABLE;
            break;
        case 'king':
            table = KING_TABLE;
            break;
        default:
            return 0;
    }
    
    // Invertir tabla para negras
    if (piece.color === 'black') {
        return table[row][col];
    } else {
        return table[7 - row][col];
    }
}

function simulateMove(move) {
    const backup = {
        fromPiece: chessBoard[move.from[0]][move.from[1]],
        toPiece: chessBoard[move.to[0]][move.to[1]],
        kingPos: {
            white: [...chessKingPositions.white],
            black: [...chessKingPositions.black]
        }
    };
    
    const piece = chessBoard[move.from[0]][move.from[1]];
    
    chessBoard[move.to[0]][move.to[1]] = piece;
    chessBoard[move.from[0]][move.from[1]] = null;
    
    if (piece && piece.type === 'king') {
        chessKingPositions[piece.color] = [move.to[0], move.to[1]];
    }
    
    return backup;
}

function undoSimulatedMove(move, backup) {
    chessBoard[move.from[0]][move.from[1]] = backup.fromPiece;
    chessBoard[move.to[0]][move.to[1]] = backup.toPiece;
    chessKingPositions.white = backup.kingPos.white;
    chessKingPositions.black = backup.kingPos.black;
}

function addCapturedPiece(piece) {
    const capturedDiv = document.getElementById(`captured-${piece.color}`);
    const pieceSpan = document.createElement('span');
    pieceSpan.textContent = CHESS_PIECES[piece.color][piece.type] + ' ';
    pieceSpan.style.fontSize = '1.5em';
    capturedDiv.appendChild(pieceSpan);
}

function updateChessTurn() {
    const turnEl = document.getElementById('chess-turn');
    turnEl.textContent = chessCurrentPlayer === 'white' ? 'Blancas' : 'Negras';
    turnEl.style.color = chessCurrentPlayer === 'white' ? '#ffd700' : '#00d4ff';
}

function undoChessMove() {
    if (chessMoveHistory.length === 0) return;
    
    const lastMove = chessMoveHistory.pop();
    chessBoard[lastMove.from[0]][lastMove.from[1]] = lastMove.piece;
    chessBoard[lastMove.to[0]][lastMove.to[1]] = lastMove.captured;
    
    if (lastMove.piece.type === 'king') {
        chessKingPositions[lastMove.piece.color] = lastMove.from;
    }
    
    chessCurrentPlayer = chessCurrentPlayer === 'white' ? 'black' : 'white';
    updateChessTurn();
    renderChessBoard();
}

function endChessGame(winner, endType) {
    chessGameOver = true;
    let message;
    
    if (endType === 'checkmate') {
        const winnerText = winner === 'white' ? 'Blancas' : 'Negras';
        message = `¡JAQUE MATE! Las ${winnerText} ganan 🎉`;
    } else if (endType === 'capture') {
        const winnerText = winner === 'white' ? 'Blancas' : 'Negras';
        message = `¡Las ${winnerText} ganan! El rey rival ha sido capturado 🎉`;
    } else if (endType === 'stalemate') {
        message = '¡Tablas por ahogado! Ningún jugador puede mover 🤝';
    } else {
        const winnerText = winner === 'white' ? 'Blancas' : 'Negras';
        message = `¡Las ${winnerText} ganan! 🎉`;
    }
    
    setTimeout(() => alert(message), 100);
}
