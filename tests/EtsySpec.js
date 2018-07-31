describe("Results count", function() {
  it("shows number of results shown out of total results", function() {
    const searchResults = [1,2,3,4,5,6,7]
    expect(etsy.resultsCount(searchResults, 1000)).toEqual('Displaying 7 of 1000 results');
  });
});
