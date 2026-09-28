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

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];

// المواقع داخل الصورة (نسب من 0 إلى 1)
const PARTS_POSITIONS = {
    'panel':      { x: 0.22, y: 0.30, label: 'Solar Panel' },
    'controller': { x: 0.18, y: 0.55, label: 'Controller' },
    'battery':    { x: 0.25, y: 0.82, label: 'Battery' },
    'inverter':   { x: 0.52, y: 0.45, label: 'Inverter' },
    'load':       { x: 0.80, y: 0.65, label: 'House' }
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

    // تحميل الصورة
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
            y: 0.08 * window.innerHeight,
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
            if (Math.abs(fx - (p.x + 50)) < 60 && Math.abs(fy - (p.y + 50)) < 60) {
                selectedPart = name;
                dragging = true;
                break;
            }
        }
    }

    if (dragging && selectedPart) {
        parts[selectedPart].x = fx - 50;
        parts[selectedPart].y = fy - 50;

        const p = parts[selectedPart];
        const target = PARTS_POSITIONS[selectedPart];
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
            gctx.fillRect(tx, ty - 30, 100 * progress, 12);
            gctx.strokeStyle = 'white';
            gctx.lineWidth = 2;
            gctx.strokeRect(tx, ty - 30, 100, 12);

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

    // المربعات المستهدفة (باهتة)
    PART_ORDER.forEach(name => {
        const target = PARTS_POSITIONS[name];
        const tx = target.x * W;
        const ty = target.y * H;
        const placed = parts[name].placed;

        gctx.strokeStyle = placed ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 255, 255, 0.3)';
        gctx.lineWidth = 3;
        gctx.setLineDash([10, 10]);
        gctx.strokeRect(tx, ty, 100, 100);
        gctx.setLineDash([]);

        // الاسم
        gctx.fillStyle = placed ? '#00ff00' : 'rgba(255, 255, 255, 0.7)';
        gctx.font = 'bold 14px Arial';
        gctx.textAlign = 'center';
        gctx.fillText(target.label, tx + 50, ty + 130);
    });

    // القطع - نرسم كل قطعة كمقتطف من الصورة
    PART_ORDER.forEach(name => {
        const p = parts[name];
        const img = systemImage;

        if (img && img.complete) {
            // كل قطعة تُرسم من نفس الصورة الكاملة
            // نرسم المقطع المناسب
            let sx, sy, sw, sh;
            const IW = img.width, IH = img.height;

            switch(name) {
                case 'panel':
                    sx = 0.05 * IW; sy = 0.05 * IH;
                    sw = 0.35 * IW; sh = 0.35 * IH;
                    break;
                case 'controller':
                    sx = 0.05 * IW; sy = 0.45 * IH;
                    sw = 0.30 * IW; sh = 0.30 * IH;
                    break;
                case 'battery':
                    sx = 0.08 * IW; sy = 0.75 * IH;
                    sw = 0.35 * IW; sh = 0.25 * IH;
                    break;
                case 'inverter':
                    sx = 0.42 * IW; sy = 0.38 * IH;
                    sw = 0.25 * IW; sh = 0.25 * IH;
                    break;
                case 'load':
                    sx = 0.65 * IW; sy = 0.50 * IH;
                    sw = 0.35 * IW; sh = 0.45 * IH;
                    break;
            }
            try {
                gctx.drawImage(img, sx, sy, sw, sh, p.x, p.y, 100, 100);
            } catch(e) {
                gctx.fillStyle = '#ff0000';
                gctx.fillRect(p.x, p.y, 100, 100);
            }
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
