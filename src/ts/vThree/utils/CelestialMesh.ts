declare function require(x: string): any;

import * as THREE from "three";

const celestialGeometryVs = require("../shaders/celestialGeometry.vs.glsl");
const envMap = require("../../../images/warped.jpg");
type GeoType = 'sphere' | 'box';

export default class CelestialMesh{
    mesh: THREE.Mesh;
    material: THREE.ShaderMaterial;
    envMaterial:THREE.MeshBasicMaterial;
    shape: GeoType;
    private _size: number;
    envTexture:THREE.Texture;
    constructor (shape: GeoType, size: number, fs: string) {
        this._size = size;
        this.setShader(fs);
        this.shape = shape;

        let geometry;

        switch (shape) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(this._size/2.,40,40);
                break;
            case 'box':
                geometry = new THREE.BoxGeometry(this._size, this._size, this._size, 40, 40 , 40);
                break;
        }

       ;
        this.envTexture = new THREE.Texture();
        const image = new Image();
        image.src = envMap;
        this.envTexture.image = image;
        image.onload = ()=> {
            this.envTexture.needsUpdate = true;
        };

        this.envMaterial = new THREE.MeshBasicMaterial({
            map:this.envTexture,
            side:THREE.BackSide,
        });

        this.mesh = new THREE.Mesh(geometry, this.material)
    }

    setShader(fs: string) {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                size: {
                    value: this.size
                }
            },
            fragmentShader: fs,
            vertexShader: celestialGeometryVs,
            side: THREE.BackSide,
            transparent: true
        });
    }

    // 連続的な呼び出し高負荷、アニメーション的なサイズの変更はmesh.scaleで
    set size(size:number) {
        this._size = size;

        this.setGeometry(this.shape);

        this.uniforms.size.value = this._size;
    }

    get size() {
        return this._size;
    }

    get uniforms() {
        return this.material.uniforms;
    }

    setGeometry(shape: GeoType) {
        this.mesh.geometry.dispose();
        switch (shape) {
            case 'sphere':
                this.mesh.geometry = new THREE.SphereGeometry(this._size/2.,40,40);
                break;
            case 'box':
                this.mesh.geometry = new THREE.BoxGeometry(this._size, this._size, this._size, 40, 40 , 40);
                break;
        }
    }
}