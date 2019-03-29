// Gradient quantization (1.0 to disable)
#define QUANTIZATION 32.0
// Number of quantization levels (use 256 for no quantization)
#define LEVELS 256.0
// Set to 0 to use monochromatic triangle noise
#define RGB_TRIANGLE_NOISE 0
// Linear or gamma gradients
#define LINEAR_GRADIENT 1

// Gjøl made a more exhaustive comparison here:
//     https://www.shadertoy.com/view/MslGR8
// It shows all dithers presented here
uniform sampler2D uTex;
uniform vec2 iResolution;
float uniformNoise(vec2 n){
    // uniformly distribued, normalized in [0..1[
    return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453);
}

float interleavedGradientNoise(vec2 n) {
    float f = 0.06711056 * n.x + 0.00583715 * n.y;
    return fract(52.9829189 * fract(f));
}

float triangleNoise(const vec2 n) {
    // triangle noise, in [-0.5..1.5[ range
    vec2 p = fract(n * vec2(5.3987, 5.4421));
    p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));

    float xy = p.x * p.y;
    // compute in [0..2[ and remap to [-1.0..1.0[
    return fract(xy * 95.4307) + fract(xy * 75.04961) - 1.0;
}

vec4 Dither_None(vec4 rgba, float levels) {
    return rgba;
}

vec4 Dither_Ordered(vec4 rgba, float levels) {
    float bayer = texture2D(uTex, gl_FragCoord.xy / vec2(12.,9.), -10.0).r;
    bayer = bayer * 2.0 - 1.0;
    return vec4(rgba.rgb + bayer / (levels - 1.0), rgba.a);
}

vec4 Dither_Uniform(vec4 rgba, float levels) {
    float noise = uniformNoise(gl_FragCoord.xy / iResolution.xy);
    noise = (noise * 2.0) - 1.0;
    return vec4(rgba.rgb + noise / (levels - 1.0), rgba.a);
}

vec4 Dither_Interleaved(vec4 rgba, float levels) {
    // Jimenez 2014, "Next Generation Post-Processing in Call of Duty"
    float noise = interleavedGradientNoise(gl_FragCoord.xy);
    noise = (noise * 2.0) - 1.0;
    return vec4(rgba.rgb + noise / (levels - 1.0), rgba.a);
}

vec4 Dither_Vlachos(vec4 rgba, float levels) {
    // Vlachos 2016, "Advanced VR Rendering"
    vec3 noise = vec3(dot(vec2(171.0, 231.0), gl_FragCoord.xy));
    noise = fract(noise / vec3(103.0, 71.0, 97.0));
    noise = (noise * 2.0) - 1.0;
    return vec4(rgba.rgb + (noise / (levels - 1.0)), rgba.a);
}

vec4 Dither_TriangleNoise(vec4 rgba, float levels) {
    // Gjøl 2016, "Banding in Games: A Noisy Rant"
    #if RGB_TRIANGLE_NOISE == 1
    vec3 noise = vec3(
    triangleNoise(gl_FragCoord.xy / iResolution.xy         ) / (levels - 1.0),
    triangleNoise(gl_FragCoord.xy / iResolution.xy + 0.1337) / (levels - 1.0),
    triangleNoise(gl_FragCoord.xy / iResolution.xy + 0.3141) / (levels - 1.0)
    );
    #else
    vec3 noise = vec3(triangleNoise(gl_FragCoord.xy / iResolution.xy) / (levels - 1.0));
    #endif
    return vec4(rgba.rgb + noise, rgba.a);
}

vec3 OECF(const vec3 c) {
    return pow(c, vec3(1.0 / 2.2));
}

vec3 EOCF(const vec3 c) {
    return pow(c, vec3(2.2));
}

vec4 gradient(const vec3 s, const vec3 e, const vec2 uv, float levels) {
    // interpolate in linear space and convert back to sRGB
    #if LINEAR_GRADIENT > 0
    vec3 c = OECF(mix(EOCF(s / QUANTIZATION), EOCF(e / QUANTIZATION), uv.x));
    #else
    vec3 c= mix(s / QUANTIZATION, e / QUANTIZATION, uv.x);
    #endif

    return Dither_Ordered(vec4(c, 1.0), levels);


}

vec4 quantize(vec4 a, float l) {
    return floor(a * l + 0.5) / l;
}

varying vec2 vUv;
uniform float uTime;
void main() {
    vec2 uv = vUv;
    vec4 c = vec4(0.0);

    c = gradient(vec3(uv.x, uv.y, abs(sin(uTime))), vec3(uv.x, 0, uv.y),uv, LEVELS);

    c = floor(c * 255.0 ) / 255.0;
    c *= QUANTIZATION;



    gl_FragColor = c;
}