
/**
 * Module dependencies.
 */

var express = require('express');
var app = express()
  , routes = require('./routes')
  , path = require('path')
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/users', user.list);

server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


var id = 0;

// 소켓 이벤트 연결
io.sockets.on('connection', function(socket){
	
	id = socket.id;
	
	/**
	 * 방 입장 
	 */
	socket.on('join', function(data){
		
		// id를 어케 비교함? 쿠키를 구워? 세션???????
		
		// insert? 입장이 제대로 완료되었다는 프로세스가 완료되면 리턴
		io.sockets.sockets[id].emit('create_room', data);
	});
	
	/**
	 * 메세징 
	 */
	socket.on('messege', function(data){
		console.log(data.username);
	});
});