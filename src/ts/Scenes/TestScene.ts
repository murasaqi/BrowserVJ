import * as THREE from 'three';
import SceneManager from "../vThree/SceneManager";
import BaseScene from "../vThree/BaseScene";
import {createRenderTarget, createFullScreenTexturePlane} from "../vThree/OffScreenManager";
import {TweenMax, Power1, TimelineLite} from "gsap/TweenMax";
import CurlNoise from "../vThree/utils/CurlNoise";
import {GetCameraDistanceWithHeightSize, GetCameraDistanceWithWidthSize} from "../vThree/utils/CameraHelpers";
import Box from "./Box";
import Sequencer from "./Sequencer";
declare function require(x: string): any;
// shaders
//@ts-ignore
// const alphaMap = require("../../images/alpha.png");
// class State
// {
//     sequencerNum = 0;
//     isAnimation:boolean = false;
//     sequencerMessage:string = "";
//     maxStateNum = 2;
//     constructor()
//     {
//     }
//
//     nextState()
//     {
//         if(this.isAnimation == false) this.sequencerNum++;
//         if(this.sequencerNum > this.maxStateNum) this.sequencerNum = this.maxStateNum;
//     }
//
//     prevState()
//     {
//         if(this.isAnimation == false) this.sequencerNum--;
//         if(this.sequencerNum < 0) this.sequencerNum = 0;
//     }
// }

export default class TestScene extends BaseScene {

    path:string;
    width:number;
    height:number;
    video;
    texture: THREE.Texture;
    material;
    // mesh;
    mouseX = 0;
    mouseY = 0;
    windowHalfX;
    windowHalfY;
    cube_count: number;
    // meshes: THREE.Mesh[] = [];
    materials: THREE.MeshLambertMaterial[] = [];
    xgrid: number = 20;
    ygrid: number = 10;
    h;
    threshold = {value: 0.0};
    curlNoise: CurlNoise;
    textureResolution: THREE.Vector2;
    time_04:number = 0.0;
    // startPositions: THREE.Vector3[] = [];
    // rotateAxis: THREE.Vector3[] = [];
    // initialVelocities = [];
    // scales = [];
    // speedValues = [];
    logTextBox;
    centerNum = 0;
    boxs:Box[] = [];
    isVideoPlay: boolean;
    sequencer01UpdateSpeeds: Map<number, number>;
    isReverse:boolean = false;
    sequencer: Sequencer;
    centerBoxRotationSpeed = {value: 1.0};
    leftLight:THREE.DirectionalLight;
    rightLight:THREE.DirectionalLight;
    bottomLight:THREE.DirectionalLight;
    centerLight:THREE.DirectionalLight;
    topLight:THREE.DirectionalLight;
    ambientLight:THREE.AmbientLight;
    finishAnimationType:number = -1;
    initSequenceDuration:number = 1;
    videoId:string;
    canvasSize:THREE.Vector2;
    constructor(sceneManger: SceneManager, finishAnimationType:number ,width,height, videoId) {
        super(sceneManger);
        this.finishAnimationType = finishAnimationType;
        this.width = width;
        this.height = height;
        this.videoId = videoId;
        this.init(width,height);
    }

