var flatVertSrc = `#version 300 es
 	precision highp float;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	layout(location = 2) in vec3 normal;
	out vec2 vUv;
	out vec3 vN;
	out float d;
	
	`
	+ vertex_transform_UBO
	+ texture_transform_UBO
	+
	`

	void main() {
	  vec4 wPos = vertex_transform_data.model * vec4(position, 1.);
	  vUv = uv * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
	  vec3 transformedNormal = mat3(vertex_transform_data.model) * normal;
      vN = normalize( transformedNormal );
	  vec3 dir = normalize(vertex_transform_data.cameraPosition - wPos.xyz);
	  d = dot(dir, vN);
	  gl_Position = vertex_transform_data.projection * vertex_transform_data.modelView * vec4(position, 1.);
	}
`;


var flatFragSrc = `#version 300 es
	precision highp float;
	`
	+ vertex_transform_UBO
	+
	`
	in vec2 vUv;
	in vec3 vN;
	in float d;
	layout(location = 0) out vec4 outColor;

	void main(){
		outColor = vec4(d, d, d, 1.);
	}
`;
