import * as THREE from "three";

const DEBUG_BUILD = true;

 const style = require("../css/main.scss");

declare function require(x: string): any;
import PopupWindowManager from "./Scenes/PopUpWindowManager";
import SceneManager from "./vThree/SceneManager";
import TestScene from "./Scenes/TestScene";
// import ParticleScene from "./Scenes/ParticleScene";

// resizeTo(1024   768, 600);
moveTo(0,0);
window.onload = function () {

  const p = new PopupWindowManager();

  //@ts-ignore
    window.worldResolution = new THREE.Vector2(1920,1080);
  const scenemanager = new SceneManager({
      debugCameraMode:false,
      developMode:true,
      // resolution:{x:1440,y:900},
      pixelRatio:window.devicePixelRatio
  });
  const scene = new TestScene(scenemanager,p);

  scenemanager.addScene(scene);
  scenemanager.update();

};



