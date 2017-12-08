var canvas = document.getElementById('glCanvas');
 controls = createControllerEntity();
 controls.bindInput(canvas);
 gl = canvas.getContext('webgl2');

var projection = mat4.perspective([], Math.PI/3, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
var view = mat4.create();
var model = mat4.translate([], mat4.create(), vec3.fromValues(0,0,0));

 function init(){
 	this.board = new STK.Board(gl);
 	this.shape = Torus(1.0, 0.4);
 	this.geometry = new STK.Geometry('Torus', 'positions', shape.vertices, 'uvs', shape.uvs, 'indices', shape.indices);
 	this.material = new STK.Material(vertSrc, fragSrc);
 	this.drawContext = new STK.DrawContext(canvas.width, canvas.height);

 	// this.pawn = new STK.GPawn(geometry, material, drawContext);
 	// this.vao = geometry.createVAO();
 	geometry.createGL();
 	this.ubo = material.createUBO(16*3, 'Transform_data', 0);
 	this.sbo = material.createSBO();

 	loadImage('assets/textures/metal1.jpg', function(image){
		samplerObject = gl.createSampler();
		gl.samplerParameteri(samplerObject, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.samplerParameteri(samplerObject, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.samplerParameteri(samplerObject, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.samplerParameteri(samplerObject, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	    this.tao = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, this.tao);
	    // Upload the image into the texture.
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    gl.generateMipmap(gl.TEXTURE_2D);
	    gl.bindTexture(gl.TEXTURE_2D, null);
	}.bind(this));

 	this.textureLocation = gl.getUniformLocation(this.material.program,'albedo');
 }

var large = 1.0;
var small = 0.4;
 function update(){
 	controls.update();

 	this.drawContext.set();

 	gl.useProgram(this.material.program);

	gl.bindVertexArray(geometry.handles['vao']);
	 
	
 	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.tao);
	gl.bindSampler(0, this.sbo);

	var g = Torus(large, small);
	geometry.updateGL({
		glHandleID: 'vbo_positions', 
		glType: gl.ARRAY_BUFFER, 
		glMode: gl.STATIC_DRAW,
		data: g.vertices,
		offset: 0,
		size: g.vertices.length
	});
	large += 0.01;
	small += 0.01;
	gl.bindBuffer(gl.UNIFORM_BUFFER, this.ubo);
	gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array(projection), 0, 16);
	gl.bufferSubData(gl.UNIFORM_BUFFER, 16*4, new Float32Array(model), 0, 16);
	gl.bufferSubData(gl.UNIFORM_BUFFER, 32*4, new Float32Array(controls.out), 0, 16);
	gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	 
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.ubo);
	gl.uniform1i(this.textureLocation, 0);
	gl.drawElements(gl.TRIANGLES, this.shape.indices.length, gl.UNSIGNED_SHORT,0);

 	window.requestAnimationFrame(update);
 }

 init.bind(this)();
 window.requestAnimationFrame(update);