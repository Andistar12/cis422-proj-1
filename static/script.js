/* Embeds a Google Maps widget and sends/receives data to the backend */

"use strict";

//holds Marker objects signifying destinations for the salesman
var markers = [];
//holds the total number of markers that have been added to the map
var markerCount = 0;

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
            title: "Marker #" + markerCount //shown when marker is hovered on
        });
        
        //assign unique identifier to this marker and increment count
        marker.id = markerCount++;
        
        //watch for click events on the marker and remove the marker if clicked
        marker.addListener("click", function(event) {
            marker.setMap(null);
            //find index of this marker in the list
            var index = 0;
            while (markers[index].id != marker.id) index++;
            //remove this marker from the list
            markers.splice(index, 1);
        });
        //add the marker to the list of markers
        markers.push(marker);
    });
}
