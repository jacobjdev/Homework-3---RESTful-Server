// Built-in Node.js modules
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

// NPM modules
var express = require('express');
var sqlite3 = require('sqlite3');
var JSONtoXML = require('js2xmlparser');


//var public_dir = path.join(__dirname, 'public');

var db_filename = path.join(__dirname, 'database', 'stpaul_crime.sqlite3');
app.use(bodyParser.urlencoded({extended:true}));
var app = express();
var port = 8000;

var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});


app.get('/codes', (req,res) => {

});


app.get('/neighborhoods',(req,res) => {

});


app.get('/incidents', (req,res) => {

});

app.put('/new-incident', (req,res) =>{


});