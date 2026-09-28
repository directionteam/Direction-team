// ===== المتغيرات الأساسية =====
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
let recordingStartTime = 0;

// ===== المحاكاة =====
let simulationStart = 0;
let batteryCharge = 0;
let lightBrightness = 0;
let simDone = false;

// ===== الإعدادات =====
const HOLD_DURATION = 500;
const PART_SIZE = 120;
const GAME_DURATION = 90; // 90 ثانية للعبة

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];
const PART_LABELS = {
    'panel': 'Solar Panel',
    'controller': 'Controller',
    'battery': 'Battery',
    'inverter': 'Inverter',
    'load': 'House'
};

const TARGETS = {
    'panel':      { x: 0.15, y: 0.75, num: 1 },
    'controller': { x: 0.35, y: 0.75, num: 2 },
    'battery':    { x: 0.55, y: 0.75, num: 3 },
    'inverter':   { x: 0.75, y: 0.75, num: 4 },
    'load':       { x: 0.90, y: 0.75, num: 5 }
};

// مواقع القطع في الصورة الكاملة (بعد التركيب)
const PARTS_IN_IMAGE = {
    'panel':      { x: 0.22, y: 0.30 },
    'controller': { x: 0.18, y: 0.55 },
    'battery':    { x: 0.25, y: 0.82 },
    'inverter':   { x: 0.52, y: 0.45 },
    'load':       { x: 0.80, y: 0.65 }
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
function playClick() { playBeep(400, 80); }

// ===== Leaderboard =====
function getLeaderboard() {
    try {
        return JSON.parse(localStorage.getItem('leaderboard') || '[]');
    } catch(e) { return []; }
}
function saveToLeaderboard(name, time, mistakesCount) {
    const lb = getLeaderboard();
    lb.push({ name, time: parseFloat(time.toFixed(1)), mistakes: mistakesCount, date: new Date().toLocaleDateString('ar-EG') });
    lb.sort((a, b) => {
        if (a.mistakes !== b.mistakes) return a.mistakes - b.mistakes;
        return a.time - b.time;
    });
    const top5 = lb.slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(top5));
}
function drawLeaderboard(W, H) {
    const lb = getLeaderboard();
    if (lb.length === 0) return;

    // خلفية شفافة
    gctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    gctx.fillRect(W - 320, 80, 300, 50 + lb.length * 35);
    gctx.strokeStyle = '#00d4ff';
    gctx.lineWidth = 2;
    gctx.strokeRect(W - 320, 80, 300, 50 + lb.length * 35);

    // العنوان
    gctx.fillStyle = '#00d4ff';
    gctx.font = 'bold 20px Arial';
    gctx.textAlign = 'center';
    gctx.fillText('🏆 Leaderboard', W - 170, 110);

    // النتائج
    gctx.textAlign = 'right';
    lb.forEach((entry, i) => {
        const y = 145 + i * 35;
        gctx.fillStyle = i === 0 ? '#ffd700' : (i === 1 ? '#c0c0c0' : (i === 2 ? '#cd7f32' : '#fff'));
        gctx.font = 'bold 15px Arial';
        gctx.fillText(`${i+1}. ${entry.name}`, W - 30, y);
        gctx.fillStyle = '#fff';
        gctx.font = '14px Arial';
        gctx.fillText(`${entry.time}s | ❌${entry.mistakes}`, W - 30, y + 18);
    });
}

