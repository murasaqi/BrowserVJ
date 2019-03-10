varying vec2 vUv;
uniform float time;
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

const vec3 c = vec3(1.,0.,-1.);
const float pi = acos(-1.);

//distance to quadratic bezier spline with parameter t
float dist(vec2 p0,vec2 p1,vec2 p2,vec2 x,float t)
{
    t = clamp(t, 0., 1.);
    return length(x-pow(1.-t,2.)*p0-2.*(1.-t)*t*p1-t*t*p2);
}

//minimum distance to quadratic bezier spline
float dsp(vec2 p0, vec2 p1, vec2 p2, vec2 x)
{
    //coefficients for 0 = t^3 + a * t^2 + b * t + c
    vec2 E = x-p0, F = p2-2.*p1+p0, G = p1-p0;
    vec3 ai = vec3(3.*dot(G,F), 2.*dot(G,G)-dot(E,F), -dot(E,G))/dot(F,F);

	//discriminant and helpers
    float tau = ai.x/3., p = ai.y-tau*ai.x, q = - tau*(tau*tau+p)+ai.z, dis = q*q/4.+p*p*p/27.;
    
    //triple real root
    if(dis > 0.) 
    {
        vec2 ki = -.5*q*c.xx+sqrt(dis)*c.xz, ui = sign(ki)*pow(abs(ki), c.xx/3.);
        return dist(p0,p1,p2,x,ui.x+ui.y-tau);
    }
    
    //three distinct real roots
    float fac = sqrt(-4./3.*p), arg = acos(-.5*q*sqrt(-27./p/p/p))/3.;
    vec3 t = c.zxz*fac*cos(arg*c.xxx+c*pi/3.)-tau;
    return min(
        dist(p0,p1,p2,x, t.x),
        min(
            dist(p0,p1,p2,x,t.y),
            dist(p0,p1,p2,x,t.z)
        )
    );
}

//minimum distance to linear bezier spline
float dsg(vec2 p0, vec2 p1, vec2 x)
{
    vec2 d = p1-p0;
    float t = clamp(dot(x-p0,d)/dot(d,d),0.,1.);
    return length(x-mix(p0,p1,t));
}

void main( )
{
    vec2 uv = vUv-0.5;

    float d = distance(vec2(0.,0.),uv*20.0);
    d =abs(sin(d -time)*2.0);
    float thickness = 0.1;
    float a;

    if(d < thickness) {
      a = 1.0;
    } else {
      // Anti-alias the edge.
      a = 1.0 - smoothstep(d, thickness, thickness+1.0);
    }
    gl_FragColor = vec4(a);
}
//    	gl_FragColor = vec4(c,1.0);
