/* Sample script for lab manual
(c) Quarta Technologies 2015
Sergey Antonovich
Please forward any suggestions to antonovich-s@yandex.ru

Call the following URL to check if script works properly:

http://<your mobile service name>.azure-mobile.net/api/<your API name>?dev_id=test_id&t=0.0&rh=0.0

First time, it should return 201.
Second time, it should return 200.
*/

// put your table name here
var table_name = "<put your table name here>";

exports.post = function(request, response) {
    // Use "request.service" to access features of your mobile service, e.g.:
    //   var tables = request.service.tables;
    //   var push = request.service.push;
	
	response.type('text/plain');
    response.send(204, { message : 'No content'} );
};

exports.get = function(request, response) {
	response.type('text/plain');
	
    // Check if there is device ID in query
    if (!request.query.deviceid) {
        response.send(403, {message : 'No device'} );
        return;
    }   
    
    // check if the device exists in database
	var dev_id = request.query.deviceid;
    var mssql = request.service.mssql;
    var find_dev = "select id,led0,led1 from " + table_name + " where deviceid='" + dev_id + "';";
    mssql.query(find_dev, {
        success:function(results) {
			switch (results.length)
			{
			case 0:
				// not found - add one
				console.log('Device ID not found: ' + dev_id);
				// send response as text
				response.send(201, { message : 'Created', led0 : null, led1 : null } );
				var create_dev = "insert " + table_name + " (deviceid) values ('" + dev_id + "');";
				mssql.query(create_dev, {
					success:function(results) {
						console.log('Created successfully');
					}
				});
			break;
			case 1:
				// exactly one found
                var idx = 0;
				// log results
                console.log('Found one record: ' + JSON.stringify(results[idx]));
				// send id, led0, led1 back to device
                response.send(200, results[idx]);
				// put data from the device to table
                var target_id = results[idx].id;
                var update_dev = "update " + table_name + " set t=" + request.query.t +
                    ",rh=" + request.query.rh +
                    " where id='" + target_id + "';";
                mssql.query(update_dev, {
                    success:function(results) {
                        console.log('Data updated successfully');
                    }
                });
			break;
			default:
				// duplicated entries exist - no handler because of scripts' academic purposes
				response.send(406, { message : 'Duplicated entries exist'} );
			break;
			}
        }
    });
};
