/* Embeds a Google Maps widget and sends/receives data to the backend */

"use strict";

var markers = [];

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById("google-map"), {
        center: {lat:  44.0458, lng: -123.0711}, //latitude/longitude of Deschutes Hall
        zoom: 19,
        streetViewControl: false
    });
    map.addListener("click", function(event) {
        var marker = new google.maps.Marker({
            position: event.latLng,
            map,
            title: "My Marker"
        });
        marker.addListener("click", function(event) {
            marker.setMap(null);
        });
        markers.push(marker);
    });
}
