// GPawn = Geometry + Material + (Optional)DrawContext(blending, AA, testing, face-culling,etc)
STK.GPawn = function(geometry, material, drawContext){
	this.guid = generateUUID();

	this.vao = geometry.createVAO(); /* Vertex Array Object */
	this.ubo = material.createUBO(); /* Uniform Buffer Object */
	//this.tao = material.makeTAO(); /* Texture Array Object */
	this.sbo = material.createSBO(); /* Sampler Buffer Object */

	this.drawContext = drawContext;
	return this.guid;
}

STK.GPawn.prototype = {

	constructor: STK.GPawn,
}