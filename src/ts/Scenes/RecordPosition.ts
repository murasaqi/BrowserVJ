import * as THREE from "three";

export default class RecordPosition
{
    maxRecordCount = 300;

    current:THREE.Vector3;
    record:THREE.Vector3[] = [];
    constructor(position:THREE.Vector3)
    {

        // for(let i = 0; i < this.maxRecordCount; i++)
        // {
        //     this.record.unshift(position.clone());
        // }

        this.current = position;


    }

    clear()
    {
        this.record = [];
    }

    update(position:THREE.Vector3)
    {
        this.current = position;
        this.record.unshift(this.current.clone());

        // console.log(this.record);
        if(this.record.length > this.maxRecordCount) {
            this.record.pop();
        }

    }

    get currentPosition()
    {
        return this.record[this.record.length-1];
    }
}
