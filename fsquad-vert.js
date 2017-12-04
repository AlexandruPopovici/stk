var fsquad_vert = `#version 300 es
	
	layout(location = 0) in vec2 position;
	out vec2 vUv;

	const vec2 madd=vec2(0.5,0.5);
	void main() {
	   vUv = position.xy*madd+madd; // scale vertex attribute to [0-1] range
	   gl_Position = vec4(position.xy,0.0,1.0);
	}`;