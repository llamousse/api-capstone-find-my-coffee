const YELP_SEARCH_URL = 'http://localhost:3000/asd';
// Autocomplete search location in form
var map;

function autoComplete() {
  let options = {
    types: ['(regions)']
  };
  let searchInput = document.getElementById('search-term');
  let autocomplete = new google.maps.places.Autocomplete(searchInput, options);
}
// function initMap(lat, lng) {
//   Array of markers
//   var markers = [
//     {
//       coords: {lat: 34.0523, lng: -118.2395},
//       iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
//       content: '<h1>Little Tokyo</h1>'
//     },
//     {
//       coords: {lat: 34.0407, lng: -118.2468},
//       content: '<h1>Downtown</h1>'
//     }
//
//   ];
//
//   Loop through markers
//   for(var i = 0; i < markers.length; i++) {
//     // Add marker
//     addMarker(markers[i]);
//   }
//
//   // Add Marker Function
//   function addMarker(props){
//     var marker = new google.maps.Marker({
//       position: props.coords,
//       map: map,
//       // icon: props.iconImage
//     });
//
//     // Check for custom icon
//     if(props.iconImage){
//       // Set icon image
//       marker.setIcon(props.iconImage);
//     }
//
//     // Check content
//     if(props.content) {
//       var infoWindow = new google.maps.InfoWindow({
//         content: props.content
//       });
//
//       marker.addListener('click', function(){
//         infoWindow.open(map, marker);
//       });
//     }
//   }
// }

function getDataFromApi(lat, lng, callback) {
  console.log("hi");
  const settings = {
    url: YELP_SEARCH_URL,
    data: {
      latitude: lat,
      longitude: lng
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
    error: function (error) {
      console.log("error", error);
    }
  };
  $.ajax(settings);
}

function renderGoogleMaps(lat, lng) {
  let mapOptions = {
    center: {lat: lat, lng: lng},
    zoom: 14,
    zoomControl: true
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);


}

function createMarker(busLat, busLng) {
  let marker = new google.maps.Marker({
    position: {lat: busLat, lng: busLng},
    map: map
  });
}

// function renderResult(business) {
//
//   let resultShops = `
//     <div>
//       <h2>
//         <a class="js-result-business" href= "${business.url}">${business.name}</a>
//       </h2>
//     </div>
//     `;
//     console.log(business);
//   return resultShops;
// }

function displayYelpSearchData(data) {
  let results = "";
  for (let i = 0; i < data.businesses.length; i++) {
    let business = data.businesses[i];
    let busLat = data.businesses[i].coordinates.latitude;
    let busLng = data.businesses[i].coordinates.longitude;

    // ADD MARKER
    let marker = new google.maps.Marker({
      position: {lat: busLat, lng: busLng},
      map: map,
      title: data.businesses[i].name
    });

    // console.log(business);
    // let renderedItem = renderResult(business);
    // results += renderedItem;
    // let contentString = '<div id="data-yelp">' +
      // '<h1 class=businessName">' + data.businesses[i].name + '</h1></div>';
    // console.log(contentString);
  }
  // $('.js-yelp-results').html(results);
}


function getLatLong(locationString) {
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': locationString}, function(results, status) {
      if (status == 'OK') {

        // map.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //     map: map,
        //     position: results[0].geometry.location
        // });

        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        console.log(lat, lng);
        getDataFromApi(lat, lng, displayYelpSearchData);
        renderGoogleMaps(lat, lng);
        // renderMarkers(lat, lng);

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}

function coffeeSearch() {
  $('.search-form').on('click', '.submit-button', function (event) {
    event.preventDefault();
    // getYelpData();
    // getGoogleMapsData();
    const queryTarget = $('.search-query');
    const locationString = queryTarget.val();
    getLatLong(locationString);
    queryTarget.val("");
    $('.display-start').remove();
  });
}

$(coffeeSearch);
