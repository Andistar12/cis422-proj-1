/* Embeds a Google Maps widget and sends/receives data to the backend */

"use strict";

var apiKey;
//holds Marker objects signifying destinations for the salesman
var markers = [];
//holds the total number of markers that have been added to the map
var markerCount = 0;

//initialize the search when the document is ready
$(initSearch);

//Google Maps API object
var map;
function initMap() {
    apiKey = window.__nope_apiKey;
    //initialize a Google Maps object with the google-map DOM element
    map = new google.maps.Map(document.getElementById("google-map"), {
        //initialize the starting position of the map
        center: {lat:  44.0458, lng: -123.0711}, //latitude/longitude of Deschutes Hall
        zoom: 17,
        streetViewControl: false
    });

    //watch for click events on the map and add a marker at the click point
    map.addListener("click", function(event) {
        //increment the number of markers and save the index of this marker
        var markerID = markerCount++;
        //initialize a new marker at the location of the click
        var marker = new google.maps.Marker({
            position: event.latLng,
            draggable: true,
            map,
            title: "Marker #" + markerID //shown when marker is hovered on
        });

        //function to remove this marker from the map
        //this function is "bound" to the marker created above
        //this function is called when a marker or its "x" button is clicked
        function removeMarker() {
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
        }

        //returns the text of this marker's entry in the list
        //used initially and when marker is dragged
        function getLabel() {
            var s = "Marker #" + markerID + ": ";
            s += marker.position.lat() + ", ";
            s += marker.position.lng();
            return s;
        }
        
        //add an entry to the list of markers
        //each entry is an <a> that has two <span> children
        //the first span holds the latitude and longitude of the marker
        //the second holds a button to remove the marker from the map
        $("#marker-list").append(
            $("<a>")
                .attr("id", "marker-" + markerID)
                .addClass("list-group-item")
                .append($("<span>")
                    .html(getLabel)
                )
                .append($("<span>")
                    .html("&#x2715;")
                    .attr("class", "x-btn")
                    .click(removeMarker)
                )
        );
        
        //assign unique identifier to this marker
        marker.id = markerID;
        
        //watch for click events on the marker and remove the marker if clicked
        marker.addListener("click", removeMarker);
        //update the latitude/longitude of the marker as it is dragged
        marker.addListener("drag", function() {
            $("span", "#marker-" + markerID).eq(0).html(getLabel);
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
    $("#path-list").text("None");
}

//starts the process of computing the optimal path through the markers
function computePath() {
    //exit if there are no markers on the map
    if (markers.length === 0) {
        return;
    }
    //holds origin locations for the API to compute distances
    var origins = [];
    //holds destination locations for the API to compute distances
    var destinations = [];
    var length = markers.length;
    //iterate over markers on map, adding their positions to the arrays
    for (var i = 0; i < length; i++) {
        var lat = markers[i].position.lat();
        var lng = markers[i].position.lng();
        //instantiate a LatLng object with the marker's position
        var latLng = new google.maps.LatLng(lat, lng);
        origins.push(latLng);
        destinations.push(latLng);
    }
    //instantiate an object to send requests to the server
    var service = new google.maps.DistanceMatrixService();
    //request a distance matrix between origins and destinations
    //after the request is processed, distanceCallback will be called
    service.getDistanceMatrix({
        origins: origins,
        destinations: destinations,
        travelMode: "DRIVING"
    }, distanceCallback)
}

//called when the API responds to a distance matrix request
function distanceCallback(response, status) {
    //if distances were not calculated, report the status to the console
    if (status !== "OK") {
        console.error(status);
        return;
    }
    //2D matrix that holds distances between markers
    var matrix = [];
    //extract information from the response object
    var rows = response.rows;
    var length = rows.length;
    //iterate over the rows object from the response
    for (var i = 0; i < length; i++) {
        //append a new row to the matrix
        matrix.push([]);
        for (var j = 0; j < length; j++) {
            //append the distance from marker i to marker j
            //to the end of the current row
            var value = rows[i].elements[j].duration.value;
            matrix[i].push(value);
        }
    }

    // Call the backend and on return
    $.ajax({
        type: "POST",
        url: $SCRIPT_ROOT + "/_solve_tsp",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ mtx: matrix }),
        success: function(data){
            var answer = data.result.answer;
            //transform list of indices to list of IDs
            var ids = [];
            for (var i = 0; i < answer.length; i++) {
                ids.push(markers[answer[i]].id);
            }
            var s = ids.join(", ");
            //display the optimal path to the user
            $("#path-list").text(s);
        },
        error: function(jqXHR) {
            alert("Server returned status: " + jqXHR.status);
        }
    })
}

//add a listener to the search bar to search on enter
function initSearch() {
    $("#txf-search-location").keydown(function(event) {
        if (event.key === "Enter") {
            searchLocation();
        }
    });
}

//pan to the location searched in the search bar
function searchLocation() {
    //extract the term from the search bar
    var search = $("#txf-search-location").prop("value");
    if (!search) return;
    var data = {address: search, key: apiKey}; //data sent to the service
    //Google's Geocoding API
    var url = "https://maps.googleapis.com/maps/api/geocode/json";
    //send a GET request to the server with the data
    jQuery.get(url, data, function(data) {
        if (data.status !== "OK") { //fail if server returned an error
            console.error(data.status);
            return;
        }
        console.log(data);
        //extract location data for the first search result
        var location = data.results[0].geometry.location;
        //move the map to the requested location
        map.panTo(location);
        map.setZoom(18);
    }).fail(function(jqXHR, status, error) {
        console.log(jqXHR, status, error);
    });
}
