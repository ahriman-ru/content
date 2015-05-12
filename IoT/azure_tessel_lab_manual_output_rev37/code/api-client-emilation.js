/* Sample script for lab manual
(c) Quarta Technologies 2015
Sergey Antonovich
Please forward any suggestions to antonovich-s@yandex.ru
*/

// Put your own configuration below
var url = "http://<put your mobile service name here>.azure-mobile.net/api/<put your api name here>"
// End of configuration

var request = require('request');
var querystring = require('querystring');

var deviceId = 'Emulator';

setImmediate(function() {
	console.log('Tessel ID:', deviceId);
});

setImmediate(function loop() {
	var temp = 24.0;
	var humid = 50.0;
	console.log('Measurements: t=%s, RH=%s', temp.toFixed(1), humid.toFixed(1));
	var jsonbody = {
		deviceid : deviceId,
		t : temp.toFixed(1),
		rh : humid.toFixed(1)
	};
	var get_data = querystring.stringify(jsonbody);
	var full_url = url + '/?' + get_data;
	console.log('GET data:', get_data);
	console.log('Requesting:', full_url);
	request(full_url, function(error, response, body) {
		if (!response) console.log('No HTTP response');
		else if (response.statusCode != 200 && response.statusCode != 201)
			console.log('Unknown HTTP response status code:', response.statusCode);
		else {
			var jsonres = JSON.parse(body);
			console.log('Response: ', jsonres);
			if (jsonres.led0 != null) console.log('New led0 state:' + jsonres.led0);
			if (jsonres.led1 != null) console.log('New led1 state:' + jsonres.led1);
		}
	});
	setTimeout(loop, 30000);
});