// ===== الإحصائيات =====
function getStats() {
    try {
        return JSON.parse(localStorage.getItem('stats') || '{"games":0,"totalTime":0,"bestTime":9999,"totalMistakes":0}');
    } catch(e) { return {games:0,totalTime:0,bestTime:9999,totalMistakes:0}; }
}
function updateStats(time, mistakesCount) {
    const s = getStats();
    s.games++;
    s.totalTime += time;
    s.totalMistakes += mistakesCount;
    if (time < s.bestTime) s.bestTime = time;
    localStorage.setItem('stats', JSON.stringify(s));
}
function drawStats(W) {
    const s = getStats();
    gctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    gctx.fillRect(20, 80, 220, 100);
    gctx.strokeStyle = '#00d4ff';
    gctx.lineWidth = 2;
    gctx.strokeRect(20, 80, 220, 100);
    gctx.fillStyle = '#00d4ff';
    gctx.font = 'bold 14px Arial';
    gctx.textAlign = 'left';
    gctx.fillText(`🎮 اللعبات: ${s.games}`, 30, 105);
    gctx.fillText(`⏱️ متوسط الوقت: ${s.games ? (s.totalTime/s.games).toFixed(1) : 0}s`, 30, 130);
    gctx.fillText(`🥇 أفضل وقت: ${s.bestTime === 9999 ? '-' : s.bestTime + 's'}`, 30, 155);
    gctx.fillText(`❌ الأخطاء: ${s.games ? (s.totalMistakes/s.games).toFixed(1) : 0}`, 30, 180);
}

// ===== المحاكاة =====
function drawSun(cx, cy, t) {
    // هالة
    for (let i = 0; i < 3; i++) {
        const r = 30 + i * 12 + Math.sin(t * 3 + i) * 5;
        gctx.fillStyle = `rgba(255, 215, 0, ${0.2 - i * 0.05})`;
        gctx.beginPath();
        gctx.arc(cx, cy, r, 0, Math.PI * 2);
        gctx.fill();
    }
    // قلب
    gctx.fillStyle = '#FFD700';
    gctx.beginPath();
    gctx.arc(cx, cy, 30, 0, Math.PI * 2);
    gctx.fill();
    gctx.strokeStyle = '#FFA500';
    gctx.lineWidth = 3;
    gctx.stroke();
    // أشعة
    for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4 + t * 2;
        gctx.beginPath();
        gctx.moveTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40);
        gctx.lineTo(cx + Math.cos(a) * 55, cy + Math.sin(a) * 55);
        gctx.strokeStyle = '#FFD700';
        gctx.lineWidth = 3;
        gctx.stroke();
    }
}
function drawPowerLine(x1, y1, x2, y2, t) {
    gctx.beginPath();
    gctx.moveTo(x1, y1);
    gctx.lineTo(x2, y2);
    gctx.strokeStyle = 'rgba(255, 100, 0, 0.6)';
    gctx.lineWidth = 4;
    gctx.stroke();
    // نقاط متحركة
    for (let i = 0; i < 3; i++) {
        const p = ((t * 0.8) + i * 0.33) % 1;
        const px = x1 + (x2 - x1) * p;
        const py = y1 + (y2 - y1) * p;
        gctx.fillStyle = '#FFD700';
        gctx.beginPath();
        gctx.arc(px, py, 6, 0, Math.PI * 2);
        gctx.fill();
    }
}
function drawBatteryBar(x, y, charge) {
    gctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gctx.fillRect(x, y, 120, 30);
    gctx.strokeStyle = '#fff';
    gctx.lineWidth = 2;
    gctx.strokeRect(x, y, 120, 30);
    gctx.fillStyle = '#666';
    gctx.fillRect(x + 120, y + 8, 8, 14);
    // الشحن
    let color = '#ef4444';
    if (charge > 70) color = '#10b981';
    else if (charge > 30) color = '#f59e0b';
    gctx.fillStyle = color;
    gctx.fillRect(x + 3, y + 3, (114 * charge / 100), 24);
    // النص
    gctx.fillStyle = '#fff';
    gctx.font = 'bold 14px Arial';
    gctx.textAlign = 'center';
    gctx.fillText(`${Math.round(charge)}%`, x + 60, y + 21);
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
            y: 0.10 * window.innerHeight,
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

// ===== منطق اللعبة =====
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
                p.x = target.x * W;
                p.y = target.y * H;
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

function checkWin() {
    if (PART_ORDER.every(name => parts[name].placed)) {
        const elapsed = (Date.now() - startTime) / 1000;
        gameState = 'SIMULATION';
        simulationStart = Date.now();
        batteryCharge = 0;
        lightBrightness = 0;
        simDone = false;
        playWin();

        // حفظ الإحصائيات
        saveToLeaderboard(playerName, elapsed, mistakes);
        updateStats(elapsed, mistakes);

        // إشعار
        document.getElementById('endStats').innerHTML = `
            🎉 ${playerName}!<br>
            ⏱️ الوقت: ${elapsed.toFixed(1)}s<br>
            ❌ الأخطاء: ${mistakes}<br>
            <br>🌞 المحاكاة تبدأ...
        `;
        document.getElementById('endScreen').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('endScreen').classList.add('hidden');
        }, 2500);
    }
}

