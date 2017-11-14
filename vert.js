var vertSrc = `#version 300 es
 
	layout(location = 0) in vec3 position;
	//layout(location = 1) in vec3 color;
	out vec3 vColor;

	uniform mat4 projection;
	uniform mat4 view;
	uniform mat4 model;

	void main() {
	 
	  //vColor = color;
	  gl_Position = projection * view * model * vec4(position, 1.);
	}
`;
