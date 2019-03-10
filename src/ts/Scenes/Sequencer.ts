export default class Sequencer
{
    sequenceNum = 0;
    isAnimation:boolean = false;
    sequenceMessage:string = "";
    maxStateNum = 3;
    finishAnimationType:number = 0;
    constructor()
    {
    }

    nextState()
    {

        if(this.isAnimation == false) {

            this.sequenceNum++;
            console.log("increment sequenceNum",this.sequenceNum);
        }
        if(this.sequenceNum > this.maxStateNum) {

            this.sequenceNum = this.maxStateNum + this.finishAnimationType;
            console.log("current sequence is particleScene");
            console.log("particleAnimationNum", this.finishAnimationType);
            console.log("sequenceNum", this.sequenceNum);
        }
    }

    prevState()
    {
        if(this.sequenceNum >=this.maxStateNum)
        {
            this.sequenceNum = 2;
        } else
        {
            if(this.isAnimation == false) this.sequenceNum--;
        }

        if(this.sequenceNum < 0) this.sequenceNum = 0;
    }
}
