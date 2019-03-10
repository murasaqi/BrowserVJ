

export default class PopUpWindowManager
{
    constructor()
    {

        this.update();
        window.open('example.html', 'mywindow1', 'width=400, height=300, menubar=no, toolbar=no, scrollbars=yes');
    }
    init()
    {

    }

    update=()=>
    {
        requestAnimationFrame(this.update);
    };
}