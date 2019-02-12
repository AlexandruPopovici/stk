import STK from './stk.js'

var canvas = document.getElementById('glCanvas');
 controls = createControllerEntity();
 controls.bindInput(canvas);
 var gl = canvas.getContext('webgl2', { alpha: false });
var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '30px';
stats.domElement.style.left = '50px';
stats.domElement.style.zIndex = 100;
stats.domElement.style.transform = 'scale(' + 2 + ')';
stats.domElement.style['-o-transform'] = 'scale(' + 2 + ')';
stats.domElement.style['-webkit-transform'] = 'scale(' + 2 + ')';
stats.domElement.style['-moz-transform'] = 'scale(' + 2 + ')';
window.document.body.appendChild( stats.domElement );

var projection = mat4.perspective([], Math.PI/3, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 1000);
var view = mat4.create();
var model = mat4.translate([], mat4.create(), vec3.fromValues(0,0,0));
var scaledModel = mat4.scale([], model, vec3.fromValues(1,1,1));
var modelView = mat4.create();
var normalMatrix = mat3.create();
var planeModel = mat4.rotateX([], mat4.translate([], mat4.create(), vec3.fromValues(0,-0.45,0)), -Math.PI);
var ubo_vertex_transform = null;
var ubo_texture_transform = null;
var sbo1 = null;
var sbo2 = null;
var carMeshes = [];
var carModels = []
var excludeMeshes = ["Car Front Door 01 Window", "Car Front Door 02 Window", "Car Rear Door 01 Window", "Car Rear Door 02 Window"];
var onlyMeshes = [
	"Car Body",
	"Car Windows",
	"Car Plastic",
	"Car Metal",
	"Car Front Logo Metal",
	"Car Rear Logo",
	"Car Rear number",
	"Car Rear number Metal",
	"Car Rear number Plastic",
	"Car Front number Plastic",
	"Car Rear Quattro Metal",
	"Car Front number Metal",
	"Car Front number",
	"Car Headlight Lamps",
	"Car Front Logo Plastic",
	"Car Bottom",
	"Car Muffler",
	"Car Rear A4 Text",
	"Car Rear Quattro Plastic",
	"Car Wiper 01",
	"Car Wiper 02",
	"Car Headlight Glass",
	"Car Headlight Chrome",
	"Car Headlights",
	"Car Tail Light Red Glass",
	"Car Tail Lights",
	"Car Tail Light Chrome 02",
	"Car Tail Light Chrome 01",
	"Car Front Door 01 Body",
	"Car Front Door 01 Window",
	"Car Front Door 01 Plastic",
	"Car Front Door 01 Light Glass",
	"Car Front Door 01 Mirror",
	"Car Front Door 01 Light Chrome",
	"Car Front Door 01 Metal",
	"Car Front Door 02 Body",
	"Car Front Door 02 Window",
	"Car Front Door 02 Plastic",
	"Car Front Door 02 Light Glass",
	"Car Front Door 02 Mirror",
	"Car Front Door 02 Light Chrome",
	"Car Front Door 02 Metal",
	"Car Rear Door 01 Body",
	"Car Rear Door 01 Window",
	"Car Rear Door 01 Plastic",
	"Car Rear Door 01 Light Glass",
	"Car Rear Door 01 Mirror",
	"Car Rear Door 01 Light Chrome",
	"Car Rear Door 01 Metal",
	"Car Rear Door 02 Body",
	"Car Rear Door 02 Window",
	"Car Rear Door 02 Plastic",
	"Car Rear Door 02 Light Glass",
	"Car Rear Door 02 Mirror",
	"Car Rear Door 02 Light Chrome",
	"Car Rear Door 02 Metal",
	"Car Wheel 01 Caliper",
	"Car Wheel 01 Break Disk",
	"Car Wheel 01 Metal",
	"Car Wheel 01 Tire",
	"Car Wheel 01 Bolts",
	"Car Wheel 01 Rim",
	"Car Wheel 01 Plastic",
	"Car Wheel 01 Logo",
	"Car Wheel 01 Metal2",
	"Car Wheel 02 Caliper",
	"Car Wheel 02 Break Disk",
	"Car Wheel 02 Metal",
	"Car Wheel 02 Tire",
	"Car Wheel 02 Bolts",
	"Car Wheel 02 Rim",
	"Car Wheel 02 Plastic",
	"Car Wheel 02 Logo",
	"Car Wheel 02 Metal2",
	"Car Wheel 03 Caliper",
	"Car Wheel 03 Break Disk",
	"Car Wheel 03 Metal",
	"Car Wheel 03 Tire",
	"Car Wheel 03 Bolts",
	"Car Wheel 03 Rim",
	"Car Wheel 03 Plastic",
	"Car Wheel 03 Logo",
	"Car Wheel 03 Metal2",
	"Car Wheel 04 Caliper",
	"Car Wheel 04 Break Disk",
	"Car Wheel 04 Metal",
	"Car Wheel 04 Tire",
	"Car Wheel 04 Bolts",
	"Car Wheel 04 Rim",
	"Car Wheel 04 Plastic",
	"Car Wheel 04 Logo",
	"Car Wheel 04 Metal2",
];

