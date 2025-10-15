let wordleFootballPlayers = [];
let wordleTargetPlayer = null;
let wordleAttempts = [];
let wordleCurrentGuess = '';
let wordleGameOver = false;
let wordleMaxAttempts = 8;
let wordleGameMode = 'actual'; // 'actual' o 'clasico'

// Función para convertir posiciones a abreviaturas en inglés estándar del fútbol
function getPositionAbbr(position) {
    const posMap = {
        // Posiciones generales
        'Portero': 'GK',
        'Defensa': 'D',
        'Centrocampista': 'M',
        'Mediocampista': 'M',
        'Delantero': 'ST',
        
        // Defensas
        'Líbero': 'SW',
        'Defensa Central': 'CB',
        'Central': 'CB',
        'Lateral Derecho': 'RB',
        'Lateral Izquierdo': 'LB',
        'Lateral': 'RB',
        'Carrilero': 'WB',
        'Carrilero Derecho': 'RWB',
        'Carrilero Izquierdo': 'LWB',
        
        // Mediocampistas
        'Mediocentro': 'CM',
        'Mediocentro Defensivo': 'CDM',
        'Pivote': 'CDM',
        'Medio Centro': 'CM',
        'Medio Derecho': 'RM',
        'Medio Izquierdo': 'LM',
        'Mediapunta': 'CAM',
        'Mediocentro Ofensivo': 'CAM',
        'Enganche': 'CAM',
        
        // Delanteros
        'Extremo': 'LW',
        'Extremo Derecho': 'RW',
        'Extremo Izquierdo': 'LW',
        'Segundo Delantero': 'SS',
        'Media Punta': 'CF',
        'Delantero Centro': 'ST',
        'Ariete': 'ST',
        
        // Abreviaturas directas (ya vienen en formato correcto)
        'GK': 'GK',
        'D': 'D',
        'SW': 'SW',
        'CB': 'CB',
        'RCB': 'RCB',
        'LCB': 'LCB',
        'RB': 'RB',
        'LB': 'LB',
        'WB': 'WB',
        'RWB': 'RWB',
        'LWB': 'LWB',
        'M': 'M',
        'DM': 'DM',
        'CDM': 'CDM',
        'CM': 'CM',
        'RM': 'RM',
        'LM': 'LM',
        'AM': 'AM',
        'CAM': 'CAM',
        'AMC': 'CAM',
        'AMR': 'AMR',
        'AML': 'AML',
        'RW': 'RW',
        'LW': 'LW',
        'SS': 'SS',
        'CF': 'CF',
        'ST': 'ST',
        'RF': 'RF',
        'LF': 'LF',
        
        // Compatibilidad con sistema antiguo
        'DF': 'D',
        'MF': 'M',
        'FW': 'ST'
    };
    return posMap[position] || position;
}

