const board = document.getElementById("board");
const winnerText = document.getElementById("winner");
const playerInputDiv = document.querySelector(".player-input");
const startButton = document.getElementById("start-game");
const resetButton = document.getElementById("reset");
const difficultySelect = document.getElementById("difficulty");
const playerNameInput = document.getElementById("player-name");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");

let cells = ["", "", "", "", "", "", "", "", ""];
let player = "";
let computer = "";
let currentPlayer = "";
let gameActive = false;
let playerName = "Player";
let playerScore = 0;
let computerScore = 0;
let timer;
let timeLeft = 30;

const moveSound = new Audio("ting.mp3");
const aiMoveSound = new Audio("tang.mp3");

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

function startGame() {
    playerName = playerNameInput.value || "Player";
    player = "X";  // Player always starts as X
    computer = "O";
    currentPlayer = player;
    gameActive = true;
    playerInputDiv.style.display = "none";
    startTimer();
    createBoard();
}

function startTimer() {
    timeLeft = 30;
    timerText.textContent = `Time Left: ${timeLeft}s`;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameActive = false;
            winnerText.textContent = "Time's Up! Computer Wins!";
            computerScore++;
            updateScore();
        }
    }, 1000);
}

function createBoard() {
    board.innerHTML = "";
    cells.forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.index = index;
        cellDiv.textContent = cell;
        cellDiv.addEventListener("click", handleMove);
        board.appendChild(cellDiv);
    });
    if (currentPlayer === computer) {
        setTimeout(computerMove, 500);
    }
}

function handleMove(event) {
    const index = event.target.dataset.index;
    if (cells[index] === "" && gameActive && currentPlayer === player) {
        cells[index] = player;
        event.target.textContent = player;
        moveSound.play();
        checkWinner();
        currentPlayer = computer;
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    if (!gameActive) return;
    let availableCells = cells.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    let move;
    let difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    } else if (difficulty === "medium") {
        move = bestMove();
    } else {
        move = bestMove(true);
    }

    cells[move] = computer;
    document.querySelector(`[data-index='${move}']`).textContent = computer;
    aiMoveSound.play();
    checkWinner();
    currentPlayer = player;
}

function bestMove(advanced = false) {
    for (let combo of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
        let [a, b, c] = combo;
        let values = [cells[a], cells[b], cells[c]];
        if (values.filter(v => v === computer).length === 2 && values.includes("")) {
            return combo[values.indexOf("")];
        }
    }
    return cells.findIndex(cell => cell === "");
}

function checkWinner() {
    for (let combo of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
        let [a, b, c] = combo;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            winnerText.textContent = `${cells[a]} Wins!`;
            clearInterval(timer);
            gameActive = false;
            if (cells[a] === player) playerScore++;
            else computerScore++;
            updateScore();
            return;
        }
    }
}

function updateScore() {
    scoreText.textContent = `${playerName}: ${playerScore} | Computer: ${computerScore}`;
}

function resetGame() {
    cells = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    winnerText.textContent = "";
    createBoard();
    startTimer();
}
