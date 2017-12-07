STK.Material = function(vert, frag){
	this.guid = generateUUID();

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

	createUBO: function(size, uniform_block_name, index){
		var gl = STK.Board.Context;
	    const ubo = gl.createBuffer();
	    gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
	    gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(size), gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
		const ubo_id = gl.getUniformBlockIndex(this.program, uniform_block_name);
	    gl.uniformBlockBinding(this.program, ubo_id, index);
	    return ubo;
	},

	updateUBO: function(ubo, data){
		var gl = STK.Board.Context;
		gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
	    gl.bufferData(gl.UNIFORM_BUFFER, data, gl.DYNAMIC_DRAW);
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