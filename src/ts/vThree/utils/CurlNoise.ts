
import * as THREE from "three";
import Simplex from "perlin-simplex";


export default class CurlNoise
{

    simplex:Simplex;
    constructor()
    {
        this.simplex = new Simplex();
    }

    snoiseVec3( x:THREE.Vector3 ){

        const s  = this.simplex.noise3d( x.x,x.y,x.z);
        const s1 = this.simplex.noise3d( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 );
        const s2 = this.simplex.noise3d( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 );
        const c = new THREE.Vector3( s , s1 , s2 );
        return c;

    }

    getNoise( p:THREE.Vector3 ){

        const e = .1;
        const dx = new THREE.Vector3( e   , 0.0 , 0.0 );
        const dy = new THREE.Vector3( 0.0 , e   , 0.0 );
        const dz = new THREE.Vector3( 0.0 , 0.0 , e   );

        const p_x0 = this.snoiseVec3( p.clone().sub(dx) );
        const p_x1 = this.snoiseVec3( p.clone().add(dx) );
        const p_y0 = this.snoiseVec3( p.clone().sub(dy) );
        const p_y1 = this.snoiseVec3( p.clone().add(dy) );
        const p_z0 = this.snoiseVec3( p.clone().sub(dz) );
        const p_z1 = this.snoiseVec3( p.clone().add(dz) );

        const x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
        const y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
        const z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

        const divisor = 1.0 / ( 2.0 * e );
        return new THREE.Vector3( x , y , z ).multiplyScalar(divisor).normalize();

    }
}

