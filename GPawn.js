// GPawn = Geometry + Material + (Optional)DrawContext(blending, AA, testing, face-culling,etc)
STK.GPawn = function(geometry, material, drawContext){
	this.guid = generateUUID();

	this.model = mat4.create();

	this.drawContext = drawContext;
	return this.guid;
}

STK.GPawn.prototype = {

	constructor: STK.GPawn,
}