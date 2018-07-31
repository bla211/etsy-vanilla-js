var etsy = etsy || {};
etsy.apiKey = '2z5arsdpfe5py1mcc5welkm2';
etsy.keywords = '';
etsy.searchResults = [];
etsy.numberOfResults = null;
etsy.savedSearches = [];

//callback for jsonp
handleData = (data) => {
  if (data.ok) {
    etsy.numberOfResults = data.count;
    etsy.handleResults(data.results);
  }
  else {
    console.log(data.error);
  }
};

etsy.search = (type) => {
  document.getElementById('load_next').style.opacity = 0;
  let keywordString = '';
  let offsetString = '';
  if(type === 'click'){
    etsy.searchResults = [];
    document.getElementById('results_list').innerHTML = '<img id="loading_animation" src="https://digitalsynopsis.com/wp-content/uploads/2016/06/loading-animations-preloader-gifs-ui-ux-effects-10.gif"/>';
    etsy.keywords = document.getElementById('search_box').value;
    keywordString = '&keywords=' + encodeURI(etsy.keywords);
  }
  else if(type === 'load'){
    document.getElementById('results_list').innerHTML = '<img id="loading_animation" src="https://digitalsynopsis.com/wp-content/uploads/2016/06/loading-animations-preloader-gifs-ui-ux-effects-10.gif"/>';
    etsy.searchResults = [];
  }
  else if(type === 'next'){
      if(etsy.keywords.length){
          keywordString = '&keywords=' + encodeURI(etsy.keywords);
      }
      offsetString = '&offset=' + etsy.searchResults.length;
  }
  let script = document.createElement('script');
  script.src = 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=' + etsy.apiKey + keywordString + offsetString + '&limit=25';
  document.getElementsByTagName('head')[0].appendChild(script);
};

etsy.buildList = () => {
  let html = '';
  etsy.searchResults.forEach((val, i) => {
    if(val.MainImage){
      html += '<li data-index="' + i + '">';
      html += '<div class="tile_thumb" style="background-image:url(' + val.MainImage.url_fullxfull + ')"></div>';
      html += '<div class="price">$' + val.price + '</div>'
      html += '<div class="tile_title" onclick="etsy.loadEtsyPage(' + i + ')">';
      html += val.title;
      html += '<div class="view_product">View Product</div>';
      html += '</div>';
      html += '</li>';
    }
  });

  document.getElementById('results_list').innerHTML = html;
  document.getElementById('results_count').innerHTML = etsy.resultsCount(etsy.searchResults, etsy.numberOfResults);
  document.getElementById('load_next').style.opacity = 1;
};

etsy.handleResults = (results) => {
  results.forEach((val) => {
    etsy.searchResults.push(val);
  });
  etsy.buildList();
};

etsy.handleEnterPress = () => {
  document.getElementById('search_box').onkeydown = function(e){
     if(e.keyCode == 13){
       etsy.search('click');
     }
  };
};

etsy.loadEtsyPage = (index) => {
  window.open(etsy.searchResults[index].url);
};

etsy.getSavedSearches = () => {
    let savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
    etsy.savedSearches = savedSearches;

    etsy.buildSavedSearchList();
};

etsy.saveSearch = () => {
  if(etsy.keywords.length){
    let savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
    if(savedSearches === null){
      savedSearches = [];
    }
    savedSearches.push(etsy.keywords);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    etsy.savedSearches = savedSearches;
    etsy.buildSavedSearchList();
  }
};

etsy.buildSavedSearchList = () => {
    let html = '';
    if(etsy.savedSearches !== null){
      etsy.savedSearches.forEach((val, i) => {
        html += '<li onclick="etsy.loadSearch(' + i + ')">' + val + '</li>'
      });

      document.getElementById('saved_search_list').innerHTML = html;
    }
};

etsy.loadSearch = (index) => {
  etsy.keywords = etsy.savedSearches[index];
  document.getElementById('search_box').value = etsy.keywords;
  etsy.search('click');
};

etsy.resultsCount = (searchResults, numberOfResults) => {
  return 'Displaying ' + searchResults.length + ' of ' + numberOfResults + ' results';
};
