STK.Material = function(name, vert, frag){
	this.id = name;
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
	},

	bindTextureLocation: function(uniformName, texUnit){
		if(this.locations[uniformName] == undefined)
			this.locations[uniformName] = gl.getUniformLocation(this.program, uniformName);
		gl.uniform1i(this.locations[uniformName], texUnit-gl.TEXTURE0);
	}

	
}