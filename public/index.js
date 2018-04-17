const YELP_SEARCH_URL = 'http://localhost:3000/asd';

// Autocomplete search location in form
function autoComplete() {
  let options = {
    types: ['(regions)']
  };
  let searchInput = document.getElementById('search-term');
  let autocomplete = new google.maps.places.Autocomplete(searchInput, options);
}

// var map;
// function initMap() {
//   // Map options
//   var options = {
//     zoom: 13,
//     center: {lat: 34.0522, lng: -118.2437},
//   }
//
//   // New map
//   var map = new google.maps.Map(document.getElementById('map'), options);
//
//   // Array of markers
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
//   // Loop through markers
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
//
//   }
// }

// retrieve data from Yelp API
// function getYelpData() {
//   let city = $('.search-query').val();
//   $.ajax(YELP_SEARCH_URL, {
//     data: {
//       q: city
//     },
//     dataType: 'json',
//     type: 'GET',
//     success: function(data) {
//         let widget = displayYelp(data);
//         $('#yelp-results').html(widget);
//     }
//   });
// }
//
// function displayYelp(data) {
//   console.log(data);
//   return `
//   <div class="yelp-search-results">
//     <p>${data.businesses.name}</p>
//   </div>`
// }

function getDataFromApi(searchTerm, callback) {
  console.log("hi");
  const settings = {
    url: YELP_SEARCH_URL,
    data: {
      latitude: 34.048297,
      longitude: -118.239825
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

function renderResult(item) {
  var resultShops = `
    <div>
      <h2>
        <a class="js-result-business" href= "${item.businesses.name}"></a>
      </h2>
    </div>
    `;
    // console.log(item);
  return resultShops;
}

function displayYelpSearchData(data) {
  // console.log("yes");
  // var results = "";
  // for (var i = 0; i < data.item.length; i++) {
  //   console.log("still works");
  //   var items = data.item[i];
  //   console.log(items);
  //   var renderedItem = renderResult(items);
  //   results += renderedItem;
  // }
  // $('.js-yelp-results').html(results);

// Uncaught TypeError: Cannot read property 'length' of undefined

}

function coffeeSearch() {
  $('.search-form').on('click', '.submit-button', function (event) {
    event.preventDefault();
    $('.display-start').remove();
    // $('#yelp-results').html("");
    // $('#map').html("");
    // initMap();
    // getYelpData();
    // getGoogleMapsData();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    queryTarget.val("");
    getDataFromApi(query, displayYelpSearchData);
  });
}

$(coffeeSearch);
