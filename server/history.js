google.load("visualization", "1", { packages: ["corechart"] });
google.setOnLoadCallback(getDataStanica);

var time = new Date().getTime();

$("select").on("change", function (e) {
  getDataRoom(this.value, 0);
});

$("#prev").on("click", function (e) {
  time = time - 86400000;
  getDataRoom(document.getElementById("room").value);
});

$("#next").on("click", function (e) {
  time = time + 86400000;
  getDataRoom(document.getElementById("room").value);
});

$("#current").on("click", function (e) {
  window.location.href = "index.html";
});

function getDataRoom(room) {
  if (room == "stanica") {
    getDataStanica();
  } else if (room == "vonku") {
    getDataVonku();
  } else if (room == "kupelne") {
    getDataKupelne();
  } else {
    getDataDom(room);
  }
}

function getDataStanica() {
  console.log(time);
  document.getElementById("chart_div1").innerHTML = "";
  document.getElementById("chart_div2").innerHTML = "";
  document.getElementById("chart_div3").innerHTML = "";
  document.getElementById("chart_div4").innerHTML = "";
  document.getElementById("chart_div5").innerHTML = "";
  document.getElementById("chart_div6").innerHTML = "";
  document.getElementById("chart_div7").innerHTML = "";
  document.getElementById("chart_div8").innerHTML = "";
  document.getElementById("chart_div9").innerHTML = "";
  document.getElementById("chart_div10").innerHTML = "";
  document.getElementById("chart_div11").innerHTML = "";

  fetch("/getData/stanica/" + time)
    .then((data) => data.json())
    .then((json) => {
      const last = json[0];
      const date = new Date(last.timestamp);
      document.getElementById("last1").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Temperature ${last.temp} °C`;
      document.getElementById("last2").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Humidity ${last.humidity} %`;
      document.getElementById("last3").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Wind Speed ${last.windspeed} km/h`;
      document.getElementById("last4").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Wind Gust ${last.windgust} km/h`;
      document.getElementById("last5").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Wind Direction ${last.winddir} °`;
      document.getElementById("last6").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Relative Pressure ${last.pressurerel} hPa`;
      document.getElementById("last7").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Solar Radiation ${last.solarradiation} W/m2`;
      document.getElementById("last8").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} UV ${last.uv}`;
      document.getElementById("last9").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Rain Rate ${last.rainrate} mm/hr`;
      document.getElementById("last10").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Rain Event ${last.eventrain} mm`;
      document.getElementById("last11").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} Rain Hourly ${last.hourlyrain} mm`;
      draw_stanica(json);
    });
  document.getElementById("room").value = "stanica";
}

function getDataVonku() {
  console.log(time);
  document.getElementById("chart_div1").innerHTML = "";
  document.getElementById("chart_div2").innerHTML = "";
  fetch("/getData/vonku/" + time)
    .then((data) => data.json())
    .then((json) => {
      const last = json[0];
      const date = new Date(last.timestamp);
      document.getElementById("last1").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} teplota vonku: ${last.temp}°C`;
      document.getElementById("last2").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} vlhkost vonku: ${last.humidity}%`;
      document.getElementById("last3").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} rain senzor: ${last.rain}`;
      draw_vonku(json);
    });
  document.getElementById("room").value = "vonku";
}

function getDataDom(room) {
  document.getElementById("chart_div1").innerHTML = "";
  document.getElementById("chart_div2").innerHTML = "";
  document.getElementById("chart_div3").innerHTML = "";
  fetch("/getData/" + room + "_vzduch/" + time)
    .then((data) => data.json())
    .then((json) => {
      const last = json[0];
      date = new Date(last.timestamp);
      document.getElementById("last1").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} vz: ${last.temp}°C req: ${last.req}°C k: ${last.kuri}`;
      draw_table(json, "chart_div1");
    });
  fetch("/getData/" + room + "_podlaha/" + time)
    .then((data) => data.json())
    .then((json) => {
      const last = json[0];
      date = new Date(last.timestamp);
      document.getElementById("last2").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} pod: ${last.temp}°C req: ${last.req}°C k: ${last.kuri}`;
      draw_table(json, "chart_div2");
    });
  fetch("/getData/tarif/" + time)
    .then((data) => data.json())
    .then((json) => {
      console.log(json[0]);
      const last = json[0];
      date = new Date(last.timestamp);
      document.getElementById("last3").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} tarif ${room}: ${last.tarif == 1 ? "low" : "high"}`;
      draw_tarif(json, "chart_div3");
    });
}

function getDataKupelne() {
  document.getElementById("chart_div1").innerHTML = "";
  document.getElementById("chart_div2").innerHTML = "";
  fetch("/getData/kupelna_hore/" + time)
    .then((data) => data.json())
    .then((json) => {
      const last = json[0];
      date = new Date(last.timestamp);
      document.getElementById("last1").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} podlaha hore:  ${last.temp}°C req: ${last.req}°C`;
      draw_table(json, "chart_div1");
    });
  fetch("/getData/kupelna_dole/" + time)
    .then((data) => data.json())
    .then((json) => {
      const last = json[0];
      date = new Date(last.timestamp);
      document.getElementById("last2").innerHTML = `${date.toLocaleString(
        "sk-SK"
      )} podlaha dole: ${last.temp}°C req: ${last.req}°C`;
      draw_table(json, "chart_div2");
    });
}