// ===== الرسم =====
function drawGame(W, H) {
    if (!gctx) return;
    gctx.clearRect(0, 0, W, H);

    // خلفية
    gctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    gctx.fillRect(0, 0, W, H);

    // ===== حالة اللعب =====
    if (gameState === 'PLAYING' || gameState === 'COUNTDOWN') {
        // المربعات المستهدفة - أرقام فقط
        PART_ORDER.forEach(name => {
            const target = TARGETS[name];
            const tx = target.x * W;
            const ty = target.y * H;
            const placed = parts[name].placed;

            gctx.strokeStyle = placed ? '#00ff00' : 'rgba(255, 255, 255, 0.8)';
            gctx.lineWidth = 4;
            gctx.strokeRect(tx, ty, PART_SIZE, PART_SIZE);

            gctx.fillStyle = placed ? '#00ff00' : '#ffffff';
            gctx.font = 'bold 40px Arial';
            gctx.textAlign = 'center';
            gctx.textBaseline = 'alphabetic';
            gctx.fillText(target.num, tx + PART_SIZE/2, ty + PART_SIZE + 50);
        });

        // القطع
        PART_ORDER.forEach(name => {
            const p = parts[name];
            if (p.placed && gameState === 'PLAYING') {
                // ارسم في مكانه بالصورة الأصلية
                const ip = PARTS_IN_IMAGE[name];
                const ix = ip.x * W;
                const iy = ip.y * H;

                if (systemImage && systemImage.complete) {
                    let sx, sy, sw, sh;
                    const IW = systemImage.width, IH = systemImage.height;
                    if (name === 'panel')      { sx=0.02*IW; sy=0.02*IH; sw=0.38*IW; sh=0.38*IH; }
                    else if (name === 'controller') { sx=0.05*IW; sy=0.42*IH; sw=0.30*IW; sh=0.30*IH; }
                    else if (name === 'battery')    { sx=0.08*IW; sy=0.75*IH; sw=0.35*IW; sh=0.25*IH; }
                    else if (name === 'inverter')   { sx=0.42*IW; sy=0.38*IH; sw=0.25*IW; sh=0.25*IH; }
                    else if (name === 'load')       { sx=0.65*IW; sy=0.50*IH; sw=0.35*IW; sh=0.45*IH; }
                    try {
                        gctx.drawImage(systemImage, sx, sy, sw, sh, ix - 40, iy - 40, 80, 80);
                    } catch(e) {}
                }
            } else if (!p.placed) {
                // ارسم القطعة العائمة
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
                    } catch(e) {}
                }
            }
        });

        // HUD
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, GAME_DURATION - elapsed);
        document.getElementById('hudTimer').textContent = elapsed.toFixed(1) + 's';
        document.getElementById('hudMistakes').textContent = mistakes;

        // Leaderboard + Stats
        drawLeaderboard(W, H);
        drawStats(W);

        // الوقت المتبقي (إذا خلص → انتهت اللعبة)
        if (elapsed > GAME_DURATION) {
            gameState = 'FINISHED';
            playWrong();
            document.getElementById('endStats').innerHTML = `⏰ انتهى الوقت!<br>الوقت: ${elapsed.toFixed(1)}s<br>الأخطاء: ${mistakes}`;
            document.getElementById('endScreen').classList.remove('hidden');
        }
    }

    // ===== حالة المحاكاة =====
    else if (gameState === 'SIMULATION') {
        const t = (Date.now() - simulationStart) / 1000;

        // خلفية
        const gradient = gctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1e');
        gctx.fillStyle = gradient;
        gctx.fillRect(0, 0, W, H);

        // الشمس
        drawSun(W / 2, 100, t);

        // القطع في مكانها
        PART_ORDER.forEach(name => {
            const ip = PARTS_IN_IMAGE[name];
            const ix = ip.x * W;
            const iy = ip.y * H;
            if (systemImage && systemImage.complete) {
                let sx, sy, sw, sh;
                const IW = systemImage.width, IH = systemImage.height;
                if (name === 'panel')      { sx=0.02*IW; sy=0.02*IH; sw=0.38*IW; sh=0.38*IH; }
                else if (name === 'controller') { sx=0.05*IW; sy=0.42*IH; sw=0.30*IW; sh=0.30*IH; }
                else if (name === 'battery')    { sx=0.08*IW; sy=0.75*IH; sw=0.35*IW; sh=0.25*IH; }
                else if (name === 'inverter')   { sx=0.42*IW; sy=0.38*IH; sw=0.25*IW; sh=0.25*IH; }
                else if (name === 'load')       { sx=0.65*IW; sy=0.50*IH; sw=0.35*IW; sh=0.45*IH; }
                try { gctx.drawImage(systemImage, sx, sy, sw, sh, ix - 40, iy - 40, 80, 80); } catch(e) {}
            }
        });

        // خطوط الكهرباء
        drawPowerLine(W*0.22, H*0.30, W*0.18, H*0.55, t);
        drawPowerLine(W*0.18, H*0.55, W*0.25, H*0.82, t);
        drawPowerLine(W*0.25, H*0.82, W*0.52, H*0.45, t);
        drawPowerLine(W*0.52, H*0.45, W*0.80, H*0.65, t);

        // البطارية
        batteryCharge = Math.min((t / 5) * 100, 100);
        drawBatteryBar(30, H - 60, batteryCharge);

        // اللمبة (توهج البيت)
        if (batteryCharge > 50) {
            lightBrightness = Math.min((batteryCharge - 50) / 50, 1);
            gctx.fillStyle = `rgba(255, 215, 0, ${lightBrightness * 0.3})`;
            gctx.beginPath();
            gctx.arc(W*0.80, H*0.65, 200, 0, Math.PI*2);
            gctx.fill();
        }

        // النص
        gctx.fillStyle = '#00d4ff';
        gctx.font = 'bold 28px Arial';
        gctx.textAlign = 'center';
        gctx.fillText('🌞 SYSTEM ONLINE', W/2, 50);

        gctx.font = '18px Arial';
        gctx.fillStyle = '#fff';
        gctx.fillText(`⚡ Power: ${Math.round(batteryCharge * 10)} W`, W/2, H - 100);
        gctx.fillText(`🔋 Battery: ${Math.round(batteryCharge)}%`, W/2, H - 75);
        gctx.fillText(`💡 Light: ${Math.round(lightBrightness * 100)}%`, W/2, H - 50);

        // انتهت المحاكاة
        if (batteryCharge >= 100 && !simDone) {
            simDone = true;
            playWin();
            setTimeout(() => {
                document.getElementById('endStats').innerHTML = `
                    🎉 SYSTEM COMPLETE!<br>
                    ⚡ Power: 1000 W<br>
                    🔋 Battery: 100%<br>
                    💡 Light: 100%
                `;
                document.getElementById('endScreen').classList.remove('hidden');
                gameState = 'FINISHED';
            }, 2000);
        }
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
            onFrame: async () => { await handDetector.send({ image: video }); },
            width: 1280, height: 720
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

// ===== تسجيل الفيديو =====
let mediaRecorder = null;
let recordedChunks = [];

function startRecording() {
    try {
        const stream = document.getElementById('video').srcObject;
        if (!stream) return;
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `direction-team-${playerName}-${Date.now()}.webm`;
            a.click();
        };
        mediaRecorder.start();
    } catch(e) {
        console.warn('تسجيل الفيديو غير مدعوم');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
}

// ===== إعادة اللعب =====
function restartGame() { location.reload(); }
