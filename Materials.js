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


STK.SamplerOptions = function(){
    this.min_filter = null;
    this.mag_filter = null;
    this.wrapS = null;
    this.wrapT = null;
    this.anisotropy = null;
    this.mipmaps = null;
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

/*
******************************************************************	
********************** MATERIAL **********************************
******************************************************************
*/


STK.Material.Textures = {};
STK.Material.Samplers = {};

STK.Material.createTexture = function(texName, path, textureOptions, samplerOptions){
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
    			gl.samplerParameterf(textureOptions.type, ext.TEXTURE_MAX_ANISOTROPY_EXT, samplerOptions.anisotropy);
			}
	    }
	    gl.bindTexture(gl.TEXTURE_2D, null);
	});
};

STK.Material.createCubemap = function(texName, path, textureOptions, samplerOptions){
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
    			gl.samplerParameterf(textureOptions.type, ext.TEXTURE_MAX_ANISOTROPY_EXT, samplerOptions.anisotropy);
			}
	    }
	    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}.bind(this));
};

STK.Material.createSampler = function(name, samplerOptions){
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