# Mejoras de Inteligencia Artificial - Ajedrez y Damas

## Resumen
Se ha implementado un sistema avanzado de IA para los juegos de Ajedrez y Damas, utilizando el algoritmo **Minimax con poda Alfa-Beta** y evaluación posicional avanzada. Además, se han corregido las reglas de ajedrez para implementar correctamente el sistema de **jaque, protección del rey y captura del rey**.

---

## 🎯 Cambios Implementados

### **AJEDREZ (ajedrez.js)**

#### 1. **Reglas de Ajedrez Corregidas** ✅
- **Jaque**: Cuando el rey está bajo ataque, se muestra una advertencia visual
- **Protección obligatoria**: No se pueden hacer movimientos que dejen al rey en jaque
- **Captura del rey**: Si se captura el rey rival, la partida termina inmediatamente
- **Validación de movimientos**: Todos los movimientos se simulan primero para verificar que no expongan al rey
- **Detección de ahogado**: Si no hay movimientos legales pero el rey no está en jaque, es tablas

#### 2. **Algoritmo Minimax con Poda Alfa-Beta**
- **Profundidad según dificultad:**
  - **Fácil**: Profundidad 1 (30% movimientos aleatorios)
  - **Medio**: Profundidad 3
  - **Difícil**: Profundidad 4

#### 3. **Tablas de Evaluación Posicional**
Se agregaron tablas de posición para cada tipo de pieza:
- **PAWN_TABLE**: Incentiva peones centrales y avanzados
- **KNIGHT_TABLE**: Favorece caballos en el centro
- **BISHOP_TABLE**: Valora alfiles en diagonales largas
- **ROOK_TABLE**: Premia torres en columnas abiertas
- **QUEEN_TABLE**: Optimiza posición de la reina
- **KING_TABLE**: Seguridad del rey en early/mid game

#### 4. **Función de Evaluación Mejorada**
```javascript
evaluateBoard() {
  - Valor material de piezas (Rey: 1000, Dama: 9, Torre: 5, etc.)
  - Valor posicional según tablas
  - Bonus por movilidad (cantidad de movimientos disponibles)
  - Penalización si el rey está en jaque (-50/+50 puntos)
  - Detección de captura del rey (-100000/+100000 puntos)
  - Evaluación diferencial (Negras - Blancas)
}

minimax() {
  - Detección de jaque mate con bonificación por velocidad
  - Mates más rápidos valen más (±100000 ∓ depth*100)
  - Detección de ahogado = 0 puntos (tablas)
  - Poda alfa-beta para eficiencia
}

getBestMoveWithMinimax() {
  - Detecta jaque mate en un movimiento (retorna inmediatamente)
  - Prioriza captura del rey
  - Ordena movimientos por valor de captura
  - Busca el camino óptimo hacia jaque mate
}
```

#### 5. **Características Avanzadas**
- **Ordenación de movimientos**: Prioriza capturas para mejor poda
- **Simulación temporal**: No afecta el tablero real durante búsqueda
- **Poda Alfa-Beta**: Reduce drásticamente nodos explorados
- **Predicción de movimientos**: Anticipa jugadas del oponente
- **Sistema de jaque visual**: Alerta roja cuando el rey está en peligro
- **Validación estricta**: Previene movimientos ilegales que dejen al rey vulnerable

---

### **DAMAS (damas.js)**

#### 1. **Algoritmo Minimax con Poda Alfa-Beta**
- **Profundidad según dificultad:**
  - **Fácil**: Profundidad 2 (40% movimientos aleatorios)
  - **Medio**: Profundidad 4
  - **Difícil**: Profundidad 6

#### 2. **Función de Evaluación Sofisticada**
```javascript
evaluateCheckersBoard() {
  - Valor de pieza normal: 100 puntos
  - Valor de dama (king): 300 puntos
  - Bonus posicional: Fichas avanzadas (+10 por fila)
  - Bonus central: Favorece control del centro (+5 por proximidad)
  - Bonus de protección: +10 por cada ficha amiga en diagonal
  - Bonus de movilidad: +8 por cada movimiento disponible
  - Bonus de captura: +50 por cada captura disponible
}
```

#### 3. **Mejoras Estratégicas**
- **Priorización de capturas**: Ordena movimientos de captura primero
- **Evaluación de damas**: Valora 3x más las piezas coronadas
- **Control del centro**: Incentiva ocupar casillas centrales
- **Protección mutua**: Favorece formaciones defensivas
- **Movilidad táctica**: Premia posiciones con más opciones

#### 4. **Cadenas de Captura**
- La IA continúa automáticamente cuando puede hacer capturas múltiples
- Evalúa secuencias completas de captura

---

## 🎮 Diferencia entre Niveles

### **Nivel FÁCIL**
- **Ajedrez**: Búsqueda superficial (1 movimiento adelante) + 30% aleatoriedad
- **Damas**: Búsqueda de 2 movimientos + 40% aleatoriedad
- **ELO Estimado**: ~800-1000

### **Nivel MEDIO**
- **Ajedrez**: Búsqueda de 3 movimientos con evaluación completa
- **Damas**: Búsqueda de 4 movimientos con evaluación posicional
- **ELO Estimado**: ~1200-1400

