var app;
var mymap = null;
var globalcrime_api_url;
//var neighborhood_array;
//Why does map zoom back out after clicking search
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
            code_data: [],
            neighborhood_data: {},
			neighborhoods: [],
			code_data: {},
            incidenttypes: [],
            start_date: "2019-10-01",
            end_date: "2019-10-31",
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

            // need to add the rest of these, call function on apply filter
            
        },
        computed: {
            
            //in incident da

                // loop over the incident data, increment counts based off the nieghborhood

            
        },
        mounted() {
        // this.startMap()
        // this.getCenter()
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
                // setTimeout(IncidentSearch,100); //this allows app to finish building
                // this.westSideIcon = L.marker(neighborhood_object["West Side"]).addTo(mymap);

            },
            updatePopups(){
                //this would get called by the markers?
                console.log("neighborhood totals computed!")
                var neighborhoodTotalsArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
                console.log(this.incident_data)
                for( let incident in this.incident_data){
                    // console.log("I am doing incident: " , this.incident_data[incident].neighborhood_number);
                        //Conway/Battlecreek/Highwood
                        neighborhoodTotalsArray[this.incident_data[incident].neighborhood_number -1] += 1;
                        //need to add it to the correct one

                }
    
                console.log("Totals array" + neighborhoodTotalsArray);
                // var highwoodIcon = L.marker([44.946250, -93.025248]).addTo(mymap);
                // highwoodIcon.bindPopup("Highwood")
                this.conwayBattleCreekHighwoodIcon = L.marker(neighborhood_object["Conway/Battlecreek/Highwood"]).addTo(mymap);
                this.conwayBattleCreekHighwoodIcon.bindPopup("Conway/Battlecreek/Highwood" + neighborhoodTotalsArray[0]);

                this.greaterEastSideIcon = L.marker(neighborhood_object["Greater East Side"]).addTo(mymap);
                this.greaterEastSideIcon.bindPopup("Greater East Side " + neighborhoodTotalsArray[1]);
                // greaterEastSideIcon.bindPopup("testing");
                // re run bind pop up with every single time ,only on fiter change
                    // NEED TO REMOVE EACH VAr DECLARATION PART
                this.westSideIcon=L.marker(neighborhood_object["West Side"])
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
            },
            getCenter(){
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
                        // console.log("JOSON RESPPNE" +JSON.parse(response));
                        
                        // var address = response.road + " " + response.city + " " + response.state + " " + response.postcode;
                        var address = response.display_name;
                        app.locationDisplayBox = address;
                        // out of memeory what, also why all just nulls
                        
                    })
                    //need to do call to convert from address to lat long
                }
                })


            },
            getNeighborhoodData(){
                neighborhoodSearch() 
            },
			getDataForMarkers(){
				
			},
			
            

        }
    });
    // var countComponent = Vue.component("mapIcons", {
    //     props: ["count"], 
    //     template: "<span> {{ count }} </span>"
    // });
    IncidentSearch()

    

}
// IF OUTSIDE DATE RANGE OR DATA DOENST EXIST NEW API CALL, BUT IF PER LOCATION ETC, USE V-IFS FOR TABLE BASED OFF PAGE
//get crime data function on load 

//have separate function down here for api processing call stuff?
// Rachel port 8011, jacob 8018


// function createMapIcon(neighborhoodName){
//     var neighborhoodName = L.marker(neighborhood_object[neighborhoodName]).addTo(mymap);
//     console.log("Adding " + neighborhoodName + "with" +(neighborhood_object[neighborhoodName]) + "coordinates");
//     neighborhoodName.bindPopup(neighborhoodName).openPopup();
// }

function IncidentSearch(event){
    console.log('hello5');
    var dateToUse;
    //untested
    if(app.start_date !== "2019-10-01" && app.end_date !== "2019-10-31"){
        dateToUse = "start_date="+app.start_date+"&end_date="+app.end_date+"&format=json";
    }else{
        dateToUse = "start_date=2019-10-01&end_date=2019-10-31&format=json"
    }
    console.log("date tp use " + dateToUse);
    $.getJSON(globalcrime_api_url+"/incidents?"+dateToUse,incidentData);
    // let request = {
    //     url: globalcrime_api_url+"/incidents?"+dateToUse,
    //             // when adding ?start_date=2019-10-01&end_date=2019-10-31 to the query, why does return noting?
    //     // has the problem with end date?  maybe logic?
    //     dataType: "json",
    //     headers: {
    //         //"Authorization": auth_data.token_type + " " + auth_data.access_token
    //     },
    //     success: incidentData
    // };
    // $.ajax(request);

}

function incidentData(data)
{
    
    console.log(data[Object.keys(data)[0]])
    app.incident_data = data;

    if(mymap == null){
        app.startMap();
    }
    app.updatePopups();
	//console.log(app.search_results);
	console.log('hello4');
    console.log(data);
}
//incident search function
/*
let request = {
            url: globalcrime_api_url+"/incidents",
            dataType: "json",
            headers: {
                //"Authorization": auth_data.token_type + " " + auth_data.access_token
            },
            success: MapData
			        };
        $.ajax(request);
*/
function MapSearch(event)
{
    if (app.search_type == "latitude/longitude")
    {
		console.log('hello2');

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
		console.log('hello3');
        app.search_results = [];
    }
}
// Rachel port 8011, jacob 8018
function MapData(data)
{
    var innerData = data
    // for(incident in innerData){
    //     incident.neighborhood_number = neighborhood_results[incident.neighborhood_number];
    //     console.log(incident)
    // }
    
    app.search_results = innerData;
	//console.log(app.search_results);
	console.log('hello4');
    console.log(data);
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


