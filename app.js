/**
 * KIDBRIGHT32 ULTRASONIC PROXIMITY RADAR DASHBOARD
 * Core Application Logic, Web Serial API, Radar Canvas, Timeline Chart, and Web Audio
 */

// Application State
const state = {
  distance: 30,           // Current distance in cm
  previousZone: 'safe',   // 'safe' | 'warning' | 'danger'
  isConnected: false,     // Web Serial connected
  isDemoMode: false,      // Demo / Simulation mode
  isAudioMuted: true,     // Web Audio sound toggle (defaults to muted for browser autoplay policy)
  
  // Stats
  minDistance: null,
  maxDistance: null,
  sumDistance: 0,
  countReadings: 0,
  alertCount: 0,
  packetCount: 0,
  lastPacketTime: performance.now(),
  currentDataRate: 0,
  
  // History for timeline chart
  history: [], // Array of { time: timestamp, distance: number }
  maxHistoryPoints: 90,
  
  // Event logs
  logs: [],
  
  // Hardware KidBright Simulation State
  hw: {
    ledWifi: false,     // true = ON (KidBright sends LOW)
    ledNtp: false,
    buzzer: false,
    blinkState: false,
    lastBlinkTime: 0,
    interval: 300,
  },
  
  // Simulation Auto-walk
  autoWalk: {
    running: false,
    direction: -1,      // -1 approaching, +1 receding
    current: 40,
    speed: 0.4
  }
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
const el = {
  // Header & Controls
  connectionPill: document.getElementById('connectionPill'),
  connectionStatusText: document.getElementById('connectionStatusText'),
  btnConnectSerial: document.getElementById('btnConnectSerial'),
  btnConnectSerialText: document.getElementById('btnConnectSerialText'),
  btnToggleDemo: document.getElementById('btnToggleDemo'),
  btnToggleAudio: document.getElementById('btnToggleAudio'),
  iconAudioOn: document.getElementById('iconAudioOn'),
  iconAudioOff: document.getElementById('iconAudioOff'),
  btnOpenPinout: document.getElementById('btnOpenPinout'),
  btnCloseModal: document.getElementById('btnCloseModal'),
  pinoutModal: document.getElementById('pinoutModal'),
  
  // Simulation Dock
  simulationDock: document.getElementById('simulationDock'),
  simDistanceSlider: document.getElementById('simDistanceSlider'),
  simSliderVal: document.getElementById('simSliderVal'),
  btnSimAutoWalk: document.getElementById('btnSimAutoWalk'),
  presetBtns: document.querySelectorAll('.preset-btn[data-val]'),
  
  // Metrics
  distanceCard: document.getElementById('distanceCard'),
  statusBadge: document.getElementById('statusBadge'),
  txtDistanceVal: document.getElementById('txtDistanceVal'),
  txtZoneDescription: document.getElementById('txtZoneDescription'),
  distanceBarFill: document.getElementById('distanceBarFill'),
  
  // Hardware status
  hwLedWifi: document.getElementById('hwLedWifi'),
  hwLedNtp: document.getElementById('hwLedNtp'),
  hwBuzzer: document.getElementById('hwBuzzer'),
  txtLedWifiState: document.getElementById('txtLedWifiState'),
  txtLedNtpState: document.getElementById('txtLedNtpState'),
  txtBuzzerState: document.getElementById('txtBuzzerState'),
  txtBeepInterval: document.getElementById('txtBeepInterval'),
  
  // Stats
  statMinDistance: document.getElementById('statMinDistance'),
  statAvgDistance: document.getElementById('statAvgDistance'),
  statMaxDistance: document.getElementById('statMaxDistance'),
  statAlertCount: document.getElementById('statAlertCount'),
  txtDataRate: document.getElementById('txtDataRate'),
  txtPacketCount: document.getElementById('txtPacketCount'),
  btnResetStats: document.getElementById('btnResetStats'),
  
  // Visualizers
  radarCanvas: document.getElementById('radarCanvas'),
  chartCanvas: document.getElementById('chartCanvas'),
  
  // Project Manual & Info
  projectManualCard: document.getElementById('projectManualCard'),
  btnCollapseManual: document.getElementById('btnCollapseManual'),
  manualContent: document.getElementById('manualContent'),
  btnToggleManual: document.getElementById('btnToggleManual'),
  
  // Event Log
  eventLogTbody: document.getElementById('eventLogTbody'),
  logCountBadge: document.getElementById('logCountBadge'),
  btnExportCSV: document.getElementById('btnExportCSV'),
  btnClearLogs: document.getElementById('btnClearLogs'),
};

// Canvas Contexts
const radarCtx = el.radarCanvas.getContext('2d');
const chartCtx = el.chartCanvas.getContext('2d');

// Web Serial References
let serialPort = null;
let serialReader = null;
let keepReadingSerial = false;

// Web Audio API Reference
let audioCtx = null;
let buzzerOsc = null;
let buzzerGain = null;

// ==========================================================================
// AUDIO SYSTEM (WEB AUDIO API - 2700Hz KIDBRIGHT SIMULATOR)
// ==========================================================================
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    buzzerOsc = audioCtx.createOscillator();
    buzzerOsc.type = 'sine'; // KidBright piezo frequency
    buzzerOsc.frequency.setValueAtTime(2700, audioCtx.currentTime); // 2700Hz
    
    buzzerGain = audioCtx.createGain();
    buzzerGain.gain.setValueAtTime(0, audioCtx.currentTime);
    
    buzzerOsc.connect(buzzerGain);
    buzzerGain.connect(audioCtx.destination);
    buzzerOsc.start();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function setBuzzerSound(isOn) {
  if (!audioCtx || state.isAudioMuted) return;
  
  const now = audioCtx.currentTime;
  if (isOn) {
    buzzerGain.gain.cancelScheduledValues(now);
    buzzerGain.gain.setTargetAtTime(0.12, now, 0.005); // volume
  } else {
    buzzerGain.gain.cancelScheduledValues(now);
    buzzerGain.gain.setTargetAtTime(0, now, 0.005);
  }
}

// ==========================================================================
// DATA PROCESSING & LOGIC MIRRORING KIDBRIGHT32
// ==========================================================================
function mapRange(value, inMin, inMax, outMin, outMax) {
  return Math.round(outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin)));
}

