uniform sampler2D uTex;
varying vec2 vUv;
uniform vec2 iResolution;
void main()
{
    vec2 uv =vUv;

    vec3  col = texture2D( uTex, vec2(uv.x,1.0-uv.y) ).xyz;
    float lum = dot(col,vec3(0.333));
    vec3 ocol = col;


    // bottom left: emboss
    vec3  nor = normalize( vec3( dFdx(lum), 64.0/iResolution.x, dFdy(lum) ) );

    float lig = clamp( 0.5 + 1.5*dot(nor,vec3(0.7,0.2,-0.7)), 0.0, 1.0 );
    col *= vec3(lig);



    fragColor = vec4( col, 1.0 );
}