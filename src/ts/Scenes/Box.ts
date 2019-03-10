import * as THREE from 'three';
import SceneManager from "../vThree/SceneManager";
import BaseScene from "../vThree/BaseScene";
import CurlNoise from "../vThree/utils/CurlNoise";
import {TweenMax, Power1, TimelineLite} from "gsap/TweenMax";
import TestScene from "./TestScene";
import {Statement} from "babel-types";
import Sequencer from "./Sequencer";

export default class Box
{
    curlNoise:CurlNoise;
    simplex:any;
    startPosition:THREE.Vector3;
    rotateAxis:THREE.Vector3;
    scale:number;
    threshold:{value:number};
    mesh:THREE.Mesh;
    isCenter:boolean = false;
    isTween:boolean = false;
    initialVelocity:number;
    speed:number;
    startSpeed:number;
    startScale:number;
    startRotateAxis:THREE.Vector3;
    startInitialVelocity:number;
    textureResolution:THREE.Vector2;
    worldCenterPos:THREE.Vector3 = new THREE.Vector3(0,0,0);
    centerBoxRotationSpeed = {value:0.0};
    parent:TestScene;
    sequencer:Sequencer;
    id:number = 0;
    maxBoxCount = 0;
    animation03Count = 0;
    birthPosition:THREE.Vector3 = new THREE.Vector3(0,0,0);
    private theta:number = 0;
    private phi:number = 0;
    lifespan:number = 1.0;
    time_09:number = 0.;
    rad_09:number = 0.;
    canvasSize:THREE.Vector2;
    position_07:THREE.Vector3 = new THREE.Vector3(0,0,0);


    constructor(parent:TestScene,mesh:THREE.Mesh,threshold:{value:number},textureResolution:THREE.Vector2,simple:any,curlNoise:CurlNoise)
    {

        this.parent = parent;
        this.simplex = simple;
        this.mesh = mesh;
        this.threshold = threshold;
        this.textureResolution = textureResolution;
        this.curlNoise = curlNoise;
    }

    update01()
    {
        const maxDistance = new THREE.Vector3(this.textureResolution.x/2, this.textureResolution.y/2,0).distanceTo(new THREE.Vector3(0,0,0));

        if(!this.isCenter)
        {

            if(this.startPosition.distanceTo(this.worldCenterPos) > maxDistance * (1.0-this.threshold.value))
            {

                this.initialVelocity += (0.1 - this.initialVelocity)*0.03;
                // const moveVec = this.meshes[i].position.clone().normalize().multiplyScalar(this.initialVelocities[i]);
                const seed = this.mesh.position.clone().multiplyScalar(0.002);
                const noise = this.curlNoise.getNoise(seed);
                noise.z = this.simplex.noise(this.startPosition.x,this.startPosition.y)*5.;
                this.mesh.position.add(noise.multiplyScalar(5.0).multiplyScalar(this.initialVelocity*0.5));
                this.mesh.rotateX(this.rotateAxis.x*0.01*this.initialVelocity);
                this.mesh.rotateZ(this.rotateAxis.y*0.01*this.initialVelocity);
                this.scale += (0.001 - this.scale) * 0.04 * this.speed;
                this.mesh.scale.set(this.scale,this.scale,this.scale);

            }


        }

        if(this.isCenter)
        {
            // console.log("isCenter");
            if(!this.isTween && this.startPosition.distanceTo(this.worldCenterPos) > maxDistance * (1.0-this.threshold.value))
            {
                this.isTween = true;
                TweenMax.to(this.mesh.position,2.,{
                    x:0,
                    y:0,
                    z:this.parent.mainCamera.position.z * 0.7
                });
                TweenMax.to(this.mesh.rotation,2.,{
                    x:Math.PI/10,
                })

                TweenMax.to(this.centerBoxRotationSpeed,2,{
                    value:0.1,
                });


                TweenMax.to(this.mesh.scale,2,{
                    x:1,
                    y:1,
                    z:1
                });
            }
            const noise = 1.0 + Math.abs(this.simplex.noise(this.mesh.position.x,this.parent.sceneManager.clock.getElapsedTime())*2.);
            this.mesh.rotateY(0.03 * this.centerBoxRotationSpeed.value);

        }
    }


