var DrawContext = function(width, height){
	this.guid = generateUUID();

	this.width = width;
	this.height = height;
	return this.guid;
}

DrawContext.prototype = {

	constructor: DrawContext,

	set: function(){
		var gl = STK.Board.Context;
		gl.clearColor(0, 0.121, 0.247, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0,0,this.width,this.height);
	}
}

export default DrawContext;