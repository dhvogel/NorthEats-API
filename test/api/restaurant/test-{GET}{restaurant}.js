var expect = require('chai').expect;
var fs = require('fs-extra');
var fsReg = require('fs');
var httpMocks = require('node-mocks-http');
var dynalite = require('dynalite');
var dynaliteServer;
var aws = require('aws-sdk');
var restaurant = require('../../../src/routes/restaurant');
var restaurantTableDefinitions = JSON.parse(fsReg.readFileSync(__dirname + "/restaurant-table-definitions.json"));



describe('GET /restaurant', function() {

  beforeEach(function(done) {
    dynaliteServer = dynalite({path: './mydb', createTableMs: 0});
    dynaliteServer.listen(4567, function(err) {
      if (err) throw err
      //console.log('Dynalite started on port 4567')
    })

    var dynamo = new aws.DynamoDB({endpoint: 'http://localhost:4567'});
    var newTableParams = restaurantTableDefinitions.tableOne;

    dynamo.createTable(newTableParams, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
          //dynamo.listTables(console.log.bind(console));
          done();
      } else {
          //console.log("Created table.");
          setTimeout(postItemToTable(data), 1000);
      }
    });

    var postItemToTable = function(data) {
      var params = restaurantTableDefinitions.itemOne;
      var paramsTwo = restaurantTableDefinitions.itemTwo;

      dynamo.putItem(params, function(err, data) {
        if (err) {
          console.log("Error putting item in table", err);
          done()
        }
        else {
          dynamo.putItem(paramsTwo, function(err, data) {
            if (err) {
              console.log("Error putting item in table", err)
              done()
            } else {
              done()
            }
          })
        }
      });
    }
  });




  afterEach(function(done) {
    //clear out the mydb folder, removing state. This will be reconstructed in the beforeeach
    fs.emptyDir('./mydb', function (err) {
        if (err) {
          console.log("error clearing mydb", err);
          done()
        }
        else {
          //console.log('mydb directory cleared');
          var files = fs.walkSync('./mydb');
          //console.log("files in mydb:", files);
          //console.log("\n")
          done()
        }
    })

    dynaliteServer.close()
  })




  it('is a canary test, should pass', function() {
    expect(true).to.be.true;
  });




  it('should return status 200 and all restaurant objects in DB', function(done) {
    //Arrange
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/restaurant',
    });
    var response = httpMocks.createResponse();

    //Act
    restaurant.getAllRestaurants(request, response);

    //Assert
    var assertOnAction = function(response) {
      expect(response._getStatusCode()).to.be.eql(200);

      var parsedResponse = JSON.parse(response._getData());
      expect(parsedResponse.success).to.be.eql(true);
      expect(parsedResponse.data.Count).to.be.eql(2);
      expect(parsedResponse.data.Items[0]).to.have.property("restaurantId")
      expect(parsedResponse.data.Items[1]).to.have.property("restaurantId")
    }

    setTimeout(function() {
      assertOnAction(response)
      done()
    }, 200);
  });

});
