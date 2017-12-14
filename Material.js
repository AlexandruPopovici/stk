STK.Material = function(name, vert, frag){
	this.userID = name;
	this.guid = generateUUID();
	this.data = {};
	this.locations = {};
	this.program = this._makeProgram(vert, frag);
	return this.guid;
}

STK.Material.Handles = {

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

	createTexture: function(texName, path, uniformName){
		loadImage(path, function(image){
		    STK.Material.Handles[texName] = gl.createTexture();
		    gl.bindTexture(gl.TEXTURE_2D, STK.Material.Handles[texName]);
		    // Upload the image into the texture.
		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, image);
		    //gl.generateMipmap(gl.TEXTURE_2D);
		    gl.bindTexture(gl.TEXTURE_2D, null);
		    // STK.Material.Handles[uniformName] = gl.getUniformLocation(this.program, uniformName);
		}.bind(this));
	},

	createCubemap: function(texName, path, uniformName){
		loadCubemap(path, '.jpg', function(sides){
		    STK.Material.Handles[texName] = gl.createTexture();
		    gl.bindTexture(gl.TEXTURE_CUBE_MAP, STK.Material.Handles[texName]);
		    // Upload the image into the texture.
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, sides['posx']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, sides['negx']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, sides['posy']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, sides['negy']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, sides['posz']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.SRGB8, gl.RGB, gl.UNSIGNED_BYTE, sides['negz']);

		    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
		    //gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
		    // STK.Material.Handles[uniformName] = gl.getUniformLocation(this.program, uniformName);
		}.bind(this));
	},

	/**
		params: {
			min : int,
			mag: int,
			wrapS: int,
			wrapT: int
		}
	*/
	createSampler: function(params){
		var gl = STK.Board.Context;
		var sbo = gl.createSampler();
		gl.samplerParameteri(sbo, gl.TEXTURE_MIN_FILTER, params.min);
		gl.samplerParameteri(sbo, gl.TEXTURE_MAG_FILTER, params.mag);
		gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_S, params.wrapS);
		gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_T, params.wrapT);

		//Anisotropic filtering does not work with sampler objects...great
		// var ext = gl.getExtension('EXT_texture_filter_anisotropic');
	    // gl.samplerParameterf(sbo, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16.);
		return sbo;
	},

	bindTexture: function(texType, texUnit, texName, sampler, uniformName){
		if(this.locations[uniformName] == undefined)
			this.locations[uniformName] = gl.getUniformLocation(this.program, uniformName);
		gl.activeTexture(texUnit);
		gl.bindTexture(texType, STK.Material.Handles[texName]);
		// if(sampler != null)
			gl.bindSampler(texUnit-gl.TEXTURE0, sampler);
		gl.uniform1i(this.locations[uniformName], texUnit-gl.TEXTURE0);
	}

	
}