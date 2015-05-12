/* Sample script for lab manual
(c) Quarta Technologies 2015
Sergey Antonovich
Please forward any suggestions to antonovich-s@yandex.ru
*/

var tessel = require('tessel');

// Put your own configuration below
var climatelib = require('climate-si7020');
var url = "http://<put your mobile service name here>.azure-mobile.net/api/<put your api name here>"
// End of configuration

var request = require('request');
var querystring = require('querystring');

var led0 = tessel.led[0].output(0);
var led1 = tessel.led[1].output(0);

var climate = climatelib.use(tessel.port['A']);

setImmediate(function() {
	console.log('Tessel ID: ', tessel.deviceId());
});

setImmediate(function loop() {
	climate.readTemperature('c', function (err, temp) {
		climate.readHumidity(function (err, humid) {
			console.log('Measurements: t=%s, RH=%s', temp.toFixed(1), humid.toFixed(1));
			var jsonbody = {
				deviceid : tessel.deviceId(),
				t : temp.toFixed(1),
				rh : humid.toFixed(1)
			};
			var get_data = querystring.stringify(jsonbody);
			console.log('GET data:', get_data);
			var full_url = url + '/?' + get_data;
			console.log('GET data:', get_data);
			console.log('Requesting:', full_url);
			request(full_url, function(error, response, body) {
				if (!response) console.log('No HTTP response');
				else if (response.statusCode != 200 && response.statusCode != 201)
					console.log('Unknown HTTP response status code:', response.statusCode);
				else {
					var jsonres = JSON.parse(body);
					console.log('Response:', jsonres);
					if (jsonres.led0 != null) led0.RawWrite(jsonres.led0);
					if (jsonres.led1 != null) led1.RawWrite(jsonres.led1);
				}
			});
		});
	});
	setTimeout(loop, 30000);
});
