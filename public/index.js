const YELP_SEARCH_URL = 'http://localhost:3000/asd';

var map, infoWindow;

// Autocomplete search location in form
function autoComplete() {
  let options = {
    types: ['(regions)']
  };
  let searchInput = document.getElementById('search-term');
  let autocomplete = new google.maps.places.Autocomplete(searchInput, options);
}

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
    zoom: 14.2,
    zoomControl: true
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//////////////////////////////////////

function renderTitle() {
  let sideBarTitle = `
    <h1 class="side-bar-title">find my coffee</h1>
  `;
  
  return sideBarTitle;
}

function renderResult(business) {
  let resultShops = `
    <div class="side-bar-content">
      <h2>${business.name}</h2>
    </div>
    `;

  return resultShops;
}

function displayYelpSearchData(data) {
  let results = "";
  for (let i = 0; i < data.businesses.length; i++) {

    let business = data.businesses[i];
    let busLat = data.businesses[i].coordinates.latitude;
    let busLng = data.businesses[i].coordinates.longitude;

    // console.log(business);

    // ADD MARKER
    let marker = new google.maps.Marker({
      position: {lat: busLat, lng: busLng},
      map: map,
      title: business.name
    });

    let contentString = `
      <div id="business-info">
        <h1 class=business-name">${business.name}</h1>
        <a class="logo" href="${business.url}" onclick="window.open(this.href);
        return false;" onkeypress="window.open(this.href); return false;">
        <img class="business-pic" src="${business.image_url}" alt=""></a>
        <p class="body-content">${business.price}</p>
        <p>Rating: ${business.rating}/5</p>
        <p>Contact Business: ${business.display_phone}</p>
        <p>Address: ${business.location.display_address.join(", ")}</p>
      </div>
      `;

    marker.addListener('click', function(){
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
    });

    // DISPLAY TO SIDE BAR
    // results
    let renderedItem = renderResult(business);
    results += renderedItem;
  }
  $('.title-content').html(renderTitle());
  $('.text-content').html(results);
}


function getLatLong(locationString) {
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': locationString}, function(results, status) {
      if (status == 'OK') {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        console.log(lat, lng);
        getDataFromApi(lat, lng, displayYelpSearchData);
        renderGoogleMaps(lat, lng);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
}

function coffeeSearch() {
  $('.search-form').on('click', '.submit-button', function (event) {
    event.preventDefault();
    const queryTarget = $('.search-query');
    const locationString = queryTarget.val();
    getLatLong(locationString);
    queryTarget.val("");
    $('.display-start').remove();
    $('#side-bar').removeClass('hidden');

    infowindow = new google.maps.InfoWindow({
      content: "__"
    });

  });
}

$(coffeeSearch);
