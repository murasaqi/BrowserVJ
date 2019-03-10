const DEBUG_BUILD = true;

 // const style = require("../css/main.scss");

declare function require(x: string): any;
import SceneManager from "./vThree/SceneManager";
import TestScene from "./Scenes/TestScene";
// import ParticleScene from "./Scenes/ParticleScene";

class WebGL
{
    constructor()
    {
    }
    testScene:TestScene;
    // particleScene:ParticleScene;
    sceneManager:SceneManager;
    finishAnimationType:number = 0;
    isSp:boolean = false;

    init = (parameter:{canvasId:string,videoId:string, developMode?:boolean, debugCamera?:boolean,finishAnimationType?:number,width:number,height:number, isSp?:boolean})=>{
        console.log("init webgl");
        console.log(parameter);
        const animationType = parameter.finishAnimationType;
        this.finishAnimationType = parameter.finishAnimationType;
        this.isSp = parameter.isSp ? parameter.isSp : false;
        this.sceneManager = new SceneManager({canvasId:parameter.canvasId,developMode:parameter.developMode,debugCamera:parameter.debugCamera});
        console.log("canvas id: " + parameter.canvasId);
        this.testScene = new TestScene(this.sceneManager,animationType,parameter.width,parameter.height, parameter.videoId);
        this.testScene.sequencer.finishAnimationType = animationType;
        // this.particleScene = new ParticleScene(this.sceneManager);
        // this.finishAnimationType = parameter.finishAnimationType;
        this.sceneManager.addScene(this.testScene);
        // this.sceneManager.addScene(this.particleScene);
        this.sceneManager.update();
    };
    changeParticleScene =(duration:number,animationType:number) =>{
        console.log("start particleScene");
        this.testScene.changeParticleScene(duration,animationType);
    };
    nextState = (duration:number) =>{
        console.log("start next sequence");
        this.testScene.nextState(duration);
    };
    prevState = (duration:number) =>{
        console.log("start prev sequence");
        this.testScene.prevState(duration);
    };
    boxScale_zero=(duration:number)=>{
        console.log("start box scale zero");
        this.testScene.scaleOut(duration);
    }
    resize = (width:number,height:number) =>{
        console.log("start resize webgl");
        this.sceneManager.resize(width,height);
    }

    initSequence=(duration:number)=>
    {
        console.log("start init sequence");
        this.testScene.initSequence(duration);
    };
}
///@ts-ignore
window.webgl = new WebGL();

window.onload = function () {

    if(DEBUG_BUILD)
    {
        //@ts-ignore
        window.webgl.init({
            canvasId:"main",
            videoId:'videoTexture',
            developMode:true,
            debugCamera:false,
            finishAnimationType:-1,
            width:window.innerWidth,
            height:window.innerHeight,
            isSp:true

        });
    }
};



