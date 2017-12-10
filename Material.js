STK.Material = function(name, vert, frag){
	this.userID = name;
	this.guid = generateUUID();
	this.data = {};
	this.handles = {};
	this.program = this._makeProgram(vert, frag);
	return this.guid;
}

STK.Material.prototype = {

	constructor: STK.Material,

	_makeProgram: function(vert, frag){
		var vertShader = createShader(gl, gl.VERTEX_SHADER, vert);
	    var fragShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
	    return createProgram(gl, vertShader, fragShader);
	},

	createGL: function(uniform_block_name, size){
		var gl = STK.Board.Context;
	    
		var ubo = gl.createBuffer();
		gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
		gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(size), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
		
	    return ubo;
	    
	},

	bindGL: function(index, uniform_block_name){
		var gl = STK.Board.Context;
		const ubo_id = gl.getUniformBlockIndex(this.program, uniform_block_name);
	    gl.uniformBlockBinding(this.program, ubo_id, index);
	},

	updateGL: function(handle, offset, data){
		var gl = STK.Board.Context;
		gl.bindBuffer(gl.UNIFORM_BUFFER, handle);
		gl.bufferSubData(gl.UNIFORM_BUFFER, offset*4, new Float32Array(data), 0, data.length);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	},

	createSBO: function(){
		var gl = STK.Board.Context;
		var sbo = gl.createSampler();
		gl.samplerParameteri(sbo, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.samplerParameteri(sbo, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		return sbo;
	}

}