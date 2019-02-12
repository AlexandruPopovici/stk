function createSandboxStack(){
	var mainStack = new STK.Stack("sandbox");
	
 	mainStack.initMaterials(function(){
 		var material = new STK.Material('Mat', vertSrc, fragSrc);
 		var indirectMaterial = new STK.Material('Indirect', indirect_vert, indirect_frag);
 		var skyBoxMaterial = new STK.Material('Skybox', skybox_vert, skybox_frag);
 		var carMaterial = new STK.Material('Car', flatVertSrc, flatFragSrc);

	 	material.bindGL(0, 'Vertex_Transform_data');
	 	indirectMaterial.bindGL(0, 'Vertex_Transform_data');
	 	skyBoxMaterial.bindGL(0, 'Vertex_Transform_data');
	 	carMaterial.bindGL(0, 'Vertex_Transform_data');

	 	material.bindGL(1, 'Texture_Transform_data');
	 	indirectMaterial.bindGL(1, 'Texture_Transform_data');

	 	return [material, indirectMaterial, skyBoxMaterial, carMaterial];
 		// var mat = new STK.Material('Mat', vertSrc, fragSrc);
 		// var indirect = new STK.Material('Indirect', indirect_vert, indirect_frag);
 		// var skybox = new STK.Material('Skybox', skybox_vert, skybox_frag);
 		// var pbr_ss = new STK.Material("PBR-SS", PBR_SS_vert_src, PBR_SS_frag_src);
 		// var pbr_ss_glass = new STK.Material("PBR-SS-Glass", PBR_SS_glass_vert_src, PBR_SS_glass_frag_src);
 		// var pbr_ss_glass_backfaces = new STK.Material("PBR-SS-Glass-Backfaces", PBR_SS_glass_backfaces_vert_src, PBR_SS_glass_backfaces_frag_src);
 		// var quad = new STK.Material('Quad', quad_vert, quad_frag);
 		// var fxaa = new STK.Material('Post', fxaa_vert, fxaa_frag);

 		// mat.bindGL(0, 'Vertex_Transform_data');
	 	// indirect.bindGL(0, 'Vertex_Transform_data');
	 	// skybox.bindGL(0, 'Vertex_Transform_data');
	 	// pbr_ss.bindGL(0, 'Vertex_Transform_data');
	 	// pbr_ss_glass.bindGL(0, 'Vertex_Transform_data');
	 	// pbr_ss_glass_backfaces.bindGL(0, 'Vertex_Transform_data');
	 	// quad.bindGL(0, 'Vertex_Transform_data');

	 	// mat.bindGL(1, 'Texture_Transform_data');
	 	// indirect.bindGL(1, 'Texture_Transform_data');
	 	// pbr_ss.bindGL(1, 'Texture_Transform_data');
	 	// pbr_ss_glass.bindGL(1, 'Texture_Transform_data');
	 	// pbr_ss_glass_backfaces.bindGL(1, 'Texture_Transform_data');


	 	// pbr_ss.bindGL(2, 'PBR_uniforms');
	 	// pbr_ss_glass.bindGL(3, 'PBR_glass_uniforms');
	 	// pbr_ss_glass_backfaces.bindGL(3, 'PBR_glass_uniforms');

 		// return [mat, indirect, skybox, pbr_ss, pbr_ss_glass, pbr_ss_glass_backfaces, quad, fxaa];
 	});

 	// Init framebuffers
	mainStack.initFrameBuffers(function(){
		null;

	 //    STK.Material.createRenderTexture('glass-color0');
		// var depthBuffer = gl.createRenderbuffer();
		// gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	 // 	// STK.Material.createDepthTexture('refract-back-depth');
	 // 	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, STK.Board.screenWidth, STK.Board.screenHeight);
	 // 	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		// // Create and bind the framebuffer
	 //    var fb = gl.createFramebuffer();
	 //    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	 //    // attach the texture as the first color attachment
	 //    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, STK.Material.Textures['glass-color0'], 0);
	 //    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer, 0);
	 //    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	 //    STK.Material.createRenderTexture('outBuffer');
		// var depth = gl.createRenderbuffer();
		// gl.bindRenderbuffer(gl.RENDERBUFFER, depth);
	 // 	// STK.Material.createDepthTexture('refract-back-depth');
	 // 	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, STK.Board.screenWidth, STK.Board.screenHeight);
	 // 	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		// // Create and bind the framebuffer
	 //    var fb2 = gl.createFramebuffer();
	 //    gl.bindFramebuffer(gl.FRAMEBUFFER, fb2);
	 //    // attach the texture as the first color attachment
	 //    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, STK.Material.Textures['outBuffer'], 0);
	 //    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth, 0);
	 //    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		// return {
		// 	'Glass-Pass': fb,
		// 	'Out-Buffer': fb2
		// };
	});

	mainStack.onStackRender(function(){
		updateLocals = function (imm_model){
			mat4.multiply(this.transforms['modelView'], this.transforms['view'], imm_model);
			var plm = this.transforms['modelView'];
			
			var nm = mat3.normalFromMat4([], this.transforms['modelView']);
			this.transforms['normalMatrix'] = mat4.fromValues(
				nm[0], nm[1], nm[2], 0,
			    nm[3], nm[4], nm[5], 0,
			    nm[6], nm[7], nm[8], 0,
			    0, 0, 0, 1
			);

			this.getUniformBlock('Vertex_Transform_data').updateGL_batch( { offset: 16, data: imm_model },
																		  { offset: 48, data: this.transforms['modelView'] },
																		  { offset: 64, data: this.transforms['normalMatrix'] });
		}.bind(this);


		var skyBoxMaterial = this.getMaterial('Skybox');
		var pbrGlassMaterial = this.getMaterial('PBR-SS-Glass');
		var pbrMaterial = this.getMaterial('PBR-SS');
		var pbrGlassBackfacesMaterial = this.getMaterial('PBR-SS-Glass-Backfaces');
		var planeMaterial = this.getMaterial('Mat');
		var quadmaterial = this.getMaterial('Quad');
		var fxaaMaterial = this.getMaterial('Post');
		

	 	var gl = STK.Board.Context;
	 	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers['Out-Buffer']);
		gl.viewport(0, 0, STK.Board.screenWidth, STK.Board.screenHeight);
		gl.clearColor(0, 0., 0., 1);
		gl.clearDepth(1);
		gl.depthFunc(gl.LESS);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.cullFace(gl.BACK);

	 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, this.getUniformBlock('Vertex_Transform_data').handle);
	 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 1, this.getUniformBlock('Texure_Transform_data').handle);
	 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 2, this.getUniformBlock('PBR_uniforms').handle);
	 	gl.bindBufferBase(gl.UNIFORM_BUFFER, 3, this.getUniformBlock('PBR_glass_uniforms').handle);

	 	// SKYBOX
	 	gl.depthMask(false);
	 	gl.useProgram(skyBoxMaterial.program);
	 	STK.Geometry.Models['FSQuad'].bindGL();
	 	skyBoxMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE0, 'probe32Env', null, 'environment');
	 	gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['FSQuad'].indicesCount(), gl.UNSIGNED_INT,0);
		gl.depthMask(true);
	 	
	 	// PBR
	 	gl.useProgram(pbrMaterial.program);
	 	pbrMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'probe32Specular', null, 'specularProbe');
		pbrMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE2, 'probe32Diffuse', null, 'diffuseProbe');
		pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE3, 'brdf', null, 'BRDFLut');
		{
			// RENDER PLANE
			updateLocals(this.transforms['planeModel']);
			this.getUniformBlock('Texure_Transform_data').updateGL( 0, vec4.fromValues(2,2,0,0));
			globalUBOs['PBR_uniforms'].updateGL_batch(
		 		{ offset: 8, data: vec2.fromValues(0.6, 0.)}
		 	);
			STK.Geometry.Models['Plane'].bindGL();
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE4, 'groundAlbedo', null, 'albedo');
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE5, 'groundNormals', null, 'normalMap');
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE6, 'groundAO', null, 'aoMap');
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE15, 'groundRoughness', null, 'roughnessMap');
			pbrMaterial.setFloatUniform("flipNormals", -1.);
			pbrMaterial.setFloatUniform("perturbNormals", 1.);
			pbrMaterial.setFloatUniform("useRoughnessMap", 1.);
			gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['Plane'].indicesCount(), gl.UNSIGNED_INT,0);

			// RENDER SPHERE
		 	updateLocals(this.transforms['geometryModel']);
		 	this.getUniformBlock('Texure_Transform_data').updateGL( 0, vec4.fromValues(1,1,0,0));
		 	globalUBOs['PBR_uniforms'].updateGL_batch(
		 		{ offset: 0, data: vec4.fromValues(218/255,165/255,32/255, 1.)},
		 		{ offset: 8, data: vec2.fromValues(0.05, 0.9)}
		 	);
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE7, 'white', null, 'albedo');
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE8, 'blankNormals', null, 'normalMap');
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE7, 'white', null, 'aoMap');
			pbrMaterial.setFloatUniform("flipNormals", 1.);
			pbrMaterial.setFloatUniform("perturbNormals", 0.);
			pbrMaterial.setFloatUniform("useRoughnessMap", 0.);
		 	STK.Geometry.Models['angel'].bindGL();
		 	gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['angel'].indicesCount(), gl.UNSIGNED_INT,0);

	 		// RENDER CAP
			// The cap's normals are flipped in the original model. If I flip them in blender they somehow get messed up
			// so, we keep them flipped and just render back faces
			gl.cullFace(gl.FRONT);
		 	updateLocals(this.transforms['model']);
		 	this.getUniformBlock('Texure_Transform_data').updateGL( 0, vec4.fromValues(1,1,0,0));
		 	globalUBOs['PBR_uniforms'].updateGL_batch(
		 		{ offset: 0, data: vec4.fromValues(1,1,1, 1.)},
		 		{ offset: 8, data: vec2.fromValues(0.05, 0.3)}
		 	);
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE9, 'capAlbedo', null, 'albedo');
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE8, 'blankNormals', null, 'normalMap');
			pbrMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE7, 'white', null, 'aoMap');
			pbrMaterial.setFloatUniform("flipNormals", -1.);
			pbrMaterial.setFloatUniform("perturbNormals", 1.);
			pbrMaterial.setFloatUniform("useRoughnessMap", 0.);
		 	STK.Geometry.Models['cap'].bindGL();
		 	gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['cap'].indicesCount(), gl.UNSIGNED_INT,0);
		 	gl.cullFace(gl.BACK);
		 }

	 	// GLASS
	 	{	
	 		gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers['Glass-Pass']);
	 		gl.viewport(0, 0, STK.Board.screenWidth, STK.Board.screenHeight);
	 		gl.clearColor(0, 0., 0., 1);
			gl.clearDepth(1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	 		gl.cullFace(gl.FRONT);
			updateLocals(this.transforms['model']);
		 	gl.useProgram(pbrGlassMaterial.program);
		 	this.getUniformBlock('Texure_Transform_data').updateGL( 0, vec4.fromValues(1,-1,0,0));
		 	pbrGlassMaterial.setFloatUniform('flipNormals', -1.);
		 	pbrGlassMaterial.setFloatUniform('exposure', 1);
		 	pbrGlassMaterial.setFloatUniform('useNormalMap', 1);
			pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE0, 'probe32Specular', null, 'specularProbe');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'probe32Diffuse', null, 'diffuseProbe');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE2, 'brdf', null, 'BRDFLut');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE3, 'monkey_normals', null, 'normalMap');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE4, 'monkey_specular', null, 'specularMap');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE5, 'probe32Env', null, 'environment');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE6, 'environmentOrtho', null, 'environmentOrtho');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE7, 'refract-back-color0', null, 'backFaceNormals');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE8, 'refract-back-depth', null, 'backFaceDepth');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE9, 'geometry-color0', null, 'geometryColor');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE10, 'geometry-depth', null, 'geometryDepth');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE11, 'glassAlbedo', null, 'albedo');

			STK.Geometry.Models['glass_high'].bindGL();
			gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['glass_high'].indicesCount(), gl.UNSIGNED_INT,0);
			gl.disable(gl.BLEND);
			gl.cullFace(gl.BACK);

			gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers['Out-Buffer']);
			gl.viewport(0, 0, STK.Board.screenWidth, STK.Board.screenHeight);
			updateLocals(this.transforms['model']);
		 	gl.useProgram(pbrGlassMaterial.program);
		 	this.getUniformBlock('Texure_Transform_data').updateGL( 0, vec4.fromValues(1,-1,0,0));
		 	pbrGlassMaterial.setFloatUniform('flipNormals', 1.);
		 	pbrGlassMaterial.setFloatUniform('exposure', 1);
		 	pbrGlassMaterial.setFloatUniform('useNormalMap', 1);
			pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE0, 'probe32Specular', null, 'specularProbe');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'probe32Diffuse', null, 'diffuseProbe');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE2, 'brdf', null, 'BRDFLut');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE3, 'monkey_normals', null, 'normalMap');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE4, 'monkey_specular', null, 'specularMap');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE5, 'probe32Env', null, 'environment');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE6, 'environmentOrtho', null, 'environmentOrtho');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE7, 'refract-back-color0', null, 'backFaceNormals');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE8, 'refract-back-depth', null, 'backFaceDepth');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE9, 'glass-color0', null, 'geometryColor');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE10, 'geometry-depth', null, 'geometryDepth');
			pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE11, 'glassAlbedo', null, 'albedo');

			STK.Geometry.Models['glass_high'].bindGL();
			gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['glass_high'].indicesCount(), gl.UNSIGNED_INT,0);
			gl.disable(gl.BLEND);
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, STK.Board.screenWidth, STK.Board.screenHeight);
	 	gl.useProgram(fxaaMaterial.program);
	 	STK.Geometry.Models['FSQuad'].bindGL();
	 	fxaaMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE16, 'outBuffer', null, 'tex');
	 	gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['FSQuad'].indicesCount(), gl.UNSIGNED_INT,0);

		

	 // 	// GLASS
	 // 	{
		// 	updateLocals(this.transforms['model']);
		//  	gl.useProgram(pbrGlassMaterial.program);
		//  	this.getUniformBlock('Texure_Transform_data').updateGL( 0, vec4.fromValues(1,-1,0,0));
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE0, 'probe32Specular', null, 'specularProbe');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE1, 'probe32Diffuse', null, 'diffuseProbe');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE2, 'brdf', null, 'BRDFLut');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE3, 'monkey_normals', null, 'normalMap');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE4, 'monkey_specular', null, 'specularMap');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE5, 'probe32Env', null, 'environment');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE6, 'environmentOrtho', null, 'environmentOrtho');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE7, 'refract-back-color0', null, 'backFaceNormals');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE8, 'refract-back-depth', null, 'backFaceDepth');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE9, 'geometry-color0', null, 'geometryColor');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE10, 'geometry-depth', null, 'geometryDepth');
		// 	pbrGlassMaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE11, 'glassAlbedo', null, 'albedo');

		// 	STK.Geometry.Models['glass_high'].bindGL();
		// 	gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['glass_high'].indicesCount(), gl.UNSIGNED_INT,0);
		// 	gl.disable(gl.BLEND);
		// }
		// gl.cullFace(gl.BACK);
		// gl.blendFunc(gl.ONE, gl.ONE);
	 // 	gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['maimu'].indicesCount(), gl.UNSIGNED_INT,0);
	 	
	 	

		// gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		// gl.viewport(0, 0, STK.Board.Canvas.width, STK.Board.Canvas.height);
	 // 	gl.useProgram(quadmaterial.program);
	 // 	STK.Geometry.Models['FSQuad'].bindGL();
	 // 	quadmaterial.bindTexture(gl.TEXTURE_2D, gl.TEXTURE0, 'RT', null, 'tex');
	 // 	gl.drawElements(gl.TRIANGLES, STK.Geometry.Models['FSQuad'].indicesCount(), gl.UNSIGNED_INT,0);
	 	// gl.enable(gl.DEPTH_TEST);
		
		
	});
	
	return mainStack;
}