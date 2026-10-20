const axios = require("axios");

let level = 85;

setInterval(async () => {

  level += Math.floor(Math.random() * 7) - 3;

  const reading = {
    sensorId: "CREEK-01",
    waterLevelCm: level,
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(
      "http://localhost:3000/api/readings",
      reading
    );

    console.log("Sent:", reading);
  } catch (err) {
    console.log(err.message);
  }

}, 5000);

/*
In a real IoT deployment this script would be replaced
by a microcontroller with an ultrasonic sensor sending
water level data through Wi‑Fi or MQTT.
*/