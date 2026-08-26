// Continuous local simulation for three stations against a dev stack on
// :8089. Realistic day-curve values with slow random drift.
//
//   GoGen  st_gogen01  POST /setData/st_gogen01           every ~16 s
//   Garni  st_garni01  GET  /weatherstation/update...    every ~30 s
//   Dom    (built-in)  POST /setDomData?PASSKEY=...      every ~20 s
//
// DOM_PASSKEY must match the app's effective value (dev fallback:
// "dev-dom-passkey" when DOM_PASSKEY is empty and ENV != prod).

const BASE = process.env.SIM_BASE_URL ?? "http://localhost:8089";
const GARNI_PASSKEY = "garni-dev-passkey-01";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function utcDateutc(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate(),
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds(),
  )}`;
}

// Diurnal curve peaking at 15:00 local, plus noise
function dayCurve(hourFrac, peak, amplitude, noise) {
  const phase = ((hourFrac - 15 + 24) % 24) / 24;
  return peak - amplitude * Math.cos(phase * 2 * Math.PI) / 2 + (Math.random() - 0.5) * noise;
}

let dailyrainGogen = 0.4;
let dailyrainGarni = 0.0;
let raining = false;

async function post(url, body, isJson) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": isJson
        ? "application/json; charset=utf-8"
        : "application/x-www-form-urlencoded",
    },
    body: isJson ? JSON.stringify(body) : new URLSearchParams(body).toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`${new Date().toISOString()} FAIL ${url} -> ${res.status} ${text}`);
  }
  return res.ok;
}

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error(`${new Date().toISOString()} FAIL ${url} -> ${res.status} ${text}`);
  }
  return res.ok;
}

async function sendGoGen(now) {
  const hourFrac = now.getHours() + now.getMinutes() / 60;
  if (Math.random() < 0.03) raining = !raining; // occasional rain episodes
  const rainrate = raining ? 0.02 + Math.random() * 0.45 : 0;
  dailyrainGogen += (rainrate * 16) / 3600; // in over 16 s
  const tempf = dayCurve(hourFrac, 78, 14, 1.2);
  const body = {
    PASSKEY: "dummy",
    stationtype: "EasyWeatherV1.5.2",
    dateutc: utcDateutc(now),
    tempinf: (dayCurve(hourFrac, 74, 6, 0.6)).toFixed(1),
    humidityin: String(Math.round(58 + Math.random() * 4)),
    baromrelin: (30.05 + Math.sin(Date.now() / 36e5) * 0.08).toFixed(3),
    baromabsin: (29.62 + Math.sin(Date.now() / 36e5) * 0.08).toFixed(3),
    tempf: tempf.toFixed(1),
    humidity: String(Math.round(62 + Math.random() * 8)),
    winddir: String(Math.round((200 + Math.sin(Date.now() / 6e4) * 60 + 360) % 360)),
    windspeedmph: (2 + Math.random() * 4).toFixed(1),
    windgustmph: (6 + Math.random() * 5).toFixed(1),
    maxdailygust: (12 + Math.random() * 3).toFixed(1),
    rainratein: rainrate.toFixed(3),
    eventrainin: "0.000",
    hourlyrainin: (rainrate > 0 ? rainrate.toFixed(3) : "0.000"),
    dailyrainin: dailyrainGogen.toFixed(3),
    weeklyrainin: (dailyrainGogen + 1.8).toFixed(3),
    monthlyrainin: (dailyrainGogen + 12.4).toFixed(3),
    totalrainin: (dailyrainGogen + 40.9).toFixed(3),
    solarradiation: (Math.max(0, Math.sin(((hourFrac - 6) / 12) * Math.PI)) * 850).toFixed(2),
    uv: String(Math.round(Math.max(0, Math.sin(((hourFrac - 6) / 12) * Math.PI)) * 6)),
    wh65batt: 0,
    freq: "868M",
    model: "WS2900_V2.01.10",
  };
  return post(`${BASE}/setData/st_gogen01`, body, false);
}

async function sendGarni(now) {
  const hourFrac = now.getHours() + now.getMinutes() / 60;
  if (Math.random() < 0.02) raining = !raining;
  const rainin = raining ? 0.02 + Math.random() * 0.35 : 0.0;
  dailyrainGarni += rainin * (30 / 3600);
  const body = new URLSearchParams({
    ID: GARNI_PASSKEY,
    PASSWORD: "",
    action: "updateraww",
    realtime: "1",
    rtfreq: "5",
    dateutc: "now",
    baromin: (29.98 + Math.sin(Date.now() / 36e5) * 0.06).toFixed(2),
    tempf: dayCurve(hourFrac, 74, 13, 1.0).toFixed(1),
    dewptf: (55 + Math.random() * 3).toFixed(1),
    humidity: String(Math.round(64 + Math.random() * 7)),
    windspeedmph: (1.5 + Math.random() * 3.5).toFixed(1),
    windgustmph: (5 + Math.random() * 4).toFixed(1),
    winddir: String(Math.round((230 + Math.sin(Date.now() / 7e4) * 70 + 360) % 360)),
    rainin: rainin.toFixed(2),
    dailyrainin: dailyrainGarni.toFixed(2),
    solarradiation: (Math.max(0, Math.sin(((hourFrac - 6) / 12) * Math.PI)) * 800).toFixed(2),
    UV: (Math.max(0, Math.sin(((hourFrac - 6) / 12) * Math.PI)) * 5.5).toFixed(1),
    indoortempf: (72 + Math.random()).toFixed(1),
    indoorhumidity: String(Math.round(66 + Math.random() * 4)),
  });
  return get(`${BASE}/weatherstation/updateweatherstation.php?${body.toString()}`);
}

async function sendDom(now) {
  const hourFrac = now.getHours() + now.getMinutes() / 60;
  const outside = dayCurve(hourFrac, 26, 9, 0.8);
  const body = {
    timestamp: now.toISOString(),
    vonku: {
      temp: Number(outside.toFixed(1)),
      humidity: Math.round(55 + Math.random() * 10),
      rain: Math.random() < 0.02,
    },
    tarif: { tarif: hourFrac >= 16 && hourFrac < 20 ? 2 : 1 },
    obyvacka_vzduch: { temp: 21.6, reqall: 22 },
    obyvacka_podlaha: { temp: 23.4, kuri: true, leto: false, low: false },
    pracovna_vzduch: { temp: 21.1, reqall: 21.5 },
    pracovna_podlaha: { temp: 22.8, kuri: false, leto: false, low: false },
    spalna_vzduch: { temp: 20.4, reqall: 21 },
    spalna_podlaha: { temp: 23.1, kuri: true, leto: false, low: false },
    chalani_vzduch: { temp: 20.8, reqall: 21 },
    chalani_podlaha: { temp: 22.2, kuri: false, leto: true, low: false },
    petra_vzduch: { temp: 21.3, reqall: 21.5 },
    petra_podlaha: { temp: 22.6, kuri: false, leto: false, low: true },
  };
  return post(`${BASE}/setDomData?PASSKEY=dev-dom-passkey`, body, true);
}

console.log(`simulating GoGen(16s) Garni(30s) Dom(20s) -> ${BASE}`);

let gogenOk = 0;
let garniOk = 0;
let domOk = 0;

setInterval(async () => {
  if (await sendGoGen(new Date())) gogenOk += 1;
}, 16000);

setInterval(async () => {
  if (await sendGarni(new Date())) garniOk += 1;
}, 30000);

setInterval(async () => {
  if (await sendDom(new Date())) domOk += 1;
}, 20000);

setInterval(() => {
  console.log(
    `${new Date().toISOString()} ok: gogen=${gogenOk} garni=${garniOk} dom=${domOk}`,
  );
}, 60000);

// Fire one round immediately so data appears without waiting
sendGoGen(new Date());
sendGarni(new Date());
sendDom(new Date());
