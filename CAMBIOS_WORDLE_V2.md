# Cambios Wordle Fútbol - Versión 2.0

## 🎮 CAMBIOS PRINCIPALES

### 1. ✅ Etiquetas de Atributos
Ahora cada pista muestra el nombre del atributo encima del ícono:
- **Dorsal** 👕
- **Liga** 🏆
- **Edad** 📅
- **Títulos** 🏅
- **Nacionalidad** 🌍
- **Equipo** ⚽

### 2. ✅ Modo Actual vs Clásico
Se eliminó el sistema de dificultades (Fácil/Medio/Difícil) y se reemplazó por dos modos de juego:

#### **MODO ACTUAL** ⚡
- Jugadores profesionales actualmente en activo
- **300+ jugadores** de las principales ligas del mundo
- Incluye estrellas actuales de:
  - La Liga (Real Madrid, Barcelona, Atlético, etc.)
  - Premier League (Man City, Arsenal, Liverpool, etc.)
  - Serie A (Inter, Milan, Juventus, Napoli, etc.)
  - Bundesliga (Bayern, Dortmund, Leverkusen, etc.)
  - Ligue 1 (PSG, Lyon, Marsella, etc.)
  - Saudi Pro League (Al-Nassr, Al-Hilal, etc.)
  - MLS, Eredivisie, Liga Portuguesa, y más

#### **MODO CLÁSICO** 🏆
- Jugadores retirados y leyendas del fútbol
- **150+ jugadores legendarios** incluyendo:
  - Fallecidos: Pelé, Maradona, Cruyff, Di Stéfano, Puskas, etc.
  - Generación 2000s: Zidane, Ronaldinho, Ronaldo, Beckham, Henry, etc.
  - Generación 2010s: Xavi, Iniesta, Pirlo, Gerrard, Lampard, etc.
  - Retirados recientes: Ibrahimovic, Robben, Agüero, etc.

### 3. ✅ Selector de Modo Visual
- Botones estilo "tabs" para cambiar entre Actual y Clásico
- Indicador visual del modo activo
- Cambio instantáneo al presionar el botón

## 📊 ESTADÍSTICAS DE LA BASE DE DATOS

### Jugadores Actuales: **300+**
- **La Liga**: 40+ jugadores
- **Premier League**: 80+ jugadores
- **Serie A**: 35+ jugadores
- **Bundesliga**: 30+ jugadores
- **Ligue 1**: 25+ jugadores
- **Saudi Pro League**: 15+ jugadores
- **MLS**: 6+ jugadores
- **Otras ligas**: 20+ jugadores

### Jugadores Clásicos: **150+**
Clasificados por era:
- **Leyendas Fallecidas**: 13 jugadores
- **Era 1990s-2000s**: 50+ jugadores
- **Era 2000s-2010s**: 60+ jugadores
- **Retirados Recientes (2020+)**: 30+ jugadores

## 🎯 EQUIPOS REPRESENTADOS

### Jugadores Actuales
**La Liga**: Real Madrid, Barcelona, Atlético, Betis, Getafe, Valencia, Real Sociedad, Celta, Girona, Osasuna, Mallorca

**Premier**: Man City, Arsenal, Liverpool, Chelsea, Man United, Tottenham, Aston Villa, Newcastle, West Ham, Everton

**Serie A**: Inter, Milan, Juventus, Napoli, Roma, Lazio, Atalanta

**Bundesliga**: Bayern, Dortmund, Leverkusen, RB Leipzig, Frankfurt, Stuttgart

**Ligue 1**: PSG, Lyon, Marsella, Lille, Mónaco

**Otros**: Al-Nassr, Al-Hilal, Al-Ittihad, Inter Miami, Benfica, Porto

### Jugadores Clásicos
Equipos icónicos: Barcelona, Real Madrid, Man United, Milan, Inter, Juventus, Bayern, Arsenal, Liverpool, Chelsea, Ajax, PSV, y muchos más

## 🔧 CAMBIOS TÉCNICOS

### Archivos Modificados:
1. **`wordle-futbol.js`**:
   - Variable `wordleGameMode` para controlar el modo
   - Constante `CURRENT_PLAYERS` con 300+ jugadores actuales
   - Constante `CLASSIC_PLAYERS` con 150+ jugadores retirados
   - Función `setWordleMode()` para cambiar de modo
   - Función `createWordleAttribute()` actualizada con etiquetas
   - Función `initWordleFootball()` actualizada para usar modos

2. **`styles.css`**:
   - Clase `.attribute-label` para los nombres de atributos
   - Clase `.wordle-mode-selector` para los botones de modo

3. **`main.js`**:
   - Inicialización del wordle con modo 'actual' por defecto

## 🎨 INTERFAZ DE USUARIO

### Nuevos Elementos Visuales:
- **Selector de Modo**: Botones con estilo tabs arriba del input
- **Indicador de Modo**: Muestra "Actual" o "Clásico" en la info
- **Etiquetas de Atributos**: Texto pequeño sobre cada ícono indicando qué es

### Layout del Juego:
```
┌─────────────────────────────────┐
│  Intentos: X/8  |  Modo: Actual │
├─────────────────────────────────┤
│  [Actual] [Clásico]             │
├─────────────────────────────────┤
│  [Input de búsqueda] [Enviar]  │
├─────────────────────────────────┤
│  Intentos realizados...         │
│  ┌──────┐ ┌──────┐ ┌──────┐    │
│  │Dorsal│ │ Liga │ │ Edad │    │
│  │  👕  │ │  🏆  │ │  📅  │    │
│  │  10  │ │ MLS  │ │  36  │    │
│  └──────┘ └──────┘ └──────┘    │
├─────────────────────────────────┤
│  [Nueva] [Actualizar] [Pista]  │
└─────────────────────────────────┘
```

## 🚀 FUNCIONALIDADES

### Modo Actual:
- 8 intentos para adivinar
- Base de datos con jugadores en activo
- Incluye jóvenes promesas y estrellas consolidadas
- Actualizado con los traspasos recientes

### Modo Clásico:
- 8 intentos para adivinar
- Base de datos con leyendas del fútbol
- Desde los años 50 hasta retirados de 2023
- Incluye fallecidos y activos como entrenadores

### Pistas Visuales (igual en ambos modos):
- 🟢 **Verde**: Atributo correcto
- 🟡 **Amarillo**: Cerca (±2 para números) con flechas
- ⚫ **Gris**: Incorrecto

## 📝 NOTAS ADICIONALES

- El selector de dificultad del header NO afecta al Wordle
- El Wordle siempre usa su propio sistema de modos
- La base de datos se puede expandir fácilmente añadiendo más jugadores
- Cada jugador tiene: nombre, dorsal, liga, edad, títulos, nacionalidad, equipo

---

**Versión**: 2.0
**Fecha**: 2025
**Total de Jugadores**: 450+
