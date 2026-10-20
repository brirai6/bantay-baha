let chart;

async function loadData() {

  const response =
    await fetch("http://localhost:3000/api/readings");

  const readings = await response.json();

  const latest = readings[0];

  if (latest) {

    document.getElementById(
      "waterLevel"
    ).textContent =
      latest.waterLevelCm + " cm";

    let card =
      document.getElementById("statusCard");

    card.className = "";

    if(latest.waterLevelCm < 100){
      card.classList.add("normal");
      document.getElementById("status")
      .textContent="Normal";
    }
    else if(latest.waterLevelCm < 150){
      card.classList.add("alert");
      document.getElementById("status")
      .textContent="Alert";
    }
    else{
      card.classList.add("danger");
      document.getElementById("status")
      .textContent="Danger";
    }
  }

  updateTable(readings.slice(0,10));
  updateChart(readings);
  loadSummary();
}

async function loadSummary() {

  const response =
    await fetch("http://localhost:3000/api/summary");

  const data = await response.json();

  document.getElementById("avg")
    .innerHTML=`Avg: ${data.average}`;

  document.getElementById("min")
    .innerHTML=`Min: ${data.min}`;

  document.getElementById("max")
    .innerHTML=`Max: ${data.max}`;

  document.getElementById("trend")
    .innerHTML=`Trend: ${data.trend}`;
}

setInterval(loadData,5000);

loadData();