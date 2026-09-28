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

// ===== المحاكاة =====
let simulationStart = 0;
let batteryCharge = 0;
let lightBrightness = 0;
let simDone = false;

const HOLD_DURATION = 500;
const PART_SIZE = 100;

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];

const PARTS_POSITIONS = {
    'panel':      { x: 0.20, y: 0.30, num: 1 },
    'controller': { x: 0.18, y: 0.55, num: 2 },
    'battery':    { x: 0.25, y: 0.78, num: 3 },
    'inverter':   { x: 0.52, y: 0.48, num: 4 },
    'load':       { x: 0.80, y: 0.62, num: 5 }
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
function playComplete() {
    playBeep(500, 100);
    setTimeout(() => playBeep(700, 100), 100);
    setTimeout(() => playBeep(900, 100), 200);
    setTimeout(() => playBeep(1100, 300), 300);
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

// اقتصاص كل قطعة من الصورة
function getPartSource(name, IW, IH) {
    if (name === 'panel')      return { sx: 0.02*IW, sy: 0.02*IH, sw: 0.38*IW, sh: 0.38*IH };
    if (name === 'controller') return { sx: 0.05*IW, sy: 0.42*IH, sw: 0.30*IW, sh: 0.30*IH };
    if (name === 'battery')    return { sx: 0.08*IW, sy: 0.75*IH, sw: 0.35*IW, sh: 0.25*IH };
    if (name === 'inverter')   return { sx: 0.42*IW, sy: 0.38*IH, sw: 0.25*IW, sh: 0.25*IH };
    if (name === 'load')       return { sx: 0.65*IW, sy: 0.50*IH, sw: 0.35*IW, sh: 0.45*IH };
    return { sx: 0, sy: 0, sw: IW, sh: IH };
}

// ===== رسم الشمس =====
function drawSun(cx, cy, t) {
    for (let i = 0; i < 3; i++) {
        const r = 40 + i * 15 + Math.sin(t * 3 + i) * 5;
        gctx.fillStyle = `rgba(255, 215, 0, ${0.15 - i * 0.04})`;
        gctx.beginPath();
        gctx.arc(cx, cy, r, 0, Math.PI * 2);
        gctx.fill();
    }
    gctx.fillStyle = '#FFD700';
    gctx.beginPath();
    gctx.arc(cx, cy, 40, 0, Math.PI * 2);
    gctx.fill();
    gctx.strokeStyle = '#FFA500';
    gctx.lineWidth = 3;
    gctx.stroke();

    for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6 + t * 1.5;
        gctx.beginPath();
        gctx.moveTo(cx + Math.cos(a) * 50, cy + Math.sin(a) * 50);
        gctx.lineTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70);
        gctx.strokeStyle = '#FFD700';
        gctx.lineWidth = 4;
        gctx.stroke();
    }
}

// ===== خط كهرباء متحرك =====
function drawPowerLine(x1, y1, x2, y2, t) {
    gctx.beginPath();
    gctx.moveTo(x1, y1);
    gctx.lineTo(x2, y2);
    gctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
    gctx.lineWidth = 5;
    gctx.stroke();

    for (let i = 0; i < 3; i++) {
        const p = ((t * 0.8) + i * 0.33) % 1;
        const px = x1 + (x2 - x1) * p;
        const py = y1 + (y2 - y1) * p;
        gctx.fillStyle = '#FFD700';
        gctx.beginPath();
        gctx.arc(px, py, 8, 0, Math.PI * 2);
        gctx.fill();
        gctx.strokeStyle = '#fff';
        gctx.lineWidth = 2;
        gctx.stroke();
    }
}

// ===== بطارية تشحن =====
function drawBatteryBar(x, y, charge) {
    gctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    gctx.fillRect(x, y, 150, 35);
    gctx.strokeStyle = '#fff';
    gctx.lineWidth = 3;
    gctx.strokeRect(x, y, 150, 35);
    gctx.fillStyle = '#666';
    gctx.fillRect(x + 150, y + 10, 10, 15);

    let color = '#ef4444';
    if (charge > 70) color = '#10b981';
    else if (charge > 30) color = '#f59e0b';

    gctx.fillStyle = color;
    gctx.fillRect(x + 4, y + 4, (142 * charge / 100), 27);

    gctx.fillStyle = '#fff';
    gctx.font = 'bold 16px Arial';
    gctx.textAlign = 'center';
    gctx.fillText(`${Math.round(charge)}%`, x + 75, y + 24);
}

// ===== اللمبة/البيت يضيء =====
function drawHouseGlow(cx, cy, brightness) {
    if (brightness <= 0) return;
    for (let i = 0; i < 4; i++) {
        const r = 100 + i * 50 + Math.sin(Date.now() / 300 + i) * 10;
        gctx.fillStyle = `rgba(255, 215, 0, ${brightness * 0.15 * (1 - i/4)})`;
        gctx.beginPath();
        gctx.arc(cx, cy, r, 0, Math.PI * 2);
        gctx.fill();
    }
}

