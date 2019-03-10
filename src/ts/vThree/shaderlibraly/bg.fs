varying vec2 vUv;
uniform float time;

void main()	{
        vec2 p = vUv+vec2(-0.5,-0.5);
        float tau = 3.1415926535*2.0;
        float a = atan(p.x,p.y);
        float r = length(p)*2.0;
        vec2 uv = vec2(a/tau,r);
    	//get the color
    	float xCol = (uv.x - (time / 3.0)) * 3.0;
    	xCol = mod(xCol, 3.0);
    	vec3 horColour = vec3(0.25, 0.25, 0.25);

    	if (xCol < 1.0) {

    		horColour.r += 1.0 - xCol;
    		horColour.g += xCol;
    	}
    	else if (xCol < 2.0) {

    		xCol -= 1.0;
    		horColour.g += 1.0 - xCol;
    		horColour.b += xCol;
    	}
    	else {

    		xCol -= 2.0;
    		horColour.b += 1.0 - xCol;
    		horColour.r += xCol;
    	}

    	// draw color beam
    	uv = (2.0 * uv) - 1.0;
    	float beamWidth = (0.7+0.5*cos(uv.x*20.0*tau*0.15)) * abs(1.0 / (30.0 * uv.y))*1.;
    	vec3 horBeam = vec3(beamWidth);
    	gl_FragColor = vec4((( horBeam) * horColour), 1.0);
//    gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );


}