    init(width,height) {

        this.canvasSize = new THREE.Vector2(width,height);
        this.windowHalfY = this.height/2;
        this.windowHalfX = this.width/2;
        this.renderer.setClearColor(0xffffff);
        this.sequencer = new Sequencer();
        this.sequencer.finishAnimationType = this.finishAnimationType;
        this.grid.material.visible = false;
        this.sequencer01UpdateSpeeds = new Map<number, number>();

        this.onWindowResize(width,height);



        console.log("set finishAnimationType: " +this.finishAnimationType);
        this.curlNoise = new CurlNoise();

        this.centerLight = new THREE.DirectionalLight(0xffffff);
        this.centerLight.position.set(0, 0, 1).normalize();

        this.leftLight = new THREE.DirectionalLight(0xffffff);
        this.rightLight = new THREE.DirectionalLight(0xffffff);
        this.bottomLight = new THREE.DirectionalLight(0xffffff);
        this.topLight = new THREE.DirectionalLight(0xffffff);
        this.leftLight.position.set(1,0,0);
        this.rightLight.position.set(-1,0,0);
        this.bottomLight.position.set(0,-1,0);
        this.topLight.position.set(0,1,0);


        this.ambientLight = new THREE.AmbientLight(0xffffff);

        this.mainScene.add(this.ambientLight);
        this.centerLight.intensity = 0;
        this.topLight.intensity = 0;
        this.mainScene.add(this.centerLight);
        this.mainScene.add(this.topLight);
        // this.mainScene.add(this.bottomLight);
        //@ts-ignore
        this.video = document.getElementById(this.videoId);
        console.log(this.video);
        // this.logTextBox = document.getElementById('log');

        // this.video.play();

        const play = this.video.play();
        if (play instanceof Promise) {
            this.isVideoPlay = true;
            play.catch(error => {
                console.error('自動再生できません');
                this.isVideoPlay = false;
            });
        }

        this.texture = new THREE.VideoTexture(this.video);
        this.texture.minFilter = THREE.LinearFilter;

        //@ts-ignore
        if(window.webgl.isSp){
            this.xgrid = 10; this.ygrid = 6;
            console.log(this.xgrid,this.ygrid);
        }
        let i, j, ux, uy, ox, oy,
            geometry,
            xsize, ysize;
        ux = 1 / this.xgrid;
        uy = 1 / this.ygrid;
        this.textureResolution = new THREE.Vector2(1366, 768);
        xsize = this.textureResolution.x / this.xgrid;
        ysize = this.textureResolution.y / this.ygrid;
        var parameters = {color: 0xffffff, map: this.texture};
        this.cube_count = 0;
        for (i = 0; i < this.xgrid; i++)
            for (j = 0; j < this.ygrid; j++) {
                ox = i;
                oy = j;

                geometry = new THREE.BoxBufferGeometry(xsize, ysize, xsize);
                this.change_uvs(geometry, ux, uy, ox, oy);
                this.materials[this.cube_count] = new THREE.MeshLambertMaterial(parameters);
                this.material = this.materials[this.cube_count];
                this.material.hue = i / this.xgrid;
                this.material.saturation = 1 - j / this.ygrid;
                this.material.color.setHex(0xffffff);
                const mesh = new THREE.Mesh(geometry, this.material);
                if(this.finishAnimationType != -1)
                {
                    console.log("init particle scene setting");
                    this.sequencer.sequenceNum = 4;
                    this.sequencer.maxStateNum = 4;
                    this.sequencer.finishAnimationType = this.finishAnimationType;
                    mesh.position.x = Math.sin(Math.random()*Math.PI*2) * 800;
                    mesh.position.y = Math.sin(Math.random()*Math.PI*2) * 400;
                    mesh.position.z =  Math.sin(Math.random()*Math.PI*2) * 200;

                    mesh.scale.set(0.001,0.001,0.001);
                } else
                {

                    console.log("init top scene setting");
                    mesh.position.x = (i - (this.xgrid - 1) / 2) * xsize;
                    mesh.position.y = (j - (this.ygrid - 1) / 2) * ysize;
                    mesh.position.z = 0;

                }

                const box = new Box(this,mesh,this.threshold,this.textureResolution,this.simplex,this.curlNoise);

                if (i == Math.ceil(this.xgrid / 2) && j == Math.ceil(this.ygrid / 2)) {
                    this.centerNum = this.cube_count;
                    box.isCenter = true;
                }

                box.startPosition = new THREE.Vector3(
                    (i - (this.xgrid - 1) / 2) * xsize,
                (j - (this.ygrid - 1) / 2) * ysize,
                0
                );
                box.initialVelocity = 1.0;
                box.startInitialVelocity = box.initialVelocity;
                box.rotateAxis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
                box.startRotateAxis = box.rotateAxis;
                box.scale = 1;
                box.speed = (Math.random() * 0.5 + 1.0);
                box.startSpeed = box.speed;
                box.sequencer = this.sequencer;
                box.id = this.cube_count;
                box.maxBoxCount = this.xgrid * this.ygrid;
                box.canvasSize = this.canvasSize;
                //@ts-ignore
                mesh.dx = 0.001 * (0.5 - Math.random());
                //@ts-ignore
                mesh.dy = 0.001 * (0.5 - Math.random());
                this.boxs.push(box);
                this.mainScene.add(mesh);
                this.cube_count += 1;


            }

        this.mainCamera.near = 20;

        if(this.finishAnimationType != -1) {
            this.nextState(2);
            this.crossFadeLight(0,0.8);
            this.mainCamera.position.z = GetCameraDistanceWithWidthSize(this.mainCamera, 1366);
        } else
        {
            this.mainCamera.position.z = GetCameraDistanceWithWidthSize(this.mainCamera, 1366*1.2);
        }

        // this.onWindowResize(width,height);
    }

