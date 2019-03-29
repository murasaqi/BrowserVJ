uniform sampler2D uTex;
varying vec2 vUv;
uniform vec3 colorA;
uniform vec3 colorB;
uniform float uTime;
void main() {

    vec4 color = texture2D(uTex,vUv*2. + vec2(0.,uTime*0.2));

    vec3 grad = mix(colorA,colorB, vUv.y);

//    float a = 1.;
//    if(distance(color.xyz,vec3(0.)) < 0.5)
//    {
//        a =1.;
//    }

    grad *= (distance(color.xyz,vec3(1.))+1.);
    gl_FragColor = vec4(grad,1.);
}
