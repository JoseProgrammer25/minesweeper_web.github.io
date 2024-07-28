document.getElementById('juego').style.display = 'none'

document.addEventListener('DOMContentLoaded', () => {
    function createGameBoardFacil() {
        const grid = document.querySelector('#game-container');
        const toggleFlagModeButton = document.querySelector('#toggleFlagMode');
        const width = 10; // Ancho del tablero
        const numMines = 10; // Número de minas
        let cells = [];
        let isGameOver = false;
        let flags = 0;
        let isFlagMode = false; // Modo de marcar minas

        function createBoard() {
            // Limpiar el tablero
            grid.innerHTML = '';

            // Generar las minas aleatoriamente
            const minesArray = Array(numMines).fill('mine');
            const emptyArray = Array(width * width - numMines).fill('empty');
            const gameArray = emptyArray.concat(minesArray);
            const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
            document.getElementById('botonReset').style.display = 'none';

            // Crear las celdas
            cells = [];
            for (let i = 0; i < width * width; i++) {
                const cell = document.createElement('div');
                cell.setAttribute('id', i);
                cell.classList.add('cell');
                grid.appendChild(cell);
                cells.push(cell);

                // Añadir contenido basado en el array barajado
                cell.classList.add(shuffledArray[i]);

                // Evento de clic para marcar/bandera o revelar
                cell.addEventListener('click', function(e) {
                    if (isFlagMode) {
                        addFlag(cell);
                    } else {
                        click(cell);
                    }
                });

                // Evento de clic derecho para marcar/bandera
                cell.oncontextmenu = function(e) {
                    e.preventDefault();
                    addFlag(cell);
                };
            }

            // Añadir números a las celdas vacías
            for (let i = 0; i < cells.length; i++) {
                let total = 0;
                const isLeftEdge = (i % width === 0);
                const isRightEdge = (i % width === width - 1);

                if (cells[i].classList.contains('empty')) {
                    if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('mine')) total++;
                    if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('mine')) total++;
                    if (i > 10 && cells[i - width].classList.contains('mine')) total++;
                    if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('mine')) total++;
                    if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('mine')) total++;
                    if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('mine')) total++;
                    if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('mine')) total++;
                    if (i < 89 && cells[i + width].classList.contains('mine')) total++;
                    cells[i].setAttribute('data', total);
                }
            }
        }

        function addFlag(cell) {
            if (isGameOver) return;
            if (!cell.classList.contains('revealed') && flags < numMines) {
                if (!cell.classList.contains('flag')) {
                    cell.classList.add('flag');
                    cell.innerHTML = '🚩';
                    flags++;
                } else {
                    cell.classList.remove('flag');
                    cell.innerHTML = '';
                    flags--;
                }
            }
            checkForWin();
        }

        function click(cell) {
            let currentId = cell.id;
            if (isGameOver) return;
            if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

            if (cell.classList.contains('mine')) {
                gameOver(cell);
            } else {
                let total = cell.getAttribute('data');
                if (total != 0) {
                    cell.classList.add('revealed');
                    cell.innerHTML = total;
                    return;
                }
                revealCell(cell, currentId);
            }
            cell.classList.add('revealed');
        }

        function revealCell(cell, currentId) {
            const isLeftEdge = (currentId % width === 0);
            const isRightEdge = (currentId % width === width - 1);

            setTimeout(() => {
                if (currentId > 0 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 9 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1 - width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 10) {
                    const newId = cells[parseInt(currentId - width)].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 11 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1 - width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 98 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 90 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1 + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 88 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1 + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 89) {
                    const newId = cells[parseInt(currentId) + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
            }, 10);
        }

        function gameOver(cell) {
            isGameOver = true;
            cells.forEach(cell => {
                if (cell.classList.contains('mine')) {
                    cell.innerHTML = '💣';
                    cell.classList.add('revealed');
                }
            });
            document.getElementById('botonReset').style.display = 'block';
            botonReset.addEventListener('click', () => {
                location.reload();
            })
            alert('Game Over! 😢');
        }

        function checkForWin() {
            let matches = 0;
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classList.contains('flag') && cells[i].classList.contains('mine')) {
                    matches++;
                }
                if (matches === numMines) {
                    isGameOver = true;
                    alert('Congratulations! You Win! 🎉');
                    document.getElementById('botonReset').style.display = 'none';
                    break;
                }
            }
        }

        toggleFlagModeButton.addEventListener('click', () => {
            isFlagMode = !isFlagMode;
            toggleFlagModeButton.textContent = isFlagMode ? 'Modo Revelar' : 'Modo Marcar Minas';
        });
        function adjustGameBoardSize() {
            const body = document.body;
            if (window.innerWidth <= 600) {
                body.classList.add('small-screen');
            } else {
                body.classList.remove('small-screen');
            }
        }

        // Ajustar el tamaño del tablero al cargar la página
        adjustGameBoardSize();

        // Ajustar el tamaño del tablero al cambiar el tamaño de la ventana
        window.addEventListener('resize', adjustGameBoardSize);

        
        createBoard();
    }

    document.querySelector('#easy').addEventListener('click', () => {
        document.getElementById('juego').style.display = 'block';
        createGameBoardFacil();
        document.getElementById('antesJuego').style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    function createGameBoardMedio() {
        const grid = document.querySelector('#game-container');
        const toggleFlagModeButton = document.querySelector('#toggleFlagMode');
        const width = 10; // Ancho del tablero
        const numMines = 15; // Número de minas
        let cells = [];
        let isGameOver = false;
        let flags = 0;
        let isFlagMode = false; // Modo de marcar minas

        function createBoard() {
            // Limpiar el tablero
            grid.innerHTML = '';

            // Generar las minas aleatoriamente
            const minesArray = Array(numMines).fill('mine');
            const emptyArray = Array(width * width - numMines).fill('empty');
            const gameArray = emptyArray.concat(minesArray);
            const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
            document.getElementById('botonReset').style.display = 'none';

            // Crear las celdas
            cells = [];
            for (let i = 0; i < width * width; i++) {
                const cell = document.createElement('div');
                cell.setAttribute('id', i);
                cell.classList.add('cell');
                grid.appendChild(cell);
                cells.push(cell);

                // Añadir contenido basado en el array barajado
                cell.classList.add(shuffledArray[i]);

                // Evento de clic para marcar/bandera o revelar
                cell.addEventListener('click', function(e) {
                    if (isFlagMode) {
                        addFlag(cell);
                    } else {
                        click(cell);
                    }
                });

                // Evento de clic derecho para marcar/bandera
                cell.oncontextmenu = function(e) {
                    e.preventDefault();
                    addFlag(cell);
                };
            }

            // Añadir números a las celdas vacías
            for (let i = 0; i < cells.length; i++) {
                let total = 0;
                const isLeftEdge = (i % width === 0);
                const isRightEdge = (i % width === width - 1);

                if (cells[i].classList.contains('empty')) {
                    if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('mine')) total++;
                    if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('mine')) total++;
                    if (i > 10 && cells[i - width].classList.contains('mine')) total++;
                    if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('mine')) total++;
                    if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('mine')) total++;
                    if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('mine')) total++;
                    if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('mine')) total++;
                    if (i < 89 && cells[i + width].classList.contains('mine')) total++;
                    cells[i].setAttribute('data', total);
                }
            }
        }

        function addFlag(cell) {
            if (isGameOver) return;
            if (!cell.classList.contains('revealed') && flags < numMines) {
                if (!cell.classList.contains('flag')) {
                    cell.classList.add('flag');
                    cell.innerHTML = '🚩';
                    flags++;
                } else {
                    cell.classList.remove('flag');
                    cell.innerHTML = '';
                    flags--;
                }
            }
            checkForWin();
        }

        function click(cell) {
            let currentId = cell.id;
            if (isGameOver) return;
            if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

            if (cell.classList.contains('mine')) {
                gameOver(cell);
            } else {
                let total = cell.getAttribute('data');
                if (total != 0) {
                    cell.classList.add('revealed');
                    cell.innerHTML = total;
                    return;
                }
                revealCell(cell, currentId);
            }
            cell.classList.add('revealed');
        }

        function revealCell(cell, currentId) {
            const isLeftEdge = (currentId % width === 0);
            const isRightEdge = (currentId % width === width - 1);

            setTimeout(() => {
                if (currentId > 0 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 9 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1 - width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 10) {
                    const newId = cells[parseInt(currentId - width)].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 11 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1 - width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 98 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 90 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1 + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 88 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1 + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 89) {
                    const newId = cells[parseInt(currentId) + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
            }, 10);
        }

        function gameOver(cell) {
            isGameOver = true;
            cells.forEach(cell => {
                if (cell.classList.contains('mine')) {
                    cell.innerHTML = '💣';
                    cell.classList.add('revealed');
                }
            });
            document.getElementById('botonReset').style.display = 'block';
            botonReset.addEventListener('click', () => {
                location.reload();
            })
            alert('Game Over! 😢');
        }

        function checkForWin() {
            let matches = 0;
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classList.contains('flag') && cells[i].classList.contains('mine')) {
                    matches++;
                }
                if (matches === numMines) {
                    isGameOver = true;
                    alert('Congratulations! You Win! 🎉');
                    document.getElementById('botonReset').style.display = 'none';
                    break;
                }
            }
        }

        toggleFlagModeButton.addEventListener('click', () => {
            isFlagMode = !isFlagMode;
            toggleFlagModeButton.textContent = isFlagMode ? 'Modo Revelar' : 'Modo Marcar Minas';
        });
        function adjustGameBoardSize() {
            const body = document.body;
            if (window.innerWidth <= 600) {
                body.classList.add('small-screen');
            } else {
                body.classList.remove('small-screen');
            }
        }

        // Ajustar el tamaño del tablero al cargar la página
        adjustGameBoardSize();

        // Ajustar el tamaño del tablero al cambiar el tamaño de la ventana
        window.addEventListener('resize', adjustGameBoardSize);

        
        createBoard();
    }

    document.querySelector('#medium').addEventListener('click', () => {
        document.getElementById('juego').style.display = 'block';
        createGameBoardMedio();
        document.getElementById('antesJuego').style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    function createGameBoardDificil() {
        const grid = document.querySelector('#game-container');
        const toggleFlagModeButton = document.querySelector('#toggleFlagMode');
        const width = 10; // Ancho del tablero
        const numMines = 20; // Número de minas
        let cells = [];
        let isGameOver = false;
        let flags = 0;
        let isFlagMode = false; // Modo de marcar minas

        function createBoard() {
            // Limpiar el tablero
            grid.innerHTML = '';

            // Generar las minas aleatoriamente
            const minesArray = Array(numMines).fill('mine');
            const emptyArray = Array(width * width - numMines).fill('empty');
            const gameArray = emptyArray.concat(minesArray);
            const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
            document.getElementById('botonReset').style.display = 'none';

            // Crear las celdas
            cells = [];
            for (let i = 0; i < width * width; i++) {
                const cell = document.createElement('div');
                cell.setAttribute('id', i);
                cell.classList.add('cell');
                grid.appendChild(cell);
                cells.push(cell);

                // Añadir contenido basado en el array barajado
                cell.classList.add(shuffledArray[i]);

                // Evento de clic para marcar/bandera o revelar
                cell.addEventListener('click', function(e) {
                    if (isFlagMode) {
                        addFlag(cell);
                    } else {
                        click(cell);
                    }
                });

                // Evento de clic derecho para marcar/bandera
                cell.oncontextmenu = function(e) {
                    e.preventDefault();
                    addFlag(cell);
                };
            }

            // Añadir números a las celdas vacías
            for (let i = 0; i < cells.length; i++) {
                let total = 0;
                const isLeftEdge = (i % width === 0);
                const isRightEdge = (i % width === width - 1);

                if (cells[i].classList.contains('empty')) {
                    if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('mine')) total++;
                    if (i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('mine')) total++;
                    if (i > 10 && cells[i - width].classList.contains('mine')) total++;
                    if (i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('mine')) total++;
                    if (i < 98 && !isRightEdge && cells[i + 1].classList.contains('mine')) total++;
                    if (i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('mine')) total++;
                    if (i < 88 && !isRightEdge && cells[i + 1 + width].classList.contains('mine')) total++;
                    if (i < 89 && cells[i + width].classList.contains('mine')) total++;
                    cells[i].setAttribute('data', total);
                }
            }
        }

        function addFlag(cell) {
            if (isGameOver) return;
            if (!cell.classList.contains('revealed') && flags < numMines) {
                if (!cell.classList.contains('flag')) {
                    cell.classList.add('flag');
                    cell.innerHTML = '🚩';
                    flags++;
                } else {
                    cell.classList.remove('flag');
                    cell.innerHTML = '';
                    flags--;
                }
            }
            checkForWin();
        }

        function click(cell) {
            let currentId = cell.id;
            if (isGameOver) return;
            if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

            if (cell.classList.contains('mine')) {
                gameOver(cell);
            } else {
                let total = cell.getAttribute('data');
                if (total != 0) {
                    cell.classList.add('revealed');
                    cell.innerHTML = total;
                    return;
                }
                revealCell(cell, currentId);
            }
            cell.classList.add('revealed');
        }

        function revealCell(cell, currentId) {
            const isLeftEdge = (currentId % width === 0);
            const isRightEdge = (currentId % width === width - 1);

            setTimeout(() => {
                if (currentId > 0 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 9 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1 - width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 10) {
                    const newId = cells[parseInt(currentId - width)].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId > 11 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1 - width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 98 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 90 && !isLeftEdge) {
                    const newId = cells[parseInt(currentId) - 1 + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 88 && !isRightEdge) {
                    const newId = cells[parseInt(currentId) + 1 + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
                if (currentId < 89) {
                    const newId = cells[parseInt(currentId) + width].id;
                    const newCell = document.getElementById(newId);
                    click(newCell);
                }
            }, 10);
        }

        function gameOver(cell) {
            isGameOver = true;
            cells.forEach(cell => {
                if (cell.classList.contains('mine')) {
                    cell.innerHTML = '💣';
                    cell.classList.add('revealed');
                }
            });
            document.getElementById('botonReset').style.display = 'block';
            botonReset.addEventListener('click', () => {
                location.reload();
            })
            alert('Game Over! 😢');
        }

        function checkForWin() {
            let matches = 0;
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classList.contains('flag') && cells[i].classList.contains('mine')) {
                    matches++;
                }
                if (matches === numMines) {
                    isGameOver = true;
                    alert('Congratulations! You Win! 🎉');
                    document.getElementById('botonReset').style.display = 'none';
                    break;
                }
            }
        }

        toggleFlagModeButton.addEventListener('click', () => {
            isFlagMode = !isFlagMode;
            toggleFlagModeButton.textContent = isFlagMode ? 'Modo Revelar' : 'Modo Marcar Minas';
        });
        function adjustGameBoardSize() {
            const body = document.body;
            if (window.innerWidth <= 600) {
                body.classList.add('small-screen');
            } else {
                body.classList.remove('small-screen');
            }
        }

        // Ajustar el tamaño del tablero al cargar la página
        adjustGameBoardSize();

        // Ajustar el tamaño del tablero al cambiar el tamaño de la ventana
        window.addEventListener('resize', adjustGameBoardSize);

        
        createBoard();
    }

    document.querySelector('#hard').addEventListener('click', () => {
        document.getElementById('juego').style.display = 'block';
        createGameBoardDificil();
        document.getElementById('antesJuego').style.display = 'none';
    });
});
