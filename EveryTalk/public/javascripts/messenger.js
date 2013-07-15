/**
 * @author rsi
 */

$(function(){
	
	// 1. 입장하기
	var username = prompt('입장하기 :', ''),
		socket = io.connect(); // on('connection') 실행
	
	
	socket.emit('join', {
		'username': username
	});
	
	socket.on('create_room', function(data){ // data는 Object로 들어온다. 이걸 그냥 모델 생성때 넣어버림..
		
		console.log("메신저에 잘 들어왔으니 뷰 생성");
		
		// 사람 모델 만들고 메신저 껍데기(방)에 넣는다
		
		var person = new Person({
			username: data.username
		});
		
		$("body").html(new Messenger(person).render().el);
		
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
			
			this.template = _.template($("#itemTemplate").html());
			
			socket.on('push_message', function(data){
				self.pushMessage(data.msg);
			});
			
		},
		render: function(){
			
			this.$el.html(this.template(this.model.toJSON()));
			
			return this;
		},
		messeging: function(e){
			var code = (e.keyCode ? e.keyCode : e.which),
				self = this;
			
			if(code == 13){ // enter keycode
				console.log(socket);
				socket.emit('message', {
					'username': self.$el.find("h3").html(), // 원래 쿠키값으로 제어???? 모다???
					'msg': self.$el.find("#inputMsg").val(),
					'date': new Date().toUTCString()
				});
				
				this.$el.find("#inputMsg").val("");
			}
		},
		pushMessage: function(msg){
			
			this.$el.find("#contents").append("<div>" + msg + "</div>");
		}
	});
	
	
	/// 방 입장 > 서버 먼저 호출 > 제대로 저장되면.. 뷰 그리고 시작
	
	/// 컨텐츠 뷰를 일단 만든다.
	
	
});
