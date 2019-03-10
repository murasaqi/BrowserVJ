precision highp float;
 varying vec2 vUv;
 uniform sampler2D uMaskTex;
 uniform sampler2D uEffectTex;
 uniform sampler2D uTex;
 uniform float uTime;
 vec3 mod289(vec3 x) {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
 }

 vec2 mod289(vec2 x) {
   return x - floor(x * (1.0 / 289.0)) * 289.0;
 }

 vec3 permute(vec3 x) {
   return mod289(((x*34.0)+1.0)*x);
 }

 float snoise(vec2 v)
   {
   const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                       0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                      -0.577350269189626,  // -1.0 + 2.0 * C.x
                       0.024390243902439); // 1.0 / 41.0
 // First corner
   vec2 i  = floor(v + dot(v, C.yy) );
   vec2 x0 = v -   i + dot(i, C.xx);

 // Other corners
   vec2 i1;
   //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
   //i1.y = 1.0 - i1.x;
   i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
   // x0 = x0 - 0.0 + 0.0 * C.xx ;
   // x1 = x0 - i1 + 1.0 * C.xx ;
   // x2 = x0 - 1.0 + 2.0 * C.xx ;
   vec4 x12 = x0.xyxy + C.xxzz;
   x12.xy -= i1;

 // Permutations
   i = mod289(i); // Avoid truncation effects in permutation
   vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
     + i.x + vec3(0.0, i1.x, 1.0 ));

   vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
   m = m*m ;
   m = m*m ;

 // Gradients: 41 points uniformly over a line, mapped onto a diamond.
 // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

   vec3 x = 2.0 * fract(p * C.www) - 1.0;
   vec3 h = abs(x) - 0.5;
   vec3 ox = floor(x + 0.5);
   vec3 a0 = x - ox;

 // Normalise gradients implicitly by scaling m
 // Approximation of: m *= inversesqrt( a0*a0 + h*h );
   m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

 // Compute final noise value at P
   vec3 g;
   g.x  = a0.x  * x0.x  + h.x  * x0.y;
   g.yz = a0.yz * x12.xz + h.yz * x12.yw;
   return 130.0 * dot(m, g);
 }

mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
    );
}
mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
}

mat3 rotateZ(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
    );
}


 void main(){
   float scale = 8.;
    vec2 uv = vec2(vUv.x, vUv.y) + snoise(vec2(vUv*4. + vec2(uTime * 0.1)))*0.02;
    vec2 th = (rotateX(1.6) * vec3(vUv.x,vUv.y,0.)).xy;
    vec3 ex = texture2D(uEffectTex,uv).xyz;
//    th.x = 0.2;
//    th.y *= 0.1;

//    float lineWidth = 0.01;
    float vivit = 1.0;
    if(distance(ex,vec3(1.,1.,1.)) < 0.01)
    {
        uv = vec2(vUv.x, vUv.y) + snoise(vUv)*0.5;
        vivit = 1.5;
    }

    vec4 diffuse = texture2D(uTex, uv);
    vec4 mask = texture2D(uMaskTex,uv);
    vec4 final = diffuse*vivit;
    if(mask.a == 1.) final = vec4(0.,0.,0.,1.);
    float grad = vUv.y + 0.5;
    gl_FragColor = final*grad*vivit;
   // gl_FragColor = vec4(vUv, 1.0, 1.0);
 }