precision highp float;
 varying vec2 vUv;
 uniform sampler2D tex0;
 uniform sampler2D tex1;


float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}


 void main(){
   vec4 final;

   vec4 tex0_color = texture2D(tex0, vUv);
   vec4 tex1_color = texture2D(tex1, vUv);

   final = mix(tex0_color, tex1_color, tex1_color.a);

   gl_FragColor = final;
 }