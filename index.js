new STK.NodeState()
 var canvas = document.getElementById('glCanvas');
 controls = createControllerEntity();
 controls.bindInput(canvas);
 gl = canvas.getContext('webgl2');
var vertex_buffer, uv_buffer, Index_Buffer, shaderProgram, vao, samplerObject, textureObject, textureLocation;
var u_1, u_2;
var targetTexture, fb, depthTexture;
var projection = mat4.perspective([], Math.PI/3, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 1000);
var model = mat4.translate([], mat4.create(), vec3.fromValues(0,0,0));

var projection_l, view_l, model_l;
function init(){
	var ppt = new PPT();
	ppt.addChild('c1', 'root');
	ppt.addChild('c2', 'root');
	ppt.addChild('c3', 'c1');
	ppt.addChild('c4', 'root');
	ppt.addChild('c5', 'c3');
	ppt.addChild('c6', 'c1');
	ppt.print();

	var shape = Torus();
	var vertices = shape.vertices;
	var uvs = shape.uvs;
 	indices = shape.indices;
 	
 	for(var i = 0 ; i < vertices.length; i+=3){
 		var attributeIndex = i/3;
 	}
	// Create an empty buffer object to store vertex buffer
	vertex_buffer = gl.createBuffer();

	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	 
	// Pass the vertex data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// Unbind the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	uv_buffer = gl.createBuffer();
	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
	 
	// Pass the vertex data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

	// Unbind the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Create an empty buffer object to store Index buffer
	Index_Buffer = gl.createBuffer();

	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

	// Pass the vertex data to the buffer
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	 
	// Unbind the buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    var vertShader = createShader(gl, gl.VERTEX_SHADER, vertSrc);
    var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    shaderProgram = createProgram(gl, vertShader, fragShader);
    u_1 = gl.getUniformLocation(shaderProgram, 'scale')
    projection_l = gl.getUniformLocation(shaderProgram, 'projection');
    view_l = gl.getUniformLocation(shaderProgram, 'view');
    model_l = gl.getUniformLocation(shaderProgram, 'model');
    textureLocation = gl.getUniformLocation(shaderProgram,'albedo');
	 // // Create a vertex shader object
	 // var vertShader = gl.createShader(gl.VERTEX_SHADER);

	 // // Attach vertex shader source code
	 // gl.shaderSource(vertShader, vertSrc);

	 // // Compile the vertex shader
	 // var vertResult = gl.compileShader(vertShader);
	 // if(vertResult)
	 // 	console.error(gl.getShaderInfoLog(vertShader))
	 // // Create fragment shader object
	 // var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	 // // Attach fragment shader source code
	 // gl.shaderSource(fragShader, fragSrc); 
	 
	 // // Compile the fragmentt shader
	 // var fragResult = gl.compileShader(fragShader);
	 // if(fragResult)
	 // 	console.error(gl.getShaderInfoLog(fragShader))
	 // // Create a shader program object to store
	 // // the combined shader program
	 // shaderProgram = gl.createProgram();

	 // // Attach a vertex shader
	 // gl.attachShader(shaderProgram, vertShader);

	 // // Attach a fragment shader
	 // gl.attachShader(shaderProgram, fragShader);

	 // // Link both the programs
	 // gl.linkProgram(shaderProgram);

	 /*======= Associating shaders to buffer objects =======*/
	 vao = gl.createVertexArray();
	 gl.bindVertexArray(vao);
	 // Bind vertex buffer object
	 gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	 gl.enableVertexAttribArray(0);
	 // Get the attribute location
	 // coord = gl.getAttribLocation(shaderProgram, "coordinates");

	 // Point an attribute to the currently bound VBO
	 gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); 

	 // Bind vertex buffer object
	 gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
	 gl.enableVertexAttribArray(1);
	 // Get the attribute location
	 // coord = gl.getAttribLocation(shaderProgram, "uv");

	 // Point an attribute to the currently bound VBO
	 gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0); 

	 //gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

	 gl.bindVertexArray(null);

	loadImage('assets/textures/metal1.jpg', function(image){
		samplerObject = gl.createSampler();
		gl.samplerParameteri(samplerObject, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.samplerParameteri(samplerObject, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.samplerParameteri(samplerObject, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.samplerParameteri(samplerObject, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	    textureObject = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, textureObject);
	    // Upload the image into the texture.
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	    gl.generateMipmap(gl.TEXTURE_2D);
	    gl.bindTexture(gl.TEXTURE_2D, null);
	});

	//---- COLOR0
	targetTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, targetTexture);
	 
	// define size and format of level 0
	const level = 0;
	const internalFormat = gl.RGBA;
	const border = 0;
	const format = gl.RGBA;
	const type = gl.UNSIGNED_BYTE;
	const data = null;
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
	              canvas.width, canvas.height, border,
	              format, type, data);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);

	//--DEPTH
	depthTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, depthTexture);
	 
	// make a depth buffer and the same size as the targetTexture
	gl.texImage2D(gl.TEXTURE_2D, level, gl.DEPTH_COMPONENT24,
	                canvas.width, canvas.height, 0,
	                gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
	 
	  // set the filtering so we don't need mips
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Create and bind the framebuffer
    fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
     
    // attach the texture as the first color attachment
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, level);
  	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, level);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
