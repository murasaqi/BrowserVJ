import * as THREE from 'three';

import PopUpWindow from "./PopUpWindow";


export default class PopUpWindowManager
{
    popUps:PopUpWindow[] = [];
    constructor()
    {


        // this.popUps = window.open('window.html', 'mywindow1', 'width=400, height=300, menubar=no, toolbar=no, scrollbars=yes');

        this.update();
    }

    addWindow()
    {
        var w = new PopUpWindow(this.popUps.length);
        this.popUps.push(w);
        return w;
    }
    init()
    {

    }

    update=()=>
    {

        // let x = this.popUp.screenY;pUp.screenX;
        // let y = this.po

        requestAnimationFrame(this.update);
    };
}