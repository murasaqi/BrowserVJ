precision highp float;
 varying vec2 vUv;
 uniform sampler2D tex0;
 uniform sampler2D tex1;

uniform int blendNum;

// ------------- 0 --------------//
float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

// ------------- 1 --------------//
float blendAdd(float base, float blend) {
    return min(base+blend,1.0);
}

vec3 blendAdd(vec3 base, vec3 blend) {
    return min(base+blend,vec3(1.0));
}

vec3 blendAdd(vec3 base, vec3 blend, float opacity) {
    return (blendAdd(base, blend) * opacity + base * (1.0 - opacity));
}


// ------------- 2 --------------//
vec3 blendDifference(vec3 base, vec3 blend) {
    return abs(base-blend);
}

vec3 blendDifference(vec3 base, vec3 blend, float opacity) {
    return (blendDifference(base, blend) * opacity + base * (1.0 - opacity));
}

// ------------- 3 --------------- //
vec3 blendAverage(vec3 base, vec3 blend) {
    return (base+blend)/2.0;
}
vec3 blendAverage(vec3 base, vec3 blend, float opacity) {
    return (blendAverage(base, blend) * opacity + base * (1.0 - opacity));
}


// ------------- 4 --------------- //
float blendReflect(float base, float blend) {
    return (blend==1.0)?blend:min(base*base/(1.0-blend),1.0);
}

vec3 blendReflect(vec3 base, vec3 blend) {
    return vec3(blendReflect(base.r,blend.r),blendReflect(base.g,blend.g),blendReflect(base.b,blend.b));
}

vec3 blendReflect(vec3 base, vec3 blend, float opacity) {
    return (blendReflect(base, blend) * opacity + base * (1.0 - opacity));
}


// ------------- 5 --------------- //
vec3 _blendGlow(vec3 base, vec3 blend) {
    return blendReflect(blend,base);
}

vec3 blendGlow(vec3 base, vec3 blend, float opacity) {
    return (_blendGlow(base, blend) * opacity + base * (1.0 - opacity));
}
// ------------- 6 --------------- //
float blendScreen(float base, float blend) {
    return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
    return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
    return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

// ------------- 3 --------------- //



// ------------- 3 --------------- //

// ------------- 3 --------------- //

// ------------- 3 --------------- //

// ------------- 3 --------------- //




 void main(){
   vec4 final;

   vec4 tex0_color = texture2D(tex0, vUv);
   vec4 tex1_color = texture2D(tex1, vUv);

     if(blendNum == 0)
     {
         final = mix(tex0_color, tex1_color, tex1_color.a);
     }

     if(blendNum == 1)
     {
         final.xyz = blendOverlay(tex0_color.xyz, tex1_color.xyz, tex0_color.a);
         final.a = 1.;
     }


     if(blendNum == 2)
     {
         final.xyz = blendDifference(tex0_color.xyz, tex1_color.xyz, tex0_color.a);
         final.a = 1.;
     }

     if(blendNum == 3)
     {
         final.xyz = blendAverage(tex0_color.xyz, tex1_color.xyz, tex0_color.a);
         final.a = 1.;
     }

     if(blendNum == 4)
     {
         final.xyz = blendReflect(tex0_color.xyz, tex1_color.xyz, tex0_color.a);
         final.a = 1.;
     }

     if(blendNum == 5)
     {
         final.xyz = blendGlow(tex0_color.xyz, tex1_color.xyz, tex0_color.a);
         final.a = 1.;
     }

     if(blendNum == 6)
     {
         final.xyz = blendScreen(tex0_color.xyz, tex1_color.xyz, tex0_color.a);
         final.a = 1.;
     }


   gl_FragColor = final;
 }