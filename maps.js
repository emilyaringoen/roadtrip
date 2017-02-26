$(document).ready(function() {



function makeMap() {
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
    scaleControl: false

  };

  let map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
makeMap()

// for Autocomplete search bar



$('.search').click(function() {
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


  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: userDestination,
      destination: endDestination,
      waypoints: [waypoint1, waypoint2],
      travelMode: 'DRIVING'
    }, function(response, status){
      if (status === 'OK') {
        directionsDisplay.setDirections(response)
      } else {
        window.alert('Directions request failed due to ' + status)
      }
    })
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay)
})


})
