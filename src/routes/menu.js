var aws = require('aws-sdk');

aws.config.loadFromPath(__dirname + '/config/aws-credentials.json');

var TABLE_NAME = "NorthEats-Menu-Test";


var dynamodb = new aws.DynamoDB();
var dynamodbClient = new aws.DynamoDB.DocumentClient();
