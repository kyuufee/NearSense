/**
 * ============================================================================
 * ระบบตรวจจับวัตถุเมื่อเข้าใกล้ (Ultrasonic Proximity Detection System)
 * บอร์ด: KidBright32 (ESP32) + เซนเซอร์ HC-SR04
 * การเชื่อมต่อ: รองรับทั้ง "เสียบสาย USB" และ "ไร้สายออนไลน์ (WiFi+MQTT)" พร้อมกัน 100%
 * ============================================================================
 * 
 * จุดเด่นของโค้ดนี้:
 * 1. เสียบสาย USB ปุ๊บ เซนเซอร์ทำงานทันที เสียงดังทันที ไฟติดทันที (ไม่ค้างรอ WiFi)
 * 2. หากเปิด Hotspot มือถือ บอร์ดจะเชื่อมต่อ WiFi ในเบื้องหลังอัตโนมัติ และส่งขึ้นเว็บออนไลน์ทันที
 * 
 * ไลบรารีที่ต้องติดตั้งใน Arduino IDE:
 * - PubSubClient (by Nick O'Leary)
 */

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// ============================================================================
// 1. กำหนดการเชื่อมต่อ WiFi และ MQTT
// ============================================================================
const char* ssid        = "Fah";               // ชื่อ Hotspot มือถือของคุณ
const char* password    = "0840586404";       // รหัสผ่าน Hotspot
const char* mqtt_server = "broker.hivemq.com"; // เซิร์ฟเวอร์ HiveMQ Cloud กลางฟรี
const int   mqtt_port   = 1883;
const char* mqtt_topic  = "kidbright32/proximity/default"; // Topic บนหน้าเว็บ

// ============================================================================
// 2. กำหนดขาพินอุปกรณ์ (ตามโค้ดเดิมของคุณ)
// ============================================================================
const int TRIG_PIN   = 18;   // พิน 18 (Trig)
const int ECHO_PIN   = 19;   // พิน 19 (Echo)
const int BUZZER_PIN = 13;   // Buzzer บนบอร์ด KidBright

const int LED_WIFI   = 2;    // พิน LED WIFI
const int LED_NTP    = 4;    // พิน LED NTP

const int BEEP_FREQ  = 2700; // ความถี่เสียง 2700Hz

WiFiClient espClient;
PubSubClient client(espClient);

// ตัวแปรจับเวลาสำหรับระบบไม่บล็อก (Non-blocking timing)
unsigned long previousBlinkMillis = 0;
unsigned long lastPublishTime     = 0;
unsigned long lastMqttRetryTime   = 0;
unsigned long lastWifiCheckTime   = 0;

const unsigned long publishInterval = 100; // ส่งข้อมูลทุกๆ 100ms

bool state = false;            // สถานะกระพริบ LED (ช่วง 7-18 cm)
bool isContinuousBeep = false; // ตัวแปรล็อกสถานะปี๊บยาวค้าง

// ============================================================================
// ฟังก์ชันอ่านค่าเซนเซอร์แบบเดี่ยว (โค้ดเดิมของคุณ)
// ============================================================================
long readSingleDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 25000); // timeout 25ms (~4 เมตร)
  if (duration == 0) return 999;
  return duration * 0.034 / 2;
}

// ============================================================================
// กรองค่าแกว่งแบบ Median Filter 5 ค่า (โค้ดเดิมของคุณ)
// ============================================================================
long getDistanceCM() {
  long readings[5];
  for (int i = 0; i < 5; i++) {
    readings[i] = readSingleDistance();
    delayMicroseconds(200);
  }
  
  for (int i = 0; i < 4; i++) {
    for (int j = i + 1; j < 5; j++) {
      if (readings[i] > readings[j]) {
        long temp = readings[i];
        readings[i] = readings[j];
        readings[j] = temp;
      }
    }
  }
  
  return readings[2];
}

// ============================================================================
// ฟังก์ชันจัดการ WiFi และ MQTT แบบไม่ทำให้เซนเซอร์กระตุก (Non-blocking)
// ============================================================================
void handleNetwork(unsigned long now) {
  // ตรวจสอบและสั่งเชื่อมต่อ WiFi ในเบื้องหลัง (ไม่หยุดรอ)
  if (WiFi.status() != WL_CONNECTED) {
    if (now - lastWifiCheckTime >= 10000) { // ลองต่อใหม่ทุก 10 วินาที
      lastWifiCheckTime = now;
      WiFi.mode(WIFI_STA);
      WiFi.begin(ssid, password);
    }
    return;
  }

  // หากต่อ WiFi ได้แล้ว ให้จัดการ MQTT
  if (!client.connected()) {
    if (now - lastMqttRetryTime >= 4000) { // ลองต่อ MQTT ทุก 4 วินาที
      lastMqttRetryTime = now;
      String clientId = "KB32-" + String(random(0xffff), HEX);
      if (client.connect(clientId.c_str())) {
        Serial.print("\n>>> MQTT Connected! Topic: ");
        Serial.println(mqtt_topic);
      }
    }
  } else {
    client.loop();
  }
}

