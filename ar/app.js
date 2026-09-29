let video, handCanvas, ctx, gameCanvas, gctx;
let handDetector, camera;
let fingertip = null;
let playerName = '';
let startTime = 0;
let mistakes = 0;
let gameState = 'IDLE';
let partImages = {};
let selectedPart = null;
let dragging = false;

let simulationStart = 0;
let batteryCharge = 0;
let lightBrightness = 0;
let simDone = false;

const GAME_DURATION = 60;
const PART_SIZE = 110;
const TOUCH_RADIUS = 150;
const SNAP_DISTANCE = 200;

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];

const PARTS_POSITIONS = {
    'panel':      { x: 0.15, y: 0.70, num: 1 },
    'controller': { x: 0.35, y: 0.70, num: 2 },
    'battery':    { x: 0.55, y: 0.70, num: 3 },
    'inverter':   { x: 0.75, y: 0.70, num: 4 },
    'load':       { x: 0.90, y: 0.70, num: 5 }
};

const SIM_POSITIONS = {
    'panel':      { x: 0.15, y: 0.30 },
    'controller': { x: 0.35, y: 0.55 },
    'battery':    { x: 0.35, y: 0.80 },
    'inverter':   { x: 0.60, y: 0.55 },
    'load':       { x: 0.80, y: 0.55 }
};

let parts = {};

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

function getLeaderboard() {
    try { return JSON.parse(localStorage.getItem('dt_leaderboard') || '[]'); }
    catch(e) { return []; }
}
function saveScore(name, time, mistakesCount, completed) {
    const lb = getLeaderboard();
    lb.push({
        name: name, time: parseFloat(time.toFixed(1)),
        mistakes: mistakesCount, completed: completed,
        date: new Date().toLocaleDateString('ar-EG')
    });
    lb.sort((a, b) => {
        if (a.completed !== b.completed) return b.completed - a.completed;
        if (a.mistakes !== b.mistakes) return a.mistakes - b.mistakes;
        return a.time - b.time;
    });
    localStorage.setItem('dt_leaderboard', JSON.stringify(lb.slice(0, 5)));
}
function drawLeaderboard(W) {
    const lb = getLeaderboard();
    if (lb.length === 0) return;
    gctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    gctx.fillRect(W - 280, 200, 260, 50 + lb.length * 40);
    gctx.strokeStyle = '#00d4ff';
    gctx.lineWidth = 2;
    gctx.strokeRect(W - 280, 200, 260, 50 + lb.length * 40);
    gctx.fillStyle = '#00d4ff';
    gctx.font = 'bold 20px Arial';
    gctx.textAlign = 'center';
    gctx.fillText('🏆 أفضل 5', W - 150, 230);
    lb.forEach((entry, i) => {
        const y = 265 + i * 40;
        const medal = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : `${i+1}.`));
        gctx.fillStyle = i === 0 ? '#ffd700' : (i === 1 ? '#c0c0c0' : (i === 2 ? '#cd7f32' : '#fff'));
        gctx.font = 'bold 15px Arial';
        gctx.textAlign = 'right';
        gctx.fillText(`${medal} ${entry.name}`, W - 30, y);
        gctx.fillStyle = entry.completed ? '#0f0' : '#ff8888';
        gctx.font = '12px Arial';
        gctx.fillText(entry.completed ? '✅' : '⏰', W - 30, y + 16);
        gctx.fillStyle = '#aaa';
        gctx.fillText(`${entry.time}s | ❌${entry.mistakes}`, W - 60, y + 16);
    });
}

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
        let loaded = 0;
        PART_ORDER.forEach(name => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { partImages[name] = img; loaded++; if (loaded === PART_ORDER.length) resolve(); };
            img.onerror = () => { loaded++; if (loaded === PART_ORDER.length) resolve(); };
            img.src = 'https://directionteam.github.io/Direction-team/ar/' + name + '.png';
        });
        setTimeout(resolve, 8000);
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
            placed: false,
            placement: null
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
            if (!p.placed) {
                p.x = Math.random() * (W - PART_SIZE - 100) + 50;
                p.y = 0.08 * H;
                mistakes++;
            }
            dragging = false;
            selectedPart = null;
        }
    }
    drawGame(W, H);
}

