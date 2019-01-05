google.load('visualization', '1', {packages: ['corechart']});

google.setOnLoadCallback(loadData);

var loading = 0;

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function loadData() {
	document.getElementById("showButton").textContent="Loading ...";
	document.getElementById("showButton").disabled=true;
	var room = document.getElementById("room").value.split(",");
	var day = document.getElementById("day").value;
	var month = document.getElementById("month").value;
	var year = document.getElementById("year").value;
	httpGetAsync("/getData?file=" + room[0] + "_" + day + month + year, drawBasic1);
	loading+=1;
	httpGetAsync("/getData?file=" + room[1] + "_" + day + month + year, drawBasic2);
	loading+=1;
	httpGetAsync("/getData?file=" + "k_18_" + day + month + year, drawBasic3);
	loading+=1;
}

function drawBasic1(res) {
	drawBasic(res, 'chart1_div');
}

function drawBasic2(res) {
	drawBasic(res, 'chart2_div');
}

function drawBasic3(res) {
      var data = new google.visualization.DataTable();
      data.addColumn('datetime', 'Time');
      data.addColumn('number', 'Tarif');

	var lines = res.split("\n");
	for (var i = 0; i < lines.length; i++) {
		//04.01.2015 00:00:01 1
		var line = lines[i];
		if (line.length < 21) {
			continue;
		}
		var tarif = parseInt(line.substr(20, 1) - 1); 
		data.addRow([new Date(line.substr(6, 4), line.substr(3, 2) - 1, line.substr(0, 2), line.substr(11, 2), line.substr(14, 2), 0, 0), tarif]);
	}
      var options = {
        hAxis: {
          title: 'Time',
		  format: 'dd.MM.yyyy HH:mm'
        },
        vAxis: {
          title: 'On'
        },
		series: {0: {type: 'bars'}},
		height: 350
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart3_div'));

      chart.draw(data, options);
		loading-=1;
	if (loading <= 0) {
		document.getElementById("showButton").textContent="Show";
		document.getElementById("showButton").disabled=false;
	}
}

function drawBasic(res, div) {
	var data = new google.visualization.DataTable();
	var room = res.substr(21, 13);
	data.addColumn('datetime', 'Time');
	data.addColumn('number', room + " measured");
	data.addColumn('number', room + " set");
	data.addColumn('number', 'Heating');

	var lines = res.split("\n");
	for (var i = 0; i < lines.length; i++) {
		//04.01.2015 00:00:01 1Obyv kuch pod022.0+30030.0000.012.0000000000
		var line = lines[i];
		if (line.length < 65) {
			continue;
		}
                var temperature;
                if (line[34] == '0') {
                        temperature = parseFloat(line.substr(35, 4));
                }
                else {
                        temperature = parseFloat(line.substr(34, 5));
                }
		var set = parseInt(line.substr(39, 3)); 
		if (room == "Obyv kuch vzd") {
			temperature -= 0.9;
			set -= 1;
		}
		data.addRow([new Date(line.substr(6, 4), line.substr(3, 2) - 1, line.substr(0, 2), line.substr(11, 2), line.substr(14, 2), 0, 0), temperature, set, set + (set/10 * parseInt(line.substr(56, 1)))]);
	}
	var options = {
        	hAxis: {
          	title: 'Time',
			format: 'dd.MM.yyyy HH:mm'
        	},
        	vAxis: {
          		title: '°C',
			viewWindow: {}
        	},
		series: {2: { }},  
		height: 350
	};

	var chart = new google.visualization.LineChart(document.getElementById(div));

	chart.draw(data, options);
	loading-=1;
	if (loading <= 0) {
		document.getElementById("showButton").textContent="Show";
		document.getElementById("showButton").disabled=false;
	}
}
