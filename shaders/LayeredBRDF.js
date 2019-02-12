var layeredBRDF_vert = `#version 300 es

  precision highp float;
	layout(location = 0) in vec3 position;
	layout(location = 1) in vec2 uv;
	layout(location = 2) in vec3 normal;

	out vec3 vWorldPosition;
	out vec3 vWorldNormal;
	out vec3 vViewPosition;
	out vec3 vViewNormal;
	out vec2 vUv;

	`
	+ vertex_transform_UBO
	+ texture_transform_UBO
	+
	`

	void main() {
	 	
	  vec4 wPos = vertex_transform_data.model * vec4(position, 1.);
		vec4 mvPos = vertex_transform_data.modelView * vec4(position, 1.);

	  vUv = uv * texture_transform_data.tex_transform.xy + texture_transform_data.tex_transform.zw;
		vWorldPosition = wPos.xyz;
		vWorldNormal = vec3(vertex_transform_data.model * vec4(normal, 0.0));
		vViewPosition = -mvPos.xyz;
    vViewNormal = normalize( mat3(vertex_transform_data.normalMatrix) * normal ); 

	  gl_Position = vertex_transform_data.projection * mvPos;
	}
`;


var layeredBRDF_frag = `#version 300 es
precision highp float;

#define PI 3.14159265359

in vec3 vWorldPosition;
in vec3 vWorldNormal;
in vec3 vViewPosition;
in vec3 vViewNormal;
in vec2 vUv;

`
+ vertex_transform_UBO
+ texture_transform_UBO
// + envMapCube
+ gamma
+
`

layout(location = 0) out vec4 outColor;
uniform sampler2D normalMap;
// uniform sampler2D albedo;
// uniform samplerCube environment;
	
float DistributionGGX(float NdotH, float roughness)
{
    float a      = roughness*roughness;
    float a2     = a*a;
    NdotH  = max(NdotH, 0.0);
    float NdotH2 = NdotH*NdotH;
	
    float num   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
	
    return num / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float num   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
	
    return num / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);
	
    return ggx1 * ggx2;
}

vec3 TorranceSparrow(float NdotL, float NdotV,float NdotH, float VdotH,
                       vec3 n, vec3 k, float m, out vec3 F, out float G){
    //D term - Beckmann distribution
    float D;
    float tg = sqrt(1. - NdotH*NdotH) / NdotH;
    D = 1. / (m*m*NdotH*NdotH*NdotH*NdotH)*exp(-(tg/m)*(tg/m));
    //F term - Lazanyi-Szirmay-Kalos approximation
    float q = 1. - VdotH;
    F = ((n - 1.)*(n - 1.) + 4.*n*q*q*q*q*q + k*k)/ ((n + 1.)*(n + 1.) + k*k);
    //G term
    G = min(1., min(NdotV*(2.*NdotH) / VdotH,NdotL*(2.*NdotH) / VdotH));
    //entire model
    return F*D*G / (4.*NdotV);
}

vec3 resolveNormal( vec3 eye_pos, vec3 surf_norm, vec2 normalScale, sampler2D normalMap ) {
    vec2 coords = vUv;
    vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
    vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
    vec2 st0 = dFdx( coords.st );
    vec2 st1 = dFdy( coords.st );
    vec3 S = normalize( q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    vec3 N = normalize( surf_norm );
    vec3 mapN = texture( normalMap, coords ).xyz * 2.0 - 1.0;
    mapN.xy = normalScale * mapN.xy;
    mat3 tsn = mat3( S, T, N );
    return normalize( tsn * mapN );
}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
    return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}

const float d = 0.001;
const float sigma = 1.;//7.6063e+5;
const float m1 = 0.01;
const float m2 = 0.1;
const vec3 n1 = vec3(1.1980, 1.1980, 1.19800);
const vec3 k1 = vec3(2., 1., 1.00029100);
const vec3 n2 = vec3(1.8398, 1.0152, 0.63324);
const vec3 k2 = vec3(8.0688, 6.6273, 5.4544);
const vec3 lightPosition = vec3(0., 1., 5.);
const vec3 color = vec3(1., 1., 1.);

void main() {
		// Calculate the real position of this pixel in 3d space, taking into account
    // the rotation and scale of the model. It's a useful formula for some effects.
    // This could also be done in the vertex shader
    vec3 worldPosition = vWorldPosition;

    // Calculate the normal including the model rotation and scale
		// vec3 normal = resolveNormal(-vViewPosition, vViewNormal, vec2(1., 1.), normalMap);
    vec3 worldNormal = normalize ( vWorldNormal );//inverseTransformDirection(normal, vertex_transform_data.view);
		vec3 viewNormal = normalize( vViewNormal );
    vec3 lightVector = normalize( lightPosition - worldPosition );

		vec3 cameraPosition = vertex_transform_data.cameraPosition;
    // An example simple lighting effect, taking the dot product of the normal
    // (which way this pixel is pointing) and a user generated light position
    float brightness = dot( worldNormal, lightVector );
    
    vec3 N = worldNormal;//normalize(2 * tex2D(normalMap, IN.UV).xyz - 1);
    vec3 L = lightVector;
    vec3 V = normalize( cameraPosition - worldPosition );//normalize(IN.eyePos - IN.fragmentPos);
    vec3 H = normalize(V + L);
    vec3 R = reflect(-V, N);
    vec3 L1 = -refract(L, N, 1./n1.r);
    vec3 V1 = -refract(V, N, 1./n1.r);
    vec3 H1 = normalize(V1 + L1);
    
    float NdotL = dot(N, L);
    float NdotH = dot(N, H);
    float NdotV = dot(N, V);
    float VdotH = dot(V, H);
    float NdotL1 = dot(N, L1);
    float NdotH1 = dot(N, H1);
    float NdotV1 = dot(N, V1);
    float V1dotH1 = dot(V1, H1);
    
    // BRDFs for both layers
    vec3 F1, F2;
    float G1, G2;
    // F and G are ‘out’ parameters
    vec3 f1= TorranceSparrow(NdotL, NdotV, NdotH, VdotH, n1, k1, m1, F1, G1);
    vec3 f2= TorranceSparrow(NdotL1, NdotV1, NdotH1, V1dotH1, n2 ,k2, max(m2, m1), F2, G2);
    
    // diffuse contribution of lower layer
    vec3 albedo = vec3(1., 0., 0.);
    f2+= (1. - F2) * max(NdotL, 0.) * albedo;
    
    // internal reflection term
    vec3 T12= 1. - F1;
    vec3 T21= T12;
    vec3 t = (1. - G1) + T21* G1;
    
    // attenuation term
    float l= d * (1./NdotL1 + 1./NdotV1);
    vec3 a = vec3(exp(-sigma * l));
    vec3 fr = color * (f1 + T12 * f2* a * t);
    vec3 color = fr / (fr + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));
		
    outColor = vec4( color, 1.0 );
}`
;