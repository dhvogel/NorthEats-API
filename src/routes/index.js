//npm modules
var url = require('url');
var bodyParser = require('body-parser');

//NorthEats APIs
var restaurant = require('./restaurant')

module.exports = function(app) {

  app.get('/test', restaurant.test);


  app.get('/restaurant', restaurant.get);

  app.post('/restaurant', restaurant.post);


}
