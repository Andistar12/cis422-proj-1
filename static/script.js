/* Embeds a Google Maps widget and sends/receives data to the backend */

"use strict";

var apiKey;
//holds Marker objects signifying destinations for the salesman
var markers = [];
//holds the total number of markers that have been added to the map
var markerCount = 0;
//holds the directionsRenderer from the google maps api to draw the route
var directionsRenderer;

//initialize the search when the document is ready
$(initSearch);

//set the cookie before exiting the page
window.addEventListener("beforeunload", setCookie);

//Google Maps API object
var map;
function initMap() {
    apiKey = window.__nope_apiKey;
    //initialize a Google Maps object with the google-map DOM element
    map = new google.maps.Map(document.getElementById("google-map"), {
        //initialize the starting position of the map
        center: {lat:  44.0458, lng: -123.0711}, //latitude/longitude of Deschutes Hall
        zoom: 17,
        streetViewControl: false,
        mapId: '339e9334a976ae8a'
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
            title: "Marker" //shown when marker is hovered on
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
            var s = "Marker: ";
            s += marker.position.lat().toFixed(6) + ", ";
            s += marker.position.lng().toFixed(6);
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
                    .attr("class", "marker-lbl")
                    .click(function() {
                        //when a label is clicked, move the map to the marker
                        map.panTo(marker.position);
                        map.setZoom(18);
                    })
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
        setCookie(); //set the cookie after each marker is placed
    });

    //if a cookie is found, set up the page accordingly
    if (document.cookie) {
        var cookie = JSON.parse(document.cookie);
        var position = cookie.position;
        var pos = new google.maps.LatLng(position.lat, position.lng);
        //move the map to the old location
        map.panTo(pos);
        map.setZoom(position.zoom);
        //simulate click events on the map at each marker's position
        for (var i = 0; i < cookie.markers.length; i++) {
            var marker = cookie.markers[i];
            var lat = marker.lat;
            var lng = marker.lng;
            //simulate the event passed to the handler
            var arg = {latLng: new google.maps.LatLng(lat, lng)};
            google.maps.event.trigger(map, "click", arg);
        }
    }
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
    if (directionsRenderer != null)
        directionsRenderer.setMap(null);
    //reset the list of markers
    markers = [];
    //reset the marker count, so new markers start at 0
    markerCount = 0;
    $("#path-list").text("Please press \"Compute Path\" when ready.");
    setCookie(); //reset the cookie when markers are cleared
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

function calculateAndDisplayRoute(
    directionsRenderer,
    directionsService,
    markerArray
) {
    // First, remove any existing markers from the map.
    for (let i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    var waypointsArray = [];

    for (let i = 1; i < markerArray.length-1; i++) {
        //console.log(markerArray[i].position);
        waypointsArray.push({
            location: markerArray[i].position,
            stopover: true,
        });
    }
    // Retrieve the start and end locations and create a DirectionsRequest using
    // DRIVING directions.
    directionsService
        .route({
            origin: markerArray[0].position,
            destination: markerArray[markerCount-1].position,
            waypoints: waypointsArray,
            travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((result) => {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            document.getElementById("warnings-panel").innerHTML =
                "<b>" + result.routes[0].warnings + "</b>";
            directionsRenderer.setDirections(result);
        })
        .catch((e) => {
            window.alert("Directions request failed due to " + e);
        });
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

            var totalTime = optimalTime(matrix, answer);
            var s = ids.join(", ");
            s += ` (${totalTime})`;
            //display the optimal path to the user
            $("#path-list").text(s);

            var orderedMarkers = [];
            for (var i = 0; i < answer.length; i++) {
                orderedMarkers.push(markers[answer[i]]);
            }

            // Instantiate a directions service.
            const directionsService = new google.maps.DirectionsService();

            // Create a renderer for directions and bind it to the map.
            directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

            calculateAndDisplayRoute(
                directionsRenderer,
                directionsService,
                orderedMarkers
            );
        },
        error: function(jqXHR) {
            alert("Server returned status: " + jqXHR.status);
        }
    })
}

function optimalTime(matrix, result) {
    var time = 0;
    for (var i = 1; i < result.length; i++) {
        var start = result[i-1];
        var end = result[i];
        time += matrix[start][end];
    }
    var hours = Math.floor(time/3600);
    var minutes = time % 60;
    var res = `${minutes} minute${minutes == 1 ? "" : "s"}`;
    if (hours) {
        res = `${hours} hour${hours == 1 ? "" : "s"}, ` + res;
    }
    return res;
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
    var bounds = map.getBounds();
    var swBound = bounds.tc;
    var neBound = bounds.Hb;
    bounds = `${swBound.g},${swBound.i}|${neBound.g},${neBound.i}`;
    //Google's Geocoding API
    var url = "https://maps.googleapis.com/maps/api/geocode/json";
    //send a GET request to the server with the data
    jQuery.get(url, data, function(data) {
        if (data.status !== "OK") { //fail if server returned an error
            console.error(data.status);
            return;
        }
        //extract location data for the first search result
        var location = data.results[0].geometry.location;
        //move the map to the requested location
        map.panTo(location);
        map.setZoom(18);
    }).fail(function(jqXHR, status, error) {
        console.log(jqXHR, status, error);
    });
}

//store the current location and markers in a cookie
function setCookie() {
    var cookie = {}; //initialize the cookie object
    cookie.position = {};
    //add the current map position to the cookie
    cookie.position.lat = map.center.lat();
    cookie.position.lng = map.center.lng();
    cookie.position.zoom = map.zoom;
    cookie.markers = [];
    //add each marker on the map to the cookie
    for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        var obj = {
            id: marker.id,
            lat: marker.position.lat().toFixed(6),
            lng: marker.position.lng().toFixed(6)
        }
        cookie.markers.push(obj);
    }
    //set the cookie attribute of the page
    document.cookie = JSON.stringify(cookie);
}