// ✅ الإفلات على أي مربع (صح أو غلط)
function handleGameLogic() {
    if (!fingertip) return;
    const W = window.innerWidth, H = window.innerHeight;
    const fx = fingertip.x, fy = fingertip.y;

    // ===== 1. اختيار قطعة =====
    if (!dragging) {
        for (const name of PART_ORDER) {
            const p = parts[name];
            if (p.placed && p.placement === 'correct') continue;

            if (Math.abs(fx - (p.x + PART_SIZE/2)) < TOUCH_RADIUS && 
                Math.abs(fy - (p.y + PART_SIZE/2)) < TOUCH_RADIUS) {
                
                // إذا كانت في المكان الغلط → اسحبها
                if (p.placed && p.placement === 'wrong') {
                    p.placed = false;
                    p.placement = null;
                    mistakes++;
                }

                selectedPart = name;
                dragging = true;
                break;
            }
        }
    }

    // ===== 2. حرّك القطعة مع الإصبع =====
    if (dragging && selectedPart) {
        const p = parts[selectedPart];
        p.x = fx - PART_SIZE/2;
        p.y = fy - PART_SIZE/2;

        // ===== 3. الإفلات على أي مربع (صح أو غلط) =====
        let snapped = false;
        let bestTarget = null;
        let bestDist = 9999;

        // ابحث عن **أقرب** مربع للإصبع
        for (const name of PART_ORDER) {
            const target = PARTS_POSITIONS[name];
            const tx = target.x * W;
            const ty = target.y * H;
            
            // مركز المربع
            const targetCenterX = tx + PART_SIZE/2;
            const targetCenterY = ty + PART_SIZE/2;

            // المسافة من الإصبع إلى مركز المربع
            const dist = Math.sqrt((fx - targetCenterX)**2 + (fy - targetCenterY)**2);

            // إذا الإصبع قريب من المربع
            if (dist < SNAP_DISTANCE && dist < bestDist) {
                bestDist = dist;
                bestTarget = { name, tx, ty };
            }
        }

        // ✅ إذا لقينا مربع قريب → افلت القطعة فيه
        if (bestTarget) {
            p.x = bestTarget.tx;
            p.y = bestTarget.ty;
            p.placed = true;

            if (bestTarget.name === selectedPart) {
                // ✅ صح
                p.placement = 'correct';
                playCorrect();
            } else {
                // ❌ غلط
                p.placement = 'wrong';
            }

            dragging = false;
            selectedPart = null;
            checkWin();
        }
    }
}

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

