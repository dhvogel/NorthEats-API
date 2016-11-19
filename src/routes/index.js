//npm modules
var url = require('url');
var bodyParser = require('body-parser');

//NorthEats APIs
var restaurant = require('./restaurant');
var menu = require('./menu');

module.exports = function(app) {

  //restaurant
  app.get('/api/restaurant', restaurant.getAllRestaurants);

  app.post('/api/restaurant/:restaurantId', restaurant.postRestaurant);

  app.get('/api/restaurant/:restaurantId', restaurant.getRestaurantById);

  app.delete('/api/restaurant/:restaurantId', restaurant.deleteRestaurantById);

  /*
  app.put('/api/restaurant/:restaurantId', restaurant.updateRestaurantById);
  */

  //menu
  app.post('/api/menu/:restaurantId', menu.postMenu);

  app.get('/api/menu/:restaurantId', menu.getMenuFromRestaurant);

  app.delete('/api/menu/:restaurantId', menu.deleteMenuFromRestaurant);
  /*
  app.put('/menu/:restaurantId', menu.updateMenu);

  */

}
