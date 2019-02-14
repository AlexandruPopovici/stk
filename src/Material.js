var Material = function(gl, name, vert, frag){
	this.id = name;
	this.guid = generateUUID();
	this.locations = {};
	this.program = this._makeProgram(gl, vert, frag);
	return this.guid;
}


Material.prototype = {

	constructor: Material,

	_makeProgram: function(gl, vert, frag){
		var vertShader = createShader(gl, gl.VERTEX_SHADER, vert);
	    var fragShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
	    return createProgram(gl, vertShader, fragShader);
	},


	bindGL: function(gl, index, uniform_block_name){
		var ubo_id = gl.getUniformBlockIndex(this.program, uniform_block_name);
	    gl.uniformBlockBinding(this.program, ubo_id, index);
	},
	

	bindTexture: function(gl, texType, texUnit, texName, samplerName, uniformName){
		if(this.locations[uniformName] == undefined){
			var u_Location = gl.getUniformLocation(this.program, uniformName);
			this.locations[uniformName] = u_Location;
		}
		gl.activeTexture(texUnit);
		gl.bindTexture(texType, Material.Textures[texName]);
		if(samplerName != null)
			gl.bindSampler(texUnit-gl.TEXTURE0, Material.Samplers[texName]);
		gl.uniform1i(this.locations[uniformName], texUnit-gl.TEXTURE0);
	},

	bindTextureLocation: function(gl, uniformName, texUnit){
		if(this.locations[uniformName] == undefined)
			this.locations[uniformName] = gl.getUniformLocation(this.program, uniformName);
		gl.uniform1i(this.locations[uniformName], texUnit-gl.TEXTURE0);
	},

	setFloatUniform: function(gl, uniformName, value){
		if(this.locations[uniformName] == undefined)
			this.locations[uniformName] = gl.getUniformLocation(this.program, uniformName);
		gl.uniform1f(this.locations[uniformName], value);
	},

	setFloat3Uniform: function(gl, uniformName, value){
		if(this.locations[uniformName] == undefined)
			this.locations[uniformName] = gl.getUniformLocation(this.program, uniformName);
		gl.uniform3fv(this.locations[uniformName], value);
	}
}

Material.Textures = {};
Material.Samplers = {};

Material.createTexture = function(gl, texName, path, textureOptions, samplerOptions){
    Material.Textures[texName] = null;
	loadImage(path, function(image){
		var fill = function(data, textureOptions, mipmaps){
			gl.texImage2D(gl.TEXTURE_2D, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data);
			if(mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
		};
		
	    Material.Textures[texName] = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, Material.Textures[texName]);
	    fill(image, textureOptions, samplerOptions != null && samplerOptions.mipmaps);
	    if(samplerOptions != null && samplerOptions.isComplete()){
	    	gl.texParameteri(textureOptions.type, gl.TEXTURE_MIN_FILTER, samplerOptions.min_filter);
			gl.texParameteri(textureOptions.type, gl.TEXTURE_MAG_FILTER, samplerOptions.mag_filter);
			gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_S, samplerOptions.wrapS);
			gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_T, samplerOptions.wrapT);
			if(samplerOptions.anisotropy != null){
				var ext = gl.getExtension('EXT_texture_filter_anisotropic');
    			gl.texParameterf(textureOptions.type, ext.TEXTURE_MAX_ANISOTROPY_EXT, samplerOptions.anisotropy);
			}
	    }
	    gl.bindTexture(gl.TEXTURE_2D, null);
	});
};
Material.createColorTexture = function(gl, texName, intColor,textureOptions, samplerOptions){
    var texObj = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texObj);
    var color = [(intColor  >> 24) & 0x000000FF, (intColor & 0x00FF0000) >> 16, (intColor & 0x0000FF00) >> 8, (intColor & 0x000000FF)];
    gl.texImage2D(gl.TEXTURE_2D, 0, textureOptions.internalFormat, 
                                        1, 1, 0, 
                                        textureOptions.format, 
                                        textureOptions.dataType, new Uint8Array(color));
    if(samplerOptions != null && samplerOptions.isComplete()){
        gl.texParameteri(textureOptions.type, gl.TEXTURE_MIN_FILTER, samplerOptions.min_filter);
        gl.texParameteri(textureOptions.type, gl.TEXTURE_MAG_FILTER, samplerOptions.mag_filter);
        gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_S, samplerOptions.wrapS);
        gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_T, samplerOptions.wrapT);
        if(samplerOptions.anisotropy != null){
            var ext = gl.getExtension('EXT_texture_filter_anisotropic');
            gl.texParameterf(textureOptions.type, ext.TEXTURE_MAX_ANISOTROPY_EXT, samplerOptions.anisotropy);
        }
    }
    Material.Textures[texName] = texObj;
}

