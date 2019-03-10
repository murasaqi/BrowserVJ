precision highp float;
 varying vec2 vUv;
 uniform sampler2D uTex;
 
 void main(){
    vec2 uv = vec2(1.-vUv.x, vUv.y);

    vec4 final = vec4(1.,1.,1.,1.);
    vec4 diffuse = texture2D(uTex, uv);
    final.xyz= mix(final.xyz,diffuse.xyz,diffuse.a);
   gl_FragColor = vec4(diffuse.rgb*0.8,1);
   // gl_FragColor = vec4(vUv, 1.0, 1.0);
 }