#include <common>
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform float cameraConstant;
uniform float density;
varying vec4 vColor;
float radiusFromMass( float mass ) {
    // Calculate radius of a sphere from mass and density
    return pow( ( 3.0 / ( 4.0 * PI ) ) * mass / density, 1.0 / 3.0 );
}
void main() {
    vec4 posTemp = texture2D( texturePosition, uv );
    vec3 pos = posTemp.xyz;
    vec4 velTemp = texture2D( textureVelocity, uv );
    vec3 vel = velTemp.xyz;
    vColor = vec4( 0.2, 0.8, 0.3, 1.0 );
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 2. * cameraConstant / ( - mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;
}
