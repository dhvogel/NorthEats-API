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
	var params = {
	  TableName : TABLE_NAME,
	};
	
	dynamodbClient.scan(params, function(err, data) {
	    if (err) {
	      return res.status(500).json({
	        success: false,
	        error: err
	      })
	    }
	    else {
	      return res.status(200).json({
	        success: true,
	        data: data
	      })
	    };
	  });
}


//Rob
//TODO: Should post a Restaurant Object to DynamoDB
/*
POST /restaurant
*/
exports.postRestaurant = function(req, res) {
	
	
	
	//Check the size of the display name
	if (req.body.displayName.length == 0){
  	  
		  var err = "Display name not found."
	  
		  return res.status(417).json({
	  	          success: false,
	  	          error: err
	  	        })
		}
	
	//Check the size of the city
	if (req.body.city.length == 0){
  	  
		  var err = "City not found."
	  
		  return res.status(417).json({
	  	          success: false,
	  	          error: err
	  	        })
		}
	
	//Check the size of the state
	if (req.body.state.length == 0){
  	  
		  var err = "State not found."
	  
		  return res.status(417).json({
	  	          success: false,
	  	          error: err
	  	        })
		}
	
		//Check that the phone number is in the correct format/reformat it and right length
		var phone = (req.body.phone.replace(/[\s-()]/g,""));
	
		if(phone.length == 0){
	  		var err = "Phone number not found."
	  
	  		return res.status(417).json({
	    	          success: false,
	    	          error: err
	    	        })
		}
	
		else if(phone.length != 10){
	  		var err = "Phone number incorrect length."
	  
	  		return res.status(417).json({
	    	          success: false,
	    	          error: err
	    	        })
		}
	
		//Check that the email contains the @ character
		if(req.body.email.length == 0){
	  		var err = "Email not found."
	  
	  		return res.status(415).json({
	    	          success: false,
	    	          error: err
	    	        })
		}
	
		else if(req.body.email.includes('@') == false){
	  		var err = "Email format incorrect."
	  
			res.status(417).json({
				    	          success: false,
				    	          error: err
				    	        })
		}
	
	//Check the size of the description
	if (req.body.description.length > 200){
      
	  var err = "Description too long. Please Limit to 200 characters."
	  
	  return res.status(431).json({
	          success: false,
	          error: err
	        })
	}
	
	else if (req.body.description.length == 0){
  	  
	  var err = "Description not found."
	  
	  return res.status(417).json({
  	          success: false,
  	          error: err
  	        })
	}
	
	//Correct the characters of the display name, city, state
	var displayNameForID = (req.body.displayName.replace(/\s+/g, '_').replace(/[']/g,"").toLowerCase());
	var stateForID = (req.body.state.replace(/\s+/g, '').toLowerCase());
	var cityForID = (req.body.city.replace(/\s+/g, '').toLowerCase());
	
	//The Date time
	var date = new Date().getTime()
	
	
	var params = {
	    TableName: TABLE_NAME,
	    KeyConditionExpression: "restaurantId = :restaurantId",
	    ExpressionAttributeValues: {
	        ":restaurantId": displayNameForID+"-"+cityForID+"-"+stateForID
	    }
	};

	dynamodbClient.query(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else{
			
			if(data["Count"] == 1){
		      
			  var error = "Restaurant already exists for that name, city, and state."
			  
			  return res.status(409).json({
		        success: false,
		        data: error
		      })
			}
			
			else{
			    var params = {
			      TableName: TABLE_NAME,
				  Item: {
					  	restaurantId: displayNameForID+"-"+cityForID+"-"+stateForID,
						description: req.body.description,
					  	displayName: req.body.displayName,
					  	email: req.body.email,
					  	phone: phone,
					    city: req.body.city,
					    state: req.body.state,
					    dateTime: date
				      }
	  
			    };
	
 
				dynamodbClient.put(params, function(err, data) {
				    if (err) {
				      return res.status(500).json({
				        success: false,
				        error: err
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
		}
		});
	
	
    
  
}

/*
GET /restaurant/:restaurantId
*/
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
            data: err
          });
      } else if (isEmptyObject(data)) {
        return res.status(401).json({
          success: false,
          data: data
        });
      }
      else {
          return res.status(403).json({
            success: true,
            data: data
          });
      }
  });
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

/*
PUT /restaurant/:restaurantId
*/

exports.updateRestaurantById = function(req, res) {
  var restaurantId = req.body.restaurantId;
		
  
	var params = {
	    TableName: TABLE_NAME,
	    KeyConditionExpression: "restaurantId = :restaurantId",
	    ExpressionAttributeValues: {
	        ":restaurantId": restaurantId
	    }
	};

	dynamodbClient.query(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else{
	
			if(data["Count"] == 1){
      		  var Items = data["Items"][0];
			  
		

			  
			  if (req.body.description.length > 0){
				  Items["description"] = req.body.description;
			  }
 
		
					//Check that the phone number is in the correct format/reformat it and right length
					var phone = (req.body.phone.replace(/[\s-()]/g,""));

					if(phone.length != 0){
						if(phone.length != 10){
							  		var error = "Phone number incorrect length."
  
							  		return res.status(417).json({
							    	          success: false,
							    	          error: error
							    	        })
								}
					}
		
				    if (req.body.phone.length > 0){
				  	  Items["phone"] = phone;
				    }


					//Check that the email contains the @ character
					if(req.body.email.length != 0){
						if(req.body.email.includes('@') == false){
							  		var error = "Email format incorrect."
  
					  		return res.status(417).json({
					    	          success: false,
					    	          error: error
					    	        })
								}
					}
		
				    if (req.body.email.length > 0){
				  	  Items["email"] = req.body.email;
				    }
		
		

				//Check the size of the description
				if (req.body.description.length > 200){
    
				  var err = "Description too long. Please Limit to 200 characters."
  
				  return res.status(431).json({
				          success: false,
				          error: err
				        })
				}


				//The Date time
				var date = new Date().getTime()
				Items["dateTime"] = date
				Items["restaurantId"] = restaurantId;
			
			  var params = {
			    TableName: TABLE_NAME,
				  Item: Items
			  };
			  
			  dynamodbClient.put(params, function(err, data) {
			      if (err) {
			          return res.status(400).json({
			            success: false,
			            data: err
			          });
			      } else {
			          return res.status(200).json({
			            success: true,
			            data: "Updated item with restaurantId " + restaurantId + " from " + TABLE_NAME + " table."
			          });
			      }
			  });
			}
	
		}
		});
  
  
  
  
  
}
