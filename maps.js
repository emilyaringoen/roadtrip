$(document).ready(function() {
  var stopPoints = 0
  var userDestination
  var endDestination
  var waypoints = []
  var tripPlaces = []
  var accumulator = {
    day: 0,
    hour: 0,
    min: 0
  }

  /********************************
      Make Map on page load
  ********************************/
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

  /********************************
    set route after search btn is clicked
  ********************************/

  let setRoute = () => {
    tripPlaces = []
    waypoints = []
    userDestination = $('#startDestination').val()
    endDestination = $('#endDestination').val()
    tripPlaces.push(userDestination)
    tripPlaces.push(endDestination)
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    for (var i = 1; i <= stopPoints; i++) {
      let stop = $(`#waypoint${i}`);
      tripPlaces.push(stop.val())
      let value = {
        location: stop.val()
      }
      waypoints.push(value)
    }
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {
        lat: 39.8282,
        lng: -98.5795
      }
    });
    directionsDisplay.setMap(map);

    let calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
      directionsService.route({
        origin: userDestination,
        destination: endDestination,
        waypoints: waypoints,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response)
          let legs = {
            distance: 0,
            duration: 0
          }
          let durations = ''
          let distances = []

          for (var i = 0; i < response.routes[0].legs.length; i++) {
            let distance = response.routes[0].legs[i].distance.text
            distance = distance.replace(',', '')
            distance = parseInt(distance)
            let duration = response.routes[0].legs[i].duration.text
            if (duration.includes('hours')) {
              durations += (duration + ' ')
            } else {
              durations += ('0 hrs ' + duration + ' ')
            }
            distances.push(distance)
            legs.distance += distance
          }

          let durationTotal = durationCalculator(durations)
          let averageMPG = 24
          let averageFuelCost = 2.29
          let gallonsPerTrip = (legs.distance) / averageMPG
          let costPerFuel = (averageFuelCost * gallonsPerTrip).toFixed(2)

          $('#duration').html(`<p id="time">Drive Time: <strong>${durationTotal}</strong></p>`)
          $('#distance').html(`<p id="miles">Total Miles: <strong>${legs.distance} miles</strong></p>`)
          $('#fuel').html(`<p id="gas">Fuel Cost: <strong>$${costPerFuel}</strong></p>`)

        } else {
          window.alert('Directions request failed due to ' + status)
        }
      })
    }

    calculateAndDisplayRoute(directionsService, directionsDisplay)
    photoSearch()
  }

  /********************************
    function called in calculateAndDisplayRoute, used to calculate drive length
  ********************************/

  let durationCalculator = (string) => {
    accumulator.day = 0
    accumulator.hour = 0
    accumulator.min = 0
    let totalDuration;
    let arr = string.split(' ')
    for (var i = 1; i < arr.length; i++) {
      if (i % 2 === 1) {
        accumulator[arr[i].replace(/s/, '')] += parseInt(arr[i - 1])
      }
    }

    accumulator.day += Math.floor(accumulator.hour / 24)
    accumulator.hour = accumulator.hour % 24
    accumulator.hour += Math.floor(accumulator.min / 60)
    accumulator.min = accumulator.min % 60


    if (accumulator.day > 0) {
      totalDuration = accumulator.day + ' days ' + accumulator.hour + ' hours ' + accumulator.min + ' minutes'
    } else {
      totalDuration = accumulator.hour + ' hours ' + accumulator.min + ' minutes'
    }

    return totalDuration
  }

  /********************************
    function to create input bars for waypoint entry
  ********************************/
  let createWaypoint = () => {
    stopPoints += 1
    $(`<input type="text" class="form-control" id="waypoint${stopPoints}" placeholder="Waypoint">`).insertBefore('#endDestination')
  }

  /********************************
    function to create input bars for waypoint entry
  ********************************/

  let tripRoutes = (start, end, waypoints) => {

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {
        lat: 39.8282,
        lng: -98.5795
      }
    });
    directionsDisplay.setMap(map);

    let calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
      directionsService.route({
        origin: start,
        destination: end,
        waypoints: waypoints,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response)
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      })
    }

    calculateAndDisplayRoute(directionsService, directionsDisplay)

  }
  /********************************
    flickr api
  ********************************/
  let photoSearch = () => {
    console.log(tripPlaces);
    let apiKey = '554b06bf7905da567bf55befe04d6984'
    for (var i = 0; i < tripPlaces.length; i++) {
      let place = tripPlaces[i]
      $.ajax({
        method: 'GET',
        url: 'https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' + apiKey + '&tags=' + tripPlaces[i] + '&safe_search=1&format=json',
        success: function(data) {
          data = data.substring(14,data.length-1);
          var jsonData = JSON.parse(data);
          let firstPhoto = jsonData.photos.photo[0]
            //build the url of the photo in order to link to it
            var photoURL = 'http://farm' + firstPhoto.farm + '.static.flickr.com/' + firstPhoto.server + '/' + firstPhoto.id + '_' + firstPhoto.secret + '_m.jpg'
            var img = `<div class="row"><div class="col-sm-6 col-md-4"><div class="thumbnail"><img src="${photoURL}" alt="Photo of ${place}"><div class="caption"><h3>${place}</h3></div></div></div></div>`
            $('#imgContainer').append(img)
        },
        error: function() {
          console.log('whoops. what did you do.');
        }
      })
    }
  }





  /********************************
    button listener events
  ********************************/
  $('.waypoint').click(createWaypoint);
  $('.search').click(setRoute);
  // $('#pacific').click(() => tripRoutes('Santa Barbara', 'Gold Beach, OR', [{
  //   location: 'Big Sur'
  // }, {
  //   location: 'San Fransisco'
  // }, {
  //   location: 'Red Woods'
  // }]))
  // $('#routeSixty').click(() => tripRoutes('Chicago', 'Grand Canyon', [{
  //   location: 'Saint Louis'
  // }, {
  //   location: 'Meramec Caverns'
  // }, {
  //   location: 'Labanon, MO'
  // }, {
  //   location: 'Clinton, OK'
  // }, {
  //   location: 'El Morro National Monument'
  // }]))
  // $('#lonely-desert').click(() => tripRoutes('Moab', 'Sedona', [{
  //   location: 'Monticello, UT'
  // }, {
  //   location: 'Monument Valley'
  // }, {
  //   location: 'Grand Canyon'
  // }]))
  // $('#wild-west').click(() => tripRoutes('Aspen', 'Glacier National Park', [{
  //   location: 'Rocky Mountain National park'
  // }, {
  //   location: 'Yellow Stone'
  // }, {
  //   location: 'Grand Teton National Park'
  // }, {
  //   location: 'Bozeman'
  // }]))
  // $('#east-coast').click(() => tripRoutes('Portland, ME', 'Washington, DC', [{
  //   location: 'Boston'
  // }, {
  //   location: 'Mystic, CN'
  // }, {
  //   location: 'New York City'
  // }, {
  //   location: 'Philadelphia'
  // }]))
})


// RoadTrip
// Key:
// 554b06bf7905da567bf55befe04d6984
//
// Secret:
// 4bc24675d2bd24d1
