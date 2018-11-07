var vertex_transform_UBO = `

	layout (std140) uniform Vertex_Transform_data
	{ 
	  mat4 projection;
	  mat4 model;
	  mat4 view;
	  mat4 modelView;
	  mat4 normalMatrix;//View Space!
	  mat4 invProjection;
	  vec3 cameraPosition;
	} vertex_transform_data;
`;

var texture_transform_UBO = `
	
	layout (std140) uniform Texture_Transform_data
	{ 
	  vec4 tex_transform;
	} texture_transform_data;
`;

var envMapCube = `

	vec3 envMapCube(vec3 wcNormal, float flipEnvMap) {
	    return vec3(flipEnvMap * wcNormal.x, wcNormal.y, wcNormal.z);
	}

	vec3 envMapCube(vec3 wcNormal) {
	    //-1.0 for left handed coorinate system oriented texture (usual case)
	    return envMapCube(wcNormal, -1.0);
	}
`;

var gamma = `
	
	const float gamma = 2.2;

	float toGamma(float v) {
	  return pow(v, 1.0 / gamma);
	}

	vec2 toGamma(vec2 v) {
	  return pow(v, vec2(1.0 / gamma));
	}

	vec3 toGamma(vec3 v) {
	  return pow(v, vec3(1.0 / gamma));
	}

	vec4 toGamma(vec4 v) {
	  return vec4(toGamma(v.rgb), v.a);
	}

	float toLinear(float v) {
	  return pow(v, gamma);
	}

	vec2 toLinear(vec2 v) {
	  return pow(v, vec2(gamma));
	}

	vec3 toLinear(vec3 v) {
	  return pow(v, vec3(gamma));
	}

	vec4 toLinear(vec4 v) {
	  return vec4(toLinear(v.rgb), v.a);
	}
`;