#define PI 3.1415926536
#define BEAT_LEN 10
varying vec2 vUv;
attribute vec3 color;

uniform float time;
uniform int waveMode;

uniform float beats[BEAT_LEN];

varying vec3 vColor;
varying vec3 vNormal;

float rnd(vec2 p){return fract(sin(dot(p,vec2(15.79,81.93))*45678.9123));}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);return mix(mix(rnd(i+vec2(0.,0.)),rnd(i+vec2(1.,0.)),f.x),mix(rnd(i+vec2(0.,1.)),rnd(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 uv,float d){float sum=0.;float amp=.7;for(int i=0;i<4;++i){sum+=noise(uv)*amp;uv+=uv*d;amp*=.4;}return sum;}

void main() {
    vUv = uv;
    float ctime = PI * 2. * time * 0.6;

    float amp = 3.;

    vec3 transform;

    if (waveMode == 0) {
//        transform.x += sin((position.y + ctime) * .5) * amp;
    } else if (waveMode == 1) {
        float dist = length(position.xy);
        float max_distance = 150.; //
        float y_amp = (1. - clamp(dist, 0., max_distance) / max_distance) * amp * 2.; // 距離に応じて減衰
        transform.y = (max(sin((dist + ctime) * .5), 0.5) - .5) * y_amp;
    } else if (waveMode == 2) {
        transform.z = sin((position.y + ctime) * .5) * amp ;
    } else if (waveMode == 3) {
        float divide_res = 2.0;

        vec3 direction = vec3(cos(ctime*0.02),0., sin(step(0.3, mod(ctime * .3, 2.0)*.2)));
        float a = fract(position.y * 0.01*divide_res)*divide_res;
        transform = direction * pow(fbm(vec2(a, rnd(vec2(fract(floor(time)*0.001)))), 1.2), 3.0)*30.;

    } else if (waveMode == 4) {
        for (int i  = 0; i < BEAT_LEN; i++) {
            if (beats[i]< 0.) continue;

            float max_distance = 250.;
            float dist = length(position.xy);
             //
            float y_amp = (1. - clamp(dist, 0., max_distance) / max_distance) * amp; // 距離に応じて減衰

            float clamp_dist = dist/max_distance;
            transform.y += smoothstep(beats[i] - .1, beats[i],clamp_dist)*smoothstep(-(beats[i] + .1), -beats[i], -clamp_dist) * y_amp;
        }
    }

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(transform + position, 1.);
    vColor = color;

    vNormal = normal;
}
