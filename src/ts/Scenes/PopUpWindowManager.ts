import * as THREE from 'three';



class PopUpWindow
{

    position:THREE.Vector2;
    width = 400;
    height = 300;
    window:Window;
    constructor()
    {
        this.position = new THREE.Vector2(500,500);
        this.window = window.open('window.html', 'width='+this.width+', height='+this.height+', menubar=no, toolbar=no, scrollbars=yes');
        this.window.moveTo(this.position.x,this.position.y);
    }

    update()
    {

    }
}
export default class PopUpWindowManager
{
    popUp;
    constructor()
    {

        this.update();
        this.popUp = window.open('window.html', 'mywindow1', 'width=400, height=300, menubar=no, toolbar=no, scrollbars=yes');
    }
    init()
    {

    }

    update=()=>
    {
        let x = this.popUp.screenX;
        let y = this.popUp.screenY;


        requestAnimationFrame(this.update);
    };
}