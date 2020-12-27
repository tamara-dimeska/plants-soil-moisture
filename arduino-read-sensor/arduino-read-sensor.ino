int soilMoistureReadValue = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  soilMoistureReadValue = analogRead(A0);
  Serial.println(soilMoistureReadValue);

  delay(86400000); // read every day
}
