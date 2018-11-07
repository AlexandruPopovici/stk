/*
******************************************************************	
********************** OPTIONS ***********************************
******************************************************************
*/

STK.TextureOptions = function(){
    this.type = null;
    this.format = null;
    this.dataType = null;
    this.internalFormat = null;
}

STK.TextureOptions.prototype = {

    constructor: STK.TextureOptions,
}

STK.TextureOptions.new = function(gl, params){
    var options = new STK.TextureOptions();
    options.type = params.type;
    options.format = params.format;
    options.internalFormat = params.internalFormat;
    options.dataType = params.dataType;
    return options;
};

STK.TextureOptions.texture_rgba_Options = function(gl){
    var options = new STK.TextureOptions();
    options.type = gl.TEXTURE_2D;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}

STK.TextureOptions.texture_srgb_Options = function(gl){
    var options = new STK.TextureOptions();
    options.type = gl.TEXTURE_2D;
    options.format = gl.SRGB;
    options.internalFormat = gl.RGB;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}


STK.TextureOptions.cubemap_rgba_Options = function(gl){
    var options = new STK.TextureOptions();
    options.type = gl.TEXTURE_CUBE_MAP;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}


STK.TextureOptions.cubemap_srgb_Options = function(gl){
    var options = new STK.TextureOptions();
    options.type = gl.TEXTURE_CUBE_MAP;
    options.format = gl.SRGB;
    options.internalFormat = gl.RGB;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}

STK.TextureOptions.cubemap_float32_Options = function(gl){
    var options = new STK.TextureOptions();
    options.type = gl.TEXTURE_CUBE_MAP;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA32F;
    options.dataType = gl.FLOAT;
    return options;
}

STK.TextureOptions.texture_RG32_Options = function(gl){
    var options = new STK.TextureOptions();
    options.type = gl.TEXTURE_2D;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA32F;
    options.dataType = gl.FLOAT;
    return options;
}


STK.SamplerOptions = function(){
    this.min_filter = null;
    this.mag_filter = null;
    this.wrapS = null;
    this.wrapT = null;
    this.anisotropy = null;
    this.mipmaps = null;
    this.flipY = false;
}

STK.SamplerOptions.prototype = {

    constructor: STK.SamplerOptions,

    isComplete: function(){
        return this.min_filter != null && 
               this.mag_filter != null &&
               this.wrapS != null &&
               this.wrapT != null;
    },

    amend: function(property, value){
    	if(!this.hasOwnProperty(property))
    		return;
    	this[property] = value;
    	return this;
    },
}

STK.SamplerOptions.texture_mipmaps_only = function(gl){
    var options = new STK.SamplerOptions();
    options.mipmaps = true;
    return options;
};

STK.SamplerOptions.texture_linear_Sampler = function(gl){
    var options = new STK.SamplerOptions();
    options.min_filter = gl.LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.REPEAT;
    options.wrapT = gl.REPEAT;
    options.anisotropy = 16;
    options.mipmaps = null;
    return options;
}

STK.SamplerOptions.texture_mips_Sampler = function(gl){
    var options = new STK.SamplerOptions();
    options.min_filter = gl.LINEAR_MIPMAP_LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.REPEAT;
    options.wrapT = gl.REPEAT;
    options.anisotropy = 16;
    options.mipmaps = true;
    return options;
}

STK.SamplerOptions.cubemap_mips_linear_Sampler = function(gl){
    var options = new STK.SamplerOptions();
    options.min_filter = gl.LINEAR_MIPMAP_LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.MIRRORED_REPEAT;
    options.wrapT = gl.MIRRORED_REPEAT;
    options.wrapR = gl.MIRRORED_REPEAT;
    options.anisotropy = 16;
    options.mipmaps = true;
    return options;
}

