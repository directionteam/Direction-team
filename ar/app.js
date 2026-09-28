let video, handCanvas, ctx, gameCanvas, gctx;
let handDetector, camera;
let fingertip = null;
let playerName = '';
let startTime = 0;
let mistakes = 0;
let gameState = 'IDLE';
let systemImage = null;
let selectedPart = null;
let dragging = false;
let holdingPart = null;
let holdingStartTime = 0;

const HOLD_DURATION = 500;
const PART_SIZE = 120;

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];
const PART_EMOJI = {
    'panel': '☀️',
    'controller': '🎛️',
    'battery': '🔋',
    'inverter': '⚡',
    'load': '🏠'
};
const PART_LABELS = {
    'panel': 'Solar Panel',
    'controller': 'Controller',
    'battery': 'Battery',
    'inverter': 'Inverter',
    'load': 'House'
};


let parts = {};

// ===== أصوات =====
function playBeep(freq, duration) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);
        osc.stop(audioCtx.currentTime + duration / 1000);
    } catch (e) {}
}
function playCorrect() { playBeep(800, 150); }
function playWrong() { playBeep(300, 300); }
function playWin() {
    playBeep(600, 100);
    setTimeout(() => playBeep(800, 100), 150);
    setTimeout(() => playBeep(1000, 200), 300);
}

// ===== بدء اللعبة =====
async function startGame() {
    playerName = document.getElementById('playerName').value.trim() || 'Player';
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('hudPlayer').textContent = playerName;

    gameCanvas = document.getElementById('threeCanvas');
    handCanvas = document.getElementById('handCanvas');
    ctx = handCanvas.getContext('2d');
    gctx = gameCanvas.getContext('2d');
    video = document.getElementById('video');

    // تحميل الصورة (من الرابط المباشر)
    await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            systemImage = img;
            console.log('✅ تم تحميل الصورة: ' + img.width + 'x' + img.height);
            resolve();
        };
        img.onerror = () => {
            console.error('❌ فشل تحميل الصورة');
            resolve();
        };
        img.src = 'https://directionteam.github.io/Direction-team/system.png';
        setTimeout(resolve, 5000);
    });

    randomizePositions();
    await initMediaPipe();
    await initCamera();

    gameState = 'COUNTDOWN';
    startCountdown();
}

function randomizePositions() {
    const positions = [0.05, 0.24, 0.43, 0.62, 0.81];
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    PART_ORDER.forEach((name, i) => {
        parts[name] = {
            x: positions[i] * window.innerWidth,
            y: 0.10 * window.innerHeight,
            placed: false
        };
    });
}

// ===== MediaPipe =====
async function initMediaPipe() {
    handDetector = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    handDetector.setOptions({
        maxNumHands: 1, modelComplexity: 1,
        minDetectionConfidence: 0.6, minTrackingConfidence: 0.6
    });
    handDetector.onResults(onHandResults);
}

function onHandResults(results) {
    const W = window.innerWidth, H = window.innerHeight;
    handCanvas.width = W; handCanvas.height = H;
    gameCanvas.width = W; gameCanvas.height = H;
    ctx.clearRect(0, 0, W, H);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const tip = results.multiHandLandmarks[0][8];
        const x = (1 - tip.x) * W;
        const y = tip.y * H;
        fingertip = { x, y };

        ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (gameState === 'PLAYING') handleGameLogic();
    } else {
        fingertip = null;
        if (dragging && selectedPart) {
            dragging = false;
            selectedPart = null;
            holdingPart = null;
        }
    }
    drawGame(W, H);
}

// ===== المنطق =====
function handleGameLogic() {
    if (!fingertip) return;
    const W = window.innerWidth, H = window.innerHeight;
    const fx = fingertip.x, fy = fingertip.y;

    if (!dragging) {
        for (const name of PART_ORDER) {
            if (parts[name].placed) continue;
            const p = parts[name];
            if (Math.abs(fx - (p.x + PART_SIZE/2)) < 70 && Math.abs(fy - (p.y + PART_SIZE/2)) < 70) {
                selectedPart = name;
                dragging = true;
                break;
            }
        }
    }

    if (dragging && selectedPart) {
        parts[selectedPart].x = fx - PART_SIZE/2;
        parts[selectedPart].y = fy - PART_SIZE/2;

        const p = parts[selectedPart];
        const target = TARGETS[selectedPart];
        const tx = target.x * W;
        const ty = target.y * H;

        const inTarget = Math.abs(p.x - tx) < 120 && Math.abs(p.y - ty) < 120;

        if (inTarget) {
            if (holdingPart !== selectedPart) {
                holdingPart = selectedPart;
                holdingStartTime = Date.now();
            }
            const elapsed = Date.now() - holdingStartTime;
            const progress = Math.min(elapsed / HOLD_DURATION, 1);

            gctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
            gctx.fillRect(tx, ty - 30, PART_SIZE * progress, 12);
            gctx.strokeStyle = 'white';
            gctx.lineWidth = 2;
            gctx.strokeRect(tx, ty - 30, PART_SIZE, 12);

            if (elapsed >= HOLD_DURATION) {
                p.placed = true;
                p.x = tx;
                p.y = ty;
                playCorrect();
                dragging = false;
                selectedPart = null;
                holdingPart = null;
                checkWin();
            }
        } else {
            holdingPart = null;
        }
    }
}

