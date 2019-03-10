varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTex;
uniform sampler2D uNoiseTex;
void main()	{
    vec4 noise = texture2D(uNoiseTex,vUv);
    gl_FragColor = vec4(vUv.xy,0.0,0.0);


}