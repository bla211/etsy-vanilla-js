describe("Results count", function() {
  it("shows number of results shown out of total results", function() {
    const searchResults = [1,2,3,4,5,6,7]
    expect(etsy.testObj.resultsCount(searchResults, 1000)).toEqual('Displaying 7 of 1000 results');
  });
});

describe("Script generator", function() {
  it("generates script src for new search", function() {
    const type = 'click';
    const keywords = 'test etsy';
    const url = 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=2z5arsdpfe5py1mcc5welkm2&keywords=test%20etsy&limit=25';
    expect(etsy.testObj.generateScript(type, keywords)).toEqual(url);
  });

  it("generates script src for loading next 25 results", function() {
    const type = 'next';
    const keywords = 'test etsy';
    const resultsLength = 25;
    const url = 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=2z5arsdpfe5py1mcc5welkm2&keywords=test%20etsy&offset=25&limit=25';
    expect(etsy.testObj.generateScript(type, keywords, resultsLength)).toEqual(url);
  });

  it("generates script src for loading page load results", function() {
    const type = 'load';
    const keywords = '';
    const url = 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=2z5arsdpfe5py1mcc5welkm2&limit=25';
    expect(etsy.testObj.generateScript(type, keywords)).toEqual(url);
  });
});

describe("Results HTML generator", function() {
  it("generates html block for result", function() {
    const result = {
      title: "Henry Glass Fabrics - Botanica Blooms Floral by Color Principle",
      price: "5.50",
      MainImage: {
        url_fullxfull: "https://img1.etsystatic.com/181/0/14398010/il_fullxfull.1513953521_60wa.jpg"
      }
    };
    const index = 0;
    const html = '<li data-index="0"><div class="tile_thumb" style="background-image:url(https://img1.etsystatic.com/181/0/14398010/il_fullxfull.1513953521_60wa.jpg)"></div><div class="price">$5.50</div><div class="tile_title" onclick="etsy.loadEtsyPage(0)">Henry Glass Fabrics - Botanica Blooms Floral by Color Principle<div class="view_product">View Product</div></div></li>';
    expect(etsy.testObj.generateResultsHTML(result, index)).toEqual(html);
  });
});
