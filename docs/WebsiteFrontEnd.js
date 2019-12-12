var app;
var mymap = null;
var globalcrime_api_url;
var neighborhood_object= {
"Conway/Battlecreek/Highwood": [44.946250, -93.025248],
"Greater East Side": [44.976738, -93.027055],
"West Side":[44.931608, -93.080018],
"Dayton's Bluff":[44.958591, -93.059610],
"Payne/Phalen":[44.976668, -93.070699],
"North End":[44.977097, -93.111313],
"Thomas/Dale(Frogtown)": [44.960120, -93.121358],
"Summit/University":[44.947396, -93.133054],
"West Seventh":[44.931491, -93.126777],
"Como":[44.983284, -93.150415],
"Hamline/Midway":[44.961524, -93.164176],
"St. Anthony":[44.966985, -93.191109],
"Union Park":[44.945576, -93.176630],
"Macalester-Grovelend":[44.934662, -93.178110],
"Highland":[44.914196, -93.176787],
"Summit Hill":[.937127, -93.136825],
"Capitol River":[44.947738, -93.093074]};

function Prompt() {
    $("#dialog-form").dialog({
        autoOpen: true,
        modal: true,
        width: "360px",
        buttons: {
            "Ok": function() {
                var prompt_input = $("#prompt_input");
                Init(prompt_input.val());
                $(this).dialog("close");
            },
            "Cancel": function() {
                $(this).dialog("close");
            }
        }
    });
}

