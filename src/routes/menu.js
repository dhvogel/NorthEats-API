var aws = require('aws-sdk');

aws.config.loadFromPath(__dirname + '/config/aws-credentials.json');

var TABLE_NAME = "NorthEats-Menu-Test";

var dynamodbClient = new aws.DynamoDB.DocumentClient();

/*
POST /menu/:restaurantId
*/
exports.postMenu = function(req, res) {
  var restaurantId = req.params.restaurantId;

  var params = {
    TableName: TABLE_NAME,
    Item: {
      restaurantId : restaurantId,
      menuItems: req.body.menuItems
    }
  }


  dynamodbClient.put(params, function(err, data) {
    if (err) {
      return res.status(400).json({
        success: false,
        data: err
      })
    }
    else {
      return res.status(200).json({
        success: true,
        data: params
      })
    };
  });
}

/*
GET /menu/:restaurantId
*/
exports.getMenuFromRestaurant = function(req, res) {
  var restaurantId = req.params.restaurantId;

  var params = {
    TableName: TABLE_NAME,
    Key: {
      "restaurantId": restaurantId
    }
  };

  dynamodbClient.get(params, function(err, data) {
    if (err) {
      return res.status(401).json({
        success: false,
        data: err
      })
    } else {
      return res.status(200).json({
        success: true,
        data: data
      })
    }
  })
}


/*
DELETE /menu/:restaurantId
*/
exports.deleteMenuFromRestaurant = function(req, res) {
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