    initValues()
    {
        this.isTween = false;
        this.scale = 1;
        this.speed = this.startSpeed;
        this.rotateAxis = this.startRotateAxis;
        this.initialVelocity = this.startInitialVelocity;
    }
    updateInitAnimation(duration:number)
    {


        const maxDistance = new THREE.Vector3(this.textureResolution.x/2, this.textureResolution.y/2,0).distanceTo(new THREE.Vector3(0,0,0));
        if(!this.isTween && this.startPosition.distanceTo(this.worldCenterPos) > maxDistance * (this.threshold.value))
        {


            console.log("update ok");
            this.isTween = true;

            TweenMax.to(this.mesh.position,duration,{
                x:this.startPosition.x,
                y:this.startPosition.y,
                z:this.startPosition.z
            });


            TweenMax.to(this.mesh.rotation,duration,{
                x:0,
                y:0,
                z:0

            })

            TweenMax.to(this.mesh.scale,duration,{
                x:1,
                y:1,
                z:1

            })


        }

    }

    startReveseAnimation01(duration:number)
    {

        if(this.isCenter)
        {
            TweenMax.to(this.mesh.position,2.,{
                x:0,
                y:0,
                z:this.parent.mainCamera.position.z * 0.7
            });


            TweenMax.to(this.mesh.rotation,2.,{
                x:Math.PI/10,
            })

            TweenMax.to(this.centerBoxRotationSpeed,2,{
                value:0.1,
            });
        }else
        {
            this.scale = (0.001);
        }
    }


    startAnimation02(duration:number)
    {

        console.log("start02");
        let size = this.canvasSize.clone();

        // try {
            //@ts-ignore
            // console.log(isSp, window.devicePixelRatio);
            //@ts-ignore
            window.webgl.isSp ?  size.multiplyScalar(5) : console.log("pc");
        // } catch (e)
        // {
        //
        // }

        this.isTween = true;

        if(this.id < 5 || this.isCenter)
        {

            this.isTween = true;
            let nextBoxPos = new THREE.Vector3(-size.x/2,-size.y/2,-100);
            const step = nextBoxPos.distanceTo(new THREE.Vector3(size.x/2,size.y/2,0)) / 5;
            const moveVec = new THREE.Vector3(size.x/2,size.y/2,0).sub(new THREE.Vector3(-size.x/2,-size.y/2,0)).normalize();

            if(this.isCenter)
            {
                nextBoxPos.add(moveVec.clone().multiplyScalar(step*3));
            } else
            {
                if(this.id < 3)
                {
                    nextBoxPos.add(moveVec.clone().multiplyScalar(step*this.id));
                    this.mesh.position.set(-1000,-1000,0);
                } else
                {
                    nextBoxPos.add(moveVec.clone().multiplyScalar(step*(this.id+1)));
                    this.mesh.position.set(1000,1000,0);
                }
            }


            TweenMax.to(this.mesh.scale,1.,{
                x:1.8,
                y:1.8,
                z:1.8
            });


            TweenMax.to(this.mesh.position,1.,{
                x:nextBoxPos.x,
                y:nextBoxPos.y,
                z:nextBoxPos.z
            });


            TweenMax.to(this.mesh.rotation,1.,{
                x:Math.PI/6,
                y:Math.PI/3,
                z:0,
                onComplete:()=>{
                    this.speed = Math.random()*0.002+0.002;
                    this.isTween = false;
                }
            });
            // console.log(nextBoxPos.x,nextBoxPos.y,nextBoxPos.z);
            if(this.isCenter)
            {
                // this.meshes[this.centerNum].rotation.set(0,0,0);
                TweenMax.to(this.mesh.position,1.,{
                    x:nextBoxPos.x,
                    y:nextBoxPos.y,
                    z:nextBoxPos.z
                });

                TweenMax.to(this.mesh.rotation,1.,{
                    x:Math.PI/6,
                    y:Math.PI/3,
                    z:0,
                    onComplete:()=>{
                        this.isTween = false;
                        this.speed = Math.random()*0.002+0.002;

                    }
                });
            }
        } else
        {
            if(!this.isCenter)
                TweenMax.to(this.mesh.scale,duration,{
                    x:0.001,
                    y:0.001,
                    z:0.001,
                    onComplete:()=>{
                        this.isTween =false;
                    }
                })
        }

    }

