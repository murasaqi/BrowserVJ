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
import Simplex from "perlin-simplex";
import "imports-loader?THREE=three!three/examples/js/loaders/GLTFLoader.js";

console.log(Simplex);

const vs = require("../vThree/shaderlibraly/sample.vs.glsl");
const fs = require("./shaders/message.fs.glsl");

const img = require("../imgs/notfound.jpg");


export default class ErrorMessage extends BaseScene {

    simplex:Simplex;
    materialShader:any = null;
    object:any;
    uniforms:any;
    material:any;
    mesh:THREE.Mesh = null;
    constructor(sceneManger: SceneManage) {
        super(sceneManger);
        this.init();
    }


    get randomValue()
    {
        return Math.random() - 0.5;
    }
    init() {


        var tex = Base64ToTexture(img);
        tex.wrapT = THREE.RepeatWrapping;
        tex.wrapS = THREE.RepeatWrapping;

        this.uniforms = {
            uTex:{value:tex},
            uTime:{value:0.}
        }

        this.material = new THREE.ShaderMaterial({
            vertexShader:vs,
            fragmentShader:fs,
            uniforms:this.uniforms,
            transparent:true
        });

        var geo = new THREE.PlaneBufferGeometry(1080,1080,2,2);


        this.mesh = new THREE.Mesh(geo,this.material);

        this.mainScene.add(this.mesh);

        this.mainCamera.position.set(0,0,GetCameraDistanceWithWidthSize(this.mainCamera,1080));

        this.enableOffScreenRendering = true;
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
        this.renderer.setRenderTarget(this.mainTarget);
        this.renderer.render(this.mainScene,this.mainCamera,this.mainTarget);

    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
