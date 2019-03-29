
class Selecter
{
    selecter:HTMLElement;
    options= [];
    constructor(num)
    {
        this.selecter = document.createElement("select");

        for(let i = 0; i < num; i++)
        {
            console.log(i);
            let option = document.createElement("option");
            option.innerText = i.toString();

            this.options.push(option);
            this.selecter.appendChild(option);

        }
    }

    getSelectNum()
    {
        let num = 0;


        for(let i = 0; i < this.options.length; i++)
        {
            if(this.options[i].selected)
            {
                num = i;
            }
        }

        return num;
    }
}

export default class UIElements
{
    wrapper:any;
    layer0:Selecter;
    layer1:Selecter;
    bgLayer:Selecter;
    blendNum01:Selecter;
    blendNum02:Selecter;
    sceneNum:number = 8;
    bgSceneNum:number = 8;
    hide:boolean = true;

    blendNum = 7;
    constructor()
    {
        this.wrapper = document.createElement("div");
        this.wrapper.id = "uiWrapper";
        this.layer0 = new Selecter(this.sceneNum);
        this.layer1 =new Selecter(this.sceneNum);
        this.bgLayer = new Selecter(this.bgSceneNum);
        this.blendNum01 = new Selecter(this.blendNum);
        this.blendNum02 = new Selecter(this.blendNum);





        document.body.appendChild(this.wrapper);
        this.wrapper.appendChild(this.layer0.selecter);
        this.wrapper.appendChild(this.layer1.selecter);
        this.wrapper.appendChild(this.blendNum01.selecter);
        this.wrapper.appendChild(this.blendNum02.selecter);
        this.wrapper.appendChild(this.bgLayer.selecter);

        window.addEventListener("keydown",this.onKeyDown);
    }


    onKeyDown=(e)=>{
        this.hide = !this.hide;
        this.wrapper.style.display = this.hide ? "block" : "none";
    }

    getLeftOption()
    {

        return this.layer0.getSelectNum();
    }

    getBgOption()
    {
        return this.bgLayer.getSelectNum();
    }

    getRightOption()
    {
        return  this.layer1.getSelectNum();
    }


    getBlend01()
    {
        return  this.blendNum01.getSelectNum();
    }

    getBlend02()
    {
        return  this.blendNum02.getSelectNum();
    }
}