// ============================================================================
// SETUP
// ============================================================================
void setup() {
  Serial.begin(115200);
  
  // ตั้งค่าขาพิน
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  pinMode(LED_WIFI, OUTPUT);
  pinMode(LED_NTP, OUTPUT);

  // ปิดไฟและเสียงเริ่มต้น (KidBright Active LOW: HIGH คือดับ)
  digitalWrite(LED_WIFI, HIGH);
  digitalWrite(LED_NTP, HIGH);
  noTone(BUZZER_PIN);

  // สั่งต่อ WiFi ทันทีโดยไม่ต้องค้างรอ (Background connecting)
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  client.setServer(mqtt_server, mqtt_port);
  client.setBufferSize(256);

  Serial.println("\n--- ระบบตรวจจับวัตถุ KidBright32 พร้อมทำงานทันที ---");
}

// ============================================================================
// LOOP (ทำงานทันที 100% ไม่ค้างรอ WiFi)
// ============================================================================
void loop() {
  unsigned long currentMillis = millis();

  // จัดการเน็ต WiFi & MQTT ในเบื้องหลัง
  handleNetwork(currentMillis);

  // อ่านระยะทางจากเซนเซอร์อัลตราโซนิก (ใช้ Median Filter 5 ค่าของคุณ)
  long cm = getDistanceCM();

  // --------------------------------------------------------------------------
  // ตรรกะไฟและเสียง 3 โซน (ตามโค้ดเดิมของคุณเป๊ะ 100%)
  // --------------------------------------------------------------------------
  
  // 1. ระยะวิกฤต (<= 6 cm) -> เสียงปี๊บค้างยาว + ไฟติดค้าง
  if (cm <= 6) {
    if (!isContinuousBeep) {
      tone(BUZZER_PIN, BEEP_FREQ);
      isContinuousBeep = true;
    }
    digitalWrite(LED_WIFI, LOW); 
    digitalWrite(LED_NTP, LOW);
  }
  // 2. ระยะเตือน (7 ถึง 18 cm) -> ไฟกระพริบและเสียงเป็นช่วงๆ ยิ่งใกล้ยิ่งถี่
  else if (cm <= 18) {
    if (isContinuousBeep) {
      noTone(BUZZER_PIN);
      isContinuousBeep = false;
    }

    int interval = map(cm, 7, 18, 70, 300);
    
    if (currentMillis - previousBlinkMillis >= interval) {
      previousBlinkMillis = currentMillis;
      state = !state;
      
      if (state) {
        digitalWrite(LED_WIFI, LOW);  // เปิดไฟ
        digitalWrite(LED_NTP, LOW);
        tone(BUZZER_PIN, BEEP_FREQ);
      } else {
        digitalWrite(LED_WIFI, HIGH); // ปิดไฟ
        digitalWrite(LED_NTP, HIGH);
        noTone(BUZZER_PIN);
      }
    }
  }
  // 3. ระยะปลอดภัย (> 18 cm) -> ปิดไฟและเสียงทันที
  else {
    digitalWrite(LED_WIFI, HIGH); // ปิดไฟ (HIGH คือดับ)
    digitalWrite(LED_NTP, HIGH);
    noTone(BUZZER_PIN);
    state = false;
    isContinuousBeep = false;
  }

  // --------------------------------------------------------------------------
  // ส่งข้อมูลทั้ง Serial (สาย USB) และ MQTT (ออนไลน์) พร้อมกัน
  // --------------------------------------------------------------------------
  if (currentMillis - lastPublishTime >= publishInterval) {
    lastPublishTime = currentMillis;

    // 1. ส่งผ่านสาย USB (ทำงานตลอดเวลา ทันทีที่เสียบสาย)
    Serial.print("Distance: ");
    Serial.print(cm);
    Serial.println(" cm");

    // 2. ส่งผ่านออนไลน์ MQTT (ถ้าต่อ WiFi สำเร็จ จะยิงขึ้นเว็บให้อัตโนมัติ)
    if (client.connected()) {
      char payload[16];
      snprintf(payload, sizeof(payload), "%ld", cm);
      client.publish(mqtt_topic, payload);
    }
  }

  delay(10);
}
