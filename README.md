# Etsy search application

Built using vanilla js, html5, css3

## Getting Started

index.html contains the main application it is best viewed in chrome

### testing

opening tests/SpecRunner.html in chrome will run the tests using jasmine


## Code Considerations
I used a static name-spacing pattern for the javascript. Using this approach protects the code from naming collisions for both global variables and methods.

I used a few global variables to hold data that I would be using across the application. This makes sure that the data I am using is always the most up to date if a function changes a variable.

I decided to not use any compilation or preprocessing for js or css to stay with the theme of vanilla development.

I would like to add some more advanced search features in the future. The code should structure should allow for easily adding parameters to the query string.

## Testing Considerations
I used a web implementation of Jasmine to unit test my code.

The tests were based on methods that were generating dynamic text, html, or urls for the JSONP requests. I wanted to make sure that given the proper inputs that the output of those functions was consistent.
