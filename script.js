let currentDifficulty = 'easy';
let score = 0;
let combo = 0;
let correctCount = 0;
let wrongCount = 0;
let timeLeft = 30;
let timerInterval;
let currentAnswer;

const difficultySettings = {
    easy: {
        range: { min: 1, max: 20 },
        time: 30,
        operations: ['+', '-', '*']
    },
    medium: {
        range: { min: 10, max: 50 },
        time: 45,
        operations: ['+', '-', '*', '/', '%']
    },
    hard: {
        range: { min: 20, max: 100 },
        time: 60,
        operations: ['+', '-', '*', '/', '%']
    }
};

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const diffButtons = document.querySelectorAll('.diff-btn');
const difficultyBadge = document.getElementById('difficulty-badge');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const timerEl = document.getElementById('timer');
const finalScoreEl = document.getElementById('final-score');
const correctCountEl = document.getElementById('correct-count');
const wrongCountEl = document.getElementById('wrong-count');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart');

diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentDifficulty = btn.dataset.difficulty;
        startGame();
    });
});

restartBtn.addEventListener('click', () => {
    showScreen(startScreen);
    resetGame();
});

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '1' && key <= '4' && gameScreen.classList.contains('active')) {
        const buttons = document.querySelectorAll('.option-btn');
        const index = parseInt(key) - 1;
        if (buttons[index]) {
            buttons[index].click();
        }
    }
});

function startGame() {
    resetGame();
    showScreen(gameScreen);
    timeLeft = difficultySettings[currentDifficulty].time;
    timerEl.textContent = timeLeft;

    difficultyBadge.textContent = currentDifficulty;
    difficultyBadge.style.background = currentDifficulty === 'easy' ?
        'linear-gradient(135deg, #11998e, #38ef7d)' :
        currentDifficulty === 'medium' ?
        'linear-gradient(135deg, #f093fb, #f5576c)' :
        'linear-gradient(135deg, #fa709a, #fee140)';
    difficultyBadge.style.color = currentDifficulty === 'hard' ? '#333' : 'white';

    startTimer();
    generateQuestion();
}

function resetGame() {
    score = 0;
    combo = 0;
    correctCount = 0;
    wrongCount = 0;
    scoreEl.textContent = score;
    comboEl.textContent = combo;
    clearInterval(timerInterval);
    timerEl.parentElement.style.background = 'rgba(255, 255, 255, 0.2)';
    timerEl.parentElement.style.animation = 'none';
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 10) {
            timerEl.parentElement.style.background = 'linear-gradient(135deg, #eb3349, #f45c43)';
            timerEl.parentElement.style.animation = 'timerPulse 0.5s ease-in-out infinite';
        }

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function generateQuestion() {
    const settings = difficultySettings[currentDifficulty];
    const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)];

    let num1, num2, answer;

    switch(operation) {
        case '+':
            num1 = randomInt(settings.range.min, settings.range.max);
            num2 = randomInt(settings.range.min, settings.range.max);
            answer = num1 + num2;
            questionEl.textContent = `${num1} + ${num2}`;
            break;

        case '-':
            num1 = randomInt(settings.range.min, settings.range.max);
            num2 = randomInt(settings.range.min, num1);
            answer = num1 - num2;
            questionEl.textContent = `${num1} - ${num2}`;
            break;

        case '*':
            num1 = randomInt(settings.range.min, currentDifficulty === 'easy' ? 10 : 15);
            num2 = randomInt(settings.range.min, currentDifficulty === 'easy' ? 10 : 15);
            answer = num1 * num2;
            questionEl.textContent = `${num1} × ${num2}`;
            break;

        case '/':
            num2 = randomInt(2, currentDifficulty === 'medium' ? 10 : 15);
            answer = randomInt(2, currentDifficulty === 'medium' ? 10 : 20);
            num1 = num2 * answer;
            questionEl.textContent = `${num1} ÷ ${num2}`;
            break;

        case '%':
            num1 = randomInt(settings.range.min, settings.range.max);
            num2 = randomInt(2, currentDifficulty === 'medium' ? 10 : 15);
            answer = num1 % num2;
            questionEl.textContent = `${num1} % ${num2}`;
            break;
    }

    currentAnswer = answer;
    generateOptions(answer);
}

function generateOptions(correctAnswer) {
    const options = [correctAnswer];
    const range = currentDifficulty === 'easy' ? 10 : currentDifficulty === 'medium' ? 20 : 30;

    while (options.length < 4) {
        const offset = randomInt(-range, range);
        const wrongAnswer = correctAnswer + offset;

        if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && wrongAnswer >= 0) {
            options.push(wrongAnswer);
        }
    }

    shuffleArray(options);

    optionsEl.innerHTML = '';
    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-number">${index + 1}</span>${option}`;
        btn.addEventListener('click', () => checkAnswer(option, btn));
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selectedAnswer, btn) {
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach(b => b.style.pointerEvents = 'none');

    if (selectedAnswer === currentAnswer) {
        btn.classList.add('correct');
        combo++;
        correctCount++;
        score += combo;
        scoreEl.textContent = score;
        comboEl.textContent = combo;

        setTimeout(() => {
            allButtons.forEach(b => b.style.pointerEvents = 'auto');
            generateQuestion();
        }, 500);
    } else {
        btn.classList.add('wrong');
        combo = 0;
        wrongCount++;
        comboEl.textContent = combo;

        allButtons.forEach(b => {
            if (parseInt(b.textContent) === currentAnswer) {
                b.classList.add('correct');
            }
        });

        setTimeout(() => {
            allButtons.forEach(b => b.style.pointerEvents = 'auto');
            generateQuestion();
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    finalScoreEl.textContent = score;
    correctCountEl.textContent = correctCount;
    wrongCountEl.textContent = wrongCount;

    const totalQuestions = correctCount + wrongCount;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    accuracyEl.textContent = accuracy + '%';

    showScreen(resultScreen);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
