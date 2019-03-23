import * as THREE from 'three'
import PopUpWindow from "./PopUpWindow";
import {GetCameraDistanceWithHeightSize, GetCameraDistanceWithWidthSize} from "../vThree/utils/CameraHelpers";
import BaseScene from "../vThree/BaseScene";

export default class ChildRenderer
{
    renderer:THREE.WebGLRenderer;
    canvas:HTMLElement;
    targetWindow:PopUpWindow;
    camera:THREE.OrthographicCamera;
    scene:BaseScene;
    context:CanvasRenderingContext2D;
    private _position:THREE.Vector3 = new THREE.Vector3();
    constructor(targetPopupWindow:PopUpWindow,scene:BaseScene)
    {
        this.targetWindow = targetPopupWindow;
        this.renderer = this.renderer;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.targetWindow.width,this.targetWindow.height);
        this.scene = scene;
        this.renderer.domElement.style.zIndex = "-1";

        this.renderer.domElement.className = "hide";
        document.body.appendChild( this.renderer.domElement );

        //@ts-ignore
        this.context = this.renderer.domElement.getContext( '2d' );
        this.camera = new THREE.OrthographicCamera(-this.targetWindow.width/2,this.targetWindow.height/2,this.targetWindow.width/2,-this.targetWindow.height/2,0.1,1000);
        // this.camera.position.z = GetCameraDistanceWithWidthSize(this.camera,1920);
        //@ts-ignore
        // this.camera.position.set(-window.wordlResolution.x/2 + this.targetWindow.position.x + this,targetPopupWindow.width/2, -window.wordlResolution.y/2 + this.targetWindow.position.y + this,targetPopupWindow.height/2, 0,)

    }

    get position()
    {
        return this._position;
    }

    set position(position:THREE.Vector3)
    {
        this.camera.position.set(
            position.x,
            position.y,
            -2
        )

        this.targetWindow.position = new THREE.Vector2(position.x,position.y);
    }



    init()
    {

    }

    render()
    {
        this.renderer.render(this.scene.postEffectScene,this.scene.orthoCam);
        this.targetWindow.setImg(this.renderer.domElement.toDataURL());

    }
}