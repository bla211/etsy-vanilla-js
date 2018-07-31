describe("Results count", function() {
  it("shows number of results shown out of total results", function() {
    const searchResults = [1,2,3,4,5,6,7]
    expect(etsy.resultsCount(searchResults, 1000)).toEqual('Displaying 7 of 1000 results');
  });
});

describe("Script generator", function() {
  it("generates script src for new search", function() {
    const type = 'click';
    const keywords = 'test etsy';
    const url = 'https://openapi.etsy.com/v2/listings/active.js?includes=MainImage&callback=handleData&api_key=2z5arsdpfe5py1mcc5welkm2&keywords=test%20etsy&limit=25';
    expect(etsy.generateScript(type, keywords)).toEqual(url);
  });
});
