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
    var stringToStringify = "{ ";
    //want the key to be the code string and the value being what the type is
    //SELECT * FROM Codes ORDER BY code
    db.each("SELECT * FROM Codes ORDER BY code", (err, row) =>{
        var newCode = parseInt(row.code);
        var newIncidntType = row.incident_type;
        //why no newJSONENTRY = {parseInt(row.code):newIncidentType}
        var newJSONEntry = {newCode: newIncidntType};
        JsonToSend.codes.push(newJSONEntry);
        // stringToStringify += "\""+ parseInt(row.code) +"\""+ ":" +"\""+ row.incident_type + "\""+ ",";
    }, () =>{
        // console.log(JSON.parse(stringToStringify));
		// stringToStringify = stringToStringify.substring(0,stringToStringify.length-1)+ "}";
		// res.type('json').send(JSON.parse(stringToStringify));
        //console.log(stringToStringify)
        // console.log(JSON.parse(stringToStringify));
        console.log(JSON.stringify(JsonToSend));
    });
});

app.get('/codes2', (req,res) => {
    var codesString = "{ ";
    db.each('SELECT * FROM Codes ORDER BY code',(err, row) =>{
        //console.log(rows);
        codesString += "\"" + parseInt(row.code) + "\"" + ":" + "\"" + row.incident_type + "\"" + ",";
        codesString = codesString.substring(0,codesString.length-1)+"}";
    }, () =>{
        res.type('json').send(JSON.parse(codesString))
    });
    // console.log(JSON.stringify(JsonToSend));
});
app.get('/codes3', (req,res)=> {
    var JSONStuff;
    db.each('SELECT * FROM Codes ORDER BY codes', (err, row) =>{

        JSONStuff = JSONStuff + row.code
    }, () => {

    });
});


app.get('/neighborhoods',(req,res) => {
	var neighborhoodString = "{ ";
	db.each("SELECT * FROM Neighborhoods ORDER BY neighborhood_number", (err, row) =>{
        neighborhoodString += "\""+ parseInt(row.neighborhood_number) +"\""+ ":" +"\""+ row.neighborhood_name + "\""+ ",";
    }, () =>{
		neighborhoodString = neighborhoodString.substring(0,neighborhoodString.length-1)+ "}";
		res.type('json').send(JSON.parse(neighborhoodString));
        //console.log(JSON.parse(neighboorhoodString));
    });
	
});


app.get('/incidents', (req,res) => {
	var incidentObject={};	
	var thingsToAdd={};
	db.each("SELECT * FROM Incidents ORDER BY date_time", (err, row) =>{
		var caseNum=row.case_number;
		incidentObject = {caseNum:[]};
		//incidentObject.push(row.case_number);
		var dateStuff=row.date_time.substring(0,10);
		var timeStuff=row.date_time.substring(11,19);
		//console.log(row.case_number);
		thingsToAdd={
			//row.case_number
			date: dateStuff,
				time:timeStuff,
				code: row.code,
				incident: row.incident,
				police_grid: row.police_grid,
				neighborhood_number: row.neighborhood_number,
				block: row.block
			//}
		};
		//console.log(JSON.stringify(thingsToAdd));
		incidentObject.caseNum.push(thingsToAdd);
		//incidentObject.push(row.case_number);
    }, () =>{
		//incidentObject.caseNum.push(row.case_number:thingsToAdd);
		console.log(JSON.stringify(incidentObject));
    });
	

});
//curl -X PUT -d "case_number=[NUMBER]&date_time=2019-10-26T02:50:13.000&code=643&incident=Auto Theft&police_grid=62&neighborhood_num=12&block=2X RAYMOND PL" http://localhost:8000/new-incident
app.put('/new-incident', (req,res) =>{
    //WHAT FIELDS ARE REQUIRED TO PROCESS?  OR CAN JUST BE A CASE NUMBER AND THATS IT>
    //how to add error checking to make sure contains all the required fields?
    console.log(req.body)
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
        var newCaseNumber = req.body.case_number;
        var newDateTime = req.body.date_time;
        var newCode = req.body.code;
        var newIncident = req.body.incident;
        var newPoliceGrid = req.neighborhood_num;
        var newBlock = req.block;
        //how to upload it?????????
    }
    });

});

console.log('Now listening on port ' + port);
var server = app.listen(port);