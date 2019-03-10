declare function require(x: string): any;
import * as THREE from 'three';
import SceneManager from "../vThree/SceneManager";
import BaseScene from "../vThree/BaseScene";
import {TweenMax, Power1, TimelineLite} from "gsap/TweenMax";
import CurlNoise from "../vThree/utils/CurlNoise";
import GPUComputationRenderer from "../vThree/utils/GPUComputationRenderer";
import {GetCameraDistanceWithWidthSize} from "../vThree/utils/CameraHelpers";
const computeShaderPosition = require("./shaders/computeShaderPosition.glsl");
const computeShaderVelocity = require("./shaders/computeShaderVelocity.glsl");
const particleFragmentShader = require("./shaders/particleFragmentShader.glsl");
const particleVertexShader = require("./shaders/particleVertexShader.glsl");

export default class ParticleScene extends BaseScene {
    
    WIDTH = 128;
    geometry;
    PARTICLES = this.WIDTH * this.WIDTH;
    gpuCompute;
    velocityVariable;
    positionVariable;
    velocityUniforms;
    particleUniforms;

    constructor(sceneManger: SceneManager) {
        super(sceneManger);
        this.grid.material.visible = false;
        this.init();
    }

    init() {
        //@ts-ignore

        // if ( WEBGL.isWebGLAvailable() === false ) {
        //     //@ts-ignore
        //     document.body.appendChild( WEBGL.getWebGLErrorMessage() );
        // }
        this.mainCamera.position.set(0,0,GetCameraDistanceWithWidthSize(this.mainCamera,window.innerWidth));

        this.initComputeRenderer();
        this.initPositions();

    }

    initComputeRenderer() {
        this.gpuCompute = new GPUComputationRenderer( this.WIDTH, this.WIDTH, this.renderer );
        var dtPosition = this.gpuCompute.createTexture();
        var dtVelocity = this.gpuCompute.createTexture();
        this.fillTextures( dtPosition, dtVelocity );
        this.velocityVariable = this.gpuCompute.addVariable( "textureVelocity", computeShaderVelocity, dtVelocity );
        this.positionVariable = this.gpuCompute.addVariable( "texturePosition", computeShaderPosition, dtPosition );
        this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable, this.velocityVariable ] );
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable, this.velocityVariable ] );
        this.velocityUniforms = this.velocityVariable.material.uniforms;
        this.velocityUniforms[ "gravityConstant" ] = { value: 0.0 };
        this.velocityUniforms[ "density" ] = { value: 0.0 };
        var error = this.gpuCompute.init();
        if ( error !== null ) {
            console.error( error );
        }
    }

    initPositions() {
        this.geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( this.PARTICLES * 3 );
        var p = 0;
        for ( var i = 0; i < this.PARTICLES; i ++ ) {
            positions[ p ++ ] = 0.;
            positions[ p ++ ] = 0.;
            positions[ p ++ ] = 0.;
        }
        var uvs = new Float32Array( this.PARTICLES * 2 );
        p = 0;
        for ( var j = 0; j < this.WIDTH; j ++ ) {
            for ( var i = 0; i < this.WIDTH; i ++ ) {
                uvs[ p ++ ] = i / ( this.WIDTH - 1 );
                uvs[ p ++ ] = j / ( this.WIDTH - 1 );
            }
        }
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        this.geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
        this.particleUniforms = {
            "texturePosition": { value: null },
            "textureVelocity": { value: null },
            "cameraConstant": { value: this.getCameraConstant( this.mainCamera ) },
            "density": { value: 0.0 }
        };
        // ShaderMaterial
        var material = new THREE.ShaderMaterial( {
            uniforms: this.particleUniforms,
            vertexShader: particleVertexShader,
            fragmentShader: particleFragmentShader,

        } );
        material.extensions.drawBuffers = true;
        var particles = new THREE.Points( this.geometry, material );
        particles.matrixAutoUpdate = false;
        particles.updateMatrix();
        this.mainScene.add( particles );
    }

    fillTextures( texturePosition, textureVelocity ) {
        var posArray = texturePosition.image.data;
        var velArray = textureVelocity.image.data;
        var radius = 0.5;
        for ( var k = 0, kl = posArray.length; k < kl; k += 4 ) {
            // Position
            var x, y, z;
            x =( Math.random() - 0.5 )*window.innerWidth;
            z =0.;
            y = ( Math.random() - 0.5 )*window.innerHeight;
            posArray[ k + 0 ] = x;
            posArray[ k + 1 ] = y;
            posArray[ k + 2 ] = z;
            posArray[ k + 3 ] = 1;
            velArray[ k + 0 ] = 0.;
            velArray[ k + 1 ] = 0.;
            velArray[ k + 2 ] = 0.;
            velArray[ k + 3 ] = 0.;
        }
    }


    onClick = (e) => {
        // console.log(e);
    };

    onKeyDown = (e) => {

        console.log(e);

    };

    onMouseMove =(e)=>{
    };

    resizeScreen()
    {

    }

    onWindowResize = () => {
        this.mainCamera.aspect = window.innerWidth / window.innerHeight;
        this.mainCamera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.particleUniforms[ "cameraConstant" ].value = this.getCameraConstant( this.mainCamera );

    };

    getCameraConstant( camera ) {
        return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
    }


    reset()
    {

    }

    startState00Animation()
    {

    }

    startState01Animation()
    {


    }

    startState02Animation()
    {


    }


    update(time: number) {

        this.renderer.setClearColor(0xffffff);
        this.gpuCompute.compute();
        this.particleUniforms[ "texturePosition" ].value = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture;
        this.particleUniforms[ "textureVelocity" ].value = this.gpuCompute.getCurrentRenderTarget( this.velocityVariable ).texture;

    }

    render() {

        this.renderer.render(this.mainScene,this.mainCamera);
    }
    enableDebug() {
        this.grid.visible = true;
    }

    disableDebug() {
        this.grid.visible = false;
    }

}
