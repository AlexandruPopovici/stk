var indirect_vert = `#version 300 es
 
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	layout(location = 2) in vec3 normal;
	out vec2 vUv;
	out vec4 ray_origin;
	out vec3 ray_direction;

	layout (std140) uniform Vertex_Transform_data
	{ 
	  mat4 projection;
	  mat4 model;
	  mat4 view;
	  mat4 modelView;
	  mat3 normalMatrix;//World Space!
	} vertex_transform_data;
	
	layout (std140) uniform Texture_Transform_data
	{ 
	  vec4 tex_transform;
	} texture_transform_data;


	void main() {
	 
	  vUv = uv * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
	  ray_origin = vertex_transform_data.model * vec4(position, 1.);
	  ray_direction = (vertex_transform_data.model * vec4(normal, 0.)).xyz;
	  gl_Position = vertex_transform_data.projection * vertex_transform_data.modelView * vec4(position, 1.);
	}
`;
