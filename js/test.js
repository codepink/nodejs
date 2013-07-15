var http = require('http'),
	fs = require('fs');

http.createServer(function(request, response) {
	
	fs.readFile('../html/test.html', function(error, data){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end(data);
	});
	
}).listen(3389, function() {
	console.log('Server running');
});
