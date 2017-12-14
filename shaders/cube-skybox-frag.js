var cube_skybox_frag = `#version 300 es
	precision highp float;
	 
	in vec3 wcNormal;

	layout(location = 0) out vec4 outColor;
	uniform samplerCube environment;

	`
	+ envMapCube
	+ gamma
	+
	`

	void main() {
		vec3 color = texture(environment, envMapCube(normalize(wcNormal))).rgb;
		outColor = vec4(toGamma(color), 1.0); 
	}`
;