async function sendTestData() {
  const now = new Date();
  
  // Format current UTC time as "YYYY-MM-DD HH:mm:ss"
  const pad = (n) => String(n).padStart(2, '0');
  const dateUtcStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ` +
                     `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

  console.log(`Current UTC Timestamp: ${dateUtcStr}`);

  // 1. Send data for station1 (GoGen Me 3900 type)
  const station1Data = {
    PASSKEY: "localpasskey",
    stationtype: "EasyWeatherV1.5.2",
    dateutc: dateUtcStr,
    tempinf: 72.5,
    humidityin: 50,
    baromrelin: 30.12,
    baromabsin: 29.95,
    tempf: 68.4,
    humidity: 55,
    winddir: 120,
    windspeedmph: 5.4,
    windgustmph: 8.2,
    maxdailygust: 12.0,
    rainratein: 0.05,
    eventrainin: 0.1,
    hourlyrainin: 0.15,
    dailyrainin: 0.2,
    weeklyrainin: 0.5,
    monthlyrainin: 1.2,
    totalrainin: 3.4,
    solarradiation: 450.0,
    uv: 4
  };

  console.log("Sending POST update for station1...");
  try {
    const res1 = await fetch("http://localhost:8089/setData/station1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(station1Data)
    });
    console.log(`station1 Response Status: ${res1.status} (${res1.statusText})`);
  } catch (err) {
    console.error("Error sending station1 data:", err);
  }

  // 2. Send data for station2 (Garni 1025 Arcus type)
  const station2Params = new URLSearchParams({
    ID: "garnipasskey",
    PASSWORD: "",
    action: "updateraww",
    realtime: "1",
    rtfreq: "5",
    dateutc: "now",
    baromin: "30.05",
    tempf: "64.8",
    dewptf: "58.2",
    humidity: "62",
    windspeedmph: "4.2",
    windgustmph: "6.8",
    winddir: "240",
    rainin: "0.0",
    dailyrainin: "0.1",
    solarradiation: "320.0",
    UV: "3.0",
    indoortempf: "71.2",
    indoorhumidity: "52"
  });

  console.log("Sending GET update for station2...");
  try {
    const res2 = await fetch(`http://localhost:8089/weatherstation/updateweatherstation.php?${station2Params.toString()}`);
    console.log(`station2 Response Status: ${res2.status} (${res2.statusText})`);
  } catch (err) {
    console.error("Error sending station2 data:", err);
  }

  // 3. Send data for dom station
  const domData = {
    timestamp: new Date().toISOString(),
    vonku: { temp: 20.4, humidity: 55.2, rain: false },
    tarif: { tarif: 1 },
    obyvacka_vzduch: { temp: 21.8, reqall: 21.5 },
    obyvacka_podlaha: { temp: 22.4, kuri: false, leto: false, low: false },
    pracovna_vzduch: { temp: 21.2, reqall: 21.0 },
    pracovna_podlaha: { temp: 22.1, kuri: false, leto: false, low: false },
    spalna_vzduch: { temp: 21.0, reqall: 21.0 },
    spalna_podlaha: { temp: 22.0, kuri: false, leto: false, low: false },
    chalani_vzduch: { temp: 22.5, reqall: 22.0 },
    chalani_podlaha: { temp: 23.0, kuri: false, leto: false, low: false },
    petra_vzduch: { temp: 21.5, reqall: 21.5 },
    petra_podlaha: { temp: 22.3, kuri: false, leto: false, low: false }
  };

  console.log("Sending POST update for dom station...");
  try {
    const resDom = await fetch("http://localhost:8089/setDomData?PASSKEY=dev-dom-passkey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(domData)
    });
    console.log(`dom Response Status: ${resDom.status} (${resDom.statusText})`);
  } catch (err) {
    console.error("Error sending dom data:", err);
  }

  console.log("Test data generation complete!");
}

sendTestData();
