import * as THREE from 'three';
import SceneManager from "../vThree/SceneManager";
import BaseScene from "../vThree/BaseScene";
import {createRenderTarget, createFullScreenTexturePlane} from "../vThree/OffScreenManager";
import {TweenMax, Power1, TimelineLite} from "gsap/TweenMax";
import CurlNoise from "../vThree/utils/CurlNoise";
import {GetCameraDistanceWithHeightSize, GetCameraDistanceWithWidthSize} from "../vThree/utils/CameraHelpers";
import SceneManage from "../vThree/SceneManager";
import PopUpWindowManager from "./PopUpWindowManager";

export default class TestScene extends BaseScene {

    popupWindowManager:PopUpWindowManager;
    constructor(sceneManger: SceneManage, popUpManager:PopUpWindowManager) {
        super(sceneManger);
        this.popupWindowManager = popUpManager;

        this.init();
    }

    init() {


            for (let i = 0; i < 100; i ++)
            {
                const geo = new THREE.BoxBufferGeometry(1,1,1);
                const mat = new THREE.MeshBasicMaterial({color:0xffffff * Math.random()});
                const mesh = new THREE.Mesh(geo,mat);
                mesh.position.set(
                    Math.random() * 10 -5,
                    Math.random() * 10 - 5,
                    Math.random() * -10,
                );


                // console.log(mesh);
                this.mainScene.add(mesh);
            }

            this.mainCamera.position.set(0,0,0);

       }


    onClick = (e) => {
        // console.log(e);
    };


    onKeyDown = (e) => {

        console.log(e);
        if(e.key == "u")
        {
            this.popupWindowManager.popUps[0].setImg(this.sceneManager.canvas.toDataURL())
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

    }

    render() {
        this.renderer.render(this.mainScene,this.mainCamera);
    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
