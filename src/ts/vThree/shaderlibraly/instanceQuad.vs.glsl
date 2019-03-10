precision highp float;
#define PI 3.1415926536
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute vec4 orientation;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vOffset;
uniform float uTime;
// http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
vec3 applyQuaternionToVector( vec4 q, vec3 v ){
    return v + 2.0 * cross( q.xyz, cross( q.xyz, v ) + q.w * v );
}
void main() {
    vPosition = applyQuaternionToVector( orientation, position );
    vOffset = offset;


    float lineWidth = 20.;
    float maxDistance = 100.;
    float th = abs(sin(mod(uTime* 0.06,PI/2.))) * maxDistance;

    float d = distance( offset.xz, vec2(0.));
    float diffY = 0.0;
     if( d <  th && d > th-lineWidth)
     {
            float rad = (th-d)/lineWidth;
            diffY = mix(0.,4.,sin(rad * PI));
     }


    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + vec3(0.,diffY,0.) + vPosition, 1.0 );
}
