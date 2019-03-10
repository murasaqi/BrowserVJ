import dat from '../../../../node_modules/dat.gui'

import guiValues, {default as GuiValues} from './GuiValues'
import SceneManager from "../SceneManager";
// const setting = require('./JSON/gui.json');


export default class GUI{

    values:GuiValues;
    gui:any;
    sceneManager:SceneManager;
  constructor(manager:SceneManager)
    {

        this.sceneManager = manager;
        // console.log(setting);
        this.values = new guiValues();
        // this.gui = new dat.GUI();
        this.gui = new dat.GUI();
        this.gui.width = 400;
        // this.gui.remember(this.values);
        this.init();
    }

    init()
    {

        this.gui.add(this.values, 'finishAnimationType',0,6).step(1);

    }
}