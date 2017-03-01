$(document).ready(function() {
  var stopPoints = 0
  var userDestination
  var endDestination
  var waypoints = []

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
    userDestination = $('#startDestination').val()
    endDestination = $('#endDestination').val()

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    for (var i = 1; i <= stopPoints; i++) {
      let stop = $(`#waypoint${i}`);
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
          console.log(response);
          let durations = ''
          let distances = []

          for (var i = 0; i < response.routes[0].legs.length; i++) {
            let distance = response.routes[0].legs[0].distance.text
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

  }

  /********************************
    function called in calculateAndDisplayRoute, used to calculate drive length
  ********************************/

  let durationCalculator = (string) => {
    let hourAcc = 0
    let minAcc = 0

    let durationsArr = string.split(' ')
    for (var i = 0; i < durationsArr.length; i += 4) {
      let hours = +(durationsArr[i])
      hourAcc += hours
    }
    for (var i = 2; i < durationsArr.length; i += 4) {
      let min = +(durationsArr[i])
      minAcc += min
    }
    // }
    if (minAcc > 60) {
      hourAcc += Math.round(minAcc / 60)
      minAcc = minAcc % 60
    }
    let totalDuration = hourAcc + ' hours ' + minAcc + ' minutes'
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
    button listener events
  ********************************/
  $('.waypoint').click(createWaypoint);
  $('.search').click(setRoute);
  $('#pacific').click(() => tripRoutes('San Diego', 'Seattle', [{location: 'Los Angeles'}, {location: 'Santa Barbara'}, {location: 'Big Sur'}, {location: 'San Fransisco'}, {location:
    'Red Woods'}]))
  $('#routeSixty').click(() => tripRoutes('Chicago', 'Grand Canyon', [{location: 'Saint Louis'}, {location: 'Meramec Caverns'}, {location: 'Labanon, MO'}, {location: 'Clinton, OK'}, {location: 'El Morro National Monument'}]))
  $('#lonely-desert').click(() => tripRoutes('Moab', 'Sedona', [{location: 'Monticello, UT'}, {location: 'Monument Valley'}, {location: 'Grand Canyon'}]))
  $('#wild-west').click(() => tripRoutes('Aspen', 'Glacier National Park', [{location: 'Rocky Mountain National park'}, {location: 'Yellow Stone'}, {location: 'Grand Teton National Park'}, {location: 'Bozeman'}]))
  $('#east-coast').click(() => tripRoutes('Portland, ME', 'Washington, DC', [{location: 'Boston'}, {location: 'Mystic, CN'}, {location: 'New York City'}, {location: 'Philadelphia'}]))
})

//Yelp App ID vzr5Q_hYVbvNfHwnKJd1bg
// yelp app secret YXW2tdSKOogmCDYT2HbHSsjb8edQRf7lsmSozQnWx2XBWQs5Ugq979J56XO1gZ0h
