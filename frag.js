var fragSrc = `#version 300 es
	precision mediump float;
	 
	in vec2 vUv;

	out vec4 outColor;
	uniform sampler2D albedo;

	void main() {
	  outColor = vec4(vUv.x, vUv.x, vUv.x, 1.);//texture2D(albedo, vUv);
	}`
;