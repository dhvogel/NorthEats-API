var aws = require('aws-sdk');

//TODO: MASK THESE!!
aws.config.update({
  "region": "us-east-1",
  "accessKeyId": "AKIAJEGD4EM2O7JJKWDA",
  "secretAccessKey": "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"
});

var dynamodb = new aws.DynamoDB.DocumentClient();



//=====RESTAURANT API=====

//test function for reference
exports.test = function(req, res) {
  var params = {
    TableName: "NorthEats-Restaurant-Test",
    Key: {
        "RestaurantId": 1234
    }
  };

  dynamodb.get(params, function(err, data) {
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

//TODO:Should retrieve ALL Restaurant objects from DynamoDB
exports.get = function(req, res) {

}

//TODO: Should post a Restaurant Object to DynamoDB
exports.post = function(req, res) {

}
