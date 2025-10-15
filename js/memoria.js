let memoriaCards = [];
let memoriaFlipped = [];
let memoriaMatched = [];
let memoriaMoves = 0;
let memoriaTime = 0;
let memoriaTimer = null;

const CARD_ICONS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹', '🎺', '🎻', '🎤', '🎧', '🎬', '🎨', '🎰', '🎳'];

function initMemoria(difficulty) {
    memoriaMoves = 0;
    memoriaTime = 0;
    memoriaFlipped = [];
    memoriaMatched = [];
    
    const gridSizes = {
        'facil': 4,      // 4x4 = 16 cartas (8 pares)
        'medio': 6,      // 6x6 = 36 cartas (18 pares)
        'dificil': 8     // 8x8 = 64 cartas (32 pares)
    };
    
    const gridSize = gridSizes[difficulty];
    const numPairs = (gridSize * gridSize) / 2;
    
    createMemoriaBoard(gridSize, numPairs);
}

function createMemoriaBoard(gridSize, numPairs) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="memoria-game">
            <div class="memoria-info">
                <div>Movimientos: <span id="memoria-moves">0</span></div>
                <div>Tiempo: <span id="memoria-time">0</span>s</div>
                <div>Pares: <span id="memoria-pairs">0/${numPairs}</span></div>
            </div>
            <div class="memoria-board" id="memoria-board" style="grid-template-columns: repeat(${gridSize}, 1fr);"></div>
            <div class="memoria-controls">
                <button onclick="initMemoria(currentDifficulty)">Nuevo Juego</button>
            </div>
        </div>
    `;
    
    // Crear pares de cartas
    memoriaCards = [];
    const icons = CARD_ICONS.slice(0, numPairs);
    const cardPairs = [...icons, ...icons];
    
    // Mezclar
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    
    // Crear elementos de cartas
    const board = document.getElementById('memoria-board');
    cardPairs.forEach((icon, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.icon = icon;
        
        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front">?</div>
                <div class="memory-card-back">${icon}</div>
            </div>
        `;
        
        card.onclick = () => flipCard(index);
        board.appendChild(card);
        memoriaCards.push({ icon, element: card });
    });
    
    startMemoriaTimer();
}

function startMemoriaTimer() {
    clearInterval(memoriaTimer);
    memoriaTimer = setInterval(() => {
        memoriaTime++;
        document.getElementById('memoria-time').textContent = memoriaTime;
    }, 1000);
}

function flipCard(index) {
    // No permitir más de 2 cartas volteadas
    if (memoriaFlipped.length >= 2) return;
    
    // No voltear cartas ya emparejadas o ya volteadas
    if (memoriaMatched.includes(index) || memoriaFlipped.includes(index)) return;
    
    const card = memoriaCards[index].element;
    card.classList.add('flipped');
    memoriaFlipped.push(index);
    
    if (memoriaFlipped.length === 2) {
        memoriaMoves++;
        document.getElementById('memoria-moves').textContent = memoriaMoves;
        
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [index1, index2] = memoriaFlipped;
    const card1 = memoriaCards[index1];
    const card2 = memoriaCards[index2];
    
    if (card1.icon === card2.icon) {
        // ¡Emparejadas!
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        memoriaMatched.push(index1, index2);
        
        const numPairs = memoriaCards.length / 2;
        document.getElementById('memoria-pairs').textContent = `${memoriaMatched.length / 2}/${numPairs}`;
        
        // Verificar si ganó
        if (memoriaMatched.length === memoriaCards.length) {
            clearInterval(memoriaTimer);
            setTimeout(() => {
                alert(`¡Felicidades! 🎉\nCompletaste el juego en ${memoriaMoves} movimientos y ${memoriaTime} segundos.`);
            }, 500);
        }
    } else {
        // No coinciden
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
        }, 500);
    }
    
    memoriaFlipped = [];
}
