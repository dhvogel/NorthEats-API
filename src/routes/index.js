//npm modules
var url = require('url');
var bodyParser = require('body-parser');

//NorthEats APIs
var restaurant = require('./restaurant');
var menu = require('./menu');

module.exports = function(app) {

  //===restaurant API=======================================

  //tested
  app.get('/api/restaurant', restaurant.getAllRestaurants);


  app.post('/api/restaurant/:restaurantId', restaurant.postRestaurant);

  //tested
  app.get('/api/restaurant/:restaurantId', restaurant.getRestaurantById);

  //tested
  app.delete('/api/restaurant/:restaurantId', restaurant.deleteRestaurantById);


  app.put('/api/restaurant/:restaurantId', restaurant.updateRestaurantById);

  //========================================================



  //===menu API===


  app.post('/api/menu/:restaurantId', menu.postMenu);


  app.get('/api/menu/:restaurantId', menu.getMenuById);


  app.delete('/api/menu/:restaurantId', menu.deleteMenuFromRestaurant);
  /*
  app.put('/menu/:restaurantId', menu.updateMenu);

  */

}
