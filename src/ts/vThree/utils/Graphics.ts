import * as THREE from "three";
export function createGround(width: number, height: number, widthSegments:number, heightSegments:number): THREE.Mesh {
    const geo = new THREE.PlaneBufferGeometry(width,height,widthSegments,heightSegments);
    const mat = new THREE.MeshNormalMaterial();
    const ground = new THREE.Mesh(geo,mat);
    ground.rotateX(-Math.PI/2);
    return ground;
}


export function Base64ToTexture(base64image:any, callback?: () => void)
{
    const image = new Image();
    image.src = base64image;
    const texture = new THREE.Texture();
    texture.type = THREE.FloatType;
    texture.format = THREE.RGBAFormat;
    texture.image = image;
    image.onload = ()=> {
        texture.needsUpdate = true;
        if(callback) callback();
    };

    return texture;
}
