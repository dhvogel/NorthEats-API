var expect = require('chai').expect;
var fs = require('fs-extra');
var httpMocks = require('node-mocks-http');
var dynalite = require('dynalite');
var dynaliteServer;

var aws = require('aws-sdk');
var restaurant = require('../../../src/routes/restaurant');
var TEST_TABLE_NAME = "Restaurants"



describe('Restaurant', function() {

  beforeEach(function(done) {


    dynaliteServer = dynalite({path: './mydb', createTableMs: 50});
    dynaliteServer.listen(4567, function(err) {
      if (err) throw err
      console.log('Dynalite started on port 4567')
    })

    var dynamo = new aws.DynamoDB({endpoint: 'http://localhost:4567'});
    dynamo.listTables(console.log.bind(console));

    var newTableParams = {
      TableName: TEST_TABLE_NAME,
      AttributeDefinitions: [{AttributeName: 'userId', AttributeType: 'S'}],
      KeySchema: [{AttributeName: 'userId', KeyType: 'HASH'}],
      ProvisionedThroughput: {
          'ReadCapacityUnits': 1,
          'WriteCapacityUnits': 1
      }
    };

    dynamo.createTable(newTableParams, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
          dynamo.listTables(console.log.bind(console));
          done();
      } else {
          console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
          console.log("/nWaiting for table to be active");
          done()
      }
    });

  });

  afterEach(function(done) {
    fs.emptyDir('./mydb', function (err) {
        if (err) {
          console.log("\nERROR")
          console.log(err)
          done()
        }
        else {
          console.log('success!');
          var files = fs.walkSync('./mydb');
          console.log(files);
          done()
        }
    })

    dynaliteServer.close()
  })

  it('is a canary test, should pass', function() {
    expect(true).to.be.true;
  });

  it('should return all the restaurants', function() {
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/restaurant'
    });
    var response = httpMocks.createResponse();
    restaurant.getAllRestaurants(request, response);
    console.log(response.statusCode);
    console.log(JSON.parse(response._getData()));
  })
});
