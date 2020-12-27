const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const startOfToday = require('date-fns/startOfToday')
const format = require('date-fns/format')
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const airValue = 810;
const waterValue = 420;
const offset = (airValue - waterValue) / 3;
var read_value;
var sensor_message; 

// Read the port data
port.on("open", () => {
  console.log('serial port open');
});

parser.on('data', data =>{
  read_value = data;

  if (data < waterValue) {
    sensor_message = "You passed the water limit. Consider recalibrating the sensor."
  } else if (data > airValue) {
    sensor_message = "You passed the air limit. Consider recalibrating the sensor."
  }
 
  if (data > waterValue && data < (waterValue + offset)) {
    sensor_message = "Very Wet"
  } else if (data > (waterValue + offset) && data < (airValue - offset)) {
    sensor_message = "Wet"
  } else if (data < airValue && data > (airValue - offset)) {
    sensor_message = "Dry"
  }

  const msg = {
    to: process.env.EMAIL,
    from: process.env.EMAIL, 
    subject: `Plant moisure sensor reading for day: ${format(startOfToday(), 'dd MMM yyyy')}`,
    text: `The sensor reading is ${read_value}. The plant's soil is: ${sensor_message}`,
  };

  (async () => {
    try {
      await sendgrid.send(msg);
      console.log("Email sent!")
    } catch (error) {
      console.error(error);
   
      if (error.response) {
        console.error(error.response.body)
      }
    }
  })();
});