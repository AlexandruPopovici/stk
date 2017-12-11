var canvas = document.getElementById('glCanvas');
 controls = createControllerEntity();
 controls.bindInput(canvas);
 gl = canvas.getContext('webgl2');

var projection = mat4.perspective([], Math.PI/3, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
var view = mat4.create();
var model = mat4.translate([], mat4.create(), vec3.fromValues(0,0,0));
var planeModel = mat4.translate([], mat4.create(), vec3.fromValues(0,-0.45,0));
var ubo_vertex_transform = null;
var ubo_texture_transform = null;
var sbo1 = null;
var sbo2 = null;

 function init(){
 	this.board = new STK.Board(gl);
 	this.torusShape = Torus(1.0, 0.4);
 	this.planeShape = Plane(1000, 1000, 1, 1);
 	this.geometry = new STK.Geometry('Torus', 'positions', torusShape.vertices, 'uvs', torusShape.uvs, 'indices', torusShape.indices);
 	this.planeGeometry = new STK.Geometry('Plane', 'positions', planeShape.vertices, 'uvs', planeShape.uvs, 'indices', planeShape.indices);
 	this.material = new STK.Material('Mat', vertSrc, fragSrc);
 	this.drawContext = new STK.DrawContext(canvas.width, canvas.height);

 	geometry.createGL();
 	planeGeometry.createGL();
 	//Create vertex transform UBO
 	ubo_vertex_transform = material.createGL('Vertex_Transform_data', 16*3);
 	material.bindGL(0, 'Vertex_Transform_data');
 	material.updateGL(ubo_vertex_transform, 0, projection);
 	material.updateGL(ubo_vertex_transform, 16, model);
 	material.updateGL(ubo_vertex_transform, 32, view);

 	//Create texture transform UBO
 	ubo_texture_transform = material.createGL('Texure_Transform_data', 4);
 	material.bindGL(1, 'Texture_Transform_data');
 	material.updateGL(ubo_texture_transform, 0, new Float32Array(vec4.fromValues(1,1,0,0)));

 	material.createTexture('metal', 'assets/textures/metal1.jpg', 'albedo');
 	material.createTexture('ground', 'assets/textures/checkerboard texture.jpg', 'albedo');
 	sbo1 = material.createSampler({wrapS: gl.CLAMP_TO_EDGE, wrapT: gl.CLAMP_TO_EDGE});
 	sbo2 = material.createSampler({wrapS: gl.REPEAT, wrapT: gl.REPEAT});
 
 }

var large = 1.0;
var small = 0.4;
 function update(){
 	controls.update();
 	//Set context
 	this.drawContext.set();

 	//Use material's program
 	gl.useProgram(this.material.program);

 	//Bind torus Geometry's VAO
	gl.bindVertexArray(geometry.handles['vao']);
	//Bind the named texture handle to the texture unit, bind the SBO, and texture uniform location
	material.bindTexture(gl.TEXTURE0, 'metal', sbo1, 'albedo');
 	//Update view matrix in the UBO
 	material.updateGL(ubo_vertex_transform, 16, model);
 	material.updateGL(ubo_vertex_transform, 32, controls.out);
 	material.updateGL(ubo_texture_transform, 0, vec4.fromValues(1,1,0,0));
 	//Bind UBO
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo_vertex_transform);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, ubo_texture_transform);
	//Draw torus
	gl.drawElements(gl.TRIANGLES, this.torusShape.indices.length, gl.UNSIGNED_SHORT,0);

	//Bind plane Geometry's VAO
	gl.bindVertexArray(planeGeometry.handles['vao']);
	material.updateGL(ubo_vertex_transform, 16, planeModel);
	material.updateGL(ubo_texture_transform, 0, vec4.fromValues(32,32,0,0));
	material.bindTexture(gl.TEXTURE0, 'ground', sbo2, 'albedo');
	//Draw plane
	gl.drawElements(gl.TRIANGLES, this.planeShape.indices.length, gl.UNSIGNED_SHORT,0);
 	window.requestAnimationFrame(update);
 }

 init.bind(this)();
 window.requestAnimationFrame(update);