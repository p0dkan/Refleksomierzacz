const clickArea = document.getElementById('clickArea');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const shortest = document.getElementById('shortest');
const longest = document.getElementById('longest');
const average = document.getElementById('average');
const bestScoreDisplay = document.getElementById('bestScore');
const attemptsInput = document.getElementById('attemptsInput');
const statsPanel = document.getElementById('stats');
const modeToggle = document.getElementById('modeToggle');
const falseClicksDisplay = document.getElementById('falseClicks');

let reactionTimes = [];
let falseClicks = 0;
let bestScore = null;
let isWaitingForClick = false;
let startTime = null;
let timeoutId = null;
let roundCount = 0;
let totalRounds = 5;
let useKeyboard = false;

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
modeToggle.addEventListener('change', (e) => {
    useKeyboard = e.target.checked;
});

function startGame() {
    const inputVal = parseInt(attemptsInput.value);
    totalRounds = isNaN(inputVal) || inputVal <= 0 ? 5 : inputVal;

    reactionTimes = [];
    falseClicks = 0;
    roundCount = 0;
    updateStats();
    statsPanel.style.display = "none";

    startButton.disabled = true;
    stopButton.disabled = false;
    clickArea.style.backgroundColor = 'grey';

    if (useKeyboard) {
        document.addEventListener('keydown', handleKeyboardPress);
    }

    nextRound();
}

function stopGame() {
    clearTimeout(timeoutId);
    isWaitingForClick = false;
    clickArea.style.backgroundColor = 'grey';
    startButton.disabled = false;
    stopButton.disabled = true;
    document.removeEventListener('keydown', handleKeyboardPress);
}

function nextRound() {
    if (roundCount >= totalRounds) {
        stopGame();
        statsPanel.style.display = "block";
        return;
    }

    clickArea.style.backgroundColor = 'red';
    isWaitingForClick = false;

    const delay = Math.floor(Math.random() * 2000) + 1000; // 1–3 sekundy

    timeoutId = setTimeout(() => {
        clickArea.style.backgroundColor = 'green';
        isWaitingForClick = true;
        startTime = Date.now();
    }, delay);
}

function handleSuccessReaction() {
    const reactionTime = Date.now() - startTime;
    reactionTimes.push(reactionTime);
    roundCount++;

    statsPanel.style.display = "block";
    updateStats();

    isWaitingForClick = false;
    nextRound();
}

clickArea.addEventListener('click', () => {
    if (!startButton.disabled) return; // gra nie rozpoczęta

    if (isWaitingForClick) {
        handleSuccessReaction();
    } else {
        falseClicks++;
        falseClicksDisplay.textContent = `Błędne kliknięcia: ${falseClicks}`;
    }
});

function handleKeyboardPress(e) {
    if (e.code === "Space") {
        e.preventDefault();
        if (isWaitingForClick) {
            handleSuccessReaction();
        } else {
            falseClicks++;
            falseClicksDisplay.textContent = `Błędne naciśnięcia: ${falseClicks}`;
        }
    }
}

function updateStats() {
    if (reactionTimes.length === 0) {
        shortest.textContent = 'Najkrótszy czas: -';
        longest.textContent = 'Najdłuższy czas: -';
        average.textContent = 'Średni czas: -';
        bestScoreDisplay.textContent = `Najlepszy wynik: ${bestScore ?? '-'}`;
        falseClicksDisplay.textContent = 'Błędne kliknięcia: 0';
        return;
    }

    const min = Math.min(...reactionTimes);
    const max = Math.max(...reactionTimes);
    const avg = (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2);

    if (bestScore === null || min < bestScore) {
        bestScore = min;
    }

    shortest.textContent = `Najkrótszy czas: ${min} ms`;
    longest.textContent = `Najdłuższy czas: ${max} ms`;
    average.textContent = `Średni czas: ${avg} ms`;
    bestScoreDisplay.textContent = `Najlepszy wynik: ${bestScore} ms`;
    falseClicksDisplay.textContent = `Błędne kliknięcia: ${falseClicks}`;
}