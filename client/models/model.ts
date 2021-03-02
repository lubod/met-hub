export class StationData {
    timestamp: string;
    time: string;
    date: string;
    place: string;
    tempin: number;
    humidityin: number;
    temp: number;
    humidity: number;
    pressurerel: number;
    pressureabs: number;
    windgust: number;
    windspeed: number;
    winddir: number;
    maxdailygust: number;
    solarradiation: number;
    uv: number;
    rainrate: number;
    eventrain: number;
    hourlyrain: number;
    dailyrain: number;
    weeklyrain: number;
    monthlyrain: number;
    totalrain: number;
}

/*
{ PASSKEY: '33564A0851CC0C0D15FE3353FB8D8B47',
  stationtype: 'EasyWeatherV1.5.2',
  dateutc: '2020-08-13 06:16:31',
  tempinf: '74.1',
  humidityin: '62',
  baromrelin: '30.189',
  baromabsin: '29.442',
  tempf: '71.4',
  humidity: '72',
  winddir: '69',
  windspeedmph: '0.4',
  windgustmph: '1.1',
  maxdailygust: '3.4',
  rainratein: '0.000',
  eventrainin: '0.000',
  hourlyrainin: '0.000',
  dailyrainin: '0.000',
  weeklyrainin: '0.000',
  monthlyrainin: '0.201',
  totalrainin: '0.201',
  solarradiation: '19.45',
  uv: '0',
  wh65batt: '0',
  freq: '868M',
  model: 'WS2900_V2.01.10' }
*/
export class StationDataRaw {
    PASSKEY: string;
    stationtype: string;
    dateutc: string;
    tempinf: number;
    humidityin: number;
    baromrelin: number;
    baromabsin: number;
    tempf: number;
    humidity: number;
    winddir: number;
    windspeedmph: number;
    windgustmph: number;
    maxdailygust: number;
    rainratein: number;
    eventrainin: number;
    hourlyrainin: number;
    dailyrainin: number;
    weeklyrainin: number;
    monthlyrainin: number;
    totalrainin: number;
    solarradiation: number;
    uv: number;
    wh65batt: number;
    freq: string;
    model: string;
}

export class StationTrendData {
    timestamp: Array<string> = new Array<string>();
    tempin: Array<number> = new Array<number>();
    humidityin: Array<number> = new Array<number>();
    temp: Array<number> = new Array<number>();
    humidity: Array<number> = new Array<number>();
    pressurerel: Array<number> = new Array<number>();
    windgust: Array<number> = new Array<number>();
    windspeed: Array<number> = new Array<number>();
    winddir: Array<number> = new Array<number>();
    solarradiation: Array<number> = new Array<number>();
    uv: Array<number> = new Array<number>();
    rainrate: Array<number> = new Array<number>();
}

export class DomData {
    timestamp: string = '';
    time: string = '';
    date: string = '';
    place: string = '';
    temp: number;
    humidity: number;
    rain: number;
    obyvacka_vzduch: number;
    obyvacka_podlaha: number;
    obyvacka_req: number;
    obyvacka_kuri: number;
    obyvacka_leto: number;
    obyvacka_low: number;
    pracovna_vzduch: number;
    pracovna_podlaha: number;
    pracovna_req: number;
    pracovna_kuri: number;
    pracovna_leto: number;
    pracovna_low: number;
    spalna_vzduch: number;
    spalna_podlaha: number;
    spalna_req: number;
    spalna_kuri: number;
    spalna_leto: number;
    spalna_low: number;
    chalani_vzduch: number;
    chalani_podlaha: number;
    chalani_req: number;
    chalani_kuri: number;
    chalani_leto: number;
    chalani_low: number;
    petra_vzduch: number;
    petra_podlaha: number;
    petra_req: number;
    petra_kuri: number;
    petra_leto: number;
    petra_low: number;
}

export class DomTrendData {
    timestamp: Array<string> = new Array<string>();
    temp: Array<number> = new Array<number>();
    humidity: Array<number> = new Array<number>();
    rain: Array<number> = new Array<number>();
    obyvacka_vzduch: Array<number> = new Array<number>();
    obyvacka_podlaha: Array<number> = new Array<number>();
    pracovna_vzduch: Array<number> = new Array<number>();
    pracovna_podlaha: Array<number> = new Array<number>();
    spalna_vzduch: Array<number> = new Array<number>();
    spalna_podlaha: Array<number> = new Array<number>();
    chalani_vzduch: Array<number> = new Array<number>();
    chalani_podlaha: Array<number> = new Array<number>();
    petra_vzduch: Array<number> = new Array<number>();
    petra_podlaha: Array<number> = new Array<number>();
}

export class DomExternalData {
    temp: number;
    humidity: number;
    rain: number;
    text: string;
}

export class DomRoomData {
    temp: number;
    req: number;
    reqall: number;
    useroffset: number;
    maxoffset: number;
    kuri: number;
    low: number;
    leto: number;
    text: string;
}

export class DomTarifData {
    tarif: number;
    text: string;
}

