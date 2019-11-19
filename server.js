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
    //console.log(req.query);
	//var neighborhoodJSONToSend = {};
	
	var firstDBCallPart = "SELECT * FROM Neighborhoods";
    var middleDBCallPart = "";
    var lastDBCallPart = "ORDER BY neighborhood_number";
    var wantXML = false;
    var dataToSend = {};
    

    console.log("query req stuff: " +req.query);
    console.log(req.query.code + "is type of: " +typeof(req.query.id));
    console.log("this is what looks like stringed up brudda:  " + JSON.stringify(req.query));
    // maybe lowercase it all for defensive programming?
    if(req.query.hasOwnProperty("id")){
        var middleDBToAdd = "";
        if(req.query.id.includes(',')){
			console.log("NN: "+req.query.id);
            console.log("I am splitting: " + req.query.id);
            var idsToProcess = req.query.id.split(',');
            console.log("splitted codes: " + idsToProcess + " and is type of: " + typeof(idsToProcess));
            console.log("codes to process length: " + idsToProcess.length);
            for(let i = 0; i<idsToProcess.length;i++){
                if(i === 0){
                    middleDBToAdd = "WHERE neighborhood_number = " +idsToProcess[i];
                }else{
                    middleDBToAdd =  middleDBToAdd + " " +"OR neighborhood_number ="+ " " + idsToProcess[i];
                }
            }
            console.log("This is the processed middle DB STUFF: " + middleDBToAdd);
            //loop over each code to do processing for the string stuff
        }else{
            middleDBToAdd = "WHERE neighborhood_number = " +req.query.id;
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

    var finalDBCall = firstDBCallPart + " " + middleDBCallPart + " "+lastDBCallPart;
    console.log("FINAL DB Call: " + finalDBCall);
	
	db.each(finalDBCall, (err, row) =>{
        var newNeighborhoodNumber = "N" + row.neighborhood_number;
        var newNeighborhoodName   = row.neighborhood_name;
        dataToSend[newNeighborhoodNumber] = newNeighborhoodName;
    }, () =>{
        //console.log(JSON.stringify(neighborhoodJSONToSend, null, 4));
        if(wantXML){
            //console.log(JSONtoXML.parse("codes",JsonToSend));
            res.type('xml').send(JSONtoXML.parse("ids",dataToSend));
        }else{
            console.log(JSON.stringify(dataToSend, null, 4));
            res.type('json').send(dataToSend);
        }


    });	
});


// app.get('/incidents', (req,res) => {
//     /*    
//     start_date - first date to include in results (e.g. ?start_date=09-01-2019)
//     end_date - last date to include in results (e.g. ?end_date=10-31-2019)
//     code - comma separated list of codes to include in result (e.g. ?code=110,700). By default all codes should be included.
//     grid - comma separated list of police grid numbers to include in result (e.g. ?grid=38,65). By default all police grids should be included.
//     neighborhood - comma separated list of neighborhood numbers to include in result (e.g. ?id=11,14). By default all neighborhoods should be included.
//     limit - maximum number of incidents to include in result (e.g. ?limit=50). By default the limit should be 10,000.
//     format - json or xml (e.g. ?format=xml). By default JSON format should be used.
//     */
//     // processing query things
//     console.log(req.query);

