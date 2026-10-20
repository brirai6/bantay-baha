const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let readings = [];

app.use(bodyParser.json());

// POST /api/readings
app.post('/api/readings', (req, res) => {
  const { sensorId, waterLevelCm, timestamp } = req.body;
  if (!sensorId || typeof waterLevelCm !== 'number' || waterLevelCm < 0 || waterLevelCm > 500) {
    return res.status(400).json({ error: 'Invalid reading' });
  }
  readings.unshift({ sensorId, waterLevelCm, timestamp });
  res.status(201).json({ message: 'Reading saved' });
});

// GET /api/readings
app.get('/api/readings', (req, res) => {
  res.json(readings.slice(0, 50));
});

// GET /api/summary
app.get('/api/summary', (req, res) => {
  if (readings.length === 0) return res.json({});
  const levels = readings.map(r => r.waterLevelCm);
  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
  const min = Math.min(...levels);
  const max = Math.max(...levels);
  res.json({ average: avg, min, max });
});

app.listen(3000, () => console.log('Server running on port 3000'));