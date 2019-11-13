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
var app  = express();
var port = 8000;
app.use(bodyParser.urlencoded({extended:true}));


var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});


app.get('/codes', (req,res) => {
    var JsonToSend = {};
    db.each("SELECT * FROM Codes ORDER BY code", (err, row) =>{
        var newCode         = row.code;
        var newIncidntType  = row.incident_type;
        JsonToSend[newCode] = newIncidntType;
    }, () =>{
        console.log(JSON.stringify(JsonToSend, null, 4));
        res.type('json').send(JsonToSend);
    });
});


app.get('/neighborhoods',(req,res) => {
	var neighborhoodJSONToSend = {};
	db.each("SELECT * FROM Neighborhoods ORDER BY neighborhood_number", (err, row) =>{
        var newNeighborhoodNumber = row.neighborhood_number;
        var newNeighborhoodName   = row.neighborhood_name;
        neighborhoodJSONToSend[newNeighborhoodNumber] = newNeighborhoodName;
    }, () =>{
        console.log(JSON.stringify(neighborhoodJSONToSend, null, 4));
        res.type('json').send(neighborhoodJSONToSend);
    });	
});


app.get('/incidents', (req,res) => {
	var incidentObject={};	
	db.each("SELECT * FROM Incidents ORDER BY date_time", (err, row) =>{
        var caseToAdd = {};
        var caseNum = row.case_number;
        // Separating the date and time out separately
		var dateSeparated = row.date_time.substring(0,10);
		var timeSeparated = row.date_time.substring(11,19);
		caseToAdd = {
			date: dateSeparated,
            time: timeSeparated,
            code: row.code,
            incident: row.incident,
            police_grid: row.police_grid,
            neighborhood_number: row.neighborhood_number,
            block: row.block
		};
		incidentObject[caseNum] = caseToAdd;
    }, () =>{
		console.log(JSON.stringify(incidentObject, null, 4));
		res.type('json').send(incidentObject);
    });
});
//curl -X PUT -d "case_number=[NUMBER]&date_time=2019-10-26T02:50:13.000&code=643&incident=Auto Theft&police_grid=62&neighborhood_num=12&block=2X RAYMOND PL" http://localhost:8000/new-incident
app.put('/new-incident', (req,res) =>{
    //WHAT FIELDS ARE REQUIRED TO PROCESS?  OR CAN JUST BE A CASE NUMBER AND THATS IT>  just a case number
    //how to add error checking to make sure contains all the required fields?
    var duplicateCaseNumber = false;
    var case_number = req.body.case_number;
    db.each("SELECT case_number FROM Incidents", (err, row) =>{
        if(row.case_number === case_number){
            duplicateCaseNumber = true;
        }
    }, () => {
    if(duplicateCaseNumber){
        res.status(500).send('error:case ID already exists');
    }else{
        // do the processing to upload
        var newCaseNumber      = req.body.case_number;
        var newDateTime        = req.body.date_time;
        //need to split the date time into two fields
        var newCode            = req.body.code;
        var newIncident        = req.body.incident;
        var newPoliceGrid      = req.police_grid;
        var newNeighborhoodNum = req.neighborhood_num;
        var newBlock           = req.block;
        db.run("INSERT INTO Incidents VALUES (?, ?, ?, ?, ?, ?, ?)", [newCaseNumber,newDateTime,newCode,newIncident,newPoliceGrid,newNeighborhoodNum,newBlock], (err, row) => {
            if(err){
                console.log(err);
                console.log("update did not work sucesfully");
                res.status(500).status('updating database failed for some reason');
            }else{
                console.log("updated sucessfully")
                res.status(200).status('database updated sucessfullyw');
            }
        });
    
    }
    });
});
//https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
//https://www.w3schools.com/sql/sql_insert.asp

console.log('Now listening on port ' + port);
var server = app.listen(port);