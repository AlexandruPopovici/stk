var skybox_vert = `#version 300 es
 
	layout(location = 0) in vec3 position;
	out vec3 vEyeDirection;

	`
	+ vertex_transform_UBO
	+
	`
	
	void main() {
	  vec4 aPosition = vec4(position, 1.);
	  mat4 inverseProjection = inverse(vertex_transform_data.projection);
      mat3 inverseModelview = transpose(mat3(vertex_transform_data.view));
      vec3 unprojected = (inverseProjection * aPosition).xyz;
      vEyeDirection = inverseModelview * unprojected;

      gl_Position = aPosition;
	}
`;
