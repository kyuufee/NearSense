# 📡 ระบบตรวจจับวัตถุเมื่อเข้าใกล้ (Ultrasonic Proximity Detection System)
### KidBright32 (ESP32) & Ultrasonic Sensor HC-SR04 • 8-Bit Retro Arcade Radar HUD

[![KidBright32](https://img.shields.io/badge/Hardware-KidBright32%20(ESP32)-blue.svg)](https://www.kid-bright.org/)
[![Sensor](https://img.shields.io/badge/Sensor-Ultrasonic%20HC--SR04-00e5ff.svg)]()
[![Web Serial API](https://img.shields.io/badge/API-Web%20Serial-green.svg)]()
[![Theme](https://img.shields.io/badge/Theme-8--Bit%20Pixel%20Game-ff0055.svg)]()

---

## 🕹️ ภาพรวมโครงงาน (Project Overview)

โครงงานนี้พัฒนาขึ้นเพื่อตรวจจับระยะห่างของวัตถุหรือสิ่งกีดขวางที่เคลื่อนที่เข้ามาใกล้ในแบบเรียลไทม์ โดยใช้ไมโครคอนโทรลเลอร์ **KidBright32 (ESP32)** ร่วมกับเซนเซอร์ **Ultrasonic HC-SR04** ส่งคลื่นเสียงความถี่ 40kHz เพื่อวัดระยะเวลาเดินทางไป-กลับ และคำนวณเป็นระยะทาง (เซนติเมตร)

หน้าจอแสดงผลถูกออกแบบในสไตล์ **เกมพิกเซลเรโทร (Pixel Game / 16-Bit Retro Arcade HUD)** เชื่อมต่อข้อมูลสดจากบอร์ด KidBright32 ผ่านสาย USB ด้วย **Web Serial API** พร้อมโหมดจำลอง (Demo Simulation) และเสียงลำโพง Buzzer จำลองความถี่ 2,700Hz

---

## 🚨 เงื่อนไขการตรวจจับ 3 ระดับ (Detection Zones)

| ระดับความเสี่ยง | ช่วงระยะทาง | การทำงานของหลอดไฟ LED | การทำงานของลำโพง Buzzer (2,700Hz) |
| :--- | :--- | :--- | :--- |
| 🟢 **1. ระยะปลอดภัย (SAFE)** | **> 18 cm** | ดับทั้งหมด (ส่งสถานะ HIGH) | เงียบ / ปิดเสียง |
| 🟡 **2. ระยะเตือนภัย (WARNING)** | **7 - 18 cm** | LED WIFI กระพริบเป็นจังหวะ | ส่งเสียงปี๊บเป็นจังหวะ ยิ่งใกล้ยิ่งถี่ `map(cm, 7, 18, 70, 300) ms` |
| 🔴 **3. ระยะวิกฤต (DANGER)** | **&le; 6 cm** | LED WIFI ติดสว่างค้างตลอดเวลา | ส่งเสียงร้องปี๊บค้างยาวต่อเนื่อง |

---

## 🔌 ผังการเชื่อมต่อวงจร (Hardware Pinout)

| อุปกรณ์ | ขาของอุปกรณ์ | ต่อเข้ากับบอร์ด KidBright32 | หน้าที่การทำงาน |
| :--- | :--- | :--- | :--- |
| **HC-SR04** | **VCC** | **5V / VDD** | ไฟเลี้ยงวงจรเซนเซอร์ (+5V) |
| **HC-SR04** | **GND** | **GND** | กราวด์ระบบ (Ground) |
| **HC-SR04** | **TRIG** | **พิน 18 (GPIO18)** | ส่งพัลส์สัญญาณเสียง 40kHz |
| **HC-SR04** | **ECHO** | **พิน 19 (GPIO19)** | รับสัญญาณเสียงสะท้อนกลับ |
| **บนบอร์ด** | **BUZZER** | **พิน 13** | ลำโพงเปียโซบนบอร์ด KidBright |
| **บนบอร์ด** | **LED WIFI** | **พิน 2 (Active LOW)** | หลอดไฟ LED สีน้ำเงินบนบอร์ด |

---

## 🌟 ฟีเจอร์หลักของเว็บแดชบอร์ด (Web Features)

1. **Dual-Connection Mode (เลือกเชื่อมต่อได้ 2 รูปแบบ):**
   - 🔌 **Web Serial Connection:** เชื่อมต่อตรงกับบอร์ดผ่านสาย USB (Baudrate: 115,200 bps) บน Google Chrome / MS Edge โดยไม่ต้องลงโปรแกรมเสริม
   - 🌐 **Wireless WiFi & MQTT IoT:** เชื่อมต่อแบบไร้สายผ่าน WiFi บ้านหรือฮอตสปอตมือถือ ส่งข้อมูลผ่าน HiveMQ Public Broker ฟรี (WebSocket SSL) วางบอร์ดไว้ที่ไหนก็ส่งข้อมูลขึ้นหน้าเว็บได้จากทุกที่
2. **Interactive Radar Scanner:** หน้าจอเรดาร์แสดงมุมตรวจจับแบบกรวยเสียง 30 องศา (Concentric Arcs) และจุดเป้าหมายแบบ Pixel Blip
3. **Distance Timeline Chart:** กราฟเส้นแสดงสถิติระยะทางย้อนหลัง 30 วินาทีล่าสุดแบบเรียลไทม์
4. **Demo Simulation Mode:** โหมดจำลองระยะทางสำหรับทดสอบหน้าเว็บโดยไม่ต้องเสียบบอร์ดจริง พร้อมปุ่มเดินหน้า-ถอยหลังอัตโนมัติ (Auto-walk)
5. **Web Audio Buzzer:** จำลองเสียงลำโพง piezo บนบอร์ดที่ความถี่ 2,700Hz
6. **Proximity Event Log & CSV Export:** บันทึกเวลาและระยะเมื่อวัตถุเข้าสู่ระยะเตือน พร้อมปุ่มดาวน์โหลดไฟล์ CSV สำหรับเปิดใน Microsoft Excel

---

## 🌐 วิธีเชื่อมต่อแบบไร้สายผ่าน WiFi (MQTT)

1. เปิดโปรแกรม **Arduino IDE** บนคอมพิวเตอร์
2. ไปที่เมนู **Sketch > Include Library > Manage Libraries...** ค้นหาและติดตั้งไลบรารี `PubSubClient` by Nick O'Leary
3. เปิดไฟล์โค้ด `KidBright_WiFi_MQTT.ino` ที่อยู่ในโฟลเดอร์นี้
4. แก้ไขชื่อ WiFi และรหัสผ่านในโค้ด:
   ```cpp
   const char* ssid     = "ชื่อWiFiของคุณ";
   const char* password = "รหัสผ่านWiFi";
   ```
5. กดปุ่ม **"🌐 ไร้สาย (WiFi/MQTT)"** บนหน้าเว็บแดชบอร์ด เพื่อดูชื่อ **Topic** ที่เว็บสร้างให้ (เช่น `kidbright32/proximity/kb_xxxx`) หรือกดปุ่ม "สุ่มชื่อใหม่"
6. นำชื่อ Topic ไปใส่ในโค้ด Arduino:
   ```cpp
   const char* mqtt_topic = "kidbright32/proximity/kb_xxxx";
   ```
7. อัปโหลดโค้ดลงบอร์ด KidBright32
8. บนหน้าเว็บ กดปุ่ม **"⚡ เริ่มรับข้อมูลไร้สาย (Connect MQTT)"**
9. เมื่อบอร์ดเชื่อมต่อ WiFi ได้ ข้อมูลระยะทางจะถูกส่งขึ้นจอเรดาร์บนเว็บแบบ Real-time ทันที!

---

## 🚀 วิธีเปิดใช้งาน GitHub Pages ให้คนอื่นเปิดดูเว็บได้ฟรี

1. สร้าง Repository บน GitHub และอัปโหลดไฟล์ทั้งหมดขึ้นไป
2. ไปที่เมนู **Settings** ของ Repository
3. ด้านซ้ายคลิกที่เมนู **Pages**
4. ในส่วน **Build and deployment > Branch** ให้เลือกเป็น `main` (หรือ `master`) และโฟลเดอร์ `/ (root)` แล้วกด **Save**
5. รอ 1 - 2 นาที GitHub จะสร้างลิงก์สำหรับเข้าชมเว็บ เช่น:
   ```
   https://<username>.github.io/<repository-name>/
   ```
