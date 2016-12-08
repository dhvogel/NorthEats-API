var expect = require('chai').expect;
require('chai').use(require('chai-as-promised'))
var fs = require('fs-extra');
var httpMocks = require('node-mocks-http');
var dynalite = require('dynalite');
var dynaliteServer;


var aws = require('aws-sdk');
var restaurant = require('../../../src/routes/restaurant');
var TEST_TABLE_NAME = "NorthEats-Restaurant-Test"



describe('Restaurant', function() {

  beforeEach(function(done) {

    dynaliteServer = dynalite({path: './mydb', createTableMs: 0});
    dynaliteServer.listen(4567, function(err) {
      if (err) throw err
      console.log('Dynalite started on port 4567')
    })

    var dynamo = new aws.DynamoDB({endpoint: 'http://localhost:4567'});

    var newTableParams = {
      TableName: TEST_TABLE_NAME,
      AttributeDefinitions: [
        {
          AttributeName: 'restaurantId',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'restaurantId',
          KeyType: 'HASH'
        }
      ],
      ProvisionedThroughput: {
          'ReadCapacityUnits': 1,
          'WriteCapacityUnits': 1
      }
    };

    dynamo.createTable(newTableParams, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
          //dynamo.listTables(console.log.bind(console));
          done();
      } else {
          console.log("Created table.");
          setTimeout(postItemToTable(data), 1000);
      }
    });

    var postItemToTable = function(data) {
      var params = {
          TableName: TEST_TABLE_NAME,
          Item: {
            restaurantId: {
              S: "test"
            }
          }
      };

      dynamo.putItem(params, function(err, data) {
        if (err) {
          console.log("Error putting item in table")
          console.log(err); // an error occurred
          done()
        }
        else {
          params = {
            TableName: TEST_TABLE_NAME
          }
          //scan just to make sure the put worked
          // dynamo.scan(params, function(err, data) {
          //   if (err) {
          //     console.log(err, err.stack); // an error occurred
          //   }
          //   else  {
          //     console.log("Table Contents:\n", data);
          //     done(); // successful response
          //   }
          // });
          done()
        }
      });
    }
  });

  afterEach(function(done) {
    //clear out the mydb folder, removing state. This will be reconstructed in the beforeeach
    fs.emptyDir('./mydb', function (err) {
        if (err) {
          console.log("error clearing mydb")
          console.log(err)
          done()
        }
        else {
          console.log('mydb directory cleared');
          var files = fs.walkSync('./mydb');
          console.log("files in mydb:", files);
          console.log("\n")
          done()
        }
    })

    dynaliteServer.close()
  })

  it('is a canary test, should pass', function() {
    expect(true).to.be.true;
  });

  //GET /restaurant/:restaurantId - POSTIVE
  it('should return status 200 and the restaurant object with restaurantId "test"', function(done) {
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/restaurant/:restaurantId',
        params: {
          restaurantId: 'test'
        }
    });
    var response = httpMocks.createResponse();

    restaurant.getRestaurantById(request, response);

    var assertOnAction = function(response) {
      expect(response._getStatusCode()).to.be.eql(200);

      var parsedResponse = JSON.parse(response._getData());
      expect(parsedResponse.success).to.be.eql(true);
      expect(parsedResponse.data.Item.restaurantId).to.be.eql('test');
      done()
    }

    //this is a little hacky, can be improved later.
    //assumes that the get will happen in 100 ms
    setTimeout(function() {
      assertOnAction(response)
    }, 100);
  });

  it('should return status 401 if restaurantId does not exist in DB', function(done) {
    //Arrange
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/restaurant/:restaurantId',
        params: {
          restaurantId: 'RESTAURANT_THAT_DOES_NOT_EXIST'
        }
    });
    var response = httpMocks.createResponse();

    //Act
    restaurant.getRestaurantById(request, response);

    //Assert
    var assertOnAction = function(response) {
      expect(response._getStatusCode()).to.be.eql(400);

      var parsedResponse = JSON.parse(response._getData());
      expect(parsedResponse.success).to.be.eql(false);
      done();
    }

    setTimeout(function() {
      assertOnAction(response)
    }, 100);
  });


});
