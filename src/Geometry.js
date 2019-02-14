var Geometry = function(id){
	this.userID = id;
	this.guid = generateUUID();
	this.data = {};
	this.handles = {};
	this.modelMatrix = mat4.create();
	this.indicesType = gl.UNSIGNED_SHORT;
	this._init(arguments);
	return this.guid;
};

Geometry.prototype = {

	constructor: Geometry,

	/**
	* Initialises the data
	*
	* @param {arguments} Variable number of arguments in the repeating form of(name:string, data:array, etc)
	*/
	_init: function(...args){
		for(var i = 1 ; i < args[0].length; i+=2){
			this.data[args[0][i]] = args[0][i+1]
		}
	},

	_checkHandles: function(){
		for(var handle in this.handles){
			if(this.handles.hasOwnProperty(handle)){
				if(this.handles[handle] == undefined)
					console.error("Handle -> ", handle, ' is invalid!');
			}
		}
	},

	createGL: function(gl, indicesType){
		this.indicesType = indicesType;
		var vertex_buffer = gl.createBuffer();

		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data['positions']), gl.STATIC_DRAW);
		// Unbind the buffer
		this.handles['vbo_positions'] = vertex_buffer;

		if(this.data['uvs'] != undefined && (this.data['uvs'].length > 0 || this.data['uvs'].byteLength > 0)){
			var uv_buffer = gl.createBuffer();
			// Bind appropriate array buffer to it
			gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
			// Pass the vertex data to the buffer
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data['uvs']), gl.STATIC_DRAW);
			// Unbind the buffer
			this.handles['vbo_uvs'] = uv_buffer;
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}

		var normal_buffer = gl.createBuffer();
		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data['normals']), gl.STATIC_DRAW);
		// Unbind the buffer
		this.handles['vbo_normals'] = normal_buffer;
		

		// Create an empty buffer object to store Index buffer
		var index_Buffer = gl.createBuffer();
		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesType == gl.UNSIGNED_SHORT ? new Uint16Array(this.data['indices']) : new Uint32Array(this.data['indices']), gl.STATIC_DRAW);
		// Unbind the buffer
		this.handles['ibo'] = index_Buffer;


		var vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		// Bind vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); 
		// Bind vertex buffer object
		if(this.data['uvs'] != undefined && (this.data['uvs'].length > 0 || this.data['uvs'].byteLength > 0)){
			gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
		 	gl.enableVertexAttribArray(1);
			gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0); 
		}
		// Bind vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
		gl.enableVertexAttribArray(2);
		gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 0, 0); 

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
		gl.bindVertexArray(null);
		this.handles['vao'] = vao;

		this._checkHandles();
	},

	/**
	params = {
			glHandleID: 'id',
			glType: int,
			glMode: int,
			data: [],
			offset,
			size
		}
	*/
	updateGL: function(gl, params){
		gl.bindBuffer(params.glType, this.handles[params.glHandleID]);
		if(params.size - params.offset < params.size){
			gl.bufferSubData(params.glType, params.offset, new Float32Array(params.data), 0, params.size);
		}
		else{
			gl.bufferData(params.glType, new Float32Array(params.data), params.glMode);
		}
		gl.bindBuffer(params.glType, null);
	},

	bindGL: function(gl){
		gl.bindVertexArray(this.handles['vao']);
	},

	indicesCount: function(){
		return (this.indicesType == gl.UNSIGNED_SHORT ? this.data['indices'].byteLength/2 : this.data['indices'].byteLength/4);
	},

	/*
		Creates a new AABB each time
	*/
	AABB: function (matrix) {
		var minX = + Infinity;
		var minY = + Infinity;
		var minZ = + Infinity;

		var maxX = - Infinity;
		var maxY = - Infinity;
		var maxZ = - Infinity;

		var array = new Float32Array(this.data['positions']);
		for ( var i = 0, l = array.length; i < l; i += 3 ) {

			var x = array[ i ];
			var y = array[ i + 1 ];
			var z = array[ i + 2 ];

			if ( x < minX ) minX = x;
			if ( y < minY ) minY = y;
			if ( z < minZ ) minZ = z;

			if ( x > maxX ) maxX = x;
			if ( y > maxY ) maxY = y;
			if ( z > maxZ ) maxZ = z;

		}
		var min = vec3.fromValues(minX, minY, minZ);
		var max = vec3.fromValues(maxX, maxY, maxZ);
		var center = vec3.scale([], vec3.add([], min, max), 0.5);
		if(matrix != undefined){
			vec3.transformMat4(min, min, matrix);
			vec3.transformMat4(max, max, matrix);
			vec3.transformMat4(center, center, matrix);
		}
		return {min: min , max: max, center: center};
	},

	drawGL(gl, primitiveType, indicesType){
		var glType = indicesType;
		var indicesCount = (indicesType == gl.UNSIGNED_SHORT ? this.data['indices'].byteLength/2 : this.data['indices'].byteLength/4);
		gl.bindVertexArray(this.handles['vao']);
		gl.drawElements(gl.TRIANGLES, indicesCount, glType, 0);
	}

}

export default Geometry;