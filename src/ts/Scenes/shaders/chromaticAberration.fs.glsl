uniform sampler2D uTex;
uniform float uTime;
uniform vec2 iResolution;
varying vec2 vUv;
float random(vec2 ab)
{
    float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
    return fract(f);
}

void main(void) {
    vec2 uv =gl_FragCoord.xy / iResolution.xy;
    vec4 color = vec4(0.0);

    float go = sin(uTime) * 0.01;
    float go2 = sin(uTime) * 0.01;
    vec2 strenght = vec2(5, 2) * random(uv);

    color.r = texture2D(uTex, -uv - vec2(go, 0.0) * strenght).r;
    color.g = texture2D(uTex, -uv - vec2(0.005, go2) * strenght).g;
    color.b = texture2D(uTex, -uv).g;
    color.a = 1.0;

    gl_FragColor = color;
}