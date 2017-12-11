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
		    this.handles[texName] = gl.createTexture();
		    gl.bindTexture(gl.TEXTURE_2D, this.handles[texName]);
		    // Upload the image into the texture.
		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		    gl.generateMipmap(gl.TEXTURE_2D);
		    gl.bindTexture(gl.TEXTURE_2D, null);
		    this.handles[uniformName] = gl.getUniformLocation(this.program, uniformName);
		}.bind(this));
	},

	/**
		params: {
			wrapS: int,
			wrapT: int
		}
	*/
	createSampler: function(params){
		var gl = STK.Board.Context;
		var sbo = gl.createSampler();
		gl.samplerParameteri(sbo, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.samplerParameteri(sbo, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_S, params.wrapS);
		gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_T, params.wrapT);

		//Anisotropic filtering does not work with sampler objects...great
		// var ext = gl.getExtension('EXT_texture_filter_anisotropic');
	    // gl.samplerParameterf(sbo, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16.);
		return sbo;
	},

	bindTexture: function(texUnit, texName, sampler, uniformName){
		gl.activeTexture(texUnit);
		gl.bindTexture(gl.TEXTURE_2D, this.handles[texName]);
		gl.bindSampler(texUnit-gl.TEXTURE0, sampler);
		gl.uniform1i(this.handles[uniformName], texUnit-gl.TEXTURE0);
	}

	
}