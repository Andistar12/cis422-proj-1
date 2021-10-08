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
        //increment the number of markers and save the index of this marker
        var markerID = markerCount++;
        //initialize a new marker at the location of the click
        var marker = new google.maps.Marker({
            position: event.latLng,
            map,
            title: "Marker #" + markerID //shown when marker is hovered on
        });
        
        //add an entry to the list of markers 
        $("#marker-list").append(
            $("<div>")
                .text(function() {
                    //label each entry with the marker's number and coordinates
                    var s = "Marker #" + markerID + ": ";
                    s += event.latLng.lat() + ", ";
                    s += event.latLng.lng();
                    return s;
                })
                .attr("id", "marker-" + markerID)
        );
        
        //assign unique identifier to this marker
        marker.id = markerID;
        
        //watch for click events on the marker and remove the marker if clicked
        marker.addListener("click", function(event) {
            marker.setMap(null);
            //find index of this marker in the list
            var index = 0;
            while (markers[index].id != marker.id) {
                index++;
            }
            //remove this marker from the list
            markers.splice(index, 1);
            //remove the marker's entry from the list of markers
            $("#marker-" + marker.id).remove();
            if (markers.length === 0) {
                markerCount = 0;
            }
        });
        //add the marker to the list of markers
        markers.push(marker);
    });
}

//removes all markers from the map and resets marker count
function clearMarkers() {
    var length = markers.length;
    for (var i = 0; i < length; i++) {
        var marker = markers[i];
        //for each marker object in the list, remove it from the map
        marker.setMap(null);
        //remove the marker's associated entry in the marker table
        $("#marker-" + marker.id).remove();
    }
    //reset the list of markers
    markers = [];
    //reset the marker count, so new markers start at 0
    markerCount = 0;
}

function computePath() {
    return;
}
