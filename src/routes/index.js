//npm modules
var url = require('url');
var bodyParser = require('body-parser');

//NorthEats APIs
var restaurant = require('./restaurant');
var menu = require('./menu');

module.exports = function(app) {

  //restaurant
  app.get('/restaurant', restaurant.getAllRestaurants);

  app.post('/restaurant', restaurant.postRestaurant);

  app.get('/restaurant/:restaurantId', restaurant.getRestaurantById);

  app.delete('/restaurant/:restaurantId', restaurant.deleteRestaurantById);


  //menu
  app.post('/menu/:restaurantId', menu.postMenu);
  /*
  app.get('/menu/:restaurantId', menu.getMenuFromRestaurant);

  app.delete('/menu/:restaurantId', menu.deleteMenuFromRestaurant);

  app.put('/menu/:restaurantId', menu.updateMenu);

  app.delete('/menu/:restaurantId/:itemId', menu.deleteItemFromMenu);
  */

}
