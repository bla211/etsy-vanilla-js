var etsy = etsy || {};
etsy.apiKey = '2z5arsdpfe5py1mcc5welkm2';
etsy.keywords = '';
etsy.searchResults = {};

//callback for jsonp
handleData = (data) => {
  if (data.ok) {
      data.results.forEach((val, index) => {
          etsy.getImage(val.listing_id);
      });
      etsy.handleResults(data.results);
    } else {
        console.log(data.error);
  }
};

handleImage = (data) => {
  if (data.ok) {
    etsy.handleImageResults(data.results);
    etsy.buildList();
  } else {
      console.log(data.error);
  }
};

etsy.search = () => {
  etsy.keywords = document.getElementById('search_box').value;
  let script = document.createElement('script');
  script.src = 'https://openapi.etsy.com/v2/listings/active.js?callback=handleData&api_key=' + etsy.apiKey + '&keywords=' + encodeURI(etsy.keywords) + '&limit=10';
  document.getElementsByTagName('head')[0].appendChild(script);
};

etsy.buildList = () => {
  let html = '';
  Object.keys(etsy.searchResults).forEach((key, i) => {
    html += '<li>';
    html += '<img src="' + etsy.searchResults[key].imageUrl + '"/>';
    html += etsy.searchResults[key].title;
    html += '</li>';
  });

  document.getElementById('results').children[0].innerHTML = html;
};

etsy.getImage = (listingId) => {
  let script = document.createElement('script');
  script.src = 'https://openapi.etsy.com/v2/listings/' + parseInt(listingId) + '/images.js?callback=handleImage&api_key=' + etsy.apiKey;
  document.getElementsByTagName('head')[0].appendChild(script);
};

etsy.handleResults = (results) => {
  results.forEach((val, i) => {
    etsy.searchResults[val.listing_id] = val;
  });
};

etsy.handleImageResults = (imageResults) => {
  etsy.searchResults[imageResults[0].listing_id]['imageUrl'] = imageResults[0].url_170x135;
};