Material.createRenderTexture = function(gl, texName, width, height){
    Material.Textures[texName] = null;
    const targetTextureWidth = width;
    const targetTextureHeight = height;
    var targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
     
    
      // define size and format of level 0
      const level = 0;
      const internalFormat = gl.RGBA;
      const border = 0;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;
      const data = null;
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    targetTextureWidth, targetTextureHeight, border,
                    format, type, data);
     
      // set the filtering so we don't need mips
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    Material.Textures[texName] = targetTexture;
};
Material.createDepthTexture = function(texName, width, height){
    Material.Textures[texName] = null;
    // create a depth texture
    const targetTextureWidth = width;
    const targetTextureHeight = height;
    const depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
     
    // make a depth buffer and the same size as the targetTexture
    {
      // define size and format of level 0
      const level = 0;
      const internalFormat = gl.DEPTH_COMPONENT24;
      const border = 0;
      const format = gl.DEPTH_COMPONENT;
      const type = gl.UNSIGNED_INT;
      const data = null;
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    targetTextureWidth, targetTextureHeight, border,
                    format, type, data);
     
      // set the filtering so we don't need mips
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    
    Material.Textures[texName] = depthTexture;
};

Material.createCubemap = function(gl, texName, path, textureOptions, samplerOptions){
    Material.Textures[texName] = null;
	loadCubemap(path, '.jpg', function(sides){
		var fill = function(data, textureOptions, mipmaps){
			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['posx']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['negx']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['posy']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['negy']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['posz']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['negz']);
		    if(mipmaps == true) gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		}
	    Material.Textures[texName] = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_CUBE_MAP, Material.Textures[texName]);
	    // Upload the image into the texture.
	    fill(sides, textureOptions, samplerOptions != null && samplerOptions.mipmaps);
	    if(samplerOptions != null && samplerOptions.isComplete()){
	    	gl.texParameteri(textureOptions.type, gl.TEXTURE_MIN_FILTER, samplerOptions.min_filter);
			gl.texParameteri(textureOptions.type, gl.TEXTURE_MAG_FILTER, samplerOptions.mag_filter);
			gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_S, samplerOptions.wrapS);
			gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_T, samplerOptions.wrapT);
			if(samplerOptions.anisotropy != null){
				var ext = gl.getExtension('EXT_texture_filter_anisotropic');
    			gl.texParameterf(textureOptions.type, ext.TEXTURE_MAX_ANISOTROPY_EXT, samplerOptions.anisotropy);
			}
	    }
	    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}.bind(this));
};

