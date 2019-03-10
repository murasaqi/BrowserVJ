export default class Timer
{
    time:number;
    private speed:number;
    private isUpdate:boolean;
    constructor()
    {
        this.reset();
    }
    getTime()
    {
        return this.time
    }
    reset()
    {
        this.isUpdate = true;
        this.time = 0.0;
        this.speed = 0.1;
    }

    stop()
    {
        this.isUpdate = false;
    }



    update()
    {
        this.time += this.speed;
    }

    setSpeed(value:number)
    {
        this.speed = value;
    }

    start()
    {
        if(this.isUpdate)
            this.isUpdate = true;
    }
}