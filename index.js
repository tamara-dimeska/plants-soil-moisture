const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const startOfToday = require('date-fns/startOfToday');
const format = require('date-fns/format');
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

/*
 * Serial port used for communication with Arduino.
 * The name and the baudRate should be the same as the ones used in the Arduino code.
 * To find your port name go to: Arduino IDE -> Tools -> Port
 * The baudRate is the one that you have used in the Arduino code in `Serial.begin();`
 */
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
// The data is send from the Arduino to the serial port with `Serial.println()`, that why the delimiter is '\n'.
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const airValue = 807; // Change this value to the value read when your sensor is on air
const waterValue = 512; // Change this value to the value read when your sensor is in water
const offset = (airValue - waterValue) / 3;
let sensor_message;
let reminder = 0;
let email_body;

// Read the port data
port.on('open', () => {
  console.log('Serial port open...');
});

parser.on('data', (sensor_data) => {
  if (sensor_data < waterValue) {
    sensor_message =
      'You passed the water limit. Consider recalibrating the sensor.';
  } else if (sensor_data > airValue) {
    sensor_message =
      'You passed the air limit. Consider recalibrating the sensor.';
  }

  if (sensor_data > waterValue && sensor_data < waterValue + offset) {
    sensor_message = 'Very Wet';
  } else if (
    sensor_data > waterValue + offset &&
    sensor_data < airValue - offset
  ) {
    sensor_message = 'Wet';
  } else if (sensor_data < airValue && sensor_data > airValue - offset) {
    reminder++;
    sensor_message = 'Dry';
  }

  const text = `The sensor reading is ${sensor_data}. The plant's soil is: ${sensor_message}`;

  if (reminder === 14) {
    email_body = `${text}\nREMINDER: Today is the day! Water your plants!`;
    reminder = 0;
  } else {
    email_body = text;
  }

  const msg = {
    to: process.env.EMAIL,
    from: process.env.EMAIL,
    subject: `Plant moisure sensor reading for day: ${format(
      startOfToday(),
      'dd MMM yyyy'
    )}`,
    text: email_body,
  };

  (async () => {
    try {
      await sendgrid.send(msg);
      console.log('Email sent!');
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
});
