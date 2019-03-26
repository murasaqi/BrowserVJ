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
import RecordPosition from "./RecordPosition";


const tex = require("../imgs/error.png");

export default class ErrorWindows extends BaseScene {

    target:THREE.WebGLRenderTarget;

    material:THREE.MeshBasicMaterial;
    texture:THREE.Texture;

    seed:THREE.Vector3 = new THREE.Vector3(Math.random(),Math.random(),Math.random());
    curlNoise:CurlNoise;
    meshs:THREE.Mesh[] = [];
    recordPosition:RecordPosition;

    frameCount:number = 0;
    constructor(sceneManger: SceneManage) {
        super(sceneManger);

        this.init();
    }
    get randomValue()
    {
        return Math.random() - 0.5;
    }
    init() {


        this.curlNoise = new CurlNoise();
        this.disableDebug();

        this.mainCamera.position.set(0,50,GetCameraDistanceWithWidthSize(this.mainCamera,window.innerWidth));
        this.mainCamera.lookAt(new THREE.Vector3(0,0,0));
        this.initPostScene();

        this.material = new THREE.MeshBasicMaterial({color:0xffffff,map:Base64ToTexture(tex)});
        var geo = new THREE.PlaneBufferGeometry(294 ,140,1,1);

        for(let i = 0; i < 8; i++)
        {
            var m = new THREE.Mesh(geo,this.material);
            this.meshs.push(m);

            this.mainScene.add(m);
        }

        this.recordPosition = new RecordPosition(new THREE.Vector3(0,0,0));
        this.recordPosition.update(new THREE.Vector3(
            Math.random() * 500 -250,
            Math.random() * 500 -250,
            0
        ))



       }

    initPostScene()
    {
        this.target = createRenderTarget(window.innerWidth,window.innerHeight)
    }


    onClick = (e) => {
        // console.log(e);
    };


    onKeyDown = (e) => {

        console.log(e);
        if(e.key == "u")
        {
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

        // console.log("update");

        this.frameCount ++;
        let p = this.recordPosition.record[0].clone();

        var x = Math.cos(time) * 500 * (this.simplex.noise(time*0.1,0)+0.5);
        var y = Math.sin(time) * 400 * (this.simplex.noise(0,time*0.1)+0.8);



        var noise = this.curlNoise.getNoise(new THREE.Vector3(x,y,time).multiplyScalar(0.001)).multiplyScalar(100);
        // p.add(noise.multiplyScalar(20));
        if(this.frameCount % 3 != 0) return;
        this.recordPosition.update(new THREE.Vector3(
            x + noise.x,
            y + noise.y,
            0
        ));

        this.recordPosition.maxRecordCount = 200;
        if(this.recordPosition.record.length >= this.recordPosition.maxRecordCount)
        {
            for (let i = 0; i < this.meshs.length; i++)
            {
                let pos = this.recordPosition.record[i * 20];
                this.meshs[i].position.set(
                    pos.x,
                    pos.y,
                    pos.z
                )
            }
        }
    }

    render() {

        // this.renderer.autoClear = false;
        this.renderer.setClearAlpha(1);
        this.renderer.setClearColor(0x018282);
        if(this.frameCount % 3)this.renderer.render(this.mainScene,this.mainCamera,this.mainTarget);
        // this.render2Canvas(this.mainTarget.texture);
        // this.renderer.autoClear = true;
    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
