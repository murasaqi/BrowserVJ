#define PI 3.1415926536
#define BEAT_LEN 10

attribute vec3 color;

uniform float time;

//uniform float beats[BEAT_LEN];

//varying vec3 v_color;
varying vec3 v_position;

void main() {
    vec4 trans_position = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * trans_position;
    v_position = trans_position.xyz;
}
