import fetch from "node-fetch";
import axios from "axios";
import {
  IDomExternalData,
  IDomRoomData,
  IDomTarifData,
} from "../common/domModel";

const DOM_PASSKEY = process.env.DOM_PASSKEY || "";

const POS_ACTUALTEMP = 14;
const POS_REQUIRED = 19;
const POS_REQUIREDALL = 22;
const POS_USEROFFSET = 27;
const POS_MAXOFFSET = 32;
const POS_S_TOPI = 36;
// const POS_S_OKNO = 37;
// const POS_S_KARTA = 38;
// const POS_VALIDATE = 39;
const POS_LOW = 42;
const POS_LETO = 43;
// const POS_S_CHLADI = 44;

const tables: any = {
  10: "obyvacka_vzduch",
  0: "obyvacka_podlaha",
  11: "zadverie_vzduch",
  1: "zadverie_podlaha",
  12: "pracovna_vzduch",
  2: "pracovna_podlaha",
  13: "chodba_vzduch",
  3: "chodba_podlaha",
  14: "satna_vzduch",
  4: "satna_podlaha",
  15: "petra_vzduch",
  5: "petra_podlaha",
  16: "chalani_vzduch",
  6: "chalani_podlaha",
  17: "spalna_vzduch",
  7: "spalna_podlaha",
  8: "kupelna_dole",
  9: "kupelna_hore",
  //    18: 'tarif',
  //    19: 'vonku',
  //    20: 'vonku',
};

const postRequest = {
  credentials: "omit",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Content-Type": "application/x-www-form-urlencoded",
    "Upgrade-Insecure-Requests": "1",
    "X-Requested-With": "XMLHttpRequest",
    "Cache-Control": "max-age=0",
  },
  method: "POST",
  mode: "cors",
  body: "",
  referrer: "",
};

async function login() {
  postRequest.referrer =
    "http://192.168.1.113/login.html?btnRelogin=Znovu+p%C5%99ihl%C3%A1sit";
  postRequest.body = "loginName=admin&passwd=1234";
  const res = await fetch("http://192.168.1.113/menu.html", postRequest);
  return res.text();
}

async function getTarif() {
  postRequest.referrer = "http://192.168.1.113/h_inforoom.html";
  postRequest.body = "param+";
  const res = await fetch("http://192.168.1.113/loadHDO", postRequest);
  return res.text();
}

async function getCount() {
  postRequest.referrer = "http://192.168.1.113/h_inforoom.html";
  postRequest.body = "param+";
  const res = await fetch("http://192.168.1.113/numOfRooms", postRequest);
  return res.text();
}

async function getData(param: number) {
  postRequest.referrer = "http://192.168.1.113/h_inforoom.html";
  postRequest.body = `param=${param}`;
  const res = await fetch("http://192.168.1.113/wholeRoom", postRequest);
  return res.text();
}

async function getExternalData() {
  try {
    const res = await axios.get("http://192.168.1.5/getTH");
    return res.data;
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function postData(data: any) {
  try {
    axios.post("https://www.met-hub.com/setDomData", data, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function decode(text: string) {
  const data = {} as IDomRoomData;
  if (text.length === 45) {
    data.temp = parseFloat(text.substr(POS_ACTUALTEMP, 5));
    data.req = parseFloat(text.substr(POS_REQUIRED, 3));
    data.reqall = parseFloat(text.substr(POS_REQUIREDALL, 5));
    data.useroffset = parseFloat(text.substr(POS_USEROFFSET, 5));
    data.maxoffset = parseFloat(text.substr(POS_MAXOFFSET, 4));
    data.kuri = parseInt(text.substr(POS_S_TOPI, 1), 10);
    data.low = parseInt(text.substr(POS_LOW, 1), 10);
    data.leto = parseInt(text.substr(POS_LETO, 1), 10);
    //        data.text = text;
    return data;
  }
  throw new Error(`Cannot decode ${text}`);
}

function decodeTarif(text: string) {
  const data = {} as IDomTarifData;
  if (text.length === 1) {
    data.tarif = parseInt(text, 10);
    //        data.text = text;
    return data;
  }
  return null;
}

function decodeExternal(text: string) {
  const data = {} as IDomExternalData;
  if (text !== "") {
    const th = text.match(/Temp=(.*)\* {2}Humidity=(.*)%\nRain=(.*\n)/);
    data.temp = parseFloat(th[1]);
    data.humidity = parseFloat(th[2]);
    data.rain = parseInt(th[3], 10);
    //        data.text = text;
  }
  return data;
}

async function pollData() {
  const data: any = {};

  console.log("pollData start");
  let res = await login();
  //    console.log(res);
  const count = await getCount();
  //    console.log(count);
  for (let i = 0; i < parseInt(count, 10); i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const idata = await getData(i);
    const decoded = decode(idata);
    data[tables[i]] = decoded;
  }

  try {
    res = await getExternalData();
    data.vonku = decodeExternal(res);
  } catch (e) {
    console.log(e);
    data.vonku = {} as IDomExternalData;
    data.vonku.temp = null;
    data.vonku.humidity = null;
    data.vonku.rain = null;
  }

  res = await getTarif();
  //    console.log(res);
  data.tarif = decodeTarif(res);
  //    console.log(data['tarif']);
  data.timestamp = new Date();
  data.dateutc = `${data.timestamp.getUTCFullYear()}-${
    data.timestamp.getUTCMonth() + 1
  }-${data.timestamp.getUTCDate()} ${data.timestamp.getUTCHours()}:${data.timestamp.getUTCMinutes()}:${data.timestamp.getUTCSeconds()}`;
  return data;
}

async function poll() {
  const data = await pollData();
  data.PASSKEY = DOM_PASSKEY;
  console.log(data);
  const res = await postData(data);
  console.log(res);
}

poll();
setInterval(poll, 60000);