function drawGame(W, H) {
    if (!gctx) return;
    gctx.clearRect(0, 0, W, H);

    // خلفية
    gctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    gctx.fillRect(0, 0, W, H);

    // ===== حالة المحاكاة =====
    if (gameState === 'SIMULATION') {
        const t = (Date.now() - simulationStart) / 1000;

        // خلفية متدرجة
        const grad = gctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#1a1a2e');
        grad.addColorStop(1, '#0f0f1e');
        gctx.fillStyle = grad;
        gctx.fillRect(0, 0, W, H);

        // الشمس
        drawSun(W / 2, 100, t);

        // القطع في أماكنها
        if (systemImage && systemImage.complete) {
            const IW = systemImage.width, IH = systemImage.height;
            PART_ORDER.forEach(name => {
                const target = PARTS_POSITIONS[name];
                const tx = target.x * W;
                const ty = target.y * H;
                const src = getPartSource(name, IW, IH);
                try {
                    gctx.drawImage(systemImage, src.sx, src.sy, src.sw, src.sh, tx, ty, PART_SIZE, PART_SIZE);
                } catch(e) {}
            });
        }

        // خطوط الكهرباء
        drawPowerLine(PARTS_POSITIONS.panel.x*W + 50, PARTS_POSITIONS.panel.y*H + 50,
                     PARTS_POSITIONS.controller.x*W + 50, PARTS_POSITIONS.controller.y*H + 50, t);
        drawPowerLine(PARTS_POSITIONS.controller.x*W + 50, PARTS_POSITIONS.controller.y*H + 50,
                     PARTS_POSITIONS.battery.x*W + 50, PARTS_POSITIONS.battery.y*H + 50, t);
        drawPowerLine(PARTS_POSITIONS.battery.x*W + 50, PARTS_POSITIONS.battery.y*H + 50,
                     PARTS_POSITIONS.inverter.x*W + 50, PARTS_POSITIONS.inverter.y*H + 50, t);
        drawPowerLine(PARTS_POSITIONS.inverter.x*W + 50, PARTS_POSITIONS.inverter.y*H + 50,
                     PARTS_POSITIONS.load.x*W + 50, PARTS_POSITIONS.load.y*H + 50, t);

        // شحن البطارية (5 ثواني)
        batteryCharge = Math.min((t / 5) * 100, 100);

        // توهج البيت
        lightBrightness = batteryCharge > 50 ? Math.min((batteryCharge - 50) / 50, 1) : 0;
        drawHouseGlow(PARTS_POSITIONS.load.x*W + 50, PARTS_POSITIONS.load.y*H + 50, lightBrightness);

        // شريط البطارية
        drawBatteryBar(30, H - 60, batteryCharge);

        // نصوص
        gctx.fillStyle = '#00d4ff';
        gctx.font = 'bold 32px Arial';
        gctx.textAlign = 'center';
        gctx.fillText('🌞 SYSTEM ONLINE', W/2, 50);

        gctx.font = 'bold 18px Arial';
        gctx.fillStyle = '#fff';
        gctx.fillText(`⚡ Power: ${Math.round(batteryCharge * 10)} W`, W/2, H - 100);
        gctx.fillText(`🔋 Battery: ${Math.round(batteryCharge)}%`, W/2, H - 75);
        gctx.fillText(`💡 Light: ${Math.round(lightBrightness * 100)}%`, W/2, H - 50);

        // انتهاء المحاكاة
        if (batteryCharge >= 100 && !simDone) {
            simDone = true;
            playComplete();
            setTimeout(() => {
                gameState = 'FINISHED';
                const elapsed = (Date.now() - startTime) / 1000;
                document.getElementById('endStats').innerHTML = `
                    🎉 ${playerName}!<br>
                    ⏱️ الوقت: ${elapsed.toFixed(1)}s<br>
                    ❌ الأخطاء: ${mistakes}<br>
                    <br>✅ النظام يعمل بنجاح!
                `;
                document.getElementById('endScreen').classList.remove('hidden');
            }, 2000);
        }
        return;
    }

    // ===== حالة اللعب =====
    PART_ORDER.forEach(name => {
        const target = PARTS_POSITIONS[name];
        const tx = target.x * W;
        const ty = target.y * H;
        const placed = parts[name].placed;

        if (placed) {
            // ✅ القطعة مثبتة — ترسم داخل المربع
            if (systemImage && systemImage.complete) {
                const IW = systemImage.width, IH = systemImage.height;
                const src = getPartSource(name, IW, IH);
                try {
                    gctx.drawImage(systemImage, src.sx, src.sy, src.sw, src.sh, tx, ty, PART_SIZE, PART_SIZE);
                } catch(e) {}
            }
            // إطار أخضر
            gctx.strokeStyle = '#00ff00';
            gctx.lineWidth = 5;
            gctx.strokeRect(tx, ty, PART_SIZE, PART_SIZE);
            // ✅ علامة صح
            gctx.fillStyle = '#00ff00';
            gctx.font = 'bold 30px Arial';
            gctx.textAlign = 'center';
            gctx.fillText('✓', tx + PART_SIZE - 15, ty + 25);
        } else {
            // إطار متقطع
            gctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            gctx.lineWidth = 4;
            gctx.setLineDash([10, 10]);
            gctx.strokeRect(tx, ty, PART_SIZE, PART_SIZE);
            gctx.setLineDash([]);

            // الرقم
            gctx.fillStyle = '#ffffff';
            gctx.font = 'bold 36px Arial';
            gctx.textAlign = 'center';
            gctx.textBaseline = 'alphabetic';
            gctx.fillText(target.num, tx + PART_SIZE/2, ty + PART_SIZE + 40);
        }
    });

    // القطع العائمة
    PART_ORDER.forEach(name => {
        const p = parts[name];
        if (p.placed) return;

        if (systemImage && systemImage.complete) {
            const IW = systemImage.width, IH = systemImage.height;
            const src = getPartSource(name, IW, IH);
            try {
                gctx.drawImage(systemImage, src.sx, src.sy, src.sw, src.sh, p.x, p.y, PART_SIZE, PART_SIZE);
            } catch(e) {}
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
        playWin();
        setTimeout(() => {
            gameState = 'SIMULATION';
            simulationStart = Date.now();
            batteryCharge = 0;
            lightBrightness = 0;
            simDone = false;
        }, 800);
    }
}

function restartGame() { location.reload(); }
