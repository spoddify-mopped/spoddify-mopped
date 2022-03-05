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
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define BUTTON1PIN 25
#define BUTTON2PIN 26
#define TIMEOUT 20
#define TOUCH_TRESHOLD 10

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

//BLE
BLECharacteristic *cSongInfos;
BLECharacteristic *cArtist;
BLECharacteristic *cAlbum;
BLECharacteristic *cID;
BLECharacteristic *cVote;
BLECharacteristic *cQr;

//Variablen
char songName[100];
char artistName[100];
char albumName[100];
char idName[100];
char qrCode[23];
bool button1, button2, timeout;

void drawSongInfos();

class SongCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cSongInfos) {
      const char* cpSong = cSongInfos->getValue().c_str();
      strcpy(songName, cpSong);
      drawSongInfos();
    };
};

class ArtistCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cArtist) {
      const char* cpArtist = cArtist->getValue().c_str();
      strcpy(artistName, cpArtist);
    };
};
 
class AlbumCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cAlbum) {
      const char* cpAlbum = cAlbum->getValue().c_str();
      strcpy(albumName, cpAlbum);
    };
};
 
class IDCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cID) {
      const char* cpID = cID->getValue().c_str();
      strcpy(idName, cpID);
    };
};

class QrCallback: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* cQr) {
    const void* data = cQr->getData();
    memcpy(qrCode, data, 23);
  };
};

void setup() {
  button1 = false;
  button2 = false;
  Serial.begin(115200);

  //Button Setup
  delay(1000);
  
  //Interupts
  //attachInterrupt(Button1Pin, button1pressed, RISING);
  //attachInterrupt(Button2Pin, button2pressed, RISING);
  touchAttachInterrupt(T1, button1pressed, TOUCH_TRESHOLD);
  touchAttachInterrupt(T5, button2pressed, TOUCH_TRESHOLD);

  // put your setup code here, to run once:
  //display.init(115200);
  display.init();
  
  display.setRotation(1);
  display.setFont(&FiraSans_Medium_1_8pt7b);
  
  display.setTextColor(GxEPD_BLACK);

  blesetup();
  drawLoading();
}


void loop() {
  delay(1000);
}
  
void drawSongInfos() {
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.drawInvertedBitmap(0,4,icon_title, 18, 18, GxEPD_BLACK);
    display.drawInvertedBitmap(0,22,icon_album, 18, 18, GxEPD_BLACK);
    display.drawInvertedBitmap(0,40,icon_artist, 18, 18, GxEPD_BLACK);
    display.setCursor(18, 18);
    display.print(songName);
    display.setCursor(18, 36);
    display.print(artistName);
    display.setCursor(18, 54);
    display.print(albumName);
    display.drawInvertedBitmap(5, 76, icon_spotify, 40, 40, GxEPD_BLACK);
    for (int i = 0; i < 23; i++) {
      display.fillRect(55+i*8, 95-(qrCode[i]) / 20.0 * 4, 5, (qrCode[i]) / 20.0 * 8.1, GxEPD_BLACK);
    }
  } while(display.nextPage());
  Serial.println("Songdrawing done.");
}

void upvoteSong(){
  cVote->setValue("upvote");
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setCursor(18, 18);
    display.print("Upvote");
    display.drawInvertedBitmap(107,40,icon_thumbup, 36, 36, GxEPD_BLACK);
  } while(display.nextPage());
}

void downvoteSong() {
  cVote->setValue("downvote");
  display.firstPage();
  do {
    display.fillScreen(GxEPD_WHITE);
    display.setCursor(18, 18);
    display.print("Downvote");
    display.drawInvertedBitmap(107,40,icon_thumbdown, 36, 36, GxEPD_BLACK);
  } while(display.nextPage());
}

void drawLoading(){
  display.firstPage();
  do {
    display.print("..");
  } while(display.nextPage());
}

void drawTimeout() {
  display.firstPage();
  do {
    display.setCursor(20,20);
    display.print("Timeout");
  } while (display.nextPage());
}

void button1pressed() {
  Serial.print("button 1 was registered.");
  //upvoteSong();
}

void button2pressed(){
  Serial.print("button 2 was registered.");
  //downvoteSong();
}

void blesetup(){
  BLEDevice::init("SMVS");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  cSongInfos = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130000",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  cArtist = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130001",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  cAlbum = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130002",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  cID = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130003",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);
  cVote = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130004",BLECharacteristic::PROPERTY_READ);
  cQr = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130006", BLECharacteristic::PROPERTY_WRITE);

  cSongInfos-> setCallbacks(new SongCallback());
  cArtist-> setCallbacks(new ArtistCallback());
  cAlbum-> setCallbacks(new AlbumCallback());
  cID->setCallbacks(new IDCallback());
  cQr->setCallbacks(new QrCallback());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");
}