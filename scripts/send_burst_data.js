async function sendBurst() {
  const pad = (n) => String(n).padStart(2, "0");
  const baseTime = Date.now();
  const iterations = 12; // 12 updates across the last hour to current time

  console.log(`Generating and sending ${iterations} batches of telemetry for all stations...`);

  for (let step = iterations - 1; step >= 0; step--) {
    const timestamp = new Date(baseTime - step * 5 * 60 * 1000);
    const dateUtcStr = `${timestamp.getUTCFullYear()}-${pad(timestamp.getUTCMonth() + 1)}-${pad(timestamp.getUTCDate())} ` +
                       `${pad(timestamp.getUTCHours())}:${pad(timestamp.getUTCMinutes())}:${pad(timestamp.getUTCSeconds())}`;

    // Temperature & wind progression
    const progress = (iterations - step) / iterations;
    const tempF1 = Number((68.0 + Math.sin(progress * Math.PI) * 4.0 + (Math.random() * 0.4)).toFixed(1));
    const tempC1 = Number(((tempF1 - 32) * 5 / 9).toFixed(1));
    const winddir1 = Math.round((120 + Math.sin(progress * 2) * 40 + 360) % 360);
    const windspeedMph1 = Number((5.5 + Math.random() * 3.0).toFixed(1));
    const windgustMph1 = Number((windspeedMph1 + 3.0 + Math.random() * 2.0).toFixed(1));
    const solar1 = Number((420 + Math.sin(progress * Math.PI) * 180 + Math.random() * 20).toFixed(1));
    const uv1 = Math.max(1, Math.round(solar1 / 90));

    // 1. Station 1 (GoGen)
    const station1Data = {
      PASSKEY: "localpasskey",
      stationtype: "EasyWeatherV1.5.2",
      dateutc: dateUtcStr,
      tempinf: 72.5,
      humidityin: 48,
      baromrelin: 30.12,
      baromabsin: 29.95,
      tempf: tempF1,
      humidity: Math.round(52 + Math.cos(progress * Math.PI) * 6),
      winddir: winddir1,
      windspeedmph: windspeedMph1,
      windgustmph: windgustMph1,
      maxdailygust: 15.5,
      rainratein: step === 3 ? 0.12 : 0.0,
      eventrainin: 0.25,
      hourlyrainin: 0.25,
      dailyrainin: 0.45,
      weeklyrainin: 1.1,
      monthlyrainin: 2.3,
      totalrainin: 6.2,
      solarradiation: solar1,
      uv: uv1
    };

    await fetch("http://localhost:8089/setData/station1", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(station1Data)
    });

    // 2. Station 2 (Garni)
    const station2Params = new URLSearchParams({
      ID: "garnipasskey",
      PASSWORD: "",
      action: "updateraww",
      realtime: "1",
      rtfreq: "5",
      dateutc: dateUtcStr,
      baromin: "30.08",
      tempf: String(Number((62.0 + Math.sin(progress * Math.PI) * 3.5).toFixed(1))),
      dewptf: "54.2",
      humidity: "58",
      windspeedmph: String(Number((7.2 + Math.random() * 4.0).toFixed(1))),
      windgustmph: String(Number((12.5 + Math.random() * 3.0).toFixed(1))),
      winddir: String(Math.round((210 + Math.sin(progress * 3) * 50 + 360) % 360)),
      rainin: "0.0",
      dailyrainin: "0.55",
      solarradiation: String(solar1),
      UV: String(uv1),
      indoortempf: "71.8",
      indoorhumidity: "49"
    });

    await fetch(`http://localhost:8089/weatherstation/updateweatherstation.php?${station2Params.toString()}`);

    // 3. Station Ecowitt
    const ecowittData = {
      PASSKEY: "ecowittpasskey",
      stationtype: "GW2000A_V2.1.4",
      dateutc: dateUtcStr,
      tempc: String(Number((23.0 + Math.sin(progress * Math.PI) * 2.5).toFixed(1))),
      humidity: String(Math.round(55 - progress * 4)),
      tempinc: "22.6",
      humidityin: "47",
      windspeedkmh: String(Number((14.0 + Math.random() * 6).toFixed(1))),
      windgustkmh: String(Number((22.0 + Math.random() * 8).toFixed(1))),
      maxdailygustkmh: "26.4",
      winddir: String(Math.round((85 + Math.sin(progress * 2) * 30 + 360) % 360)),
      baromabshpa: "1014.2",
      baromrelhpa: "1017.5",
      rainratemm: "0.0",
      eventrainmm: "3.5",
      hourlyrainmm: "4.8",
      dailyrainmm: "9.2",
      weeklyrainmm: "21.5",
      monthlyrainmm: "48.0",
      totalrainmm: "128.5",
      solarradiation: String(solar1),
      uv: String(uv1)
    };

    await fetch("http://localhost:8089/data/report", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(ecowittData)
    });

    // 4. Station JSON
    const jsonPayload = {
      timestamp: timestamp.toISOString(),
      temp: Number((18.5 + Math.sin(progress * Math.PI) * 2.0).toFixed(1)),
      humidity: Math.round(62 - progress * 5),
      tempin: 22.0,
      humidityin: 48,
      windspeed: Number((16.0 + Math.random() * 5.0).toFixed(1)),
      windgust: Number((24.0 + Math.random() * 7.0).toFixed(1)),
      maxdailygust: 28.2,
      winddir: Math.round((320 + Math.sin(progress * 2) * 45 + 360) % 360),
      feelslike: Number((18.0 + Math.sin(progress * Math.PI) * 2.0).toFixed(1)),
      dewpt: 11.8,
      pressurerel: 1011.5,
      pressureabs: 1007.8,
      rainrate: 0.0,
      eventrain: 3.2,
      hourlyrain: 4.1,
      dailyrain: 7.8,
      weeklyrain: 18.5,
      monthlyrain: 41.0,
      totalrain: 106.2,
      solarradiation: solar1,
      uv: uv1
    };

    await fetch("http://localhost:8089/api/ingest/station_json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-passkey": "jsonpasskey"
      },
      body: JSON.stringify(jsonPayload)
    });

    // 5. Dom
    const domData = {
      timestamp: timestamp.toISOString(),
      vonku: { temp: tempC1, humidity: 56.0, rain: false },
      tarif: { tarif: (step % 4 === 0) ? 2 : 1 },
      obyvacka_vzduch: { temp: 22.0, reqall: 21.5 },
      obyvacka_podlaha: { temp: 22.5, kuri: false, leto: false, low: false },
      pracovna_vzduch: { temp: 21.5, reqall: 21.0 },
      pracovna_podlaha: { temp: 22.0, kuri: false, leto: false, low: false },
      spalna_vzduch: { temp: 20.8, reqall: 20.5 },
      spalna_podlaha: { temp: 21.8, kuri: false, leto: false, low: false },
      chalani_vzduch: { temp: 22.2, reqall: 22.0 },
      chalani_podlaha: { temp: 22.8, kuri: false, leto: false, low: false },
      petra_vzduch: { temp: 21.8, reqall: 21.5 },
      petra_podlaha: { temp: 22.4, kuri: false, leto: false, low: false }
    };

    await fetch("http://localhost:8089/setDomData?PASSKEY=dev-dom-passkey", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(domData)
    });

    process.stdout.write(`Batch ${iterations - step}/${iterations} sent (${timestamp.toISOString().slice(11, 19)} UTC)\n`);
  }

  console.log("✓ All 12 telemetry batches successfully emitted across all 5 stations!");
}

sendBurst().catch(console.error);
