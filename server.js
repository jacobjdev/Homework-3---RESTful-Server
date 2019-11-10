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
var app = express();
var port = 8000;
app.use(bodyParser.urlencoded({extended:true}));

var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});


app.get('/codes', (req,res) => {
    var JsonToSend = {codes:[]};
    var stringToStringify = "";
    //want the key to be the code string and the value being what the type is
    //SELECT * FROM Codes ORDER BY code
    db.each("SELECT * FROM Codes ORDER BY code", (err, row) =>{
        // var newJSONEntry = {code: row.code, incident_type:row.incident_type}
        // JsonToSend.codes.push(newJSONEntry);
        stringToStringify += "\""+ parseInt(row.code) +"\""+ ":" +"\""+ row.incident_type + "\""+ ",";
    }, () =>{
        // console.log(JSON.parse(stringToStringify));
        stringToStringify = stringToStringify.substring(0,stringToStringify.length-1);
        console.log(stringToStringify)
        console.log(JSON.parse(stringToStringify));
    });
});


app.get('/neighborhoods',(req,res) => {

});


app.get('/incidents', (req,res) => {

});

app.put('/new-incident', (req,res) =>{


});

console.log('Now listening on port ' + port);
var server = app.listen(port);