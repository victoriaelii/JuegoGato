
document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("game-board");
    const playerNameElement = document.getElementById("player-name");
    const playerTimeElement = document.getElementById("player-time");
    const leaderboardList = document.getElementById("leaderboard-list");
    const timeCounter = document.getElementById("time-counter");

    let currentPlayer = "X";
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let playerCanMove = true; 

    let playerStartTime;
    let playerEndTime;
    let currentPlayerName;
    let timerInterval;

    renderBoard();

    function renderBoard() {
        board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("button");
            cell.innerText = gameBoard[i];
            cell.addEventListener("click", () => handleMove(i));
            cell.disabled = gameBoard[i] !== ""; 
            board.appendChild(cell);
        }
    }

    function handleMove(index) {
        if (!playerStartTime) { 
            startTimer();
        }
        if (playerCanMove && gameBoard[index] === "") { 
            gameBoard[index] = currentPlayer;
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            renderBoard();
            const winner = checkWinner();
            if (!winner && currentPlayer === "O") {
                playerCanMove = false; 
                setTimeout(() => computerMove(), 500);
            } else if (winner === "X") {
                playerEndTime = Date.now();
                const gameTime = ((playerEndTime - playerStartTime) / 1000).toFixed(2);
                const playerName = prompt("¡Felicidades, has ganado! Ingresa tu nickname:");
                currentPlayerName = playerName || "Anónimo";
                playerNameElement.textContent = currentPlayerName;
                playerTimeElement.textContent = `Segundos en partida: ${gameTime}`;
                updateLeaderboard(playerName, gameTime);
                resetGame();
            } else if (winner === "O") {
                alert("¡Has perdido;(! Inténtalo de nuevo.");
                resetGame();
            } else if (gameBoard.every(cell => cell !== "")) {
                alert("¡Es un empate!");
                resetGame();
            }
        }
    }

    function computerMove() {
        const availableMoves = gameBoard.reduce((acc, val, index) => (val === "" ? acc.concat(index) : acc), []);
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const selectedMove = availableMoves[randomIndex];
        gameBoard[selectedMove] = currentPlayer;
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        renderBoard();
        const winner = checkWinner();
        if (winner === "O") {
            alert("¡Has perdido;(! Inténtalo de nuevo.");
            resetGame();
        } else if (gameBoard.every(cell => cell !== "")) {
            alert("¡Es un empate!");
            resetGame();
        }
        playerCanMove = true; 
    }

    function startTimer() {
        playerStartTime = Date.now();
        timerInterval = setInterval(updateTime, 1000);
    }

    function updateTime() {
        const currentTime = (Date.now() - playerStartTime) / 1000; 
        const seconds = Math.floor(currentTime); 
        const milliseconds = Math.floor((currentTime - seconds) * 100);
        timeCounter.textContent = `Segundos en partida: ${seconds}.${milliseconds}`;
    }



    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6] 
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a];
            }
        }
        return null;
    }


    function updateLeaderboard(playerName, gameTime) {
        const leaderboardEntry = {
            name: playerName,
            time: parseFloat(gameTime)
        };

        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.push(leaderboardEntry);
        leaderboard.sort((a, b) => a.time - b.time);
        leaderboard = leaderboard.slice(0, 10);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        renderLeaderboard(leaderboard);
    }

    function renderLeaderboard(leaderboard) {
        leaderboardList.innerHTML = "";
        leaderboard.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${entry.name} - ${entry.time} seconds`;
            leaderboardList.appendChild(listItem);
        });
    }

    function loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        renderLeaderboard(leaderboard);
    }

    function resetGame() {
        currentPlayer = "X";
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        playerNameElement.textContent = "";
        playerTimeElement.textContent = "";
        clearInterval(timerInterval); 
        playerStartTime = null; 
        timeCounter.textContent = "Segundos en partida: 0"; 
        renderBoard();
    }

    loadLeaderboard();
});