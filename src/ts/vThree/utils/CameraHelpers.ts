import * as THREE from "three";
import {PerspectiveCamera} from "three";
export function GetCameraDistanceWithWidthSize(camera:THREE.PerspectiveCamera,  width:number) {
    if (camera == null || width <= 0.0) {
        return 0.0;
    }
    let frustumHeight = width / camera.aspect;
    return frustumHeight * 0.5 / Math.tan(camera.fov * 0.5 * THREE.Math.DEG2RAD);
}

export function GetCameraDistanceWithHeightSize(camera:THREE.PerspectiveCamera,  height:number) {
    if (camera == null || height <= 0.0) {
        return 0.0;
    }
    return height * 0.5 / Math.tan(camera.fov * 0.5 * THREE.Math.DEG2RAD);
}