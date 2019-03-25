
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
import Simplex from "perlin-simplex";
import RecordPosition from "./RecordPosition"


class Row
{
    positions:THREE.Vector3[] = [];
    debugMeshs:THREE.Mesh[] = [];
    recordPositions:RecordPosition;
    enableMesh:boolean = false;
    constructor(startPosition:THREE.Vector3)
    {
        this.init(startPosition);
    }

    add(position:THREE.Vector3,debugMesh:THREE.Mesh)
    {
        //@ts-ignore
        debugMesh.material.visible = false;
        this.positions.push(position);
        this.debugMeshs.push(debugMesh);
    }

    init(startPosition:THREE.Vector3)
    {

        this.recordPositions = new RecordPosition(startPosition)


    }

    clear()
    {
        this.recordPositions.clear();
        this.enableMesh = false;

    }

    update(newPosition:THREE.Vector3)
    {
        this.recordPositions.update(new THREE.Vector3(
            newPosition.x,
            newPosition.y,
            newPosition.z
        ));


        let delayStep = 14;

        for(let i = 0; i < this.debugMeshs.length;i++)
        {
            if(i * delayStep < this.recordPositions.record.length)
            {

                const recordNum = i * delayStep;
                this.debugMeshs[i].position.set(
                    this.recordPositions.record[recordNum].x,
                    this.recordPositions.record[recordNum].y,
                    this.recordPositions.record[recordNum].z,
                )
            }

        }

        if(this.recordPositions.record.length >= this.recordPositions.maxRecordCount)
        {
            this.enableMesh = true;
        }

    }
}

export default class CarpetMesh
{
    scene:THREE.Scene;
    // leftRecordPosition:leftRecordPosition;
    // rightRecordPosition:leftRecordPosition;
    time:number = 0;
    // leftMeshs:THREE.Mesh[] = [];
    // rightMeshs:THREE.Mesh[] = [];
    rows:Row[] = [];
    curlNoise:CurlNoise;
    planeGeometry:THREE.PlaneBufferGeometry;
    planeMat:THREE.MeshBasicMaterial;
    mesh:THREE.Mesh;
    simplex:Simplex = new Simplex();
    startPosition:THREE.Vector3;
    speed:THREE.Vector3;
    tex:THREE.Texture;
    animationPattern:number = 0;
    constructor(scene, startPosition?:THREE.Vector3,scale?:THREE.Vector3, tex?:THREE.Texture)
    {
        this.tex= tex;
        this.speed = new THREE.Vector3(
            Math.random() * 0.02 + 0.005,
            Math.random() * 0.01 + 0.005,
            Math.random() * 0.01 + 0.005,
        )

        this.startPosition = startPosition || new THREE.Vector3(0,0,0);
        console.log(this.simplex);
        this.curlNoise = new CurlNoise();
        this.scene = scene;

        let xStep = 20*scale.x;
        let zStep = 20*scale.z;
        let rowCount = 8;
        let zCount = 8;
        var x = this.startPosition.x - ( xStep * (rowCount+1)) / 2;
        var y =this.startPosition.z + ( zStep * (zCount+1)) / 2;
        var z =  this.startPosition.z;


        this.startPosition.set(x,y,z);

        for(let r = 0; r < zCount; r++)
        {
            for (let i = 0; i < rowCount; i++)
            {
                x += xStep;
                var box = this.createBox();

                if(i == 0) this.rows.push(
                    new Row(new THREE.Vector3(x,y,z)));
                box.position.set(
                    x,
                    y,
                    z
                );

                this.rows[this.rows.length-1].add(new THREE.Vector3(x,y,z),box);
                this.scene.add(box);

            }

            x = this.startPosition.x;
            z -= zStep;
        }


        this.planeGeometry = new THREE.PlaneBufferGeometry(8,8,7,7);

        this.planeMat = new THREE.MeshPhongMaterial({color:0xffffff,side:THREE.DoubleSide,map:this.tex});
        this.mesh = new THREE.Mesh(this.planeGeometry,this.planeMat);


        this.mesh.rotateOnAxis(new THREE.Vector3(Math.random() * Math.PI*2,0,0).normalize(), Math.random() * 360);
        this.scene.add(this.mesh);


    }


