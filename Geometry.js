STK.Geometry = function(id){
	this.userID = id;
	this.guid = generateUUID();
	this.data = {};
	this.handles = {};
	this._init(arguments);
	return this.guid;
}

STK.Geometry.prototype = {

	constructor: STK.Geometry,

	/**
	* Initialises the data
	*
	* @param {arguments} Variable number of arguments in the repeating form of(name:string, data:array, etc)
	*/
	_init: function(arguments){
		for(var i = 1 ; i < arguments.length; i+=2){
			this.data[arguments[i]] = arguments[i+1]
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

	createGL: function(){
		var gl = STK.Board.Context;
		var vertex_buffer = gl.createBuffer();

		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data['positions']), gl.STATIC_DRAW);
		// Unbind the buffer
		this.handles['vbo_positions'] = vertex_buffer;

		var uv_buffer = gl.createBuffer();
		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data['uvs']), gl.STATIC_DRAW);
		// Unbind the buffer
		this.handles['vbo_uvs'] = uv_buffer;

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
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data['indices']), gl.STATIC_DRAW);
		// Unbind the buffer
		this.handles['ibo'] = index_Buffer;

		var vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		// Bind vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); 
		// Bind vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
	 	gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0); 
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
	updateGL: function(params){
		var gl = STK.Board.Context;
		gl.bindBuffer(params.glType, this.handles[params.glHandleID]);
		if(params.size - params.offset < params.size){
			gl.bufferSubData(params.glType, params.offset, new Float32Array(params.data), 0, params.size);
		}
		else{
			gl.bufferData(params.glType, new Float32Array(params.data), params.glMode);
		}
		gl.bindBuffer(params.glType, null);
	},

	bindGL: function(){
		var gl = STK.Board.Context;
		gl.bindVertexArray(this.handles['vao']);
	}

}