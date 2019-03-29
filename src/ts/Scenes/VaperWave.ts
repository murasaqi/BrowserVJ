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

console.log(Simplex);

const wireVs = require("../vThree/shaderlibraly/sample.vs.glsl");
const wireFs = require("./shaders/vaperwaveGroound.fs.glsl");

const groundTex = require("../imgs/wire_bw.jpg");


class WireFrameGround
{
    mesh:THREE.Mesh;
    uniforms:any;
    constructor()
    {

        const tex = Base64ToTexture(groundTex)

        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.magFilter = THREE.LinearFilter;
        tex.minFilter = THREE.LinearMipMapLinearFilter;

        this.uniforms = {
            uTex:{value:tex},
            colorA:{value:new THREE.Color(0xBD00C1)},
            colorB:{value:new THREE.Color(0x0089C3)},
            uTime:{value:0.}
        };
        let geo = new THREE.PlaneBufferGeometry(1000,1000,1,1);
        let mat = new THREE.ShaderMaterial({
            vertexShader:wireVs,
            fragmentShader:wireFs,
            uniforms:this.uniforms,
            transparent:true

        });
        this.mesh = new THREE.Mesh(geo,mat);

        this.mesh.rotateX(-Math.PI/2);

    }

}

export default class VaperWave extends BaseScene {



    simplex:Simplex;
    wireGround:WireFrameGround;
    constructor(sceneManger: SceneManage) {
        super(sceneManger);



        this.init();


    }


    get randomValue()
    {
        return Math.random() - 0.5;
    }
    init() {



        this.wireGround = new WireFrameGround();

        this.mainScene.add(this.wireGround.mesh);

        this.enableOffScreenRendering = true;
        this.disableDebug();

        this.mainCamera.position.set(0,50,0);


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

        this.wireGround.uniforms.uTime.value = time

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
