STK.Material = function(name, vert, frag){
	this.userID = name;
	this.guid = generateUUID();
	this.locations = {};
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

	updateGL: function(handle, offset, data){
		var gl = STK.Board.Context;
		gl.bindBuffer(gl.UNIFORM_BUFFER, handle);
		gl.bufferSubData(gl.UNIFORM_BUFFER, offset*4, new Float32Array(data), 0, data.length);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	},

	bindGL: function(index, uniform_block_name){
		var gl = STK.Board.Context;
		var ubo_id = gl.getUniformBlockIndex(this.program, uniform_block_name);
	    gl.uniformBlockBinding(this.program, ubo_id, index);
	},
	

	bindTexture: function(texType, texUnit, texName, samplerName, uniformName){
		if(this.locations[uniformName] == undefined)
			this.locations[uniformName] = gl.getUniformLocation(this.program, uniformName);
		gl.activeTexture(texUnit);
		gl.bindTexture(texType, STK.Material.Textures[texName]);
		if(samplerName != null)
			gl.bindSampler(texUnit-gl.TEXTURE0, STK.Material.Samplers[texName]);
		gl.uniform1i(this.locations[uniformName], texUnit-gl.TEXTURE0);
	}

	
}