// 	var incidentObject={};	
// 	db.each("SELECT * FROM Incidents ORDER BY date_time", (err, row) =>{
//         var caseToAdd = {};
//         var caseNum = "I" + row.case_number;
//         // Separating the date and time out separately
// 		var dateSeparated = row.date_time.substring(0,10);
// 		var timeSeparated = row.date_time.substring(11,19);
// 		caseToAdd = {
// 			date: dateSeparated,
//             time: timeSeparated,
//             code: row.code,
//             incident: row.incident,
//             police_grid: row.police_grid,
//             neighborhood_number: row.neighborhood_number,
//             block: row.block
// 		};
// 		incidentObject[caseNum] = caseToAdd;
//     }, () =>{
//         if(req.query.hasOwnProperty("format")){
//             console.log(JSONtoXML.parse("incidents",incidentObject));
//             res.type('xml').send(JSONtoXML.parse("incidents",incidentObject));
//         }else{            
//             console.log(JSON.stringify(incidentObject, null, 4));
//             res.type('json').send(incidentObject);
//         }
//     });
// });

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
    var lastDBCallPart          = "ORDER BY date_time DESC LIMIT ";
    var wantXML                 = false;
    var whereStatementUsedYet   = false;
    console.log("query req stuff: " +req.query);
    // console.log(req.query.code + "is type of: " +typeof(req.query.code));
    console.log("this is what looks like stringed up brudda:  " + JSON.stringify(req.query));

    //                                 CODE PROCESSING
    //___________________________________________________________________________________

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
            middleDBToAdd = "code= "+req.query.code;
            //one code to process for the where
            //save this to variable;
        }
        if(!whereStatementUsedYet){
			//first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "WHERE" + " " + "(" + middleDBToAdd + ")";
        }else{
			//not first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "AND" + " " + "(" + middleDBToAdd + ")";
        }
        whereStatementUsedYet  = true;
        // assin middle part to be this stuff
    }
    
    //                                     GRID PROCESSING
    //___________________________________________________________________________________
    
	
	   if(req.query.hasOwnProperty("grid")){
        var middleDBToAdd2 = "";
        if(req.query.grid.includes(',')){
            console.log("I am splitting: " + req.query.grid);
            var gridsToProcess = req.query.grid.split(',');
            console.log("splitted grid: " + gridsToProcess + " and is type of: " + typeof(gridsToProcess));
            console.log("grids to process length: " + gridsToProcess.length);
            for(let i = 0; i<gridsToProcess.length;i++){
                if(i === 0){
                    middleDBToAdd2 = "police_grid =" + " " + gridsToProcess[i];
                }else{
                    middleDBToAdd2 = middleDBToAdd2 + " " +"OR police_grid ="+ " " + gridsToProcess[i];    
                }
            }
            console.log("This is the processed middle DB STUFF: " + middleDBToAdd2);
            //loop over each code to do processing for the string stuff
        }else{
            middleDBToAdd2 = "police_grid= "+req.query.grid;
            //one code to process for the where
            //save this to variable;
        }
        if(!whereStatementUsedYet){
			//first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "WHERE" + " " + "(" + middleDBToAdd2 + ")";
        }else{
			//not first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "AND" + " " + "(" + middleDBToAdd2 + ")";
        }
        whereStatementUsedYet  = true;
        // assin middle part to be this stuff
    }
    
    //                                         ID PROCESSING
	//_________________________________________________________________________________________
	
	if(req.query.hasOwnProperty("id")){
        var middleDBToAdd3 = "";
        if(req.query.id.includes(',')){
            console.log("I am splitting: " + req.query.id);
            var idsToProcess = req.query.id.split(',');
            console.log("splitted IDs: " + idsToProcess + " and is type of: " + typeof(idsToProcess));
            console.log("IDs to process length: " + idsToProcess.length);
            for(let i = 0; i<idsToProcess.length;i++){
                if(i === 0){
                    middleDBToAdd3 = "neighborhood_number = " + " " + idsToProcess[i];
                }else{
                    middleDBToAdd3 = middleDBToAdd3 + " " +"OR neighborhood_number ="+ " " + idsToProcess[i];    
                }
            }
            console.log("This is the processed middle DB STUFF: " + middleDBToAdd3);
            //loop over each code to do processing for the string stuff
        }else{
            middleDBToAdd3 = "neighborhood_number = "+req.query.id;
            //one code to process for the where
            //save this to variable;
        }
        if(!whereStatementUsedYet){
			//first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "WHERE" + " " + "(" + middleDBToAdd3 + ")";
        }else{
			//not first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "AND" + " " + "(" + middleDBToAdd3 + ")";
        }
        whereStatementUsedYet  = true;
        // assin middle part to be this stuff
    }
	
	//start date - SELECT * FROM Incidents WHERE date_time>=09-01-2019T00:00:00;
	//end date - SELECT * FROM Incidents WHERE date_time<=10-31-2019T00:00:00;
    
    
