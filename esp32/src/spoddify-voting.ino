#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <BLE2902.h>

#define LILYGO_T5_V213
#define GxEPD2_DISPLAY_CLASS GxEPD2_BW
#define GxEPD2_DRIVER_CLASS GxEPD2_213_B74
#define GxEPD2_BW_IS_GxEPD2_BW true

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

#define uS_TO_S_FACTOR 1000000

#include <GxEPD2_BW.h>
#include <SD.h>

//Fonts
#include <FiraSans_Medium_1_8pt7b.h>
//#include <font.h>

//Grafiken
#include "icons.h"

// display

GxEPD2_BW<GxEPD2_213_B74, GxEPD2_213_B74::HEIGHT> display(GxEPD2_213_B74(/*CS=5*/ 5, /*DC=*/ 17, /*RST=*/ 16, /*BUSY=*/ 4)); // GxEPD2_213_B74
#define MAX_HEIGHT(EPD) (EPD::HEIGHT <= MAX_DISPLAY_BUFFER_SIZE / (EPD::WIDTH / 8) ? EPD::HEIGHT : MAX_DISPLAY_BUFFER_SIZE / (EPD::WIDTH / 8));
//GxEPD2_DISPLAY_CLASS<GxEPD2_DRIVER_CLASS, MAX_HEIGHT(GxEPD2_DRIVER_CLASS)> display(GxEPD2_DRIVER_CLASS(/*CS=D8*/ 5, /*DC=D3*/ 17, /*RST=D4*/ 16, /*BUSY=D2*/ 4));

//U8G2_FOR_ADAFRUIT_GFX u8g2Fonts;

//Variablen
bool update = false;
BLECharacteristic* cSongInfos;
BLECharacteristic* cVote;
BLECharacteristic* cUpdate;
void print_to_screen(const char* text);
RTC_DATA_ATTR char songName[100];


class SongCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cSongInfos) {
      const char* cpSong = cSongInfos->getValue().c_str();
      strcpy(songName, cpSong);
      print_to_screen(cpSong);
    };
};

class UpdateCallback: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* characteristic) {
    update = true;
  };
};

void print_to_screen(const char* text) {
  display.setFont(&FiraSans_Medium_1_8pt7b);
  display.setTextColor(GxEPD_BLACK);
  int16_t tbx, tby; uint16_t tbw, tbh;
  display.getTextBounds(text, 0, 0, &tbx, &tby, &tbw, &tbh);
  // center the bounding box by transposition of the origin:
  uint16_t x = ((display.width() - tbw) / 2) - tbx;
  uint16_t y = ((display.height() - tbh) / 2) - tby;
  display.setFullWindow();
  display.firstPage();
  do
  {
    display.fillScreen(GxEPD_WHITE);
    display.setCursor(x, y);
    display.print(text);
  }
  while (display.nextPage());
}


void setup() {
  Serial.begin(115200);
  delay(1000);
  esp_sleep_enable_timer_wakeup(20 * uS_TO_S_FACTOR);

  display.init();
  display.setRotation(1);
  display.setTextColor(GxEPD_BLACK);
  
  BLEDevice::init("espiss");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  
  cSongInfos = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130000",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);
  cVote = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130005",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);
  cUpdate = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130010",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);

  cSongInfos->setCallbacks(new SongCallback());
  cUpdate->setCallbacks(new UpdateCallback());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");

  cSongInfos->setValue(songName);
}


void loop() {
  if (update) {
    delay(2000);
    Serial.println("Going to sleep for 20 Seconds");
    esp_deep_sleep_start();
  }
}