var drawCount = 1
function update(){
	controls.update();
	// var camMat = mat4.create();
	// mat4.rotateZ(camMat, camMat, Math.PI/2);
	// mat4.translate(camMat, camMat, vec3.fromValues(2,2,-10));
	// var viewPoint = mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1);
	// mat4.multiply(camMat, camMat, viewPoint);
	var view = controls.out;//mat4.invert(camMat, camMat);
	//mat4.invert(view, view);
	// console.warn(controls.out);
	 // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	 // Enable the attribute
	 

	 // Bind index buffer object
	 // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
	 /*=========Drawing the triangle===========*/
	
	 // Use the combined shader program object
	 gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

	 gl.useProgram(shaderProgram);

	 gl.bindVertexArray(vao);
	 
	 // Clear the canvas
	 gl.clearColor(1, 1, 1, 1);

 	 // gl.activeTexture(gl.TEXTURE0);
	 gl.bindTexture(gl.TEXTURE_2D, textureObject);
	 gl.bindSampler(0, samplerObject);

	 // Enable the depth test
	 gl.enable(gl.DEPTH_TEST);

	 // Clear the color buffer bit
	  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	 // Set the view port
	 gl.viewport(0,0,canvas.width,canvas.height);
	 
	 gl.uniformMatrix4fv(projection_l, false, projection);
	 gl.uniformMatrix4fv(view_l, false, view);
	 gl.uniformMatrix4fv(model_l, false, model);
	 gl.uniform1i(textureLocation, 0);
	 gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

//---------------------------------------------------------------------
	 gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	 gl.useProgram(shaderProgram);

	 gl.bindVertexArray(vao);
	 
	 // Clear the canvas
	 gl.clearColor(1, 1, 1, 1);

 	 // gl.activeTexture(gl.TEXTURE0);
	 gl.bindTexture(gl.TEXTURE_2D, depthTexture);
	 gl.bindSampler(0, null);

	 // Enable the depth test
	 gl.enable(gl.DEPTH_TEST);

	 // Clear the color buffer bit
	 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	 // Set the view port
	 gl.viewport(0,0,canvas.width,canvas.height);
	 
	 gl.uniformMatrix4fv(projection_l, false, projection);
	 gl.uniformMatrix4fv(view_l, false, view);
	 gl.uniformMatrix4fv(model_l, false, model);
	 gl.uniform1i(textureLocation, 0);
	 gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);

	window.requestAnimationFrame(update);
}
init();
window.requestAnimationFrame(update);
/*============== Creating a canvas ====================*/

 