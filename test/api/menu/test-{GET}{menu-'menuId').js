var expect = require('chai').expect;
var fs = require('fs-extra');
var fsReg = require('fs');
var httpMocks = require('node-mocks-http');
var dynalite = require('dynalite');
var dynaliteServer;
var aws = require('aws-sdk');
var menu = require('../../../src/routes/menu');
var menuTableDefinitions = JSON.parse(fsReg.readFileSync(__dirname + "/menu-table-definitions.json"));



describe('GET /menu/:restaurantId', function() {

  beforeEach(function(done) {
    dynaliteServer = dynalite({path: './mydb', createTableMs: 0});
    dynaliteServer.listen(4567, function(err) {
      if (err) throw err
      //console.log('Dynalite started on port 4567')
    })

    var dynamo = new aws.DynamoDB({endpoint: 'http://localhost:4567'});
    var newTableParams = menuTableDefinitions.tableOne;

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
      var params = menuTableDefinitions.itemOne;

      dynamo.putItem(params, function(err, data) {
        if (err) {
          console.log("Error putting item in table", err);
          done()
        }
        else {
              done()
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
        method: 'GET',
        url: '/menu/:restaurantId',
        params: {
          restaurantId: "test"
        }
    });
    var response = httpMocks.createResponse();

    menu.getMenuById(request, response);

    var assertOnAction = function(response) {
      expect(response._getStatusCode()).to.be.eql(200);

      var parsedResponse = JSON.parse(response._getData());

      expect(parsedResponse.success).to.be.eql(true);
      expect(parsedResponse.data.Item.restaurantId).to.be.eql('test');
    }

    //this is a little hacky, can be improved later.
    //assumes that the get will happen in 100 ms
    setTimeout(function() {
      assertOnAction(response)
      done()
    }, 100);
  });

  it('should return status 400 if there are no params', function(done) {
    //Arrange
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/menu/:restaurantId',
    });
    var response = httpMocks.createResponse();

    //Act
    menu.getMenuById(request, response);

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



  it('should return status 401 if restaurantId does not exist in the menu DB', function(done) {
    //Arrange
    var request  = httpMocks.createRequest({
        method: 'GET',
        url: '/menu/:restaurantId',
        params: {
          restaurantId: 'MENU_THAT_DOES_NOT_EXIST'
        }
    });
    var response = httpMocks.createResponse();

    //Act
    menu.getMenuById(request, response);

    //Assert
    var assertOnAction = function(response) {
      expect(response._getStatusCode()).to.be.eql(401);

      var parsedResponse = JSON.parse(response._getData());
      expect(parsedResponse.success).to.be.eql(false);
      done();
    }

    setTimeout(function() {
      assertOnAction(response)
    }, 100);
  });

});
