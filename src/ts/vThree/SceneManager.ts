'use strict';
import * as THREE from 'three'
import "imports-loader?THREE=three!three/examples/js/controls/OrbitControls.js";
import BaseScene from "./BaseScene";
import GUI from "./gui/Gui";

import Timer from "./utils/Timer";

const offScreenFs = require( "./shaderlibraly/offScreen.fs");
const offScreenVs = require( "./shaderlibraly/offScreen.vs");

export default class SceneManager{
    width:number;
    height:number;
    renderer:THREE.WebGLRenderer;
    debugCamera:THREE.PerspectiveCamera;
    debugCameraMode:boolean;
    activeCamera:THREE.PerspectiveCamera;
    gui:GUI;
    developMode:boolean;
    frameCount:number;
    scenes:BaseScene[];
    sceneNum:number;
    controls:THREE.OrbitControls = null;
    canvas:any;
    clock:THREE.Clock;
    timer:Timer;
    key_sceneNext = "ArrowRight";
    key_scenePrev = "ArrowLeft";
    canvasId:string;
    // offScreenTarget:THREE.WebGLRenderTarget;
    isAbsoluteResolution:boolean = false;
    absoluteResolution:THREE.Vector2 = new THREE.Vector2(0,0);

    offScreenFs:any;
    offScreenVs:any;
    dpr:number;
    constructor(parameter:{canvasId?:string,resolution?:{x:number,y:number},debugCameraMode?:boolean,developMode?:boolean, pixelRatio?:number})
    {

        this.canvasId =parameter.canvasId ? parameter.canvasId : null;
        this.offScreenFs = offScreenFs;
        this.offScreenVs = offScreenVs;
        this.timer = new Timer();

        if(this.canvasId)
        {

        }
        this.canvas = this.canvasId ? document.getElementById(this.canvasId) : null;



        if(parameter.resolution)
        {
            this.width = parameter.resolution.x;
            this.height = parameter.resolution.y;
            this.isAbsoluteResolution = true;
        }
        else
        {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }


        if(this.canvas)
        {
            this.renderer = new THREE.WebGLRenderer({
                preserveDrawingBuffer: true,antialias:true,alpha:true,canvas:this.canvas,
            });
        } else
        {
            this.renderer = new THREE.WebGLRenderer({
                preserveDrawingBuffer: true,antialias:true,alpha:true,
            });

            this.canvas = this.renderer.domElement;
            this.canvasId = "out";
            this.renderer.domElement.id = this.canvasId;
            document.body.appendChild( this.renderer.domElement );
        }
        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setClearAlpha(0.0);

        this.debugCamera = new THREE.PerspectiveCamera(70,this.width/this.height,0.1,10000);
        this.debugCameraMode = parameter.debugCameraMode ? parameter.debugCameraMode : false;
        this.developMode = parameter.developMode ? parameter.developMode : false;
        this.activeCamera = null;
        this.frameCount = 0;
        if(this.developMode)this.gui = new GUI(this);
        this.scenes = [];
        this.sceneNum = 0;
        this.clock = new THREE.Clock();
        this.clock.autoStart = true;
        this.clock.start();
        const pixelRatio = parameter.pixelRatio ? parameter.pixelRatio : null;
        this.dpr = parameter.pixelRatio;
        this.init(pixelRatio);


        // if(parameter.debugCameraMode)
        // {
            this.controls = new THREE.OrbitControls( this.debugCamera, this.renderer.domElement );
            // this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
            this.controls.dampingFactor = 0.25;
            // this.controls.screenSpacePanning = false;
            this.controls.minDistance = 10;
            this.controls.maxDistance = 1000;
        // }
    }

    init(pixelRatio?:number)
    {

        if(this.developMode)
        {
            window.addEventListener('resize',this.onWindowResize);
            window.addEventListener('keydown', this.onKeyDown.bind(this));
            window.addEventListener( 'click', this.onClick.bind(this), false );
            window.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('mouseup',this.onMouseUp);
            window.addEventListener('mousemove',this.onMouseMove);
        }
        this.debugCamera.position.set(0,0,100);
        if(pixelRatio) this.renderer.setPixelRatio(pixelRatio);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.setAbsoluteResolution(this.width, this.height);

    }

    setAbsoluteResolution(width:number, height:number)
    {
        let dpr = this.renderer.getPixelRatio();
        console.log(`dpr: ${dpr}`);
        this.absoluteResolution.set(width * dpr,height * dpr);
        this.debugCamera.aspect = this.absoluteResolution.x / this.absoluteResolution.y;
        this.debugCamera.updateProjectionMatrix();
        this.renderer.setSize( this.absoluteResolution.x,this.absoluteResolution.y );

    }

    disableAbsoluteResolution()
    {
        this.isAbsoluteResolution = false;
    }

    setDebugCameraPosition(v:THREE.Vector3)
    {
        this.debugCamera.position.set(v.x,v.y,v.z);
    }

    stopTimer()
    {
        this.timer.stop();
    }

    resetTimer()
    {
        this.timer.reset();
    }

    setTimerSpeed(value:number)
    {
        this.timer.setSpeed(value);
    }

