import * as THREE from 'three'
import PopUpWindow from "./PopUpWindow";

export default class ChildRenderer
{
    renderer:THREE.WebGLRenderer;
    canvas:HTMLElement;
    targetWindow:PopUpWindow;
    camera:THREE.PerspectiveCamera;
    scene:THREE.Scene;
    context:CanvasRenderingContext2D;
    constructor(targetPopupWindow:PopUpWindow,scene:THREE.Scene)
    {
        this.targetWindow = targetPopupWindow;
        this.renderer = this.renderer;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.targetWindow.width,this.targetWindow.height);
        this.scene = scene;
        document.body.appendChild( this.renderer.domElement );

        //@ts-ignore
        this.context = this.renderer.domElement.getContext( '2d' );
        this.camera = new THREE.PerspectiveCamera( 20,  this.targetWindow.width/this.targetWindow.height, 1, 10000 );
        this.camera.position.z = 0;
    }

    init()
    {

    }

    render()
    {
        this.renderer.render(this.scene,this.camera);

    }
}