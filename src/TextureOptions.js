/*
******************************************************************	
********************** OPTIONS ***********************************
******************************************************************
*/

var TextureOptions = function(){
    this.type = null;
    this.format = null;
    this.dataType = null;
    this.internalFormat = null;
}

TextureOptions.prototype = {

    constructor: TextureOptions,
}

TextureOptions.new = function(gl, params){
    var options = new TextureOptions();
    options.type = params.type;
    options.format = params.format;
    options.internalFormat = params.internalFormat;
    options.dataType = params.dataType;
    return options;
};

TextureOptions.texture_rgba_Options = function(gl){
    var options = new TextureOptions();
    options.type = gl.TEXTURE_2D;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}

TextureOptions.texture_srgb_Options = function(gl){
    var options = new TextureOptions();
    options.type = gl.TEXTURE_2D;
    options.format = gl.SRGB;
    options.internalFormat = gl.RGB;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}


TextureOptions.cubemap_rgba_Options = function(gl){
    var options = new TextureOptions();
    options.type = gl.TEXTURE_CUBE_MAP;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}


TextureOptions.cubemap_srgb_Options = function(gl){
    var options = new TextureOptions();
    options.type = gl.TEXTURE_CUBE_MAP;
    options.format = gl.SRGB;
    options.internalFormat = gl.RGB;
    options.dataType = gl.UNSIGNED_BYTE;
    return options;
}

TextureOptions.cubemap_float32_Options = function(gl){
    var options = new TextureOptions();
    options.type = gl.TEXTURE_CUBE_MAP;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA32F;
    options.dataType = gl.FLOAT;
    return options;
}

TextureOptions.texture_RG32_Options = function(gl){
    var options = new TextureOptions();
    options.type = gl.TEXTURE_2D;
    options.format = gl.RGBA;
    options.internalFormat = gl.RGBA32F;
    options.dataType = gl.FLOAT;
    return options;
}

export default TextureOptions;