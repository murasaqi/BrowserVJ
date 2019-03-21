import * as THREE from 'three';

import PopUpWindow from "./PopUpWindow";


export default class PopUpWindowManager
{
    popUps:PopUpWindow[] = [];
    constructor()
    {


        // this.popUps = window.open('window.html', 'mywindow1', 'width=400, height=300, menubar=no, toolbar=no, scrollbars=yes');
        this.popUps.push(new PopUpWindow());
        this.update();
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