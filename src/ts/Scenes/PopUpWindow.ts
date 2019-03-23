import * as THREE from "three";

export default class PopUpWindow
{

    _position:THREE.Vector2 = new THREE.Vector2();
    width = 600;
    height = 400;
    window:Window;
    imgDom:any;
    constructor(id:number)
    {

        this.window = window.open('window.html', 'child'+id, 'width='+this.width + ', status=no, height=' + this.height + ', menubar=no, toolbar=no,directions=no, scrollbars=no, title=no, location=no');

        // this.position.set(0,0);

        this.imgDom = new Image();
        this.imgDom.onload = ()=> {
            this.imgDom.className = "img";
            this.window.document.body.appendChild(this.imgDom);
        };

        console.log(this.imgDom);

        // this.position = new THREE.Vector2(this.width/2 ,this.height/2);

    }


    set position(position:THREE.Vector2)
    {
        //@ts-ignore
        var resolution:THREE.Vector2 = window.worldResolution;
        this._position.set(
            position.x-this.width/2 +resolution.x/2,
            position.y-this.height/2 + resolution.y/2,
        );

        this.window.moveTo(this._position.x,this._position.y);
    }

    setImg(base64:string)
    {

        this.imgDom.src = base64;


    }

    update()
    {

    }
}