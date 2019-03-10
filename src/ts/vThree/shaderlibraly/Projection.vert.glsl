uniform mat4 tMatrix;
uniform vec3 color;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec4 vTexCoord;

void main(void){
    vPosition   = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal     = normal;
    vColor      = vec4(color.rgb,1.0);
    vTexCoord   = tMatrix * vec4(vPosition, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}