function draw_vonku(json_data) {
  //    console.log(json_data);
  const data1 = new google.visualization.DataTable();
  const data2 = new google.visualization.DataTable();
  const data3 = new google.visualization.DataTable();
  data1.addColumn("datetime", "Time");
  data2.addColumn("datetime", "Time");
  data3.addColumn("datetime", "Time");
  data1.addColumn("number", "Temp °C");
  data2.addColumn("number", "Humidity %");
  data3.addColumn("number", "Rain sensor");
  const result1 = [];
  const result2 = [];
  const result3 = [];

  for (var i in json_data) {
    result1.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].temp),
    ]);
    result2.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].humidity),
    ]);
    result3.push([new Date(json_data[i].timestamp), json_data[i].rain ? 1 : 0]);
  }
  data1.addRows(result1);
  data2.addRows(result2);
  data3.addRows(result3);

  var options = {
    hAxis: {
      format: "HH:mm",
    },
    vAxis: {
      viewWindow: {},
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: "85%", height: "85%" },
    legend: { position: "top" },
  };
  const chart1 = new google.visualization.LineChart(
    document.getElementById("chart_div1")
  );
  chart1.draw(data1, options);
  const chart2 = new google.visualization.LineChart(
    document.getElementById("chart_div2")
  );
  chart2.draw(data2, options);
  const chart3 = new google.visualization.LineChart(
    document.getElementById("chart_div3")
  );
  chart3.draw(data3, options);
}