    startAnimation03(duration:number)
    {
        this.isTween = true;

        const delay = (duration*0.7)/this.maxBoxCount * this.id;
        const newDuration = duration -delay;

        let yStart = this.textureResolution.y;
        let y = yStart;

        let xCount = 4;
        let yCount = 20;

        let xStep = this.textureResolution.x*3 / xCount;
        let yStep = this.textureResolution.y*2.5/ yCount;

        let offsetX = -this.textureResolution.x*4;
        let offsetY = this.textureResolution.y;

        //@ts-ignore
        if(window.webgl.isSp)
        {
            offsetX = -this.textureResolution.x*2.5;
            offsetY = this.textureResolution.y;
        }

        let xStepCount = 0;

        let xStart = -this.textureResolution.x*4;
        let x = xStepCount * xStep -  xStart;


        this.isTween = true;
        TweenMax.to(this.mesh.scale,newDuration,{
            x:1,
            y:1,
            z:1,

            delay:delay
        });


        // TweenMax.to(this.mesh.rotation,newDuration,{
        //     x:Math.PI/6,
        //     y:Math.PI/6,
        //     z:1,
        //
        //     delay:delay,
        //     onComplete:()=>{
        //         this.isTween =false;
        //     }
        // });




        const xNum =  Math.ceil((this.id+1) / yCount);
        const yNum = this.id % yCount;
       x = xStep * xNum;

        y = 0;
        if(yNum % 2 == 1)
        {
            y -= yStep * ((this.id-1) % yCount);

        } else
        {
            y -= yStep * (this.id % yCount);

        }
        x += (this.id % yCount) * xStep * 0.15;
                // console.log(this.id,y);


        TweenMax.to(this.mesh.position,newDuration,{
            x:offsetX+x,
            y:offsetY+y,
            z:-800,
            delay:delay
        });

        TweenMax.delayedCall(newDuration,()=>{
            this.randomRotation(4);
        })


    }

    randomRotation(duration)
    {
        this.isTween = true;

        let rotation = new THREE.Vector3(Math.PI*0.4,0,0);
        if(Math.random() < 0.5)
        {
            rotation.y = Math.PI*2;
        } else
        {
            rotation.z = Math.PI*2;
        }
        TweenMax.to(this.mesh.rotation,duration,{
            x:rotation.x,
            y:rotation.y,
            z:rotation.z,

            onComplete:()=>{
                TweenMax.to(this.mesh.rotation,1.5,{
                    x:0.,
                    y:0.,
                    z:0.,

                    onComplete:()=>{
                        this.isTween = false;
                    }
                });
            }
        });
    }
    startAnimation04(duration:number)
    {

        this.isTween  = false;
        const delay = duration/this.maxBoxCount * this.id;
        const newDuration = duration*0.3;
        this.isTween = false;
        let y = this.id * 8;
        let x = Math.cos(this.id * 0.1) * 200;
        let z = Math.sin(this.id * 0.1) * 200;

        if(this.id % 2 == 0)
        {
            x = Math.cos(this.id * 0.1 + Math.PI) * 200;
            z = Math.sin(this.id * 0.1 + Math.PI) * 200;
        }

        if(!this.isTween){
            this.isTween = true;
            TweenMax.to(this.mesh.position,newDuration,{
                x:x,
                y:y-800,
                z:z,
                delay:delay
            });

            const normalizedNum =Math.sin( this.id/this.maxBoxCount * Math.PI );

            const sideValue = Math.min(normalizedNum,0.3)/0.3;

            TweenMax.to(this.mesh.scale,newDuration,{
                x:0.4*sideValue,
                y:0.4*sideValue,
                z:0.4*sideValue,
                delay:delay,
                onComplete:()=>{
                    this.isTween = false;
                }
            });
        }
    }


