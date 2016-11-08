//npm modules
var url = require('url');
var bodyParser = require('body-parser');

//NorthEats APIs
var restaurant = require('./restaurant')

module.exports = function(app) {

  //restaurant
  app.get('/restaurant', restaurant.getAllRestaurants);

  app.post('/restaurant', restaurant.postRestaurant);

  app.get('/restaurant/:restaurantId', restaurant.getRestaurantById);

  app.delete('/restaurant/:restaurantId', restaurant.deleteRestaurantById);


}
