// ===== المتغيرات =====
let video, handCanvas, ctx, gameCanvas, gctx;
let handDetector, camera;
let fingertip = null;
let playerName = '';
let startTime = 0;
let mistakes = 0;
let gameState = 'IDLE';
let images = {};
let imagesLoaded = 0;
let selectedPart = null;
let dragging = false;
let holdingPart = null;
let holdingStartTime = 0;

const HOLD_DURATION = 500;
const PART_SIZE = 100;

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];
const PART_LABELS = {
    'panel': 'Solar Panel',
    'controller': 'Controller',
    'battery': 'Battery',
    'inverter': 'Inverter',
    'load': 'Load'
};

const TARGETS = {
    'panel':      { x: 0.12, y: 0.72, num: 1 },
    'controller': { x: 0.32, y: 0.72, num: 2 },
    'battery':    { x: 0.52, y: 0.72, num: 3 },
    'inverter':   { x: 0.72, y: 0.72, num: 4 },
    'load':       { x: 0.90, y: 0.72, num: 5 }
};

let parts = {};

// ===== الأصوات =====
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

    await loadImages();
    randomizePositions();
    await initMediaPipe();
    await initCamera();

    gameState = 'COUNTDOWN';
    startCountdown();
}

// ===== تحميل الصور =====
function loadImages() {
    return new Promise((resolve) => {
        const names = ['panel', 'controller', 'battery', 'inverter', 'load'];
        
        names.forEach(name => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === names.length) resolve();
            };
            img.onerror = () => {
                console.warn('فشل تحميل: ' + name);
                imagesLoaded++;
                if (imagesLoaded === names.length) resolve();
            };
            // ✅ المسار الصحيح: نفس المجلد
            img.src = name + '.png';
        });
    });
}

// ===== خلط القطع =====
function randomizePositions() {
    const positions = [0.08, 0.26, 0.44, 0.62, 0.80];
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    PART_ORDER.forEach((name, i) => {
        parts[name] = {
            x: positions[i] * window.innerWidth,
            y: 0.15 * window.innerHeight,
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
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
    });
    handDetector.onResults(onHandResults);
}

function onHandResults(results) {
    // ✅ استخدم أبعاد النافذة الفعلية
    const W = window.innerWidth;
    const H = window.innerHeight;

    if (handCanvas.width !== W || handCanvas.height !== H) {
        handCanvas.width = W;
        handCanvas.height = H;
    }
    if (gameCanvas.width !== W || gameCanvas.height !== H) {
        gameCanvas.width = W;
        gameCanvas.height = H;
    }

    ctx.clearRect(0, 0, W, H);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const lm = results.multiHandLandmarks[0];
        const tip = lm[8];
        // ✅ عكس x لأن الفيديو معكوس
       const x = tip.x * W;
        const y = tip.y * H;
        fingertip = { x, y };

        // رسم نقطة الإصبع
        ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (gameState === 'PLAYING') {
            handleGameLogic();
        }
    } else {
        fingertip = null;
        if (dragging && selectedPart) {
            const p = parts[selectedPart];
            const target = TARGETS[selectedPart];
            const tx = target.x * W;
            const ty = target.y * H;
            const inTarget = Math.abs(p.x - tx) < 100 && Math.abs(p.y - ty) < 100;

            if (!inTarget) {
                const positions = [0.08, 0.26, 0.44, 0.62, 0.80];
                for (let i = positions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [positions[i], positions[j]] = [positions[j], positions[i]];
                }
                p.x = positions[Math.floor(Math.random() * 5)] * W;
                p.y = 0.15 * H;
                mistakes++;
                document.getElementById('hudMistakes').textContent = mistakes;
                playWrong();
            }
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
    const W = window.innerWidth;
    const H = window.innerHeight;
    const fx = fingertip.x;
    const fy = fingertip.y;

    if (!dragging) {
        for (const name of PART_ORDER) {
            if (parts[name].placed) continue;
            const p = parts[name];
            const dx = Math.abs(fx - (p.x + PART_SIZE / 2));
            const dy = Math.abs(fy - (p.y + PART_SIZE / 2));
            if (dx < 70 && dy < 70) {
                selectedPart = name;
                dragging = true;
                break;
            }
        }
    }

    if (dragging && selectedPart) {
        parts[selectedPart].x = fx - PART_SIZE / 2;
        parts[selectedPart].y = fy - PART_SIZE / 2;

        const p = parts[selectedPart];
        const target = TARGETS[selectedPart];
        const tx = target.x * W;
        const ty = target.y * H;

        const inTarget = Math.abs(p.x - tx) < 100 && Math.abs(p.y - ty) < 100;

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

    // الأرقام
    PART_ORDER.forEach(name => {
        const target = TARGETS[name];
        const tx = target.x * W;
        const ty = target.y * H;
        const placed = parts[name].placed;

        gctx.strokeStyle = placed ? '#00ff00' : '#ffffff';
        gctx.lineWidth = 4;
        gctx.strokeRect(tx, ty, PART_SIZE, PART_SIZE);

        gctx.fillStyle = placed ? '#00ff00' : '#ffffff';
        gctx.font = 'bold 32px Arial';
        gctx.textAlign = 'center';
        gctx.fillText(target.num, tx + PART_SIZE / 2, ty + PART_SIZE + 40);
    });

    // القطع
    PART_ORDER.forEach(name => {
        const p = parts[name];
        const img = images[name];

        if (img && img.complete && img.naturalWidth > 0) {
            gctx.drawImage(img, p.x, p.y, PART_SIZE, PART_SIZE);
        } else {
            // بديل
            const colors = {
                'panel': '#1e3a8a',
                'controller': '#10b981',
                'battery': '#ef4444',
                'inverter': '#f59e0b',
                'load': '#fbbf24'
            };
            gctx.fillStyle = colors[name];
            gctx.fillRect(p.x, p.y, PART_SIZE, PART_SIZE);
            gctx.fillStyle = 'white';
            gctx.font = 'bold 12px Arial';
            gctx.textAlign = 'center';
            gctx.fillText(PART_LABELS[name].substring(0, 5), p.x + PART_SIZE / 2, p.y + PART_SIZE / 2);
        }
    });

    if (gameState === 'PLAYING') {
        const elapsed = (Date.now() - startTime) / 1000;
        document.getElementById('hudTimer').textContent = elapsed.toFixed(1) + 's';
    }
}

// ===== الكاميرا =====
async function initCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: 'user' }
        });
        video.srcObject = stream;

        camera = new Camera(video, {
            onFrame: async () => {
                await handDetector.send({ image: video });
            },
            width: 1280,
            height: 720
        });
        camera.start();
    } catch (err) {
        alert('❌ لم أستطع تشغيل الكاميرا');
        console.error(err);
    }
}

// ===== العد التنازلي =====
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

// ===== الفوز =====
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