function processDistance(cm) {
  if (isNaN(cm) || cm < 0) return;
  // กรณีเซนเซอร์อ่านค่าไม่ได้ หรืออยู่นอกระยะการวัด (โค้ดคืนค่า 999)
  if (cm >= 900) {
    cm = 100; // กำหนดให้เป็นระยะไกลปลอดภัย
  }
  cm = Math.min(Math.max(cm, 1), 400);
  state.distance = cm;
  
  // Calculate stats
  state.packetCount++;
  state.countReadings++;
  state.sumDistance += cm;
  
  if (state.minDistance === null || cm < state.minDistance) state.minDistance = cm;
  if (state.maxDistance === null || cm > state.maxDistance) state.maxDistance = cm;
  
  // Update packet rate
  const now = performance.now();
  const delta = now - state.lastPacketTime;
  if (delta > 0) {
    const instantRate = 1000 / delta;
    state.currentDataRate = (state.currentDataRate * 0.85) + (instantRate * 0.15); // smoothed
  }
  state.lastPacketTime = now;
  
  // Add to timeline history
  state.history.push({ time: Date.now(), distance: cm });
  if (state.history.length > state.maxHistoryPoints) {
    state.history.shift();
  }
  
  // Evaluate Zone
  let currentZone = 'safe';
  if (cm <= 6) {
    currentZone = 'danger';
  } else if (cm <= 18) {
    currentZone = 'warning';
  }
  
  // Check zone transition for logging
  if (currentZone !== state.previousZone) {
    handleZoneTransition(state.previousZone, currentZone, cm);
    state.previousZone = currentZone;
  }
  
  updateUI(cm, currentZone);
}

