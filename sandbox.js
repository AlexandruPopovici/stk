 function init(){
 	var canvas = document.getElementById('glCanvas');
 	canvas.width = appConfig['screenSize'][0];
 	canvas.height = appConfig['screenSize'][1];
 	controls = createControllerEntity();
 	controls.bindInput(canvas);
 	gl = canvas.getContext('webgl2', { antialias: false});
 	this.board = new STK.Board(canvas, gl);

 	STK.Geometry.createIndexedProceduralModel("Torus", Torus(1.0, 0.4), function(geometry){
 		STK.Geometry.Models['Torus'].createGL();
 	}.bind(this));
 	STK.Geometry.createIndexedProceduralModel("Plane", Plane(20, 20, 1, 1), function(geometry){
 		STK.Geometry.Models['Plane'].createGL();
 	}.bind(this));
 	STK.Geometry.createIndexedProceduralModel("FSQuad", FSQuad(), function(geometry){
 		STK.Geometry.Models['FSQuad'].createGL();
 	}.bind(this));
 	

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
    

 	var assetCheck = function(){
 		if(STK.Geometry.geometriesLoaded() && STK.Geometry.texturesLoaded()){
 			console.warn("FINISHED LOADING ASSETS");
 			start();
 			return;
 		}
 		window.requestAnimationFrame(assetCheck);
 	}

 	console.warn("ASSETS LOADING ...");
 	window.requestAnimationFrame(assetCheck);
 }

var globalTransforms;
var globalUBOs = {};
var Stacks = [];
 function start(){
 	var aabb = STK.Geometry.Models['angel'].AABB();
 	// var d = vec3.distance(aabb.min, aabb.max);
 	// computeNormalThicknessForModel(STK.Geometry.Models['angel']);
 	// return;
 	//Create vertex transform UBO
 	globalUBOs['Vertex_Transform_data'] = new STK.UniformBlock('Vertex_Transform_data');
 	globalUBOs['Vertex_Transform_data'].createGL( 16*6 + 4 );
 	
 	//Create texture transform UBO
 	globalUBOs['Texure_Transform_data'] = new STK.UniformBlock('Texure_Transform_data');
 	globalUBOs['Texure_Transform_data'].createGL( 4 );

 	//Create PBR  UBO
	globalUBOs['PBR_uniforms'] = new STK.UniformBlock('PBR_uniforms');
 	globalUBOs['PBR_uniforms'].createGL( 4 * 3 );
 	globalUBOs['PBR_uniforms'].updateGL_batch(
 		{ offset: 0, data: vec4.fromValues(1,1,1, 1.)},
 		{ offset: 4, data: vec4.fromValues(0.04,0.04,0.04, 1.)},
 		{ offset: 8, data: vec2.fromValues(0.05, 0.5)}
 	);

 	var _near = 0.1;
 	var _far = 100;
 	var idx = 1.2;
	//Create PBR glass UBO
	globalUBOs['PBR_glass_uniforms'] = new STK.UniformBlock('PBR_glass_uniforms');
 	globalUBOs['PBR_glass_uniforms'].createGL( 4 * 7 );
 	globalUBOs['PBR_glass_uniforms'].updateGL_batch(
 		// beer green
 		{ offset: 0, data: vec4.fromValues(0,82/255,31/255, 1.)},
 		{ offset: 4, data: vec4.fromValues(0,82/255,31/255, 1.)},

 		// light blue 173, 216, 230
 		// { offset: 0, data: vec4.fromValues(173/255, 216/255, 230/255, 1.)},
 		// { offset: 4, data: vec4.fromValues(173/255, 216/255, 230/255, 1.)},
 		// { offset: 0, data: vec4.fromValues(1,1,1, 1.)},
 		// { offset: 4, data: vec4.fromValues(1,1,1, 1.)},
 		{ offset: 8, data: vec4.fromValues(1., 1., 1., 1.)},
 		{ offset: 12, data: vec4.fromValues(1., 1., 1., 1.)},
 		{ offset: 16, data: vec4.fromValues(_near*_far, _far-_near, _far+_near, _far)},
 		{ offset: 20, data: vec4.fromValues(1.0/idx, 1.0/(idx*idx), idx, idx*idx)},
 		{ offset: 24, data: vec2.fromValues(0., 1.)}
 	);

 	var projection = mat4.perspective([], Math.PI/3, STK.Board.screenWidth / STK.Board.screenHeight, 0.1, 100.);
 	globalTransforms = {
 		'projection' : projection,
 		'invProjection' : mat4.invert([], projection),
		'view' : mat4.create(),
		'model' : mat4.translate([], mat4.scale([], mat4.create(), vec3.fromValues(2, 2, 2)), vec3.fromValues(0, 0, 0)),
		'geometryModel' : mat4.scale([], mat4.translate([], mat4.create(), vec3.fromValues(0, 0, -5)), vec3.fromValues(2, 2, 2)),
		'modelView' : mat4.create(),
		'normalMatrix' : mat3.create(),
		'planeModel' : mat4.rotateX([], mat4.translate([], mat4.create(), vec3.fromValues(0, -0.1, 0)), -Math.PI),
		'sphereModel': mat4.translate([], mat4.scale([], mat4.create(), vec3.fromValues(0.5, 0.5, 0.5)), vec3.fromValues(0, 1, 5))
	};

 	Stacks[0] = createMainStack();
 	Stacks[0].initUniformBlocks(function(){ return [globalUBOs['Vertex_Transform_data'], globalUBOs['Texure_Transform_data'], globalUBOs['PBR_uniforms'], globalUBOs['PBR_glass_uniforms']]; });
 	Stacks[0].initTransforms(function(){ return globalTransforms; });

 	Stacks[1] = createRefractBackStack();
 	Stacks[1].initUniformBlocks(function(){ return [globalUBOs['Vertex_Transform_data']]; });
 	Stacks[1].initTransforms(function(){ return globalTransforms; });

 	Stacks[2] = createGeometryStack();
 	Stacks[2].initUniformBlocks(function(){ return [globalUBOs['Vertex_Transform_data'], globalUBOs['Texure_Transform_data'], globalUBOs['PBR_uniforms']]; });
 	Stacks[2].initTransforms(function(){ return globalTransforms; });

 	controls.setOrigin([0,3,0]);
 	controls.setRadius(5);
 	controls.setAngles(DegToRad(135.26366581533483), DegToRad(40.88619810748565));
 	controls.updateValues();
 	// controls.startAnimation(function(){
 	// 	this.setRadius(this.radius + 0.0025);
 	// 	this.setAngles(undefined, this.angle2-0.0002);

 	// 	return true;
 	// });
	window.requestAnimationFrame(update);
 }

function updateGlobals (){
	mat4.copy(globalTransforms['view'], controls.out);
	globalUBOs['Vertex_Transform_data'].updateGL_batch( 
		{ offset: 0, data: globalTransforms['projection'] },
	    { offset: 32, data: globalTransforms['view'] },
	    { offset: 80, data: globalTransforms['invProjection'] },
	    { offset: 96, data: controls.pos3 });
}

 function update(){
 	controls.update();
 	updateGlobals();

 	Stacks[2].render();
 	Stacks[1].render();
 	Stacks[0].render();
 	window.requestAnimationFrame(update);
 }

init();
