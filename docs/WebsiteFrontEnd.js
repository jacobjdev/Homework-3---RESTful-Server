var app;

function Init(){

   app = new Vue({
        el: "#app",
        data: {
            // just all of it in here
			locationDisplayBox: "",
            search_type: "latitude/longitude",
            neighborhood_Search: "",
            //store url from the jqueryuihtml thing
            search_results: [],
            neighborhood_results: [],
            code_data: [],
            neighborhood_data: {}
            
        },
        computed: {
            
        },
        mounted() {
        this.startMap()
        this.getCenter()
        this.getNeighborhoodData()
		this.setMarkers()
        
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

                var corner1=L.latLng(44.9883, -93.207);
                var corner2=L.latLng(44.8906, -93.004);
                var bounds = L.latLngBounds(corner1, corner2);
                mymap.setMaxBounds(bounds);
                setTimeout(MapSearch,100); //this allows app to finish building
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
                    //need to do call to convert from address to lat long
                }
                })


            },
            getNeighborhoodData(){
                neighborhoodSearch() 
            },
			getDataForMarkers(){
				
			},
			setMarkers(){
				var highwood = L.marker([44.946250, -93.025248]).addTo(mymap);
				highwood.bindPopup("Highwood").openPopup();
			}
            

        }
    });
	

}

//get crime data function on load 

//have separate function down here for api processing call stuff?
function MapSearch(event)
{
    if (app.map_search !== "")
    {
		console.log('hello2');
        let request = {
            url:"http://cisc-dean.stthomas.edu:8011/incidents",
            dataType: "json",
            headers: {
                //"Authorization": auth_data.token_type + " " + auth_data.access_token
            },
            success: MapData
        };
        $.ajax(request);
		//console.log('results: '+ app.search_results);
    }
    else
    {
		console.log('hello3');
        app.search_results = [];
    }
}
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
    {
		console.log('hello2');
        let request = {
            url:"http://cisc-dean.stthomas.edu:8011/neighborhoods",
            dataType: "json",
            headers: {
                //"Authorization": auth_data.token_type + " " + auth_data.access_token
            },
            success: neighborhoodData
        };
        $.ajax(request);
		//console.log('results: '+ app.search_results);
    }
}

function neighborhoodData(data)
{
    app.neighborhood_data = data;
	//console.log(app.search_results);
	console.log('proessing neighbrhood data');
    console.log(data);
}


function codeSearch(event){
    if (app.map_search !== "")
    {
		console.log('hello2');
        let request = {
            url:"http://cisc-dean.stthomas.edu:8011/codes",
            dataType: "json",
            headers: {
                //"Authorization": auth_data.token_type + " " + auth_data.access_token
            },
            success: codeData
        };
        $.ajax(request);
		//console.log('results: '+ app.search_results);
    }
    else
    {
		console.log('hello3');
        app.code_data = [];
    }
}

function codeData(data)
{
    app.code_data = data;
	//console.log(app.search_results);
	console.log('hello4');
    console.log(data);
}