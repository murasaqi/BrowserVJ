import * as THREE from 'three';



class PopUpWindow
{

    position:THREE.Vector2;
    width = 400;
    height = 300;
    window:Window;
    imgDom:any;
    constructor()
    {
        this.position = new THREE.Vector2(500,500);
        this.window = window.open('window.html', 'mywindow1', 'width=400, status=no, height=300, menubar=no, toolbar=no,directions=no, scrollbars=no, title=no, location=no');
        this.window.moveTo(this.position.x,this.position.y);

        this.imgDom = new Image();
        this.imgDom.onload = ()=> {
            this.imgDom.id = "img";
            this.window.document.body.appendChild(this.imgDom);
        };

        console.log(this.imgDom);


    }

    setImg(base64:string)
    {

        this.imgDom.src = base64;


    }

    update()
    {

    }
}
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