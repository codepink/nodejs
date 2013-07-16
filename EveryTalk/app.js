
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


var allSockets = {

	// A storage object to hold the sockets
	sockets: {},

	// Adds a socket to the storage object so it can be located by name
	addSocket: function(socket, name) {
		this.sockets[name] = socket;
	},

	// Removes a socket from the storage object based on its name
	removeSocket: function(name) {
		
		console.log(this.sockets);
		
		// if (this.sockets[name] !== undefined) {
			// this.sockets[name] = null;
			// delete this.sockets[name];
		// }
	},

	// Returns a socket from the storage object based on its name
	// Throws an exception if the name is not valid
	getSocketByName: function(name) {
		if (this.sockets[name] !== undefined) {
			return this.sockets[name];
		} else {
			throw new Error("A socket with the name '"+name+"' does not exist");
		}
	}
};


// 소켓 이벤트 연결
io.sockets.on('connection', function(socket){
	
	/**
	 * 방 입장 
	 */
	socket.on('join', function(data){
		
		allSockets.addSocket(socket, data.username);
		
		allSockets.getSocketByName(data.username).emit('create_room', data);
	});
	
	/**
	 * 메세징 
	 */
	socket.on('message', function(data){
		
		io.sockets.emit('chat', data);
	
	});
	
	/**
	 * 방 나감 
	 */
	socket.on('disconnect', function(data){
		console.log("/////////////////////////////////");
		console.log(socket.id);
		allSockets.removeSocket(socket.id);
		
		io.sockets.emit('add_state');
	});
});