var etsy = (() => {
  const apiKey = '2z5arsdpfe5py1mcc5welkm2';
  let keywords = '';
  let searchResults = [];
  let numberOfResults = null;
  let savedSearches = [];

  search = (type) => {
    if(type === 'click' || type === 'load'){
        clearSearchResults();
        showLoadingAnimation();
    }
    document.getElementById('load_next').style.opacity = 0;
    keywords = document.getElementById('search_box').value;
    let script = document.createElement('script');
    script.src = generateScript(type, keywords, searchResults.length);
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  clearSearchResults = () => {
    searchResults = [];
    document.getElementById('results_list').innerHTML = '';
  }

  showLoadingAnimation = () => {
    document.getElementById('loading_animation').style.display = 'block';
  };

  hideLoadingAnimation = () => {
    document.getElementById('loading_animation').style.display = 'none';
  };

  generateScript = (type, keywords, resultsLength) => {
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
    return 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=' + apiKey + keywordString + offsetString + '&limit=25';
  };

  handleResults = (data) => {
    const results = data.results
    numberOfResults = data.count;
    results.forEach((val) => {
      searchResults.push(val);
    });
    buildList();
  };

  buildList = () => {
    hideLoadingAnimation();
    let html = '';
    searchResults.forEach((result, index) => {
      if(result.MainImage){
        html += generateResultsHTML(result, index);
      }
    });

    document.getElementById('results_list').innerHTML = html;
    document.getElementById('results_count').innerHTML = resultsCount(searchResults, numberOfResults);
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
    window.open(searchResults[index].url);
  };

  getSavedSearches = () => {
      let savedSearchesJSON = JSON.parse(localStorage.getItem("savedSearches"));
      savedSearches = savedSearchesJSON;

      buildSavedSearchList();
  };

  buildSavedSearchList = () => {
      let html = '';
      if(savedSearches !== null){
        savedSearches.forEach((val, i) => {
          html += '<li onclick="etsy.loadSearch(' + i + ')">' + val + '</li>'
        });

        document.getElementById('saved_search_list').innerHTML = html;
      }
  };

  saveSearch = () => {
    //doing this in local storage in lieu of rest api
    if(keywords.length){
      let savedSearchesJSON = JSON.parse(localStorage.getItem("savedSearches"));
      if(savedSearchesJSON === null){
        savedSearchesJSON = [];
      }
      savedSearchesJSON.push(keywords);
      localStorage.setItem("savedSearches", JSON.stringify(savedSearchesJSON));

      savedSearches = savedSearchesJSON;
      buildSavedSearchList();
    }
  };

  loadSearch = (index) => {
    keywords = savedSearches[index];
    document.getElementById('search_box').value = keywords;
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
