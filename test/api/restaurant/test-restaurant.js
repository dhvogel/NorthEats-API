var chai = require('chai');
var AWS = require('aws-sdk-mock');
var realAWS = require('aws-sdk');
realAWS.config.loadFromPath(__dirname + '/../../../src/routes/config/DEV-aws-credentials.json');



describe('getRestaurantById', function() {

  it('should return a list of components', function() {
    //AWS.mock statement must be BEFORE module in question is instantiated
    AWS.mock('DynamoDB.DocumentClient', 'get', 'DOING A GET');

    var dynamodbClient = new realAWS.DynamoDB.DocumentClient();

    dynamodbClient.get({}, function(err, data) {
      if (err) {console.log(err)}
      else {console.log(data)}
    })

    //MUST be instantiated AFTER AWS.mock statement
    var restaurant = require('../../../src/routes/restaurant');

    restaurant.getRestaurantById();

    AWS.restore('DynamoDB.DocumentClient');
  })

  it('should return error on exception thrown', function() {
    AWS.mock('DynamoDB', 'scan', (params, callback) => {
      callback('Error')
    })
  })
})
