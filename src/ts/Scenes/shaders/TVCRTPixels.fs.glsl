
uniform sampler2D uTex;
#define PIXELSIZE 10.0
uniform vec2 iResolution;
void main() {
    vec2 cor;

    cor.x =  gl_FragCoord.x/PIXELSIZE;
    cor.y = (gl_FragCoord.y+PIXELSIZE*1.5*mod(floor(cor.x),2.0))/(PIXELSIZE*3.0);

    vec2 ico = floor( cor );
    vec2 fco = fract( cor );

    vec3 pix = step( 1.5, mod( vec3(0.0,1.0,2.0) + ico.x, 3.0 ) );
    vec3 ima = texture2D( uTex,PIXELSIZE*ico*vec2(1.0,3.0)/iResolution.xy ).xyz;

    vec3 col = pix*dot( pix, ima );

    col *= step( abs(fco.x-0.5), 0.4 );
    col *= step( abs(fco.y-0.5), 0.4 );

    col *= 1.2;
    gl_FragColor = vec4( col, 1.0 );
}