    change_uvs(geometry, unitx, unity, offsetx, offsety) {
        var uvs = geometry.attributes.uv.array;
        for (var i = 0; i < uvs.length; i += 2) {
            uvs[i] = (uvs[i] + offsetx) * unitx;
            uvs[i + 1] = (uvs[i + 1] + offsety) * unity;
        }
    }

    onClick = (e) => {
        // console.log(e);
    };

    scaleOut=(duration)=>
    {

        this.boxs.forEach(value => value.scaleZero_random(duration));
        TweenMax.to(this.mainScene.rotation,duration,{
            x:0,
            y:0,
            z:0
        });
    }
    changeParticleScene =(duration:number, animationType:number)=>
    {

        this.crossFadeLight(1,0.8);
        this.sequencer.maxStateNum = 4;
        this.sequencer.sequenceNum = 4;
        this.sequencer.finishAnimationType = animationType;

        // console.log(this.sequencer.sequenceNum);
        // this.sequencer.finishAnimationType = animationType;
        this.nextState(duration);
    };

    onKeyDown = (e) => {

        console.log(e);


        if (e.code == "Space" && this.sequencer.isAnimation == false) {
            this.nextState(2,);
        }

        switch (this.sequencer.sequenceNum)
        {
            case 0:


        }

        if(e.key == "1")
        {
            this.startAnimation04(1)
        }

        if(e.key == "2")
        {

            this.startAnimation05(1)
        }

        if(e.key == "3")
        {

            this.startAnimation06(1)
        }

        if(e.key == "4")
        {

            this.startAnimation07(1)
        }

        if(e.key == "5")
        {

            this.startAnimation08(1)
        }
    };

    startAnimation04(duration:number)
    {
        this.boxs.forEach(value => value.startAnimation04(duration));

        this.time_04 = 0.;

        TweenMax.to(this.mainScene.rotation,1,{
            // x:-Math.PI/3,
            x:0,
            y:0,
            z:Math.PI/6,
        });

        this.mainScene.fog = new THREE.Fog(0xffffff, 99999, 9999999);
        this.sequencer.sequenceNum = 4;
    }


    startAnimation05(duration:number)
    {
        this.boxs.forEach(value => value.startAnimation05(1));
        this.time_04 = 0.;
        TweenMax.to(this.mainScene.rotation,duration,{
            // x:-Math.PI/3,
            x:0,
            y:0,
            z:0.,
        });

        this.mainScene.fog = new THREE.Fog(0xffffff, 99999, 9999999);
        this.sequencer.sequenceNum = 5;
    }


    startAnimation06(duration:number)
    {
        if(this.sequencer.sequenceNum >= 3)
        {
            this.boxs.forEach(value => value.startAnimation06(duration));
        }
        this.time_04 = 0.;
        TweenMax.to(this.mainScene.rotation,duration,{
            x:0,
            y:0.,
            z:0,
            onComplete:()=>{
                this.mainScene.fog = new THREE.Fog(0xffffff, 0, 4000);
            }
        });
        this.sequencer.sequenceNum = 6;
    }

    startAnimation07(duration:number) {

        this.sequencer.isAnimation = true;
        this.time_04 = 0.;
        this.sequencer.sequenceNum = 999;
        this.boxs.forEach(value => value.scaleZero_random(duration * 0.3));
        TweenMax.delayedCall(duration * 0.3,()=>{
            this.sequencer.sequenceNum = 7;

            this.boxs.forEach(value => value.startAnimation07(duration));
            TweenMax.to(this.mainScene.rotation, duration, {
                x: Math.PI / 5,
                y: 0.,
                z: -Math.PI / 6,
            });
        });
        TweenMax.delayedCall(duration*1.3,()=>{
            this.sequencer.isAnimation = false;
        })
        this.mainScene.fog = new THREE.Fog(0xffffff, 99999, 9999999);
    }

