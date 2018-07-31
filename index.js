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
  if(type === 'click' || type === 'load'){
      etsy.clearSearchResults();
      etsy.showLoadingAnimation();
  }
  document.getElementById('load_next').style.opacity = 0;
  etsy.keywords = document.getElementById('search_box').value;
  let script = document.createElement('script');
  script.src = etsy.generateScript(type, etsy.keywords, etsy.searchResults.length);
  document.getElementsByTagName('head')[0].appendChild(script);
};

etsy.buildList = () => {
  let html = '';
  etsy.searchResults.forEach((result, index) => {
    if(result.MainImage){
      html += etsy.generateResultsHTML(result, index);
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
  //doing this in local storage in lieu of rest api
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

etsy.generateScript = (type, keywords, resultsLength) => {
  let keywordString = '';
  let offsetString = '';
  if(type === 'click'){
    keywordString = '&keywords=' + encodeURI(keywords);
  }
  else if(type === 'next'){
      if(keywords.length){
          keywordString = '&keywords=' + encodeURI(keywords);
      }
      offsetString = '&offset=' + resultsLength;
  }
  return 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=' + etsy.apiKey + keywordString + offsetString + '&limit=25';
};

etsy.showLoadingAnimation = () => {
  document.getElementById('results_list').innerHTML = '<img id="loading_animation" src="https://josephdoughertyblog.files.wordpress.com/2014/09/loading-animation-white.gif"/>';
};

etsy.clearSearchResults = () => {
 etsy.searchResults = [];
};

etsy.generateResultsHTML = (result, index) => {
  let html = '';
  html += '<li data-index="' + index + '">';
  html += '<div class="tile_thumb" style="background-image:url(' + result.MainImage.url_fullxfull + ')"></div>';
  html += '<div class="price">$' + result.price + '</div>'
  html += '<div class="tile_title" onclick="etsy.loadEtsyPage(' + index + ')">';
  html += result.title;
  html += '<div class="view_product">View Product</div>';
  html += '</div>';
  html += '</li>';
  return html;
};