STK.SamplerOptions.cubemap_linear_Sampler = function(gl){
    var options = new STK.SamplerOptions();
    options.min_filter = gl.LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.MIRRORED_REPEAT;
    options.wrapT = gl.MIRRORED_REPEAT;
    options.wrapR = gl.MIRRORED_REPEAT;
    options.anisotropy = 16;
    options.mipmaps = true;
    return options;
}

/*
******************************************************************	
********************** MATERIAL **********************************
******************************************************************
*/


STK.Material.Textures = {};
STK.Material.Samplers = {};

STK.Material.createTexture = function(texName, path, textureOptions, samplerOptions){
    STK.Material.Textures[texName] = null;
	loadImage(path, function(image){
		var gl = STK.Board.Context;
		var fill = function(data, textureOptions, mipmaps){
			gl.texImage2D(gl.TEXTURE_2D, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data);
			if(mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
		};
		
	    STK.Material.Textures[texName] = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, STK.Material.Textures[texName]);
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
STK.Material.createColorTexture = function(texName, intColor,textureOptions, samplerOptions){
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
    STK.Material.Textures[texName] = texObj;
}

STK.Material.createRenderTexture = function(texName){
    STK.Material.Textures[texName] = null;
    const targetTextureWidth = STK.Board.Canvas.width;
    const targetTextureHeight = STK.Board.Canvas.height;
    var gl = STK.Board.Context;
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
    
    STK.Material.Textures[texName] = targetTexture;
};
STK.Material.createDepthTexture = function(texName){
    STK.Material.Textures[texName] = null;
    // create a depth texture
    const targetTextureWidth = STK.Board.Canvas.width;
    const targetTextureHeight = STK.Board.Canvas.height;
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
    
    STK.Material.Textures[texName] = depthTexture;
};

STK.Material.createCubemap = function(texName, path, textureOptions, samplerOptions){
    STK.Material.Textures[texName] = null;
	loadCubemap(path, '.jpg', function(sides){
		var gl = STK.Board.Context;
		var fill = function(data, textureOptions, mipmaps){
			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['posx']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['negx']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['posy']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['negy']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['posz']);
		    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, textureOptions.format, textureOptions.internalFormat, textureOptions.dataType, data['negz']);
		    if(mipmaps == true) gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		}
	    STK.Material.Textures[texName] = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_CUBE_MAP, STK.Material.Textures[texName]);
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

STK.Material.createFloat32Cubemap = function(texName, path, maxMip, textureOptions, samplerOptions){
    STK.Material.Textures[texName] = null;
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

        var gl = STK.Board.Context;
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

        STK.Material.Textures[texName] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, STK.Material.Textures[texName]);
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

STK.Material.createDDSTexture = function(texName, path, textureOptions, samplerOptions){
    STK.Material.Textures[texName] = null;
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
        var gl = STK.Board.Context;
        STK.Material.Textures[texName] = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, STK.Material.Textures[texName]);
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

STK.Material.createSampler = function(name, samplerOptions){
    STK.Material.Samplers[name] = null;
	var gl = STK.Board.Context;
	var sbo = gl.createSampler();
	gl.samplerParameteri(sbo, gl.TEXTURE_MIN_FILTER, samplerOptions.min_filter);
	gl.samplerParameteri(sbo, gl.TEXTURE_MAG_FILTER, samplerOptions.mag_filter);
	gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_S, samplerOptions.wrapS);
	gl.samplerParameteri(sbo, gl.TEXTURE_WRAP_T, samplerOptions.wrapT);
	STK.Material.Samplers[name] = sbo;
	//Anisotropic filtering does not work with sampler objects
	// var ext = gl.getExtension('EXT_texture_filter_anisotropic');
    // gl.samplerParameterf(sbo, ext.TEXTURE_MAX_ANISOTROPY_EXT, 16.);
};

STK.Geometry.texturesLoaded = function(){
    for(var asset in STK.Material.Textures){
        if(STK.Material.Textures.hasOwnProperty(asset)){
            if(STK.Material.Textures[asset] == null){
                return false;
            }
        }
    }
    return true;
}
