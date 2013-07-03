/**
 * @author rsi
 */

$(function(){
	
	// 1. 입장하기
	var socket = io.connect();
	
	var Messenger = Backbone.View.extend({
		tagName: "div",
		className: "messenger",
		initialize: function(){
			console.log("메신저 껍데기가 만들어져쐅요");
		},
		render: function(){
			this.$el.append("<button class='btn'>짝남</button>");
			return this;
		}
	});
	
	
	var person = prompt('입장하기 :', '');
	var msg = new Messenger();
	$("body").html(msg.render().el);
	
	
	/// 방 입장 > 서버 먼저 호출 > 제대로 저장되면.. 뷰 그리고 시작
	
	/// 컨텐츠 뷰를 일단 만든다.
	
	
});
