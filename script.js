/* 1. SECTION SWITCHER SYSTEM */
function switchSection(secId) {
  const sections = ['entrance', 'pond', 'reminders', 'library', 'unspoken', 'listening', 'vault'];
  
  sections.forEach(s => {
    const el = document.getElementById('sec-' + s);
    const nav = document.getElementById('nav-' + s);
    if (el) el.style.display = (s === secId) ? 'block' : 'none';
    if (nav) {
      if (s === secId) nav.classList.add('active');
      else nav.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (secId === 'pond') {
    setTimeout(initPond, 100);
  }
}

/* 2. AMBIENT RAIN CANVAS ANIMATION */
const rainCanvas = document.getElementById('rainCanvas');
if (rainCanvas) {
  const ctx = rainCanvas.getContext('2d');
  function resizeRain() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeRain);
  resizeRain();

  const raindrops = Array.from({ length: 70 }, () => ({
    x: Math.random() * rainCanvas.width,
    y: Math.random() * rainCanvas.height,
    length: Math.random() * 20 + 10,
    speed: Math.random() * 4 + 2,
    opacity: Math.random() * 0.3 + 0.1
  }));

  function animateRain() {
    ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    raindrops.forEach(drop => {
      ctx.beginPath();
      ctx.globalAlpha = drop.opacity;
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 1, drop.y + drop.length);
      ctx.stroke();

      drop.y += drop.speed;
      if (drop.y > rainCanvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * rainCanvas.width;
      }
    });
    requestAnimationFrame(animateRain);
  }
  animateRain();
}

/* 3. BACKGROUND MUSIC PLAYER SYSTEM */
const bgAudio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;

const playlist = [
  { title: "Mac DeMarco — The Most Beautiful Thing", src: "audio/mac-demarco.mp3" },
  { title: "Kyle Raphael — Libu-libong Buwan", src: "audio/libu-libong-buwan.mp3" }
];

const musicBtn = document.getElementById('musicToggleBtn');
const musicTitle = document.getElementById('musicTitle');

function loadTrack(index) {
  bgAudio.src = playlist[index].src;
  bgAudio.loop = true;
  if (musicTitle) musicTitle.textContent = playlist[index].title;
}

loadTrack(currentTrackIndex);

if (musicBtn) {
  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      musicBtn.classList.remove('playing');
    } else {
      bgAudio.play().catch(e => console.log("Audio play waiting for user click."));
      isPlaying = true;
      musicBtn.classList.add('playing');
    }
  });
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) bgAudio.play();
}

/* 4. WEB AUDIO SYNTHESIZER FOR WATER CHIMES */
let audioCtx = null;
function playChime(isWish = false) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const freqs = isWish ? [523.25, 659.25, 783.99, 1046.50] : [329.63, 392.00, 493.88, 587.33];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
  } catch (e) {
    // Audio Context fallback
  }
}

/* 5. INTERACTIVE WATER LILY POND CANVAS */
let pondInitialized = false;
let ripples = [];
let fireflies = [];
let wishes = [];

const loveNotes = [
  "Happy Birthday, Aidelle, mi amor! 🌸",
  "You bring so much beauty into my world. 🪷",
  "Thinking of your smile makes my day brighter. ✨",
  "Like a quiet pond, you bring peace to my heart. 💖",
  "Every moment with you is my favorite memory. 📜",
  "I'm so lucky to celebrate another birthday with you! 🎉",
  "You are my favorite song, my favorite story. 🎶"
];