// Base de datos de jugadores ACTUALES (en activo)
// Estructura: name, number, league, age, titles, nationality, team, teams (equipos jugados), champions (Sí/No), worldCup (Sí/No), position
const CURRENT_PLAYERS = [
    // LA LIGA - Real Madrid
    { name: 'Courtois', number: 1, league: 'La Liga', age: 32, titles: 18, nationality: 'Bélgica', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Carvajal', number: 2, league: 'La Liga', age: 32, titles: 25, nationality: 'España', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'RB' },
    { name: 'Militão', number: 3, league: 'La Liga', age: 26, titles: 10, nationality: 'Brasil', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'CB' },
    { name: 'Alaba', number: 4, league: 'La Liga', age: 32, titles: 30, nationality: 'Austria', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'CB' },
    { name: 'Bellingham', number: 5, league: 'La Liga', age: 21, titles: 8, nationality: 'Inglaterra', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'CAM' },
    { name: 'Camavinga', number: 6, league: 'La Liga', age: 21, titles: 8, nationality: 'Francia', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'CM' },
    { name: 'Vinicius Jr', number: 7, league: 'La Liga', age: 23, titles: 12, nationality: 'Brasil', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'LW' },
    { name: 'Kroos', number: 8, league: 'La Liga', age: 34, titles: 34, nationality: 'Alemania', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'CM' },
    { name: 'Modrić', number: 10, league: 'La Liga', age: 38, titles: 26, nationality: 'Croacia', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'Rodrygo', number: 11, league: 'La Liga', age: 23, titles: 10, nationality: 'Brasil', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'RW' },
    { name: 'Tchouaméni', number: 14, league: 'La Liga', age: 24, titles: 6, nationality: 'Francia', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'CDM' },
    { name: 'Valverde', number: 15, league: 'La Liga', age: 25, titles: 12, nationality: 'Uruguay', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'Endrick', number: 16, league: 'La Liga', age: 18, titles: 2, nationality: 'Brasil', team: 'Real Madrid', teams: 2, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Mbappé', number: 9, league: 'La Liga', age: 25, titles: 18, nationality: 'Francia', team: 'Real Madrid', teams: 3, champions: 'No', worldCup: 'Sí', position: 'ST' },
    { name: 'Rüdiger', number: 22, league: 'La Liga', age: 31, titles: 9, nationality: 'Alemania', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'CB' },
    { name: 'Mendy', number: 23, league: 'La Liga', age: 29, titles: 12, nationality: 'Francia', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'LB' },
    { name: 'Ceballos', number: 19, league: 'La Liga', age: 28, titles: 6, nationality: 'España', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'Brahim', number: 21, league: 'La Liga', age: 25, titles: 7, nationality: 'España', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'RW' },
    { name: 'Arda Güler', number: 24, league: 'La Liga', age: 19, titles: 2, nationality: 'Turquía', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'CAM' },
    
    // LA LIGA - Barcelona
    { name: 'Ter Stegen', number: 1, league: 'La Liga', age: 32, titles: 20, nationality: 'Alemania', team: 'Barcelona', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'GK' },
    { name: 'Koundé', number: 23, league: 'La Liga', age: 25, titles: 8, nationality: 'Francia', team: 'Barcelona', teams: 3, champions: 'No', worldCup: 'Sí', position: 'CB' },
    { name: 'Araújo', number: 4, league: 'La Liga', age: 25, titles: 5, nationality: 'Uruguay', team: 'Barcelona', teams: 2, champions: 'No', worldCup: 'No', position: 'CB' },
    { name: 'Gavi', number: 6, league: 'La Liga', age: 20, titles: 8, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Pedri', number: 8, league: 'La Liga', age: 21, titles: 10, nationality: 'España', team: 'Barcelona', teams: 2, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Lewandowski', number: 9, league: 'La Liga', age: 35, titles: 30, nationality: 'Polonia', team: 'Barcelona', teams: 5, champions: 'Sí', worldCup: 'No', position: 'ST' },
    { name: 'Raphinha', number: 11, league: 'La Liga', age: 27, titles: 6, nationality: 'Brasil', team: 'Barcelona', teams: 4, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'De Jong', number: 21, league: 'La Liga', age: 27, titles: 7, nationality: 'Países Bajos', team: 'Barcelona', teams: 2, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'Gündogan', number: 22, league: 'La Liga', age: 33, titles: 17, nationality: 'Alemania', team: 'Barcelona', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'CM' },
    { name: 'Cancelo', number: 2, league: 'La Liga', age: 30, titles: 12, nationality: 'Portugal', team: 'Barcelona', teams: 6, champions: 'Sí', worldCup: 'No', position: 'RB' },
    { name: 'Lamine Yamal', number: 19, league: 'La Liga', age: 17, titles: 3, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'Christensen', number: 15, league: 'La Liga', age: 28, titles: 11, nationality: 'Dinamarca', team: 'Barcelona', teams: 3, champions: 'Sí', worldCup: 'No', position: 'CB' },
    { name: 'Iñigo Martínez', number: 5, league: 'La Liga', age: 33, titles: 3, nationality: 'España', team: 'Barcelona', teams: 4, champions: 'No', worldCup: 'No', position: 'CB' },
    { name: 'Ferran Torres', number: 7, league: 'La Liga', age: 24, titles: 9, nationality: 'España', team: 'Barcelona', teams: 3, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'Fermin Lopez', number: 16, league: 'La Liga', age: 21, titles: 2, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Joao Felix', number: 14, league: 'La Liga', age: 25, titles: 4, nationality: 'Portugal', team: 'Barcelona', teams: 4, champions: 'No', worldCup: 'No', position: 'CF' },
    
    // LA LIGA - Atlético Madrid
    { name: 'Oblak', number: 13, league: 'La Liga', age: 31, titles: 8, nationality: 'Eslovenia', team: 'Atlético', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Griezmann', number: 7, league: 'La Liga', age: 33, titles: 22, nationality: 'Francia', team: 'Atlético', teams: 3, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Morata', number: 19, league: 'La Liga', age: 31, titles: 11, nationality: 'España', team: 'Atlético', teams: 6, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Koke', number: 6, league: 'La Liga', age: 32, titles: 9, nationality: 'España', team: 'Atlético', teams: 1, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Llorente', number: 14, league: 'La Liga', age: 29, titles: 7, nationality: 'España', team: 'Atlético', teams: 2, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'De Paul', number: 5, league: 'La Liga', age: 30, titles: 4, nationality: 'Argentina', team: 'Atlético', teams: 3, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Julián Álvarez', number: 9, league: 'La Liga', age: 24, titles: 12, nationality: 'Argentina', team: 'Atlético', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Sørloth', number: 9, league: 'La Liga', age: 28, titles: 3, nationality: 'Noruega', team: 'Atlético', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Witsel', number: 20, league: 'La Liga', age: 35, titles: 8, nationality: 'Bélgica', team: 'Atlético', teams: 5, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Hermoso', number: 22, league: 'La Liga', age: 29, titles: 4, nationality: 'España', team: 'Atlético', teams: 4, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Savic', number: 15, league: 'La Liga', age: 33, titles: 6, nationality: 'Montenegro', team: 'Atlético', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Giménez', number: 2, league: 'La Liga', age: 29, titles: 6, nationality: 'Uruguay', team: 'Atlético', teams: 2, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Saúl', number: 8, league: 'La Liga', age: 29, titles: 7, nationality: 'España', team: 'Atlético', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Barrios', number: 24, league: 'La Liga', age: 21, titles: 2, nationality: 'Argentina', team: 'Atlético', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    
    // LA LIGA - Otros equipos
    { name: 'Isco', number: 22, league: 'La Liga', age: 32, titles: 19, nationality: 'España', team: 'Betis', teams: 5, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Fekir', number: 8, league: 'La Liga', age: 31, titles: 7, nationality: 'Francia', team: 'Betis', teams: 4, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'William Carvalho', number: 14, league: 'La Liga', age: 32, titles: 5, nationality: 'Portugal', team: 'Betis', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Chimy Ávila', number: 9, league: 'La Liga', age: 30, titles: 1, nationality: 'Argentina', team: 'Betis', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'José Gayà', number: 14, league: 'La Liga', age: 29, titles: 4, nationality: 'España', team: 'Valencia', teams: 1, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Oyarzabal', number: 10, league: 'La Liga', age: 27, titles: 5, nationality: 'España', team: 'Real Sociedad', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Merino', number: 6, league: 'La Liga', age: 28, titles: 3, nationality: 'España', team: 'Real Sociedad', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Aspas', number: 10, league: 'La Liga', age: 37, titles: 2, nationality: 'España', team: 'Celta', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Stuani', number: 7, league: 'La Liga', age: 37, titles: 3, nationality: 'Uruguay', team: 'Girona', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Dovbyk', number: 9, league: 'La Liga', age: 26, titles: 1, nationality: 'Ucrania', team: 'Girona', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Budimir', number: 17, league: 'La Liga', age: 33, titles: 1, nationality: 'Croacia', team: 'Osasuna', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Muriqi', number: 7, league: 'La Liga', age: 30, titles: 2, nationality: 'Kosovo', team: 'Mallorca', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Mayoral', number: 16, league: 'La Liga', age: 27, titles: 2, nationality: 'España', team: 'Getafe', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Ünal', number: 9, league: 'La Liga', age: 27, titles: 1, nationality: 'Turquía', team: 'Getafe', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Memphis Depay', number: 9, league: 'La Liga', age: 30, titles: 8, nationality: 'Países Bajos', team: 'Atlético', teams: 6, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Joselu', number: 9, league: 'La Liga', age: 34, titles: 3, nationality: 'España', team: 'Real Madrid', teams: 9, champions: 'Sí', worldCup: 'No', position: 'FW' },
    
    // PREMIER LEAGUE - Manchester City
    // PREMIER LEAGUE - Manchester City
    { name: 'Ederson', number: 31, league: 'Premier', age: 30, titles: 18, nationality: 'Brasil', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Walker', number: 2, league: 'Premier', age: 34, titles: 16, nationality: 'Inglaterra', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Dias', number: 3, league: 'Premier', age: 27, titles: 12, nationality: 'Portugal', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Stones', number: 5, league: 'Premier', age: 30, titles: 15, nationality: 'Inglaterra', team: 'Man City', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Akanji', number: 25, league: 'Premier', age: 29, titles: 8, nationality: 'Suiza', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Rodri', number: 16, league: 'Premier', age: 28, titles: 14, nationality: 'España', team: 'Man City', teams: 2, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'De Bruyne', number: 17, league: 'Premier', age: 32, titles: 16, nationality: 'Bélgica', team: 'Man City', teams: 4, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Haaland', number: 9, league: 'Premier', age: 24, titles: 12, nationality: 'Noruega', team: 'Man City', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Grealish', number: 10, league: 'Premier', age: 28, titles: 8, nationality: 'Inglaterra', team: 'Man City', teams: 2, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Foden', number: 47, league: 'Premier', age: 24, titles: 15, nationality: 'Inglaterra', team: 'Man City', teams: 1, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Bernardo Silva', number: 20, league: 'Premier', age: 29, titles: 15, nationality: 'Portugal', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Kovacic', number: 8, league: 'Premier', age: 30, titles: 15, nationality: 'Croacia', team: 'Man City', teams: 5, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Gvardiol', number: 24, league: 'Premier', age: 22, titles: 4, nationality: 'Croacia', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Doku', number: 11, league: 'Premier', age: 22, titles: 2, nationality: 'Bélgica', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Nunes', number: 27, league: 'Premier', age: 26, titles: 3, nationality: 'Portugal', team: 'Man City', teams: 3, champions: 'Sí', worldCup: 'No', position: 'MF' },
    
    // PREMIER LEAGUE - Arsenal
    { name: 'Ramsdale', number: 1, league: 'Premier', age: 26, titles: 2, nationality: 'Inglaterra', team: 'Arsenal', teams: 4, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Saliba', number: 2, league: 'Premier', age: 23, titles: 2, nationality: 'Francia', team: 'Arsenal', teams: 3, champions: 'No', worldCup: 'Sí', position: 'DF' },
    { name: 'Gabriel', number: 6, league: 'Premier', age: 26, titles: 2, nationality: 'Brasil', team: 'Arsenal', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Saka', number: 7, league: 'Premier', age: 22, titles: 3, nationality: 'Inglaterra', team: 'Arsenal', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Ødegaard', number: 8, league: 'Premier', age: 25, titles: 3, nationality: 'Noruega', team: 'Arsenal', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Martinelli', number: 11, league: 'Premier', age: 23, titles: 2, nationality: 'Brasil', team: 'Arsenal', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Rice', number: 41, league: 'Premier', age: 25, titles: 2, nationality: 'Inglaterra', team: 'Arsenal', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Havertz', number: 29, league: 'Premier', age: 25, titles: 6, nationality: 'Alemania', team: 'Arsenal', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Trossard', number: 19, league: 'Premier', age: 29, titles: 2, nationality: 'Bélgica', team: 'Arsenal', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Raya', number: 22, league: 'Premier', age: 28, titles: 1, nationality: 'España', team: 'Arsenal', teams: 3, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'White', number: 4, league: 'Premier', age: 26, titles: 2, nationality: 'Inglaterra', team: 'Arsenal', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Zinchenko', number: 35, league: 'Premier', age: 27, titles: 8, nationality: 'Ucrania', team: 'Arsenal', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Jorginho', number: 20, league: 'Premier', age: 32, titles: 9, nationality: 'Italia', team: 'Arsenal', teams: 4, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Partey', number: 5, league: 'Premier', age: 31, titles: 3, nationality: 'Ghana', team: 'Arsenal', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Vieira', number: 21, league: 'Premier', age: 24, titles: 2, nationality: 'Portugal', team: 'Arsenal', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Nketiah', number: 14, league: 'Premier', age: 25, titles: 2, nationality: 'Inglaterra', team: 'Arsenal', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Jesus', number: 9, league: 'Premier', age: 27, titles: 12, nationality: 'Brasil', team: 'Arsenal', teams: 2, champions: 'Sí', worldCup: 'No', position: 'FW' },
    
    // PREMIER LEAGUE - Liverpool
    { name: 'Alisson', number: 1, league: 'Premier', age: 31, titles: 12, nationality: 'Brasil', team: 'Liverpool', teams: 3, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Van Dijk', number: 4, league: 'Premier', age: 32, titles: 10, nationality: 'Países Bajos', team: 'Liverpool', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Salah', number: 11, league: 'Premier', age: 32, titles: 14, nationality: 'Egipto', team: 'Liverpool', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Alexander-Arnold', number: 66, league: 'Premier', age: 25, titles: 8, nationality: 'Inglaterra', team: 'Liverpool', teams: 1, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Diaz', number: 7, league: 'Premier', age: 27, titles: 5, nationality: 'Colombia', team: 'Liverpool', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Mac Allister', number: 10, league: 'Premier', age: 25, titles: 4, nationality: 'Argentina', team: 'Liverpool', teams: 3, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Szoboszlai', number: 8, league: 'Premier', age: 23, titles: 3, nationality: 'Hungría', team: 'Liverpool', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Gakpo', number: 18, league: 'Premier', age: 25, titles: 4, nationality: 'Países Bajos', team: 'Liverpool', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Nunez', number: 9, league: 'Premier', age: 25, titles: 3, nationality: 'Uruguay', team: 'Liverpool', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Robertson', number: 26, league: 'Premier', age: 30, titles: 10, nationality: 'Escocia', team: 'Liverpool', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Konaté', number: 5, league: 'Premier', age: 25, titles: 5, nationality: 'Francia', team: 'Liverpool', teams: 3, champions: 'No', worldCup: 'Sí', position: 'DF' },
    { name: 'Endo', number: 3, league: 'Premier', age: 31, titles: 2, nationality: 'Japón', team: 'Liverpool', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Jota', number: 20, league: 'Premier', age: 27, titles: 6, nationality: 'Portugal', team: 'Liverpool', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Gravenberch', number: 38, league: 'Premier', age: 22, titles: 5, nationality: 'Países Bajos', team: 'Liverpool', teams: 3, champions: 'Sí', worldCup: 'No', position: 'MF' },
    
    // PREMIER LEAGUE - Chelsea
    { name: 'Sánchez', number: 1, league: 'Premier', age: 26, titles: 2, nationality: 'España', team: 'Chelsea', teams: 4, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'James', number: 24, league: 'Premier', age: 24, titles: 6, nationality: 'Inglaterra', team: 'Chelsea', teams: 1, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Palmer', number: 20, league: 'Premier', age: 22, titles: 4, nationality: 'Inglaterra', team: 'Chelsea', teams: 2, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Enzo Fernández', number: 8, league: 'Premier', age: 23, titles: 3, nationality: 'Argentina', team: 'Chelsea', teams: 3, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Caicedo', number: 25, league: 'Premier', age: 22, titles: 1, nationality: 'Ecuador', team: 'Chelsea', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Sterling', number: 7, league: 'Premier', age: 29, titles: 12, nationality: 'Inglaterra', team: 'Chelsea', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Jackson', number: 15, league: 'Premier', age: 23, titles: 1, nationality: 'Senegal', team: 'Chelsea', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Gallagher', number: 23, league: 'Premier', age: 24, titles: 1, nationality: 'Inglaterra', team: 'Chelsea', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Mudryk', number: 10, league: 'Premier', age: 23, titles: 1, nationality: 'Ucrania', team: 'Chelsea', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Nkunku', number: 18, league: 'Premier', age: 26, titles: 5, nationality: 'Francia', team: 'Chelsea', teams: 4, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Chilwell', number: 21, league: 'Premier', age: 27, titles: 5, nationality: 'Inglaterra', team: 'Chelsea', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Silva', number: 6, league: 'Premier', age: 40, titles: 28, nationality: 'Brasil', team: 'Chelsea', teams: 6, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Badiashile', number: 4, league: 'Premier', age: 23, titles: 1, nationality: 'Francia', team: 'Chelsea', teams: 2, champions: 'No', worldCup: 'Sí', position: 'DF' },
    { name: 'Disasi', number: 2, league: 'Premier', age: 26, titles: 1, nationality: 'Francia', team: 'Chelsea', teams: 3, champions: 'No', worldCup: 'Sí', position: 'DF' },
    { name: 'Cucurella', number: 3, league: 'Premier', age: 26, titles: 2, nationality: 'España', team: 'Chelsea', teams: 4, champions: 'No', worldCup: 'No', position: 'DF' },
    
    // PREMIER LEAGUE - Manchester United
    { name: 'Onana', number: 24, league: 'Premier', age: 28, titles: 6, nationality: 'Camerún', team: 'Man United', teams: 4, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Bruno Fernandes', number: 8, league: 'Premier', age: 29, titles: 5, nationality: 'Portugal', team: 'Man United', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Rashford', number: 10, league: 'Premier', age: 26, titles: 7, nationality: 'Inglaterra', team: 'Man United', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Casemiro', number: 18, league: 'Premier', age: 32, titles: 22, nationality: 'Brasil', team: 'Man United', teams: 3, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Varane', number: 19, league: 'Premier', age: 31, titles: 21, nationality: 'Francia', team: 'Man United', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Antony', number: 21, league: 'Premier', age: 24, titles: 4, nationality: 'Brasil', team: 'Man United', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Højlund', number: 11, league: 'Premier', age: 21, titles: 1, nationality: 'Dinamarca', team: 'Man United', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Mount', number: 7, league: 'Premier', age: 25, titles: 7, nationality: 'Inglaterra', team: 'Man United', teams: 2, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Maguire', number: 5, league: 'Premier', age: 31, titles: 3, nationality: 'Inglaterra', team: 'Man United', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Shaw', number: 23, league: 'Premier', age: 29, titles: 5, nationality: 'Inglaterra', team: 'Man United', teams: 2, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Garnacho', number: 17, league: 'Premier', age: 20, titles: 2, nationality: 'Argentina', team: 'Man United', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Mainoo', number: 37, league: 'Premier', age: 19, titles: 1, nationality: 'Inglaterra', team: 'Man United', teams: 1, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Eriksen', number: 14, league: 'Premier', age: 32, titles: 8, nationality: 'Dinamarca', team: 'Man United', teams: 6, champions: 'No', worldCup: 'No', position: 'MF' },
    
    // PREMIER LEAGUE - Tottenham
    { name: 'Vicario', number: 13, league: 'Premier', age: 28, titles: 2, nationality: 'Italia', team: 'Tottenham', teams: 3, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Son', number: 7, league: 'Premier', age: 31, titles: 4, nationality: 'Corea del Sur', team: 'Tottenham', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Maddison', number: 10, league: 'Premier', age: 27, titles: 2, nationality: 'Inglaterra', team: 'Tottenham', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Kulusevski', number: 21, league: 'Premier', age: 24, titles: 3, nationality: 'Suecia', team: 'Tottenham', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Romero', number: 17, league: 'Premier', age: 26, titles: 3, nationality: 'Argentina', team: 'Tottenham', teams: 4, champions: 'No', worldCup: 'Sí', position: 'DF' },
    { name: 'Richarlison', number: 9, league: 'Premier', age: 27, titles: 3, nationality: 'Brasil', team: 'Tottenham', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Bissouma', number: 8, league: 'Premier', age: 28, titles: 1, nationality: 'Mali', team: 'Tottenham', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Porro', number: 23, league: 'Premier', age: 25, titles: 2, nationality: 'España', team: 'Tottenham', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Van de Ven', number: 37, league: 'Premier', age: 23, titles: 1, nationality: 'Países Bajos', team: 'Tottenham', teams: 2, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Udogie', number: 38, league: 'Premier', age: 21, titles: 0, nationality: 'Italia', team: 'Tottenham', teams: 2, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Sarr', number: 29, league: 'Premier', age: 22, titles: 0, nationality: 'Senegal', team: 'Tottenham', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Werner', number: 16, league: 'Premier', age: 28, titles: 7, nationality: 'Alemania', team: 'Tottenham', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    
    // PREMIER LEAGUE - Otros equipos
    { name: 'Watkins', number: 11, league: 'Premier', age: 28, titles: 1, nationality: 'Inglaterra', team: 'Aston Villa', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Emi Martínez', number: 1, league: 'Premier', age: 31, titles: 4, nationality: 'Argentina', team: 'Aston Villa', teams: 3, champions: 'No', worldCup: 'Sí', position: 'GK' },
    { name: 'McGinn', number: 7, league: 'Premier', age: 29, titles: 1, nationality: 'Escocia', team: 'Aston Villa', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Douglas Luiz', number: 6, league: 'Premier', age: 26, titles: 2, nationality: 'Brasil', team: 'Aston Villa', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Bailey', number: 31, league: 'Premier', age: 26, titles: 2, nationality: 'Jamaica', team: 'Aston Villa', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Isak', number: 14, league: 'Premier', age: 25, titles: 2, nationality: 'Suecia', team: 'Newcastle', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Bruno Guimarães', number: 39, league: 'Premier', age: 26, titles: 3, nationality: 'Brasil', team: 'Newcastle', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Gordon', number: 10, league: 'Premier', age: 23, titles: 1, nationality: 'Inglaterra', team: 'Newcastle', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Trippier', number: 2, league: 'Premier', age: 34, titles: 6, nationality: 'Inglaterra', team: 'Newcastle', teams: 5, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Paquetá', number: 10, league: 'Premier', age: 27, titles: 3, nationality: 'Brasil', team: 'West Ham', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Bowen', number: 20, league: 'Premier', age: 27, titles: 2, nationality: 'Inglaterra', team: 'West Ham', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Kudus', number: 14, league: 'Premier', age: 24, titles: 4, nationality: 'Ghana', team: 'West Ham', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Pickford', number: 1, league: 'Premier', age: 30, titles: 1, nationality: 'Inglaterra', team: 'Everton', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Calvert-Lewin', number: 9, league: 'Premier', age: 27, titles: 0, nationality: 'Inglaterra', team: 'Everton', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Branthwaite', number: 32, league: 'Premier', age: 22, titles: 0, nationality: 'Inglaterra', team: 'Everton', teams: 1, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Mitoma', number: 22, league: 'Premier', age: 26, titles: 0, nationality: 'Japón', team: 'Brighton', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Estupiñán', number: 30, league: 'Premier', age: 26, titles: 1, nationality: 'Ecuador', team: 'Brighton', teams: 4, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Pedro', number: 30, league: 'Premier', age: 21, titles: 0, nationality: 'Brasil', team: 'Brighton', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Solanke', number: 9, league: 'Premier', age: 26, titles: 1, nationality: 'Inglaterra', team: 'Bournemouth', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    
    // BUNDESLIGA - Bayern Munich
    { name: 'Neuer', number: 1, league: 'Bundesliga', age: 38, titles: 32, nationality: 'Alemania', team: 'Bayern', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'GK' },
    { name: 'Kane', number: 9, league: 'Bundesliga', age: 31, titles: 5, nationality: 'Inglaterra', team: 'Bayern', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Sané', number: 10, league: 'Bundesliga', age: 28, titles: 14, nationality: 'Alemania', team: 'Bayern', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Musiala', number: 42, league: 'Bundesliga', age: 21, titles: 8, nationality: 'Alemania', team: 'Bayern', teams: 1, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Kimmich', number: 6, league: 'Bundesliga', age: 29, titles: 24, nationality: 'Alemania', team: 'Bayern', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Gnabry', number: 7, league: 'Bundesliga', age: 29, titles: 15, nationality: 'Alemania', team: 'Bayern', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Goretzka', number: 8, league: 'Bundesliga', age: 29, titles: 15, nationality: 'Alemania', team: 'Bayern', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Davies', number: 19, league: 'Bundesliga', age: 23, titles: 12, nationality: 'Canadá', team: 'Bayern', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Upamecano', number: 2, league: 'Bundesliga', age: 26, titles: 9, nationality: 'Francia', team: 'Bayern', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'De Ligt', number: 4, league: 'Bundesliga', age: 25, titles: 11, nationality: 'Países Bajos', team: 'Bayern', teams: 4, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Coman', number: 11, league: 'Bundesliga', age: 28, titles: 28, nationality: 'Francia', team: 'Bayern', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Müller', number: 25, league: 'Bundesliga', age: 35, titles: 32, nationality: 'Alemania', team: 'Bayern', teams: 1, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    
    // BUNDESLIGA - Borussia Dortmund
    { name: 'Kobel', number: 1, league: 'Bundesliga', age: 26, titles: 3, nationality: 'Suiza', team: 'Dortmund', teams: 3, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Hummels', number: 15, league: 'Bundesliga', age: 35, titles: 14, nationality: 'Alemania', team: 'Dortmund', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Adeyemi', number: 27, league: 'Bundesliga', age: 22, titles: 2, nationality: 'Alemania', team: 'Dortmund', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Reus', number: 11, league: 'Bundesliga', age: 35, titles: 6, nationality: 'Alemania', team: 'Dortmund', teams: 2, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Brandt', number: 19, league: 'Bundesliga', age: 28, titles: 3, nationality: 'Alemania', team: 'Dortmund', teams: 3, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Füllkrug', number: 9, league: 'Bundesliga', age: 31, titles: 1, nationality: 'Alemania', team: 'Dortmund', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Sabitzer', number: 20, league: 'Bundesliga', age: 30, titles: 12, nationality: 'Austria', team: 'Dortmund', teams: 6, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Süle', number: 25, league: 'Bundesliga', age: 29, titles: 14, nationality: 'Alemania', team: 'Dortmund', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Schlotterbeck', number: 4, league: 'Bundesliga', age: 24, titles: 2, nationality: 'Alemania', team: 'Dortmund', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Nmecha', number: 19, league: 'Bundesliga', age: 25, titles: 1, nationality: 'Alemania', team: 'Dortmund', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    
    // BUNDESLIGA - Bayer Leverkusen
    { name: 'Wirtz', number: 10, league: 'Bundesliga', age: 21, titles: 2, nationality: 'Alemania', team: 'Leverkusen', teams: 1, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Frimpong', number: 30, league: 'Bundesliga', age: 23, titles: 2, nationality: 'Países Bajos', team: 'Leverkusen', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Xhaka', number: 34, league: 'Bundesliga', age: 31, titles: 6, nationality: 'Suiza', team: 'Leverkusen', teams: 5, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Grimaldo', number: 20, league: 'Bundesliga', age: 28, titles: 4, nationality: 'España', team: 'Leverkusen', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Boniface', number: 22, league: 'Bundesliga', age: 23, titles: 1, nationality: 'Nigeria', team: 'Leverkusen', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Hofmann', number: 23, league: 'Bundesliga', age: 32, titles: 1, nationality: 'Alemania', team: 'Leverkusen', teams: 2, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Tah', number: 4, league: 'Bundesliga', age: 28, titles: 2, nationality: 'Alemania', team: 'Leverkusen', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Hincapié', number: 3, league: 'Bundesliga', age: 22, titles: 1, nationality: 'Ecuador', team: 'Leverkusen', teams: 2, champions: 'No', worldCup: 'No', position: 'DF' },
    
    // BUNDESLIGA - Otros equipos
    { name: 'Guirassy', number: 9, league: 'Bundesliga', age: 28, titles: 1, nationality: 'Guinea', team: 'Stuttgart', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Undav', number: 26, league: 'Bundesliga', age: 27, titles: 1, nationality: 'Alemania', team: 'Stuttgart', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Marmoush', number: 7, league: 'Bundesliga', age: 25, titles: 1, nationality: 'Egipto', team: 'Frankfurt', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Götze', number: 27, league: 'Bundesliga', age: 32, titles: 12, nationality: 'Alemania', team: 'Frankfurt', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Olmo', number: 7, league: 'Bundesliga', age: 26, titles: 3, nationality: 'España', team: 'RB Leipzig', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Openda', number: 17, league: 'Bundesliga', age: 24, titles: 1, nationality: 'Bélgica', team: 'RB Leipzig', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Sesko', number: 30, league: 'Bundesliga', age: 21, titles: 0, nationality: 'Eslovenia', team: 'RB Leipzig', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Xavi Simons', number: 10, league: 'Bundesliga', age: 21, titles: 2, nationality: 'Países Bajos', team: 'RB Leipzig', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    
    // SERIE A - Inter Milan
    { name: 'Sommer', number: 1, league: 'Serie A', age: 35, titles: 10, nationality: 'Suiza', team: 'Inter', teams: 4, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Lautaro', number: 10, league: 'Serie A', age: 26, titles: 8, nationality: 'Argentina', team: 'Inter', teams: 2, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Barella', number: 23, league: 'Serie A', age: 27, titles: 7, nationality: 'Italia', team: 'Inter', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Çalhanoğlu', number: 20, league: 'Serie A', age: 30, titles: 6, nationality: 'Turquía', team: 'Inter', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Thuram', number: 9, league: 'Serie A', age: 27, titles: 3, nationality: 'Francia', team: 'Inter', teams: 4, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Bastoni', number: 95, league: 'Serie A', age: 25, titles: 5, nationality: 'Italia', team: 'Inter', teams: 1, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Dumfries', number: 2, league: 'Serie A', age: 28, titles: 4, nationality: 'Países Bajos', team: 'Inter', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Dimarco', number: 32, league: 'Serie A', age: 27, titles: 4, nationality: 'Italia', team: 'Inter', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Mkhitaryan', number: 22, league: 'Serie A', age: 35, titles: 12, nationality: 'Armenia', team: 'Inter', teams: 7, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Pavard', number: 28, league: 'Serie A', age: 28, titles: 18, nationality: 'Francia', team: 'Inter', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    
    // SERIE A - AC Milan
    { name: 'Maignan', number: 16, league: 'Serie A', age: 28, titles: 6, nationality: 'Francia', team: 'Milan', teams: 2, champions: 'No', worldCup: 'Sí', position: 'GK' },
    { name: 'Theo Hernández', number: 19, league: 'Serie A', age: 26, titles: 5, nationality: 'Francia', team: 'Milan', teams: 3, champions: 'No', worldCup: 'Sí', position: 'DF' },
    { name: 'Leão', number: 10, league: 'Serie A', age: 25, titles: 3, nationality: 'Portugal', team: 'Milan', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Pulisic', number: 11, league: 'Serie A', age: 26, titles: 6, nationality: 'USA', team: 'Milan', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Reijnders', number: 14, league: 'Serie A', age: 26, titles: 1, nationality: 'Países Bajos', team: 'Milan', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Tomori', number: 23, league: 'Serie A', age: 26, titles: 2, nationality: 'Inglaterra', team: 'Milan', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Calabria', number: 2, league: 'Serie A', age: 27, titles: 2, nationality: 'Italia', team: 'Milan', teams: 1, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Bennacer', number: 4, league: 'Serie A', age: 27, titles: 2, nationality: 'Argelia', team: 'Milan', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Giroud', number: 9, league: 'Serie A', age: 38, titles: 18, nationality: 'Francia', team: 'Milan', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    
    // SERIE A - Juventus
    { name: 'Szczesny', number: 1, league: 'Serie A', age: 34, titles: 18, nationality: 'Polonia', team: 'Juventus', teams: 3, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Vlahovic', number: 9, league: 'Serie A', age: 24, titles: 3, nationality: 'Serbia', team: 'Juventus', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Chiesa', number: 7, league: 'Serie A', age: 26, titles: 5, nationality: 'Italia', team: 'Juventus', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Locatelli', number: 5, league: 'Serie A', age: 26, titles: 3, nationality: 'Italia', team: 'Juventus', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Rabiot', number: 25, league: 'Serie A', age: 29, titles: 12, nationality: 'Francia', team: 'Juventus', teams: 3, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Bremer', number: 3, league: 'Serie A', age: 27, titles: 4, nationality: 'Brasil', team: 'Juventus', teams: 2, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Danilo', number: 6, league: 'Serie A', age: 33, titles: 18, nationality: 'Brasil', team: 'Juventus', teams: 6, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Cambiaso', number: 27, league: 'Serie A', age: 24, titles: 2, nationality: 'Italia', team: 'Juventus', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Weah', number: 22, league: 'Serie A', age: 24, titles: 1, nationality: 'USA', team: 'Juventus', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Yildiz', number: 10, league: 'Serie A', age: 19, titles: 1, nationality: 'Turquía', team: 'Juventus', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    
    // SERIE A - Napoli
    { name: 'Meret', number: 1, league: 'Serie A', age: 27, titles: 3, nationality: 'Italia', team: 'Napoli', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Kvaratskhelia', number: 77, league: 'Serie A', age: 23, titles: 2, nationality: 'Georgia', team: 'Napoli', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Osimhen', number: 9, league: 'Serie A', age: 25, titles: 3, nationality: 'Nigeria', team: 'Napoli', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Politano', number: 21, league: 'Serie A', age: 30, titles: 2, nationality: 'Italia', team: 'Napoli', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Zielinski', number: 20, league: 'Serie A', age: 30, titles: 5, nationality: 'Polonia', team: 'Napoli', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Anguissa', number: 99, league: 'Serie A', age: 28, titles: 2, nationality: 'Camerún', team: 'Napoli', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Rrahmani', number: 13, league: 'Serie A', age: 30, titles: 2, nationality: 'Kosovo', team: 'Napoli', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Di Lorenzo', number: 22, league: 'Serie A', age: 31, titles: 3, nationality: 'Italia', team: 'Napoli', teams: 3, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Lobotka', number: 68, league: 'Serie A', age: 29, titles: 2, nationality: 'Eslovaquia', team: 'Napoli', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    
    // SERIE A - Roma, Lazio y otros
    { name: 'Dybala', number: 21, league: 'Serie A', age: 30, titles: 12, nationality: 'Argentina', team: 'Roma', teams: 2, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Lukaku', number: 9, league: 'Serie A', age: 31, titles: 15, nationality: 'Bélgica', team: 'Roma', teams: 7, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Pellegrini', number: 7, league: 'Serie A', age: 28, titles: 3, nationality: 'Italia', team: 'Roma', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Cristante', number: 4, league: 'Serie A', age: 29, titles: 2, nationality: 'Italia', team: 'Roma', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Immobile', number: 17, league: 'Serie A', age: 34, titles: 6, nationality: 'Italia', team: 'Lazio', teams: 6, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Luis Alberto', number: 10, league: 'Serie A', age: 31, titles: 3, nationality: 'España', team: 'Lazio', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Zaccagni', number: 20, league: 'Serie A', age: 29, titles: 2, nationality: 'Italia', team: 'Lazio', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Milinkovic-Savic', number: 21, league: 'Serie A', age: 29, titles: 3, nationality: 'Serbia', team: 'Lazio', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Koopmeiners', number: 7, league: 'Serie A', age: 26, titles: 1, nationality: 'Países Bajos', team: 'Atalanta', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Lookman', number: 11, league: 'Serie A', age: 26, titles: 2, nationality: 'Nigeria', team: 'Atalanta', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'De Ketelaere', number: 17, league: 'Serie A', age: 23, titles: 2, nationality: 'Bélgica', team: 'Atalanta', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Scamacca', number: 90, league: 'Serie A', age: 25, titles: 1, nationality: 'Italia', team: 'Atalanta', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Muriel', number: 9, league: 'Serie A', age: 33, titles: 3, nationality: 'Colombia', team: 'Atalanta', teams: 6, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Zapata', number: 91, league: 'Serie A', age: 33, titles: 2, nationality: 'Colombia', team: 'Atalanta', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    
    // LIGUE 1 - PSG
    { name: 'Donnarumma', number: 99, league: 'Ligue 1', age: 25, titles: 8, nationality: 'Italia', team: 'PSG', teams: 3, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Marquinhos', number: 5, league: 'Ligue 1', age: 30, titles: 28, nationality: 'Brasil', team: 'PSG', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Hakimi', number: 2, league: 'Ligue 1', age: 25, titles: 12, nationality: 'Marruecos', team: 'PSG', teams: 5, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Vitinha', number: 17, league: 'Ligue 1', age: 24, titles: 6, nationality: 'Portugal', team: 'PSG', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Zaire-Emery', number: 33, league: 'Ligue 1', age: 18, titles: 3, nationality: 'Francia', team: 'PSG', teams: 1, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Barcola', number: 29, league: 'Ligue 1', age: 22, titles: 2, nationality: 'Francia', team: 'PSG', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Asensio', number: 11, league: 'Ligue 1', age: 28, titles: 18, nationality: 'España', team: 'PSG', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Kolo Muani', number: 23, league: 'Ligue 1', age: 25, titles: 2, nationality: 'Francia', team: 'PSG', teams: 3, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Ramos', number: 9, league: 'Ligue 1', age: 23, titles: 3, nationality: 'Portugal', team: 'PSG', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Ruiz', number: 8, league: 'Ligue 1', age: 28, titles: 4, nationality: 'España', team: 'PSG', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Ugarte', number: 4, league: 'Ligue 1', age: 23, titles: 2, nationality: 'Uruguay', team: 'PSG', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Skriniar', number: 37, league: 'Ligue 1', age: 29, titles: 8, nationality: 'Eslovaquia', team: 'PSG', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Beraldo', number: 35, league: 'Ligue 1', age: 20, titles: 1, nationality: 'Brasil', team: 'PSG', teams: 2, champions: 'No', worldCup: 'No', position: 'DF' },
    { name: 'Lacazette', number: 10, league: 'Ligue 1', age: 33, titles: 8, nationality: 'Francia', team: 'Lyon', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Cherki', number: 18, league: 'Ligue 1', age: 21, titles: 1, nationality: 'Francia', team: 'Lyon', teams: 1, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Fofana', number: 11, league: 'Ligue 1', age: 25, titles: 2, nationality: 'Francia', team: 'Lyon', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Aubameyang', number: 10, league: 'Ligue 1', age: 35, titles: 12, nationality: 'Gabón', team: 'Marsella', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Greenwood', number: 10, league: 'Ligue 1', age: 23, titles: 2, nationality: 'Inglaterra', team: 'Marsella', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Rongier', number: 21, league: 'Ligue 1', age: 29, titles: 1, nationality: 'Francia', team: 'Marsella', teams: 3, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Kondogbia', number: 19, league: 'Ligue 1', age: 31, titles: 6, nationality: 'Rep. Centroafricana', team: 'Marsella', teams: 7, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'David', number: 9, league: 'Ligue 1', age: 24, titles: 5, nationality: 'Canadá', team: 'Lille', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Gomes', number: 8, league: 'Ligue 1', age: 24, titles: 2, nationality: 'Portugal', team: 'Lille', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Cabella', number: 10, league: 'Ligue 1', age: 34, titles: 3, nationality: 'Francia', team: 'Lille', teams: 5, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Ben Yedder', number: 10, league: 'Ligue 1', age: 34, titles: 4, nationality: 'Francia', team: 'Mónaco', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Minamino', number: 18, league: 'Ligue 1', age: 29, titles: 8, nationality: 'Japón', team: 'Mónaco', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Embolo', number: 36, league: 'Ligue 1', age: 27, titles: 3, nationality: 'Suiza', team: 'Mónaco', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    
    // SAUDI PRO LEAGUE
    { name: 'Cristiano Ronaldo', number: 7, league: 'Saudi Pro', age: 39, titles: 35, nationality: 'Portugal', team: 'Al-Nassr', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Mané', number: 10, league: 'Saudi Pro', age: 32, titles: 14, nationality: 'Senegal', team: 'Al-Nassr', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Brozovic', number: 77, league: 'Saudi Pro', age: 31, titles: 10, nationality: 'Croacia', team: 'Al-Nassr', teams: 3, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Laporte', number: 27, league: 'Saudi Pro', age: 30, titles: 12, nationality: 'España', team: 'Al-Nassr', teams: 3, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Neymar', number: 10, league: 'Saudi Pro', age: 32, titles: 28, nationality: 'Brasil', team: 'Al-Hilal', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Mitrovic', number: 9, league: 'Saudi Pro', age: 29, titles: 4, nationality: 'Serbia', team: 'Al-Hilal', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Malcom', number: 77, league: 'Saudi Pro', age: 27, titles: 8, nationality: 'Brasil', team: 'Al-Hilal', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Benzema', number: 9, league: 'Saudi Pro', age: 36, titles: 32, nationality: 'Francia', team: 'Al-Ittihad', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Kanté', number: 7, league: 'Saudi Pro', age: 33, titles: 14, nationality: 'Francia', team: 'Al-Ittihad', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Fabinho', number: 3, league: 'Saudi Pro', age: 30, titles: 11, nationality: 'Brasil', team: 'Al-Ittihad', teams: 4, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Mahrez', number: 26, league: 'Saudi Pro', age: 33, titles: 16, nationality: 'Argelia', team: 'Al-Ahli', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Firmino', number: 9, league: 'Saudi Pro', age: 32, titles: 11, nationality: 'Brasil', team: 'Al-Ahli', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Kessié', number: 20, league: 'Saudi Pro', age: 27, titles: 8, nationality: 'Costa de Marfil', team: 'Al-Ahli', teams: 4, champions: 'Sí', worldCup: 'No', position: 'MF' },
    
    // MLS
    { name: 'Messi', number: 10, league: 'MLS', age: 36, titles: 40, nationality: 'Argentina', team: 'Inter Miami', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Busquets', number: 5, league: 'MLS', age: 35, titles: 32, nationality: 'España', team: 'Inter Miami', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Alba', number: 18, league: 'MLS', age: 35, titles: 25, nationality: 'España', team: 'Inter Miami', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Suárez', number: 9, league: 'MLS', age: 37, titles: 21, nationality: 'Uruguay', team: 'Inter Miami', teams: 7, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Insigne', number: 24, league: 'MLS', age: 33, titles: 7, nationality: 'Italia', team: 'Toronto FC', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Chicharito', number: 14, league: 'MLS', age: 36, titles: 8, nationality: 'México', team: 'LA Galaxy', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Riqui Puig', number: 6, league: 'MLS', age: 25, titles: 3, nationality: 'España', team: 'LA Galaxy', teams: 2, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Driussi', number: 10, league: 'MLS', age: 28, titles: 4, nationality: 'Argentina', team: 'Austin FC', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    
    // EREDIVISIE
    { name: 'Brobbey', number: 9, league: 'Eredivisie', age: 22, titles: 3, nationality: 'Países Bajos', team: 'Ajax', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Timber', number: 3, league: 'Eredivisie', age: 23, titles: 4, nationality: 'Países Bajos', team: 'Ajax', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Bergwijn', number: 10, league: 'Eredivisie', age: 27, titles: 6, nationality: 'Países Bajos', team: 'Ajax', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Lang', number: 10, league: 'Eredivisie', age: 25, titles: 3, nationality: 'Países Bajos', team: 'PSV', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Luuk de Jong', number: 9, league: 'Eredivisie', age: 34, titles: 9, nationality: 'Países Bajos', team: 'PSV', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Bakayoko', number: 11, league: 'Eredivisie', age: 21, titles: 1, nationality: 'Bélgica', team: 'PSV', teams: 1, champions: 'No', worldCup: 'No', position: 'FW' },
    
    // LIGA PORTUGUESA
    { name: 'Otamendi', number: 30, league: 'Primeira', age: 36, titles: 24, nationality: 'Argentina', team: 'Benfica', teams: 6, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Di María', number: 11, league: 'Primeira', age: 36, titles: 28, nationality: 'Argentina', team: 'Benfica', teams: 7, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Rafa Silva', number: 27, league: 'Primeira', age: 31, titles: 12, nationality: 'Portugal', team: 'Benfica', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Evanilson', number: 9, league: 'Primeira', age: 24, titles: 5, nationality: 'Brasil', team: 'Porto', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Pepê', number: 11, league: 'Primeira', age: 27, titles: 6, nationality: 'Brasil', team: 'Porto', teams: 2, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Galeno', number: 13, league: 'Primeira', age: 27, titles: 5, nationality: 'Brasil', team: 'Porto', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    
    // OTROS
    { name: 'Iniesta', number: 8, league: 'Emirates', age: 40, titles: 39, nationality: 'España', team: 'Emirates Club', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Özil', number: 10, league: 'Süper Lig', age: 35, titles: 15, nationality: 'Alemania', team: 'Basaksehir', teams: 5, champions: 'No', worldCup: 'Sí', position: 'MF' }
];

// Base de datos de jugadores de LA LIGA ESPAÑOLA (2024-25)
const LA_LIGA_PLAYERS = [
    // REAL MADRID
    { name: 'Courtois', number: 1, league: 'La Liga', age: 32, titles: 18, nationality: 'Bélgica', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Lunin', number: 13, league: 'La Liga', age: 25, titles: 3, nationality: 'Ucrania', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Carvajal', number: 2, league: 'La Liga', age: 32, titles: 25, nationality: 'España', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'RB' },
    { name: 'Militão', number: 3, league: 'La Liga', age: 26, titles: 10, nationality: 'Brasil', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'CB' },
    { name: 'Alaba', number: 4, league: 'La Liga', age: 32, titles: 30, nationality: 'Austria', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'CB' },
    { name: 'Bellingham', number: 5, league: 'La Liga', age: 21, titles: 8, nationality: 'Inglaterra', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'CAM' },
    { name: 'Camavinga', number: 6, league: 'La Liga', age: 21, titles: 8, nationality: 'Francia', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'CM' },
    { name: 'Vinicius Jr', number: 7, league: 'La Liga', age: 23, titles: 12, nationality: 'Brasil', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'LW' },
    { name: 'Kroos', number: 8, league: 'La Liga', age: 34, titles: 34, nationality: 'Alemania', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'CM' },
    { name: 'Mbappé', number: 9, league: 'La Liga', age: 25, titles: 18, nationality: 'Francia', team: 'Real Madrid', teams: 3, champions: 'No', worldCup: 'Sí', position: 'ST' },
    { name: 'Modrić', number: 10, league: 'La Liga', age: 38, titles: 26, nationality: 'Croacia', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'Rodrygo', number: 11, league: 'La Liga', age: 23, titles: 10, nationality: 'Brasil', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'RW' },
    { name: 'Tchouaméni', number: 14, league: 'La Liga', age: 24, titles: 6, nationality: 'Francia', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'CDM' },
    { name: 'Valverde', number: 15, league: 'La Liga', age: 25, titles: 12, nationality: 'Uruguay', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'Endrick', number: 16, league: 'La Liga', age: 18, titles: 2, nationality: 'Brasil', team: 'Real Madrid', teams: 2, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Rüdiger', number: 22, league: 'La Liga', age: 31, titles: 9, nationality: 'Alemania', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'CB' },
    { name: 'Mendy', number: 23, league: 'La Liga', age: 29, titles: 12, nationality: 'Francia', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'LB' },
    
    // BARCELONA
    { name: 'Ter Stegen', number: 1, league: 'La Liga', age: 32, titles: 20, nationality: 'Alemania', team: 'Barcelona', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'GK' },
    { name: 'Iñaki Peña', number: 13, league: 'La Liga', age: 25, titles: 1, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Koundé', number: 23, league: 'La Liga', age: 25, titles: 8, nationality: 'Francia', team: 'Barcelona', teams: 3, champions: 'No', worldCup: 'Sí', position: 'CB' },
    { name: 'Araújo', number: 4, league: 'La Liga', age: 25, titles: 5, nationality: 'Uruguay', team: 'Barcelona', teams: 2, champions: 'No', worldCup: 'No', position: 'CB' },
    { name: 'Gavi', number: 6, league: 'La Liga', age: 20, titles: 8, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Pedri', number: 8, league: 'La Liga', age: 21, titles: 10, nationality: 'España', team: 'Barcelona', teams: 2, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Lewandowski', number: 9, league: 'La Liga', age: 35, titles: 30, nationality: 'Polonia', team: 'Barcelona', teams: 5, champions: 'Sí', worldCup: 'No', position: 'ST' },
    { name: 'Raphinha', number: 11, league: 'La Liga', age: 27, titles: 6, nationality: 'Brasil', team: 'Barcelona', teams: 4, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'De Jong', number: 21, league: 'La Liga', age: 27, titles: 7, nationality: 'Países Bajos', team: 'Barcelona', teams: 2, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'Gündogan', number: 22, league: 'La Liga', age: 33, titles: 17, nationality: 'Alemania', team: 'Barcelona', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'CM' },
    { name: 'Lamine Yamal', number: 19, league: 'La Liga', age: 17, titles: 3, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'Ferran Torres', number: 7, league: 'La Liga', age: 24, titles: 9, nationality: 'España', team: 'Barcelona', teams: 3, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'Balde', number: 3, league: 'La Liga', age: 21, titles: 2, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'No', worldCup: 'No', position: 'LB' },
    
    // ATLÉTICO MADRID
    { name: 'Oblak', number: 13, league: 'La Liga', age: 31, titles: 8, nationality: 'Eslovenia', team: 'Atlético', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Griezmann', number: 7, league: 'La Liga', age: 33, titles: 22, nationality: 'Francia', team: 'Atlético', teams: 3, champions: 'No', worldCup: 'Sí', position: 'CF' },
    { name: 'Morata', number: 19, league: 'La Liga', age: 31, titles: 11, nationality: 'España', team: 'Atlético', teams: 6, champions: 'Sí', worldCup: 'No', position: 'ST' },
    { name: 'Koke', number: 6, league: 'La Liga', age: 32, titles: 9, nationality: 'España', team: 'Atlético', teams: 1, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Llorente', number: 14, league: 'La Liga', age: 29, titles: 7, nationality: 'España', team: 'Atlético', teams: 2, champions: 'Sí', worldCup: 'No', position: 'CM' },
    { name: 'De Paul', number: 5, league: 'La Liga', age: 30, titles: 4, nationality: 'Argentina', team: 'Atlético', teams: 3, champions: 'No', worldCup: 'Sí', position: 'CM' },
    { name: 'Julián Álvarez', number: 9, league: 'La Liga', age: 24, titles: 12, nationality: 'Argentina', team: 'Atlético', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'ST' },
    { name: 'Sørloth', number: 9, league: 'La Liga', age: 28, titles: 3, nationality: 'Noruega', team: 'Atlético', teams: 7, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Giménez', number: 2, league: 'La Liga', age: 29, titles: 6, nationality: 'Uruguay', team: 'Atlético', teams: 2, champions: 'No', worldCup: 'No', position: 'CB' },
    { name: 'Witsel', number: 20, league: 'La Liga', age: 35, titles: 8, nationality: 'Bélgica', team: 'Atlético', teams: 5, champions: 'No', worldCup: 'No', position: 'CDM' },
    
    // ATHLETIC BILBAO
    { name: 'Unai Simón', number: 1, league: 'La Liga', age: 27, titles: 5, nationality: 'España', team: 'Athletic', teams: 1, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Nico Williams', number: 11, league: 'La Liga', age: 22, titles: 2, nationality: 'España', team: 'Athletic', teams: 1, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'Iñaki Williams', number: 9, league: 'La Liga', age: 30, titles: 1, nationality: 'Ghana', team: 'Athletic', teams: 1, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Sancet', number: 8, league: 'La Liga', age: 24, titles: 1, nationality: 'España', team: 'Athletic', teams: 1, champions: 'No', worldCup: 'No', position: 'CAM' },
    { name: 'Muniain', number: 10, league: 'La Liga', age: 31, titles: 2, nationality: 'España', team: 'Athletic', teams: 1, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'Berenguer', number: 7, league: 'La Liga', age: 29, titles: 2, nationality: 'España', team: 'Athletic', teams: 3, champions: 'No', worldCup: 'No', position: 'RW' },
    
    // REAL SOCIEDAD
    { name: 'Remiro', number: 1, league: 'La Liga', age: 29, titles: 1, nationality: 'España', team: 'Real Sociedad', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Oyarzabal', number: 10, league: 'La Liga', age: 27, titles: 5, nationality: 'España', team: 'Real Sociedad', teams: 1, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'Merino', number: 6, league: 'La Liga', age: 28, titles: 3, nationality: 'España', team: 'Real Sociedad', teams: 4, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Zubimendi', number: 4, league: 'La Liga', age: 25, titles: 1, nationality: 'España', team: 'Real Sociedad', teams: 1, champions: 'No', worldCup: 'No', position: 'CDM' },
    { name: 'Brais Méndez', number: 23, league: 'La Liga', age: 27, titles: 2, nationality: 'España', team: 'Real Sociedad', teams: 2, champions: 'No', worldCup: 'No', position: 'CAM' },
    { name: 'Take Kubo', number: 14, league: 'La Liga', age: 23, titles: 1, nationality: 'Japón', team: 'Real Sociedad', teams: 5, champions: 'No', worldCup: 'No', position: 'RW' },
    
    // VILLARREAL
    { name: 'Filip Jörgensen', number: 13, league: 'La Liga', age: 22, titles: 0, nationality: 'Dinamarca', team: 'Villarreal', teams: 1, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Gerard Moreno', number: 7, league: 'La Liga', age: 32, titles: 4, nationality: 'España', team: 'Villarreal', teams: 3, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Baena', number: 16, league: 'La Liga', age: 23, titles: 1, nationality: 'España', team: 'Villarreal', teams: 1, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'Parejo', number: 10, league: 'La Liga', age: 35, titles: 5, nationality: 'España', team: 'Villarreal', teams: 4, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Sørloth', number: 11, league: 'La Liga', age: 28, titles: 3, nationality: 'Noruega', team: 'Villarreal', teams: 7, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Albiol', number: 3, league: 'La Liga', age: 39, titles: 9, nationality: 'España', team: 'Villarreal', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'CB' },
    
    // REAL BETIS
    { name: 'Rui Silva', number: 13, league: 'La Liga', age: 30, titles: 2, nationality: 'Portugal', team: 'Betis', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Isco', number: 22, league: 'La Liga', age: 32, titles: 19, nationality: 'España', team: 'Betis', teams: 5, champions: 'Sí', worldCup: 'No', position: 'CAM' },
    { name: 'Fekir', number: 8, league: 'La Liga', age: 31, titles: 7, nationality: 'Francia', team: 'Betis', teams: 4, champions: 'No', worldCup: 'Sí', position: 'CAM' },
    { name: 'William Carvalho', number: 14, league: 'La Liga', age: 32, titles: 5, nationality: 'Portugal', team: 'Betis', teams: 4, champions: 'No', worldCup: 'No', position: 'CDM' },
    { name: 'Chimy Ávila', number: 9, league: 'La Liga', age: 30, titles: 1, nationality: 'Argentina', team: 'Betis', teams: 4, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Guido Rodríguez', number: 21, league: 'La Liga', age: 30, titles: 3, nationality: 'Argentina', team: 'Betis', teams: 3, champions: 'No', worldCup: 'Sí', position: 'CDM' },
    { name: 'Ayoze Pérez', number: 10, league: 'La Liga', age: 31, titles: 1, nationality: 'España', team: 'Betis', teams: 4, champions: 'No', worldCup: 'No', position: 'CF' },
    
    // VALENCIA
    { name: 'Mamardashvili', number: 25, league: 'La Liga', age: 24, titles: 0, nationality: 'Georgia', team: 'Valencia', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'José Gayà', number: 14, league: 'La Liga', age: 29, titles: 4, nationality: 'España', team: 'Valencia', teams: 1, champions: 'No', worldCup: 'No', position: 'LB' },
    { name: 'Hugo Duro', number: 9, league: 'La Liga', age: 25, titles: 0, nationality: 'España', team: 'Valencia', teams: 3, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Pepelu', number: 18, league: 'La Liga', age: 26, titles: 0, nationality: 'España', team: 'Valencia', teams: 3, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Foulquier', number: 20, league: 'La Liga', age: 31, titles: 1, nationality: 'Francia', team: 'Valencia', teams: 3, champions: 'No', worldCup: 'No', position: 'RB' },
    
    // SEVILLA
    { name: 'Nyland', number: 13, league: 'La Liga', age: 34, titles: 3, nationality: 'Noruega', team: 'Sevilla', teams: 6, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Jesús Navas', number: 16, league: 'La Liga', age: 39, titles: 18, nationality: 'España', team: 'Sevilla', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'RB' },
    { name: 'Ocampos', number: 5, league: 'La Liga', age: 30, titles: 3, nationality: 'Argentina', team: 'Sevilla', teams: 4, champions: 'No', worldCup: 'Sí', position: 'RW' },
    { name: 'Suso', number: 7, league: 'La Liga', age: 31, titles: 2, nationality: 'España', team: 'Sevilla', teams: 4, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'En-Nesyri', number: 15, league: 'La Liga', age: 27, titles: 2, nationality: 'Marruecos', team: 'Sevilla', teams: 3, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Rakitic', number: 10, league: 'La Liga', age: 36, titles: 18, nationality: 'Croacia', team: 'Sevilla', teams: 4, champions: 'Sí', worldCup: 'No', position: 'CM' },
    
    // CELTA DE VIGO
    { name: 'Iván Villar', number: 13, league: 'La Liga', age: 27, titles: 0, nationality: 'España', team: 'Celta', teams: 1, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Aspas', number: 10, league: 'La Liga', age: 37, titles: 2, nationality: 'España', team: 'Celta', teams: 3, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Borja Iglesias', number: 7, league: 'La Liga', age: 31, titles: 1, nationality: 'España', team: 'Celta', teams: 5, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Fran Beltrán', number: 8, league: 'La Liga', age: 25, titles: 0, nationality: 'España', team: 'Celta', teams: 2, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Hugo Mallo', number: 2, league: 'La Liga', age: 33, titles: 1, nationality: 'España', team: 'Celta', teams: 1, champions: 'No', worldCup: 'No', position: 'RB' },
    
    // GIRONA
    { name: 'Gazzaniga', number: 13, league: 'La Liga', age: 32, titles: 1, nationality: 'Argentina', team: 'Girona', teams: 5, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Stuani', number: 7, league: 'La Liga', age: 37, titles: 3, nationality: 'Uruguay', team: 'Girona', teams: 7, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Dovbyk', number: 9, league: 'La Liga', age: 26, titles: 1, nationality: 'Ucrania', team: 'Girona', teams: 4, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Savinho', number: 16, league: 'La Liga', age: 20, titles: 0, nationality: 'Brasil', team: 'Girona', teams: 2, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'Aleix García', number: 14, league: 'La Liga', age: 27, titles: 0, nationality: 'España', team: 'Girona', teams: 3, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Yan Couto', number: 20, league: 'La Liga', age: 22, titles: 0, nationality: 'Brasil', team: 'Girona', teams: 4, champions: 'No', worldCup: 'No', position: 'RB' },
    
    // OSASUNA
    { name: 'Sergio Herrera', number: 1, league: 'La Liga', age: 31, titles: 1, nationality: 'España', team: 'Osasuna', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Budimir', number: 17, league: 'La Liga', age: 33, titles: 1, nationality: 'Croacia', team: 'Osasuna', teams: 7, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Chimy Ávila', number: 9, league: 'La Liga', age: 30, titles: 1, nationality: 'Argentina', team: 'Osasuna', teams: 4, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Rubén García', number: 14, league: 'La Liga', age: 31, titles: 0, nationality: 'España', team: 'Osasuna', teams: 3, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'Moncayola', number: 7, league: 'La Liga', age: 24, titles: 0, nationality: 'España', team: 'Osasuna', teams: 1, champions: 'No', worldCup: 'No', position: 'CM' },
    
    // GETAFE
    { name: 'Soria', number: 13, league: 'La Liga', age: 31, titles: 0, nationality: 'España', team: 'Getafe', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Mayoral', number: 16, league: 'La Liga', age: 27, titles: 2, nationality: 'España', team: 'Getafe', teams: 5, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Ünal', number: 9, league: 'La Liga', age: 27, titles: 1, nationality: 'Turquía', team: 'Getafe', teams: 5, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Arambarri', number: 18, league: 'La Liga', age: 29, titles: 0, nationality: 'Uruguay', team: 'Getafe', teams: 2, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Dakonam Djené', number: 2, league: 'La Liga', age: 32, titles: 0, nationality: 'Togo', team: 'Getafe', teams: 3, champions: 'No', worldCup: 'No', position: 'CB' },
    
    // RAYO VALLECANO
    { name: 'Dimitrievski', number: 1, league: 'La Liga', age: 30, titles: 1, nationality: 'Macedonia', team: 'Rayo', teams: 3, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Isi Palazón', number: 7, league: 'La Liga', age: 29, titles: 0, nationality: 'España', team: 'Rayo', teams: 3, champions: 'No', worldCup: 'No', position: 'RW' },
    { name: 'Trejo', number: 8, league: 'La Liga', age: 36, titles: 1, nationality: 'Argentina', team: 'Rayo', teams: 4, champions: 'No', worldCup: 'No', position: 'CAM' },
    { name: 'Álvaro García', number: 18, league: 'La Liga', age: 31, titles: 0, nationality: 'España', team: 'Rayo', teams: 3, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'De Frutos', number: 19, league: 'La Liga', age: 27, titles: 0, nationality: 'España', team: 'Rayo', teams: 3, champions: 'No', worldCup: 'No', position: 'RW' },
    
    // MALLORCA
    { name: 'Rajković', number: 1, league: 'La Liga', age: 29, titles: 1, nationality: 'Serbia', team: 'Mallorca', teams: 3, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Muriqi', number: 7, league: 'La Liga', age: 30, titles: 2, nationality: 'Kosovo', team: 'Mallorca', teams: 5, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Dani Rodríguez', number: 14, league: 'La Liga', age: 37, titles: 1, nationality: 'España', team: 'Mallorca', teams: 2, champions: 'No', worldCup: 'No', position: 'CAM' },
    { name: 'Copete', number: 6, league: 'La Liga', age: 24, titles: 0, nationality: 'España', team: 'Mallorca', teams: 3, champions: 'No', worldCup: 'No', position: 'CB' },
    
    // LAS PALMAS
    { name: 'Álvaro Valles', number: 13, league: 'La Liga', age: 27, titles: 1, nationality: 'España', team: 'Las Palmas', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Kirian Rodríguez', number: 20, league: 'La Liga', age: 29, titles: 1, nationality: 'España', team: 'Las Palmas', teams: 1, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Sandro Ramírez', number: 9, league: 'La Liga', age: 29, titles: 1, nationality: 'España', team: 'Las Palmas', teams: 7, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Moleiro', number: 10, league: 'La Liga', age: 21, titles: 0, nationality: 'España', team: 'Las Palmas', teams: 1, champions: 'No', worldCup: 'No', position: 'CAM' },
    
    // ALAVÉS
    { name: 'Sivera', number: 1, league: 'La Liga', age: 27, titles: 0, nationality: 'España', team: 'Alavés', teams: 2, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Guridi', number: 18, league: 'La Liga', age: 28, titles: 0, nationality: 'España', team: 'Alavés', teams: 3, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Kike García', number: 15, league: 'La Liga', age: 34, titles: 0, nationality: 'España', team: 'Alavés', teams: 6, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Luis Rioja', number: 11, league: 'La Liga', age: 31, titles: 0, nationality: 'España', team: 'Alavés', teams: 3, champions: 'No', worldCup: 'No', position: 'LW' },
    
    // LEGANÉS
    { name: 'Dmitrović', number: 13, league: 'La Liga', age: 32, titles: 2, nationality: 'Serbia', team: 'Leganés', teams: 4, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'De la Fuente', number: 8, league: 'La Liga', age: 24, titles: 0, nationality: 'España', team: 'Leganés', teams: 2, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Brasanac', number: 6, league: 'La Liga', age: 30, titles: 1, nationality: 'Serbia', team: 'Leganés', teams: 4, champions: 'No', worldCup: 'No', position: 'CM' },
    
    // ESPANYOL
    { name: 'Joan García', number: 13, league: 'La Liga', age: 23, titles: 1, nationality: 'España', team: 'Espanyol', teams: 1, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Javi Puado', number: 7, league: 'La Liga', age: 26, titles: 1, nationality: 'España', team: 'Espanyol', teams: 1, champions: 'No', worldCup: 'No', position: 'ST' },
    { name: 'Sergi Darder', number: 10, league: 'La Liga', age: 30, titles: 1, nationality: 'España', team: 'Espanyol', teams: 3, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Braithwaite', number: 9, league: 'La Liga', age: 33, titles: 3, nationality: 'Dinamarca', team: 'Espanyol', teams: 7, champions: 'No', worldCup: 'No', position: 'ST' },
    
    // VALLADOLID
    { name: 'Jordi Masip', number: 1, league: 'La Liga', age: 35, titles: 9, nationality: 'España', team: 'Valladolid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Raúl Moro', number: 11, league: 'La Liga', age: 22, titles: 0, nationality: 'España', team: 'Valladolid', teams: 2, champions: 'No', worldCup: 'No', position: 'LW' },
    { name: 'Anuar', number: 10, league: 'La Liga', age: 23, titles: 0, nationality: 'Marruecos', team: 'Valladolid', teams: 2, champions: 'No', worldCup: 'No', position: 'CM' },
    { name: 'Juric', number: 9, league: 'La Liga', age: 28, titles: 1, nationality: 'Bosnia', team: 'Valladolid', teams: 4, champions: 'No', worldCup: 'No', position: 'ST' }
];

// Base de datos de jugadores CLÁSICOS/RETIRADOS
const CLASSIC_PLAYERS = [
    // LEYENDAS REALES - Fallecidos
    { name: 'Pelé', number: 10, league: 'Leyenda', age: 82, titles: 26, nationality: 'Brasil', team: 'Santos/Brasil', teams: 3, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Maradona', number: 10, league: 'Leyenda', age: 60, titles: 11, nationality: 'Argentina', team: 'Napoli/Argentina', teams: 6, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Cruyff', number: 14, league: 'Leyenda', age: 68, titles: 23, nationality: 'Países Bajos', team: 'Ajax/Barcelona', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Di Stéfano', number: 9, league: 'Leyenda', age: 88, titles: 31, nationality: 'Argentina', team: 'Real Madrid', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Puskas', number: 10, league: 'Leyenda', age: 79, titles: 18, nationality: 'Hungría', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Garrincha', number: 7, league: 'Leyenda', age: 49, titles: 12, nationality: 'Brasil', team: 'Botafogo/Brasil', teams: 3, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'George Best', number: 7, league: 'Leyenda', age: 59, titles: 9, nationality: 'Irlanda del Norte', team: 'Man United', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Beckenbauer', number: 5, league: 'Leyenda', age: 78, titles: 20, nationality: 'Alemania', team: 'Bayern', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Eusebio', number: 10, league: 'Leyenda', age: 71, titles: 22, nationality: 'Portugal', team: 'Benfica', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Bobby Charlton', number: 9, league: 'Leyenda', age: 86, titles: 8, nationality: 'Inglaterra', team: 'Man United', teams: 1, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Gerd Müller', number: 9, league: 'Leyenda', age: 75, titles: 20, nationality: 'Alemania', team: 'Bayern', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Ferenc Puskás', number: 10, league: 'Leyenda', age: 79, titles: 18, nationality: 'Hungría', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Paolo Maldini', number: 3, league: 'Leyenda', age: 55, titles: 26, nationality: 'Italia', team: 'Milan', teams: 1, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    
    // GENERACIÓN 2000s-2010s RETIRADOS
    { name: 'Xavi', number: 6, league: 'Retirado', age: 44, titles: 32, nationality: 'España', team: 'Barcelona', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Pirlo', number: 21, league: 'Retirado', age: 45, titles: 20, nationality: 'Italia', team: 'Juventus/Milan', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Lahm', number: 21, league: 'Retirado', age: 40, titles: 23, nationality: 'Alemania', team: 'Bayern', teams: 1, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Schweinsteiger', number: 31, league: 'Retirado', age: 40, titles: 24, nationality: 'Alemania', team: 'Bayern', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Gerrard', number: 8, league: 'Retirado', age: 44, titles: 11, nationality: 'Inglaterra', team: 'Liverpool', teams: 2, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Lampard', number: 8, league: 'Retirado', age: 46, titles: 16, nationality: 'Inglaterra', team: 'Chelsea', teams: 4, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Terry', number: 26, league: 'Retirado', age: 43, titles: 17, nationality: 'Inglaterra', team: 'Chelsea', teams: 1, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Vidic', number: 15, league: 'Retirado', age: 42, titles: 15, nationality: 'Serbia', team: 'Man United', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Ferdinand', number: 5, league: 'Retirado', age: 45, titles: 14, nationality: 'Inglaterra', team: 'Man United', teams: 4, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Van Persie', number: 20, league: 'Retirado', age: 41, titles: 8, nationality: 'Países Bajos', team: 'Arsenal', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Rooney', number: 10, league: 'Retirado', age: 38, titles: 16, nationality: 'Inglaterra', team: 'Man United', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'David Villa', number: 7, league: 'Retirado', age: 42, titles: 19, nationality: 'España', team: 'Barcelona/España', teams: 7, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Torres', number: 9, league: 'Retirado', age: 40, titles: 18, nationality: 'España', team: 'Atlético/Chelsea', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Totti', number: 10, league: 'Retirado', age: 48, titles: 6, nationality: 'Italia', team: 'Roma', teams: 1, champions: 'No', worldCup: 'Sí', position: 'MF' },
    { name: 'Del Piero', number: 10, league: 'Retirado', age: 49, titles: 21, nationality: 'Italia', team: 'Juventus', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Drogba', number: 11, league: 'Retirado', age: 46, titles: 20, nationality: 'Costa de Marfil', team: 'Chelsea', teams: 6, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Samuel Eto\'o', number: 9, league: 'Retirado', age: 43, titles: 22, nationality: 'Camerún', team: 'Barcelona/Inter', teams: 7, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Kaka', number: 22, league: 'Retirado', age: 42, titles: 15, nationality: 'Brasil', team: 'Milan/Real Madrid', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Ronaldinho', number: 10, league: 'Retirado', age: 44, titles: 23, nationality: 'Brasil', team: 'Barcelona', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Ronaldo Nazario', number: 9, league: 'Retirado', age: 47, titles: 18, nationality: 'Brasil', team: 'Real Madrid/Inter', teams: 6, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Rivaldo', number: 10, league: 'Retirado', age: 51, titles: 18, nationality: 'Brasil', team: 'Barcelona', teams: 8, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Raúl', number: 7, league: 'Retirado', age: 46, titles: 22, nationality: 'España', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Casillas', number: 1, league: 'Retirado', age: 43, titles: 25, nationality: 'España', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'Sí', position: 'GK' },
    { name: 'Buffon', number: 1, league: 'Retirado', age: 46, titles: 26, nationality: 'Italia', team: 'Juventus', teams: 3, champions: 'No', worldCup: 'Sí', position: 'GK' },
    { name: 'Cech', number: 1, league: 'Retirado', age: 42, titles: 20, nationality: 'Rep. Checa', team: 'Chelsea', teams: 4, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Van der Sar', number: 1, league: 'Retirado', age: 53, titles: 25, nationality: 'Países Bajos', team: 'Man United', teams: 5, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Zanetti', number: 4, league: 'Retirado', age: 50, titles: 16, nationality: 'Argentina', team: 'Inter', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Maldini', number: 3, league: 'Retirado', age: 55, titles: 26, nationality: 'Italia', team: 'Milan', teams: 1, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Nesta', number: 13, league: 'Retirado', age: 48, titles: 16, nationality: 'Italia', team: 'Milan', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Cannavaro', number: 5, league: 'Retirado', age: 51, titles: 10, nationality: 'Italia', team: 'Real Madrid/Juventus', teams: 6, champions: 'No', worldCup: 'Sí', position: 'DF' },
    { name: 'Puyol', number: 5, league: 'Retirado', age: 46, titles: 21, nationality: 'España', team: 'Barcelona', teams: 1, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Carlos', number: 3, league: 'Retirado', age: 51, titles: 13, nationality: 'Brasil', team: 'Real Madrid', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Cafu', number: 2, league: 'Retirado', age: 54, titles: 17, nationality: 'Brasil', team: 'Milan/Brasil', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Seedorf', number: 10, league: 'Retirado', age: 48, titles: 21, nationality: 'Países Bajos', team: 'Milan', teams: 6, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Gattuso', number: 8, league: 'Retirado', age: 46, titles: 15, nationality: 'Italia', team: 'Milan', teams: 4, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Nedved', number: 11, league: 'Retirado', age: 52, titles: 14, nationality: 'Rep. Checa', team: 'Juventus', teams: 4, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Zidane', number: 5, league: 'Retirado', age: 52, titles: 15, nationality: 'Francia', team: 'Real Madrid', teams: 3, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Figo', number: 7, league: 'Retirado', age: 52, titles: 20, nationality: 'Portugal', team: 'Real Madrid/Barcelona', teams: 6, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Beckham', number: 7, league: 'Retirado', age: 49, titles: 19, nationality: 'Inglaterra', team: 'Man United/Real Madrid', teams: 5, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Scholes', number: 18, league: 'Retirado', age: 49, titles: 25, nationality: 'Inglaterra', team: 'Man United', teams: 1, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Giggs', number: 11, league: 'Retirado', age: 50, titles: 34, nationality: 'Gales', team: 'Man United', teams: 1, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Shevchenko', number: 7, league: 'Retirado', age: 48, titles: 11, nationality: 'Ucrania', team: 'Milan', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Henry', number: 14, league: 'Retirado', age: 46, titles: 17, nationality: 'Francia', team: 'Arsenal/Barcelona', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Bergkamp', number: 10, league: 'Retirado', age: 55, titles: 11, nationality: 'Países Bajos', team: 'Arsenal', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Van Nistelrooy', number: 10, league: 'Retirado', age: 48, titles: 14, nationality: 'Países Bajos', team: 'Man United/Real Madrid', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Batistuta', number: 9, league: 'Retirado', age: 55, titles: 6, nationality: 'Argentina', team: 'Fiorentina/Roma', teams: 6, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Inzaghi', number: 9, league: 'Retirado', age: 51, titles: 18, nationality: 'Italia', team: 'Milan/Juventus', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Vieri', number: 32, league: 'Retirado', age: 51, titles: 7, nationality: 'Italia', team: 'Inter', teams: 9, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Crespo', number: 11, league: 'Retirado', age: 49, titles: 10, nationality: 'Argentina', team: 'Inter/Chelsea', teams: 8, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Riquelme', number: 10, league: 'Retirado', age: 46, titles: 12, nationality: 'Argentina', team: 'Boca/Villarreal', teams: 4, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Aimar', number: 10, league: 'Retirado', age: 44, titles: 8, nationality: 'Argentina', team: 'Valencia/Benfica', teams: 6, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Forlán', number: 10, league: 'Retirado', age: 45, titles: 8, nationality: 'Uruguay', team: 'Atlético/Man United', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Chilavert', number: 1, league: 'Retirado', age: 59, titles: 8, nationality: 'Paraguay', team: 'Vélez', teams: 5, champions: 'No', worldCup: 'No', position: 'GK' },
    { name: 'Valderrama', number: 10, league: 'Retirado', age: 63, titles: 5, nationality: 'Colombia', team: 'Colombia', teams: 8, champions: 'No', worldCup: 'No', position: 'MF' },
    { name: 'Hagi', number: 10, league: 'Retirado', age: 59, titles: 20, nationality: 'Rumania', team: 'Galatasaray/Barcelona', teams: 7, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Stoichkov', number: 8, league: 'Retirado', age: 58, titles: 15, nationality: 'Bulgaria', team: 'Barcelona', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Romario', number: 11, league: 'Retirado', age: 58, titles: 16, nationality: 'Brasil', team: 'Barcelona/PSV', teams: 8, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Bebeto', number: 7, league: 'Retirado', age: 60, titles: 12, nationality: 'Brasil', team: 'Deportivo/Brasil', teams: 6, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Desailly', number: 8, league: 'Retirado', age: 56, titles: 14, nationality: 'Francia', team: 'Chelsea/Milan', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Thuram', number: 15, league: 'Retirado', age: 52, titles: 12, nationality: 'Francia', team: 'Juventus/Barcelona', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Blanc', number: 5, league: 'Retirado', age: 58, titles: 12, nationality: 'Francia', team: 'Man United/Inter', teams: 7, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Vieira', number: 4, league: 'Retirado', age: 48, titles: 19, nationality: 'Francia', team: 'Arsenal/Inter', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Makelele', number: 6, league: 'Retirado', age: 51, titles: 14, nationality: 'Francia', team: 'Real Madrid/Chelsea', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Lizarazu', number: 3, league: 'Retirado', age: 54, titles: 17, nationality: 'Francia', team: 'Bayern', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'DF' },
    { name: 'Klinsmann', number: 18, league: 'Retirado', age: 60, titles: 13, nationality: 'Alemania', team: 'Bayern/Inter', teams: 7, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Matthäus', number: 10, league: 'Retirado', age: 63, titles: 19, nationality: 'Alemania', team: 'Bayern/Inter', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Ballack', number: 13, league: 'Retirado', age: 48, titles: 18, nationality: 'Alemania', team: 'Bayern/Chelsea', teams: 5, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Klose', number: 11, league: 'Retirado', age: 46, titles: 12, nationality: 'Alemania', team: 'Bayern/Lazio', teams: 5, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Podolski', number: 10, league: 'Retirado', age: 39, titles: 8, nationality: 'Alemania', team: 'Bayern/Arsenal', teams: 6, champions: 'No', worldCup: 'Sí', position: 'FW' },
    { name: 'Owen', number: 10, league: 'Retirado', age: 44, titles: 9, nationality: 'Inglaterra', team: 'Liverpool/Real Madrid', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Shearer', number: 9, league: 'Retirado', age: 53, titles: 3, nationality: 'Inglaterra', team: 'Newcastle', teams: 3, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Cole', number: 3, league: 'Retirado', age: 43, titles: 15, nationality: 'Inglaterra', team: 'Chelsea/Arsenal', teams: 5, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Carragher', number: 23, league: 'Retirado', age: 46, titles: 11, nationality: 'Inglaterra', team: 'Liverpool', teams: 1, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Keane', number: 16, league: 'Retirado', age: 52, titles: 17, nationality: 'Irlanda', team: 'Man United', teams: 3, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Schmeichel', number: 1, league: 'Retirado', age: 60, titles: 19, nationality: 'Dinamarca', team: 'Man United', teams: 4, champions: 'Sí', worldCup: 'No', position: 'GK' },
    { name: 'Larsson', number: 7, league: 'Retirado', age: 53, titles: 19, nationality: 'Suecia', team: 'Celtic/Barcelona', teams: 5, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Ibrahimovic', number: 10, league: 'Retirado', age: 42, titles: 34, nationality: 'Suecia', team: 'Milan/PSG/Barcelona', teams: 8, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Sneijder', number: 10, league: 'Retirado', age: 40, titles: 14, nationality: 'Países Bajos', team: 'Inter/Real Madrid', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Van Basten', number: 9, league: 'Retirado', age: 59, titles: 21, nationality: 'Países Bajos', team: 'Milan', teams: 2, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Gullit', number: 10, league: 'Retirado', age: 62, titles: 18, nationality: 'Países Bajos', team: 'Milan', teams: 6, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Rijkaard', number: 3, league: 'Retirado', age: 62, titles: 16, nationality: 'Países Bajos', team: 'Milan/Ajax', teams: 5, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Koeman', number: 4, league: 'Retirado', age: 61, titles: 20, nationality: 'Países Bajos', team: 'Barcelona', teams: 6, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Overmars', number: 11, league: 'Retirado', age: 51, titles: 17, nationality: 'Países Bajos', team: 'Arsenal/Ajax', teams: 4, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Davids', number: 1, league: 'Retirado', age: 51, titles: 14, nationality: 'Países Bajos', team: 'Juventus/Ajax', teams: 7, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Stam', number: 6, league: 'Retirado', age: 52, titles: 14, nationality: 'Países Bajos', team: 'Man United/Milan', teams: 6, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Robben', number: 10, league: 'Retirado', age: 40, titles: 25, nationality: 'Países Bajos', team: 'Bayern/Chelsea/Real Madrid', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Adriano', number: 10, league: 'Retirado', age: 42, titles: 11, nationality: 'Brasil', team: 'Inter', teams: 6, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Kaká', number: 8, league: 'Retirado', age: 42, titles: 15, nationality: 'Brasil', team: 'Milan/Real Madrid', teams: 5, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Robinho', number: 7, league: 'Retirado', age: 40, titles: 12, nationality: 'Brasil', team: 'Real Madrid/Man City', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Pato', number: 7, league: 'Retirado', age: 35, titles: 6, nationality: 'Brasil', team: 'Milan', teams: 5, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Neymar Jr', number: 11, league: 'Retirado', age: 32, titles: 28, nationality: 'Brasil', team: 'Barcelona/PSG', teams: 3, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Dani Alves', number: 2, league: 'Retirado', age: 41, titles: 43, nationality: 'Brasil', team: 'Barcelona/Juventus', teams: 7, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Marcelo', number: 12, league: 'Retirado', age: 36, titles: 25, nationality: 'Brasil', team: 'Real Madrid', teams: 2, champions: 'Sí', worldCup: 'No', position: 'DF' },
    { name: 'Mascherano', number: 14, league: 'Retirado', age: 40, titles: 20, nationality: 'Argentina', team: 'Barcelona/Liverpool', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'MF' },
    { name: 'Agüero', number: 10, league: 'Retirado', age: 36, titles: 16, nationality: 'Argentina', team: 'Man City', teams: 4, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Higuaín', number: 9, league: 'Retirado', age: 36, titles: 16, nationality: 'Argentina', team: 'Real Madrid/Juventus/Napoli', teams: 7, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Tevez', number: 10, league: 'Retirado', age: 40, titles: 18, nationality: 'Argentina', team: 'Man United/Man City/Juventus', teams: 7, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Di María', number: 7, league: 'Retirado', age: 36, titles: 28, nationality: 'Argentina', team: 'Real Madrid/PSG/Man United', teams: 6, champions: 'Sí', worldCup: 'Sí', position: 'FW' },
    { name: 'Falcao', number: 9, league: 'Retirado', age: 38, titles: 11, nationality: 'Colombia', team: 'Atlético/Mónaco', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'James Rodríguez', number: 10, league: 'Retirado', age: 33, titles: 12, nationality: 'Colombia', team: 'Real Madrid/Bayern', teams: 7, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Alexis Sánchez', number: 7, league: 'Retirado', age: 35, titles: 15, nationality: 'Chile', team: 'Barcelona/Arsenal/Inter', teams: 7, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Vidal', number: 23, league: 'Retirado', age: 37, titles: 24, nationality: 'Chile', team: 'Juventus/Bayern/Barcelona', teams: 6, champions: 'Sí', worldCup: 'No', position: 'MF' },
    { name: 'Cavani', number: 21, league: 'Retirado', age: 37, titles: 14, nationality: 'Uruguay', team: 'PSG/Man United', teams: 6, champions: 'No', worldCup: 'No', position: 'FW' },
    { name: 'Suárez', number: 9, league: 'Retirado', age: 37, titles: 21, nationality: 'Uruguay', team: 'Barcelona/Liverpool/Atlético', teams: 7, champions: 'Sí', worldCup: 'No', position: 'FW' },
    { name: 'Godín', number: 3, league: 'Retirado', age: 38, titles: 10, nationality: 'Uruguay', team: 'Atlético/Inter', teams: 6, champions: 'No', worldCup: 'No', position: 'DF' }
];

function initWordleFootball(mode) {
    wordleGameOver = false;
    wordleAttempts = [];
    wordleCurrentGuess = '';
    wordleGameMode = mode || 'actual';
    wordleMaxAttempts = 8;
    
    // Seleccionar base de datos según el modo
    let playerDatabase;
    if (wordleGameMode === 'laliga') {
        playerDatabase = LA_LIGA_PLAYERS;
    } else if (wordleGameMode === 'clasico') {
        playerDatabase = CLASSIC_PLAYERS;
    } else {
        playerDatabase = CURRENT_PLAYERS;
    }
    
    // Seleccionar jugador aleatorio
    wordleTargetPlayer = playerDatabase[Math.floor(Math.random() * playerDatabase.length)];
    wordleFootballPlayers = [...playerDatabase];
    
    createWordleFootballBoard();
}

function createWordleFootballBoard() {
    const gameArea = document.getElementById('game-area');
    
    // Determinar el texto del modo
    let modeText = 'Actual';
    if (wordleGameMode === 'clasico') modeText = 'Clásico';
    if (wordleGameMode === 'laliga') modeText = 'Liga Española';
    
    gameArea.innerHTML = `
        <div class="wordle-football-game">
            <div class="wordle-info">
                <div>Intentos: <span id="wordle-attempts">${wordleAttempts.length}/${wordleMaxAttempts}</span></div>
                <div style="color: #00d4ff;">⚽ Adivina el Jugador ⚽</div>
                <div style="color: #ffd700;">Modo: <span id="wordle-mode-display">${modeText}</span></div>
            </div>
            
            <div class="wordle-mode-selector">
                <button onclick="setWordleMode('actual')" class="mode-btn ${wordleGameMode === 'actual' ? 'active' : ''}" id="wordle-mode-actual">Actual</button>
                <button onclick="setWordleMode('clasico')" class="mode-btn ${wordleGameMode === 'clasico' ? 'active' : ''}" id="wordle-mode-classic">Clásico</button>
                <button onclick="setWordleMode('laliga')" class="mode-btn ${wordleGameMode === 'laliga' ? 'active' : ''}" id="wordle-mode-laliga">Liga Española</button>
            </div>
            
            <div class="wordle-search-container">
                <input type="text" 
                       id="wordle-search" 
                       placeholder="Busca un jugador..."
                       autocomplete="off"
                       list="wordle-players-list">
                <datalist id="wordle-players-list"></datalist>
                <button onclick="submitWordleGuess()">Enviar</button>
            </div>
            
            <div class="wordle-attempts-container" id="wordle-attempts-list"></div>
            
            <div class="wordle-legend">
                <div class="legend-item">
                    <div class="legend-box correct"></div>
                    <span>Correcto</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box partial"></div>
                    <span>Cerca (±2)</span>
                </div>
                <div class="legend-item">
                    <div class="legend-box incorrect"></div>
                    <span>Incorrecto</span>
                </div>
            </div>
            
            <div class="wordle-controls">
                <button onclick="initWordleFootball(wordleGameMode)">Nueva Partida</button>
                <button onclick="refreshWordlePlayer()">Actualizar Jugador</button>
                <button onclick="showWordleHint()">Pista</button>
            </div>
        </div>
    `;
    
    // Poblar lista de jugadores
    const datalist = document.getElementById('wordle-players-list');
    wordleFootballPlayers.forEach(player => {
        const option = document.createElement('option');
        option.value = player.name;
        datalist.appendChild(option);
    });
    
    // Enter para enviar
    document.getElementById('wordle-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitWordleGuess();
        }
    });
}

function submitWordleGuess() {
    if (wordleGameOver) return;
    
    const input = document.getElementById('wordle-search');
    const guessName = input.value.trim();
    
    // Buscar jugador
    const guessedPlayer = wordleFootballPlayers.find(p => 
        p.name.toLowerCase() === guessName.toLowerCase()
    );
    
    if (!guessedPlayer) {
        alert('Jugador no encontrado en la base de datos');
        return;
    }
    
    // Verificar si ya fue intentado
    if (wordleAttempts.some(a => a.name === guessedPlayer.name)) {
        alert('Ya intentaste con este jugador');
        return;
    }
    
    // Agregar intento
    wordleAttempts.push(guessedPlayer);
    input.value = '';
    
    // Renderizar intento
    renderWordleAttempt(guessedPlayer);
    
    // Actualizar contador
    document.getElementById('wordle-attempts').textContent = 
        `${wordleAttempts.length}/${wordleMaxAttempts}`;
    
    // Verificar victoria
    if (guessedPlayer.name === wordleTargetPlayer.name) {
        wordleGameOver = true;
        setTimeout(() => {
            alert(`¡Correcto! Era ${wordleTargetPlayer.name} ⚽🎉\n` +
                  `Lo adivinaste en ${wordleAttempts.length} intentos!`);
        }, 500);
        return;
    }
    
    // Verificar derrota
    if (wordleAttempts.length >= wordleMaxAttempts) {
        wordleGameOver = true;
        setTimeout(() => {
            alert(`¡Se acabaron los intentos! 😢\n` +
                  `Era ${wordleTargetPlayer.name}\n` +
                  `${wordleTargetPlayer.team} - ${wordleTargetPlayer.league}`);
        }, 500);
    }
}

function renderWordleAttempt(player) {
    const container = document.getElementById('wordle-attempts-list');
    const attemptDiv = document.createElement('div');
    attemptDiv.className = 'wordle-attempt';
    
    // Nombre del jugador
    const nameDiv = document.createElement('div');
    nameDiv.className = 'wordle-player-name';
    nameDiv.textContent = player.name;
    attemptDiv.appendChild(nameDiv);
    
    // Grid de atributos
    const gridDiv = document.createElement('div');
    gridDiv.className = 'wordle-attribute-grid';
    
    // Dorsal
    const numberDiv = createWordleAttribute(
        'number',
        player.number,
        wordleTargetPlayer.number,
        '👕'
    );
    gridDiv.appendChild(numberDiv);
    
    // Liga
    const leagueDiv = createWordleAttribute(
        'league',
        player.league,
        wordleTargetPlayer.league,
        '🏆'
    );
    gridDiv.appendChild(leagueDiv);
    
    // Edad
    const ageDiv = createWordleAttribute(
        'age',
        player.age,
        wordleTargetPlayer.age,
        '📅'
    );
    gridDiv.appendChild(ageDiv);
    
    // Títulos
    const titlesDiv = createWordleAttribute(
        'titles',
        player.titles,
        wordleTargetPlayer.titles,
        '🏅'
    );
    gridDiv.appendChild(titlesDiv);
    
    // Nacionalidad
    const nationalityDiv = createWordleAttribute(
        'nationality',
        player.nationality,
        wordleTargetPlayer.nationality,
        '🌍'
    );
    gridDiv.appendChild(nationalityDiv);
    
    // Equipo
    const teamDiv = createWordleAttribute(
        'team',
        player.team,
        wordleTargetPlayer.team,
        '⚽'
    );
    gridDiv.appendChild(teamDiv);
    
    // NUEVOS ATRIBUTOS
    // Número de Equipos
    const teamsDiv = createWordleAttribute(
        'teams',
        player.teams || 1,
        wordleTargetPlayer.teams || 1,
        '🔄'
    );
    gridDiv.appendChild(teamsDiv);
    
    // Champions League
    const championsDiv = createWordleAttribute(
        'champions',
        player.champions || 'No',
        wordleTargetPlayer.champions || 'No',
        '🏆'
    );
    gridDiv.appendChild(championsDiv);
    
    // Mundial
    const worldCupDiv = createWordleAttribute(
        'worldCup',
        player.worldCup || 'No',
        wordleTargetPlayer.worldCup || 'No',
        '🌍'
    );
    gridDiv.appendChild(worldCupDiv);
    
    // Posición
    const positionDiv = createWordleAttribute(
        'position',
        player.position || 'Desconocido',
        wordleTargetPlayer.position || 'Desconocido',
        '👤'
    );
    gridDiv.appendChild(positionDiv);
    
    attemptDiv.appendChild(gridDiv);
    container.insertBefore(attemptDiv, container.firstChild);
    
    // Animación mejorada
    attemptDiv.style.animation = 'slideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
}

function createWordleAttribute(type, guessValue, targetValue, icon) {
    const div = document.createElement('div');
    div.className = 'wordle-attribute';
    
    let statusClass = 'incorrect';
    let arrow = '';
    
    // Nombres de los atributos
    const attributeNames = {
        'number': '#',
        'league': 'Liga',
        'age': 'Edad',
        'titles': 'Tít.',
        'nationality': 'Nac.',
        'team': 'Equipo',
        'teams': 'Eq.',
        'champions': 'UCL',
        'worldCup': 'WC',
        'position': 'Pos.'
    };
    
    if (typeof guessValue === 'number' && typeof targetValue === 'number') {
        const diff = Math.abs(guessValue - targetValue);
        
        if (guessValue === targetValue) {
            statusClass = 'correct';
        } else if (diff <= 2) {
            statusClass = 'partial';
            arrow = guessValue < targetValue ? ' ↑' : ' ↓';
        } else {
            arrow = guessValue < targetValue ? ' ↑↑' : ' ↓↓';
        }
    } else {
        if (guessValue === targetValue) {
            statusClass = 'correct';
        } else if (type === 'position') {
            // Lógica especial para posiciones: marcar como parcial si es la misma categoría
            const guessPos = getPositionAbbr(guessValue);
            const targetPos = getPositionAbbr(targetValue);
            
            // Grupos de posiciones similares
            const positionGroups = {
                'GK': ['GK'],
                'D': ['D', 'SW', 'CB', 'RCB', 'LCB', 'RB', 'LB', 'WB', 'RWB', 'LWB'],
                'M': ['M', 'DM', 'CDM', 'CM', 'RM', 'LM', 'AM', 'CAM', 'AMC', 'AMR', 'AML'],
                'ST': ['RW', 'LW', 'SS', 'CF', 'ST', 'RF', 'LF']
            };
            
            // Verificar si están en el mismo grupo
            for (let group in positionGroups) {
                if (positionGroups[group].includes(guessPos) && positionGroups[group].includes(targetPos)) {
                    statusClass = 'partial';
                    break;
                }
            }
        }
    }
    
    div.classList.add(statusClass);
    div.innerHTML = `
        <div class="attribute-label">${attributeNames[type] || type}</div>
        <div class="attribute-icon">${icon}</div>
        <div class="attribute-value">${getPositionAbbr(guessValue)}${arrow}</div>
    `;
    
    return div;
}

function showWordleHint() {
    if (wordleGameOver) return;
    
    const hints = [
        `Liga: ${wordleTargetPlayer.league}`,
        `Equipo: ${wordleTargetPlayer.team}`,
        `Nacionalidad: ${wordleTargetPlayer.nationality}`,
        `Dorsal: ${wordleTargetPlayer.number}`,
        `Edad aproximada: ${Math.floor(wordleTargetPlayer.age / 5) * 5} años`
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    alert(`💡 Pista: ${randomHint}`);
}

function refreshWordlePlayer() {
    if (wordleGameOver) {
        alert('El juego ha terminado. Inicia una nueva partida para cambiar de jugador.');
        return;
    }
    
    if (wordleAttempts.length > 0) {
        const confirmRefresh = confirm('¿Estás seguro? Esto reiniciará el juego con un nuevo jugador.');
        if (!confirmRefresh) return;
    }
    
    initWordleFootball(wordleGameMode);
}

function setWordleMode(mode) {
    wordleGameMode = mode;
    
    // Actualizar botones
    const actualBtn = document.getElementById('wordle-mode-actual');
    const classicBtn = document.getElementById('wordle-mode-classic');
    const laligaBtn = document.getElementById('wordle-mode-laliga');
    const modeDisplay = document.getElementById('wordle-mode-display');
    
    if (actualBtn && classicBtn && laligaBtn && modeDisplay) {
        actualBtn.classList.remove('active');
        classicBtn.classList.remove('active');
        laligaBtn.classList.remove('active');
        
        if (mode === 'actual') {
            actualBtn.classList.add('active');
            modeDisplay.textContent = 'Actual';
        } else if (mode === 'laliga') {
            laligaBtn.classList.add('active');
            modeDisplay.textContent = 'Liga Española';
        } else {
            classicBtn.classList.add('active');
            modeDisplay.textContent = 'Clásico';
        }
    }
    
    initWordleFootball(mode);
}