function Init(crime_api_url){
console.log(crime_api_url);
globalcrime_api_url=crime_api_url
   app = new Vue({
        el: "#app",
        data: {
            // just all of it in here
			locationDisplayBox: "",
            search_type: "latitude/longitude",
            neighborhood_Search: "",
            //store url from the jqueryuihtml thing
            search_results: [],
            incident_data: [],
            neighborhood_results: [],
            code_data2: [],
            neighborhood_data: {},
			neighborhoods: [],
			code_data: {},
            incidenttypes: [],
            start_date: "2019-10-01",
            end_date: "2019-10-31",
			start_time: "00:00:00",
			end_time: "12:00:00",
			rowchecked: [],
            conwayBattleCreekHighwoodIcon: null,
            greaterEastSideIcon: null,
            westSideIcon: null,
            daytonsBluffIcon: null,
            paynePhalenIcon: null,
            northEndIcon: null,
            thomasDaleFrogtownIcon: null,
            summitUniversityIcon: null,
            westSeventhIcon: null,
            comoIcon: null,
            hamlineMidwayIcon: null,
            stAnthonyIcon: null,
            unionParkIcon: null,
            macalesterGrovelandIcon: null,
            highlandIcon:null,
            summitHillIcon:null,
            capitolRiverIcon:null,
			eventIcon:null

            // need to add the rest of these, call function on apply filter
            
        },
        computed: {
            
            //in incident da
            // loop over the incident data, increment counts based off the nieghborhood
            
        },
        mounted() {
        this.getNeighborhoodData()
        codeSearch()    
        },
        methods :{
            startMap(){
                mymap = L.map('mapid').setView([44.9537, -93.09], 12);
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiampqYTM4MCIsImEiOiJjazN0ZjJiYWMwMjlpM2VvMXBpMjgzM2FhIn0.ULokQFAtfcbyUp9AR8-IjA', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                minZoom:11,
                id: 'mapbox/streets-v11',
                accessToken: 'pk.eyJ1IjoiampqYTM4MCIsImEiOiJjazN0ZjJiYWMwMjlpM2VvMXBpMjgzM2FhIn0.ULokQFAtfcbyUp9AR8-IjA'
                }).addTo(mymap);

                var corner1=L.latLng(45.0213, -93.236);
                var corner2=L.latLng(44.8802, -93.003);
                var bounds = L.latLngBounds(corner1, corner2);
                mymap.setMaxBounds(bounds);
				
            },
            updatePopups(){

                console.log("neighborhood totals computed!")
                var neighborhoodTotalsArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                console.log(this.incident_data)
                for( let incident in this.incident_data){
                    // console.log("I am doing incident: " , this.incident_data[incident].neighborhood_number);
                    neighborhoodTotalsArray[this.incident_data[incident].neighborhood_number -1] += 1;
                }
    
                console.log("Totals array" + neighborhoodTotalsArray);

                this.conwayBattleCreekHighwoodIcon = L.marker(neighborhood_object["Conway/Battlecreek/Highwood"]).addTo(mymap);
                this.conwayBattleCreekHighwoodIcon.bindPopup("Conway/Battlecreek/Highwood, crimes: " + neighborhoodTotalsArray[0]);

                this.greaterEastSideIcon = L.marker(neighborhood_object["Greater East Side"]).addTo(mymap);
                this.greaterEastSideIcon.bindPopup("Greater East Side, crimes: " + neighborhoodTotalsArray[1]);
                
                this.westSideIcon=L.marker(neighborhood_object["West Side"])
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
                this.westSideIcon.bindPopup("West Side"+ neighborhoodTotalsArray[2]);
                var daytonsBluffIcon = L.marker(neighborhood_object["Dayton's Bluff"]).addTo(mymap);
                daytonsBluffIcon.bindPopup("Dayton's Bluff")
                var paynePhalenIcon = L.marker(neighborhood_object["Payne/Phalen"]).addTo(mymap);
                paynePhalenIcon.bindPopup("Payne/Phalen");
                var northEndIcon = L.marker(neighborhood_object["North End"]).addTo(mymap);
                northEndIcon.bindPopup("North End");
                var thomasDaleFrogtownIcon = L.marker(neighborhood_object["Thomas/Dale(Frogtown)"]).addTo(mymap);
                thomasDaleFrogtownIcon.bindPopup("Thomas/Dale(Frogtown");
                var summitUniversityIcon = L.marker(neighborhood_object["Summit/University"]).addTo(mymap);
                summitUniversityIcon.bindPopup("Summit/University");
                var westSeventhIcon = L.marker(neighborhood_object["West Seventh"]).addTo(mymap);
                westSeventhIcon.bindPopup("West Seventh");
                var comoIcon = L.marker(neighborhood_object["Como"]).addTo(mymap);
                comoIcon.bindPopup("Como");
                var hamlineMidwayIcon = L.marker(neighborhood_object["Hamline/Midway"]).addTo(mymap);
                hamlineMidwayIcon.bindPopup("Hamline/Midway");
                var stAnthonyIcon = L.marker(neighborhood_object["St. Anthony"]).addTo(mymap);
                stAnthonyIcon.bindPopup("St. Anthony");
                var unionParkIcon = L.marker(neighborhood_object["Union Park"]).addTo(mymap);
                unionParkIcon.bindPopup("Union Park");
                var macalesterGrovelandIcon = L.marker(neighborhood_object["Macalester-Grovelend"]).addTo(mymap);
                macalesterGrovelandIcon.bindPopup("Macalester-Groveland");
                var highlandIcon = L.marker(neighborhood_object["Highland"]).addTo(mymap);
                highlandIcon.bindPopup("Highland");
                var summitHillIcon = L.marker(neighborhood_object["Summit Hill"]).addTo(mymap);
                summitHillIcon.bindPopup("Summit Hill");
                var capitolRiverIcon = L.marker(neighborhood_object["Capitol River"]).addTo(mymap);
                capitolRiverIcon.bindPopup("Capitol River");
=======
>>>>>>> sidestuff2tofixsincegithubdesktopdoesntdostashes
                this.westSideIcon.bindPopup("West Side, crimes: "+ neighborhoodTotalsArray[2]);

                this.daytonsBluffIcon = L.marker(neighborhood_object["Dayton's Bluff"]).addTo(mymap);
                this.daytonsBluffIcon.bindPopup("Dayton's Bluff, crimes: "+neighborhoodTotalsArray[3]);

                this.paynePhalenIcon = L.marker(neighborhood_object["Payne/Phalen"]).addTo(mymap);
                this.paynePhalenIcon.bindPopup("Payne/Phalen, crimes: "+ neighborhoodTotalsArray[4]);

                this.northEndIcon = L.marker(neighborhood_object["North End"]).addTo(mymap);
                this.northEndIcon.bindPopup("North End, crimes: "+neighborhoodTotalsArray[5]);

                this.thomasDaleFrogtownIcon = L.marker(neighborhood_object["Thomas/Dale(Frogtown)"]).addTo(mymap);
                this.thomasDaleFrogtownIcon.bindPopup("Thomas/Dale(Frogtown), crimes: "+ neighborhoodTotalsArray[6]);

                this.summitUniversityIcon = L.marker(neighborhood_object["Summit/University"]).addTo(mymap);
<<<<<<< HEAD
                this.summitUniversityIcon.bindPopup("Summit/University"+ neighborhoodTotalsArray[7]);
=======
                this.summitUniversityIcon.bindPopup("Summit/University, crimes"+ neighborhoodTotalsArray[7]);
>>>>>>> sidestuff2tofixsincegithubdesktopdoesntdostashes

                this.westSeventhIcon = L.marker(neighborhood_object["West Seventh"]).addTo(mymap);
                this.westSeventhIcon.bindPopup("West Seventh, crimes: "+neighborhoodTotalsArray[8]);
                
                this.comoIcon = L.marker(neighborhood_object["Como"]).addTo(mymap);
                this.comoIcon.bindPopup("Como, crimes: "+ neighborhoodTotalsArray[9]);

                this.hamlineMidwayIcon = L.marker(neighborhood_object["Hamline/Midway"]).addTo(mymap);
                this.hamlineMidwayIcon.bindPopup("Hamline/Midway, crimes: "+ neighborhoodTotalsArray[10]);

                this.stAnthonyIcon = L.marker(neighborhood_object["St. Anthony"]).addTo(mymap);
                this.stAnthonyIcon.bindPopup("St. Anthony, crimes: "+ neighborhoodTotalsArray[11]);

                this.unionParkIcon = L.marker(neighborhood_object["Union Park"]).addTo(mymap);
                this.unionParkIcon.bindPopup("Union Park, crimes: "+ neighborhoodTotalsArray[12]);

                this.macalesterGrovelandIcon = L.marker(neighborhood_object["Macalester-Grovelend"]).addTo(mymap);
                this.macalesterGrovelandIcon.bindPopup("Macalester-Groveland, crimes: " + neighborhoodTotalsArray[13]);

                this.highlandIcon = L.marker(neighborhood_object["Highland"]).addTo(mymap);
                this.highlandIcon.bindPopup("Highland, crimes: "+ neighborhoodTotalsArray[14]);

                this.summitHillIcon = L.marker(neighborhood_object["Summit Hill"]).addTo(mymap);
                this.summitHillIcon.bindPopup("Summit Hill, crimes: "+neighborhoodTotalsArray[15]);

                this.capitolRiverIcon = L.marker(neighborhood_object["Capitol River"]).addTo(mymap);
                this.capitolRiverIcon.bindPopup("Capitol River, crimes: "+ neighborhoodTotalsArray[16]);
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
>>>>>>> sidestuff2tofixsincegithubdesktopdoesntdostashes
            },
            getCenter(){
                // mymap.on('moveend', function (event){
                //     // console.log(document.getElementById("search").value)
                //     // app.search_type = document.getElementById("search").value;
                //     console.log("here "+app.search_type); //why is this blank and why is it this way after map move?
                //     let centerOfMap = mymap.getCenter();
                    
                // if(app.search_type == "latitude/longitude"){
                //     app.locationDisplayBox = centerOfMap.lat + " , " + centerOfMap.lng;
                //     console.log("center"+ app.locationDisplayBox)
                // }else{
                //     console.log("else on center")
                //     $.getJSON("https://nominatim.openstreetmap.org/reverse?lat="+centerOfMap.lat+"&lon="+centerOfMap.lng+"&format=json", (response) =>{
                //         console.log(response)
                //         // console.log("JOSON RESPPNE" +JSON.parse(response));
                        
                //         // var address = response.road + " " + response.city + " " + response.state + " " + response.postcode;
                //         var address = response.display_name;
                //         app.locationDisplayBox = address;
                //         // out of memeory what, also why all just nulls
                        
                //     })
                //     //need to do call to convert from address to lat long
                // }
                // })


            },
            getNeighborhoodData(){
                neighborhoodSearch() 
            },
            

        }
    });

    IncidentSearch();
}

