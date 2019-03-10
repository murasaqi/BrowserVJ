precision highp float;
 varying vec2 vUv;
 uniform sampler2D tex0;
 uniform sampler2D tex1;
#define threshold 0.55


 void main(){
   vec4 final;

   vec4 tex0_color = texture2D(tex0, vUv);
   vec4 tex1_color = texture2D(tex1, vUv);

   final = tex0_color;
   if(tex1_color.a != 0.0) final = tex1_color;

   gl_FragColor = final;
 }