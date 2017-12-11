var indirect_vert = `#version 300 es
 
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	layout(location = 2) in vec3 normal;
	out vec2 vUv;
	//out vec3 vN;

	layout (std140) uniform Vertex_Transform_data
	{ 
	  mat4 projection;
	  mat4 model;
	  mat4 view;
	  //mat3 normalMatrix;
	  mat4 modelView;
	} vertex_transform_data;
	
	layout (std140) uniform Texture_Transform_data
	{ 
	  vec4 tex_transform;
	} texture_transform_data;


	void main() {
	 
	  vUv = uv * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
	  //vN = normal
	  gl_Position = vertex_transform_data.projection * vertex_transform_data.modelView * vec4(position, 1.);
	}
`;
