let solitarioDeck = [];
let solitarioStock = [];
let solitarioWaste = [];
let solitarioFoundations = [[], [], [], []];
let solitarioTableau = [[], [], [], [], [], [], []];
let solitarioMoves = 0;
let solitarioSelectedCard = null;
let draggedCard = null;
let draggedSource = null;
let draggedIndex = -1;

function initSolitario(difficulty) {
    solitarioMoves = 0;
    solitarioSelectedCard = null;
    draggedCard = null;
    draggedSource = null;
    draggedIndex = -1;
    createSolitarioBoard(difficulty);
}

function createSolitarioBoard(difficulty) {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = `
        <div class="solitaire-game">
            <div class="solitaire-info">
                <div>Movimientos: <span id="solitaire-moves">0</span></div>
                <div><span id="solitaire-status">🃏</span></div>
            </div>
            <div class="solitaire-top">
                <div class="solitaire-stock">
                    <div class="card-pile" id="stock-pile"></div>
                    <div class="card-pile" id="waste-pile"></div>
                </div>
                <div class="solitaire-foundations">
                    <div class="card-pile" id="foundation-0"></div>
                    <div class="card-pile" id="foundation-1"></div>
                    <div class="card-pile" id="foundation-2"></div>
                    <div class="card-pile" id="foundation-3"></div>
                </div>
            </div>
            <div class="solitaire-tableau">
                <div class="card-pile" id="tableau-0"></div>
                <div class="card-pile" id="tableau-1"></div>
                <div class="card-pile" id="tableau-2"></div>
                <div class="card-pile" id="tableau-3"></div>
                <div class="card-pile" id="tableau-4"></div>
                <div class="card-pile" id="tableau-5"></div>
                <div class="card-pile" id="tableau-6"></div>
            </div>
            <div class="solitaire-controls">
                <button onclick="initSolitario('${difficulty}')">Nuevo Juego</button>
                <button onclick="drawFromStock()">Sacar Carta</button>
            </div>
        </div>
    `;
    
    initializeDeck();
    dealCards(difficulty);
    renderSolitario();
}

function initializeDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    
    solitarioDeck = [];
    for (let suit of suits) {
        for (let i = 0; i < values.length; i++) {
            solitarioDeck.push({
                suit: suit,
                value: values[i],
                numValue: i + 1,
                color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
                faceUp: false
            });
        }
    }
    
    shuffleDeck(solitarioDeck);
}

