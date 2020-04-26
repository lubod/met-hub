google.load('visualization', '1', { packages: ['corechart'] });
google.setOnLoadCallback(getDataVonku);

$('select').on('change', function (e) {
  getDataRoom(this.value);
});

function getDataRoom(room) {
  //console.log('changed' + room);
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
  document.getElementById('chart_div1').innerHTML = '';
  document.getElementById('chart_div2').innerHTML = '';
  fetch('/getData/vonku').then(data => data.json()).then(json => {
    const last = json[0];
    const date = new Date(last.timestamp);
    document.getElementById('last1').innerHTML = `${date.toLocaleTimeString('sk-SK')} teplota vonku: ${last.temp}°C`;
    document.getElementById('last2').innerHTML = `${date.toLocaleTimeString('sk-SK')} vlhkost vonku: ${last.humidity}%`;
    document.getElementById('last3').innerHTML = `${date.toLocaleTimeString('sk-SK')} rain senzor: ${last.rain}`;
    draw_vonku(json);
  });
  document.getElementById('room').value = 'vonku';
}

function getDataDom(room) {
  document.getElementById('chart_div1').innerHTML = '';
  document.getElementById('chart_div2').innerHTML = '';
  fetch('/getData/' + room + '_vzduch').then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last1').innerHTML = `${date.toLocaleTimeString('sk-SK')} vzduch ${room}: ${last.temp}°C req: ${last.req}°C`;
    draw_table(json, 'chart_div1');
  });
  fetch('/getData/' + room + '_podlaha').then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last2').innerHTML = `${date.toLocaleTimeString('sk-SK')} podlaha ${room}: ${last.temp}°C req: ${last.req}°C`;
    draw_table(json, 'chart_div2');
  });
}

function getDataKupelne() {
  document.getElementById('chart_div1').innerHTML = '';
  document.getElementById('chart_div2').innerHTML = '';
  fetch('/getData/kupelna_hore').then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last1').innerHTML = `${date.toLocaleTimeString('sk-SK')} podlaha hore:  ${last.temp}°C req: ${last.req}°C`;
    draw_table(json, 'chart_div1');
  });
  fetch('/getData/kupelna_dole').then(data => data.json()).then(json => {
    const last = json[0];
    date = new Date(last.timestamp);
    document.getElementById('last2').innerHTML = `${date.toLocaleTimeString('sk-SK')} podlaha dole: ${last.temp}°C req: ${last.req}°C`;
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

  var options1 = {
    hAxis: {
//      title: 'Time',
      format: 'HH:mm'
    },
    vAxis: {
//      title: '°C',
      viewWindow: {}
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: '85%', height: '85%' },
    legend: { position: 'top' }
  };
  var options2 = {
    hAxis: {
//      title: 'Time',
      format: 'HH:mm' // dd.MM'
    },
    vAxis: {
//      title: '%',
      viewWindow: {}
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: '85%', height: '85%' },
    legend: { position: 'top' }
  };
  var options3 = {
    hAxis: {
//      title: 'Time',
      format: 'HH:mm' // dd.MM'
    },
    vAxis: {
//      title: '%',
      viewWindow: {}
    },
    series: { 2: {} },
    height: 290,
    chartArea: { width: '85%', height: '85%' },
    legend: { position: 'top' }
  };
  const chart1 = new google.visualization.LineChart(document.getElementById('chart_div1'));
  chart1.draw(data1, options1);
  const chart2 = new google.visualization.LineChart(document.getElementById('chart_div2'));
  chart2.draw(data2, options2);
  const chart3 = new google.visualization.LineChart(document.getElementById('chart_div3'));
  chart3.draw(data3, options3);
}

function draw_table(json_data, chart_div) {
  //    console.log(json_data);
  const data = new google.visualization.DataTable();
  data.addColumn('datetime', 'Time');
  data.addColumn('number', 'Temp');
  data.addColumn('number', 'Required Temp');
  const result = [];

  for (var i in json_data) {
    result.push([new Date(json_data[i].timestamp), parseFloat(json_data[i].temp), parseFloat(json_data[i].req)]);
  }
  data.addRows(result);

  var options = {
    hAxis: {
//      title: 'Time',
      format: 'HH:mm'
    },
    vAxis: {
//      title: '°C',
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
