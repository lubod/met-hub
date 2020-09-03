const { Pool } = require('pg')
const fs = require('fs')

const POS_ACTUALTEMP = 14,
  POS_REQUIRED = 19,
  POS_REQUIREDALL = 22,
  POS_USEROFFSET = 27,
  POS_MAXOFFSET = 32,
  POS_S_TOPI = 36,
  POS_S_OKNO = 37,
  POS_S_KARTA = 38,
  POS_VALIDATE = 39,
  POS_LOW = 42,
  POS_LETO = 43,
  POS_S_CHLADI = 44;

const OBYVACKA_VZDUCH = 10,
  OBYVACKA_PODLAHA = 0,
  ZADVERIE_VZDUCH = 11,
  ZADVERIE_PODLAHA = 1,
  PRACOVNA_VZDUCH = 12,
  PRACOVNA_PODLAHA = 2,
  CHODBA_VZDUCH = 13,
  CHODBA_PODLAHA = 3,
  SATNA_VZDUCH = 14,
  SATNA_PODLAHA = 4,
  PETRA_VZDUCH = 15,
  PETRA_PODLAHA = 5,
  CHALANI_VZDUCH = 16,
  CHALANI_PODLAHA = 6,
  SPALNA_VZDUCH = 17,
  SPALNA_PODLAHA = 7,
  KUPELNA_DOLE = 8,
  KUPELNA_HORE = 9;

function decodeTimestamp(line) {
  const day = line.substr(0, 2);
  const mon = line.substr(3, 2);
  const year = line.substr(6, 4);
  const hour = line.substr(11, 2);
  const min = line.substr(14, 2);
  const sec = line.substr(17, 2);
  return new Date(year, mon - 1, day, hour, min, sec);
}

function decodeTarif(data) {
  const decoded_data = {};
  decoded_data.tarif = parseInt(data.substr(0, 1));
  return decoded_data;
}

function decode(data) {
  const decoded_data = {};
  decoded_data.temp = parseFloat(data.substr(POS_ACTUALTEMP, 5));
  decoded_data.req = parseFloat(data.substr(POS_REQUIRED, 3));
  decoded_data.reqall = parseFloat(data.substr(POS_REQUIREDALL, 5));
  decoded_data.useroffset = parseFloat(data.substr(POS_USEROFFSET, 5));
  decoded_data.maxoffset = parseFloat(data.substr(POS_MAXOFFSET, 4));
  decoded_data.kuri = parseInt(data.substr(POS_S_TOPI, 1));
  decoded_data.low = parseInt(data.substr(POS_LOW, 1));
  decoded_data.leto = parseInt(data.substr(POS_LETO, 1));
  return decoded_data;
}

function decodeTemp(data) {
  let num = data.substr(POS_ACTUALTEMP, 5)
  if (num.startsWith('0-')) {
    num = num.substr(1);
  }
  return parseFloat(num);
}

function decodeHumidity(data) {
  return parseFloat(data.substr(POS_ACTUALTEMP, 5));
}

//                     012345678901234567890123456789012345678901234 

// 14.01.2020 23:59:01 1

// 04.01.2020 12:45:01 1Obyv kuch vzd020.1+23023.0000.012.0100000000
// 04.01.2020 12:45:01 1Obyv kuch pod022.5+30030.0000.012.0100000000
// 04.01.2020 09:45:02 1Obyv kuch vzd018.1+23023.0000.012.0000000000
// 04.01.2020 09:45:02 1Obyv kuch pod018.3+30030.0000.012.0000000000
// 14.01.2020 17:59:01 1Obyv kuch pod024.4+30030.0000.012.0100000000
//{
//  '0': '1Obyv kuch pod021.8+00000.0000.012.0000000010',
// '1': '1Zadveri pod  022.1+00000.0000.005.0000000010',
//  '2': '1Pracovna pod 021.0+00000.0000.005.0000000010',
//  '3': '1Chodba pod   022.9+00000.0000.005.0000000010',
//  '4': '1Satna pod    022.2+00000.0000.005.0000000010',
//  '5': '1Pokoj 204 pod023.1+00000.0000.005.0000000010',
//  '6': '1Pokoj 205 pod023.3+00000.0000.005.0000000010',
//  '7': '1Loznice 206 p022.9+00000.0000.005.0000000010',
//  '8': '1Koupe 102 pod021.6+00000.0000.005.0000000010',
//  '9': '1Koupe 202 pod022.3+00000.0000.005.0000000010',
//  '10': '1Obyv kuch vzd024.4+00000.0000.012.0000000010',
//  '11': '1Zadveri vzd  022.8+00000.0000.012.0000000010',
//  '12': '1Pracovna vzd 023.5+00000.0000.012.0000000010',
//  '13': '1Chodba vzd   023.5+00000.0000.012.0000000010',
//  '14': '1Satna vzd    023.0+00000.0000.012.0000000010',
//  '15': '1Pokoj 204 vzd023.6+00000.0000.012.0000000010',
//  '16': '1Pokoj 205 vzd024.2+00000.0000.012.0000000010',
//  '17': '1Loznice 206 v023.3+00000.0000.012.0000000010',
//  '-1': 'Temp=8.4*  Humidity=24.1%\n'
//}

