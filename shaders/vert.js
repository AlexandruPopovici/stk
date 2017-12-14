var vertSrc = `#version 300 es
 
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	layout(location = 2) in vec3 normal;
	out vec2 vUv;
	out vec3 vN;

	
	`
	+ vertex_transform_UBO
	+ texture_transform_UBO
	+
	`

	void main() {
	 
	  vUv = uv * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
	  vN = (vertex_transform_data.model * vec4(normal, 0.)).xyz;
	  gl_Position = vertex_transform_data.projection * vertex_transform_data.modelView * vec4(position, 1.);
	}
`;