    startAnimation05(duration:number)
    {
        this.isTween = true;
        const delay =this.id * 0.005;
        const newDuration = duration;
        TweenMax.to(this.mesh.scale, newDuration,{
            x:0.01,
            y:0.01,
            z:0.01,
            delay:delay
        });
        TweenMax.delayedCall(newDuration + this.id * 0.035,()=>{
            this.isTween = false;
        });
    }

    startAnimation06(duration:number)
    {

        this.isTween = true;
        const scale = 0.0015;
        const diff_y = this.simplex.noise3d(this.startPosition.x*scale,0.,this.startPosition.y*scale);
        const x = this.startPosition.x*2.;
        const y = -50+diff_y * 200;
        const z = this.startPosition.y*4.2;


        const newDuration = duration * 0.3;
        const delay = duration -newDuration;
        const delayStep = delay/this.maxBoxCount;
        TweenMax.to(this.mesh.scale,newDuration,{
            delay:this.id * delayStep,
            x:0.4,
            y:0.4,
            z:0.4
        });

        TweenMax.to(this.mesh.rotation,newDuration,{
            delay:this.id * delayStep,
            x:0,
            y:0,
            z:0
        });


        TweenMax.to(this.mesh.position,newDuration,{
            delay:this.id * delayStep,
            x:x,
            y:y,
            z:z,
            onComplete:()=>{
                this.isTween = false;
            }
        });


    }


    startAnimation07(duration:number)
    {
        this.isTween = true;
        const newDuration = duration * 0.5;
        // const delay = duration -newDuration;
        // const delayStep = delay/this.maxBoxCount;


        // if(this.id % 3 == 0)
        // {
        // this.mesh.scale.set(0.4,0.4,0.4);
        // this.mesh.rotation.set(0,0,0);

        let width = 500;
        if(Math.random() < 0.3) width = 200;
        const widht_h = width/2;

        let x,y,z;

        if(Math.random() < 0.7) {

            y = Math.random() < 0.5 ? -widht_h : widht_h;
            if (Math.random() < 0.5) {


                // this.mesh.position.set(
                    x =Math.random() * width - widht_h,
                    z = Math.random() < 0.5 ? -widht_h : widht_h
                // )
            } else {

                // this.mesh.position.set(
                    x =Math.random() < 0.5 ? -widht_h : widht_h,
                    z=Math.random() * width - widht_h
                // )
            }
        } else
        {
            // this.mesh.position.set(
                x = Math.random() < 0.5 ? -widht_h : widht_h,
                y = Math.random() * width - widht_h,
                z = Math.random() < 0.5 ? -widht_h : widht_h
            // )
        }


        this.position_07 = this.mesh.position.clone();

        const delay = ((y + widht_h) / width) * (duration -newDuration);
        TweenMax.to(this.mesh.scale,newDuration,{
            delay:delay,
            x:0.4,
            y:0.4,
            z:0.4,
            onComplete:()=>{
                this.isTween = false;
            }
        });

        TweenMax.to(this.mesh.rotation,newDuration,{
            delay:delay,
            x:0,
            y:0,
            z:0
        });


        TweenMax.to(this.position_07,newDuration,{
            delay:delay,
            x:x,
            y:y,
            z:z,

        });

    }


