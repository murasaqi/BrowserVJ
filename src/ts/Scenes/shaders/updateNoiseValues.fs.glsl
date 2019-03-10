precision highp float;
varying vec2 vUv;
uniform float uTimeline;
uniform float uTime;
uniform sampler2D uTex;
uniform sampler2D uNoiseTex;
//uniform vec2 u_resolution;
#define M_PI 3.1415926535897932384626433832795

float random(vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


float noise(vec2 _st) {
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

void main()	{
    vec4 previous = texture2D(uTex,vUv);
    vec4 noiseTex = texture2D(uNoiseTex,vUv);
    if(noiseTex.z >= 1.) {
//    previous.x += max(abs(noise(vUv*10.))*0.1,0.007);
        previous.x += 0.01;
    } else
    {
        previous.x = 0.;
    }
    previous.a = 1.0;
    gl_FragColor = previous;
}