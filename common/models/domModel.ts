export class DomCfg {
  TABLE = "dom";

  COLUMNS = [
    "temp",
    "humidity",
    "rain",
    "tarif",
    "req",
    "reqall",
    "useroffset",
    "maxoffset",
    "kuri",
    "low",
    "leto",
  ];

  SOCKET_CHANNEL = "dom";

  SOCKET_TREND_CHANNEL = "dom-trend";

  REDIS_LAST_DATA_KEY = "dom-last";

  REDIS_MINUTE_DATA_KEY = "dom-minute-data";

  REDIS_STORE_CHANNEL = "dom-store-pubsub";

  REDIS_TREND_KEY = "dom-trend";
}

export interface IDomExternalData {
  temp: number;
  humidity: number;
  rain: number;
  text: string;
}

export interface IDomRoomData {
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

export interface IDomTarifData {
  tarif: number;
  text: string;
}

export interface IDomDataRaw {
  timestamp: string;
  PASSKEY: string;
  dateutc: string;
  tarif: IDomTarifData;
  vonku: IDomExternalData;
  obyvacka_vzduch: IDomRoomData;
  obyvacka_podlaha: IDomRoomData;
  pracovna_vzduch: IDomRoomData;
  pracovna_podlaha: IDomRoomData;
  spalna_vzduch: IDomRoomData;
  spalna_podlaha: IDomRoomData;
  chalani_vzduch: IDomRoomData;
  chalani_podlaha: IDomRoomData;
  petra_vzduch: IDomRoomData;
  petra_podlaha: IDomRoomData;
  zadverie_vzduch: IDomRoomData;
  zadverie_podlaha: IDomRoomData;
  chodba_vzduch: IDomRoomData;
  chodba_podlaha: IDomRoomData;
  satna_vzduch: IDomRoomData;
  satna_podlaha: IDomRoomData;
  kupelna_hore: IDomRoomData;
  kupelna_dole: IDomRoomData;
}

export interface IDomData {
  timestamp: string;
  time: string;
  date: string;
  place: string;
  temp: number;
  humidity: number;
  rain: number;
  obyvacka_vzduch: number;
  obyvacka_podlaha: number;
  obyvacka_reqall: number;
  obyvacka_kuri: number;
  obyvacka_leto: number;
  obyvacka_low: number;
  pracovna_vzduch: number;
  pracovna_podlaha: number;
  pracovna_reqall: number;
  pracovna_kuri: number;
  pracovna_leto: number;
  pracovna_low: number;
  spalna_vzduch: number;
  spalna_podlaha: number;
  spalna_reqall: number;
  spalna_kuri: number;
  spalna_leto: number;
  spalna_low: number;
  chalani_vzduch: number;
  chalani_podlaha: number;
  chalani_reqall: number;
  chalani_kuri: number;
  chalani_leto: number;
  chalani_low: number;
  petra_vzduch: number;
  petra_podlaha: number;
  petra_reqall: number;
  petra_kuri: number;
  petra_leto: number;
  petra_low: number;
}

export interface IDomTrendData {
  timestamp: Array<string>;
  temp: Array<number>;
  humidity: Array<number>;
  rain: Array<number>;
  obyvacka_vzduch: Array<number>;
  obyvacka_podlaha: Array<number>;
  pracovna_vzduch: Array<number>;
  pracovna_podlaha: Array<number>;
  spalna_vzduch: Array<number>;
  spalna_podlaha: Array<number>;
  chalani_vzduch: Array<number>;
  chalani_podlaha: Array<number>;
  petra_vzduch: Array<number>;
  petra_podlaha: Array<number>;
}
