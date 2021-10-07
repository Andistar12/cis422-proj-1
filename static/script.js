/* Embeds a Google Maps widget and sends/receives data to the backend */

"use strict";

//holds Marker objects signifying destinations for the salesman
var markers = [];

//Google Maps API object
var map;
function initMap() {
	//initialize a Google Maps object with the google-map DOM element
    map = new google.maps.Map(document.getElementById("google-map"), {
		//initialize the starting position of the map
        center: {lat:  44.0458, lng: -123.0711}, //latitude/longitude of Deschutes Hall
        zoom: 19,
        streetViewControl: false
    });

    //watch for click events on the map and add a marker at the click point
    map.addListener("click", function(event) {
		//initialize a new marker at the location of the click
        var marker = new google.maps.Marker({
            position: event.latLng,
            map,
            title: "My Marker"
        });
        //watch for click events on the marker and remove the marker if clicked
        marker.addListener("click", function(event) {
            marker.setMap(null);
        });
        //add the marker to the list of markers
        markers.push(marker);
    });
}