    addScene(scene)
    {
        this.scenes.push(scene);
        this.cameraChange();
    }
    onMouseMove =(e)=>
    {
        this.currentScene.onMouseMove(e);
    }
    onMouseDown =(e)=>
    {
        this.currentScene.onMouseDown(e);
    }

    onMouseUp =(e)=>
    {
        this.currentScene.onMouseUp(e);
    }

    nextScene()
    {
        this.sceneNum++;
        this.checkSceneNum();
    }



    prevScene()
    {
        this.sceneNum++;
        this.checkSceneNum();
    }

    onKeyDown(e)
    {
        if(e.key == 'd')
        {
            this.toggleDebugCamera();
        }

        if(e.key == 's')
        {
            this.saveCanvas('image/png');
        }

        try {
            if (e.key == this.key_sceneNext) {
                this.nextScene();
            }
            if (e.key == this.key_scenePrev) {

                this.prevScene();
            }
        } catch (e)

        {
            console.log(e);
        }

        this.currentScene.onKeyDown(e);


    }

    checkSceneNum = () =>
    {
        if(this.sceneNum <0)
        {
            this.sceneNum = this.scenes.length-1;
        }

        if(this.sceneNum >= this.scenes.length)
        {
            this.sceneNum = 0;
        }

    };

    toggleDebugCamera()
    {
        this.debugCameraMode = !this.debugCameraMode;
        this.cameraChange();
    }

    enableDebugCameraMode()
    {
        this.debugCameraMode = true;
        this.cameraChange();

    }


    disableDebugCameraMode()
    {
        this.debugCameraMode = false;
        this.cameraChange();
    }

    cameraChange()
    {
        if(this.debugCameraMode)
        {
            this.activeCamera = this.debugCamera;
        }else
        {
            this.activeCamera = this.currentScene.mainCamera;
        }
    }

    onWindowResize=()=>{
        // this.resize(window.innerWidth,window.innerHeight);
    }
    resize =(width:number, height:number)=>
    {

        this.debugCamera.aspect = width / height;
        this.debugCamera.updateProjectionMatrix();
        let dpr = this.renderer.getPixelRatio();
        this.renderer.setSize( width, height );
        this.currentScene.onWindowResize(width,height);
    };

    onClick(e)
    {
        this.currentScene.onClick(e);
    }

    get currentScene():BaseScene
    {
        return this.scenes[this.sceneNum];
    }

    update = () =>
    {
        this.frameCount++;
        this.timer.update();
        // this.controls.update();
        // this.frameCount = this.frameCount % 60;
        requestAnimationFrame(this.update);

        this.currentScene.update(this.clock.getElapsedTime());

        if (this.debugCameraMode) {
            if(this.controls != null)this.controls.update();
            this.renderer.render(this.currentScene.mainScene, this.debugCamera);
        } else {
            this.currentScene.render();
        }
    };

    //
    // download(name) {
    //     var blob = new Blob([this.renderer.domElement.toDataURL()]);
    //
    //     var a = document.createElement("a");
    //     a.href = URL.createObjectURL(blob);
    //     a.target = '_blank';
    //     a.download = name;
    //     a.click();
    // }

    // currentSceneRenderTexture()
    // {
    //     return this.offScreenTarget.texture;
    // }

    saveCanvas(saveType){
        let imageType = "image/png";
        let fileName = "sample.png";
        // if(saveType === "jpeg"){
        //     imageType = "image/jpeg";
        //     fileName = "sample.jpg";
        // }
        // console.log(this.renderer.domElement.toDataURL());
        let canvas:any = document.getElementById(this.canvasId);
        // base64エンコードされたデータを取得 「data:image/png;base64,iVBORw0k～」
        let base64 = canvas.toDataURL();
        // console.log(base64);
        // base64データをblobに変換
        let blob = this.Base64toBlob(base64);
        // blobデータをa要素を使ってダウンロード
        this.saveBlob(blob, fileName);
    }

    Base64toBlob(base64)
    {
        // カンマで分割して以下のようにデータを分ける
        // tmp[0] : データ形式（data:image/png;base64）
        // tmp[1] : base64データ（iVBORw0k～）
        let tmp = base64.split(',');
        // base64データの文字列をデコード
        let data = atob(tmp[1]);
        // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
        let mime = tmp[0].split(':')[1].split(';')[0];
        //  1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
        let buf = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            buf[i] = data.charCodeAt(i);
        }
        // blobデータを作成
        let blob = new Blob([buf], { type: mime });
        return blob;
    }

// 画像のダウンロード
    saveBlob(blob, fileName)
    {
        let url = window.URL;
        // ダウンロード用のURL作成
        let dataUrl = url.createObjectURL(blob);
        // イベント作成
        let event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        // a要素を作成
        let a:any = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
        // ダウンロード用のURLセット
        a.href = dataUrl;
        // ファイル名セット
        a.download = fileName;
        // イベントの発火
        a.dispatchEvent(event);
    }

    toBlob(base64) {
        var bin = atob(base64.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        try{
            var blob = new Blob([buffer.buffer], {
                type: 'image/png'
            });
        }catch (e){
            return false;
        }
        return blob;
    }
}
