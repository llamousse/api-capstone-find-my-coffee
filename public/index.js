const YELP_SEARCH_URL = "http://localhost:3000/asd";

var map, infoWindow;

////////////////////// SETUP //////////////////////

function init() {
  autoComplete();
  coffeeSearch();
  renderSearchAgain();
  infowindow = new google.maps.InfoWindow({
    content: "__"
  });
}

// Autocomplete search location in form
function autoComplete() {
  let options = {
    types: ["(regions)"]
  };

  let searchInput = document.getElementById("search-term");
  let searchInputNav = document.getElementById("search-term-nav");
  new google.maps.places.Autocomplete(searchInput, options);
  new google.maps.places.Autocomplete(searchInputNav, options);
}

function coffeeSearch() {
  $(".search-form").on("click", ".submit-button", function(event) {
    event.preventDefault();
    const queryTarget = $(".search-query");
    const locationString = queryTarget.val();
    getLatLong(locationString);
    queryTarget.val("");
    displayResultsScreen();
  });
}

function renderSearchAgain() {
  $(".search-bar-form").on("click", ".submit-button", function(event) {
    event.preventDefault();
    const queryTarget = $(".search-bar-query");
    const locationString = queryTarget.val();
    getLatLong(locationString);
    queryTarget.val("");
  });
}

function displayResultsScreen() {
  $(".display-start").remove();
  $("#map").removeClass("hidden");
  $("#side-bar").removeClass("hidden");
}

////////////////////// API /////////////////////////

function getDataFromApi(lat, lng, callback) {
  const settings = {
    url: YELP_SEARCH_URL,
    data: {
      latitude: lat,
      longitude: lng
    },
    dataType: "json",
    type: "GET",
    success: callback,
    error: function(error) {
      console.log("error", error);
    }
  };
  $.ajax(settings);
}

function renderGoogleMaps(lat, lng) {
  let mapOptions = {
    center: { lat: lat, lng: lng },
    zoom: 12.8,
    zoomControl: true
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

////////////////////// RENDER ////////////////////////

function renderResult(business) {
  return `
    <div class="side-bar-content">
      <h2>${business.name}</h2>
    </div>
    `;
}

function renderContentString(business) {
  return `
      <div id="business-info">
        <h1 class=business-name">${business.name}</h1>
        <a class="logo" href="${business.url}" onclick="window.open(this.href);
        return false;" onkeypress="window.open(this.href); return false;">
        <img class="business-pic" src="${business.image_url}" alt=""></a>
        <div class="body-content">
          <p>${business.price}</p>
          <p>Rating: ${business.rating}/5</p>
          <p>Contact Business: ${business.display_phone}</p>
          <p>Address: ${business.location.display_address.join(", ")}</p>
        </div>
      </div>
      `;
}

function createMarker(business) {
  let marker = new google.maps.Marker({
    position: {
      lat: business.coordinates.latitude,
      lng: business.coordinates.longitude
    },
    map: map,
    title: business.name
  });

  let contentString = renderContentString(business);

  marker.addListener("click", function() {
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
  });
}

function displayYelpSearchData(data) {
  var results = data.businesses.map(business => {
    createMarker(business);
    return renderResult(business);
  });

  $(".text-content").html(results);
}

function getLatLong(locationString) {
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: locationString }, function(results, status) {
    if (status == "OK") {
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      getDataFromApi(lat, lng, displayYelpSearchData);
      renderGoogleMaps(lat, lng);
    } else {
      console.log(status);
      alert("Search failed, search for a different location");
    }
  });
}
