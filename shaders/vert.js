var vertSrc = `#version 300 es
 
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	out vec2 vUv;

	uniform mat4 projection;
	uniform mat4 view;
	uniform mat4 model;

	void main() {
	 
	  vUv = uv;
	  gl_Position = projection * view * model * vec4(position, 1.);
	}
`;
