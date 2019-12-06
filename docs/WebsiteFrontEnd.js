var app;

function Init(){
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
            search_type: "address",
            latitude: "Enter Latitude Here",
            longitude: "Enter Longitude Here",
            search_types: [
                {value: "latitude/longitude", text: "Latitude/Longitude"},
                {value: "address", text: "address"}
            ]
        },
        computed: {
            
        }
    })

}

//have separate function down here for api processing call stuff?