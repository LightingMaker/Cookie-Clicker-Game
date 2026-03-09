let score = 0;
const scoreDisplay = document.getElementById('score');
const cookieBtn = document.getElementById('cookie-btn');

// Upgrade variables
let autoClickerCount = 0;
let autoClickerCost = 50;
let multiplier = 1;
let multiplierCost = 100;

const autoCostDisplay = document.getElementById('auto-cost');
const multCostDisplay = document.getElementById('mult-cost');
const buyAutoBtn = document.getElementById('buy-auto');
const buyMultBtn = document.getElementById('buy-mult');
const cpsDisplay = document.getElementById('cps');
const achList = document.getElementById('ach-list');

// Achievements
const achievements = [
    { id: 'firstClick', name: 'First Cookie', condition: () => score >= 1 },
    { id: 'tenCookies', name: '10 Cookies', condition: () => score >= 10 },
    { id: 'hundredCookies', name: '100 Cookies', condition: () => score >= 100 },
    { id: 'autoBuyer', name: 'Bought Auto-Clicker', condition: () => autoClickerCount > 0 },
    { id: 'multBuyer', name: 'Bought Multiplier', condition: () => multiplier > 1 },
];
let unlockedAchievements = [];

function updateAchievements() {
    achievements.forEach(ach => {
        if (!unlockedAchievements.includes(ach.id) && ach.condition()) {
            unlockedAchievements.push(ach.id);
            const li = document.createElement('li');
            li.textContent = ach.name;
            achList.appendChild(li);
        }
    });
}

// Animation
const cookieImg = document.querySelector('.cookie-img');
function animateCookie() {
    cookieImg.classList.add('pop');
    setTimeout(() => cookieImg.classList.remove('pop'), 150);
}

// CPS calculation
let lastScore = score;
setInterval(() => {
    const cps = autoClickerCount * multiplier;
    cpsDisplay.textContent = `Cookies per second: ${cps}`;
    updateAchievements();
    lastScore = score;
}, 1000);

// Load saved game
function loadGame() {
    const saved = localStorage.getItem('cookieClickerSave');
    if (saved) {
        const data = JSON.parse(saved);
        score = data.score || 0;
        autoClickerCount = data.autoClickerCount || 0;
        autoClickerCost = data.autoClickerCost || 50;
        multiplier = data.multiplier || 1;
        multiplierCost = data.multiplierCost || 100;
        autoCostDisplay.textContent = autoClickerCost;
        multCostDisplay.textContent = multiplierCost;
        scoreDisplay.textContent = `Cookies: ${score}`;
    }
}

function saveGame() {
    const data = {
        score,
        autoClickerCount,
        autoClickerCost,
        multiplier,
        multiplierCost
    };
    localStorage.setItem('cookieClickerSave', JSON.stringify(data));
}

window.addEventListener('load', loadGame);
setInterval(saveGame, 5000); // Save every 5 seconds

cookieBtn.addEventListener('click', () => {
    score += multiplier;
    scoreDisplay.textContent = `Cookies: ${score}`;
        saveGame();
    animateCookie();
    updateAchievements();
});

buyAutoBtn.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickerCount++;
        autoClickerCost = Math.floor(autoClickerCost * 1.5);
        autoCostDisplay.textContent = autoClickerCost;
        scoreDisplay.textContent = `Cookies: ${score}`;
            saveGame();
    }
});

buyMultBtn.addEventListener('click', () => {
    if (score >= multiplierCost) {
        score -= multiplierCost;
        multiplier++;
        multiplierCost = Math.floor(multiplierCost * 2);
        multCostDisplay.textContent = multiplierCost;
        scoreDisplay.textContent = `Cookies: ${score}`;
            saveGame();
    }
});

// Auto-clicker interval
setInterval(() => {
    if (autoClickerCount > 0) {
        score += autoClickerCount * multiplier;
        scoreDisplay.textContent = `Cookies: ${score}`;
            saveGame();
    }
}, 1000);
