var vertSrc = `#version 300 es
 
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	out vec2 vUv;

	layout (std140) uniform Vertex_Transform_data
	{ 
	  mat4 projection;
	  mat4 model;
	  mat4 view;
	} vertex_transform_data;
	
	layout (std140) uniform Texture_Transform_data
	{ 
	  vec4 tex_transform;
	} texture_transform_data;


	void main() {
	 
	  vUv = uv * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
	  gl_Position = vertex_transform_data.projection * vertex_transform_data.view * vertex_transform_data.model * vec4(position, 1.);
	}
`;
