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

const wireVs = require("../vThree/shaderlibraly/sample.vs.glsl");
const wireFs = require("./shaders/vaperwaveGroound.fs.glsl");

const groundTex = require("../imgs/wire_bw.jpg");


export default class MiloScene extends BaseScene {



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


        this.material = new THREE.MeshNormalMaterial();
        this.material.onBeforeCompile =  ( shader )=> {
            shader.uniforms.time = { value: 0 };
            shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                [
                    'float theta = sin( time + position.y*5. ) / 1.0;',
                    'float c = cos( theta );',
                    'float s = sin( theta );',
                    'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
                    'vec3 transformed = vec3( position ) * m;',
                    'vNormal = vNormal * m;'
                ].join( '\n' )
            );
            this.materialShader = shader;
        };


        // var loader = new THREE.OBJLoader( manager );
        this.objLoader.load( 'models/milo.obj',  ( obj )=> {

            console.log(obj);
            //@ts-ignore
            obj.children[0].material = this.material;
            //@ts-ignore
            this.mesh = obj.children[0];


            this.mesh.translateY(-1);
            obj.scale.setScalar(50);
            this.mainScene.add(obj);
        });

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

        // this.wireGround.uniforms.uTime.value = time;


        if(this.materialShader)this.materialShader.uniforms.time.value = time % 3 < 1.5 ? 0 : Math.PI/2.;
        if(this.mesh)
        {
            this.mesh.rotateOnAxis(new THREE.Vector3(0,1,0).normalize(), time*0.0005);
        }
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