var carPaintMeshes = [
	"Car Body",
	"Car Front Door 01 Body",
	"Car Front Door 02 Body",
	"Car Rear Door 01 Body",
	"Car Rear Door 02 Body"
];

this.board = new STK.Board(canvas, gl);
var glTFLoader = new MinimalGLTFLoader.glTFLoader(gl);
var scope = this;
glTFLoader.loadGLTF("assets/Audi.gltf", function(glTF){
    console.warn(glTF);

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
			    geom.modelMat = _mat;
			    carMeshes.push(geom);
			    carModels.push(_mat);
			}
		}
	};
	parse(glTF.nodes[0], mat4.translate([], mat4.create(), vec3.fromValues(0,-0.45,0)));
	init.bind(scope)();
	window.requestAnimationFrame(scope.update);
});

 function init(){
	
 	this.board = new STK.Board(canvas, gl);
 	this.torusShape = Torus(1.0, 0.4);
 	this.planeShape = Plane(10, 10, 1, 1);
 	this.fsQuadShape = FSQuad();

 	this.torusGeometry = new STK.Geometry('Torus', 'positions', torusShape.vertices, 'uvs', torusShape.textures, 'normals', torusShape.normals, 'indices', torusShape.indices);
 	this.planeGeometry = new STK.Geometry('Plane', 'positions', planeShape.vertices, 'uvs', planeShape.uvs, 'normals', planeShape.normals,'indices', planeShape.indices);
 	this.quadGeometry = new STK.Geometry('FSQuad', 'positions', fsQuadShape.vertices, 'indices', fsQuadShape.indices);
 	
 	this.drawContext = new STK.DrawContext(canvas.width, canvas.height);

 	this.material = new STK.Material('Mat', vertSrc, fragSrc);
 	this.indirectMaterial = new STK.Material('Indirect', indirect_vert, indirect_frag);
 	this.skyBoxMaterial = new STK.Material('Skybox', skybox_vert, skybox_frag);
 	this.carPaintMaterial = new STK.Material('Car', layeredBRDF_vert, layeredBRDF_frag);
	this.carFlatMaterial = new STK.Material('CarFlat', flatVertSrc, flatFragSrc);

 	// torusGeometry.createGL();
 	planeGeometry.createGL(16);
 	quadGeometry.createGL(16);

 	//Create vertex transform UBO
 	// ubo_vertex_transform = material.createGL('Vertex_Transform_data', 16*5 + 4);
 	ubo_vertex_transform = new STK.UniformBlock('Vertex_Transform_data');
 	ubo_vertex_transform.createGL( 16*6 + 4 );
 	material.bindGL(0, 'Vertex_Transform_data');
 	indirectMaterial.bindGL(0, 'Vertex_Transform_data');
 	skyBoxMaterial.bindGL(0, 'Vertex_Transform_data');
	this.carPaintMaterial.bindGL(0, 'Vertex_Transform_data');
	this.carFlatMaterial.bindGL(0, 'Vertex_Transform_data');

 	//Create texture transform UBO
 	ubo_texture_transform = new STK.UniformBlock('Texure_Transform_data');
 	ubo_texture_transform.createGL( 4 );
 	material.bindGL(1, 'Texture_Transform_data');
	indirectMaterial.bindGL(1, 'Texture_Transform_data');
	this.carPaintMaterial.bindGL(1, 'Texture_Transform_data');

 	//GROUND
 	var sampler_options_mipmaps_only = STK.SamplerOptions.texture_mipmaps_only(gl);
 	var texture_options_ground = STK.TextureOptions.texture_rgba_Options(gl);
 	var sampler_options_ground = STK.SamplerOptions.texture_mips_Sampler(gl);
 	STK.Material.createTexture('ground_tex', 'assets/textures/checkerboard texture.jpg', texture_options_ground, sampler_options_mipmaps_only);
 	STK.Material.createSampler('ground_sampler', sampler_options_ground);

 	//SKYBOX
 	var texture_options_skybox = STK.TextureOptions.cubemap_rgba_Options(gl);
 	var sampler_options_skybox = STK.SamplerOptions.texture_linear_Sampler(gl).amend('anisotropy', null);
 	// STK.Material.createCubemap('environment', 'assets/textures/LancellottiChapel', texture_options_skybox, sampler_options_skybox);
 	STK.Material.createCubemap('environment', 'assets/textures/LancellottiChapel_512', texture_options_skybox, sampler_options_skybox);
 	//Sampler objects don't seem to work with cubemaps
	 // STK.Material.createSampler('skybox_sampler', sampler_options_skybox);
	 
	var texture_options_normals = STK.TextureOptions.texture_rgba_Options(gl);
 	var sampler_options_normals = STK.SamplerOptions.texture_linear_Sampler(gl);
 	STK.Material.createTexture('sparkles_normals', 'assets/textures/512x512 Normalmap Resampling.png', texture_options_normals, sampler_options_normals);
	STK.Material.createSampler('sparkles_sampler', sampler_options_normals);

 }

