var skybox_frag = `#version 300 es
	precision highp float;
	 
	in vec3 vEyeDirection;

	layout(location = 0) out vec4 outColor;
	uniform samplerCube environment;

	`
	+ gamma
	+
	`

	void main() {
		vec3 color = texture(environment, vEyeDirection).rgb;
		outColor = vec4(color, 1.0);
	}`
;