//http://marcinignac.com/blog/pragmatic-pbr-hdr/
var cube_skybox_vert = `#version 300 es
 
	layout(location = 0) in vec3 position;
	out vec3 wcNormal;

	layout (std140) uniform Vertex_Transform_data
	{ 
	  mat4 projection;
	  mat4 model;
	  mat4 view;
	  mat4 modelView;
	  mat3 normalMatrix;//World Space!
	} vertex_transform_data;
	
	

	void main() {
	  mat4 inverseProjection = inverse(vertex_transform_data.projection);
      mat3 inverseModelview = transpose(mat3(vertex_transform_data.view));
      vec3 unprojected = (inverseProjection * aPosition).xyz;
      vEyeDirection = inverseModelview * unprojected;

      gl_Position = aPosition;
	}
`;
