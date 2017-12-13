var skybox_frag = `#version 300 es
	precision highp float;
	 
	in vec3 vEyeDirection;

	layout(location = 0) out vec4 outColor;
	uniform samplerCube environment;

	void main() {
	  outColor = texture(environment, vEyeDirection);
	}`
;