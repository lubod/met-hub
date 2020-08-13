google.load('visualization', '1', { packages: ['corechart'] });
google.setOnLoadCallback(getDataVonku);

var time = new Date().getTime();

$('select').on('change', function (e) {
  getDataRoom(this.value, 0);
});

$('#prev').on('click', function (e) {
  time = time - 86400000;
  getDataRoom(document.getElementById('room').value);
});

$('#next').on('click', function (e) {
  time = time + 86400000;
  getDataRoom(document.getElementById('room').value);
});

function getDataRoom(room) {
  if (room == 'vonku') {
    getDataVonku();
  }
  else if (room == 'kupelne') {
    getDataKupelne();
  }
  else {
    getDataDom(room);
  }
}

function getDataVonku() {
  console.log(time);
  document.getElementById('chart_div1').innerHTML = '';
  document.getElementById('chart_div2').innerHTML = '';
  fetch('/getData/vonku/' + time).then(data => data.json()).then(json => {
    const last = json[0];
    const date = new Date(last.timestamp);
    document.getElementById('last1').innerHTML = `${date.toLocaleString('sk-SK')} teplota vonku: ${last.temp}°C`;
    document.getElementById('last2').innerHTML = `${date.toLocaleString('sk-SK')} vlhkost vonku: ${last.humidity}%`;
    document.getElementById('last3').innerHTML = `${date.toLocaleString('sk-SK')} rain senzor: ${last.rain}`;
    draw_vonku(json);
  });
  document.getElementById('room').value = 'vonku';
}

function getDataDom(room) {
  document.getElementById('chart_div1').innerHTML = '';
  document.getElementById('chart_div2').innerHTML = '';
  document.getElementById('chart_div3').innerHTML = '';
  fetch('/getData/' + room + '_vzduch/' + time).then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last1').innerHTML = `${date.toLocaleString('sk-SK')} vz: ${last.temp}°C req: ${last.req}°C k: ${last.kuri}`;
    draw_table(json, 'chart_div1');
  });
  fetch('/getData/' + room + '_podlaha/' + time).then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last2').innerHTML = `${date.toLocaleString('sk-SK')} pod: ${last.temp}°C req: ${last.req}°C k: ${last.kuri}`;
    draw_table(json, 'chart_div2');
  });
  fetch('/getData/tarif/' + time).then(data => data.json()).then(json => {
    console.log(json[0]);
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last3').innerHTML = `${date.toLocaleString('sk-SK')} tarif ${room}: ${last.tarif == 1 ? 'low' : 'high'}`;
    draw_tarif(json, 'chart_div3');
  });
}

function getDataKupelne() {
  document.getElementById('chart_div1').innerHTML = '';
  document.getElementById('chart_div2').innerHTML = '';
  fetch('/getData/kupelna_hore/' + time).then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last1').innerHTML = `${date.toLocaleString('sk-SK')} podlaha hore:  ${last.temp}°C req: ${last.req}°C`;
    draw_table(json, 'chart_div1');
  });
  fetch('/getData/kupelna_dole/' + time).then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last2').innerHTML = `${date.toLocaleString('sk-SK')} podlaha dole: ${last.temp}°C req: ${last.req}°C`;
    draw_table(json, 'chart_div2');
  });
}

function draw_vonku(json_data) {
  //    console.log(json_data);
  const data1 = new google.visualization.DataTable();
  const data2 = new google.visualization.DataTable();
  const data3 = new google.visualization.DataTable();
  data1.addColumn('datetime', 'Time');
  data2.addColumn('datetime', 'Time');
  data3.addColumn('datetime', 'Time');
  data1.addColumn('number', 'Temp °C');
  data2.addColumn('number', 'Humidity %');
  data3.addColumn('number', 'Rain sensor');
  const result1 = [];
  const result2 = [];
  const result3 = [];

  for (var i in json_data) {
    result1.push([new Date(json_data[i].timestamp), parseFloat(json_data[i].temp)]);
    result2.push([new Date(json_data[i].timestamp), parseFloat(json_data[i].humidity)]);
    result3.push([new Date(json_data[i].timestamp), json_data[i].rain ? 1 : 0]);
  }
  data1.addRows(result1);
  data2.addRows(result2);
  data3.addRows(result3);

  var options = {
    hAxis: {
      format: 'HH:mm'
    },
    vAxis: {
      viewWindow: {}
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: '85%', height: '85%' },
    legend: { position: 'top' }
  };
  const chart1 = new google.visualization.LineChart(document.getElementById('chart_div1'));
  chart1.draw(data1, options);
  const chart2 = new google.visualization.LineChart(document.getElementById('chart_div2'));
  chart2.draw(data2, options);
  const chart3 = new google.visualization.LineChart(document.getElementById('chart_div3'));
  chart3.draw(data3, options);
}

function draw_table(json_data, chart_div) {
  //    console.log(json_data);
  const data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Time');
  data.addColumn('number', 'Temp');
  data.addColumn('number', 'Required Temp');
  data.addColumn('number', 'Kuri');
  const result = [];

  for (var i in json_data) {
    result.push([new Date(json_data[i].timestamp), parseFloat(json_data[i].temp), parseFloat(json_data[i].req), parseInt(json_data[i].kuri)]);
  }
  data.addRows(result);

  var options = {
    hAxis: {
      format: 'HH:mm'
    },
    vAxis: {
      viewWindow: {}
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: '85%', height: '85%' },
    legend: { position: 'top' }
  };
  const chart = new google.visualization.LineChart(document.getElementById(chart_div));
  chart.draw(data, options);
}

function draw_tarif(json_data, chart_div) {
  //    console.log(json_data);
  const data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Time');
  data.addColumn('number', 'Tarif');
  const result = [];

  for (var i in json_data) {
    result.push([new Date(json_data[i].timestamp), parseInt(json_data[i].tarif)]);
  }
  data.addRows(result);

  var options = {
    hAxis: {
      format: 'HH:mm'
    },
    vAxis: {
      viewWindow: {}
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: '85%', height: '85%' },
    legend: { position: 'top' }
  };
  const chart = new google.visualization.LineChart(document.getElementById(chart_div));
  chart.draw(data, options);
}