function getCenter2(){
    mymap.on('moveend', function (event){
        // console.log(document.getElementById("search").value)
        // app.search_type = document.getElementById("search").value;
        console.log("here "+app.search_type); //why is this blank and why is it this way after map move?
        let centerOfMap = mymap.getCenter();
        
    if(app.search_type == "latitude/longitude"){
        app.locationDisplayBox = centerOfMap.lat + " , " + centerOfMap.lng;
        console.log("center"+ app.locationDisplayBox)
    }else{
        console.log("else on center")
        $.getJSON("https://nominatim.openstreetmap.org/reverse?lat="+centerOfMap.lat+"&lon="+centerOfMap.lng+"&format=json", (response) =>{
            console.log(response)
            var address = response.display_name;
            app.locationDisplayBox = address;
        })
    }
    })
}

function IncidentSearch(event){
    console.log('starting incident search');
    var dateToUse;
	if(app.start_date !== "2019-10-01" || app.end_date !== "2019-10-31"){
        dateToUse = "start_date="+app.start_date+"&end_date="+app.end_date+"&format=json";
		console.log("sdate: "+app.start_date);
		console.log("edate: "+app.end_date);
		//console.log("stime: "+app.start_time);
		//console.log("etime: "+app.end_time);
    }else{
        dateToUse = "start_date=2019-10-01&end_date=2019-10-31&format=json"
    }
    console.log("date tp use " + dateToUse);
    $.getJSON(globalcrime_api_url+"/incidents?"+dateToUse,incidentData);
}