function drawPowerLine(x1, y1, x2, y2, t) {
    gctx.beginPath();
    gctx.moveTo(x1, y1);
    gctx.lineTo(x2, y2);
    gctx.strokeStyle = 'rgba(255, 100, 0, 0.7)';
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

function drawHouseGlow(cx, cy, brightness) {
    if (brightness <= 0) return;
    for (let i = 0; i < 4; i++) {
        const r = 80 + i * 50 + Math.sin(Date.now() / 300 + i) * 10;
        gctx.fillStyle = `rgba(255, 215, 0, ${brightness * 0.15 * (1 - i/4)})`;
        gctx.beginPath();
        gctx.arc(cx, cy, r, 0, Math.PI * 2);
        gctx.fill();
    }
}

function drawGame(W, H) {
    if (!gctx) return;
    gctx.clearRect(0, 0, W, H);
    gctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    gctx.fillRect(0, 0, W, H);

    if (gameState === 'SIMULATION') {
        const t = (Date.now() - simulationStart) / 1000;
        const grad = gctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#1a1a2e');
        grad.addColorStop(1, '#0f0f1e');
        gctx.fillStyle = grad;
        gctx.fillRect(0, 0, W, H);
        drawSun(W / 2, 100, t);
        PART_ORDER.forEach(name => {
            const sp = SIM_POSITIONS[name];
            const img = partImages[name];
            if (img && img.complete) {
                try { gctx.drawImage(img, sp.x*W, sp.y*H, PART_SIZE, PART_SIZE); } catch(e) {}
            }
        });
        const p1 = SIM_POSITIONS.panel, p2 = SIM_POSITIONS.controller;
        const p3 = SIM_POSITIONS.battery, p4 = SIM_POSITIONS.inverter;
        const p5 = SIM_POSITIONS.load;
        drawPowerLine(p1.x*W+50, p1.y*H+50, p2.x*W+50, p2.y*H+50, t);
        drawPowerLine(p2.x*W+50, p2.y*H+50, p3.x*W+50, p3.y*H+50, t);
        drawPowerLine(p3.x*W+50, p3.y*H+50, p4.x*W+50, p4.y*H+50, t);
        drawPowerLine(p4.x*W+50, p4.y*H+50, p5.x*W+50, p5.y*H+50, t);
        batteryCharge = Math.min((t / 5) * 100, 100);
        lightBrightness = batteryCharge > 50 ? Math.min((batteryCharge - 50) / 50, 1) : 0;
        drawHouseGlow(p5.x*W+50, p5.y*H+50, lightBrightness);
        drawBatteryBar(30, H - 60, batteryCharge);
        gctx.fillStyle = '#00d4ff';
        gctx.font = 'bold 32px Arial';
        gctx.textAlign = 'center';
        gctx.fillText('🌞 SYSTEM ONLINE', W/2, 50);
        gctx.font = 'bold 18px Arial';
        gctx.fillStyle = '#fff';
        gctx.fillText(`⚡ Power: ${Math.round(batteryCharge * 10)} W`, W/2, H - 100);
        gctx.fillText(`🔋 Battery: ${Math.round(batteryCharge)}%`, W/2, H - 75);
        gctx.fillText(`💡 Light: ${Math.round(lightBrightness * 100)}%`, W/2, H - 50);
        if (batteryCharge >= 100 && !simDone) {
            simDone = true;
            playComplete();
            const totalTime = (Date.now() - startTime) / 1000;
            saveScore(playerName, totalTime, mistakes, true);
            setTimeout(() => {
                gameState = 'FINISHED';
                document.getElementById('endStats').innerHTML = `
                    🎉 ${playerName}!<br>
                    ⏱️ الوقت: ${totalTime.toFixed(1)}s<br>
                    ❌ الأخطاء: ${mistakes}<br>
                    <br>✅ النظام يعمل بنجاح!
                `;
                document.getElementById('endScreen').classList.remove('hidden');
            }, 2500);
        }
        return;
    }

    PART_ORDER.forEach(name => {
        const target = PARTS_POSITIONS[name];
        const tx = target.x * W;
        const ty = target.y * H;
        const placed = parts[name].placed;

        gctx.strokeStyle = placed ? 'rgba(100, 100, 100, 0.3)' : 'rgba(255, 255, 255, 0.4)';
        gctx.lineWidth = 3;
        gctx.setLineDash([8, 8]);
        gctx.strokeRect(tx, ty, PART_SIZE, PART_SIZE);
        gctx.setLineDash([]);

        gctx.fillStyle = placed ? 'rgba(100, 100, 100, 0.5)' : 'rgba(255, 255, 255, 0.8)';
        gctx.font = 'bold 36px Arial';
        gctx.textAlign = 'center';
        gctx.textBaseline = 'alphabetic';
        gctx.fillText(target.num, tx + PART_SIZE/2, ty + PART_SIZE + 40);
    });

    PART_ORDER.forEach(name => {
        const p = parts[name];
        const img = partImages[name];
        if (img && img.complete) {
            try { gctx.drawImage(img, p.x, p.y, PART_SIZE, PART_SIZE); } catch(e) {}
        }
    });

    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, GAME_DURATION - elapsed);
    document.getElementById('hudTimer').textContent = remaining.toFixed(1) + 's';
    document.getElementById('hudMistakes').textContent = mistakes;

    gctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gctx.fillRect(W/2 - 150, 20, 300, 30);
    const timeColor = remaining > 20 ? '#0f0' : (remaining > 10 ? '#ff0' : '#f00');
    gctx.fillStyle = timeColor;
    gctx.fillRect(W/2 - 148, 22, (296 * remaining / GAME_DURATION), 26);

    drawLeaderboard(W);

    if (remaining <= 0 && gameState === 'PLAYING') {
        gameState = 'FINISHED';
        const completed = PART_ORDER.every(n => parts[n].placed && parts[n].placement === 'correct');
        saveScore(playerName, GAME_DURATION, mistakes, completed);
        let correct = 0, wrong = 0;
        PART_ORDER.forEach(n => {
            if (parts[n].placement === 'correct') correct++;
            else if (parts[n].placement === 'wrong') wrong++;
        });
        document.getElementById('endStats').innerHTML = `
            ⏰ انتهى الوقت!<br>
            👤 ${playerName}<br>
            ✅ صح: ${correct}/5<br>
            ❌ غلط: ${wrong}<br>
            🔴 الأخطاء: ${mistakes}
        `;
        document.getElementById('endScreen').classList.remove('hidden');
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
    if (PART_ORDER.every(n => parts[n].placed && parts[n].placement === 'correct')) {
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
