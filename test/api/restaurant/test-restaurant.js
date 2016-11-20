var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');
var faker = require('faker');

var dynalite = require('dynalite'),
    dynaliteServer = dynalite({path: './mydb', createTableMs: 50})

// Listen on port 4567
dynaliteServer.listen(4567, function(err) {
  if (err) throw err
  console.log('Dynalite started on port 4567')
})
var aws = require('aws-sdk');

var restaurant = require('../../../src/routes/restaurant');

var TEST_TABLE_NAME = "Restaurants"



describe('Routing', function() {
  var url = 'http://localhost:8080';

  before(function(done) {
    console.log("\n\nBEFORE\n\n")
    //test db before anything
    var dynamo = new aws.DynamoDB({endpoint: 'http://localhost:4567'});

    dynamo.listTables(console.log.bind(console));

    var newTableParams = {
      TableName: TEST_TABLE_NAME,
      AttributeDefinitions: [{AttributeName: 'userId', AttributeType: 'S'}],
      KeySchema: [{AttributeName: 'userId', KeyType: 'HASH'}],
      ProvisionedThroughput: {
          'ReadCapacityUnits': 5,
          'WriteCapacityUnits': 5
      }
    };

    dynamo.createTable(newTableParams, function(err, data) {
      if (err) {
          console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
          done();
      } else {

          var isTableActive = function(data) {
            if (data.TableDescription.TableStatus != "ACTIVE") {
              console.log("table not active yet");
              setTimeout(isTableActive(data), 1000);
            } else {
              console.log("table is active");
              done();
            }
          }

          isTableActive(data);
      }
    });

  });

  after(function(done) {

    console.log("\n\nAFTER\n\n");
        var dynamo = new aws.DynamoDB({endpoint: 'http://localhost:4567'});
    dynamo.listTables(console.log.bind(console));
    var oldTableParams = {
      TableName : TEST_TABLE_NAME
    };

    dynamo.deleteTable(oldTableParams, function(err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
            done();
        } else {
            console.log("deleted table")
            console.log(data);
            dynamo.listTables(console.log.bind(console));
            done();
        }
    })
  });

  describe('Restaurant', function() {
    it('Should return 401 when trying to get restaurant with a restaurantId that does not exist in the DB', function(done) {

    request(url)
  	.get('/api/restaurant/RESTAURANT_THAT_DOES_NOT_EXIST')

  	.end(function(err, res) {
        if (err) {
          throw err;
        }
        res.status.should.be.equal(401);
        done();
      });
    });
    it('Should return 200 when returning a successful query', function(done) {

    var randomDisplayName = faker.company.companyName();
    var randomDescription = faker.company.catchPhrase();
    var randomEmail = faker.internet.email();
    var randomPhone = faker.phone.phoneNumber();
    var randomId = faker.random.alphaNumeric();

    var params = {

    }

    dynamodbClient.put(params, function(err, data) {
      if (err) {
        return res.status(500).json({
          success: false,
          data: err
        })
      } else {
        return res.status(200).json({
          success: true,
          data: params
        })
      }
    })



    request(url)
  	.get('/api/restaurant/RESTAURANT_THAT_DOES_NOT_EXIST')

  	.end(function(err, res) {
        if (err) {
          throw err;
        }
        res.status.should.be.equal(401);
        done();
      });
    });
  });
});
