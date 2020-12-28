int soilMoistureReadValue = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  /**
   * A0 is the analog pin on the Arduino Board that the AOUT of the sensor is connected to. 
   * If you are using another analog pin, change read pin.
   */
  soilMoistureReadValue = analogRead(A0);
  Serial.println(soilMoistureReadValue);

  delay(86400000); // read every day
}