    startAnimation08(duration:number)
    {
        this.isTween = true;
        const delay = (Math.random()*0.3);

        const newDuration = duration * 0.2;
            TweenMax.to(this.mesh.scale,newDuration,{
            x:0.001,
            y:0.001,
            z:0.001,
            delay:delay,
            onComplete:()=>{
                TweenMax.delayedCall(duration*2.5 * Math.random(),()=>{
                    this.mesh.position.set(Math.sin(Math.random()*Math.PI*2) * 400,Math.cos(Math.random()*Math.PI*2) * 200,0);
                    this.isTween = false;
                })
            }
        });

    }





    startAnimation09(duration:number)
    {
        this.isTween = true;
        this.time_09 = 0.;
        const newDuration = duration * (Math.random()*0.5 + 0.5);
        const delay = duration - newDuration;
        const scale = Math.random() * 0.5 + 0.1;
        this.rad_09 = Math.random() * Math.PI * 2;


        const x = Math.cos(this.rad_09) * 700;
        const z = Math.sin(this.rad_09) * 700;
        let y = Math.sin(this.rad_09*6.) * 100;
        if(this.id%2 == 0) y = Math.cos(this.rad_09*6.) * 100;
        TweenMax.to(this.mesh.scale,newDuration,{
            x:scale,
            y:scale,
            z:scale,
            delay:delay,
        });
        TweenMax.to(this.mesh.position,newDuration,{
            x:x,
            y:y,
            z:z,
            delay:delay,
            onComplete:()=>{
                this.isTween  = false;
            }
        });

    }






    update02()
    {
        if(this.isCenter)console.log(this.isTween);
        if(this.isTween) return;
        if(this.id <= 5 || this.isCenter)
        {
            this.mesh.rotateX(Math.abs(this.simplex.noise(this.mesh.position.x,this.parent.sceneManager.clock.getElapsedTime()*0.05))*0.02);
            this.mesh.rotateY(Math.abs(this.simplex.noise(this.mesh.position.x,this.parent.sceneManager.clock.getElapsedTime()*0.05))*0.02);
        }

    }

    update03(debugmode:boolean = false)
    {
        if(this.animation03Count >60*3 && !debugmode) {
            this.startAnimation03(2);
            this.animation03Count = -60*2;
        }
        this.animation03Count++;
        if(this.isTween) return;
        this.mesh.rotateX(Math.abs(this.simplex.noise(this.mesh.position.x,this.mesh.position.y+this.parent.sceneManager.clock.getElapsedTime()*0.05))*0.01+0.01);
        this.mesh.rotateY(Math.abs(this.simplex.noise(this.mesh.position.x,this.mesh.position.y+this.parent.sceneManager.clock.getElapsedTime()*0.05))*0.01+0.01);
    }

    update04(time)
    {
        let x = Math.cos(this.id * 0.1+time) * 200;
        let z = Math.sin(this.id * 0.1+time) * 200;
        let y = this.id * 8;

        if(this.id % 2 == 0)
        {
            x = Math.cos(this.id * 0.1 + Math.PI+time) * 200;
            z = Math.sin(this.id * 0.1 + Math.PI+time) * 200;
        }
        this.mesh.position.set(x,y-800,z);

    }

    update05(time:number)
    {

        if(this.isTween) return;

        // console.log(this.id,this.mesh.scale.x);
        if(this.mesh.scale.x <= 0.011 && Math.random() < 0.3)
        {
            let theta = time*0.5;
            if(this.id %2 == 0)
            {
                theta += Math.PI;
            }

            let r = 200;
            if(Math.random() < 0.5)
            {
                r = 400;
            }
            // const x = r * Math.sin(theta) * Math.cos(phi);
            // const y = r * Math.cos(theta);
            // const z = r * Math.sin(theta) * Math.sin(phi);

            const x = Math.cos(theta) * r;
            const y = Math.sin(theta) * r;
            let z = Math.sin(theta) * r * 0.3;

            if(this.id %2 == 0)
            {
                z = Math.sin(theta+Math.PI) * r * 0.3;
            }

            this.birthPosition = new THREE.Vector3(x,y,z);

            this.mesh.position.set(
                this.birthPosition.x,
                this.birthPosition.y,
                this.birthPosition.z,
            );

            this.mesh.scale.set(0.4,0.4,0.4);
        } else
        {

            const noise = this.curlNoise.getNoise(this.mesh.position.clone().multiplyScalar(0.005));
            this.mesh.position.add(
                noise.add(this.birthPosition.clone().normalize().multiplyScalar(3))
            );

            this.mesh.scale.sub(new THREE.Vector3(0.0042,0.0042,0.0042));
            this.mesh.rotateOnAxis(this.mesh.position.clone().normalize(),0.05);

        }


    }

