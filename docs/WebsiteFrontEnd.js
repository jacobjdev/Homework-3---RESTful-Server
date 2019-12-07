var app;

function Init(){
	console.log('hello');
    // so main application page stuff goes in here?
    // var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiampqYTM4MCIsImEiOiJjazN0ZjJiYWMwMjlpM2VvMXBpMjgzM2FhIn0.ULokQFAtfcbyUp9AR8-IjA', {
    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    // maxZoom: 18,
    // id: 'mapbox/streets-v11',
    // accessToken: 'pk.eyJ1IjoiampqYTM4MCIsImEiOiJjazN0ZjJiYWMwMjlpM2VvMXBpMjgzM2FhIn0.ULokQFAtfcbyUp9AR8-IjA'
    // }).addTo(mymap);

   app = new Vue({
        el: "#app",
        data: {
            // just all of it in here
			spotify_search: "",
            search_type: "address",
            latitude: "Enter Latitude Here",
            longitude: "Enter Longitude Here",
            search_types: [
                {value: "latitude/longitude", text: "Latitude/Longitude"},
                {value: "address", text: "address"}
            ],
			search_results: []
        },
        computed: {
            
        }
    });
	
	var mymap = L.map('mapid').setView([44.9537, -93.09], 12);
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


}

//get crime data function on load 

//have separate function down here for api processing call stuff?
function MapSearch(event)
{
    if (app.spotify_search !== "")
    {
        let request = {
            url:"https://api.spotify.com/v1/search?q=" + app.spotify_search + "&type=" + app.spotify_type,
            dataType: "json",
            headers: {
                //"Authorization": auth_data.token_type + " " + auth_data.access_token
            },
            success: MapData
        };
        $.ajax(request);
    }
    else
    {
        app.search_results = [];
    }
}
function MapData(data)
{
    app.search_results = data[app.search_type].items;
    console.log(data);
}