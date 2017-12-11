var canvas = document.getElementById('glCanvas');
 controls = createControllerEntity();
 controls.bindInput(canvas);
 gl = canvas.getContext('webgl2');

var projection = mat4.perspective([], Math.PI/3, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100);
var view = mat4.create();
var model = mat4.translate([], mat4.create(), vec3.fromValues(0,0,0));

var ubo = null;
var sbo = null;

 function init(){
 	this.board = new STK.Board(gl);
 	this.shape = Torus(1.0, 0.4);
 	this.geometry = new STK.Geometry('Torus', 'positions', shape.vertices, 'uvs', shape.uvs, 'indices', shape.indices);
 	this.material = new STK.Material('Mat', vertSrc, fragSrc);
 	this.drawContext = new STK.DrawContext(canvas.width, canvas.height);

 	geometry.createGL();
 	ubo = material.createGL('Transform_data', 16*3);
 	material.bindGL(0, 'Transform_data');
 	material.updateGL(ubo, 0, projection);
 	material.updateGL(ubo, 16, model);
 	material.updateGL(ubo, 32, view);

 	material.createTexture('metal', 'assets/textures/metal1.jpg', 'albedo');
 	sbo = material.createSampler();
 
 }

var large = 1.0;
var small = 0.4;
 function update(){
 	controls.update();
 	//Set context
 	this.drawContext.set();

 	//Use material's program
 	gl.useProgram(this.material.program);

 	//Bind Geometry's VAO
	gl.bindVertexArray(geometry.handles['vao']);
	//Bind the named texture handle to the texture unit, bind the SBO, and texture uniform location
	material.bindTexture(gl.TEXTURE0, 'metal', sbo, 'albedo');
 	//Update view matrix in the UBO
 	material.updateGL(ubo, 32, controls.out);
 	//Bind UBO
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);
	//Draw
	gl.drawElements(gl.TRIANGLES, this.shape.indices.length, gl.UNSIGNED_SHORT,0);

 	window.requestAnimationFrame(update);
 }

 init.bind(this)();
 window.requestAnimationFrame(update);