// ===== رسم =====
function drawGame(W, H) {
    if (!gctx) return;
    gctx.clearRect(0, 0, W, H);

    // خلفية شفافة
    gctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    gctx.fillRect(0, 0, W, H);

    // المربعات المستهدفة
    PART_ORDER.forEach(name => {
        const target = TARGETS[name];
        const tx = target.x * W;
        const ty = target.y * H;
        const placed = parts[name].placed;

        gctx.strokeStyle = placed ? '#00ff00' : 'rgba(255, 255, 255, 0.7)';
        gctx.lineWidth = 4;
        gctx.strokeRect(tx, ty, PART_SIZE, PART_SIZE);

        gctx.fillStyle = placed ? '#00ff00' : '#ffffff';
        gctx.font = 'bold 36px Arial';
        gctx.textAlign = 'center';
        gctx.textBaseline = 'alphabetic';
        gctx.fillText(target.num, tx + PART_SIZE/2, ty + PART_SIZE + 45);
    });

    // القطع - رسم الصورة الكاملة ثم الاقتصاص
    PART_ORDER.forEach(name => {
        const p = parts[name];

        if (systemImage && systemImage.complete) {
            // اقتصاص الجزء المناسب من الصورة
            let sx = 0, sy = 0, sw = systemImage.width, sh = systemImage.height;

            if (name === 'panel') {
                sx = systemImage.width * 0.02;
                sy = systemImage.height * 0.02;
                sw = systemImage.width * 0.38;
                sh = systemImage.height * 0.38;
            } else if (name === 'controller') {
                sx = systemImage.width * 0.05;
                sy = systemImage.height * 0.42;
                sw = systemImage.width * 0.30;
                sh = systemImage.height * 0.30;
            } else if (name === 'battery') {
                sx = systemImage.width * 0.08;
                sy = systemImage.height * 0.75;
                sw = systemImage.width * 0.35;
                sh = systemImage.height * 0.25;
            } else if (name === 'inverter') {
                sx = systemImage.width * 0.42;
                sy = systemImage.height * 0.38;
                sw = systemImage.width * 0.25;
                sh = systemImage.height * 0.25;
            } else if (name === 'load') {
                sx = systemImage.width * 0.65;
                sy = systemImage.height * 0.50;
                sw = systemImage.width * 0.35;
                sh = systemImage.height * 0.45;
            }

            try {
                gctx.drawImage(systemImage, sx, sy, sw, sh, p.x, p.y, PART_SIZE, PART_SIZE);
            } catch(e) {
                gctx.fillStyle = '#00ff00';
                gctx.fillRect(p.x, p.y, PART_SIZE, PART_SIZE);
            }
        } else {
            gctx.fillStyle = '#ff0000';
            gctx.fillRect(p.x, p.y, PART_SIZE, PART_SIZE);
        }
    });

    if (gameState === 'PLAYING') {
        document.getElementById('hudTimer').textContent = ((Date.now() - startTime) / 1000).toFixed(1) + 's';
    }
}

async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: 'user' }
        });
        video.srcObject = stream;
        camera = new Camera(video, {
            onFrame: async () => { await handDetector.send({ image: video }); },
            width: 1280, height: 720
        });
        camera.start();
    } catch (err) {
        alert('❌ لم أستطع تشغيل الكاميرا');
        console.error(err);
    }
}

function startCountdown() {
    let counter = 3;
    const el = document.getElementById('hudNext');
    const interval = setInterval(() => {
        el.textContent = counter > 0 ? counter : 'GO!';
        playBeep(500, 200);
        counter--;
        if (counter < -1) {
            clearInterval(interval);
            gameState = 'PLAYING';
            startTime = Date.now();
            el.textContent = 'ابدأ!';
        }
    }, 1000);
}

function checkWin() {
    if (PART_ORDER.every(name => parts[name].placed)) {
        gameState = 'FINISHED';
        const elapsed = (Date.now() - startTime) / 1000;
        playWin();
        document.getElementById('endStats').innerHTML = `
            اللاعب: ${playerName}<br>
            الوقت: ${elapsed.toFixed(1)}s<br>
            الأخطاء: ${mistakes}
        `;
        document.getElementById('endScreen').classList.remove('hidden');
    }
}

function restartGame() { location.reload(); }
