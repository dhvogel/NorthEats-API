var should = require('should');
var assert = require('assert');
var request = require('supertest');
var aws = require('aws-sdk');
var winston = require('winston');

describe('Routing', function() {
  var url = 'http://localhost:8080';

  before(function(done) {
    //test db before anything
    var TABLE_NAME = "NorthEats-Restaurant-Test";
    aws.config.loadFromPath(__dirname + '/../../../src/routes/config/aws-credentials.json');
    
    done();
  });

  describe('Restaurant', function() {
    it('Should return 401 trying to get restaurant with a restaurantId that does not exist in the DB', function(done) {

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