Material.createFloat32Cubemap = function(gl, texName, path, maxMip, textureOptions, samplerOptions){
    Material.Textures[texName] = null;
    loadFloat32Cubemap(path, function(data){
        /*
            The dds parser returns :
            {
                shape: [ texWidth, texHeight ],
                images: images -> [offset in bytes, length in bytes, shape: [width ,height]]
                format: format(string)
                flags: flags(don't know what they're used for)
                cubemap: cubemap(true, false)
            }
        */
        var totalLength = data.buffer.byteLength;
        console.warn(' total length = ', totalLength);

        var fill = function(data, textureOptions, mipmapLevels){
            for(var miplevel = 0 ; miplevel < mipmapLevels; miplevel++){
                var mipLevelData = [];
                var mipLevelWidth, mipLevelHeight; 
                for(var faceIndex = 0 ; faceIndex < 6 ; faceIndex++){
                    var faceArrayIndex = faceIndex * (data.images.length/6.);
                    var mipArrayIndex = faceArrayIndex + miplevel;
                    var mipData = data.images[mipArrayIndex];
                    if(mipData.offset == totalLength)
                        mipData.offset -= 1024;
                    var faceData = data.images[faceArrayIndex];
                    mipLevelData[faceIndex] = new Float32Array(data.buffer, mipData.offset, mipData.length/4);
                }
                mipLevelWidth = data.images[data.images.length/6. + miplevel].shape[0];
                mipLevelHeight = data.images[data.images.length/6. + miplevel].shape[1];
                console.warn("Writing ", texName, " level: ", miplevel, " of size ", mipLevelWidth, "x", mipLevelHeight);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, miplevel, textureOptions.internalFormat, mipLevelWidth, mipLevelHeight, 0, textureOptions.format, textureOptions.dataType, mipLevelData[0]);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, miplevel, textureOptions.internalFormat, mipLevelWidth, mipLevelHeight, 0, textureOptions.format, textureOptions.dataType, mipLevelData[1]);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, miplevel, textureOptions.internalFormat, mipLevelWidth, mipLevelHeight, 0, textureOptions.format, textureOptions.dataType, mipLevelData[2]);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, miplevel, textureOptions.internalFormat, mipLevelWidth, mipLevelHeight, 0, textureOptions.format, textureOptions.dataType, mipLevelData[3]);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, miplevel, textureOptions.internalFormat, mipLevelWidth, mipLevelHeight, 0, textureOptions.format, textureOptions.dataType, mipLevelData[4]);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, miplevel, textureOptions.internalFormat, mipLevelWidth, mipLevelHeight, 0, textureOptions.format, textureOptions.dataType, mipLevelData[5]);
            }
        }

        Material.Textures[texName] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, Material.Textures[texName]);
        // Upload the image into the texture.
        fill(data, textureOptions, maxMip);
        if(samplerOptions != null && samplerOptions.isComplete()){
            var ext = gl.getExtension('OES_texture_float_linear');
            gl.texParameteri(textureOptions.type, gl.TEXTURE_MIN_FILTER, samplerOptions.min_filter);
            gl.texParameteri(textureOptions.type, gl.TEXTURE_MAG_FILTER, samplerOptions.mag_filter);
            gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            if(samplerOptions.anisotropy != null){
                var ext = gl.getExtension('EXT_texture_filter_anisotropic');
                gl.texParameteri(textureOptions.type, ext.TEXTURE_MAX_ANISOTROPY_EXT, samplerOptions.anisotropy);
            }
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    }.bind(this));
};

Material.createDDSTexture = function(gl, texName, path, textureOptions, samplerOptions){
    Material.Textures[texName] = null;
    loadFloat32Cubemap(path, function(data){
        /*
            The dds parser returns :
            {
                shape: [ texWidth, texHeight ],
                images: images -> [offset in bytes, length in bytes, shape: [width ,height]]
                format: format(string)
                flags: flags(don't know what they're used for)
                cubemap: cubemap(true, false)
            }
        */
        var totalLength = data.buffer.byteLength;
        console.warn(' total length = ', totalLength);
        var width = data.images[0].shape[0];
        var height = data.images[0].shape[1];
        Material.Textures[texName] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, Material.Textures[texName]);
        gl.texImage2D(gl.TEXTURE_2D, 0, textureOptions.internalFormat, 
                                        width, height, 0, 
                                        textureOptions.format, 
                                        textureOptions.dataType, 
                                        new Float32Array(data.buffer, data.images[0].offset, width*height*4));

        if(samplerOptions != null && samplerOptions.isComplete()){
            gl.texParameteri(textureOptions.type, gl.TEXTURE_MIN_FILTER, samplerOptions.min_filter);
            gl.texParameteri(textureOptions.type, gl.TEXTURE_MAG_FILTER, samplerOptions.mag_filter);
            gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_S, samplerOptions.wrapS);
            gl.texParameteri(textureOptions.type, gl.TEXTURE_WRAP_T, samplerOptions.wrapT);
            if(samplerOptions.anisotropy != null){
                var ext = gl.getExtension('EXT_texture_filter_anisotropic');
                gl.texParameterf(textureOptions.type, ext.TEXTURE_MAX_ANISOTROPY_EXT, samplerOptions.anisotropy);
            }
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
    });
}

Material.createSampler = function(gl, name, samplerOptions){
    Material.Samplers[name] = null;
	var sbo = gl.createSampler();
	gl.samplerParameteri(sbo, gl.TEXTURE_MIN_FILTER, samplerOptions.min_filter);
	gl.samplerParameteri(sbo, gl.TEXTURE_MAG_FILTER, samplerOptions.mag_filter);
	gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_S, samplerOptions.wrapS);
	gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_T, samplerOptions.wrapT);
	Material.Samplers[name] = sbo;
	//Anisotropic filtering does not work with sampler objects
	// var ext = gl.getExtension('EXT_texture_filter_anisotropic');
    // gl.samplerParameterf(sbo, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16.);
};

export default Material;