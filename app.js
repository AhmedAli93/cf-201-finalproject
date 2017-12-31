'use strict';

// variable allHikes is equal to an array of hike objects on data.js file
var allHikes = JSON.parse(hikes);
var form = document.getElementById('find-hike');
var codeFellowsLat = 47.618248;
var codeFellowsLng = -122.351871;
var pathname = window.location.pathname;
var address = pathname.split('/');
var currentAddress = address[address.length - 1];

// data from lengthPreference function
var lengthPrefArr = [];
// data from elevationGainPreference function
var elevGainPrefArr = [];
// data from distancePreference function
var sortedHikesArr = [];

// call all functions depending on which page you're on
if (currentAddress === 'find-hike.html') {
  form.addEventListener('submit', formData);
} else if (currentAddress === 'hike-results.html') {
  load();
  if (sortedHikesArr.length > 0) {
    renderMainHike();
    renderHikeList();
  } else {
    noHikes();
  }

}

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
// Google distance API key - AIzaSyAUD_3iUCdQBwshYSV2mxcGgxjG6xsCxag
// Google Maps Directions API - AIzaSyD0wyQbg_YkXb1DSLCOSt2uk8BkSjmL9qQ
// codePen reference https://codepen.io/youfoundron/pen/GIlvp
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

// from https://developers.google.com/maps/documentation/javascript/examples/distance-matrix
// https://developers.google.com/maps/documentation/distance-matrix/intro#DirectionsResponseElements
function googleDistance(originLat, originLng, destLat, destLng) {
  var service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix(
    {
      origins: [originLat, originLng],
      // origins=41.43206,-81.38992|-33.86748,151.20699
      destinations: [destLat, destLng],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false,
    },
    callback
  );

  function callback(response, status) {

    if (status === 'OK') {
      var dist = response.rows[0].elements[0].distance.text;
      console.log(dist);
    } else {
      alert('Error: ' + status);
    }
  }
}

/* INPUTS FROM FORM */
// receives form data from find-hike.html
function formData(event) {
  event.preventDefault();

  // receives value from find-hike.html form, parses value into integer
  var lengthPref = parseInt(event.target.length.value);
  var elevPref = parseInt(event.target.elevation.value);
  var distPref = parseInt(event.target.distance.value);

  lengthPreference(lengthPref);
  elevationGainPreference(elevPref);
  distancePreference(distPref);
  save();

  // change windows
  window.location.href = 'hike-results.html';
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
  if (value === 1) {
    for(var i = 0; i < lengthPrefArr.length; i++) {
      var elevGain = parseInt(lengthPrefArr[i].elevGain);
      if (elevGain < 1000.0) {
        elevGainPrefArr.push(lengthPrefArr[i]);
      }
    }
  }
  if (value === 2) {
    for(var j = 0; j < lengthPrefArr.length; j++) {
      elevGain = parseInt(lengthPrefArr[j].elevGain);
      if (elevGain >= 1000.0 && elevGain < 2000.0){
        elevGainPrefArr.push(lengthPrefArr[j]);
      }
    }
  }
  if (value === 3) {
    for(var l = 0; l < lengthPrefArr.length; l++) {
      elevGain = parseInt(lengthPrefArr[l].elevGain);
      if(elevGain >= 2000.0 && elevGain < 3000.0){
        elevGainPrefArr.push(lengthPrefArr[l]);
      }
    }
  }
  if (value === 4) {
    for(var m = 0; m < lengthPrefArr.length; m++) {
      elevGain = parseInt(lengthPrefArr[m].elevGain);
      if(elevGain >= 3000.0 && elevGain < 4000.0) {
        elevGainPrefArr.push(lengthPrefArr[m]);
      }
    }
  }
  if (value === 5) {
    for(var n = 0; n < lengthPrefArr.length; n++) {
      elevGain = parseInt(lengthPrefArr[n].elevGain);
      if (elevGain >= 4000.0) {
        elevGainPrefArr.push(lengthPrefArr[n]);
      }
    }
  }
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
      if (elevGainPrefArr[j].distance < 25.0) {
        sortedHikesArr.push(elevGainPrefArr[j]);
      }
    }
  }
  if (value === 2) {
    for(var k = 0; k < elevGainPrefArr.length; k++) {
      if (elevGainPrefArr[k].distance >= 25.0 && elevGainPrefArr[k].distance < 50.0) {
        sortedHikesArr.push(elevGainPrefArr[k]);
      }
    }
  }
  if (value === 3) {
    for(var l = 0; l < elevGainPrefArr.length; l++) {
      if (elevGainPrefArr[l].distance >= 50.0 && elevGainPrefArr[l].distance < 100.0) {
        sortedHikesArr.push(elevGainPrefArr[l]);
      }
    }
  }
  if (value === 4) {
    for(var m = 0; m < elevGainPrefArr.length; m++) {
      if (elevGainPrefArr[m].distance >= 100.0 && elevGainPrefArr[m].distance < 150.0) {
        sortedHikesArr.push(elevGainPrefArr[m]);
      }
    }
  }
  if (value === 5) {
    for(var n = 0; n < elevGainPrefArr.length; n++) {
      if (elevGainPrefArr[n].distance >= 150) {
        sortedHikesArr.push(elevGainPrefArr[n]);
      }
    }
  }

  // Sort array of hikes by rating (highest at index 0)
  // code from https://davidwalsh.name/array-sort
  sortedHikesArr.sort(function(obj1, obj2) {
    return obj2.rating - obj1.rating;
  });
  console.log(sortedHikesArr);
}

/* ADD sortedHikesArr TO LOCAL STORAGE */
function save() {
  localStorage.sortedHikesArr = JSON.stringify(sortedHikesArr);
}

// load array of hikes from local storage
function load() {
  sortedHikesArr = JSON.parse(localStorage.sortedHikesArr);
}

/* DISPLAY RESULTS ON HIKE-RESULTS.HTML */
// render main hike (sortedHikesArr - index 0)
function renderMainHike() {
  // var hikeName = sortedHikesArr[0].name;
  // var hikeRating = sortedHikesArr[0].rating;
  // var hikeLength = sortedHikesArr[0].length;
  // var hikeElev = sortedHikesArr[0].elevGain;
  // var hikeURL = 'http://www.wta.org/go-hiking/hikes/' + sortedHikesArr[0].id;
  //
  // var mainHikeList = document.getElementById('main-hike-ul');
  // var liEl = document.createElement('li');
  // liEl.textContent = hikeName;
  // mainHikeList.appendChild(liEl);
  //
  // var mainHikeName = document.getElementById('main-hike-name');
  // var mainHikeRating = document.getElementById('main-hike-rating');
  // var mainHikeLength = document.getElementById('main-hike-length');
  // var mainHikeElev = document.getElementById('main-hike-elev');
  // var mainHikeURL = document.getElementById('')

  // console.log(hikeName, hikeLength, hikeURL, hikeElev, hikeRating);
}

// render list(s) of hikes
function renderHikeList() {
  var hikeList = document.getElementById('list-hike-ul');

  for(var i = 0; i < sortedHikesArr.length; i++) {
    var liEl = document.createElement('li');
    liEl.innerHTML = sortedHikesArr[i].name;
    hikeList.appendChild(liEl);
  }
}
// render error messages if no hikes are available, button so user can go back?
function noHikes() {
  console.log('No hikes available!');
};