function updateGlobals(){
	controls.update();
	mat4.copy(view, controls.out);
	var invProj = mat4.invert([], projection)
	// this.material.updateGL(ubo_vertex_transform, 0, projection);
	// this.material.updateGL(ubo_vertex_transform, 32, view);
	// this.material.updateGL(ubo_vertex_transform, 80, controls.pos3);
	ubo_vertex_transform.updateGL_batch( { offset: 0, data: projection },
					 					 { offset: 32, data: view },
					 					 { offset: 80, data: invProj },
					 					 { offset: 96, data: controls.pos3 });
}

function updateLocals(imm_model){
	mat4.multiply(modelView, view, imm_model);
	mat3.normalFromMat4(normalMatrix, modelView);
	// this.material.updateGL(ubo_vertex_transform, 16, imm_model);
 // 	this.material.updateGL(ubo_vertex_transform, 48, modelView);
 // 	this.material.updateGL(ubo_vertex_transform, 64, normalMatrix);
 	ubo_vertex_transform.updateGL_batch( { offset: 16, data: imm_model },
					 					 { offset: 48, data: modelView },
					 					 { offset: 64, data: normalMatrix });
}

function sortFn(g0, g1){
	if(g0.userID == "Car Body")
		return -1;
	if(g1.userID == "Car Body")
		return 1;
	var p0 = g0.aabb.center;
	var p1 = g1.aabb.center;
	var d0 = vec3.squaredDistance(p0, controls.pos3);
	var d1 = vec3.squaredDistance(p1, controls.pos3);
	if(d0 < d1) return -1;
	if(d0 > d1) return 1;
	return 0;
}

 function update(){
 	stats.update();
 	updateGlobals();
 	// carMeshes.sort(sortFn);

 	//Set context
 	this.drawContext.set();

 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo_vertex_transform.handle);
 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, ubo_texture_transform.handle);

 	//SKYBOX
 	updateLocals(model);
 	gl.disable(gl.DEPTH_TEST);
 	gl.useProgram(this.skyBoxMaterial.program);
 	quadGeometry.bindGL();
 	skyBoxMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'environment', null, 'environment');
 	gl.drawElements(gl.TRIANGLES, this.fsQuadShape.indices.length, gl.UNSIGNED_SHORT,0);
 	gl.enable(gl.DEPTH_TEST);
 	gl.enable(gl.CULL_FACE);
 	gl.cullFace(gl.BACK);

 	// console.warn("################")
 	for(var k = 0 ; k < carMeshes.length; k++){
		var mesh = carMeshes[k];
		var material;
		if(carPaintMeshes.includes(mesh.userID)){
			material = this.carPaintMaterial; 
			gl.useProgram(material.program);
			material.bindTexture(gl.TEXTURE_2D, gl.TEXTURE2, 'sparkles_normals', 'sparkles_sampler', 'normalMap');
		}
		else{
			material = this.carFlatMaterial;
			gl.useProgram(material.program);
			material.bindTexture(gl.TEXTURE_2D, gl.TEXTURE0, 'ground_tex', 'ground_sampler', 'albedo');
			material.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'environment', null, 'environment');
		}
 		// console.warn(mesh.userID);
 		// if(excludeMeshes.includes(mesh.userID))
 		// 	continue;
 		// if(!onlyMeshes.includes(mesh.userID))
 		// 	continue;
 		var indicesCount = mesh.indicesCount(16);
	 	updateLocals(mesh.modelMat);
	 	gl.useProgram(material.program);
	 	mesh.bindGL();
	 	ubo_texture_transform.updateGL( 0, vec4.fromValues(8,8,0,0));
		gl.drawElements(gl.TRIANGLES, indicesCount, gl.UNSIGNED_SHORT, 0);
	}

	//PLANE
	updateLocals(planeModel);
	gl.useProgram(this.material.program);
	planeGeometry.bindGL();
	ubo_texture_transform.updateGL( 0, vec4.fromValues(8,8,0,0));
	material.bindTexture(gl.TEXTURE_2D, gl.TEXTURE0, 'ground_tex', 'ground_sampler', 'albedo');
	gl.drawElements(gl.TRIANGLES, planeShape.indices.length, gl.UNSIGNED_SHORT,0);

 	window.requestAnimationFrame(update);
 }

// var oReq = new XMLHttpRequest();
// var scope = this;
// oReq.addEventListener("load", function(){
// 	loadedMesh = new OBJ.Mesh(oReq.responseText);
// 	init.bind(scope)();
//  	window.requestAnimationFrame(scope.update);
// });
// oReq.open("GET", "assets/models/Wolf.obj");
// oReq.send();
 