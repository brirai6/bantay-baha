const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

let readings = [];

// Status Helper
function getStatus(level) {
  if (level < 100) return "Normal";
  if (level < 150) return "Alert";
  return "Danger";
}

// POST Reading
app.post("/api/readings", (req, res) => {
  const { sensorId, waterLevelCm, timestamp } = req.body;

  if (!sensorId)
    return res.status(400).json({ error: "sensorId required" });

  if (
    waterLevelCm === undefined ||
    isNaN(waterLevelCm) ||
    waterLevelCm < 0 ||
    waterLevelCm > 500
  ) {
    return res.status(400).json({
      error: "waterLevelCm must be between 0 and 500",
    });
  }

  readings.unshift({
    sensorId,
    waterLevelCm,
    timestamp,
  });

  res.status(201).json({
    message: "Reading saved",
  });
});

// GET latest readings
app.get("/api/readings", (req, res) => {
  res.json(readings.slice(0, 50));
});

// Analytics
function generateSummary() {
  if (readings.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      trend: "steady",
    };
  }

  const levels = readings.map(r => r.waterLevelCm);

  const avg =
    levels.reduce((a, b) => a + b, 0) /
    levels.length;

  const min = Math.min(...levels);
  const max = Math.max(...levels);

  const normal = levels.filter(v => v < 100).length;
  const alert = levels.filter(v => v >= 100 && v < 150).length;
  const danger = levels.filter(v => v >= 150).length;

  const latestFive = readings
    .slice(0, 5)
    .map(r => r.waterLevelCm);

  const previousFive = readings
    .slice(5, 10)
    .map(r => r.waterLevelCm);

  let trend = "steady";

  if (previousFive.length > 0) {

    const avgRecent =
      latestFive.reduce((a,b)=>a+b,0) /
      latestFive.length;

    const avgPrevious =
      previousFive.reduce((a,b)=>a+b,0) /
      previousFive.length;

    if (avgRecent > avgPrevious + 5)
      trend = "rising";

    else if (avgRecent < avgPrevious - 5)
      trend = "falling";
  }

  return {
    average: avg.toFixed(2),
    min,
    max,
    normal,
    alert,
    danger,
    trend,
  };
}

app.get("/api/summary", (req, res) => {
  res.json(generateSummary());
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
