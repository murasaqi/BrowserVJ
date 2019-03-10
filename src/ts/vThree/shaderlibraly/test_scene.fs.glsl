precision highp float;

varying vec3 vColor;
varying vec3 vNormal;

void main() {
//    vec3 ambient = vec3(0.1);
//    float diff = max(dot(vNormal, mainCamera), 0.0);
//    vec3 diffuse = diff * lightColor;

    gl_FragColor = vec4(vColor, 1.0);
}
