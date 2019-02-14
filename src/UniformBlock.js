var UniformBlock = function(id){
	this.id = id;
	this.handle= null;
}

UniformBlock.prototype = {

	constructor: UniformBlock,

	createGL: function(gl, size){
		this.handle = gl.createBuffer();
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.handle);
		gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(size), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
		return this;
	},

	updateGL: function(gl, offset, data){
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.handle);
		gl.bufferSubData(gl.UNIFORM_BUFFER, offset*4, new Float32Array(data), 0, data.length);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	},

	/*
		Batch update buffer data. Expects an array of {offset, data}
	*/
	updateGL_batch: function(gl){
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.handle);
		for(var i = 1 ; i < arguments.length; i++){
			gl.bufferSubData(gl.UNIFORM_BUFFER, arguments[i].offset*4, new Float32Array(arguments[i].data), 0, arguments[i].data.length);
		}
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	},
}

export default UniformBlock;