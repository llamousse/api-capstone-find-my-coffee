const YELP_SEARCH_URL = "http://localhost:3000/asd";

let map;
let infoWindow;
let markers = [];

////////////////////// SETUP //////////////////////

function init() {
  autoComplete();
  coffeeSearch();
  renderSearchAgain();
  infowindow = new google.maps.InfoWindow({
    content: "__"
  });
}

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

    $('.mobile-only').css("display", "none");

    event.preventDefault();
    const queryTarget = $(".search-bar-query");
    const locationString = queryTarget.val();
    getLatLong(locationString);
    queryTarget.val("");
  });
}

$("#results-section").on ('click', '.side-bar-content', function(event) {

  $('.mobile-only').css("display", "block");
  $('i').css("display", "inline-block");

  let index = $(event.currentTarget).attr("data-index");
  let marker = markers[index];
  console.log(index);
  infowindow.setContent(marker.content);
  infowindow.open(map, marker);
  marker.setIcon('images/green-dot.png');
});

$('#arrow-click').on('click', function(event) {

  $('.mobile-only').css("display", "none");
  $('i').css("display", "none");

});

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
    zoom: 14,
    zoomControl: true,
    gestureHandling: 'greedy'
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

////////////////////// RENDER ////////////////////////

function renderResult(business, index) {
  return `
    <div class="side-bar-content" data-index="${index}">
      <h2>${business.name}</h2>
    </div>
    `;
}

function renderContentString(business) {
  return `
      <div id="business-info">
        <a class="logo" href="${business.url}" target="_blank">
        <h1 class=business-name">${business.name}</h1>
        <img class="business-pic" src="${business.image_url}" alt="">
        <div class="body-content">
          <p>${business.price}</p>
          <p>Rating: ${business.rating}/5</p>
          <p>Contact Business: ${business.display_phone}</p>
          <p>Address: ${business.location.display_address.join(", ")}</p>
          <p class="yelp-page">Click to visit Yelp page</p>
        </div>
        </a>
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
    title: business.name,
    icon: 'images/red-dot.png',
    content: renderContentString(business)
  });


  marker.addListener("click", function() {
    infowindow.setContent(marker.content);
    infowindow.open(map, marker);
  });

  marker.addListener('mouseover', function() {
    marker.setIcon('images/green-dot.png');
  });

  marker.addListener('mouseout', function() {
    marker.setIcon('images/red-dot.png');
  });

   markers.push(marker);
}

function displayYelpSearchData(data) {

  markers = [];
  var results = data.businesses.map((business, index) => {
    createMarker(business);
    return renderResult(business, index);
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
      location.reload();
    }
  });
}
