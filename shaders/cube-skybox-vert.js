//http://marcinignac.com/blog/pragmatic-pbr-hdr/
var cube_skybox_vert = `#version 300 es
 
	layout(location = 0) in vec3 position;
	out vec3 wcNormal;

	`
	+ vertex_transform_UBO
	+
	`

	void main() {

		wcNormal = position;
    	gl_Position = vertex_transform_data.projection * vertex_transform_data.modelView * vec4(position, 1.);
	}
`;
