precision highp float;
 varying vec2 vUv;
 uniform sampler2D uTex;

void main(){
    gl_FragColor = texture2D(uTex, vUv);
    // gl_FragColor = vec4(vUv, 1.0, 1.0);
}