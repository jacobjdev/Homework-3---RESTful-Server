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
    //comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
    //format - json or xml (e.g. ?format=xml). By default JSON format should be used.
    // processing query things
    //console.log(req.query);
    //so how do you add specifics to all this stuff?????????????????  How to encorporate it into the query and stuff

	
	
	for (var key in req.query) {
		if (req.query.hasOwnProperty(key)) {
			//console.log(req.query[key]);
			
		}
	}
	//console.log('1 '+req.query.length);
	//console.log('2 '+JSON.stringify(req.query));

    var JsonToSend = {};
    db.each("SELECT * FROM Codes ORDER BY code", (err, row) =>{
		
		
        var newCode         = "C"+row.code;
        var newIncidntType  = row.incident_type;
        JsonToSend[newCode] = newIncidntType;
    }, () =>{
		
		//console.log(JsonToSend);
		/*
		for (var key in request.query) {
			if (request.query.hasOwnProperty(key)) {
				alert(key + " -> " + request.query[key]);
			}
		}
		*/
		//console.log('hi '+req.query.code);
		
		var stuffToAdd={};
		if(req.query.hasOwnProperty("code")){
			//console.log(req.query.code[key]);
			for (var key in req.query.code) {
				for (var i; i<JsonToSend.length;i++){
					console.log('1 '+req.query.code[key]);
					console.log('2 '+newCode);
					if (req.query.code[key]==newCode) {
						//console.log('1 '+req.query.code[key]);
						//console.log('2 '+newCode);
						//include the rows of the keys entered
						JsonToSend[key]=stuffToAdd;
						console.log(JsonToSend[key]);
					}
				}
			}
		}

		
		
        //console.log(JSON.stringify(JsonToSend, null, 4));
        if(req.query.hasOwnProperty("format")){
            //console.log(JSONtoXML.parse("codes",JsonToSend));
            res.type('xml').send(JSONtoXML.parse("codes",JsonToSend));
        }else{
            res.type('json').send(JsonToSend);
        }
    });
});


app.get('/neighborhoods',(req,res) => {
    /*
    id - comma separated list of neighborhood numbers to include in result (e.g. ?id=11,14). By default all neighborhoods should be included.
    format - json or xml (e.g. ?format=xml). By default JSON format should be used.
    */

    // processing query things
    console.log(req.query);

	var neighborhoodJSONToSend = {};
	db.each("SELECT * FROM Neighborhoods ORDER BY neighborhood_number", (err, row) =>{
        var newNeighborhoodNumber = "N" + row.neighborhood_number;
        var newNeighborhoodName   = row.neighborhood_name;
        neighborhoodJSONToSend[newNeighborhoodNumber] = newNeighborhoodName;
    }, () =>{
        console.log(JSON.stringify(neighborhoodJSONToSend, null, 4));
        if(req.query.hasOwnProperty("format")){
            console.log(JSONtoXML.parse("neighborhoods",neighborhoodJSONToSend));
            res.type('xml').send(JSONtoXML.parse("neighborhoods",neighborhoodJSONToSend));
        }else{
            
            res.type('json').send(neighborhoodJSONToSend);
        }


    });	
});


app.get('/incidents', (req,res) => {
    /*    
    start_date - first date to include in results (e.g. ?start_date=09-01-2019)
    end_date - last date to include in results (e.g. ?end_date=10-31-2019)
    code - comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
    grid - comma separated list of police grid numbers to include in result (e.g. ?grid=38,65). By default all police grids should be included.
    neighborhood - comma separated list of neighborhood numbers to include in result (e.g. ?id=11,14). By default all neighborhoods should be included.
    limit - maximum number of incidents to include in result (e.g. ?limit=50). By default the limit should be 10,000.
    format - json or xml (e.g. ?format=xml). By default JSON format should be used.
    */
    // processing query things
    console.log(req.query);

	var incidentObject={};	
	db.each("SELECT * FROM Incidents ORDER BY date_time", (err, row) =>{
        var caseToAdd = {};
        var caseNum = "I" + row.case_number;
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
        if(req.query.hasOwnProperty("format")){
            console.log(JSONtoXML.parse("incidents",incidentObject));
            res.type('xml').send(JSONtoXML.parse("incidents",incidentObject));
        }else{            
            console.log(JSON.stringify(incidentObject, null, 4));
            res.type('json').send(incidentObject);
        }
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