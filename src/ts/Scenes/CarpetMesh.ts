
import * as THREE from 'three';
import SceneManager from "../vThree/SceneManager";
import BaseScene from "../vThree/BaseScene";
import {createRenderTarget, createRenderTargetPlane} from "../vThree/OffScreenManager";
import {TweenMax, Power1, TimelineLite} from "gsap/TweenMax";
import CurlNoise from "../vThree/utils/CurlNoise";
import {GetCameraDistanceWithHeightSize, GetCameraDistanceWithWidthSize} from "../vThree/utils/CameraHelpers";
import SceneManage from "../vThree/SceneManager";
import PopUpWindowManager from "./PopUpWindowManager";
import ChildRenderer from "./ChildRenderer";
import {Vector3} from "three";
import {posix} from "path";

class leftRecordPosition
{
    current:THREE.Vector3;
    record:THREE.Vector3[] = [];
    constructor(position:THREE.Vector3)
    {
        this.update(position);
    }

    update(position:THREE.Vector3)
    {
        this.current = position;
        this.record.unshift(this.current.clone());

        // console.log(this.record);
        if(this.record.length > 100) this.record.pop();

    }

    get lastPosition()
    {
        return this.record[this.record.length-1];
    }
}
export default class CarpetMesh
{
    scene:THREE.Scene;
    leftRecordPosition:leftRecordPosition;
    rightRecordPosition:leftRecordPosition;
    time:number = 0;
    leftMeshs:THREE.Mesh[] = [];
    rightMeshs:THREE.Mesh[] = [];
    curlNoise:CurlNoise;
    planeGeometry:THREE.BufferGeometry;
    planeMat:THREE.MeshBasicMaterial;
    planeMesh:THREE.Mesh;
    constructor(scene)
    {
        this.curlNoise = new CurlNoise();
        this.scene = scene;

        var x = 300;
        var y = 0;
        var z = 0;
        for (let i = 0; i < 12; i++)
        {
            x += 50;
            var box = this.createBox();

            if(i == 0)this.leftRecordPosition = new leftRecordPosition(new THREE.Vector3(
                x,y,z
            ));
            box.position.set(
                x,
                y,
                z
            );

            this.leftMeshs.push(box);
            this.scene.add(box);

        }


        x = 0;
        for (let i = 0; i < 12; i++)
        {
            z = -200;
            x += 50;

            var box = this.createBox();

            if(i == 0)this.rightRecordPosition = new leftRecordPosition(new THREE.Vector3(
                x,y,z
            ));
            box.position.set(
                x,
                y,
                z
            );

            this.rightMeshs.push(box);
            this.scene.add(box);

        }


        this.planeGeometry = new THREE.BufferGeometry();


        this.planeMat = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});
        this.planeMesh = new THREE.Mesh(this.planeGeometry,this.planeMat);

        this.scene.add(this.planeMesh);


    }


    createBox()
    {
        var geo = new THREE.BoxBufferGeometry(10,10,10);
        var mat = new THREE.MeshLambertMaterial({color:0xffffff});

        return new THREE.Mesh(geo,mat);
    }

    update() {

        this.time ++;
        this.leftRecordPosition.update(new THREE.Vector3(
            Math.sin(this.time * 0.03) * 400,
            Math.sin(this.time * 0.02) * 300,
            this.leftRecordPosition.current.z,
        ));


        this.rightRecordPosition.update(new THREE.Vector3(
            Math.sin(this.time * 0.03) * 400,
            Math.sin(this.time * 0.02) * 300,
            this.rightRecordPosition.current.z,
        ));

        for(let i = 0; i < this.leftMeshs.length;i++)
        {
            if(i * 5 < this.leftRecordPosition.record.length)
            {

                const recordNum = i * 3;
                this.leftMeshs[i].position.set(
                    this.leftRecordPosition.record[recordNum].x,
                    this.leftRecordPosition.record[recordNum].y,
                    this.leftRecordPosition.record[recordNum].z,
                )
            }

        }



        for(let i = 0; i < this.rightMeshs.length;i++)
        {
            if(i * 5 < this.rightRecordPosition.record.length)
            {

                const recordNum = i * 3;
                this.rightMeshs[i].position.set(
                    this.rightRecordPosition.record[recordNum].x,
                    this.rightRecordPosition.record[recordNum].y,
                    this.rightRecordPosition.record[recordNum].z,
                )
            }

        }

        this.createPlaneMesh();
    }
    init()
    {

    }

    createPlaneMesh()
    {

        if(this.rightMeshs.length < 4) return;
        var indices = [];
        var vertices = [];
        var colors = [];
        var size = 20;
        var segments = 2;
        var halfSize = size / 2;
        var segmentSize = size / segments;

        this.planeGeometry.dispose();
        // generate vertices, normals and color data for a simple grid geometry
       for (let i = 0; i < this.leftMeshs.length; i++)
       {


           let r = this.rightMeshs[i].position;
           vertices.push(r.x,r.y,r.z);

           let l = this.leftMeshs[i].position;

           vertices.push(l.x,l.y,l.z);


           console.log(l.z,r.z);
       }
        // generate indices (data for element array buffer)
        for(let i = 0; i < (vertices.length/3)-2; i+=2)
        {
            indices.push(i,i+2,i+1);
            indices.push(i+2,i+3,i+1);
        }

        //
        this.planeGeometry.setIndex( indices );
        this.planeGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        this.planeGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );


        this.planeGeometry.computeVertexNormals();
        // this.planeGeometry.index.needsUpdate = true;

    }

}