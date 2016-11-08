var aws = require('aws-sdk');

//TODO: MASK THESE!!
aws.config.update({
  "region": "us-east-1",
  "accessKeyId": "AKIAJEGD4EM2O7JJKWDA",
  "secretAccessKey": "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"
});

var TABLE_NAME = "NorthEats-Restaurant-Test";


var dynamodb = new aws.DynamoDB();
var dynamodbClient = new aws.DynamoDB.DocumentClient();




//=====RESTAURANT API=====

//Jon
//TODO:Should retrieve ALL Restaurant objects from DynamoDB
exports.getAllRestaurants = function(req, res) {
  return res.status(200).json({
    success: true,
    data: "GET /restaurant"
  });
}

//Rob
//TODO: Should post a Restaurant Object to DynamoDB
exports.postRestaurant = function(req, res) {
  return res.status(200).json({
    success: true,
    data: "POST /restaurant"
  });
}

exports.getRestaurantById = function(req, res) {
  var restaurantId = req.params.restaurantId;

  var params = {
    TableName: TABLE_NAME,
    Key: {
        "restaurantId": restaurantId
    }
  };

  dynamodbClient.get(params, function(err, data) {
      if (err) {
          return res.status(400).json({
            success: false,
            error: err
          });
      } else {
          return res.status(200).json({
            success: true,
            data: data
          });
      }
  });
}

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
            error: err
          });
      } else {
          return res.status(200).json({
            success: true,
            data: "Deleted item with restaurantId " + restaurantId + " from " + TABLE_NAME + " table."
          });
      }
  });


}
