'use strict';

// variable allHikes is equal to an array of hike objects on data.js file
var allHikes = JSON.parse(hikes);


// We will need to:
// sort by hike length


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
elevationGain();

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
hikeRating();