function initPond() {
  if (pondInitialized) return;
  pondInitialized = true;

  const canvas = document.getElementById('pondCanvas');
  const container = document.getElementById('lilyContainer');
  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');

  function resizePond() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resizePond();
  window.addEventListener('resize', resizePond);

  // Spawn fireflies
  fireflies = Array.from({ length: 25 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    alpha: Math.random() * 0.8 + 0.2,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5
  }));

  // Initial Water Lilies
  const initialLilies = [
    { x: 25, y: 35, note: "Happy Birthday Aidelle, mi amor! 🌸", emoji: "🪷", label: "For Aidelle" },
    { x: 70, y: 28, note: "You are the sweetest part of my life. ✨", emoji: "🌸", label: "Mi Amor" },
    { x: 48, y: 65, note: "May all your birthday wishes come true! 🎉", emoji: "🪷", label: "Birthday Wishes" }
  ];

  initialLilies.forEach(item => spawnLilyElement(item.x, item.y, item.note, item.emoji, item.label));

  // Canvas Animation Loop
  function renderPond() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gradient Water Background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0a1622');
    grad.addColorStop(1, '#050c12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Water Ripples
    ripples.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color || `rgba(212, 175, 55, ${r.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      r.radius += 1.2;
      r.alpha -= 0.012;

      if (r.alpha <= 0) ripples.splice(idx, 1);
    });

    // Render Fireflies
    fireflies.forEach(f => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 150, ${f.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(212, 175, 55, 0.8)";
      ctx.fill();
      ctx.shadowBlur = 0;

      f.x += f.speedX;
      f.y += f.speedY;

      if (f.x < 0 || f.x > canvas.width) f.speedX *= -1;
      if (f.y < 0 || f.y > canvas.height) f.speedY *= -1;
    });

    requestAnimationFrame(renderPond);
  }
  renderPond();

  // Click on Pond Event
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / canvas.width) * 100;
    const yPct = (y / canvas.height) * 100;

    ripples.push({ x, y, radius: 5, alpha: 0.8 });
    playChime();

    const randomNote = loveNotes[Math.floor(Math.random() * loveNotes.length)];
    const emoji = Math.random() > 0.5 ? "🪷" : "🌸";
    spawnLilyElement(xPct, yPct, randomNote, emoji, "Bloomed Flower");
  });
}

function spawnLilyElement(xPct, yPct, note, emoji, label, isWish = false) {
  const container = document.getElementById('lilyContainer');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'water-lily-item';
  div.style.left = xPct + '%';
  div.style.top = yPct + '%';

  div.innerHTML = `
    <div class="lily-flower ${isWish ? 'wish-flower' : ''}">${emoji}</div>
    <div class="lily-tag">${label}</div>
  `;

  div.onclick = (e) => {
    e.stopPropagation();
    playChime(isWish);

    if (isWish) {
      openModal('✨ Aidelle\'s Birthday Wish', `"${note}"`, '🌟 WISH RELEASED');
    } else {
      openModal('🪷 Water Lily Note for Aidelle', note, '💖 FLORAL LOVE NOTE');
    }
  };

  container.appendChild(div);
}

/* 6. MODAL SYSTEM & WISH MANAGEMENT */
function openModal(title, body, meta) {
  const modal = document.getElementById('museumModal');
  if (modal) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').textContent = body;
    document.getElementById('modalMeta').textContent = meta || 'EXHIBIT DETAILS';
    modal.classList.add('active');
  }
}

function closeModalDirect() {
  const modal = document.getElementById('museumModal');
  if (modal) modal.classList.remove('active');
}

/* Wish Modals */
function openWishModal() {
  const modal = document.getElementById('wishModal');
  if (modal) modal.classList.add('active');
}

function closeWishModal() {
  const modal = document.getElementById('wishModal');
  if (modal) modal.classList.remove('active');
}

function submitWish() {
  const input = document.getElementById('wishInput');
  if (!input || !input.value.trim()) return;

  const wishText = input.value.trim();
  wishes.push({ text: wishText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });

  document.getElementById('wishCount').textContent = wishes.length;

  // Spawn Golden Wish Lily near middle of pond
  const x = Math.random() * 60 + 20;
  const y = Math.random() * 50 + 25;
  spawnLilyElement(x, y, wishText, "🌟", "Aidelle's Wish", true);

  // Add golden ripple
  const canvas = document.getElementById('pondCanvas');
  if (canvas) {
    const rx = (x / 100) * canvas.width;
    const ry = (y / 100) * canvas.height;
    ripples.push({ x: rx, y: ry, radius: 10, alpha: 1.0, color: 'rgba(212, 175, 55, 0.9)' });
  }

  playChime(true);
  input.value = '';
  closeWishModal();

  openModal('🌟 Wish Released Into The Pond!', `Your wish "${wishText}" has bloomed as a glowing Golden Water Lily in the pond!`, '✨ HAPPY BIRTHDAY AIDELLE');
}

function openWishVault() {
  const modal = document.getElementById('wishVaultModal');
  const list = document.getElementById('wishVaultList');

  if (list) {
    if (wishes.length === 0) {
      list.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No wishes released yet. Click "Make a Birthday Wish" to bloom your first golden water lily!</p>`;
    } else {
      list.innerHTML = wishes.map((w, i) => `
        <div class="wish-vault-item">
          <div class="wish-text">🌟 "${w.text}"</div>
          <div class="wish-time">Wish #${i + 1} • Released at ${w.time}</div>
        </div>
      `).join('');
    }
  }

  if (modal) modal.classList.add('active');
}

function closeWishVault() {
  const modal = document.getElementById('wishVaultModal');
  if (modal) modal.classList.remove('active');
}

/* Bouquet Modal */
function openBouquetModal() {
  const modal = document.getElementById('bouquetModal');
  if (modal) modal.classList.add('active');
}

function closeBouquetModal() {
  const modal = document.getElementById('bouquetModal');
  if (modal) modal.classList.remove('active');
}