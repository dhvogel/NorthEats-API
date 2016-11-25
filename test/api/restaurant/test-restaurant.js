var chai = require('chai');
var AWS = require('aws-sdk-mock');


describe('Restaurant', function() {
  afterEach(function() {
    AWS.restore('DynamoDB.DocumentClient');
  })

  describe('getRestaurantById', function() {

    //========= SET UP MOCK ==========
    it('Should return a restaurant object when restaurant with queried restaurantId is present in database', function() {
      const restaurantId = 'testId'
      const displayName = 'testName'
      const email = 'test@test.com'
      const phone = '1111111111'
      const description = 'test description'

      //AWS.mock statement must be BEFORE module in question is instantiated
      AWS.mock('DynamoDB.DocumentClient', 'get', function(params, callback) {
        callback(null,
          {
            Item: {
              restaurantId: restaurantId,
              displayName: displayName,
              email: email,
              description: description,
              phone: phone
            }
          })
       });

      //========== SET UP FUNCTION CALL ==========
      //MUST be instantiated AFTER AWS.mock statement
      var restaurant = require('../../../src/routes/restaurant');

      const req = {
        params: {
          restaurantId: restaurantId
        }
      }

      const res = {
          send: function(){ },
          json: function(responseBody) {
              var item = responseBody.data.Item;
              chai.assert.equal(item.restaurantId, restaurantId);
              chai.assert.equal(item.displayName, displayName);
              chai.assert.equal(item.email, email);
              chai.assert.equal(item.description, description);
              chai.assert.equal(item.phone, phone);
          },
          status: function(responseStatus) {
              chai.assert.equal(responseStatus, 200);
              // This next line makes it chainable
              return this;
          }
      }

      restaurant.getRestaurantById(req, res);


    })
  })
})
