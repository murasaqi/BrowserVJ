const DEBUG_BUILD = true;

 const style = require("../css/main.scss");

declare function require(x: string): any;
import PopupWindowManager from "./Scenes/PopUpWindowManager";
import SceneManager from "./vThree/SceneManager";
import TestScene from "./Scenes/TestScene";
// import ParticleScene from "./Scenes/ParticleScene";

window.onload = function () {

  const p = new PopupWindowManager();

  const scenemanager = new SceneManager({
      debugCameraMode:false,
      developMode:true,
      pixelRatio:1
  });
  const scene = new TestScene(scenemanager);

  scenemanager.addScene(scene);
  scenemanager.update();

};



