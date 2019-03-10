

class ChildWindow
{

    width = 400;
    height = 300;
    time:number = 0.;
    constructor()
    {

        // this.update();

    }

    init()
    {

    }

    update =()=>
    {
        this.time += 0.01;

        console.log(window.parent.screen.availWidth);
        console.log(window.parent.screen.width);

        this.width = 400 + Math.sin(this.time) * 100;
        this.height = 300 + Math.cos(Math.PI/2 + this.time) * 100;
        window.resizeTo(this.width,this.height);
        window.moveTo(window.parent.screen.width/2, window.parent.screen.height/2);
        requestAnimationFrame(this.update);
    }
}


window.onload = function () {

    new ChildWindow();
};



