var aws = require('aws-sdk');
var isEmptyObject = require('is-empty-object');

aws.config.loadFromPath(__dirname + '/config/DEV-aws-credentials.json');

var TABLE_NAME = "NorthEats-Restaurant-Test";

var dynamodb = new aws.DynamoDB();
var dynamodbClient = new aws.DynamoDB.DocumentClient();




//=====RESTAURANT API=====

//Jon
//TODO:Should retrieve ALL Restaurant objects from DynamoDB
/*
GET /restaurant
*/
exports.getAllRestaurants = function(req, res) {
  return res.status(200).json({
    success: true,
    data: "GET /restaurant"
  });
}


//Rob
//TODO: Should post a Restaurant Object to DynamoDB
/*
POST /restaurant
*/
exports.postRestaurant = function(req, res) {
  return res.status(200).json({
    success: true,
    data: "POST /restaurant"
  });
}


/*
GET /restaurant/:restaurantId
*/
exports.getRestaurantById = function(req, res) {
  var restaurantId = req.params.restaurantId;

  console.log(restaurantId)

  var params = {
    TableName: TABLE_NAME,
    Key: {
        "restaurantId": restaurantId
    }
  };

  dynamodbClient.get(params, function(err, data) {
      console.log(data)
      if (err) {
          return res.status(400).json({
            success: false,
            data: err
          });
      } else if (isEmptyObject(data)) {
        return res.status(401).json({
          success: false,
          data: data
        });
      }
      else {
          return res.status(200).json({
            success: true,
            data: data
          });
      }
  });

  console.log(params)
}

/*
DELETE /restaurant/:restaurantId
*/
exports.deleteRestaurantById = function(req, res) {
  var restaurantId = req.params.restaurantId;

  var params = {
    TableName: TABLE_NAME,
    Key: {
        "restaurantId": restaurantId
    }
  };

  dynamodbClient.delete(params, function(err, data) {
      if (err) {
          return res.status(400).json({
            success: false,
            data: err
          });
      } else {
          return res.status(200).json({
            success: true,
            data: "Deleted item with restaurantId " + restaurantId + " from " + TABLE_NAME + " table."
          });
      }
  });
}
