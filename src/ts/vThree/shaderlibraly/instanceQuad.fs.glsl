precision highp float;
#define PI 3.1415926536
uniform sampler2D map;
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vOffset;
vec3 colorA = vec3(192.,51.,255.) / 255.0;
vec3 colorB = vec3(87.,255.,165.) / 255.0;
void main() {
      float alpha = 0.;
      vec3 diffuse = vec3(0.);
      float lineWidth = 20.;
      float maxDistance = 100.;
      float th = abs(sin(mod(uTime* 0.06,PI/2.))) * maxDistance;

      float d = distance( vOffset.xz, vec2(0.));

      if( d <  th && d > th-lineWidth)
      {
            float rad = (th-d)/lineWidth;
            alpha = mix(0.,1.,sin(rad * PI));
            diffuse = mix(colorB,colorA, pow(d / maxDistance,2.));
      }

//      if(d > maxDistance * 0.5)
//      {
        alpha *= min(pow((1.0-d/maxDistance),0.5),1.0);
//      }
      gl_FragColor = vec4(diffuse,alpha);
//    gl_FragColor = texture2D(map, vUv);
}