/* Embeds a Google Maps widget and sends/receives data to the backend */

"use strict";

var markers = [];

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById("google-map"), {
        center: {lat:  44.0457, lng: -123.0772}, //latitude/longitude of Anstett Hall
        zoom: 18,
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
