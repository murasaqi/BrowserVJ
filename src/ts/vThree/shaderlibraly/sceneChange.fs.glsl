varying vec2 vUv;
 uniform sampler2D uTex;
 uniform sampler2D glitchMap;
 uniform sampler2D glitchMap02;
 uniform sampler2D glitchMap03;
 uniform sampler2D sceneA;
 uniform sampler2D sceneB;
 uniform float uTime;
 uniform float uThTime;
 uniform float sceneChangeTh;
 #define PI 3.1415926535897932384626433832795


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

  float rand(vec2 co)
  {
     return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
  }



 void main(){
    vec2 uv = vec2(vUv.x, vUv.y);
    vec4 g = texture2D(glitchMap,uv);
    vec4 g02 = texture2D(glitchMap02,uv);
    vec4 g03 = texture2D(glitchMap03,uv);

    vec4 diffuse = texture2D(uTex,uv);

    float alpha = 1.0;
    float th = 0.02;
    if( distance(vec2(abs(sin(mod(uTime, PI/2.)))), g.xy) < th)
    {
        alpha = 0.0;
    }

    if(distance(vec2(abs(sin(mod(uTime, PI/2.)))), g02.xy) < th )
    {
        alpha = 0.0;
    }


    vec4 result;

    float time = uTime * 0.8;
    float noise = max(0.0, snoise(vec2(time, uv.y * 0.3)) - 0.3) * (1.0 / 0.7);

        vec4 sceneAColor =  texture2D(sceneA, uv);
        vec4 sceneBColor =  texture2D(sceneB, uv);
        float noiseTh = abs(sin(mod(uTime*0.2,PI/2.)));

//        vec4 result;


        float areaHeight = 0.08;
         if(texture2D(glitchMap03,vec2(uv.x,uv.y+ abs(sin(uTime*8.0)) )).r < abs(sin(sceneChangeTh)))
        {

//            if(texture2D(glitcBhMap03,vec2(uv.x+ abs(sin(uTime*2.0)) , uv.y + abs(sin(uTime*3.0)) )).r > 0.5) {
               result = sceneBColor;
//            }
        } else
        {
            result = sceneAColor;
        }

//         if(distance(result.xyz, vec3(0.)) < 0.6) alpha = 0.0;


        gl_FragColor = result;
 }