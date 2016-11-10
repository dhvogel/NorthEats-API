var aws = require('aws-sdk');
var shortid = require('shortid');

aws.config.loadFromPath(__dirname + '/config/aws-credentials.json');

var TABLE_NAME = "NorthEats-Menu-Test";


var dynamodb = new aws.DynamoDB();
var dynamodbClient = new aws.DynamoDB.DocumentClient();


exports.postMenu = function(req, res) {
  var restaurantId = req.params.restaurantId;

  console.log(req.body.menuItems);
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
        success:false,
        error: err
      })
    }
    else {
      return res.status(200).json({
        success:true,
        data:data
      })
    };
  });
}
