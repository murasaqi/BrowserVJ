precision highp float;
 varying vec2 vUv;
 uniform sampler2D uTex;
 
 void main(){
    vec4 final = texture2D(uTex, vUv);
   gl_FragColor = final.grba;
   // gl_FragColor = vec4(vUv, 1.0, 1.0);
 }