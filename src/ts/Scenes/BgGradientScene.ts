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

const wireVs = require("./shaders/BasicVertex.vs.glsl");
const bgFs = require("./shaders/Bg01.fs.glsl");
const crt = require("./shaders/TVCRTPixels.fs.glsl");
const chromatic = require("./shaders/chromaticAberration.fs.glsl");

const gradImage = require("../imgs/grad00.jpg");







export default class BgGradientScene extends BaseScene {


    uniforms:any;

    gradTex:THREE.Texture;
    constructor(sceneManger: SceneManage) {
        super(sceneManger);

        this.init();


    }


    get randomValue()
    {
        return Math.random() - 0.5;
    }
    init() {


        // this.disableDebug();
        this.enableOffScreenRendering = true;

        this.gradTex = Base64ToTexture(gradImage);

        this.gradTex.repeat.set(8,8);
        this.mainCamera.position.set(0,0,GetCameraDistanceWithWidthSize(this.mainCamera,1920));



        this.uniforms = {
            uTime:{value:0.0},
            uTex:{value:this.gradTex},
            colorA:{value:new THREE.Color(0x00EDDB)},
            colorB:{value:new THREE.Color(0xA84DFF)},
        };
        this.create2DPostEffect("bg",bgFs,this.uniforms)



        this.create2DPostEffect("crt",crt,{iResolution:{value:new THREE.Vector2(
            window.innerWidth,
                    window.innerHeight
                )}})


        this.create2DPostEffect("chromatic",chromatic,{iResolution:{value:new THREE.Vector2(
                    window.innerWidth,
                    window.innerHeight
                )}});



    }

    initPostScene()
    {


    }


    onClick = (e) => {
        // console.log(e);
    };


    onKeyDown = (e) => {


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

        this.uniforms.uTime.value = time;
    }

    render() {

        // console.log("aaa");

        const morphingImage = this.useEffect("bg");
        const result = this.useEffect("crt",morphingImage);
        this.texture2Target(result,this.mainTarget);

    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
