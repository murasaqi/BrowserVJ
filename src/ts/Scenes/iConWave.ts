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

const wireVs = require("./shaders/BasicVertex.vs.glsl");
const bgFs = require("./shaders/Bg01.fs.glsl");
const crt = require("./shaders/TVCRTPixels.fs.glsl");
const chromatic = require("./shaders/chromaticAberration.fs.glsl");

const gradImage = require("../imgs/grad00.jpg");


const icon1 = require("../imgs/icon1.png");
const icon2 = require("../imgs/icon2.png");
const icon3 = require("../imgs/icon3.png");
const icon4 = require("../imgs/icon4.png");
const icon5 = require("../imgs/icon5.png");
const icon6 = require("../imgs/icon6.png");
const icon7 = require("../imgs/icon7.png");
const icon8 = require("../imgs/icon8.png");
const icon9 = require("../imgs/icon9.png");
const icon10 = require("../imgs/icon10.png");
const icon11 = require("../imgs/icon11.png");
const icon12 = require("../imgs/icon12.png");
const icon13 = require("../imgs/icon13.png");
const icon14 = require("../imgs/icon14.png");


class Icon
{
    textures:THREE.Texture[] = [];
    material:THREE.MeshBasicMaterial;
    mesh:THREE.Mesh;
    simplex:Simplex;
    constructor(width:number, position:THREE.Vector3, textures:THREE.Texture[])
    {
        // this.simplex = new Simplex();
        this.textures = textures;

        var geo = new THREE.PlaneBufferGeometry(width,width,2,2);
        this.material = new THREE.MeshBasicMaterial({color:0xffffff,map:textures[0]});

        this.mesh = new THREE.Mesh(geo,this.material);


        this.mesh.position.set(position.x,position.y,position.z);
    }


    update(time)
    {
        let t = time * 0.1;
        let scale = 0.001;
        let x = this.mesh.position.x * scale;
        let  y= this.mesh.position.y * scale;
        let noise = this.simplex.noise(x+t,y+t);

        let num = Math.floor( Math.abs(noise) * (this.textures.length - 0) ) + 0 ;


        this.material.map = this.textures[num];

        this.material.needsUpdate = true;
    }
}



export default class IConWave extends BaseScene {


    textures:THREE.Texture[] = [];
    camera:THREE.OrthographicCamera;
    icons:Icon[] = [];
    simplex:Simplex;
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
        this.simplex = new Simplex();

        this.textures.push(Base64ToTexture(icon1));
        this.textures.push(Base64ToTexture(icon2));
        this.textures.push(Base64ToTexture(icon3));
        this.textures.push(Base64ToTexture(icon4));
        this.textures.push(Base64ToTexture(icon5));
        this.textures.push(Base64ToTexture(icon6));
        this.textures.push(Base64ToTexture(icon7));
        this.textures.push(Base64ToTexture(icon8));
        this.textures.push(Base64ToTexture(icon9));
        this.textures.push(Base64ToTexture(icon10));
        this.textures.push(Base64ToTexture(icon11));
        this.textures.push(Base64ToTexture(icon12));
        this.textures.push(Base64ToTexture(icon13));
        this.textures.push(Base64ToTexture(icon14));


        let planeWidth = 30;

        let xGrid = 50;
        let zGrid = 30;


        let startx = -planeWidth * xGrid / 2;
        let starty = -planeWidth * zGrid /2;

        for(let x = 0; x < xGrid; x++)
        {
            for(let z= 0; z<zGrid; z++)
            {

                let i = new Icon(planeWidth,new THREE.Vector3(startx+x * planeWidth,starty + z*planeWidth,0),this.textures);
                this.icons.push(i);
                this.mainScene.add(i.mesh);
                i.simplex = this.simplex;
            }
        }


        this.camera = new THREE.OrthographicCamera(-window.innerWidth/2,window.innerWidth/2,window.innerHeight/2,-window.innerHeight/2,0,100);

        // this.disableDebug();
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


        this.icons.forEach(i=>i.update(time));

    }

    render() {

        // console.log("aaa");
        this.renderer.setRenderTarget(this.mainTarget);
        this.renderer.render(this.mainScene,this.camera,this.mainTarget);



    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
