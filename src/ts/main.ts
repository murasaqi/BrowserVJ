import * as THREE from "three";

const DEBUG_BUILD = true;

 const style = require("../css/main.scss");

declare function require(x: string): any;
import PopupWindowManager from "./Scenes/PopUpWindowManager";
import SceneManager from "./vThree/SceneManager";
import TestScene from "./Scenes/TestScene";
import ErrorWindows from "./Scenes/ErrorWindows";
import WireWave from "./Scenes/WireWave";
import BgGradientScene from "./Scenes/BgGradientScene";
import IConWave from "./Scenes/iConWave";
import Bg02 from "./Scenes/Bg02";
import VaperWave from "./Scenes/VaperWave";
import MiloScene from "./Scenes/MiloScene";
import ErrorMessage from "./Scenes/ErrorMessage";
// import ParticleScene from "./Scenes/ParticleScene";

// resizeTo(1024   768, 600);
moveTo(0,0);
window.onload = function () {

  const p = new PopupWindowManager();

  //@ts-ignore
    window.worldResolution = new THREE.Vector2(window.innerWidth,window.innerHeight);
  const scenemanager = new SceneManager({
      debugCameraMode:true,
      developMode:true,
      resolution:{x:window.innerWidth,y:window.innerHeight},
      pixelRatio:window.devicePixelRatio
  });
  const scene = new TestScene(scenemanager,p);
  const sceneError = new ErrorWindows(scenemanager);
  const wireScene = new WireWave(scenemanager);
  const iconsScene = new IConWave(scenemanager);
  const vaperwave = new VaperWave(scenemanager);
  const milo = new MiloScene(scenemanager);
  const message = new ErrorMessage(scenemanager);

  const bg01 = new BgGradientScene(scenemanager);
  const bg02 = new Bg02(scenemanager);

  scenemanager.addScene(scene);
  scenemanager.addScene(sceneError);
  scenemanager.addScene(wireScene);
  scenemanager.addScene(iconsScene);
  scenemanager.addScene(vaperwave);
  scenemanager.addScene(milo);
  scenemanager.addScene(bg01);
  scenemanager.addScene(bg02);
  scenemanager.addScene(message);

    scenemanager.addbgScene(scene);
    scenemanager.addbgScene(sceneError);
    scenemanager.addbgScene(wireScene);
    scenemanager.addbgScene(iconsScene);
    scenemanager.addbgScene(vaperwave);
    scenemanager.addbgScene(milo);
    scenemanager.addbgScene(bg01);
    scenemanager.addbgScene(bg02);
  scenemanager.update();

};



