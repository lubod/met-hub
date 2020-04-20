const { Pool } = require('pg');
var express = require('express');

var app = express();
var fs = require("fs");

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "index.htm");
})

app.get('/getData/vonku', function (req, res) {
    res.type('application/json');
    const data = getData('vonku').then(data => res.send(data));
})

app.get('/getData/:room', function (req, res) {
    console.log(req.params.room);
    res.type('application/json');
    const data = getData(req.params.room).then(data => res.send(data));
})

var server = app.listen(8082, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Listening at http://%s:%s", host, port)

})

async function getData(table) {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432
    });

    const client = await pool.connect();
    console.log('connected ' + table);
    try {
        const res = await client.query('SELECT * FROM ' + table + ' where timestamp > now() - \'24 hour\'::interval order by timestamp desc;');
        return res.rows;
    } catch (e) {
        console.log(e);
    } finally {
        client.end();
    }
}