    startAnimation08(duration:number) {
        this.time_04 = 0.;
        this.boxs.forEach(value => value.startAnimation08(2));
        this.sequencer.sequenceNum = 8;
        TweenMax.to(this.mainScene.rotation,2,{
            x:0.,
            y:0.,
            z:0.,
            onComplete:()=>{
                this.mainScene.fog = new THREE.Fog(0xffffff, 0, 3000);
            }
        });
    }


    startAnimation09(duration:number) {
        this.time_04 = 0.;
        this.boxs.forEach(value => value.startAnimation09(duration));
        this.sequencer.sequenceNum = 9;
        this.sequencer.isAnimation = true;
        TweenMax.delayedCall(duration,()=>{
            this.sequencer.isAnimation = false;
        });
        TweenMax.to(this.mainScene.rotation,2,{
            x:0.,
            y:0.,
            z:0.,
            onComplete:()=>{
                this.mainScene.fog = new THREE.Fog(0xffffff, 0, 4000);
            }
        });
    }



    nextState =(duration: number)=> {
        this.isReverse = false;
        this.sequencer.nextState();
        console.log("start next animation:" +this.sequencer.sequenceNum);
        switch (this.sequencer.sequenceNum) {
            case 1:
                this.boxs.forEach((value, index, array) => value.initValues());
                this.start01Animation(duration);
                this.crossFadeLight(duration,0.8);
                break;
            case 2:
                this.boxs.forEach((value, index, array) => value.startAnimation02(1));
                break;
            case 3:
                this.time_04= 0;
                // this.crossFadeLight(duration,0.);
                this.boxs.forEach((value, index, array) => value.startAnimation03(1));
                break;
            case 4:
                this.startAnimation04(duration);
                break;
            case 5:
                this.startAnimation05(duration);
                break;
            case 6:
                this.startAnimation06(duration);
                break;
            case 7:
                this.startAnimation07(duration);
                break;
            case 8:
                this.startAnimation08(duration);
                break;
            case 9:
                this.startAnimation09(duration);
                break;

        }
    }


    prevState =(duration: number)=> {

        this.isReverse = true;
        this.sequencer.prevState();

        console.log("start back animation:" +this.sequencer.sequenceNum);
        switch (this.sequencer.sequenceNum) {
            case 0:
                console.log("sequence 0 duration: " + duration);
                this.initSequenceDuration = duration;
                this.boxs.forEach((value, index, array) => value.isTween = false);
                this.threshold.value =1.;
                TweenMax.to(this.threshold,duration,{
                    value:0,
                    onUpdate:()=>{console.log(this.threshold.value)},
                    onComplete:()=>{
                    }
                });
                TweenMax.to(this.mainCamera.position,duration*0.3, {
                    z: GetCameraDistanceWithWidthSize(this.mainCamera, 1366*1.2)

                });
                this.crossFadeLight(duration,1);
                break;
            case 1:
                this.boxs.forEach((value, index, array) => value.startReveseAnimation01(1));
                break;
            case 2:
                // this.crossFadeLight(duration*0.2,1.);
                this.boxs.forEach((value, index, array) => value.startAnimation02(1));
                break;
        }
    }

    onMouseMove =(e)=>{

        this.mouseX = ( e.clientX - this.windowHalfX );
        this.mouseY = ( e.clientY - this.windowHalfY ) * 0.3;
    };

    onWindowResize=(width, height)=>
    {
        this.windowHalfX = width / 2;
        this.windowHalfY = height / 2;
        this.mainCamera.aspect = width / height;
        this.mainCamera.updateProjectionMatrix();
        console.log(width,height);
        this.renderer.setSize( width, height );

        if(this.sequencer.sequenceNum != 0) {
            this.mainCamera.position.z = GetCameraDistanceWithWidthSize(this.mainCamera, 1366);
        } else
        {
            this.mainCamera.position.z = GetCameraDistanceWithWidthSize(this.mainCamera, 1366*1.2);
        }


    }



    start01Animation(duration:number)
    {


        this.sequencer.isAnimation = true;
        this.threshold.value= 0.0;
        TweenMax.to(this.mainCamera.position,duration, {
            z: GetCameraDistanceWithWidthSize(this.mainCamera, 1366)

        });
        TweenMax.to(this.threshold,duration,{
            value:1.0,
            onComplete:()=>{
                this.sequencer.isAnimation = false;

            }
        });
    }

