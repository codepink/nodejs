/**
 * @author rsi
 */

$(function(){
	
	// 1. 입장하기
	var username = prompt('입장하기 :', ''),
		socket = io.connect(), // on('connection') 실행
		view;
	
	socket.emit('join', {
		'username': username
	});
	
	socket.on('create_room', function(data){ // data는 Object로 들어온다. 이걸 그냥 모델 생성때 넣어버림..
		
		console.log("메신저에 잘 들어왔으니 뷰 생성");
		
		// 사람 모델 만들고 메신저 껍데기(방)에 넣는다
		
		
		///// 여기가 컨트롤러임
		var person = new Person({
			username: data.username
		});
		
		view = new Messenger(person);
		
		$("body").html(view.render().el);
		
	});
	
	socket.on('chat', function(data){
		view.addChat(data);
	});
	
	socket.on('add_state', function(data){
		view.addChat(data);
	});
	
	/**
	 * 사람 모델
	 */
	var Person = Backbone.Model.extend();
	
	/**
	 * 컨텐츠뷰 선언
	 */
	var Messenger = Backbone.View.extend({
		tagName: "div",
		className: "messenger",
		events: {
			"keypress #inputMsg": "messeging" 
		},
		initialize: function(model){
			var self = this;
			
			console.log("메신저 껍데기가 만들어져쐅요");
			
			this.model = model;
			
			this.template = _.template($("#layoutTemplate").html());
			this.msgTemplate = _.template($("#chatItemTemplate").html());
			
		},
		render: function(){
			
			this.$el.html(this.template(this.model.toJSON()));
			
			return this;
		},
		messeging: function(e){
			var code = (e.keyCode ? e.keyCode : e.which),
				self = this;
			
			if(code == 13){ // enter keycode
				
				socket.emit('message', {
					'username': self.model.get("username"),
					'msg': self.$el.find("#inputMsg").val(),
					'date': new Date().toUTCString()
				});
				
				this.$el.find("#inputMsg").val("");
			}
		},
		addChat: function(data){
			
			var opt = {
				"username": data.username,
				"msg": data.msg	
			};
			
			opt["type"] = (data.username == this.model.get("username")) ? "me" : "other";
			
			this.$el.find("#contents").append(this.msgTemplate(opt));
			
		},
		addState: function(data){
			
		}
	});
	
});
