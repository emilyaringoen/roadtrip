$(document).ready(function() {

  //Start geolocation
(function getUserLocation() {
    let pos;
    let userCords;
    if (navigator.geolocation) {
      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }

      function success(pos) {
        userCords = pos.coords;
        let location = {
          lat: userCords.latitude,
          lng: userCords.longitude
        }
        console.log(location)
          let marker = new google.maps.Marker({
            position: location,
            title: 'You are here!'});
            marker.setMap(map)

            let infoWindowOptions = {
              content: 'You are here!',
            }
            let infoWindow = new google.maps.InfoWindow(infoWindowOptions)
            google.maps.event.addListener(marker, 'click', function(e){
              infoWindow.open(map, marker);
            })

      }

      // Get the user's current position
      navigator.geolocation.getCurrentPosition(success, error);
      // console.log(pos.latitude + " " + pos.longitude);
    } else {
      alert('Geolocation is not supported in your browser');
    }
  })()


function makeMap() {
  // Map options
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(37.09024, -100.712891),
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

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
makeMap()

// for Autocomplete search bar
let acOptions = {
  types: ['establishment']
}

let autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), acOptions);
autocomplete.bindTo('bounds', map)

let infoWindow = new google.maps.InfoWindow()
let marker = new google.maps.Marker({
  map: map
})

google.maps.event.addListener(autocomplete, 'place_changed', function() {
  infoWindow.close()
  let place = autocomplete.getPlace()
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport)
  } else {
    map.setCenter(place.geometry.location)
    map.setZoom(12)
  }
  marker.setPosition(place.geometry.location)
  infoWindow.setContent('<div><strong>' + place.name + '</strong><br>')
  infoWindow.open(map, marker)
  google.maps.event.addListener(marker, 'click', function(e) {
    infoWindow.open(map, marker)
  })
})


$('.search').click(function() {
  let userDestination = $('input').val()
  console.log(userDestination)
})


})
