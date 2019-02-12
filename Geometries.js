/*
******************************************************************	
********************** MATERIAL **********************************
******************************************************************
*/

STK.Geometry.Models = {};

STK.Geometry.createIndexedModel = function(modelName, path, callback){
	STK.Geometry.Models[modelName] = null;
	loadIndexedObj(path, function(obj){
		var gl = STK.Board.Context;
		var attributeCount = obj.vertices.length/3;
		var uvs = (obj.textures.length == 0 ? Array.apply(null, Array(attributeCount*2)).map(Number.prototype.valueOf,0) : obj.textures);
		var geometry = new STK.Geometry(modelName, 'positions', obj.vertices, 
												   'uvs', uvs, 
												   'normals', obj.vertexNormals, 
												   'indices', obj.indices);
		
	    // geometry.createGL();
	    STK.Geometry.Models[modelName] = geometry;
	    callback(geometry);
	});
};

STK.Geometry.createIndexedModelGLTF = function(modelName, path, callback){
	STK.Geometry.Models[modelName] = null;
	if(this.glTFLoader == null){
		this.glTFLoader = new MinimalGLTFLoader.glTFLoader(STK.Board.Context);
	}
	this.glTFLoader.loadGLTF(path, function(glTF){
    console.warn("# Loaded glTF # ", glTF);

    var parse = function(node, mat){
	    for(var i = 0 ; i < node.children.length; i++){
	    	var _node = node.children[i];
	    	var _mat = mat4.multiply([], mat, _node.matrix);
	    	if(_node.children.length > 0)
	    		parse(_node, _mat);
	    	var mesh = _node.mesh;
	    	if(mesh != null){
			    var primitive = mesh.primitives[0];
			    var attributeData = primitive.attributes;
			    var indexAccessor = primitive.indices;
			    var geom = new STK.Geometry(
			    	mesh.name, 
			    	'positions', attributeData['POSITION'].bufferView.data, 
			    	'uvs', attributeData['TEXCOORD_0'] != undefined ? attributeData['TEXCOORD_0'].bufferView.data : undefined, 
			    	'normals', attributeData['NORMAL'].bufferView.data, 
			    	'indices', glTF.accessors[indexAccessor].bufferView.data);
			    geom.createGL(16);
			    geom.aabb = geom.AABB(_mat);
			    geom.modelMatrix = _mat;
			    carMeshes.push(geom);
			    carModels.push(_mat);
			}
		}
	};
	parse(glTF.nodes[0], mat4.translate([], mat4.create(), vec3.fromValues(0,-0.45,0)));
	init.bind(scope)();
	window.requestAnimationFrame(scope.update);
});
};

STK.Geometry.createIndexedProceduralModel = function(modelName, shape, callback){
	STK.Geometry.Models[modelName] = null;
	var gl = STK.Board.Context;
	var geometry = new STK.Geometry(modelName, 'positions', shape.vertices, 
											   'uvs', shape.uvs, 
											   'normals', shape.normals, 
											   'indices', shape.indices);
	
    // geometry.createGL();
    STK.Geometry.Models[modelName] = geometry;
    callback(geometry);
};

STK.Geometry.geometriesLoaded = function(){
	for(var asset in STK.Geometry.Models){
		if(STK.Geometry.Models.hasOwnProperty(asset)){
			if(STK.Geometry.Models[asset] == null){
				return false;
			}
		}
	}
	return true;
}