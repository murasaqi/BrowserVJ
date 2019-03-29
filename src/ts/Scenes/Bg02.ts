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
const ditheredGradientsFs = require("./shaders/DitheredGradients.fs.glsl");
const crt = require("./shaders/TVCRTPixels.fs.glsl");
const chromatic = require("./shaders/chromaticAberration.fs.glsl");

const gradImage = require("../imgs/grad00.jpg");


const noiseImage = require("../imgs/ditheredNoise.png");




export default class Bg02 extends BaseScene {


    uniforms:any;
    noiseTex:THREE.Texture;
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


        this.noiseTex = Base64ToTexture(noiseImage);

        this.noiseTex.wrapS = THREE.RepeatWrapping;
        this.noiseTex.wrapT = THREE.RepeatWrapping;

        this.uniforms = {
            iResolution:{value:new THREE.Vector2(
                    window.innerWidth,
                    window.innerHeight
                )},
            uTime:{value:0.0}
        };
        this.create2DPostEffect("ditheredGradientsFs",ditheredGradientsFs,this.uniforms);


        this.mainTarget.texture.wrapS = THREE.RepeatWrapping;
        this.mainTarget.texture.wrapT = THREE.RepeatWrapping;


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

        const grad = this.useEffect("ditheredGradientsFs",this.noiseTex);
        // const result = this.useEffect("crt",morphingImage);
        this.renderer.setRenderTarget(this.mainTarget);
        this.texture2Target(grad,this.mainTarget);

    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
