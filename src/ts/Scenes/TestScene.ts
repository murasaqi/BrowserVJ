import * as THREE from 'three';
import SceneManager from "../vThree/SceneManager";
import BaseScene from "../vThree/BaseScene";
import {createRenderTarget, createRenderTargetPlane} from "../vThree/OffScreenManager";
import {TweenMax, Power1, TimelineLite} from "gsap/TweenMax";
import CurlNoise from "../vThree/utils/CurlNoise";
import {GetCameraDistanceWithHeightSize, GetCameraDistanceWithWidthSize} from "../vThree/utils/CameraHelpers";
import {Base64ToTexture} from "../vThree/utils/Graphics";
import SceneManage from "../vThree/SceneManager";
import PopUpWindowManager from "./PopUpWindowManager";
import ChildRenderer from "./ChildRenderer";
import set = Reflect.set;
import CarpetMesh from "./CarpetMesh";


const gradImage00 = require("../imgs/grad00.jpg");

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
    carpetMeshs:CarpetMesh[] = [];


    grad:THREE.Texture;
    constructor(sceneManger: SceneManage, popUpManager:PopUpWindowManager) {
        super(sceneManger);

        this.popupWindowManager = popUpManager;


        const loader = new THREE.TextureLoader();

        this.init();


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









        console.log(gradImage00);
        var light = new THREE.DirectionalLight(0xffffff,1);

        light.position.set(0,10,0);
        this.mainScene.add(light);

        this.mainScene.add(new THREE.AmbientLight(0xffffff,0.5));
        // this.mainCamera.aspect = window.innerWidth/window.innerHeight;

        this.mainCamera.position.set(0,50,GetCameraDistanceWithWidthSize(this.mainCamera,1024));
        this.mainCamera.lookAt(new THREE.Vector3(0,0,0));
        this.initPostScene();

        const loader = new THREE.TextureLoader();


        this.grad = loader.load("./529d55251b98dae3a508f995409467bf.jpg",()=>{

            for (let i = 0; i < 5; i++)
            {
                this.carpetMeshs.push(new CarpetMesh(this.mainScene,
                    new THREE.Vector3(
                        -300,
                        this.randomValue*30,
                        this.randomValue*200
                    ),
                    // new THREE.Vector3(Math.random() +0.1,Math.random() +0.1,Math.random() +0.1)
                    new THREE.Vector3(Math.random()*0.5 +0.1,Math.random() +0.2,Math.random()*0.5 +0.1),
                    this.grad
                ))

                // this.carpetMeshs[this.carpetMeshs.length-1].mesh.setRotationFromAxisAngle(new THREE.Vector3(this.randomValue,this.randomValue,this.randomValue).normalize(),this.randomValue * 360);

            }

        });



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


        this.carpetMeshs.forEach(c=> c.update());
        // this.carpetMeshs.forEach(c=> c.setTexture(this.grad));

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
