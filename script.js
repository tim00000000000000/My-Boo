();const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameState = 'START'; 
let score = 0;
const WIN_SCORE = 15; 
let player, hearts = [], animationId;

const screens = {
    start: document.getElementById('start-screen'),
    bridge: document.getElementById('bridge-screen'),
    proposal: document.getElementById('proposal-screen'),
    final: document.getElementById('celebration-screen')
};

const loveMeter = document.getElementById('love-fill');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);

class Player {
    constructor() {
        this.w = 100;
        this.x = canvas.width / 2 - this.w / 2;
        this.y = canvas.height - 100;
    }
    draw() {
        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(this.x + this.w/2, this.y, this.w/2, 0, Math.PI, false);
        ctx.fill();
    }
}

class Heart {
    constructor() {
        this.size = Math.random() * 20 + 20;
        this.x = Math.random() * (canvas.width - this.size);
        this.y = -this.size;
        this.speed = Math.random() * 3 + 2;
    }
    draw() {
        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size/2, 0, Math.PI*2);
        ctx.fill();
    }
    update() { this.y += this.speed; }
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameState === 'PLAYING') {
        player.draw();
        if (Math.random() < 0.02) hearts.push(new Heart());
        hearts.forEach((h, i) => {
            h.update(); h.draw();
            if (h.y > player.y && h.x > player.x && h.x < player.x + player.w) {
                hearts.splice(i, 1);
                score++;
                loveMeter.style.width = `${(score/WIN_SCORE)*100}%`;
                if (score >= WIN_SCORE) {
                    gameState = 'BRIDGE';
                    showScreen('bridge');
                }
            }
        });
    }
    animationId = requestAnimationFrame(updateGame);
}

function showScreen(key) {
    Object.values(screens).forEach(s => s.classList.replace('active', 'hidden'));
    screens[key].classList.replace('hidden', 'active');
}

function moveButton(e) {
    const btn = e.target;
    const x = Math.random() * (window.innerWidth - btn.offsetWidth);
    const y = Math.random() * (window.innerHeight - btn.offsetHeight);
    btn.style.position = 'fixed';
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
}

window.addEventListener('mousemove', (e) => { if(player) player.x = e.clientX - player.w/2; });
window.addEventListener('touchmove', (e) => { if(player) player.x = e.touches[0].clientX - player.w/2; });

document.getElementById('start-btn').onclick = () => {
    player = new Player();
    gameState = 'PLAYING';
    screens.start.classList.replace('active', 'hidden');
    resize();
    updateGame();
};

document.getElementById('bridge-yes-btn').onclick = () => showScreen('proposal');
document.getElementById('yes-btn').onclick = () => showScreen('final');

[document.getElementById('bridge-no-btn'), document.getElementById('no-btn')].forEach(btn => {
    btn.onmouseover = moveButton;
    btn.ontouchstart = moveButton;
});

resize();