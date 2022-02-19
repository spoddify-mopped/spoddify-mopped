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

#define Button1Pin 25
#define Button2Pin 26

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

//Variablen
String cpSong = "SongInfo";
String cpArtist = "ArtistInfo";
String cpAlbum = "AlbumInfo";
String cpID = "4cOdK2wGLETKBW3PvgPWqT";
uint8_t vote = 1;
int cpDuration = 500;
int timeoutCounter = 0;
int timeoutSec = 10;
unsigned long lastTimestamp = 0;
bool button1, button2, songInfoChanged, waitingOnVoteRead, blesetupdone = false;

uint16_t touch_treshold = 10;

class SongCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cSongInfos) {
      cpSong = cSongInfos->getValue().c_str();
      Serial.println(cpSong);
      songInfoChanged = true;
    };
};

class ArtistCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cArtist) {
      cpArtist = cArtist->getValue().c_str();
      songInfoChanged = true;
    };
};
 
class AlbumCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cAlbum) {
      cpAlbum = cAlbum->getValue().c_str();
      songInfoChanged = true;
    };
};
 
class IDCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cID) {
      cpID = cID->getValue().c_str();
      songInfoChanged = true;
    };
};

class VoteCallback: public BLECharacteristicCallbacks  {
    void onWrite(BLECharacteristic* cVote) {
      waitingOnVoteRead = false;
      
    };
};

void setup() {
  Serial.begin(115200);

  //Button Setup
  pinMode(Button1Pin, INPUT_PULLUP);
  pinMode(Button2Pin, INPUT_PULLUP);
  
  //Interupts
  //attachInterrupt(Button1Pin, button1pressed, RISING);
  //attachInterrupt(Button2Pin, button2pressed, RISING);
  touchAttachInterrupt(T1, button1pressed, touch_treshold);
  touchAttachInterrupt(T5, button2pressed, touch_treshold);

  // put your setup code here, to run once:
  //display.init(115200);
  display.init();
  
  display.setRotation(1);
  display.setFont(&FiraSans_Medium_1_8pt7b);
  
  display.setTextColor(GxEPD_BLACK);
  songInfoChanged=true;
}


void loop() {
  if ((millis()-lastTimestamp) > 5000) {
    Serial.print("Entering Loop");
    lastTimestamp = millis();
    //Timeout zum Lesen der Vote-Characteristik überschritten:
    if (timeoutCounter > timeoutSec){
      Serial.println("loop-1");
      waitingOnVoteRead = false;
      timeoutCounter = 0;
      drawTimeout();
    }
    //Warte auf Lesen der Vote-Charakteristik:
    if(waitingOnVoteRead == true){
      Serial.println("loop-2");
      drawLoading();
    }
    //Button 1 pressed> Upvote
    else if (button1 == true){
      Serial.println("loop-3");
      upvoteSong();
      button1 = false;
      songInfoChanged=true; //waitingOnVoteRead=true;
    }
    //Button 2 pressed> Downvote
    else if (button2 == true){
      Serial.println("loop-4");
      downvoteSong();
      button2 = false;
      songInfoChanged=true; //waitingOnVoteRead=true;
    }
    else if(blesetupdone == false){
      Serial.println("loop-5");
      blesetup();
      blesetupdone = true;
    } 
    else if(songInfoChanged == true){
      Serial.println("loop-6");
      drawSongInfos();
      songInfoChanged = false;
    } 
    else{
      
      Serial.println("Going to sleep.");
      //esp_sleep_enable_ext1_wakeup(0x6000000,ESP_EXT1_WAKEUP_ANY_HIGH);
      //esp_sleep_enable_ext0_wakeup(GPIO_NUM_25, 0);
      //esp_sleep_enable_ext0_wakeup(GPIO_NUM_26, 0);
      esp_sleep_enable_touchpad_wakeup();
      esp_sleep_enable_timer_wakeup(20*1000000);
      //esp_deep_sleep_start();
    }
    
  }
  

}

 
  
  /*  
  display.setPartialWindow(20, 16, display.width(), 32);
  display.firstPage();
  display.setCursor(0, 40);
  display.print("partial update");
  delay(1000);
  display.nextPage();
  


  display.firstPage();
  display.fillScreen(GxEPD_BLACK);
  display.nextPage();
  delay(5000);
  */
  
void drawSongInfos(){
  display.firstPage();
  display.fillScreen(GxEPD_WHITE);
  display.drawInvertedBitmap(0,4,icon_title, 18, 18, GxEPD_BLACK);
  display.drawInvertedBitmap(0,22,icon_album, 18, 18, GxEPD_BLACK);
  display.drawInvertedBitmap(0,40,icon_artist, 18, 18, GxEPD_BLACK);
  display.setCursor(18, 18);
  display.print(cpSong);
  display.setCursor(18, 36);
  display.print(cpArtist);
  display.setCursor(18, 54);
  display.print(cpAlbum);
  display.nextPage();
  Serial.println("Songdrawing done.");
}

void upvoteSong(){
  display.firstPage();
  display.fillScreen(GxEPD_WHITE);
  display.setCursor(18, 18);
  display.print("Upvote");
  display.nextPage();
  cVote->setValue((std::string)"Upvote");
}

void downvoteSong(){
  display.firstPage();
  display.fillScreen(GxEPD_WHITE);
  display.setCursor(18, 18);
  display.print("Downvote");
  display.nextPage();
  cVote->setValue((std::string)"Downvote");
  //cVote->setValue("Downvote");
}

void drawLoading(){
  display.firstPage();
  display.print("..");
  display.nextPage();
  timeoutCounter++;
}

void drawTimeout(){
  display.firstPage();
  display.setCursor(20,20);
  display.print("Timeout");
  display.nextPage();
  
}

void button1pressed(){
  button1=true;
  Serial.print("button 1 was registered.");
  Serial.println(millis());
}

void button2pressed(){
  button2=true;
  Serial.print("button 2 was registered.");
  Serial.println(millis());
}

void blesetup(){
  BLEDevice::init("SMVS");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  BLECharacteristic *cSongInfos = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130000",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);
  BLECharacteristic *cArtist = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130001",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);
  BLECharacteristic *cAlbum = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130002",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);
  BLECharacteristic *cID = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130003",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);
  BLECharacteristic *cVote = pService->createCharacteristic("6354e3a8-53ac-11ec-bf63-0242ac130005",BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);

  cSongInfos-> setCallbacks(new SongCallback());
  cArtist-> setCallbacks(new ArtistCallback());
  cAlbum-> setCallbacks(new AlbumCallback());
  cID->setCallbacks(new IDCallback());
  cVote->setCallbacks(new VoteCallback());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");
}