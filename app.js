'use strict';

// variable allHikes is equal to an array of hike objects on data.js file
var allHikes = JSON.parse(hikes);
var form = document.getElementById('find-hike');

// receives form data from find-hike.html
function formData(event) {
  event.preventDefault();

  // receives value from find-hike.html form, parses value into integer
  var lengthPref = parseInt(event.target.length.value);

  lengthPreference(lengthPref);
}

// sorts hikes by length
function lengthPreference(value) {
  console.log(allHikes.length);
  var lengthSortArr = [];

  // receives hike length form data
  // note: 481 hikes have null for hike length
  if (value === 1) {
    for(var i = 0; i < allHikes.length; i++) {
      var hikeLength = parseInt(allHikes[i].length);
      if (hikeLength < 5.0) {
        lengthSortArr.push(hikeLength);
      }
    }
  }
  if (value === 2) {
    for(var j = 0; j < allHikes.length; j++) {
      hikeLength = parseInt(allHikes[j].length);
      if (hikeLength >= 5.0 && hikeLength < 10.0) {
        lengthSortArr.push(hikeLength);
      }
    }
  }
  if (value === 3) {
    for(var k = 0; k < allHikes.length; k++) {
      hikeLength = parseInt(allHikes[k].length);
      if (hikeLength >= 10.0 && hikeLength < 15.0) {
        lengthSortArr.push(hikeLength);
      }
    }
  }
  if (value === 4) {
    for(var l = 0; l < allHikes.length; l++) {
      hikeLength = parseInt(allHikes[l].length);
      if (hikeLength >= 15.0 && hikeLength < 20.0) {
        lengthSortArr.push(hikeLength);
      }
    }
  }
  if (value === 5) {
    for(var m = 0; m < allHikes.length; m++) {
      hikeLength = parseInt(allHikes[m].length);
      if (hikeLength >= 20.0) {
        lengthSortArr.push(hikeLength);
      }
    }
  }
  console.log(lengthSortArr.length);
}


// sort by elevation gain
function elevationGain() {
  var counter = 0;
  for(var i = 0; i < allHikes.length; i++) {
    var elevationGain = parseInt(allHikes[i].elevGain);
    if (elevationGain <= 50.0) {
      counter += 1;
    }
  }
  console.log('# of hikes under 50 ft elevation gain',counter);
}

// sort by distance of Seattle
//    which means we have to figure out lat/long calculation

// sort by rating


// TEST - retrieve ratings
function hikeRating() {
  var counter = 0;
  for(var i = 0; i < allHikes.length; i++) {
    var hikeRating = parseInt(allHikes[i].rating);
    if (hikeRating === 5.0) {
      counter += 1;
    }
  }
  console.log('# of hikes with 5.0 ratings',counter);
}

form.addEventListener('submit', formData);