function storeFileData(data, table, fileName) {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432
  })
    ; (async () => {
      // note: we don't try/catch this because if connecting throws an exception
      // we don't need to dispose of the client (it will be undefined)
      const client = await pool.connect();
      console.log('connected');
      let i = 0;
      try {
        await client.query('BEGIN');

        for (i = 0; i < data.length; i++) {
          if (table === 'tarif') {
            queryText = 'insert into ' + table + '(timestamp, tarif) values ($1, $2) ON CONFLICT ON CONSTRAINT ' + table + '_pkey DO NOTHING';
            res = await client.query(queryText, [data[i].timestamp, data[i].tarif]);
          }
          else if (table === 'vonku') {
            queryText = 'insert into ' + table + '(timestamp, temp, humidity ) values ($1, $2, $3) ON CONFLICT ON CONSTRAINT ' + table + '_pkey DO NOTHING';
            res = await client.query(queryText, [data[i].timestamp, data[i].temp, data[i].humidity]);
          }
          else {
            queryText = 'insert into ' + table + '(timestamp, temp, req, reqall, useroffset, maxoffset, kuri, low, leto) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT ON CONSTRAINT ' + table + '_pkey DO NOTHING';
            res = await client.query(queryText, [data[i].timestamp, data[i].temp, data[i].req, data[i].reqall, data[i].useroffset, data[i].maxoffset, data[i].kuri, data[i].low, data[i].leto]);
          }
        }
        await client.query('COMMIT');
        console.log('inserted into' + table);

        fs.unlinkSync(fileName);
        if (table === 'vonku') {
          fs.unlinkSync(fileName.replace('k_19_', 'k_20_'));
        }
      } catch (e) {
        await client.query('ROLLBACK');
        console.log(data[i]);
        throw e;
      } finally {
        client.end();
      }
    })().catch(e => console.error(e.stack))
}

async function getFileData(fileName, table) {
  console.log(fileName + ' ' + table);
  const data = fs.readFileSync(fileName, 'utf8');

  const lines = data.split('\n');
  const all_data = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] != '') {
      const line_data = lines[i].substr(20);
      let decoded_line;
      if (table === 'tarif') {
        decoded_line = decodeTarif(line_data);
        if (!isNaN(decoded_line.tarif)) {
          decoded_line.timestamp = decodeTimestamp(lines[i]);
          decoded_line.orig = lines[i];
          if (!isNaN(decoded_line.timestamp)) {
            all_data.push(decoded_line);
          }
        }
        else {
          console.log(line_data);
        }

      }
      if (table === 'vonku') {
        decoded_line = {};
        if (fileName.includes('k_19_')) {
          decoded_line.temp = decodeTemp(line_data);
        }
        if (fileName.includes('k_20_')) {
          decoded_line.humidity = decodeHumidity(line_data);
        }
        decoded_line.timestamp = decodeTimestamp(lines[i]);
        decoded_line.orig = lines[i];
        if (!isNaN(decoded_line.timestamp)) {
          all_data.push(decoded_line);
        }
        else {
          console.log(line_data);
        }
      } else {
        decoded_line = decode(line_data);
        if (!isNaN(decoded_line.temp) && !isNaN(decoded_line.req) && !isNaN(decoded_line.leto) && decoded_line.low <= 1) {
          decoded_line.timestamp = decodeTimestamp(lines[i]);
          decoded_line.orig = lines[i];
          if (!isNaN(decoded_line.timestamp)) {
            all_data.push(decoded_line);
          }
        }
        else {
          console.log(line_data);
        }
      }
    }
  }
  return all_data;
}


fs.readdir('/home/zaloha/.k/data2/', async function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  for (let i = 0; i < files.length; i++) {
    if (files[i].startsWith('k_19_')) {
      const temp = await getFileData('/home/zaloha/.k/data2/' + files[i], 'vonku');
      const humFile = files[i].replace('k_19_', 'k_20_');
      const humidity = await getFileData('/home/zaloha/.k/data2/' + humFile, 'vonku');
      data = [];
      for (let k = 0; k < temp.length; k++) {
        temp[k].humidity = humidity[k].humidity;
        temp[k].humTimestamp = humidity[k].timestamp;
        temp[k].humOrig = humidity[k].orig;
        if (temp[k].timestamp.getTime() != temp[k].humTimestamp.getTime()) {
          console.log('zle ' + temp[k].timestamp + ' ' + temp[k].humTimestamp);
        }
        data.push(temp[k]);
      }
      //      console.log(data);
      await storeFileData(data, 'vonku', '/home/zaloha/.k/data2/' + files[i]);
      return;
    }
  }
})

