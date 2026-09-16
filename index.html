<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ระบบตรวจจับวัตถุเมื่อเข้าใกล้ Ultrasonic Proximity Detection System | KidBright32 Pixel Radar</title>
  <meta name="description" content="ระบบตรวจจับวัตถุเมื่อเข้าใกล้ Ultrasonic Proximity Detection System บนบอร์ด KidBright32 และเซนเซอร์ HC-SR04 หน้าจอแดชบอร์ดเรดาร์สไตล์เกมพิกเซลเรโทร">
  
  <!-- Google Fonts: Press Start 2P (8-Bit Arcade), Chakra Petch (Pixel/Cyber Thai & Eng), Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Press+Start+2P&family=Prompt:wght@300;400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="style.css">
</head>
<body class="pixel-theme">
  <!-- Retro CRT Scanline & Pixel Grid Ambient FX -->
  <div class="crt-scanlines"></div>
  <div class="pixel-vignette"></div>
  <div class="app-container">
    <!-- TOP NAVIGATION & RETRO ARCADE HEADER -->
    <header class="app-header pixel-panel">
      <div class="header-branding">
        <div class="brand-badge pixel-box">
          <span class="pixel-icon">📡</span>
          <span class="brand-label">KIDBRIGHT32 & HC-SR04</span>
        </div>
        <div class="brand-titles">
          <div class="project-tag pixel-tag">ARCADE HUD v2.0 • REAL-TIME IoT</div>
          <h1 class="main-title">ระบบตรวจจับวัตถุเมื่อเข้าใกล้</h1>
          <p class="sub-title">Ultrasonic Proximity Detection System & Telemetry Dashboard</p>
        </div>
      </div>
      <!-- Action buttons & Connection status -->
      <div class="header-actions">
        <!-- Live Connection Status Pill -->
        <div id="connectionPill" class="status-pill disconnected pixel-button-frame">
          <span class="status-dot pixel-dot"></span>
          <span id="connectionStatusText">ไม่ได้เชื่อมต่อ (OFFLINE)</span>
        </div>
        <!-- Web Serial Connect Button -->
        <button id="btnConnectSerial" class="btn btn-pixel btn-primary" title="เชื่อมต่อบอร์ด KidBright32 ผ่านสาย USB (Web Serial)">
          <span class="btn-pixel-icon">🔌</span>
          <span id="btnConnectSerialText">เชื่อมต่อ USB (Serial)</span>
        </button>
        <!-- Demo Mode Toggle Button -->
        <button id="btnToggleDemo" class="btn btn-pixel btn-secondary" title="เปิดโหมดจำลองระยะสำหรับทดสอบโดยไม่ต้องใช้บอร์ด">
          <span class="btn-pixel-icon">🎮</span>
          <span>โหมดจำลอง (Demo)</span>
        </button>
        <!-- Audio Sound Toggle -->
        <button id="btnToggleAudio" class="btn btn-pixel btn-icon-only" title="เปิด/ปิดเสียงลำโพงจำลอง Buzzer (2,700Hz)">
          <svg id="iconAudioOn" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="11 5 6 9 2 9 2 15 6 11 19 11 5" fill="currentColor"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <svg id="iconAudioOff" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:none;">
            <polygon points="11 5 6 9 2 9 2 15 6 11 19 11 5" fill="currentColor"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        </button>
        <!-- Hardware Pinout Info Button -->
        <button id="btnOpenPinout" class="btn btn-pixel btn-icon-only" title="ดูผังการต่อวงจรและขาพิน KidBright32 + HC-SR04">
          <span class="btn-pixel-icon">⚙️</span>
        </button>
        <!-- Toggle Info Panel Button -->
        <button id="btnToggleManual" class="btn btn-pixel btn-icon-only info-toggle" title="ดูคำอธิบายระบบและคู่มือโครงงานภาษาไทย">
          <span class="btn-pixel-icon">📖</span>
        </button>
      </div>
    </header>
    <!-- PROJECT EXPLANATION & QUEST MANUAL (THAI) -->
    <section id="projectManualCard" class="card pixel-panel project-manual-card">
      <div class="manual-header">
        <div class="manual-header-title">
          <span class="pixel-star">★</span>
          <span class="manual-heading">คู่มือระบบ & คำอธิบายโครงงาน (SYSTEM MANUAL)</span>
          <span class="pixel-pill">ภาษาไทย</span>
        </div>
        <button id="btnCollapseManual" class="btn-pixel-text" title="ย่อ/ขยายคำอธิบาย">[ ซ่อน/แสดง ]</button>
      </div>
      <div id="manualContent" class="manual-content">
        <!-- Banner Intro -->
        <div class="manual-intro-box pixel-box-inset">
          <div class="intro-headline">
            <strong>ชื่อโครงงาน:</strong> ระบบตรวจจับวัตถุเมื่อเข้าใกล้ (Ultrasonic Proximity Detection System)
          </div>
          <p class="intro-desc">
            โครงงานนี้ใช้ไมโครคอนโทรลเลอร์ <strong>KidBright32 (ESP32)</strong> เชื่อมต่อกับเซนเซอร์วัดระยะทางคลื่นเสียงอัลตราโซนิก 
            <strong>HC-SR04</strong> (Trig พิน 18, Echo พิน 19) เพื่อตรวจจับสิ่งกีดขวางหรือวัตถุที่เคลื่อนที่เข้ามาใกล้ในแบบเรียลไทม์ 
            พร้อมแจ้งเตือนผ่านหลอดไฟ LED WIFI และลำโพง Buzzer ความถี่ 2,700 Hz บนบอร์ด และส่งข้อมูลระยะทาง (cm) มาแสดงผลบนหน้าจอเว็บผ่าน <strong>Web Serial API</strong>
          </p>
        </div>
        <!-- 3 Security Zones Explanation Grid -->
        <div class="manual-zones-grid">
          <!-- Zone 1: Safe -->
          <div class="zone-info-card safe-border">
            <div class="zone-badge-tag safe-tag">
              <span class="dot-px"></span>
              <span>1. ระยะปลอดภัย (SAFE)</span>
            </div>
            <div class="zone-range-title">&gt; 18 เซนติเมตร</div>
            <p class="zone-detail">
              วัตถุอยู่นอกระยะอันตราย ไม่พบสิ่งกีดขวางในระยะใกล้ บอร์ดอยู่ในสถานะสแตนด์บาย 
              หลอดไฟ LED ดับ และไม่มีเสียง Buzzer รบกวน
            </p>
            <div class="zone-action-pill">สถานะ: ปลอดภัยปกติ (NORMAL)</div>
          </div>
          <!-- Zone 2: Warning -->
          <div class="zone-info-card warning-border">
            <div class="zone-badge-tag warning-tag">
              <span class="dot-px"></span>
              <span>2. ระยะเตือนภัย (WARNING)</span>
            </div>
            <div class="zone-range-title">7 - 18 เซนติเมตร</div>
            <p class="zone-detail">
              ตรวจพบวัตถุเริ่มเคลื่อนเข้าใกล้ระยะเตือน หลอดไฟ LED WIFI และเสียงลำโพง Buzzer จะกระพริบเป็นจังหวะ 
              ยิ่งวัตถุเข้าใกล้มาก จังหวะจะยิ่งถี่ขึ้นตามสมการคำนวณ <code>map(cm, 7, 18, 70, 300) ms</code>
            </p>
            <div class="zone-action-pill">สถานะ: เสียงและไฟกระพริบตามระยะ</div>
          </div>
          <!-- Zone 3: Danger -->
          <div class="zone-info-card danger-border">
            <div class="zone-badge-tag danger-tag">
              <span class="dot-px"></span>
              <span>3. ระยะวิกฤต (DANGER)</span>
            </div>
            <div class="zone-range-title">&le; 6 เซนติเมตร</div>
            <p class="zone-detail">
              วัตถุเข้าใกล้ชิดจนเสี่ยงเกิดการชน/สัมผัส ระบบส่งเสียงสัญญาณ Buzzer 2,700Hz ดังค้างต่อเนื่องตลอดเวลา 
              และเปิดหลอดไฟ LED WIFI (พิน 2) สว่างค้างจนกว่าวัตถุจะถอยออกไป
            </p>
            <div class="zone-action-pill">สถานะ: ร้องเตือนค้าง + ไฟติดค้าง!</div>
          </div>
        </div>
        <!-- System Features & Quick Tips -->
        <div class="manual-quick-guide">
          <div class="guide-item">
            <span class="guide-icon">🕹️</span>
            <div>
              <strong>วิธีทดสอบหน้าเว็บโดยไม่มีบอร์ด:</strong>
              <span>กดปุ่ม <code>โหมดจำลอง (Demo)</code> ด้านบนสุด เพื่อเปิดแถบสไลเดอร์ ปรับระยะ 4cm, 12cm, 35cm หรือกดเริ่มเดินหน้า-ถอยหลังอัตโนมัติได้ทันที</span>
            </div>
          </div>
          <div class="guide-item">
            <span class="guide-icon">🔊</span>
            <div>
              <strong>การเปิดเสียงลำโพง Buzzer บนเว็บ:</strong>
              <span>คลิกปุ่มรูปลำโพง เพื่อเปิดเสียงสัญญาณจำลองความถี่ 2,700Hz ที่ทำงานตรงตามจังหวะจริงของ KidBright32</span>
            </div>
          </div>
          <div class="guide-item">
            <span class="guide-icon">💾</span>
            <div>
              <strong>การบันทึกข้อมูล (Telemetry Log):</strong>
              <span>ทุกครั้งที่วัตถุเข้าสู่ระยะเตือน (&le; 18 cm) ระบบจะบันทึกประวัติลงตารางอัตโนมัติ สามารถกดปุ่ม <code>ส่งออก CSV</code> เพื่อนำไปเปิดใน Excel ได้</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- SIMULATION DOCK (Visible when Demo mode is ON) -->
    <div id="simulationDock" class="simulation-dock pixel-panel hidden">
      <div class="sim-header">
        <div class="sim-title">
          <span class="sim-badge pixel-badge">🎮 DEMO SIMULATION</span>
          <span class="sim-desc-text">แถบควบคุมระยะจำลอง (ทดสอบหน้าเว็บเสมือนจริงโดยไม่ต้องเสียบบอร์ด)</span>
        </div>
        <div class="sim-presets">
          <button class="preset-btn pixel-btn-small" data-val="4">🔴 วิกฤต (4 cm)</button>
          <button class="preset-btn pixel-btn-small" data-val="12">🟡 เตือน (12 cm)</button>
          <button class="preset-btn pixel-btn-small" data-val="35">🟢 ปลอดภัย (35 cm)</button>
          <button id="btnSimAutoWalk" class="preset-btn pixel-btn-small accent">⚡ เริ่มเดินหน้า-ถอยหลังอัตโนมัติ</button>
        </div>
      </div>
      <div class="sim-slider-wrap">
        <label for="simDistanceSlider" class="sim-label">ปรับระยะจำลอง:</label>
        <div class="slider-track-wrap">
          <input type="range" id="simDistanceSlider" min="2" max="100" value="30" step="0.5">
        </div>
        <span id="simSliderVal" class="sim-slider-val pixel-font">30.0 cm</span>
      </div>
    </div>
    <!-- MAIN DASHBOARD CONTENT -->
    <main class="dashboard-grid">
      <!-- ROW 1: PRIMARY METRIC CARDS -->
      <section class="metrics-row">
        <!-- CARD 1: CURRENT DISTANCE & STATUS -->
        <div class="card pixel-panel metric-card metric-distance" id="distanceCard">
          <div class="card-header">
            <div class="header-with-badge">
              <span class="pixel-corner-deco"></span>
              <span class="card-title">ระยะห่างปัจจุบัน (CURRENT DISTANCE)</span>
            </div>
            <span id="statusBadge" class="status-indicator-badge pixel-badge safe">🟢 ปลอดภัย</span>
          </div>
          <div class="distance-display-wrap">
            <div class="distance-digital">
              <span id="txtDistanceVal" class="distance-value pixel-font">--</span>
              <span class="distance-unit pixel-font">CM</span>
            </div>
            <div class="distance-sub">
              <span class="sub-arrow">▶</span>
              <span id="txtZoneDescription">พร้อมรับข้อมูลจาก Ultrasonic HC-SR04...</span>
            </div>
          </div>
          
          <!-- Pixel Health / Distance Bar -->
          <div class="pixel-bar-container">
            <div class="pixel-bar-border">
              <div id="distanceBarFill" class="pixel-bar-fill safe" style="width: 50%;"></div>
            </div>
            <div class="zone-markers pixel-font">
              <span class="marker danger-mark" style="left: 6%;">▲ 6cm (วิกฤต)</span>
              <span class="marker warning-mark" style="left: 18%;">▲ 18cm (เตือน)</span>
              <span class="marker safe-mark" style="left: 70%;">► ปลอดภัย</span>
            </div>
          </div>
        </div>
        <!-- CARD 2: KIDBRIGHT HARDWARE SIMULATION -->
        <div class="card pixel-panel metric-card">
          <div class="card-header">
            <div class="header-with-badge">
              <span class="pixel-corner-deco"></span>
              <span class="card-title">สถานะฮาร์ดแวร์ KIDBRIGHT32</span>
            </div>
            <span class="hardware-chip pixel-chip">ESP32 CORE</span>
          </div>
          <div class="hardware-status-grid hw-two-items">
            <!-- LED WIFI (Pin 2) -->
            <div class="hw-item pixel-hw-box" id="hwLedWifi">
              <div class="hw-led-bulb pixel-bulb blue"></div>
              <div class="hw-details">
                <span class="hw-label">LED WIFI (พิน 2)</span>
                <span class="hw-state pixel-font" id="txtLedWifiState">ดับ (HIGH)</span>
              </div>
            </div>
            <!-- BUZZER (Pin 13) -->
            <div class="hw-item pixel-hw-box" id="hwBuzzer">
              <div class="hw-buzzer-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <path class="buzzer-wave wave-1" d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path class="buzzer-wave wave-2" d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              </div>
              <div class="hw-details">
                <span class="hw-label">BUZZER ลำโพง (พิน 13)</span>
                <span class="hw-state pixel-font" id="txtBuzzerState">ปิด (Silent)</span>
              </div>
            </div>
          </div>
          <div class="frequency-indicator pixel-font">
            <span>ความถี่: <strong>2,700 Hz</strong></span>
            <span id="txtBeepInterval">จังหวะ: --</span>
          </div>
        </div>
        <!-- CARD 3: SESSION TELEMETRY STATS -->
        <div class="card pixel-panel metric-card">
          <div class="card-header">
            <div class="header-with-badge">
              <span class="pixel-corner-deco"></span>
              <span class="card-title">สถิติการตรวจวัด (SESSION STATS)</span>
            </div>
            <button id="btnResetStats" class="btn-micro pixel-btn-small" title="รีเซ็ตสถิติรอบนี้">↺ รีเซ็ต</button>
          </div>
          <div class="stats-summary-grid">
            <div class="stat-box pixel-stat-box">
              <span class="stat-label">ระยะใกล้สุด</span>
              <span id="statMinDistance" class="stat-number pixel-font">--</span>
              <span class="stat-unit pixel-font">CM</span>
            </div>
            <div class="stat-box pixel-stat-box">
              <span class="stat-label">ระยะเฉลี่ย</span>
              <span id="statAvgDistance" class="stat-number pixel-font">--</span>
              <span class="stat-unit pixel-font">CM</span>
            </div>
            <div class="stat-box pixel-stat-box">
              <span class="stat-label">ระยะไกลสุด</span>
              <span id="statMaxDistance" class="stat-number pixel-font">--</span>
              <span class="stat-unit pixel-font">CM</span>
            </div>
            <div class="stat-box pixel-stat-box">
              <span class="stat-label">จำนวนแจ้งเตือน</span>
              <span id="statAlertCount" class="stat-number highlight-warn pixel-font">0</span>
              <span class="stat-unit pixel-font">ครั้ง</span>
            </div>
          </div>
          <div class="data-rate-footer pixel-font">
            <span>อัตราการอ่าน: <span id="txtDataRate">0</span> Hz</span>
            <span>แพ็กเก็ต: <span id="txtPacketCount">0</span></span>
          </div>
        </div>
      </section>
      <!-- ROW 2: RADAR VISUALIZER & LIVE TIMELINE CHART -->
      <section class="visualizers-row">
        <!-- RADAR VISUALIZER -->
        <div class="card pixel-panel visualizer-card">
          <div class="card-header">
            <div class="header-with-badge">
              <span class="pixel-corner-deco"></span>
              <span class="card-title">เรดาร์อัลตราโซนิก (ULTRASONIC SCANNER)</span>
              <span class="tech-tag pixel-tag">HC-SR04 CONE FOV</span>
            </div>
            <div class="radar-legend pixel-font">
              <span class="legend-dot danger"></span>วิกฤต (&le;6cm)
              <span class="legend-dot warning"></span>เตือน (7-18cm)
              <span class="legend-dot safe"></span>ปลอดภัย (&gt;18cm)
            </div>
          </div>
          <div class="canvas-container radar-container pixel-canvas-frame">
            <canvas id="radarCanvas" width="500" height="420"></canvas>
            <div class="radar-center-sensor">
              <div class="sensor-badge pixel-chip">HC-SR04 SENSOR (TRIG:18, ECHO:19)</div>
            </div>
          </div>
        </div>
        <!-- REAL-TIME TIMELINE CHART -->
        <div class="card pixel-panel visualizer-card">
          <div class="card-header">
            <div class="header-with-badge">
              <span class="pixel-corner-deco"></span>
              <span class="card-title">กราฟแสดงระยะทางย้อนหลัง (DISTANCE TIMELINE)</span>
              <span class="tech-tag pixel-tag">REAL-TIME TELEMETRY</span>
            </div>
            <div class="chart-controls pixel-font">
              <span class="chart-time-range">30 วินาทีล่าสุด</span>
            </div>
          </div>
          <div class="canvas-container chart-container pixel-canvas-frame">
            <canvas id="chartCanvas" width="600" height="420"></canvas>
          </div>
        </div>
      </section>
      <!-- ROW 3: EVENT LOG & HISTORY TABLE -->
      <section class="events-row">
        <div class="card pixel-panel">
          <div class="card-header">
            <div class="header-with-badge">
              <span class="pixel-corner-deco"></span>
              <span class="card-title">บันทึกเหตุการณ์การตรวจจับ (PROXIMITY EVENT LOG)</span>
              <span id="logCountBadge" class="count-badge pixel-tag">0 รายการ</span>
            </div>
            <div class="log-actions">
              <button id="btnExportCSV" class="btn btn-pixel btn-secondary btn-sm" title="บันทึกประวัติเป็นไฟล์ CSV สำหรับเปิดใน Excel">
                <span class="btn-pixel-icon">💾</span>
                <span>ส่งออก CSV</span>
              </button>
              <button id="btnClearLogs" class="btn btn-pixel btn-secondary btn-sm" title="ล้างรายการทั้งหมด">
                <span class="btn-pixel-icon">🗑️</span>
                <span>ล้างประวัติ</span>
              </button>
            </div>
          </div>
          <!-- Event Log Table -->
          <div class="table-responsive pixel-table-wrap">
            <table class="event-table">
              <thead>
                <tr>
                  <th style="width: 180px;">เวลา (TIMESTAMP)</th>
                  <th style="width: 140px;">สถานะ (STATUS)</th>
                  <th style="width: 140px;">ระยะทาง (DISTANCE)</th>
                  <th style="width: 200px;">การทำงานของอุปกรณ์ (ACTION)</th>
                  <th>รายละเอียดเพิ่มเติม (REMARKS)</th>
                </tr>
              </thead>
              <tbody id="eventLogTbody">
                <tr class="empty-row">
                  <td colspan="5">ยังไม่มีรายการแจ้งเตือน (รอการตรวจจับวัตถุในระยะ &le; 18 cm)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
    <!-- FOOTER -->
    <footer class="app-footer pixel-panel">
      <div class="footer-info">
        <span class="footer-title">ระบบตรวจจับวัตถุเมื่อเข้าใกล้ (Ultrasonic Proximity Detection System)</span>
        <span>&bull;</span>
        <span>KidBright32 (ESP32)</span>
        <span>&bull;</span>
        <span>HC-SR04 (Trig: 18, Echo: 19)</span>
        <span>&bull;</span>
        <span>Buzzer: 13 | LED_WIFI: 2</span>
      </div>
      <div class="footer-links">
        <span class="baud-note pixel-font">Baudrate: 115,200 bps &bull; Web Serial API &bull; 8-Bit Edition</span>
      </div>
    </footer>
  </div>
  <!-- HARDWARE PINOUT MODAL (RETRO RPG DIALOG STYLE) -->
  <div id="pinoutModal" class="modal-overlay hidden">
    <div class="modal-card pixel-panel modal-pixel">
      <div class="modal-header">
        <div class="header-with-badge">
          <span class="pixel-icon">⚙️</span>
          <h3>ผังการต่อวงจร (KidBright32 + HC-SR04)</h3>
        </div>
        <button id="btnCloseModal" class="btn-close pixel-btn-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="circuit-grid">
          <div class="circuit-table-wrap">
            <h4 class="pixel-section-head">ตารางการเชื่อมต่อสายไฟ (PIN CONNECTIONS)</h4>
            <table class="circuit-table pixel-table">
              <thead>
                <tr>
                  <th>อุปกรณ์</th>
                  <th>ขาเซนเซอร์ / บอร์ด</th>
                  <th>การต่อใช้งานบน KidBright</th>
                  <th>หน้าที่ / หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HC-SR04</td>
                  <td><strong>VCC</strong></td>
                  <td><span class="pin-badge pwr pixel-tag">5V / VDD</span></td>
                  <td>ไฟเลี้ยงเซนเซอร์อัลตราโซนิก</td>
                </tr>
                <tr>
                  <td>HC-SR04</td>
                  <td><strong>GND</strong></td>
                  <td><span class="pin-badge gnd pixel-tag">GND</span></td>
                  <td>กราวด์ของวงจร</td>
                </tr>
                <tr>
                  <td>HC-SR04</td>
                  <td><strong>TRIG</strong></td>
                  <td><span class="pin-badge io pixel-tag">พิน 18 (GPIO18)</span></td>
                  <td>ส่งพัลส์เสียงอัลตราโซนิก 40kHz</td>
                </tr>
                <tr>
                  <td>HC-SR04</td>
                  <td><strong>ECHO</strong></td>
                  <td><span class="pin-badge io pixel-tag">พิน 19 (GPIO19)</span></td>
                  <td>รับสัญญาณสะท้อนกลับเพื่อวัดเวลา</td>
                </tr>
                <tr>
                  <td>บนบอร์ด</td>
                  <td><strong>BUZZER</strong></td>
                  <td><span class="pin-badge board pixel-tag">พิน 13 (BUZZER_PIN)</span></td>
                  <td>ลำโพงบนบอร์ด (ส่งเสียงปี๊บ 2,700Hz)</td>
                </tr>
                <tr>
                  <td>บนบอร์ด</td>
                  <td><strong>LED WIFI</strong></td>
                  <td><span class="pin-badge board pixel-tag">พิน 2 (Active LOW)</span></td>
                  <td>หลอด LED สีน้ำเงินบนบอร์ด</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="connection-steps-wrap">
            <h4 class="pixel-section-head">ขั้นตอนเชื่อมต่อกับบอร์ด KidBright32 แสดงผลสด</h4>
            <div class="steps-grid">
              <div class="step-card pixel-hw-box">
                <span class="step-num pixel-font">1</span>
                <div class="step-text">
                  <strong>เสียบสาย USB</strong>
                  <p>ต่อสาย USB จากบอร์ด KidBright32 เข้ากับคอมพิวเตอร์</p>
                </div>
              </div>
              <div class="step-card pixel-hw-box">
                <span class="step-num pixel-font">2</span>
                <div class="step-text">
                  <strong>ปิด Serial Monitor อื่น</strong>
                  <p>หากเปิด Arduino IDE / KidBright IDE ให้ปิดหน้าต่าง Serial Monitor ก่อน</p>
                </div>
              </div>
              <div class="step-card pixel-hw-box">
                <span class="step-num pixel-font">3</span>
                <div class="step-text">
                  <strong>กดปุ่ม "เชื่อมต่อ USB"</strong>
                  <p>คลิกปุ่มเชื่อมต่อแถบด้านบนของเว็บ (รองรับ Chrome และ Edge)</p>
                </div>
              </div>
              <div class="step-card pixel-hw-box">
                <span class="step-num pixel-font">4</span>
                <div class="step-text">
                  <strong>เลือกพอร์ต COM</strong>
                  <p>เลือกอุปกรณ์ เช่น <em>Silicon Labs CP210x</em> หรือ <em>CH340</em> แล้วกด Connect</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="logic-info-wrap">
            <h4 class="pixel-section-head">ตรรกะการทำงาน (FIRMWARE LOGIC)</h4>
            <div class="logic-item danger pixel-box-inset">
              <strong>🔴 ระยะวิกฤต (&le; 6 cm):</strong>
              <p>เสียงปี๊บค้างยาว 2700Hz ต่อเนื่อง, หลอดไฟ LED WIFI ติดสว่างค้าง (ส่งสัญญาณ LOW)</p>
            </div>
            <div class="logic-item warning pixel-box-inset">
              <strong>🟡 ระยะเตือน (7 - 18 cm):</strong>
              <p>ไฟและเสียงเตือนกระพริบเป็นจังหวะ ยิ่งวัตถุเข้าใกล้มาก จังหวะจะยิ่งถี่ขึ้นตามค่า <code>map(cm, 7, 18, 70, 300) ms</code></p>
            </div>
            <div class="logic-item safe pixel-box-inset">
              <strong>🟢 ระยะปลอดภัย (&gt; 18 cm):</strong>
              <p>ปิดหลอดไฟทั้งหมด (ส่งสัญญาณ HIGH) และปิดเสียง Buzzer ทันที</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>
