import * as THREE from 'three'
const offScreenFs = require( "./shaderlibraly/offScreen.fs");
const offScreenVs = require( "./shaderlibraly/offScreen.vs");

export function createRenderTarget(width: number, height: number, type?:number): THREE.WebGLRenderTarget {

    return new THREE.WebGLRenderTarget(width, height, {
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        format:THREE.RGBAFormat,
        type:type ? type : THREE.UnsignedByteType
    });
}
export function createFullScreenTexturePlane(texture:THREE.Texture,fs?:any): THREE.Mesh {
    const geo = new THREE.PlaneBufferGeometry(2,2);
    const uniforms = { uTex: { type: "t", value: texture } };
    const mat = new THREE.ShaderMaterial({
        uniforms:uniforms,
        vertexShader: offScreenVs,
        fragmentShader:fs ? fs :offScreenFs,
        transparent:true
    });

    return new THREE.Mesh(geo,mat);

}


export function createRenderTargetPlane(texture:THREE.Texture,width:number,height:number): THREE.Mesh {
    const geo = new THREE.PlaneBufferGeometry(width,height);
    const mat = new THREE.MeshBasicMaterial({
        transparent:true,
        map:texture
    });

    return new THREE.Mesh(geo,mat);

}


export function createCustumShaderPlane(vs:any,fs:any): THREE.Mesh {
    const geo = new THREE.PlaneBufferGeometry(2,2);
    const uniforms = { time: { value: 0.0 } };
    const mat = new THREE.ShaderMaterial({
        uniforms:uniforms,
        vertexShader: vs,
        fragmentShader:fs,
        transparent:true
    });

    return new THREE.Mesh(geo,mat);

}