function draw_stanica(json_data) {
  //    console.log(json_data);
  const data1 = new google.visualization.DataTable();
  const data2 = new google.visualization.DataTable();
  const data3 = new google.visualization.DataTable();
  const data4 = new google.visualization.DataTable();
  const data5 = new google.visualization.DataTable();
  const data6 = new google.visualization.DataTable();
  const data7 = new google.visualization.DataTable();
  const data8 = new google.visualization.DataTable();
  const data9 = new google.visualization.DataTable();
  const data10 = new google.visualization.DataTable();
  const data11 = new google.visualization.DataTable();

  data1.addColumn("datetime", "Time");
  data2.addColumn("datetime", "Time");
  data3.addColumn("datetime", "Time");
  data4.addColumn("datetime", "Time");
  data5.addColumn("datetime", "Time");
  data6.addColumn("datetime", "Time");
  data7.addColumn("datetime", "Time");
  data8.addColumn("datetime", "Time");
  data9.addColumn("datetime", "Time");
  data10.addColumn("datetime", "Time");
  data11.addColumn("datetime", "Time");

  data1.addColumn("number", "Temp [°C]");
  data2.addColumn("number", "Humidity [%]");
  data3.addColumn("number", "Wind Speed [km/h]");
  data4.addColumn("number", "Wind Gust [km/h]");
  data5.addColumn("number", "Wind Direction [°]");
  data6.addColumn("number", "Relative Pressure [hPa]");
  data7.addColumn("number", "Solar Radiation [W/m2]");
  data8.addColumn("number", "UV");
  data9.addColumn("number", "Rain Rate [mm/hr]");
  data10.addColumn("number", "Rain Event [mm]");
  data11.addColumn("number", "Rain Hourly [mm]");

  const result1 = [];
  const result2 = [];
  const result3 = [];
  const result4 = [];
  const result5 = [];
  const result6 = [];
  const result7 = [];
  const result8 = [];
  const result9 = [];
  const result10 = [];
  const result11 = [];

  for (var i in json_data) {
    result1.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].temp),
    ]);
    result2.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].humidity),
    ]);
    result3.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].windspeed),
    ]);
    result4.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].windgust),
    ]);
    result5.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].winddir),
    ]);
    result6.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].pressurerel),
    ]);
    result7.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].solarradiation),
    ]);
    result8.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].uv),
    ]);
    result9.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].rainrate),
    ]);
    result10.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].eventrain),
    ]);
    result11.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].hourlyrain),
    ]);
  }
  data1.addRows(result1);
  data2.addRows(result2);
  data3.addRows(result3);
  data4.addRows(result4);
  data5.addRows(result5);
  data6.addRows(result6);
  data7.addRows(result7);
  data8.addRows(result8);
  data9.addRows(result9);
  data10.addRows(result10);
  data11.addRows(result11);

  const options = {
    hAxis: {
      format: "HH:mm",
    },
    vAxis: {
      viewWindow: {},
    },
    series: { 2: {} },
    height: 290,
    curveType: "function",
    chartArea: { width: "85%", height: "85%" },
    legend: { position: "top" },
  };

  const chart1 = new google.visualization.LineChart(
    document.getElementById("chart_div1")
  );
  chart1.draw(data1, options);
  const chart2 = new google.visualization.LineChart(
    document.getElementById("chart_div2")
  );
  chart2.draw(data2, options);
  const chart3 = new google.visualization.LineChart(
    document.getElementById("chart_div3")
  );
  chart3.draw(data3, options);
  const chart4 = new google.visualization.LineChart(
    document.getElementById("chart_div4")
  );
  chart4.draw(data4, options);
  const chart5 = new google.visualization.ScatterChart(
    document.getElementById("chart_div5")
  );
  chart5.draw(data5, options);
  const chart6 = new google.visualization.LineChart(
    document.getElementById("chart_div6")
  );
  chart6.draw(data6, options);
  const chart7 = new google.visualization.LineChart(
    document.getElementById("chart_div7")
  );
  chart7.draw(data7, options);
  const chart8 = new google.visualization.ColumnChart(
    document.getElementById("chart_div8")
  );
  chart8.draw(data8, options);
  const chart9 = new google.visualization.ColumnChart(
    document.getElementById("chart_div9")
  );
  chart9.draw(data9, options);
  const chart10 = new google.visualization.ColumnChart(
    document.getElementById("chart_div10")
  );
  chart10.draw(data10, options);
  const chart11 = new google.visualization.ColumnChart(
    document.getElementById("chart_div11")
  );
  chart11.draw(data11, options);
}

function draw_table(json_data, chart_div) {
  //    console.log(json_data);
  const data = new google.visualization.DataTable();
  data.addColumn("datetime", "Time");
  data.addColumn("number", "Temp");
  data.addColumn("number", "Required Temp");
  data.addColumn("number", "Kuri");
  const result = [];

  for (var i in json_data) {
    result.push([
      new Date(json_data[i].timestamp),
      parseFloat(json_data[i].temp),
      parseFloat(json_data[i].req),
      parseInt(json_data[i].kuri),
    ]);
  }
  data.addRows(result);

  var options = {
    hAxis: {
      format: "HH:mm",
    },
    vAxis: {
      viewWindow: {},
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: "85%", height: "85%" },
    legend: { position: "top" },
  };
  const chart = new google.visualization.LineChart(
    document.getElementById(chart_div)
  );
  chart.draw(data, options);
}

function draw_tarif(json_data, chart_div) {
  //    console.log(json_data);
  const data = new google.visualization.DataTable();
  data.addColumn("datetime", "Time");
  data.addColumn("number", "Tarif");
  const result = [];

  for (var i in json_data) {
    result.push([
      new Date(json_data[i].timestamp),
      parseInt(json_data[i].tarif),
    ]);
  }
  data.addRows(result);

  var options = {
    hAxis: {
      format: "HH:mm",
    },
    vAxis: {
      viewWindow: {},
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: "85%", height: "85%" },
    legend: { position: "top" },
  };
  const chart = new google.visualization.LineChart(
    document.getElementById(chart_div)
  );
  chart.draw(data, options);
}