function shuffleDeck(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function dealCards(difficulty) {
    solitarioStock = [...solitarioDeck];
    solitarioWaste = [];
    solitarioFoundations = [[], [], [], []];
    solitarioTableau = [[], [], [], [], [], [], []];
    
    const cardsToDeal = difficulty === 'facil' ? 3 : difficulty === 'medio' ? 4 : 7;
    
    for (let i = 0; i < 7; i++) {
        const numCards = Math.min(i + 1, cardsToDeal);
        for (let j = 0; j < numCards; j++) {
            const card = solitarioStock.pop();
            card.faceUp = (j === numCards - 1);
            solitarioTableau[i].push(card);
        }
    }
}

function renderSolitario() {
    const stockPile = document.getElementById('stock-pile');
    stockPile.innerHTML = '';
    if (solitarioStock.length > 0) {
        const card = createCardElement(solitarioStock[solitarioStock.length - 1], true);
        card.onclick = () => drawFromStock();
        card.style.cursor = 'pointer';
        stockPile.appendChild(card);
    }
    
    const wastePile = document.getElementById('waste-pile');
    wastePile.innerHTML = '';
    if (solitarioWaste.length > 0) {
        const topCard = solitarioWaste[solitarioWaste.length - 1];
        const card = createCardElement(topCard);
        card.draggable = true;
        card.ondragstart = (e) => handleDragStart(e, topCard, 'waste', -1);
        card.ondragend = handleDragEnd;
        card.onclick = () => selectCard(topCard, 'waste');
        wastePile.appendChild(card);
    }
    
    for (let i = 0; i < 4; i++) {
        const foundation = document.getElementById(`foundation-${i}`);
        foundation.innerHTML = '';
        foundation.ondragover = handleDragOver;
        foundation.ondrop = (e) => handleDrop(e, 'foundation', i);
        foundation.ondragleave = handleDragLeave;
        
        if (solitarioFoundations[i].length > 0) {
            const topCard = solitarioFoundations[i][solitarioFoundations[i].length - 1];
            const card = createCardElement(topCard);
            foundation.appendChild(card);
        }
        foundation.onclick = () => moveToFoundation(i);
    }
    
    for (let i = 0; i < 7; i++) {
        const tableau = document.getElementById(`tableau-${i}`);
        tableau.innerHTML = '';
        tableau.ondragover = handleDragOver;
        tableau.ondrop = (e) => handleDrop(e, 'tableau', i);
        tableau.ondragleave = handleDragLeave;
        
        solitarioTableau[i].forEach((card, index) => {
            const cardEl = createCardElement(card, !card.faceUp);
            cardEl.style.top = `${index * 30}px`;
            
            if (card.faceUp) {
                cardEl.draggable = true;
                cardEl.ondragstart = (e) => handleDragStart(e, card, 'tableau', i);
                cardEl.ondragend = handleDragEnd;
                cardEl.onclick = () => selectCard(card, 'tableau', i);
            }
            
            tableau.appendChild(cardEl);
        });
        
        if (solitarioTableau[i].length === 0) {
            tableau.onclick = () => moveToTableau(i);
        }
        
        // Ajustar la altura mínima del tableau según las cartas
        const minHeight = 125 + (solitarioTableau[i].length * 30);
        tableau.style.minHeight = `${minHeight}px`;
    }
}

function createCardElement(card, faceDown = false) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.color}`;
    
    if (faceDown) {
        cardEl.classList.add('back');
        cardEl.textContent = '🂠';
    } else {
        cardEl.innerHTML = `
            <div>${card.value}</div>
            <div>${card.suit}</div>
        `;
    }
    
    return cardEl;
}

function selectCard(card, source, index = -1) {
    solitarioSelectedCard = { card, source, index };
}

function moveToFoundation(foundationIndex) {
    if (!solitarioSelectedCard) return;
    
    const { card, source, index } = solitarioSelectedCard;
    const foundation = solitarioFoundations[foundationIndex];
    
    if (foundation.length === 0 && card.value === 'A') {
        removeCardFromSource(source, index);
        foundation.push(card);
        solitarioMoves++;
        solitarioSelectedCard = null;
        renderSolitario();
        updateMoves();
        checkWin();
    } else if (foundation.length > 0) {
        const topCard = foundation[foundation.length - 1];
        if (card.suit === topCard.suit && card.numValue === topCard.numValue + 1) {
            removeCardFromSource(source, index);
            foundation.push(card);
            solitarioMoves++;
            solitarioSelectedCard = null;
            renderSolitario();
            updateMoves();
            checkWin();
        }
    }
}

function moveToTableau(tableauIndex) {
    if (!solitarioSelectedCard) return;
    
    const { card, source, index } = solitarioSelectedCard;
    const tableau = solitarioTableau[tableauIndex];
    
    if (tableau.length === 0 && card.value === 'K') {
        removeCardFromSource(source, index);
        tableau.push(card);
        solitarioMoves++;
        solitarioSelectedCard = null;
        renderSolitario();
        updateMoves();
    } else if (tableau.length > 0) {
        const topCard = tableau[tableau.length - 1];
        if (card.color !== topCard.color && card.numValue === topCard.numValue - 1) {
            removeCardFromSource(source, index);
            tableau.push(card);
            solitarioMoves++;
            solitarioSelectedCard = null;
            renderSolitario();
            updateMoves();
        }
    }
}

function removeCardFromSource(source, index) {
    if (source === 'waste') {
        solitarioWaste.pop();
    } else if (source === 'tableau') {
        const card = solitarioTableau[index].pop();
        if (solitarioTableau[index].length > 0) {
            solitarioTableau[index][solitarioTableau[index].length - 1].faceUp = true;
        }
    }
}

function drawFromStock() {
    if (solitarioStock.length > 0) {
        const card = solitarioStock.pop();
        card.faceUp = true;
        solitarioWaste.push(card);
        renderSolitario();
    } else if (solitarioWaste.length > 0) {
        solitarioStock = solitarioWaste.reverse();
        solitarioStock.forEach(card => card.faceUp = false);
        solitarioWaste = [];
        renderSolitario();
    }
}

function updateMoves() {
    document.getElementById('solitaire-moves').textContent = solitarioMoves;
}

function checkWin() {
    const totalCards = solitarioFoundations.reduce((sum, foundation) => sum + foundation.length, 0);
    if (totalCards === 52) {
        document.getElementById('solitaire-status').textContent = '🎉';
        setTimeout(() => alert(`¡Ganaste! Movimientos: ${solitarioMoves}`), 100);
    }
}

// Funciones de drag and drop
function handleDragStart(e, card, source, index) {
    draggedCard = card;
    draggedSource = source;
    draggedIndex = index;
    
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e, targetType, targetIndex) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedCard) return false;
    
    let moveSuccess = false;
    
    if (targetType === 'foundation') {
        moveSuccess = tryMoveToFoundation(draggedCard, targetIndex, draggedSource, draggedIndex);
    } else if (targetType === 'tableau') {
        moveSuccess = tryMoveToTableau(draggedCard, targetIndex, draggedSource, draggedIndex);
    }
    
    if (moveSuccess) {
        renderSolitario();
        updateMoves();
        checkWin();
    }
    
    draggedCard = null;
    draggedSource = null;
    draggedIndex = -1;
    
    return false;
}

function tryMoveToFoundation(card, foundationIndex, source, sourceIndex) {
    const foundation = solitarioFoundations[foundationIndex];
    
    if (foundation.length === 0 && card.value === 'A') {
        removeCardFromSource(source, sourceIndex);
        foundation.push(card);
        solitarioMoves++;
        return true;
    } else if (foundation.length > 0) {
        const topCard = foundation[foundation.length - 1];
        if (card.suit === topCard.suit && card.numValue === topCard.numValue + 1) {
            removeCardFromSource(source, sourceIndex);
            foundation.push(card);
            solitarioMoves++;
            return true;
        }
    }
    return false;
}

function tryMoveToTableau(card, tableauIndex, source, sourceIndex) {
    const tableau = solitarioTableau[tableauIndex];
    
    if (tableau.length === 0 && card.value === 'K') {
        removeCardFromSource(source, sourceIndex);
        tableau.push(card);
        solitarioMoves++;
        return true;
    } else if (tableau.length > 0) {
        const topCard = tableau[tableau.length - 1];
        if (card.color !== topCard.color && card.numValue === topCard.numValue - 1) {
            removeCardFromSource(source, sourceIndex);
            tableau.push(card);
            solitarioMoves++;
            return true;
        }
    }
    return false;
}