//                                      START DATE PROCESSING
//_____________________________________________________________________________________________

    if(req.query.hasOwnProperty("start_date")){
        var middleDBToAdd4 = "";
        //defensive programming what if user provides two start dates?
        var middleDBToAdd = "";
        var timeToAdd = "T00:00:00";
        var middleDBToAdd4 = req.query.start_date + timeToAdd;
        
        console.log(middleDBToAdd4);
        if(!whereStatementUsedYet){
			//first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "WHERE" + " " + "(" + "date_time >= " +"\"" + middleDBToAdd4 +"\"" + ")";
        }else{
			//not first item in the req.query
            middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "AND" + " " + "(" + "date_time >= " + "\"" + middleDBToAdd4 +"\"" + ")";
        }
        whereStatementUsedYet  = true;

    }

//                                      END DATE PROCESSING
//_____________________________________________________________________________________________

if(req.query.hasOwnProperty("end_date")){
    var middleDBToAdd5 = "";
    //defensive programming what if user provides two start dates? 
    var middleDBToAdd = "";
    var timeToAdd = "T00:00:00";
    var middleDBToAdd5 = req.query.end_date + timeToAdd;
    
    console.log(middleDBToAdd5);
    if(!whereStatementUsedYet){
        //first item in the req.query
        middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "WHERE" + " " + "(" + "date_time <= " +"\"" + middleDBToAdd5 +"\"" + ")";
    }else{
        //not first item in the req.query
        middlePartDBCallBuilder = middlePartDBCallBuilder + " " + "AND" + " " + "(" + "date_time <= " + "\"" + middleDBToAdd5 +"\"" + ")";
    }
    whereStatementUsedYet  = true;

}

//                                      LIMIT PROCESSING
//_____________________________________________________________________________________________
var limitAmount
if(req.query.hasOwnProperty("limit")){
    limitAmount = parseInt(req.query.limit,10);
}else{
    limitAmount = 10000;
}


//                                      FORMAT PROCESSING
//_____________________________________________________________________________________________

if(req.query.hasOwnProperty("format") && (req.query.format.toLowerCase() === "xml")){
    wantXML = true;
    console.log("Made it to XML PART IF")
}

//                                      DATABASE CALL STUFF
//_____________________________________________________________________________________________


	var finalDBCall = firstDBCallPart + " " + middlePartDBCallBuilder + " "+lastDBCallPart + limitAmount;
    console.log("FINAL DB Call: " + finalDBCall);
    console.log("type of finalstring: " + typeof(finalDBCall));
	
    var incidentObjectToSend  = {};	
    var incidentToReturnAfterLimit = {};
	db.each(finalDBCall, (err, row) =>{
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
        incidentObjectToSend[caseNum] = caseToAdd;
        // console.log("error: " + err)
    }, () =>{
        if(wantXML){
            //console.log(JSONtoXML.parse("incidents",incidentObject));
            res.type('xml').send(JSONtoXML.parse("incidents", incidentObjectToSend));
        }else{            
            //console.log(JSON.stringify(incidentObject, null, 4));
            res.type('json').send(incidentObjectToSend);
        }
    });

});





//curl -X PUT -d "case_number=[NUMBER]&date=2019-10-26&time=02:50:13.000&code=643&incident=Auto Theft&police_grid=62&neighborhood_num=12&block=2X RAYMOND PL" http://localhost:8000/new-incident
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
        // var newDateTime        = req.body.date_time;
        var newDate            = req.body.date;
        var newTime            = req.body.time
        //need to split the date time into two fields
        var newCode            = req.body.code;
        var newIncident        = req.body.incident;
        var newPoliceGrid      = req.police_grid;
        var newNeighborhoodNum = req.neighborhood_num;
        var newBlock           = req.block;

        var newDateTime = newDate+"T"+newTime;

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