    update06(time)
    {

        const scale = 0.0015;
        const diff_y = this.simplex.noise3d(this.startPosition.x*scale,time,this.startPosition.y*scale);
        this.mesh.position.set(this.startPosition.x*2., -50+diff_y * 200,this.startPosition.y*4.2);

    }

    scaleZero_random(duration)
    {
        this.isTween = true;
        const delay = duration*0.5 * Math.random();
        const newDuration = duration - delay;
        TweenMax.to(this.mesh.scale,newDuration,{
            x:0.001,
            y:0.001,
            z:0.001,
            delay:delay
        });
    }


    update07(time, enableRotate:boolean)
    {
        // const noisex = this.simplex.noise(this.position_07.x*0.1,time);
        // const noisey = this.simplex.noise(this.position_07.y*0.1,time);

        let x = this.position_07.x;
        let y = this.position_07.y;
        let z = this.position_07.z;

        // this.mesh.position.set(x,y,z);


        if(!this.isTween)
        {
            const value = {value:0.0};
            TweenMax.to(value,4.0,{
                value:Math.PI,
                onStart:()=>{
                    this.isTween = true;
                },
                onUpdate:()=>{
                    this.mesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0), Math.sin(value.value) * 0.02);
                },
                onComplete:()=>{
                    TweenMax.delayedCall(0.5,()=>{

                        this.isTween = false;
                    });
                }
            })
        }

        // if(time % 0.8 < 0.4)this.mesh.rotateOnWorldAxis(new THREE.Vector3(0,1,0),Math.abs(Math.sin(time + this.id * 0.01)) * 0.1);
        this.mesh.position.set(0,0,0);
        this.mesh.translateX(x);
        this.mesh.translateY(y);
        this.mesh.translateZ(z);

        if(enableRotate)
        {
            const scale = Math.abs(Math.sin(time*2. + this.mesh.position.y * 0.007)) * 0.4 + 0.1
            this.mesh.scale.set(
                scale,
                scale,scale
            )
        }
    }


    update08(time)
    {
        if(this.isTween) return;

        this.lifespan -= 0.005;

        const noise = this.curlNoise.getNoise(this.mesh.position.clone().multiplyScalar(0.001));

        noise.z = Math.abs(noise.z) * 3;
        this.mesh.position.add(
            (noise.multiplyScalar(2.))
        );
        if(this.lifespan < 0.)
        {
            this.lifespan = 1.;
            // this.mesh.position.set
            // this.startAnimation08();
            this.mesh.position.set(Math.sin(Math.random()*Math.PI*2) * 400,Math.cos(Math.random()*Math.PI*2) * 200,0);

        }
        this.mesh.rotateOnAxis(noise.normalize(),0.05  * this.simplex.noise3d(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z));

        const scale =0.3 *  Math.min(Math.sin(this.lifespan * Math.PI),0.4) / 0.4;


        this.mesh.scale.set(scale,scale,scale);

    }

    update09(time:number)
    {
        this.time_09 += 0.001;
        const x = Math.cos(this.rad_09+this.time_09) * 700;
        const z = Math.sin(this.rad_09+this.time_09) * 700;

        let y = Math.sin(this.rad_09*6.+ time) * 100;
        if(this.id%2 == 0) y = Math.cos(this.rad_09*6. + time) * 100;

        this.mesh.rotateX(0.01);
        this.mesh.rotateZ(0.01);
        this.mesh.position.set(
            x,
            y,
            z,
            );



    }
}