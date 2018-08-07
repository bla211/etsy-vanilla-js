var etsy = (() => {
  const API_KEY = '2z5arsdpfe5py1mcc5welkm2';
  let KEYWORDS = '';
  let SEARCH_RESULTS = [];
  let NUMBER_OF_RESULTS = 0;
  let SAVED_SEARCHES = [];

  search = (type) => {
    if(type === 'click' || type === 'load'){
        clearSearchResults();
        showLoadingAnimation();
    }
    document.getElementById('load_next').style.opacity = 0;
    KEYWORDS = document.getElementById('search_box').value;
    let script = document.createElement('script');
    script.src = generateScript(type, KEYWORDS, SEARCH_RESULTS.length);
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  clearSearchResults = () => {
    SEARCH_RESULTS = [];
    NUMBER_OF_RESULTS = 0;
    document.getElementById('results_count').innerHTML = resultsCount(SEARCH_RESULTS, NUMBER_OF_RESULTS);
    document.getElementById('results_list').innerHTML = '';
  }

  showLoadingAnimation = () => {
    document.getElementById('loading_animation').style.display = 'block';
  };

  hideLoadingAnimation = () => {
    document.getElementById('loading_animation').style.display = 'none';
  };

  generateScript = (type, keywords, resultsLength) => {
    let keywordstring = '';
    let offsetString = '';
    if(type === 'click'){
      keywordstring = '&keywords=' + encodeURI(keywords);
    }
    else if(type === 'next'){
        if(keywords.length){
            keywordstring = '&keywords=' + encodeURI(keywords);
        }
        offsetString = '&offset=' + resultsLength;
    }
    return 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=' + API_KEY + keywordstring + offsetString + '&limit=25';
  };

  handleResults = (data) => {
    const results = data.results
    NUMBER_OF_RESULTS = data.count;
    results.forEach((val) => {
      SEARCH_RESULTS.push(val);
    });
    buildList();
  };

  buildList = () => {
    hideLoadingAnimation();
    let html = '';
    SEARCH_RESULTS.forEach((result, index) => {
      if(result.MainImage){
        html += generateResultsHTML(result, index);
      }
    });

    document.getElementById('results_list').innerHTML = html;
    document.getElementById('results_count').innerHTML = resultsCount(SEARCH_RESULTS, NUMBER_OF_RESULTS);
    document.getElementById('load_next').style.opacity = 1;
  };

  generateResultsHTML = (result, index) => {
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

  resultsCount = (searchResults, numberOfResults) => {
    return 'Displaying ' + searchResults.length + ' of ' + numberOfResults + ' results';
  };

  handleEnterPress = () => {
    document.getElementById('search_box').onkeydown = function(e){
       if(e.keyCode == 13){
         search('click');
       }
    };
  };

  loadEtsyPage = (index) => {
    window.open(SEARCH_RESULTS[index].url);
  };

  getSavedSearches = () => {
      let savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
      SAVED_SEARCHES = savedSearches;

      buildSavedSearchList();
  };

  buildSavedSearchList = () => {
      let html = '';
      if(SAVED_SEARCHES !== null){
        SAVED_SEARCHES.forEach((val, i) => {
          html += '<li onclick="etsy.loadSearch(' + i + ')">' + val + '</li>'
        });

        document.getElementById('saved_search_list').innerHTML = html;
      }
  };

  saveSearch = () => {
    //doing this in local storage in lieu of rest api
    if(KEYWORDS.length){
      let savedSearches = JSON.parse(localStorage.getItem("savedSearches"));
      if(savedSearches === null){
        savedSearches = [];
      }
      savedSearches.push(KEYWORDS);
      localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

      SAVED_SEARCHES = savedSearches;
      buildSavedSearchList();
    }
  };

  loadSearch = (index) => {
    KEYWORDS = SAVED_SEARCHES[index];
    document.getElementById('search_box').value = KEYWORDS;
    search('click');
  };

  let testObj = {
    generateScript: generateScript,
    generateResultsHTML: generateResultsHTML,
    resultsCount: resultsCount
  }

  return {
    search: search,
    handleResults: handleResults,
    loadSearch: loadSearch,
    getSavedSearches: getSavedSearches,
    handleEnterPress: handleEnterPress,
    saveSearch: saveSearch,
    loadEtsyPage: loadEtsyPage,
    testObj: testObj
  }
})()

handleData = (data) => {
  if (data.ok) {
    etsy.handleResults(data);
  }
  else {
    console.log(data.error);
  }
};
