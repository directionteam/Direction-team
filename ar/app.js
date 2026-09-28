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
const PART_SIZE = 100;

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];

// ✅ أرقام فقط — بدون أسماء
const PARTS_POSITIONS = {
    'panel':      { x: 0.22, y: 0.30, num: 1 },
    'controller': { x: 0.18, y: 0.55, num: 2 },
    'battery':    { x: 0.25, y: 0.82, num: 3 },
    'inverter':   { x: 0.52, y: 0.45, num: 4 },
    'load':       { x: 0.80, y: 0.65, num: 5 }
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

    await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => { systemImage = img; resolve(); };
        img.onerror = () => { resolve(); };
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
            const p = parts[selectedPart];
            const target = PARTS_POSITIONS[selectedPart];
            const tx = target.x * W;
            const ty = target.y * H;
            const inTarget = Math.abs(p.x - tx) < 120 && Math.abs(p.y - ty) < 120;

            if (!inTarget) {
                const positions = [0.05, 0.24, 0.43, 0.62, 0.81];
                for (let i = positions.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [positions[i], positions[j]] = [positions[j], positions[i]];
                }
                p.x = positions[Math.floor(Math.random() * 5)] * W;
                p.y = 0.08 * H;
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

function drawGame(W, H) {
    if (!gctx) return;
    gctx.clearRect(0, 0, W, H);

    gctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    gctx.fillRect(0, 0, W, H);

    // المربعات المستهدفة - أرقام فقط
    PART_ORDER.forEach(name => {
        const target = PARTS_POSITIONS[name];
        const tx = target.x * W;
        const ty = target.y * H;
        const placed = parts[name].placed;

        gctx.strokeStyle = placed ? '#00ff00' : 'rgba(255, 255, 255, 0.7)';
        gctx.lineWidth = 4;
        gctx.setLineDash([10, 10]);
        gctx.strokeRect(tx, ty, PART_SIZE, PART_SIZE);
        gctx.setLineDash([]);

        gctx.fillStyle = placed ? '#00ff00' : '#ffffff';
        gctx.font = 'bold 36px Arial';
        gctx.textAlign = 'center';
        gctx.textBaseline = 'alphabetic';
        gctx.fillText(target.num, tx + PART_SIZE/2, ty + PART_SIZE + 40);
    });

    // القطع
    PART_ORDER.forEach(name => {
        const p = parts[name];
        if (p.placed) return;

        if (systemImage && systemImage.complete) {
            let sx, sy, sw, sh;
            const IW = systemImage.width, IH = systemImage.height;

            if (name === 'panel')      { sx=0.02*IW; sy=0.02*IH; sw=0.38*IW; sh=0.38*IH; }
            else if (name === 'controller') { sx=0.05*IW; sy=0.42*IH; sw=0.30*IW; sh=0.30*IH; }
            else if (name === 'battery')    { sx=0.08*IW; sy=0.75*IH; sw=0.35*IW; sh=0.25*IH; }
            else if (name === 'inverter')   { sx=0.42*IW; sy=0.38*IH; sw=0.25*IW; sh=0.25*IH; }
            else if (name === 'load')       { sx=0.65*IW; sy=0.50*IH; sw=0.35*IW; sh=0.45*IH; }

            try {
                gctx.drawImage(systemImage, sx, sy, sw, sh, p.x, p.y, PART_SIZE, PART_SIZE);
            } catch(e) {
                gctx.fillStyle = '#00ff00';
                gctx.fillRect(p.x, p.y, PART_SIZE, PART_SIZE);
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
