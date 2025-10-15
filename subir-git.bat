@echo off
echo ========================================
echo   SUBIENDO CAMBIOS A GIT
echo ========================================
echo.

echo [1/4] Verificando estado del repositorio...
git status
echo.

echo [2/4] Agregando todos los archivos modificados...
git add .
echo.

echo [3/4] Creando commit con los cambios...
git commit -m "feat: Nueva interfaz premium GameVerse + mejoras visuales en Snake, Damas y Sudoku

- Interfaz glassmorphism con gradientes vibrantes y animaciones 3D
- Background animado con orbes flotantes y particulas
- Tipografia premium Orbitron + Rajdhani
- Badges de categoria en tarjetas de juegos
- Snake: bordes redondeados, efectos 3D mejorados
- Damas: fichas realistas con gradientes multicapa, tablero con textura
- Sudoku: mejor separacion visual con bloques 3x3 destacados
- CSS completamente renovado con efectos glassmorphism
- Animaciones suaves y responsive optimizado"
echo.

echo [4/4] Subiendo cambios al repositorio remoto...
git push
echo.

echo ========================================
echo   CAMBIOS SUBIDOS EXITOSAMENTE!
echo ========================================
echo.
pause
