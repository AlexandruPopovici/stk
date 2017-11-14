new STK.NodeState()
 var canvas = document.getElementById('glCanvas');
 gl = canvas.getContext('webgl2');

var vertex_buffer, color_buffer, Index_Buffer, shaderProgram, vao;
var u_1, u_2;
function init(){
	console.warn('INIT');

	var ppt = new PPT();
	ppt.addChild('c1', 'root');
	ppt.addChild('c2', 'root');
	ppt.addChild('c3', 'c1');
	ppt.addChild('c4', 'root');
	ppt.addChild('c5', 'c3');
	ppt.addChild('c6', 'c1');
	ppt.print();

	var vertices = [
	    -0.5,0.5,0.0,
	    -0.5,-0.5,0.0,
	    0.5,-0.5,0.0, 
	 ];

	 var colors = [
	  	1,0,0,
	    0,1,0,
	    0,0,1, 
	 ];
 
 	indices = [0,1,2];
 
	// Create an empty buffer object to store vertex buffer
	vertex_buffer = gl.createBuffer();

	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	 
	// Pass the vertex data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// Unbind the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	color_buffer = gl.createBuffer();
	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
	 
	// Pass the vertex data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

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
	 gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
	 gl.enableVertexAttribArray(1);
	 // Get the attribute location
	 // coord = gl.getAttribLocation(shaderProgram, "color");

	 // Point an attribute to the currently bound VBO
	 gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0); 

	 //gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

	 gl.bindVertexArray(null);

	 
	 
}
var drawCount = 10
function update(){
	console.warn('UPDATE')

	 // gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
	 // Enable the attribute
	 

	 // Bind index buffer object
	 // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
	 /*=========Drawing the triangle===========*/

	 // Use the combined shader program object
	 gl.useProgram(shaderProgram);

	 gl.bindVertexArray(vao);
	 
	 // Clear the canvas
	 gl.clearColor(0.5, 0.5, 0.5, 0.9);

	 // Enable the depth test
	 gl.enable(gl.DEPTH_TEST);

	 // Clear the color buffer bit
	 gl.clear(gl.COLOR_BUFFER_BIT);

	 // Set the view port
	 gl.viewport(0,0,canvas.width,canvas.height);

	 for(var i = 0, k = -1 ; i < drawCount; i++, k+=0.5){
		 // Draw the triangle
		 gl.uniform1f(u_1, k);
		 gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT,0);
	}
	 
	window.requestAnimationFrame(update);
}
init();
window.requestAnimationFrame(update);
/*============== Creating a canvas ====================*/

 