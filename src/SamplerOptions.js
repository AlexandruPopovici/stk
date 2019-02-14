var SamplerOptions = function(){
    this.min_filter = null;
    this.mag_filter = null;
    this.wrapS = null;
    this.wrapT = null;
    this.anisotropy = null;
    this.mipmaps = null;
    this.flipY = false;
}

SamplerOptions.prototype = {

    constructor: SamplerOptions,

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

SamplerOptions.texture_mipmaps_only = function(gl){
    var options = new SamplerOptions();
    options.mipmaps = true;
    return options;
};

SamplerOptions.texture_linear_Sampler = function(gl){
    var options = new SamplerOptions();
    options.min_filter = gl.LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.REPEAT;
    options.wrapT = gl.REPEAT;
    options.anisotropy = 16;
    options.mipmaps = null;
    return options;
}

SamplerOptions.texture_nearest_Sampler = function(gl){
    var options = new SamplerOptions();
    options.min_filter = gl.NEAREST;
    options.mag_filter = gl.NEAREST;
    options.wrapS = gl.REPEAT;
    options.wrapT = gl.REPEAT;
    options.anisotropy = null;
    options.mipmaps = null;
    return options;
}

SamplerOptions.texture_mips_Sampler = function(gl){
    var options = new SamplerOptions();
    options.min_filter = gl.LINEAR_MIPMAP_LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.REPEAT;
    options.wrapT = gl.REPEAT;
    options.anisotropy = 16;
    options.mipmaps = true;
    return options;
}

SamplerOptions.cubemap_mips_linear_Sampler = function(gl){
    var options = new SamplerOptions();
    options.min_filter = gl.LINEAR_MIPMAP_LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.MIRRORED_REPEAT;
    options.wrapT = gl.MIRRORED_REPEAT;
    options.wrapR = gl.MIRRORED_REPEAT;
    options.anisotropy = 16;
    options.mipmaps = true;
    return options;
}

SamplerOptions.cubemap_linear_Sampler = function(gl){
    var options = new SamplerOptions();
    options.min_filter = gl.LINEAR;
    options.mag_filter = gl.LINEAR;
    options.wrapS = gl.MIRRORED_REPEAT;
    options.wrapT = gl.MIRRORED_REPEAT;
    options.wrapR = gl.MIRRORED_REPEAT;
    options.anisotropy = 16;
    options.mipmaps = true;
    return options;
}

export default SamplerOptions;