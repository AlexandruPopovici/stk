var fragSrc = `#version 300 es
	precision highp float;
	 
	in vec2 vUv;
	in vec3 vN;

	layout(location = 0) out vec4 outColor;
	uniform sampler2D albedo;

	`
	+ gamma
	+
	`

	void main() {
		vec3 color = texture(albedo, vUv).rgb;
		outColor = vec4(color, 1.0);
	}`
;