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
// import ParticleScene from "./Scenes/ParticleScene";

// resizeTo(1024   768, 600);
moveTo(0,0);
window.onload = function () {

  const p = new PopupWindowManager();

  //@ts-ignore
    window.worldResolution = new THREE.Vector2(1920,1080);
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

  const bg01 = new BgGradientScene(scenemanager);
  const bg02 = new Bg02(scenemanager);

  scenemanager.addScene(scene);
  scenemanager.addScene(sceneError);
  scenemanager.addScene(wireScene);
  scenemanager.addScene(iconsScene);
  scenemanager.addScene(vaperwave);
  scenemanager.addScene(milo);
  scenemanager.addbgScene(bg02);

  scenemanager.addbgScene(bg01);
  scenemanager.addbgScene(iconsScene);
  scenemanager.addbgScene(bg02);
  scenemanager.addbgScene(vaperwave);
  scenemanager.addbgScene(sceneError);
  scenemanager.addbgScene(wireScene);
  scenemanager.addbgScene(iconsScene);
  scenemanager.addbgScene(milo);
  scenemanager.update();

};



