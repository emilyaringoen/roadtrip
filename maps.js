$(document).ready(function() {



let makeMap = () => {
  // Map options
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(39.8282, -98.5795),
    panControl: false,
    panControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    scaleControl: false,
  };

  let map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
makeMap()

// for Autocomplete search bar

let setRoute = () => {
    let userDestination = $('#start').val()
    let endDestination = $('#end').val()
    let waypoint1 = {location: $('#wp1').val()}
    let waypoint2 = {location: $('#wp2').val()}


    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {lat: 39.8282, lng: -98.5795}
    });
    directionsDisplay.setMap(map);

let calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
      directionsService.route({
        origin: userDestination,
        destination: endDestination,
        waypoints: [waypoint1, waypoint2],
        travelMode: 'DRIVING'
      }, function(response, status){
        if (status === 'OK') {
          directionsDisplay.setDirections(response)
          let distance1 = [response.routes[0].legs[0].distance.text, response.routes[0].legs[0].duration.text]
          let distance2 = [response.routes[0].legs[1].distance.text, response.routes[0].legs[1].duration.text]
          let distance3 = [response.routes[0].legs[2].distance.text, response.routes[0].legs[2].duration.text]
          let totalDistance = parseInt(distance1[0]) + parseInt(distance2[0]) + parseInt(distance3[0])
          // let totalDuration = distance1[1] + distance2[1] + distance3[1]
          $('#duration').html(`<p id="time"><strong> ${distance1[1]} | ${distance2[1]} | ${distance3[1]} </strong></p>`)
          $('#distance').html(`<p id="miles"><strong>${totalDistance} miles</strong></p>`)
          console.log(response)
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      })
    }

    calculateAndDisplayRoute(directionsService, directionsDisplay)

}

let durationCalculator = () => {
  let hourAcc= 0
  let minAcc = 0

  let durA = '2 hours 2 min'
  let durB = '3 hours 3 min'
  let durC = '1 hour 58 min'
  let distanceBig = durA + ' ' + durB + ' ' + durC
  distanceBig = distanceBig.split(' ')

  console.log(distanceBig);
  for (var i = 0; i < distanceBig.length; i+=4) {
    let hours = +(distanceBig[i])
    hourAcc += hours
  }
  for (var i = 2; i < distanceBig.length; i+=4) {
    let min = +(distanceBig[i])
    minAcc += min
  }
  if (minAcc > 60) {
    hourAcc += Math.round(minAcc / 60)
    minAcc = minAcc % 60
  }
  let totalDuration = hourAcc + ' hours ' + minAcc + ' minutes'
  console.log(totalDuration)
 }

durationCalculator()

let createWaypoint = () => {
  
}

$('.waypoint').click(createWaypoint);
$('.search').click(setRoute);
})
