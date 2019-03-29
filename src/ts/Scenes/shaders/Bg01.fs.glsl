
varying vec2 vUv;
uniform sampler2D uTex;


uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float uTime;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
    vec2(12.9898,78.233)))*
    43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

    #define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

uniform vec3 colorA;
uniform vec3 colorB;

void main() {

    float timeScale = 0.8;
//    vec2 st = vUv;
    vec2 st = vUv*0.4+uTime*0.1;
    // st += st * abs(sin(uTime*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*uTime*timeScale);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime*timeScale );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime*timeScale);

    float f = fbm(st+r);

    vec4 result = texture2D(uTex,(f*f*f+.6*f*f+.5*f)*vUv);



//    vec2 uv = vUv;
//
//    float aspectRatio = 1920./1080.;
//
//    vec2 newRes = vec2(12);
//
//    //uncomment this for animated resolution
//    //newRes = vec2(sin(iTime*0.45)*0.5 +0.5) * 32.0 + 8.0 ;
//
//    newRes.x *= aspectRatio;
//
//    vec3 pal = vec3(6, 6, 6 ); //levels per color channel
//
//    uv = floor( uv * newRes ) / newRes; //the actual magic.
//    vec4 color = texture2D( uTex, uv + vec2(uTime,uTime) );
//
//    color.xyz = floor( color.xyz * pal  ) / pal.xyz;

    gl_FragColor = result;
}