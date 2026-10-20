const axios = require('axios');

let level = 80;

setInterval(async () => {
  level += Math.floor(Math.random() * 5 - 2); // gradual change
  const reading = {
    sensorId: "CREEK-01",
    waterLevelCm: level,
    timestamp: new Date().toISOString()
  };
  try {
    await axios.post('http://localhost:3000/api/readings', reading);
    console.log("Posted:", reading);
  } catch (err) {
    console.error("Error posting:", err.message);
  }
}, 5000);

// In real IoT: replace with microcontroller + ultrasonic sensor + Wi-Fi/MQTT