function incidentData(data)
{
    
    console.log(data[Object.keys(data)[0]])
    app.incident_data = data;

    if(mymap == null){
        app.startMap();
    }
    app.updatePopups();
<<<<<<< HEAD
    getCenter2();
	var temparray = [];
	for(code in app.code_data){
		temparray.push(app.code_data[code])
	}
	for(code in app.code_data){
		app.incidenttypes.push(app.code_data[code])
	}
	console.log("THIS IS TEMP ARRAY "+ temparray);
	//console.log(app.search_results);
	console.log('processing incident search data');
=======
<<<<<<< Updated upstream
	//console.log(app.search_results);
	console.log('hello4');
=======
    getCenter2();
	/*
	var temparray = [];
	for(code in app.code_data){
		temparray.push(app.code_data[code])
	}
	for(code in app.code_data){
		app.incidenttypes.push(app.code_data[code])
	}
	console.log("THIS IS TEMP ARRAY "+ temparray);
	//console.log(app.search_results);
	*/
	console.log('processing incident search data');
>>>>>>> Stashed changes
>>>>>>> sidestuff2tofixsincegithubdesktopdoesntdostashes
    console.log(data);
}

function MapSearch(event)
{
    if (app.search_type == "latitude/longitude")
    {
		console.log('starting latitude longitude map search');

			let split=app.locationDisplayBox.split(',');
			console.log(split);
			var latlng;
			//if (split.length<2){
				//latlng=L.latLng(44.95167902304322 , -93.0758285522461);
			//}else{
				latlng = L.latLng(parseFloat(split[0]), parseFloat(split[1]));
			//}
			mymap.setView(latlng,11);
			

		//console.log('results: '+ app.search_results);
    }else if (app.search_type == "addresstype"){
		console.log("address");
		
		//if data response.length <1
		$.getJSON("https://nominatim.openstreetmap.org/search.php?q=" +app.locationDisplayBox+ "&format=json",(dataResponse) => {
			console.log(dataResponse[0].lat, dataResponse[0].lon);
		var latlng2;
			//if (app.locationDisplayBox<1){
				//latlng2=L.latLng(44.95167902304322 , -93.0758285522461);
			//}else{
				latlng2 = L.latLng(dataResponse[0].lat,dataResponse[0].lon);
			//}
			mymap.setView(latlng2,5);	

		});
	
	}
    else
    {
		console.log('idk how it got here');
        app.search_results = [];
    }
}

// Rachel port 8011, jacob 8018
function neighborhoodSearch(event){
    
    //maybe need to remove this?
    
    console.log('hello2');
    let request = {
        url: globalcrime_api_url+"/neighborhoods",

        dataType: "json",
        headers: {
            //"Authorization": auth_data.token_type + " " + auth_data.access_token
        },
        success: neighborhoodData
    };
    $.ajax(request);
    //console.log('results: '+ app.search_results);
    
}
// Rachel port 8011, jacob 8018
function neighborhoodData(data)
{
    app.neighborhood_data = data;
	//console.log(app.search_results);
	console.log('proessing neighbrhood data');
    console.log(data);
}

// Rachel port 8011, jacob 8018
function codeSearch(event){
   
    console.log('hello2');
    let request = {
        url:globalcrime_api_url+"/codes",
        dataType: "json",
        headers: {
            //"Authorization": auth_data.token_type + " " + auth_data.access_token
        },
        success: codeData
    };
    $.ajax(request);
	//console.log('was success');
    //console.log('results: '+ app.search_results);
    

}

function codeData(data)
{
    app.code_data = data;
	//console.log(app.search_results);
	console.log('processing code data');
    console.log('code data '+data);
}

function placeSingleMarker(event){
	var correctedAddress = app.rowchecked.block.replace('X','0');
	$.getJSON("https://nominatim.openstreetmap.org/search.php?q=" +correctedAddress+ "&format=json",(dataResponse) => {
			console.log(dataResponse[0].lat, dataResponse[0].lon);
		var latlng3 = L.latLng(dataResponse[0].lat,dataResponse[0].lon);	

	});
	mymap.eventIcon = L.marker(latlng3).addTo(mymap);
    mymap.eventIcon.bindPopup(app.rowchecked.incident + app.rowchecked.date + app.rowchecked.time);
}


