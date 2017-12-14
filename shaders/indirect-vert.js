var indirect_vert = `#version 300 es
 
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	layout(location = 2) in vec3 normal;
	out vec2 vUv;
	out vec4 ray_origin;
	out vec3 ray_direction;
	out vec3 pos_eye;
	out vec3 n_eye;


	`
	+ vertex_transform_UBO
	+ texture_transform_UBO
	+
	`


	void main() {
	 	
	  vec4 wPos = vertex_transform_data.model * vec4(position, 1.);
	  vUv = uv * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
	  ray_origin = wPos;
	  ray_direction = (vertex_transform_data.model * vec4(normal, 0.)).xyz;

	  pos_eye = vec3(vertex_transform_data.modelView * vec4(position, 1.0));
  	  n_eye = vec3(vertex_transform_data.modelView * vec4(normal, 0.0));
	  gl_Position = vertex_transform_data.projection * vertex_transform_data.modelView * vec4(position, 1.);
	}
`;
