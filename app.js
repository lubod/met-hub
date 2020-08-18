
window.onload = function() {
  getLastData();
};

$('#history').on('click', function (e) {
  window.location.href = "history.html";
});

function getLastData() {
  fetch('/getLastData').then(data => data.json()).then(json => {
    const last = json;
    const date = new Date(last.timestamp);
    document.getElementById('last_timestamp').innerHTML = `${date.toLocaleString('sk-SK')}`;
    document.getElementById('last_tempout').innerHTML = `${last.temp.toFixed(1)}`;
    document.getElementById('last_humidityout').innerHTML = `${last.humidity.toFixed(0)}`;
    document.getElementById('last_tempin').innerHTML = `${last.tempin.toFixed(1)}`;
    document.getElementById('last_humidityin').innerHTML = `${last.humidityin.toFixed(0)}`;
    document.getElementById('last_pressurerel').innerHTML = `${last.pressurerel.toFixed(1)}`;
    document.getElementById('last_pressureabs').innerHTML = `${last.pressureabs.toFixed(1)}`;
    document.getElementById('last_windgust').innerHTML = `${last.windgust.toFixed(1)}`;
    document.getElementById('last_maxdailygust').innerHTML = `${last.maxdailygust.toFixed(1)}`;
    document.getElementById('last_rainrate').innerHTML = `${last.rainrate.toFixed(1)}`;
    document.getElementById('last_eventrain').innerHTML = `${last.eventrain.toFixed(1)}`;
    document.getElementById('last_hourlyrain').innerHTML = `${last.hourlyrain.toFixed(1)}`;
    document.getElementById('last_dailyrain').innerHTML = `${last.dailyrain.toFixed(1)}`;
    document.getElementById('last_weeklyrain').innerHTML = `${last.weeklyrain.toFixed(1)}`;
    document.getElementById('last_monthlyrain').innerHTML = `${last.monthlyrain.toFixed(1)}`;
    document.getElementById('last_totalrain').innerHTML = `${last.totalrain.toFixed(1)}`;
    document.getElementById('last_solarradiation').innerHTML = `${last.solarradiation.toFixed(0)}`;
    document.getElementById('last_uv').innerHTML = `${last.uv.toFixed(0)}`;

    //    window.requestAnimationFrame(draw);
    draw(last);
  });
  setTimeout(getLastData, 15000);
}

function draw(last) {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#343A40';
  ctx.arc(100, 100, 100, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
  ctx.fill();
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';
  ctx.arc(100, 100, 70, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
  ctx.stroke();
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.arc(100, 100, 98, 0 * (Math.PI / 180), 360 * (Math.PI / 180), false);
  ctx.stroke();

  ctx.font = "bold 25px Courier New";
  ctx.fillStyle = "#DC3545";
  ctx.textAlign = "center";
  ctx.fillText("N", canvas.width / 2, 23);

  ctx.font = "16px Courier New";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("NE", 162, 46);

  ctx.font = "25px Courier New";
  ctx.fillStyle = "#white";
  ctx.textAlign = "center";
  ctx.fillText("E", canvas.width - 15, canvas.height / 2 + 8);

  ctx.font = "16px Courier New";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("SE", 164, 160);

  ctx.font = "25px Courier New";
  ctx.fillStyle = "#white";
  ctx.textAlign = "center";
  ctx.fillText("S", canvas.width / 2, canvas.height - 6);

  ctx.font = "16px Courier New";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("SW", 35, 160);

  ctx.font = "25px Courier New";
  ctx.fillStyle = "#white";
  ctx.textAlign = "center";
  ctx.fillText("W", 15, canvas.height / 2 + 8);

  ctx.font = "16px Courier New";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("NW", 39, 46);

  ctx.font = "30px Arial";
  ctx.fillStyle = "#17A2B8";
  ctx.textAlign = "center";
  ctx.fillText(last.windspeed.toFixed(1), canvas.width / 2, canvas.height / 2);

  ctx.font = "16px Arial";
  ctx.fillStyle = "17A2B8";
  ctx.textAlign = "center";
  ctx.fillText("km/h", canvas.width / 2, canvas.height / 2 + 20);

  const cos = Math.cos((last.winddir) * Math.PI / 180 - Math.PI / 2);
  const sin = Math.sin((last.winddir) * Math.PI / 180 - Math.PI / 2);
  const x0 = 100 + 70 * cos;
  const y0 = 100 + 70 * sin;
  const x1 = 100 + 50 * cos;
  const y1 = 100 + 50 * sin;
  const x2 = 100 + 60 * Math.cos((last.winddir - 7) * Math.PI / 180 - Math.PI / 2);
  const y2 = 100 + 60 * Math.sin((last.winddir - 7) * Math.PI / 180 - Math.PI / 2);
  const x3 = 100 + 60 * Math.cos((last.winddir + 7) * Math.PI / 180 - Math.PI / 2);
  const y3 = 100 + 60 * Math.sin((last.winddir + 7) * Math.PI / 180 - Math.PI / 2);
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#17A2B8';
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x1, y1);
  ctx.moveTo(x3, y3);
  ctx.lineTo(x1, y1);
  ctx.stroke();

  for (var i = 0; i < 360; i += 22.5) {
    const cos = Math.cos((i) * Math.PI / 180 - Math.PI / 2);
    const sin = Math.sin((i) * Math.PI / 180 - Math.PI / 2);
    const x0 = 100 + 76 * cos;
    const y0 = 100 + 76 * sin;

    const x1 = 100 + 70 * cos;
    const y1 = 100 + 70 * sin;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'white';
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
}

