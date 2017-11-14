var fragSrc = `#version 300 es
	precision mediump float;
	 
	in vec3 vColor;
	out vec4 outColor;
	 
	void main() {
	  outColor = vec4(vec3(1, 0.388, 0.278), 1);
	}`
;