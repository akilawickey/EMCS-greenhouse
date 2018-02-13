/*
        IoT Greenhouse Code hosted @ Digital Ocean Server
        
        Akila Wickey 
        This IoT Greenhouse consists of low power Node MSU esp8266 and few sensors
        Here i have used AM2301 Humidity and Temperature sensor, BH1750FVI Light sensor, Soil moisture sensor and Rain drop detection sensor    
         Light VCC  –  Wemos 3.3v
               GND – Wemos Gnd
               SCL – Wemos D1
               SDA – Wemos D2
*/

#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include "DHT.h"
#define DHTPIN D4 
#define DHTTYPE DHT21  // DHT 21 (AM2301)
#include <Wire.h>
#include <BH1750.h>


#define LIGHT_sensor D3
BH1750 lightMeter;


void callback(char* topic, byte* payload, unsigned int length);
//EDIT THESE LINES TO MATCH YOUR SETUP
#define MQTT_SERVER "139.59.23.178"
//const char* ssid = "ZTE";
//const char* password = "12345678912340000000000000";
const char* ssid = "asak";
const char* password = "19921004ab";

const int lightPin = D5;

char* nodeTopic   = "node/badulla/1/test";
char* lightTopic   = "node/badulla/1/light";
char* tempTopic   = "node/badulla/1/temp";
char* humTopic   = "node/badulla/1/hum";
char* soilTopic   = "node/badulla/1/soil";

char charBuf_temp[50];
char charBuf_hum[50];
char charBuf_light[50];
char charBuf_soil[50];

// We will take analog input from A0 pin 
const int AnalogIn     = A0; 

DHT dht(DHTPIN, DHTTYPE);
WiFiClient wifiClient;
PubSubClient client(MQTT_SERVER, 1883, callback, wifiClient);

void setup() {
  //initialize the light as an output and set to LOW (off)
  pinMode(lightPin, OUTPUT);
  digitalWrite(lightPin, HIGH);

  //start the serial line for debugging
  Serial.begin(115200);
  delay(100);


  //start wifi subsystem
  WiFi.begin(ssid, password);
  //attempt to connect to the WIFI network and then connect to the MQTT server
  reconnect();

  //wait a bit before starting the main loop
      delay(5000);
      dht.begin();
}



void loop(){

  //reconnect if connection is lost
  if (!client.connected() && WiFi.status() == 3) {reconnect();}

  //maintain MQTT connection
  client.loop();

  //MUST delay to allow ESP8266 WIFI functions to run
//  delay(10000); 
  float h = dht.readHumidity();
  Serial.println(h);
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  Serial.println(t);
  // Read analog value, in this case a soil moisture
  int data = analogRead(AnalogIn);
  // get the light sensor values
  uint16_t lux = lightMeter.readLightLevel();

  String humchar = String(h);
  String tempchar = String(t);
  String soilchar = String(data);
  String lightchar = String(lux);
 
  humchar.toCharArray(charBuf_hum, 50);
  tempchar.toCharArray(charBuf_temp, 50);
  soilchar.toCharArray(charBuf_soil, 50);
  lightchar.toCharArray(charBuf_light, 50);
  
//  Serial.println(charBuf_temp+ ' '+tempchar+' '+soilchar+ ' ' + lightchar);
  client.publish(nodeTopic, "node/badulla/1/test");
  client.publish(tempTopic, charBuf_temp);
  client.publish(humTopic, charBuf_hum);
  client.publish(soilTopic, charBuf_soil);
  client.publish(lightTopic, charBuf_light);
  
  delay(1000  );

}


void callback(char* topic, byte* payload, unsigned int length) {

  //convert topic to string to make it easier to work with
  String topicStr = topic; 

  //Print out some debugging info
  Serial.println("Callback update.");
  Serial.print("Topic: ");
  Serial.println(topicStr);

}




void reconnect() {
  

  //attempt to connect to the wifi if connection is lost
  if(WiFi.status() != WL_CONNECTED){
    //debug printing
    Serial.print("Connecting to ");
    Serial.println(ssid);

    //loop while we wait for connection
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }

    //print out some more debug once connected
    Serial.println("");
    Serial.println("WiFi connected");  
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

  }

  //make sure we are connected to WIFI before attemping to reconnect to MQTT
  if(WiFi.status() == WL_CONNECTED){
  // Loop until we're reconnected to the MQTT server
    while (!client.connected()) {
      Serial.print("Attempting MQTT connection...");

      // Generate client name based on MAC address and last 8 bits of microsecond counter
      String clientName;
      clientName += "esp8266-";
      uint8_t mac[6];
      WiFi.macAddress(mac);
      clientName += macToStr(mac);

      //if connected, subscribe to the topic(s) we want to be notified about
      if (client.connect((char*) clientName.c_str())) {
        Serial.print("\tMTQQ Connected");
        client.subscribe(lightTopic);

      }

      //otherwise print failed for debugging
      else{Serial.println("\tFailed."); abort();}
    }
  }
}

//generate unique name from MAC addr
String macToStr(const uint8_t* mac){

  String result;

  for (int i = 0; i < 6; ++i) {
    result += String(mac[i], 16);

    if (i < 5){
      result += ':';
    }
  }

  return result;
}  