// Handle transition between safe, warning, and danger
function handleZoneTransition(oldZone, newZone, cm) {
  const timestamp = new Date().toLocaleTimeString('th-TH', { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0');
  
  if (newZone === 'danger') {
    state.alertCount++;
    addEventLog({
      time: timestamp,
      status: 'DANGER',
      statusClass: 'danger',
      distance: cm.toFixed(1) + ' cm',
      action: 'ไฟ LED ค้าง & บัซเซอร์ 2700Hz ยาว',
      remarks: 'วัตถุเข้าใกล้ระดับวิกฤต (ระยะ <= 6 cm)'
    });
  } else if (newZone === 'warning') {
    state.alertCount++;
    const interval = mapRange(Math.round(cm), 7, 18, 70, 300);
    addEventLog({
      time: timestamp,
      status: 'WARNING',
      statusClass: 'warning',
      distance: cm.toFixed(1) + ' cm',
      action: `ไฟกระพริบ & บัซเซอร์ถี่ ${interval}ms`,
      remarks: 'ตรวจพบวัตถุในระยะเตือน (7 - 18 cm)'
    });
  } else if (newZone === 'safe' && (oldZone === 'danger' || oldZone === 'warning')) {
    addEventLog({
      time: timestamp,
      status: 'SAFE',
      statusClass: 'safe',
      distance: cm.toFixed(1) + ' cm',
      action: 'ปิดไฟทั้งหมด & หยุดเสียงเตือน',
      remarks: 'วัตถุถอยพ้นระยะอันตราย (> 18 cm)'
    });
  }
}

// Add row to Event Log Table
function addEventLog(item) {
  state.logs.unshift(item);
  if (state.logs.length > 50) state.logs.pop(); // Keep 50 items
  
  // Update Table DOM
  el.logCountBadge.textContent = `${state.logs.length} รายการ`;
  
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><strong>${item.time}</strong></td>
    <td><span class="badge-tag ${item.statusClass}">${item.status}</span></td>
    <td style="font-family: var(--font-mono); font-weight: 700;">${item.distance}</td>
    <td>${item.action}</td>
    <td style="color: var(--text-muted);">${item.remarks}</td>
  `;
  
  // Remove empty row placeholder if present
  const emptyRow = el.eventLogTbody.querySelector('.empty-row');
  if (emptyRow) emptyRow.remove();
  
  el.eventLogTbody.insertBefore(tr, el.eventLogTbody.firstChild);
}

// ==========================================================================
// HARDWARE LOOP ANIMATION (Matching KidBright32 timing)
// ==========================================================================
function updateHardwareSimulation() {
  const cm = state.distance;
  const now = performance.now();
  
  // 1. DANGER ZONE (cm <= 6)
  if (cm <= 6) {
    state.hw.ledWifi = true; // LOW is ON
    state.hw.ledNtp = true;
    state.hw.buzzer = true;
    state.hw.interval = 0;
    
    el.txtLedWifiState.textContent = 'ติดค้าง (LOW)';
    el.txtLedNtpState.textContent = 'ติดค้าง (LOW)';
    el.txtBuzzerState.textContent = 'ดังค้างต่อเนื่อง (2700Hz)';
    el.txtBeepInterval.textContent = 'จังหวะกระพริบ: เสียงค้างยาว';
    
    el.hwLedWifi.classList.add('active');
    el.hwLedWifi.querySelector('.hw-led-bulb').classList.add('active');
    el.hwLedNtp.classList.add('active');
    el.hwLedNtp.querySelector('.hw-led-bulb').classList.add('active');
    
    el.hwBuzzer.classList.add('active', 'active-danger');
    setBuzzerSound(true);
  }
  // 2. WARNING ZONE (7 <= cm <= 18)
  else if (cm <= 18) {
    const interval = mapRange(Math.round(cm), 7, 18, 70, 300);
    state.hw.interval = interval;
    el.txtBeepInterval.textContent = `จังหวะกระพริบ: ${interval} ms`;
    
    if (now - state.hw.lastBlinkTime >= interval) {
      state.hw.lastBlinkTime = now;
      state.hw.blinkState = !state.hw.blinkState;
      
      if (state.hw.blinkState) {
        state.hw.ledWifi = true;
        state.hw.ledNtp = true;
        state.hw.buzzer = true;
        
        el.hwLedWifi.classList.add('active');
        el.hwLedWifi.querySelector('.hw-led-bulb').classList.add('active');
        el.hwLedNtp.classList.add('active');
        el.hwLedNtp.querySelector('.hw-led-bulb').classList.add('active');
        
        el.hwBuzzer.classList.add('active');
        el.hwBuzzer.classList.remove('active-danger');
        
        el.txtLedWifiState.textContent = 'กระพริบ (ON)';
        el.txtLedNtpState.textContent = 'กระพริบ (ON)';
        el.txtBuzzerState.textContent = `ส่งเสียง (${interval}ms)`;
        
        setBuzzerSound(true);
      } else {
        state.hw.ledWifi = false;
        state.hw.ledNtp = false;
        state.hw.buzzer = false;
        
        el.hwLedWifi.classList.remove('active');
        el.hwLedWifi.querySelector('.hw-led-bulb').classList.remove('active');
        el.hwLedNtp.classList.remove('active');
        el.hwLedNtp.querySelector('.hw-led-bulb').classList.remove('active');
        
        el.hwBuzzer.classList.remove('active', 'active-danger');
        
        el.txtLedWifiState.textContent = 'กระพริบ (OFF)';
        el.txtLedNtpState.textContent = 'กระพริบ (OFF)';
        el.txtBuzzerState.textContent = 'หยุดเสียงชั่วขณะ';
        
        setBuzzerSound(false);
      }
    }
  }
  // 3. SAFE ZONE (> 18 cm)
  else {
    state.hw.ledWifi = false;
    state.hw.ledNtp = false;
    state.hw.buzzer = false;
    state.hw.blinkState = false;
    
    el.hwLedWifi.classList.remove('active');
    el.hwLedWifi.querySelector('.hw-led-bulb').classList.remove('active');
    el.hwLedNtp.classList.remove('active');
    el.hwLedNtp.querySelector('.hw-led-bulb').classList.remove('active');
    
    el.hwBuzzer.classList.remove('active', 'active-danger');
    
    el.txtLedWifiState.textContent = 'ดับ (HIGH)';
    el.txtLedNtpState.textContent = 'ดับ (HIGH)';
    el.txtBuzzerState.textContent = 'ปิด (Silent)';
    el.txtBeepInterval.textContent = 'จังหวะกระพริบ: ปิดการทำงาน';
    
    setBuzzerSound(false);
  }
}

// ==========================================================================
// UI UPDATE
// ==========================================================================
function updateUI(cm, zone) {
  // Digital Display
  el.txtDistanceVal.textContent = cm.toFixed(1);
  
  // Badge and Colors
  el.statusBadge.className = `status-indicator-badge pixel-badge ${zone}`;
  el.distanceCard.className = `card pixel-panel metric-card metric-distance state-${zone}`;
  
  if (zone === 'danger') {
    el.statusBadge.textContent = '🔴 วิกฤต (DANGER)';
    el.txtDistanceVal.style.color = 'var(--color-danger)';
    el.txtDistanceVal.style.textShadow = '3px 3px 0 #000, 0 0 20px var(--color-danger-glow)';
    el.txtZoneDescription.innerHTML = '⚠️ <strong>วัตถุประชิดระยะวิกฤต (&le; 6 cm)</strong> ระบบส่งสัญญาณเตือนภัยฉุกเฉินดังค้างยาว';
    el.distanceBarFill.className = 'pixel-bar-fill danger';
  } else if (zone === 'warning') {
    el.statusBadge.textContent = '🟡 เตือนภัย (WARNING)';
    el.txtDistanceVal.style.color = 'var(--color-warning)';
    el.txtDistanceVal.style.textShadow = '3px 3px 0 #000, 0 0 20px var(--color-warning-glow)';
    el.txtZoneDescription.innerHTML = '⚡ <strong>ตรวจพบวัตถุเข้าใกล้ (7 - 18 cm)</strong> ไฟกระพริบและเสียงเตือนตามระยะ';
    el.distanceBarFill.className = 'pixel-bar-fill warning';
  } else {
    el.statusBadge.textContent = '🟢 ปลอดภัย (SAFE)';
    el.txtDistanceVal.style.color = 'var(--color-safe)';
    el.txtDistanceVal.style.textShadow = '3px 3px 0 #000, 0 0 20px var(--color-safe-glow)';
    el.txtZoneDescription.innerHTML = '✅ <strong>ระยะปลอดภัย (> 18 cm)</strong> บอร์ดสแตนด์บาย ไม่มีวัตถุในระยะอันตราย';
    el.distanceBarFill.className = 'pixel-bar-fill safe';
  }
  
  // Progress bar percentage (0 to 60cm mapped to 0-100%)
  const barPercent = Math.min(Math.max((cm / 60) * 100, 4), 100);
  el.distanceBarFill.style.width = `${barPercent}%`;
  
  // Stats Display
  el.statMinDistance.textContent = state.minDistance !== null ? state.minDistance.toFixed(1) : '--';
  el.statMaxDistance.textContent = state.maxDistance !== null ? state.maxDistance.toFixed(1) : '--';
  const avg = state.countReadings > 0 ? (state.sumDistance / state.countReadings).toFixed(1) : '--';
  el.statAvgDistance.textContent = avg;
  el.statAlertCount.textContent = state.alertCount;
  
  el.txtDataRate.textContent = state.currentDataRate.toFixed(1);
  el.txtPacketCount.textContent = state.packetCount;
}

// ==========================================================================
// RADAR CANVAS RENDERING (RETRO PIXEL ARCADE EDITION)
// ==========================================================================
let radarSweepAngle = -Math.PI / 2; // Sweep animation angle
let radarPingPulse = 0;

function drawRadar() {
  const canvas = el.radarCanvas;
  const ctx = radarCtx;
  const w = canvas.width;
  const h = canvas.height;
  
  // Center of the radar is near bottom-center
  const cx = w / 2;
  const cy = h - 45;
  const maxRadius = h - 65; // Max drawing radius corresponds to 60cm
  
  ctx.clearRect(0, 0, w, h);
  
  // Retro phosphor arcade background
  ctx.fillStyle = '#070a12';
  ctx.fillRect(0, 0, w, h);
  
  // Retro pixel grid lines (vertical and horizontal faint lines)
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 20;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  
  // Draw Ultrasonic Cone FOV (HC-SR04 has ~30 degree cone)
  const coneHalfAngle = (30 * Math.PI) / 180; // 30 deg each side
  const startAngle = -Math.PI / 2 - coneHalfAngle;
  const endAngle = -Math.PI / 2 + coneHalfAngle;
  
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, maxRadius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 229, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Concentric Distance Arcs
  const rings = [
    { cm: 6, color: '#ff2a5f', label: '6cm DANGER' },
    { cm: 18, color: '#ffcc00', label: '18cm WARN' },
    { cm: 30, color: 'rgba(255, 255, 255, 0.25)', label: '30cm' },
    { cm: 45, color: 'rgba(255, 255, 255, 0.2)', label: '45cm' },
    { cm: 60, color: 'rgba(0, 229, 255, 0.4)', label: '60cm' },
  ];
  
  rings.forEach(ring => {
    const r = (ring.cm / 60) * maxRadius;
    if (r <= maxRadius) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = (ring.cm === 6 || ring.cm === 18) ? 2 : 1;
      if (ring.cm > 18) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Label in Retro Pixel Font
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = ring.color;
      const labelX = cx + Math.cos(startAngle) * r + 6;
      const labelY = cy + Math.sin(startAngle) * r;
      ctx.fillText(ring.label, labelX, labelY);
    }
  });
  
  // Radar Sweep Line (oscillating within the 60 deg cone)
  radarSweepAngle += 0.035;
  const sweepOsc = Math.sin(radarSweepAngle) * coneHalfAngle;
  const currentSweep = -Math.PI / 2 + sweepOsc;
  
  const sweepX = cx + Math.cos(currentSweep) * maxRadius;
  const sweepY = cy + Math.sin(currentSweep) * maxRadius;
  
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(sweepX, sweepY);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0; // reset
  
  // Draw Detected Target Dot
  const targetCm = Math.min(state.distance, 60);
  const targetR = (targetCm / 60) * maxRadius;
  const targetAngle = -Math.PI / 2; // on center beam
  const targetX = cx + Math.cos(targetAngle) * targetR;
  const targetY = cy + Math.sin(targetAngle) * targetR;
  
  let targetColor = '#00ff88';
  let targetGlow = 'rgba(0, 255, 136, 0.85)';
  if (state.distance <= 6) {
    targetColor = '#ff2a5f';
    targetGlow = 'rgba(255, 42, 95, 0.9)';
  } else if (state.distance <= 18) {
    targetColor = '#ffcc00';
    targetGlow = 'rgba(255, 204, 0, 0.85)';
  }
  
  // Pulsing Retro Square Waves around target
  radarPingPulse = (radarPingPulse + 0.4) % 25;
  const pulseSize = 8 + radarPingPulse;
  ctx.strokeStyle = targetColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = Math.max(0, 1 - (radarPingPulse / 25));
  ctx.strokeRect(targetX - pulseSize, targetY - pulseSize, pulseSize * 2, pulseSize * 2);
  ctx.globalAlpha = 1.0;
  
  // Target Pixel Blip (Square with 3D bevel / crosshair)
  const blipSize = 10;
  ctx.fillStyle = targetColor;
  ctx.shadowColor = targetGlow;
  ctx.shadowBlur = 12;
  ctx.fillRect(targetX - blipSize / 2, targetY - blipSize / 2, blipSize, blipSize);
  ctx.shadowBlur = 0;
  
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(targetX - blipSize / 2, targetY - blipSize / 2, blipSize, blipSize);
  
  // Target distance tag in pixel font
  ctx.font = '9px "Press Start 2P", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 4;
  ctx.fillText(`${state.distance.toFixed(1)} cm`, targetX + 14, targetY + 3);
  ctx.shadowBlur = 0;
  
  // Sensor Origin Emblem (Retro 8-bit Sensor base)
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(cx - 12, cy - 8, 24, 16);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 12, cy - 8, 24, 16);
  
  // Sensor Eyes (HC-SR04 two transducers)
  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(cx - 9, cy - 4, 6, 8);
  ctx.fillRect(cx + 3, cy - 4, 6, 8);
}

// ==========================================================================
// TIMELINE CHART CANVAS RENDERING (RETRO PIXEL ARCADE EDITION)
// ==========================================================================
function drawTimelineChart() {
  const canvas = el.chartCanvas;
  const ctx = chartCtx;
  const w = canvas.width;
  const h = canvas.height;
  
  const padLeft = 60;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 40;
  
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;
  
  ctx.clearRect(0, 0, w, h);
  
  // Background
  ctx.fillStyle = '#070a12';
  ctx.fillRect(0, 0, w, h);
  
  // Y-Scale: 0 to 60 cm (points above 60 clamped visually)
  const maxY = 60;
  
  function getY(cm) {
    const clamped = Math.min(Math.max(cm, 0), maxY);
    return padTop + chartH - (clamped / maxY) * chartH;
  }
  
  // Threshold Zone Bands Background
  // 1. Danger Zone: 0 to 6cm
  const dangerY = getY(6);
  ctx.fillStyle = 'rgba(255, 42, 95, 0.12)';
  ctx.fillRect(padLeft, dangerY, chartW, (padTop + chartH) - dangerY);
  
  // 2. Warning Zone: 6 to 18cm
  const warningY = getY(18);
  ctx.fillStyle = 'rgba(255, 204, 0, 0.08)';
  ctx.fillRect(padLeft, warningY, chartW, dangerY - warningY);
  
  // Grid Lines & Labels
  const gridLevels = [0, 6, 18, 30, 45, 60];
  gridLevels.forEach(lvl => {
    const y = getY(lvl);
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(padLeft + chartW, y);
    
    if (lvl === 6) {
      ctx.strokeStyle = '#ff2a5f';
      ctx.lineWidth = 1.5;
    } else if (lvl === 18) {
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 1.5;
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
    }
    ctx.stroke();
    
    // Y-Axis Labels (Pixel font)
    ctx.font = '8px "Press Start 2P", monospace';
    if (lvl === 6) ctx.fillStyle = '#ff2a5f';
    else if (lvl === 18) ctx.fillStyle = '#ffcc00';
    else ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.fillText(`${lvl}cm`, padLeft - 8, y + 3);
  });
  
  // Draw Data Curve
  const hist = state.history;
  if (hist.length > 1) {
    const stepX = chartW / (state.maxHistoryPoints - 1);
    const startOffset = (state.maxHistoryPoints - hist.length) * stepX;
    
    // Gradient Area under curve
    const areaGrad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    areaGrad.addColorStop(0, 'rgba(0, 229, 255, 0.3)');
    areaGrad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
    
    ctx.beginPath();
    ctx.moveTo(padLeft + startOffset, padTop + chartH);
    
    hist.forEach((pt, idx) => {
      const x = padLeft + startOffset + (idx * stepX);
      const y = getY(pt.distance);
      ctx.lineTo(x, y);
    });
    
    const lastX = padLeft + startOffset + ((hist.length - 1) * stepX);
    ctx.lineTo(lastX, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();
    
    // Line Stroke (Neon Cyan Arcade Line)
    ctx.beginPath();
    hist.forEach((pt, idx) => {
      const x = padLeft + startOffset + (idx * stepX);
      const y = getY(pt.distance);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
    
    // Current latest point dot (Square pixel)
    const latestPt = hist[hist.length - 1];
    const curX = lastX;
    const curY = getY(latestPt.distance);
    
    let dotColor = '#00ff88';
    if (latestPt.distance <= 6) dotColor = '#ff2a5f';
    else if (latestPt.distance <= 18) dotColor = '#ffcc00';
    
    ctx.fillStyle = dotColor;
    ctx.shadowColor = dotColor;
    ctx.shadowBlur = 8;
    ctx.fillRect(curX - 4, curY - 4, 8, 8);
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(curX - 4, curY - 4, 8, 8);
  }
  
  // X-Axis Baseline
  ctx.beginPath();
  ctx.moveTo(padLeft, padTop + chartH);
  ctx.lineTo(padLeft + chartW, padTop + chartH);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Time Labels (Pixel font)
  ctx.font = '8px "Press Start 2P", monospace';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'left';
  ctx.fillText('-30s', padLeft, padTop + chartH + 20);
  ctx.textAlign = 'right';
  ctx.fillText('NOW', padLeft + chartW, padTop + chartH + 20);
}

// Main Animation Loop for Visualizers
function renderVisualizersLoop() {
  drawRadar();
  drawTimelineChart();
  updateHardwareSimulation();
  
  // Handle Auto-walk in Demo mode
  if (state.isDemoMode && state.autoWalk.running) {
    state.autoWalk.current += state.autoWalk.speed * state.autoWalk.direction;
    if (state.autoWalk.current <= 3) {
      state.autoWalk.direction = 1; // Turn around, back off
    } else if (state.autoWalk.current >= 45) {
      state.autoWalk.direction = -1; // Approach again
    }
    
    el.simDistanceSlider.value = state.autoWalk.current.toFixed(1);
    el.simSliderVal.textContent = `${state.autoWalk.current.toFixed(1)} cm`;
    processDistance(state.autoWalk.current);
  }
  
  requestAnimationFrame(renderVisualizersLoop);
}

// ==========================================================================
// WEB SERIAL API CONNECTION
// ==========================================================
async function connectWebSerial() {
  if (!('serial' in navigator)) {
    alert('เว็บบราวเซอร์ของคุณไม่รองรับ Web Serial API\nกรุณาใช้งานบน Google Chrome, Microsoft Edge หรือ Opera เวอร์ชันใหม่ครับ');
    return;
  }
  
  if (state.isConnected) {
    disconnectWebSerial();
    return;
  }
  
  try {
    // Prompt user to pick USB Port (KidBright32 CP210x or CH340)
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 115200 });
    
    state.isConnected = true;
    updateConnectionStatus('connected', 'เชื่อมต่อ KidBright32 แล้ว (115200 baud)');
    el.btnConnectSerialText.textContent = 'ตัดการเชื่อมต่อ USB';
    el.btnConnectSerial.classList.add('connected-btn');
    
    // Disable Demo mode if active
    if (state.isDemoMode) toggleDemoMode(false);
    
    // Start reading stream
    keepReadingSerial = true;
    readSerialStream();
  } catch (err) {
    console.error('Serial Connection Error:', err);
    if (err.name !== 'NotFoundError') {
      alert(`ไม่สามารถเปิดพอร์ต Serial ได้: ${err.message}\n(ตรวจสอบว่าไม่มีโปรแกรมอื่น เช่น Arduino IDE / KidBright IDE กำลังเปิด Serial Monitor อยู่)`);
    }
  }
}

async function disconnectWebSerial() {
  keepReadingSerial = false;
  if (serialReader) {
    try {
      await serialReader.cancel();
    } catch (e) {}
    serialReader = null;
  }
  if (serialPort) {
    try {
      await serialPort.close();
    } catch (e) {}
    serialPort = null;
  }
  state.isConnected = false;
  updateConnectionStatus('disconnected', 'ไม่ได้เชื่อมต่อ');
  el.btnConnectSerialText.textContent = 'เชื่อมต่อ USB (Serial)';
  el.btnConnectSerial.classList.remove('connected-btn');
}

async function readSerialStream() {
  let lineBuffer = '';
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
  serialReader = textDecoder.readable.getReader();
  
  try {
    while (keepReadingSerial) {
      const { value, done } = await serialReader.read();
      if (done) break;
      if (value) {
        lineBuffer += value;
        const lines = lineBuffer.split(/\r?\n/);
        lineBuffer = lines.pop(); // Keep uncompleted tail in buffer
        
        for (const line of lines) {
          parseSerialLine(line.trim());
        }
      }
    }
  } catch (err) {
    console.error('Serial Read Loop Error:', err);
  } finally {
    serialReader.releaseLock();
  }
}

// Parses: "Distance: 12 cm" or "12" or "Distance: 12.5 cm"
function parseSerialLine(line) {
  if (!line) return;
  
  // Format from user's Arduino code: Serial.print("Distance: "); Serial.print(cm); Serial.println(" cm");
  const match = line.match(/Distance:\s*([0-9.]+)\s*cm/i) || line.match(/([0-9.]+)/);
  if (match && match[1]) {
    const cm = parseFloat(match[1]);
    if (!isNaN(cm)) {
      processDistance(cm);
    }
  }
}

function updateConnectionStatus(statusClass, text) {
  el.connectionPill.className = `status-pill ${statusClass}`;
  el.connectionStatusText.textContent = text;
}

// ==========================================================================
// DEMO / SIMULATION MODE
// ==========================================================================
function toggleDemoMode(forceState) {
  state.isDemoMode = forceState !== undefined ? forceState : !state.isDemoMode;
  
  if (state.isDemoMode) {
    if (state.isConnected) disconnectWebSerial();
    el.btnToggleDemo.classList.add('active');
    el.simulationDock.classList.remove('hidden');
    updateConnectionStatus('simulating', 'กำลังใช้งานโหมดจำลอง (DEMO)');
    // Initial process
    processDistance(parseFloat(el.simDistanceSlider.value));
  } else {
    el.btnToggleDemo.classList.remove('active');
    el.simulationDock.classList.add('hidden');
    state.autoWalk.running = false;
    el.btnSimAutoWalk.classList.remove('running');
    el.btnSimAutoWalk.textContent = 'เริ่มเดินหน้า-ถอยหลังอัตโนมัติ';
    updateConnectionStatus('disconnected', 'ไม่ได้เชื่อมต่อ');
  }
}

// ==========================================================================
// CSV EXPORT
// ==========================================================================
function exportLogsCSV() {
  if (state.logs.length === 0) {
    alert('ยังไม่มีบันทึกข้อมูลสำหรับส่งออก');
    return;
  }
  
  let csv = '\uFEFF'; // UTF-8 BOM for Excel support with Thai
  csv += 'เวลา (Timestamp),สถานะ (Status),ระยะทาง (Distance),การทำงานอุปกรณ์ (Action),หมายเหตุ (Remarks)\n';
  
  state.logs.forEach(row => {
    const cleanAction = `"${row.action.replace(/"/g, '""')}"`;
    const cleanRemarks = `"${row.remarks.replace(/"/g, '""')}"`;
    csv += `${row.time},${row.status},${row.distance},${cleanAction},${cleanRemarks}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KidBright_Proximity_Logs_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================================================
// EVENT LISTENERS & SETUP
// ==========================================================================
function initEvents() {
  // Connect Web Serial
  el.btnConnectSerial.addEventListener('click', () => {
    initAudio(); // User gesture initializes Web Audio Context
    connectWebSerial();
  });
  
  // Toggle Demo
  el.btnToggleDemo.addEventListener('click', () => {
    initAudio();
    toggleDemoMode();
  });
  
  // Audio Toggle
  el.btnToggleAudio.addEventListener('click', () => {
    initAudio();
    state.isAudioMuted = !state.isAudioMuted;
    if (state.isAudioMuted) {
      el.iconAudioOn.style.display = 'none';
      el.iconAudioOff.style.display = 'block';
      el.btnToggleAudio.classList.add('muted');
      el.btnToggleAudio.title = 'เปิดเสียงลำโพงจำลอง Buzzer';
      setBuzzerSound(false);
    } else {
      el.iconAudioOn.style.display = 'block';
      el.iconAudioOff.style.display = 'none';
      el.btnToggleAudio.classList.remove('muted');
      el.btnToggleAudio.title = 'ปิดเสียงลำโพง (Mute)';
    }
  });
  
  // Simulation Slider
  el.simDistanceSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    el.simSliderVal.textContent = `${val.toFixed(1)} cm`;
    state.autoWalk.current = val;
    processDistance(val);
  });
  
  // Simulation Preset Buttons
  el.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-val'));
      el.simDistanceSlider.value = val;
      el.simSliderVal.textContent = `${val.toFixed(1)} cm`;
      state.autoWalk.current = val;
      processDistance(val);
    });
  });
  
  // Auto-walk Simulation toggle
  el.btnSimAutoWalk.addEventListener('click', () => {
    state.autoWalk.running = !state.autoWalk.running;
    if (state.autoWalk.running) {
      el.btnSimAutoWalk.classList.add('running');
      el.btnSimAutoWalk.textContent = 'หยุดเดินหน้า-ถอยหลัง';
    } else {
      el.btnSimAutoWalk.classList.remove('running');
      el.btnSimAutoWalk.textContent = 'เริ่มเดินหน้า-ถอยหลังอัตโนมัติ';
    }
  });
  
  // Reset Stats
  el.btnResetStats.addEventListener('click', () => {
    state.minDistance = state.distance;
    state.maxDistance = state.distance;
    state.sumDistance = state.distance;
    state.countReadings = 1;
    state.alertCount = 0;
    updateUI(state.distance, state.previousZone);
  });
  
  // Export CSV
  el.btnExportCSV.addEventListener('click', exportLogsCSV);
  
  // Clear Logs
  el.btnClearLogs.addEventListener('click', () => {
    state.logs = [];
    el.logCountBadge.textContent = '0 รายการ';
    el.eventLogTbody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">ยังไม่มีรายการแจ้งเตือน (รอการตรวจจับวัตถุในระยะ &le; 18 cm)</td>
      </tr>
    `;
  });
  
  // Circuit Pinout Modal
  el.btnOpenPinout.addEventListener('click', () => {
    el.pinoutModal.classList.remove('hidden');
  });
  el.btnCloseModal.addEventListener('click', () => {
    el.pinoutModal.classList.add('hidden');
  });
  el.pinoutModal.addEventListener('click', (e) => {
    if (e.target === el.pinoutModal) {
      el.pinoutModal.classList.add('hidden');
    }
  });
  
  // Project Manual Toggle & Collapse
  if (el.btnCollapseManual && el.manualContent) {
    el.btnCollapseManual.addEventListener('click', () => {
      el.manualContent.classList.toggle('collapsed');
      if (el.manualContent.classList.contains('collapsed')) {
        el.btnCollapseManual.textContent = '[ แสดงคู่มือ ]';
      } else {
        el.btnCollapseManual.textContent = '[ ซ่อนคู่มือ ]';
      }
    });
  }

  if (el.btnToggleManual && el.manualContent) {
    el.btnToggleManual.addEventListener('click', () => {
      el.manualContent.classList.remove('collapsed');
      if (el.btnCollapseManual) el.btnCollapseManual.textContent = '[ ซ่อนคู่มือ ]';
      if (el.projectManualCard) {
        el.projectManualCard.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Adjust Canvas Resolution on Window Resize
  window.addEventListener('resize', handleResize);
  handleResize();
}

function handleResize() {
  const radarParent = el.radarCanvas.parentElement;
  if (radarParent) {
    el.radarCanvas.width = radarParent.clientWidth;
    el.radarCanvas.height = radarParent.clientHeight;
  }
  const chartParent = el.chartCanvas.parentElement;
  if (chartParent) {
    el.chartCanvas.width = chartParent.clientWidth;
    el.chartCanvas.height = chartParent.clientHeight;
  }
}

// Initial bootstrap
window.addEventListener('DOMContentLoaded', () => {
  initEvents();
  // Prepopulate timeline with initial safe distance
  for (let i = 0; i < 30; i++) {
    state.history.push({ time: Date.now() - (30 - i) * 1000, distance: 35 });
  }
  processDistance(35); // Initial safe state
  requestAnimationFrame(renderVisualizersLoop);
});
