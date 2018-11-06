//http://marcinignac.com/blog/pragmatic-pbr-hdr/
var quad_vert = `#version 300 es
 
	layout(location = 0) in vec3 position;
	out vec2 vUv;

	`
	+ vertex_transform_UBO
	+
	`

	void main() {

		vUv = position.xy* 0.5 + 0.5;
    	gl_Position = vec4(position, 1.);//vertex_transform_data.projection * vertex_transform_data.modelView * vec4(position, 1.);
	}
`;

//http://marcinignac.com/blog/pragmatic-pbr-hdr/
var quad_frag = `#version 300 es
 
	precision highp float;
 
	in vec2 vUv;

	layout(location = 0) out vec4 outColor;

	uniform sampler2D tex;
	uniform sampler2D depth;

	void main() {
		outColor = vec4(texture(depth, vUv).rrr, 1.);
	}
`;