    startState00Animation()
    {
        this.sequencer.isAnimation = true;
        this.threshold.value = 0.0;
        // this.reset();
        TweenMax.to(this.threshold,1.,{
            value:1.0,
            onComplete:()=>{
                this.sequencer.isAnimation = false;
            }
        });
    }


    crossFadeLight(duration:number, value:number, delay:number = 0.)
    {
        const lightIntencity = {value:1.0-value};

        TweenMax.to(lightIntencity,duration*0.1,{
            value:value,
            delay:delay,
            onUpdate:()=>{
                this.ambientLight.intensity = lightIntencity.value;
                this.centerLight.intensity = 1.0-lightIntencity.value;
                this.topLight.intensity = (1.0 - lightIntencity.value) * 0.5;
                // this.rightLight.intensity = lightIntencity.value;
            }
        });
    }

    initSequence=(duration:number)=>
    {
        this.initSequenceDuration = duration;
        this.sequencer.sequenceNum = 1;
        this.prevState(duration);
    };

    update(time: number) {

        if(this.sceneManager.developMode)this.sequencer.finishAnimationType = this.sceneManager.gui.values.finishAnimationType;

        this.renderer.setClearColor(0xffffff);

        if(!this.isVideoPlay)
        {

            const play = this.video.play();
            if (play instanceof Promise) {
                this.isVideoPlay = true;
                this.video.autoplay = true;
                this.video.loop = true;
                play.catch(error => {
                    console.error('自動再生できません');
                    this.isVideoPlay = false;
                });
            }
        } else
        {
            // console.log(this.video.currentTime, this.video.duration);

        }

        // this.logTextBox.innerHTML = this.video.ended + " " + this.video.currentTime + " " + this.video.duration;
        // if(this.video.ended )
        // {
        //     this.video.pause();
        //     this.video.currentTime = 0;
        //     // this.isVideoPlay = false;
        //     this.video.play();
        // }
        // switch (this.sequencer.sequenceNum)
        // {
        //
        // }


        // console.log(this.sequencer.isAnimation);


        // console.log("update sequence: " + this.sequencer.sequenceNum);
        switch (this.sequencer.sequenceNum)
        {

            case 0:
                if(this.isReverse)
                    this.boxs.forEach((value) => value.updateInitAnimation(this.initSequenceDuration));
                break;
            case 1:
                // this.boxs.forEach(value => value.update01());
                this.boxs.forEach(value => value.update01());

                break;
            case 2:
                this.boxs.forEach(value => value.update02());
                break;
            case 3:

                if(this.boxs[0].isTween == false)
                {
                    this.boxs.forEach(value => value.randomRotation(4));
                }
                this.boxs.forEach(value => value.update03(true));
                break;

            case 4:
                if(this.boxs[this.boxs.length-1].isTween == false)
                {
                    this.time_04 +=0.01;
                    this.boxs.forEach(value => value.update04(this.time_04));
                }
                break;
            case 5:
                // console.log("update05");
                this.time_04 +=0.08;
                this.boxs.forEach(value => value.update05(this.time_04));

                break;

            case 6:
                // console.log("update05");
                if(this.boxs[this.boxs.length-1].isTween) break;
                this.time_04 +=0.002;
                this.boxs.forEach(value => value.update06(this.time_04));

                break;

            case 7:

                if(this.sequencer.isAnimation == false){
                    this.time_04 +=0.01;
                }
                this.boxs.forEach(value => value.update07(this.time_04,this.sequencer.isAnimation == false));

                break;
            case 8:
                this.time_04 +=0.01;
                this.boxs.forEach(value => value.update08(this.time_04));

                break;

            case 9:
                if(this.sequencer.isAnimation == false)
                {
                    this.time_04 +=0.005;
                    // this.mainScene.rotation.set(
                    //     Math.cos(Math.PI/2 + this.time_04*0.12),
                    //     0,
                    //     Math.sin(this.time_04*0.1)
                    // );
                    this.boxs.forEach(value => value.update09(this.time_04));

                }
                break;
        }
    }

    render() {
        const time = Date.now() * 0.001;
        this.renderer.render(this.mainScene,this.mainCamera);
    }

    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
