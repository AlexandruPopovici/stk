var canvas = document.getElementById('glCanvas');
 controls = createControllerEntity();
 controls.bindInput(canvas);
 gl = canvas.getContext('webgl2');

var projection = mat4.perspective([], Math.PI/3, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
var view = mat4.create();
var model = mat4.translate([], mat4.create(), vec3.fromValues(0,0,0));
var modelView = mat4.create();
var normalMatrix = mat3.create();
var planeModel = mat4.translate([], mat4.create(), vec3.fromValues(0,-0.45,0));
var ubo_vertex_transform = null;
var ubo_texture_transform = null;
var sbo1 = null;
var sbo2 = null;

 function init(){
 	this.board = new STK.Board(gl);
 	this.torusShape = Torus(1.0, 0.4);
 	this.planeShape = Plane(10, 10, 1, 1);
 	this.fsQuadShape = FSQuad();

 	this.torusGeometry = new STK.Geometry('Torus', 'positions', torusShape.vertices, 'uvs', torusShape.uvs, 'normals', torusShape.normals, 'indices', torusShape.indices);
 	this.planeGeometry = new STK.Geometry('Plane', 'positions', planeShape.vertices, 'uvs', planeShape.uvs, 'normals', planeShape.normals,'indices', planeShape.indices);
 	this.quadGeometry = new STK.Geometry('FSQuad', 'positions', fsQuadShape.vertices, 'indices', fsQuadShape.indices);
 	
 	this.drawContext = new STK.DrawContext(canvas.width, canvas.height);

 	this.material = new STK.Material('Mat', vertSrc, fragSrc);
 	this.indirectMaterial = new STK.Material('Indirect', indirect_vert, indirect_frag);
 	this.skyBoxMaterial = new STK.Material('Skybox', skybox_vert, skybox_frag);

 	torusGeometry.createGL();
 	planeGeometry.createGL();
 	quadGeometry.createGL();

 	//Create vertex transform UBO
 	ubo_vertex_transform = material.createGL('Vertex_Transform_data', 16*5 + 4);
 	material.bindGL(0, 'Vertex_Transform_data');
 	indirectMaterial.bindGL(0, 'Vertex_Transform_data');
 	skyBoxMaterial.bindGL(0, 'Vertex_Transform_data');

 	//Create texture transform UBO
 	ubo_texture_transform = material.createGL('Texure_Transform_data', 4);
 	material.bindGL(1, 'Texture_Transform_data');
 	indirectMaterial.bindGL(1, 'Texture_Transform_data');

 	//GROUND
 	var sampler_options_mipmaps_only = STK.SamplerOptions.texture_mipmaps_only(gl);
 	var texture_options_ground = STK.TextureOptions.texture_rgba_Options(gl);
 	var sampler_options_ground = STK.SamplerOptions.texture_mips_Sampler(gl);
 	STK.Material.createTexture('ground_tex', 'assets/textures/checkerboard texture.jpg', texture_options_ground, sampler_options_mipmaps_only);
 	STK.Material.createSampler('ground_sampler', sampler_options_ground);

 	//SKYBOX
 	var texture_options_skybox = STK.TextureOptions.cubemap_rgba_Options(gl);
 	var sampler_options_skybox = STK.SamplerOptions.texture_linear_Sampler(gl).amend('anisotropy', null);
 	STK.Material.createCubemap('environment', 'assets/textures/LancellottiChapel', texture_options_skybox, sampler_options_skybox);
 	//Sampler objects don't seem to work with cubemaps
 	// STK.Material.createSampler('skybox_sampler', sampler_options_skybox);
 }

function updateGlobals(){
	controls.update();
	mat4.copy(view, controls.out);
	this.material.updateGL(ubo_vertex_transform, 0, projection);
	this.material.updateGL(ubo_vertex_transform, 32, view);
	this.material.updateGL(ubo_vertex_transform, 80, controls.pos3);
}

function updateLocals(imm_model){
	mat4.multiply(modelView, imm_model, view);
	mat3.normalFromMat4(normalMatrix, model);
	this.material.updateGL(ubo_vertex_transform, 16, imm_model);
 	this.material.updateGL(ubo_vertex_transform, 48, modelView);
 	this.material.updateGL(ubo_vertex_transform, 64, normalMatrix);
}

 function update(){
 	updateGlobals();
 	//Set context
 	this.drawContext.set();

 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo_vertex_transform);
 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, ubo_texture_transform);

 	//SKYBOX
 	updateLocals(model);
 	gl.disable(gl.DEPTH_TEST);
 	gl.useProgram(this.skyBoxMaterial.program);
 	quadGeometry.bindGL();
 	skyBoxMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'environment', null, 'environment');
 	gl.drawElements(gl.TRIANGLES, this.fsQuadShape.indices.length, gl.UNSIGNED_SHORT,0);
 	gl.enable(gl.DEPTH_TEST);

 	//TORUS
 	updateLocals(model);
 	gl.useProgram(this.indirectMaterial.program);
 	torusGeometry.bindGL();
	indirectMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE0, 'ground_tex', 'ground_sampler', 'albedo');
	indirectMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'environment', null, 'environment');
 	indirectMaterial.updateGL(ubo_texture_transform, 0, vec4.fromValues(4,4,0,0));
	gl.drawElements(gl.TRIANGLES, this.torusShape.indices.length, gl.UNSIGNED_SHORT,0);

	//PLANE
	updateLocals(planeModel);
	gl.useProgram(this.material.program);
	planeGeometry.bindGL();
	material.updateGL(ubo_texture_transform, 0, vec4.fromValues(8,8,0,0));
	material.bindTexture(gl.TEXTURE_2D, gl.TEXTURE0, 'ground_tex', 'ground_sampler', 'albedo');
	gl.drawElements(gl.TRIANGLES, this.planeShape.indices.length, gl.UNSIGNED_SHORT,0);
	
 	window.requestAnimationFrame(update);
 }

 init.bind(this)();
 window.requestAnimationFrame(update);