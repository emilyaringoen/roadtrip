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
    let mapOptions = {
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
    $('#weather').empty()

      $(`.waypoint-input`).each(function(index, waypoint) {
         let stop = $(waypoint).val();
         tripPlaces.push(stop)
         let value = {
           location: stop
         }
         waypoints.push(value)
      });

    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: {
        lat: 39.8282,
        lng: -98.5795
      }
    });
    let infowindow = new google.maps.InfoWindow()
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
    weather()
    calculateAndDisplayRoute(directionsService, directionsDisplay)
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
    $(`<input type="text" class="form-control waypoint waypoint-input" placeholder="Waypoint">`).insertBefore('#endDestination')
  }

$('#searchPanel').on('dblclick', '.waypoint', function(){
  $(event.target).remove();
})


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
    weather api
  ********************************/
  var weatherIcon = {
    '01d': 'simple_weather_icon_01.png',
    '02d': 'simple_weather_icon_04.png',
    '03d': 'simple_weather_icon_04.png',
    '04d': 'simple_weather_icon_04.png',
    'O9d': 'simple_weather_icon_11.png',
    '10d': 'simple_weather_icon_22.png',
    '11d': 'simple_weather_icon_27.png',
    '13d': 'simple_weather_icon_25.png',
    '50d': 'simple_weather_icon_09.png',
    '01n': 'simple_weather_icon_02.png',
    'O2n': 'simple_weather_icon_07.png',
    '03n': 'simple_weather_icon_07.png',
    '04n': 'simple_weather_icon_07.png',
    'O9n': 'simple_weather_icon_32.png',
    '10n': 'simple_weather_icon_22.png',
    '11n': 'simple_weather_icon_37.png',
    '13n': 'simple_weather_icon_25.png',
    '50n': 'simple_weather_icon_09.png'
  }

  let weather = () => {
    let apiId = 'bd545da109eb3ed82496113b3eaa590d'
    for (var i = 0; i < tripPlaces.length; i++) {
      let cityName = tripPlaces[i]
      $.ajax({
        method: 'GET',
        // url: `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=bd545da109eb3ed82496113b3eaa590d&units=metric`,
        url: `http://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}&cnt=5&APPID=bd545da109eb3ed82496113b3eaa590d&units=imperial`,
        dataType: 'json',
        success: function(data) {
          let row = $(`<div class="row weather"><div class="col-sm-2">
            <h3>${cityName}</h3>
          </div></div>`)

          for (var i = 0; i < data.list.length; i++) {

            let d = new Date()
            d.setTime(data.list[i].dt * 1000)
            dateString = d.toUTCString() // or d.toString if local time required
            let date = dateString.substring(5, 14)
            let day = Math.round(data.list[i].temp.day)
            let night = Math.round(data.list[i].temp.night)
            let description = data.list[i].weather[0].description
            let icon = data.list[i].weather[0].icon
            let iconURL = weatherIcon[icon];
            
            let card;
            if (i === data.list.length -1 ) {
              card = $(`<div class="col-sm-2 text-center">
                <p><strong><u>${date}</u></strong></p>
                <img src="styles/weather/${iconURL}" class="weatherPic"><br>
                <p>Weather: <br><strong>${description}</strong></p>
                <p>Day Temp: <strong>${day}°F</strong></p>
                <p>Night Temp: <strong>${night}°F</strong></p>
              </div>`)
            } else {
              card = $(`<div class="col-sm-2 text-center sideBorder">
                <p><strong><u>${date}</u></strong></p>
                <img src="styles/weather/${iconURL}" class="weatherPic"><br>
                <p>Weather: <br><strong>${description}</strong></p>
                <p>Day Temp: <strong>${day}°F</strong></p>
                <p>Night Temp: <strong>${night}°F</strong></p>
              </div>`)
            }
            row.append(card)
          }
          $('#weather').append(row)
        }
      })
    }
  }


  /********************************
    make marker function
  ********************************/
function makeMarker( position, title ) {
 new google.maps.Marker({
  position: position,
  map: map,
  title: title
 });
}

  /********************************
    button listener events
  ********************************/
  $('.waypoint').click(createWaypoint)
  $('.search').click(setRoute)


})

let weatherIcon = {
  '01d': 'simple_weather_icon_01.png',
  'O2d': 'simple_weather_icon_04.png',
  '03d': 'simple_weather_icon_04.png',
  '04d': 'simple_weather_icon_04.png',
  'O9d': 'simple_weather_icon_11.png',
  '10d': 'simple_weather_icon_22.png',
  '11d': 'simple_weather_icon_27.png',
  '13d': 'simple_weather_icon_25.png',
  '50d': 'simple_weather_icon_09.png',
  '01n': 'simple_weather_icon_02.png',
  'O2n': 'simple_weather_icon_07.png',
  '03n': 'simple_weather_icon_07.png',
  '04n': 'simple_weather_icon_07.png',
  'O9n': 'simple_weather_icon_32.png',
  '10n': 'simple_weather_icon_22.png',
  '11n': 'simple_weather_icon_37.png',
  '13n': 'simple_weather_icon_25.png',
  '50n': 'simple_weather_icon_09.png'
}
