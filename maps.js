$(document).ready(function(){


console.log('ready')

var marketId = []; //returned from the API
		var allLatlng = []; //returned from the API
		var allMarkers = []; //returned from the API
		var marketName = []; //returned from the API
		var infowindow = null;
		var pos;
		var userCords;
		var tempMarkerHolder = [];

		//Start geolocation

		if (navigator.geolocation) {

			function error(err) {
				console.warn('ERROR(' + err.code + '): ' + err.message);
			}

			function success(pos){
				userCords = pos.coords;
        console.log(userCords)
				//return userCords;
        function makeMap() {
        map = new google.maps.Map(document.getElementById('map'), mapOptions);


        let location = {lat: userCords.latitude, lng: userCords.longitude}
        console.log(location)

          var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'You are here!'
          });
      }
      makeMap()
			}

			// Get the user's current position
			navigator.geolocation.getCurrentPosition(success, error);
			// console.log(pos.latitude + " " + pos.longitude);
			} else {
				alert('Geolocation is not supported in your browser');
			}

		// End Geo location

    // Map options
    var mapOptions = {
			zoom: 3,
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






})
