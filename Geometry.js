STK.Geometry = function(id){
	this.userID = id;
	this.guid = generateUUID();
	this.data = {};
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
		for(var i = 0 ; i < arguments.length; i+=2){
			this.data[arguments[i]] = arguments[i+1]
		}
	},

	makeVAO: function(){
		var gl = STK.Board.Context;
		var vertex_buffer = gl.createBuffer();

		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data['positions']), gl.STATIC_DRAW);
		// Unbind the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		var uv_buffer = gl.createBuffer();
		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data['uvs']), gl.STATIC_DRAW);
		// Unbind the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Create an empty buffer object to store Index buffer
		var index_Buffer = gl.createBuffer();
		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
		// Pass the vertex data to the buffer
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data['indices']), gl.STATIC_DRAW);
		// Unbind the buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		this.vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		// Bind vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); 
		// Bind vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
	 	gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0); 
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
		gl.bindVertexArray(null);

		return this.vao;
	},

}