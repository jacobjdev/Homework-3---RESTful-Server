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

    var firstDBCallPart = "SELECT * FROM Codes";
    var middleDBCallPart = "";
    var lastDBCallPart = "ORDER BY code";
    var wantXML = false;
    var dataToSend = {};
    

    console.log("query req stuff: " +req.query);
    console.log(req.query.code + "is type of: " +typeof(req.query.code));
    console.log("this is what looks like stringed up brudda:  " + JSON.stringify(req.query));
    // maybe lowercase it all for defensive programming?
    if(req.query.hasOwnProperty("code")){
        var middleDBToAdd = "";
        if(req.query.code.includes(',')){
            console.log("I am splitting: " + req.query.code);
            var codesToProcess = req.query.code.split(',');
            console.log("splitted codes: " + codesToProcess + " and is type of: " + typeof(codesToProcess));
            console.log("codes to process length: " + codesToProcess.length);
            for(let i = 0; i<codesToProcess.length;i++){
                if(i === 0){
                    middleDBToAdd = "WHERE code = " +codesToProcess[i];
                }else{
                    middleDBToAdd =  middleDBToAdd + " " +"OR code ="+ " " + codesToProcess[i];
                }
            }
            console.log("This is the processed middle DB STUFF: " + middleDBToAdd);
            //loop over each code to do processing for the string stuff
        }else{
            middleDBToAdd = "WHERE code = " +req.query.code;
            //one code to process for the where
            //save this to variable;
        }
        middleDBCallPart = middleDBToAdd;
        // assin middle part to be this stuff
    }

    if(req.query.hasOwnProperty("format") && (req.query.format.toLowerCase() === "xml")){
        wantXML = true;
        console.log("Made it to XML PART IF")
    }

    var finalDBCall = firstDBCallPart + " " + middleDBCallPart + " " + lastDBCallPart;
    console.log("FINAL DB Call: " + finalDBCall)
    db.each(finalDBCall,(err,row) => {
        var newCode         = "C"+row.code;
        var newIncidentType = row.incident_type;
        dataToSend[newCode] = newIncidentType;
        // console.log(row)
        // console.log("ERROR: "+ err)
    }, () =>{
        if(wantXML){
            //console.log(JSONtoXML.parse("codes",JsonToSend));
            res.type('xml').send(JSONtoXML.parse("codes",dataToSend));
        }else{
            console.log(JSON.stringify(dataToSend, null, 4));
            res.type('json').send(dataToSend);
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

app.get('/incidents2', (req,res) => {
    /*    
    start_date - first date to include in results (e.g. ?start_date=09-01-2019)
    end_date - last date to include in results (e.g. ?end_date=10-31-2019)
    code - comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
    grid - comma separated list of police grid numbers to include in result (e.g. ?grid=38,65). By default all police grids should be included.
    neighborhood - comma separated list of neighborhood numbers to include in result (e.g. ?id=11,14). By default all neighborhoods should be included.
    limit - maximum number of incidents to include in result (e.g. ?limit=50). By default the limit should be 10,000.
    format - json or xml (e.g. ?format=xml). By default JSON format should be used.
    */ 
   // example query for db browser: SELECT * FROM Incidents WHERE date_time < "2019-10-31T00:00:00" AND code = 525 AND police_grid = 36 ORDER BY date_time
    // processing query things
    var firstDBCallPart         = "SELECT * FROM Incidents";
    var finalMiddleDBCallPart   = "";
    var middlePartDBCallBuilder = "";
    var lastDBCallPart          = "ORDER BY date_time";
    var wantXML                 = false;
    var whereStatementUsedYet   = false;
    var dataToSend              = {};
    console.log("query req stuff: " +req.query);
    // console.log(req.query.code + "is type of: " +typeof(req.query.code));
    console.log("this is what looks like stringed up brudda:  " + JSON.stringify(req.query));



    if(req.query.hasOwnProperty("code")){
        var middleDBToAdd = "";
        if(req.query.code.includes(',')){
            console.log("I am splitting: " + req.query.code);
            var codesToProcess = req.query.code.split(',');
            console.log("splitted codes: " + codesToProcess + " and is type of: " + typeof(codesToProcess));
            console.log("codes to process length: " + codesToProcess.length);
            for(let i = 0; i<codesToProcess.length;i++){
                if(i === 0){
                    middleDBToAdd = "code =" + " " + codesToProcess[i];
                }else{
                    middleDBToAdd = middleDBToAdd + " " +"OR code ="+ " " + codesToProcess[i];    
                }
            }
            console.log("This is the processed middle DB STUFF: " + middleDBToAdd);
            //loop over each code to do processing for the string stuff
        }else{
            middleDBToAdd = req.query.code;
            //one code to process for the where
            //save this to variable;
        }
        if(!whereStatementUsedYet){
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "WHERE" + " " + "(" + middleDBToAdd + ")";
        }else{
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "AND" + " " + "(" + middleDBToAdd + ")";
        }
        whereStatementUsedYet  = true;
        // assin middle part to be this stuff
    }

    if(req.query.hasOwnProperty("start_date")){
        var middleDBToAdd = "";
        //defensive programming what if user provides two start dates?



    }




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