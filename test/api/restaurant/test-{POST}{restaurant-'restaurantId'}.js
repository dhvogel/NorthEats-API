var expect = require('chai').expect;
var fs = require('fs-extra');
var fsReg = require('fs');
var httpMocks = require('node-mocks-http');
var dynalite = require('dynalite');
var dynaliteServer;
var aws = require('aws-sdk');
var restaurant = require('../../../src/routes/restaurant');
var restaurantTableDefinitions = JSON.parse(fsReg.readFileSync(__dirname + "/restaurant-table-definitions.json"));



describe('POST /restaurant/:restaurantId', function() {

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




  it('should return 200 and the restaurantId if the request is successful', function(done) {
    var request  = httpMocks.createRequest({
        method: 'POST',
        url: '/restaurant/:restaurantId',
        body: {
          description: "A really good restaurant",
          displayName: "Dan's House of Quinoa",
          email: "QuinoaLover@Quinoa.com",
          phone: "1111111111",
          city: "Lexington",
          state: "MA"
        }
    });
    var response = httpMocks.createResponse();

    restaurant.postRestaurant(request, response);

    var assertOnAction = function(response) {
      expect(response._getStatusCode()).to.be.eql(200);

      var parsedResponse = JSON.parse(response._getData());
      console.log(parsedResponse)
      expect(parsedResponse.success).to.be.eql(true);
      expect(parsedResponse.data.Item.restaurantId).to.be.eql('dans_house_of_quinoa-lexington-ma');
      expect(parsedResponse.data.Item.description).to.be.eql('A really good restaurant');
      expect(parsedResponse.data.Item.displayName).to.be.eql('Dan\'s House of Quinoa');
      expect(parsedResponse.data.Item.email).to.be.eql('QuinoaLover@Quinoa.com');
      expect(parsedResponse.data.Item.phone).to.be.eql('1111111111');
      expect(parsedResponse.data.Item.city).to.be.eql('Lexington');
      expect(parsedResponse.data.Item.state).to.be.eql('MA');


    }

    //this is a little hacky, can be improved later.
    //assumes that the get will happen in 100 ms
    setTimeout(function() {
      assertOnAction(response)
      done()
    }, 1000);
  })
})
