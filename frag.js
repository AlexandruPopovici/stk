var fragSrc = `#version 300 es
	precision highp float;
	 
	in vec2 vUv;

	out vec4 outColor;
	uniform sampler2D albedo;

	void main() {
	  outColor = texture(albedo, vUv);
	}`
;