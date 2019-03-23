import * as THREE from 'three';
import SceneManager from "../vThree/SceneManager";
import BaseScene from "../vThree/BaseScene";
import {createRenderTarget, createRenderTargetPlane} from "../vThree/OffScreenManager";
import {TweenMax, Power1, TimelineLite} from "gsap/TweenMax";
import CurlNoise from "../vThree/utils/CurlNoise";
import {GetCameraDistanceWithHeightSize, GetCameraDistanceWithWidthSize} from "../vThree/utils/CameraHelpers";
import SceneManage from "../vThree/SceneManager";
import PopUpWindowManager from "./PopUpWindowManager";
import ChildRenderer from "./ChildRenderer";
import set = Reflect.set;
import CarpetMesh from "./CarpetMesh";

export default class TestScene extends BaseScene {

    width = 1920;
    height = 1080;
    childRenderes:ChildRenderer[] = [];
    popupWindowManager:PopUpWindowManager;
    frameCount:number = 0;
    target:THREE.WebGLRenderTarget;
    resultCamera:THREE.OrthographicCamera;
    resultScene:THREE.Scene;
    resultPlane:THREE.Mesh;
    carpetMesh:CarpetMesh;
    constructor(sceneManger: SceneManage, popUpManager:PopUpWindowManager) {
        super(sceneManger);

        this.popupWindowManager = popUpManager;

        this.init();
        // this.initChildWindow();
    }

    initChildWindow()
    {
        for (let i = 0; i < 5; i++)
        {
            var popupwindow = this.popupWindowManager.addWindow();
            var w = new ChildRenderer(popupwindow,this);
            w.position = new THREE.Vector3(this.randomValue * 1200,this.randomValue * 700,this.mainCamera.position.z);
            this.childRenderes.push(w);
        }

    }

    get randomValue()
    {
        return Math.random() - 0.5;
    }
    init() {


        var light = new THREE.DirectionalLight(0xffffff,1);
        light.position.set(0,1,1);
        this.mainScene.add(light);


        // this.mainCamera.aspect = window.innerWidth/window.innerHeight;

        this.mainCamera.position.set(0,0,GetCameraDistanceWithWidthSize(this.mainCamera,1024));
        this.initPostScene();


        this.carpetMesh = new CarpetMesh(this.mainScene);

       }

    initPostScene()
    {

        this.resultScene = new THREE.Scene();
        var dpr = this.sceneManager.dpr;
        this.resultCamera = new THREE.OrthographicCamera(-window.innerWidth/2,window.innerWidth/2,window.innerHeight/2,-window.innerHeight/2,0.1,10000);
        this.resultCamera.position.set(0,0,100);
        this.target = createRenderTarget(window.innerWidth,window.innerHeight)

        this.resultPlane = createRenderTargetPlane(this.target.texture,window.innerWidth,window.innerHeight);
        this.resultPlane.position.set(0,0,0);
        this.resultScene.add(this.resultPlane);

    }


    onClick = (e) => {
        // console.log(e);
    };


    onKeyDown = (e) => {

        console.log(e);
        if(e.key == "u")
        {
            this.childRenderes[0].render();
            // this.popupWindowManager.popUps[0].setImg(this.sceneManager.canvas.toDataURL())
        }

};


    onMouseMove =(e)=>{


    };

    onWindowResize=(width, height)=>
    {

        this.renderer.setSize( width, height );

    }



    start01Animation(duration:number)
    {

    }

    startState00Animation()
    {

    }


    update(time: number) {

        this.frameCount ++;

        this.carpetMesh.update();
    }

    render() {
        this.renderer.render(this.mainScene,this.mainCamera,this.target);
        //@ts-ignore
        // this.resultPlane.material.map = this.target.texture;
        if(this.frameCount % 10 == 0)this.childRenderes.forEach(w=>w.render());
        this.renderer.render(this.resultScene,this.resultCamera);
        // this.render2Target()
        // this.renderer.render(this.mainScene,this.mainCamera);
    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