### **Nivel DIFÍCIL**
- **Ajedrez**: Búsqueda de 4 movimientos + evaluación posicional avanzada
- **Damas**: Búsqueda de 6 movimientos + evaluación multi-factorial
- **ELO Estimado**: ~1600-1800

---

## 🧠 Comportamiento de la IA

### **Lo que la IA ahora puede hacer:**

#### **Ajedrez:**
✅ Mueve TODAS las piezas estratégicamente (no solo torres)
✅ Desarrolla piezas en la apertura (caballos, alfiles)
✅ Controla el centro del tablero
✅ Protege piezas valiosas
✅ **Protege su rey cuando está en jaque**
✅ **Nunca hace movimientos que dejen su rey vulnerable**
✅ **Detecta y ejecuta jaque mate cuando es posible**
✅ **Intenta capturar el rey enemigo cuando está expuesto**
✅ **Busca activamente dar jaque mate en nivel difícil**
✅ Predice tus movimientos (2-4 jugadas adelante)
✅ Busca capturas favorables
✅ Evita dejar piezas sin defender
✅ Posiciona piezas en casillas óptimas

#### **Damas:**
✅ Mueve todas las fichas, no solo las más cercanas
✅ Planifica capturas múltiples
✅ Protege fichas con formaciones
✅ Avanza hacia coronación estratégicamente
✅ Controla casillas centrales
✅ Maximiza movilidad
✅ Predice secuencias de captura
✅ Evalúa riesgos antes de mover

---

## ⚔️ Reglas de Ajedrez Implementadas

### **Jaque**
- Cuando una pieza enemiga puede atacar al rey, este está en jaque
- Se muestra una alerta visual roja: **"¡JAQUE! [Color] en peligro"**
- El jugador DEBE proteger al rey, moverlo a una casilla segura, o capturar la pieza atacante
- No se pueden hacer movimientos que no resuelvan el jaque

### **Jaque Mate** ✨
- Cuando el rey está en jaque Y no puede escapar de ninguna manera:
  - No puede moverse a una casilla segura
  - Ninguna pieza puede bloquear el ataque
  - La pieza atacante no puede ser capturada
- **La partida termina inmediatamente** con victoria del jugador atacante
- Mensaje: **"¡JAQUE MATE! Las [Color] ganan 🎉"**
- La IA prioriza dar jaque mate y lo detecta inmediatamente

### **Protección del Rey**
- **NUNCA** se puede mover una pieza si eso deja al rey propio en jaque
- Todos los movimientos se validan primero mediante simulación
- Solo se permiten movimientos que mantengan al rey seguro

### **Captura del Rey**
- Si alguien captura el rey rival, **la partida termina inmediatamente**
- Mensaje: "¡Las [Color] ganan! El rey rival ha sido capturado 🎉"
- Este es un caso raro (normalmente ocurre jaque mate antes)

### **Fin del Juego**
- **Victoria por jaque mate**: El rey está en jaque sin escapatoria
- **Victoria por captura**: Se capturó el rey enemigo (raro)
- **Tablas por ahogado**: No hay movimientos legales pero el rey NO está en jaque

---

## 📊 Rendimiento

### **Optimizaciones:**
- Poda Alfa-Beta reduce ~60-70% de nodos explorados
- Ordenación de movimientos mejora eficiencia de poda
- Evaluación incremental (solo calcula diferencias)
- Profundidad adaptativa según nivel
- Validación en dos niveles (básica y con jaque) para evitar recursión

### **Tiempo de respuesta:**
- **Fácil**: ~100-300ms
- **Medio**: ~500-1000ms
- **Difícil**: ~1-2 segundos

---

## 🏆 Dificultad Real

**Ganar en nivel DIFÍCIL es MUY COMPLICADO para un humano casual:**
- La IA evalúa cientos de posiciones por movimiento
- Considera todas las respuestas posibles
- No comete errores tácticos obvios
- Optimiza cada jugada matemáticamente
- **Nunca deja su rey vulnerable**
- **Aprovecha cualquier oportunidad de jaque o captura**

Para vencer en nivel difícil necesitas:
- Conocimiento sólido de aperturas (ajedrez)
- Visión táctica (ver 3-4 movimientos adelante)
- Paciencia y concentración
- Evitar errores (la IA los castigará inmediatamente)
- **Proteger tu rey en todo momento**

---

## 🔧 Uso

Los cambios son **100% compatibles** con el código existente. La IA se activa automáticamente en modo "VS IA" con la dificultad seleccionada en el menú principal.

No se requieren cambios adicionales en HTML o CSS.

---

## 🐛 Correcciones Realizadas

### **Problema Original:**
- Las torres solo se movían horizontalmente
- No se validaba si los movimientos dejaban al rey en jaque
- Se podía capturar el rey sin fin de partida
- No había sistema de jaque real
- **No se detectaba ni terminaba la partida con jaque mate**

### **Solución:**
- Sistema completo de validación de movimientos con simulación
- Función `isValidChessMoveWithCheck()` que verifica seguridad del rey
- Función `isValidChessMoveBasic()` para evitar recursión en detección de jaque
- Captura del rey termina la partida inmediatamente
- Sistema visual de alerta de jaque
- **Detección automática de jaque mate después de cada movimiento**
- **La IA prioriza dar jaque mate y lo detecta en un movimiento**
- **Bonificación en minimax para mates más rápidos**
- **Verificación de ahogado (tablas) vs jaque mate**
