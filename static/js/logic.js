
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// console.log(queryUrl)
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  
});


function createFeatures(earthquakeData) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) +
      "<br> Mag: "+ feature.properties.mag+"</br>"+ "</p>");
  }


  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
    // pointToLayer: function (geoJsonPoint, latlng) {
    // return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag)
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}



// var magnitude = data.feature.properties.mag;
function markerSize(magnitude) {
  return magnitude * 4;
};

//colors for the legend
function Color(magnitude) {
  if (magnitude>5) {
    return 'red'
  } else if (magnitude>4) {
    return 'darkorange'
  } else if (magnitude>3) {
    return 'darkyellow'
  } else if (magnitude>2) {
    return 'yellow'
  } else if (magnitude>1) {
    return 'green'
  }
};


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //create a legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map){
      var div = L.DomUtil.create("div", "info legend"),
      
      magnitutde = [0,1,2,3,4,5],
      labels =[];

    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    for (var i=0; i<magnitutde.length; i++) {
        div.innerHTML +=
        '<div class="color-box" style="background-color:' + Color(magnitude[i] + 1) + ';"></div> '+ 
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');

    }
    return div;
  };
legend.addTo(myMap);

}

