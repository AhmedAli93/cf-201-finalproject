'use strict';

// variable allHikes is equal to an array of hike objects on data.js file
var allHikes = JSON.parse(hikes);
var form = document.getElementById('find-hike');
var codeFellowsLat = 47.618248;
var codeFellowsLng = -122.351871;

// data from lengthPreference function
var lengthPrefArr = [];
// data from elevationGainPreference function
var elevGainPrefArr = [];
// data from distancePreference function
var sortedHikesArr = [];

// distance calculation from http://www.geodatasource.com/developers/javascript
// Passed to function:
//  lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)
//  lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)
//  unit = the unit you desire for results
//    'M' is statute miles (default)
//    'K' is kilometers
//    'N' is nautical miles
// Note: this calculates the air (?) distance, NOT the driving distance
// for that, we'd need https://developers.google.com/maps/documentation/directions/ or https://developers.google.com/maps/documentation/distance-matrix/
function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit === 'K') {
    dist = dist * 1.609344;
  };
  if (unit === 'N') {
    dist = dist * 0.8684;
  };
  return dist;
}

/* INPUTS FROM FORM */
// receives form data from find-hike.html
function formData(event) {
  event.preventDefault();

  // receives value from find-hike.html form, parses value into integer
  var lengthPref = parseInt(event.target.length.value);
  var elevPref = parseInt(event.target.elevation.value);

  lengthPreference(lengthPref);
  elevationGainPreference(elevPref);
  // change with variable from form:
  distancePreference(1);

  // change windows
  // window.location.href = 'hike-results.html';

  if (sortedHikesArr.length > 0) {
    renderMainHike();
  } else {
    noHikes();
  }
}

/* SORTING FUNCTIONS */
// sorts hikes by length
function lengthPreference(value) {
  // receives hike length form data
  // note: 481 hikes have null for hike length
  if (value === 1) {
    for(var i = 0; i < allHikes.length; i++) {
      var hikeLength = parseInt(allHikes[i].length);
      if (hikeLength < 5.0) {
        lengthPrefArr.push(allHikes[i]);
      }
    }
  }
  if (value === 2) {
    for(var j = 0; j < allHikes.length; j++) {
      hikeLength = parseInt(allHikes[j].length);
      if (hikeLength >= 5.0 && hikeLength < 10.0) {
        lengthPrefArr.push(allHikes[j]);
      }
    }
  }
  if (value === 3) {
    for(var k = 0; k < allHikes.length; k++) {
      hikeLength = parseInt(allHikes[k].length);
      if (hikeLength >= 10.0 && hikeLength < 15.0) {
        lengthPrefArr.push(allHikes[k]);
      }
    }
  }
  if (value === 4) {
    for(var l = 0; l < allHikes.length; l++) {
      hikeLength = parseInt(allHikes[l].length);
      if (hikeLength >= 15.0 && hikeLength < 20.0) {
        lengthPrefArr.push(allHikes[l]);
      }
    }
  }
  if (value === 5) {
    for(var m = 0; m < allHikes.length; m++) {
      hikeLength = parseInt(allHikes[m].length);
      if (hikeLength >= 20.0) {
        lengthPrefArr.push(allHikes[m]);
      }
    }
  }
}

// sort results from lengthPreference function by elevation gain,push into elevGainPrefArr
function elevationGainPreference(value) {
  console.log(lengthPrefArr.length);

  if (value === 1) {
    for(var i = 0; i < lengthPrefArr.length; i++) {
      var elevGain = parseInt(lengthPrefArr[i].elevGain);
      if (elevGain < 1000.0) {
        elevGainPrefArr.push(lengthPrefArr[i]);
      }
    }
  }
  // TO DO: Add rest of conditional sorting statements
}

// sort results from elevGainPrefArr function by elevation gain,push into sortedHikesArr
function distancePreference(value) {
  for(var i = 0; i < elevGainPrefArr.length; i++) {
    var hikeLat = parseFloat(elevGainPrefArr[i].lat);
    var hikeLng = parseFloat(elevGainPrefArr[i].lng);
    var hikeDistance = distance(codeFellowsLat, codeFellowsLng, hikeLat, hikeLng, 'M');
    elevGainPrefArr[i].distance = hikeDistance;
  }
  if (value === 1) {
    for(var j = 0; j < elevGainPrefArr.length; j++) {
      if (elevGainPrefArr[j].distance < 20.0) {
        sortedHikesArr.push(elevGainPrefArr[j]);
      }
    }
  }
  // TO DO: Add rest of conditional sorting statements

  // Sort array of hikes by rating (highest at index 0)
  // code from https://davidwalsh.name/array-sort
  sortedHikesArr.sort(function(obj1, obj2) {
    return obj2.rating - obj1.rating;
  });
  console.log(sortedHikesArr);
}

/* DISPLAY RESULTS ON HIKE-RESULTS.HTML */
// render main hike (sortedHikesArr - index 0)
function renderMainHike() {
  var hikeName = sortedHikesArr[0].name;
  var hikeLength = sortedHikesArr[0].length;
  var hikeURL = 'http://www.wta.org/go-hiking/hikes/' + sortedHikesArr[0].id;
  console.log(hikeName, hikeLength, hikeURL);
}

// render list(s) of hikes

// render error messages if no hikes are available, button so user can go back?
function noHikes() {
  console.log('No hikes available!');
};

form.addEventListener('submit', formData);
