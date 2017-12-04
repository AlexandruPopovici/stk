var fsquad_frag = `#version 300 es
	precision highp float;
	 
	in vec2 vUv;

	out vec4 outColor;
	uniform sampler2D tex;

	float LinearizeDepth(in sampler2D depthTexture, in vec2 uv)
	{
	    float zNear = 1.;    // TODO: Replace by the zNear of your perspective projection
	    float zFar  = 1000.0; // TODO: Replace by the zFar  of your perspective projection
	    float depth = texture(depthTexture, uv).r;
	    return (2.0 * zNear) / (zFar + zNear - depth * (zFar - zNear));
	}

	void main() {
	  float depth = texture(tex, vUv).r;//LinearizeDepth(tex, vUv);
	  outColor = vec4(depth,depth,depth,1);
	}`
;