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
const wireFs = require("./shaders/WireWave.fs.glsl");



class WirePlane {

    mesh:THREE.Mesh;
    geometry:THREE.PlaneBufferGeometry;
    material;
    uniform:{uTime:{value:number},uTranslate:{value:THREE.Vector3}};
    width:number;
    constructor(position:THREE.Vector3)
    {


        this.geometry = new THREE.PlaneBufferGeometry(10,1100,2,50);

        this.uniform = {
            uTime:{value:0.0},
            uTranslate:{value:null}
        }
        this.material = new THREE.ShaderMaterial({
            vertexShader:wireVs,
            fragmentShader:wireFs,
            uniforms:this.uniform
        });
        this.mesh = new THREE.Mesh(this.geometry,this.material);

        this.mesh.position.set(position.x,position.y,position.z);

        // this.mesh = new THREE.
    }

    update(time)
    {
        this.uniform.uTime.value = time;
        this.mesh.position.add(new THREE.Vector3(5,0,0));
        if(this.mesh.position.x > this.width/2)
        {
            this.mesh.position.x = -this.width/2;
        }

        this.uniform.uTranslate.value = this.mesh.position;
    }



}



export default class WireWave extends BaseScene {


    wires:WirePlane[] = [];
    constructor(sceneManger: SceneManage) {
        super(sceneManger);

        this.init();


    }


    get randomValue()
    {
        return Math.random() - 0.5;
    }
    init() {



        this.disableDebug();
        this.enableOffScreenRendering = true;


        this.mainCamera.position.set(0,0,GetCameraDistanceWithWidthSize(this.mainCamera,1920));



        let width = 1800;
        let size = 20;
        let x = - width/2;
        for(let i = 0; i < size; i++)
        {
            var m = new WirePlane(new THREE.Vector3(
                x + width/(size-1) * i,
                0,
                0,
            ));

            m.width = width;
            this.mainScene.add(m.mesh);

            this.wires.push(m);

        }

        //



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


        this.wires.forEach(w=>{
            w.update(time);
        })


    }

    render() {

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
