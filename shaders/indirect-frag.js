var indirect_frag = `#version 300 es
	precision highp float;
	 
	in vec4 ray_origin;
	in vec3 ray_direction;

	layout (std140) uniform Texture_Transform_data
	{ 
	  vec4 tex_transform;
	} texture_transform_data;

	layout(location = 0) out vec4 outColor;
	uniform sampler2D albedo;

	// a small epsilon to work around the biggest problems with floats
    const float EPS = 0.0001;
    // 'clear value' for the ray 
    const float START_T = 100000.0;
    // maximum recursion depth for rays
    const int MAX_DEPTH = 3;

    const float planeWidth = 1000.;
    const float planeHeight = 1000.;

    struct Ray
  	{
      vec3 origin;
      vec3 direction;
    };

    struct Plane
    {
      vec3 center;
      vec3 normal;
    };

	struct Material
	{
	  vec3  diffuse;
	  float reflectance;
	};


    struct Hit
    {
      vec3  position;
      vec3  normal;
      float t;
      Material material;
    };


	Ray initRay()
  	{
        Ray r;
        r.origin = ray_origin.xyz;
        r.direction = normalize(ray_direction);
    	return r;
    }

    // intersects the ray with the ground plane at Y=0 and returns the line
    // parameter t where it hit
    float intersectRayPlane(in Ray ray, in Plane plane)
    {	
      float t = 0.;
      float denom = dot(plane.normal,ray.direction);
	  if (abs(denom) > 0.0001) // your favorite epsilon
	  {
	  	t = dot((plane.center - ray.origin), plane.normal) / denom;
	  }
	  return t;
    }

    // traces the scene and reports the closest hit
    bool traceScene(in Ray ray, in Plane plane, inout Hit hit)
    {

    	hit.t = START_T;
      	// first intersect the ground
      	float t = intersectRayPlane(ray, plane);
       	if (t >= 0.0 && t <= hit.t)
       	{
	         hit.t = t;
	         hit.position = ray.origin + ray.direction * t;
	         hit.normal = vec3(0,1,0);
	         hit.material.diffuse  = vec3(1.0);
	         hit.material.reflectance = 0.5;//05;
       	}
      
      return hit.t < START_T;
    }


	void main() {
		// create the primary ray
	    Ray ray = initRay();
	    Plane plane;
        plane.center = vec3(0.,-0.5,0.);
        plane.normal = vec3(0.,1.,0.);

        Hit hit;
        vec3 color = vec3(0.5,0.5,0.5);
        if(traceScene(ray, plane, hit))
        {	
        	vec2 uv = vec2(hit.position.x/planeWidth, hit.position.z/planeHeight);
        	uv = (uv * 0.5 + 0.5) * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
        	color *= texture(albedo, uv).rgb;
        }

        outColor = vec4(color, 1.0);
	}`
;