var vertSrc = `#version 300 es
 
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	out vec2 vUv;

	layout (std140) uniform Transform_data
	{ 
	  mat4 projection;
	  mat4 model;
	  mat4 view;
	} transform_data;
	
	// uniform mat4 view;
	// uniform mat4 model;
	void main() {
	 
	  vUv = uv;
	  gl_Position = transform_data.projection * transform_data.view * transform_data.model * vec4(position, 1.);
	}
`;
