STK.DrawContext = function(width, height){
	this.guid = generateUUID();

	this.width = width;
	this.height = height;
	return this.guid;
}

STK.DrawContext.prototype = {

	constructor: STK.DrawContext,

	set: function(){
		var gl = STK.Board.Context;
		gl.clearColor(1, 1, 1, 1);
		gl.enable(gl.DEPTH_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0,this.width,this.height);
	}
}