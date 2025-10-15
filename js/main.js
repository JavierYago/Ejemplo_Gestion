let currentGame = null;
let currentDifficulty = 'medio';

function loadGame(gameName) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    
    currentGame = gameName;
    
    const titles = {
        'buscaminas': '💣 Buscaminas',
        'snake': '🐍 Snake',
        'tetris': '🟦 Tetris',
        'breakout': '🎯 Arkanoid',
        'ajedrez': '♔ Ajedrez',
        'damas': '🔴 Damas',
        'wordle-futbol': '⚽ Wordle Fútbol',
        'sudoku': '🔢 Sudoku',
        'solitario': '🃏 Solitario',
        'memoria': '🎴 Memoria',
        'tictactoe': '⭕ Tres en Raya'
    };
    
    document.getElementById('game-title').textContent = titles[gameName];
    
    startGame(gameName);
}

function backToMenu() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('game-area').innerHTML = '';
    
    if (currentGame === 'snake' && window.snakeInterval) {
        clearInterval(window.snakeInterval);
    }
    
    currentGame = null;
}

function changeDifficulty() {
    currentDifficulty = document.getElementById('difficulty').value;
    if (currentGame) {
        startGame(currentGame);
    }
}

function startGame(gameName) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    
    switch(gameName) {
        case 'buscaminas':
            initBuscaminas(currentDifficulty);
            break;
        case 'snake':
            initSnake(currentDifficulty);
            break;
        case 'tetris':
            initTetris(currentDifficulty);
            break;
        case 'breakout':
            initBreakout(currentDifficulty);
            break;
        case 'ajedrez':
            initChess(currentDifficulty);
            break;
        case 'damas':
            initCheckers(currentDifficulty);
            break;
        case 'wordle-futbol':
            initWordleFootball('actual');
            break;
        case 'sudoku':
            initSudoku(currentDifficulty);
            break;
        case 'solitario':
            initSolitario(currentDifficulty);
            break;
        case 'memoria':
            initMemoria(currentDifficulty);
            break;
        case 'tictactoe':
            initTicTacToe(currentDifficulty);
            break;
    }
}
