let scene, camera, renderer;
let handDetector;
let fingertip = null;
let playerName = '';
let startTime = 0;
let mistakes = 0;
let gameState = 'IDLE';
let parts3D = [];
let selectedPart = null;
let holdingStartTime = 0;
let holdingPart = null;

const HOLD_DURATION = 500;

const PART_ORDER = ['panel', 'controller', 'battery', 'inverter', 'load'];
const PART_LABELS = {
    'panel': 'Solar Panel',
    'controller': 'Controller',
    'battery': 'Battery',
    'inverter': 'Inverter',
    'load': 'Load'
};

const TARGETS = {
    'panel':      { x: 0.15, y: 0.75, num: 1, color: 0x1e3a8a, geom: 'box' },
    'controller': { x: 0.35, y: 0.75, num: 2, color: 0x10b981, geom: 'box' },
    'battery':    { x: 0.55, y: 0.75, num: 3, color: 0xef4444, geom: 'cyl' },
    'inverter':   { x: 0.75, y: 0.75, num: 4, color: 0xf59e0b, geom: 'box' },
    'load':       { x: 0.90, y: 0.75, num: 5, color: 0xfbbf24, geom: 'sphere' }
};

async function startGame() {
    playerName = document.getElementById('playerName').value.trim() || 'Player';
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.getElementById('hudPlayer').textContent = playerName;

    initThreeJS();
    await initMediaPipe();
    await initCamera();

    gameState = 'COUNTDOWN';
    startCountdown();
}

function initThreeJS() {
    const canvas = document.getElementById('threeCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dLight = new THREE.DirectionalLight(0xffffff, 1);
    dLight.position.set(5, 5, 5);
    scene.add(dLight);

    createParts();
    animate();
}

function createParts() {
    const geometries = {
        'panel': new THREE.BoxGeometry(0.8, 0.05, 0.6),
        'controller': new THREE.BoxGeometry(0.4, 0.3, 0.3),
        'battery': new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32),
        'inverter': new THREE.BoxGeometry(0.5, 0.4, 0.3),
        'load': new THREE.SphereGeometry(0.3, 32, 32)
    };

    PART_ORDER.forEach((name, i) => {
        const config = TARGETS[name];
        const mat = new THREE.MeshPhongMaterial({
            color: config.color,
            shininess: 100,
            emissive: config.color,
            emissiveIntensity: 0.2
        });

        const mesh = new THREE.Mesh(geometries[name], mat);
        mesh.position.x = (Math.random() - 0.5) * 8;
        mesh.position.y = 1.8;
        mesh.position.z = 0;
        mesh.userData = { name, placed: false };
        scene.add(mesh);
        parts3D.push(mesh);
    });
}

function animate() {
    requestAnimationFrame(animate);

    parts3D.forEach(mesh => {
        if (!mesh.userData.placed) {
            mesh.rotation.y += 0.02;
        }
    });

    if (gameState === 'PLAYING') {
        const elapsed = (Date.now() - startTime) / 1000;
        document.getElementById('hudTimer').textContent = elapsed.toFixed(1) + 's';
    }

    renderer.render(scene, camera);
}

async function initMediaPipe() {
    handDetector = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    handDetector.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });
    handDetector.onResults(onHandResults);
}

function onHandResults(results) {
    const canvas = document.getElementById('handCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const lm = results.multiHandLandmarks[0];
        const tip = lm[8];
        const x = tip.x * canvas.width;
        const y = tip.y * canvas.height;
        fingertip = { x, y };

        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (gameState === 'PLAYING') {
            handleDrag();
        }
    } else {
        fingertip = null;
        if (selectedPart) {
            if (!selectedPart.userData.placed) {
                selectedPart.position.x = (Math.random() - 0.5) * 8;
                selectedPart.position.y = 1.8;
                mistakes++;
                document.getElementById('hudMistakes').textContent = mistakes;
            }
            selectedPart = null;
            holdingPart = null;
        }
    }

    drawTargets(ctx, canvas);
}

function handleDrag() {
    if (!fingertip) return;

    const x3d = (fingertip.x / window.innerWidth) * 2 - 1;
    const y3d = -(fingertip.y / window.innerHeight) * 2 + 1;

    if (!selectedPart) {
        parts3D.forEach(mesh => {
            if (mesh.userData.placed) return;
            const screenPos = mesh.position.clone().project(camera);
            const mx = (screenPos.x + 1) / 2 * window.innerWidth;
            const my = (-screenPos.y + 1) / 2 * window.innerHeight;
            const dist = Math.sqrt((mx - fingertip.x) ** 2 + (my - fingertip.y) ** 2);
            if (dist < 80) {
                selectedPart = mesh;
            }
        });
    }

    if (selectedPart) {
        const vector = new THREE.Vector3(x3d, y3d, 0.5).unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(dist));
        selectedPart.position.x = pos.x;
        selectedPart.position.y = pos.y;

        const config = TARGETS[selectedPart.userData.name];
        const tx = (config.x) * 2 - 1;
        const ty = -(config.y) * 2 + 1;

        const dx = Math.abs(selectedPart.position.x - tx);
        const dy = Math.abs(selectedPart.position.y - ty);

        if (dx < 0.6 && dy < 0.4) {
            if (holdingPart !== selectedPart) {
                holdingPart = selectedPart;
                holdingStartTime = Date.now();
            }
            if (Date.now() - holdingStartTime >= HOLD_DURATION) {
                selectedPart.userData.placed = true;
                selectedPart.position.set(tx, ty, 0);
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
    if (parts3D.every(m => m.userData.placed)) {
        gameState = 'FINISHED';
        const elapsed = (Date.now() - startTime) / 1000;
        document.getElementById('endStats').innerHTML = `
            اللاعب: ${playerName}<br>
            الوقت: ${elapsed.toFixed(1)}s<br>
            الأخطاء: ${mistakes}
        `;
        document.getElementById('endScreen').classList.remove('hidden');
    }
}

function drawTargets(ctx, canvas) {
    PART_ORDER.forEach(name => {
        const config = TARGETS[name];
        const x = config.x * canvas.width - 60;
        const y = config.y * canvas.height - 60;
        const mesh = parts3D.find(m => m.userData.name === name);
        const placed = mesh ? mesh.userData.placed : false;

        ctx.strokeStyle = placed ? '#00ff00' : '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, 120, 120);

        ctx.fillStyle = placed ? '#00ff00' : '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(config.num, x + 60, y + 75);
    });
}

async function initCamera() {
    const video = document.getElementById('video');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: 'user' }
        });
        video.srcObject = stream;
        const cam = new Camera(video, {
            onFrame: async () => { await handDetector.send({ image: video }); },
            width: 1280,
            height: 720
        });
        cam.start();
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
        counter--;
        if (counter < -1) {
            clearInterval(interval);
            gameState = 'PLAYING';
            startTime = Date.now();
            el.textContent = 'ابدأ!';
        }
    }, 1000);
}

function restartGame() { location.reload(); }

window.addEventListener('resize', () => {
    if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