    createBox(color?)
    {
        var geo = new THREE.BoxBufferGeometry(10,10,10);
        var mat = new THREE.MeshLambertMaterial({color:color || 0xffffff});

        return new THREE.Mesh(geo,mat);
    }

    update() {

        this.time ++;


        switch (this.animationPattern)
        {
            case 0:
                for (let i = 0; i < this.rows.length; i++)
                {
                    let w =  this.rows[i];
                    let noise = this.simplex.noise3d(
                        w.recordPositions.current.x*0.002 + this.startPosition.x,
                        w.recordPositions.current.y*0.002 + this.startPosition.y,
                        w.recordPositions.current.z*0.002) * 20 + this.startPosition.z;
                    w.update(new THREE.Vector3(
                        Math.cos(this.time * 0.005) * 400,
                        Math.sin(this.time * this.speed.y) * 100 + noise,
                        w.recordPositions.current.z,
                    ));
                }

                break;


            case 1:
                for (let i = 0; i < this.rows.length; i++)
                {
                    let w =  this.rows[i];
                    let noise = this.simplex.noise3d(
                        w.recordPositions.current.x*0.002 + this.startPosition.x,
                        w.recordPositions.current.y*0.002 + this.startPosition.y,
                        w.recordPositions.current.z*0.002) * 20 + this.startPosition.z;
                    w.update(new THREE.Vector3(
                        Math.cos(this.time * 0.005) * 400,
                        Math.sin(this.time * this.speed.y) * 100 + noise,
                        w.recordPositions.current.z,
                    ));
                }

                break;

        }

        if(this.rows[0].enableMesh)this.createPlaneMesh();
    }
    init()
    {

    }

    setTexture(texture:THREE.Texture)
    {
        this.planeMat.map = texture;
        this.planeMat.map.needsUpdate = true;
    }


    createPlaneMesh()
    {

        // if(this.rightMeshs.length < 4) return;
        // var indices = [];
        // var vertices = [];
        // var colors = [];

        // this.planeGeometry.dispose();dispose
        // this.planeGeometry = new THREE.PlaneBufferGeometry(8,8,8,8);
        // generate vertices, normals and color data for a simple grid geometry
       // for (let i = 0; i < this.rows[0].debugMeshs.length; i++)
       // {
       //
       //
       //     for(let rowCount = 0; rowCount < this.rows.length; rowCount++)
       //     {
       //         let r = this.rows[rowCount].debugMeshs[i].position;
       //         vertices.push(r.x,r.y,r.z);
       //
       //     }
       //
       // }
        // generate indices (data for element array buffer)

        let step = this.rows.length;
        //@ts-ignore
        let vertices = this.planeGeometry.attributes.position.array;
        //@ts-ignore
        this.planeGeometry.dynamic = true;
        // console.log/(vertices);
        let count = 0;
       for (let i = 0;  i < this.rows.length; i++)
       {
           for (let k = 0; k < this.rows[i].debugMeshs.length; k++)
           {
               vertices[count] = this.rows[i].debugMeshs[k].position.x;
               count++;
               vertices[count] = this.rows[i].debugMeshs[k].position.y;
               count++;
               vertices[count] = this.rows[i].debugMeshs[k].position.z;
               count++;
           }
       }
       // console.log(count);
        //
        // this.planeGeometry.setIndex( indices );
        // this.planeGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        // this.planeGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );


        this.planeGeometry.computeVertexNormals();
        //@ts-ignore
        this.planeGeometry.attributes.position.needsUpdate = true;
        // this.planeGeometry.index.needsUpdate = true;

    }

}