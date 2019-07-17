/*
******************************************************************	
********************** MATERIAL **********************************
******************************************************************
*/

STK.Geometry.Models = {};

STK.Geometry.createIndexedModel2 = function(modelName, path, callback){
	STK.Geometry.Models['angel'] = [];
	loadIndexedObj2(modelName, path, function(mesh){
		for(var k in mesh){
			if(mesh.hasOwnProperty(k)){
				var obj = mesh[k];
				var gl = STK.Board.Context;
				var attributeCount = obj.vertices.length/3;
				var uvs = (obj.textures.length == 0 ? Array.apply(null, Array(attributeCount*2)).map(Number.prototype.valueOf,0) : obj.textures);
				var geometry = new STK.Geometry(modelName, 'positions', obj.vertices, 
														'uvs', uvs, 
														'normals', obj.vertexNormals, 
														'indices', obj.indices);
				
				// geometry.createGL();
				STK.Geometry.Models['angel'].push(geometry);
				callback(geometry);
			}
		}
	});
};

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