# plants-soil-moisture

The goal of this project is to measure the moisture of the plants soil and send daily emails about it, so that once the plant is dry, you can go and water the plant.

## Electronics

1. Raspberry Pi 4
2. Arduino Uno
3. AZ-Delivery Soil Moisture Sensor Module v1.2
4. Wires x3

### Prerequisites

- Arduino installed on Raspberry Pi - [link](https://create.arduino.cc/projecthub/techno_z/program-your-arduino-from-your-raspberry-pi-3407d4) The example here is for rpi 3, but the same is applicable for rpi 4.

### Connection

- Connect the GND pin of the sensor to the GND pin on the Arduino Board.
- Connect the VCC pin of the sensor to the 5V pin on the Arduino Board.
- Connect the AOUT pin of the sensor to the A0 pin on the Arduino Board. (NOTE: You can connect the AOUT pin to any other analog pin on the Arduino Board, just remember to change the code running on the Arduino, as well.)
- Plug in the Arduino in the Raspberry Pi.

### Calibration of the sensor

Before running the program you need to calibrate the sensor that you have.
You need 2 values:

1. The value of the sensor in dry environment (air)
2. The value of the sensor in wet environment (water)
   Once you have these 2 values, change the values of `airValue` and `waterValue` constants in `index.js` file.
   These are upper and lower limits of the sensor.

## Software

### Prerequisites

- Node.js installed on Raspberry Pi - [link](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp) The link provides detailed information about how to enable ssh on rpi etc., if you are just interested in installing node.js go to the last section `Install Node.js on Raspberry Pi`.
- Activated account on Sendgrid - [link](https://sendgrid.com/)
- API Key generated from your Sendgrid account (Settings -> API Keys -> Create API Key)

### Dependencies

- @sendgrid/mail - [link](https://www.npmjs.com/package/@sendgrid/mail)
- date-fns - [link](https://www.npmjs.com/package/date-fns)
- serialport - [link](https://www.npmjs.com/package/serialport)

### Run the program

1. Create `credentials.env` file and add:
   - export SENDGRID_API_KEY='THE_API_KEY_GENERATED_IN_SENDGRID'
   - export EMAIL='THE_EMAIL_ADDRESS_TO_FROM_WHICH_THE_EMAILS_SHOULD_BE_SEND'
2. Run `npm start` in your CLI.

### Debugging

- If the API key and/or the email address are not set correctly, execute the lines from `credentials.env` file in your CLI.
