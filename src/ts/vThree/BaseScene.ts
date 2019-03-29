import Simplex from "../../../node_modules/perlin-simplex";

declare function require(x: string): any;

import * as THREE from 'three'
import {createRenderTarget, createFullScreenTexturePlane} from "./OffScreenManager";
import "imports-loader?THREE=three!three/examples/js/loaders/OBJLoader.js";
import {Mesh, ShaderMaterial, WebGLRenderTarget} from "three";
import SceneManager from "./SceneManager";
import {LayerIds} from "./commonSettings";

const offScreenFs = require("./shaderlibraly/offScreen.fs");
const offScreenVs = require("./shaderlibraly/offScreen.vs");

const blendFs = require("../vThree/shaderlibraly/blend.fs.glsl");

export default class BaseScene {
    // utils
    sceneManager: SceneManager;
    simplex: Simplex;
    objLoader: THREE.OBJLoader;
    id:number = 0;
    // main mainScene
    mainScene: THREE.Scene;
    mainCamera: THREE.PerspectiveCamera;
    mainTarget: THREE.WebGLRenderTarget;

    outputScene: THREE.Scene;
    outputMesh: THREE.Mesh;
    enableOffScreenRendering:boolean = true;

    // screenPlaneをとる用のカメラ
    orthoCam: THREE.OrthographicCamera;

    // post effect -> shader materia　とか texture objのみ
    postEffectScene: THREE.Scene;
    postEffectMesh: THREE.Mesh;
    postEffect2DShaderMaterials: Map<string, THREE.ShaderMaterial>;
    postEffect2DTargets: Map<string, THREE.WebGLRenderTarget>;
    postEffect2DActive: Map<string, boolean>;

    // 各レイヤーで書かれたRenderTargetからテクスチャを抜き出してレンダリングする
    blendScene: THREE.Scene;
    blendShader: THREE.ShaderMaterial;
    blendTarget: THREE.WebGLRenderTarget;

    // debug view
    grid: THREE.GridHelper;

    private useOffScreen:boolean = false;


    constructor(scenemanager: SceneManager) {
        // utils
        this.sceneManager = scenemanager;
        this.simplex = new Simplex();
        this.objLoader = new THREE.OBJLoader();

        // main mainScene
        this.mainScene = new THREE.Scene();
        this.mainCamera = new THREE.PerspectiveCamera(50, this.screenSize.x / this.screenSize.y, 0.1, 10000);
        this.mainCamera.position.set(0, 0, 10);
        this.mainTarget = createRenderTarget(window.innerWidth,window.innerHeight);


        //debug
        this.grid = new THREE.GridHelper(1000, 50);
        this.mainScene.add(this.grid);

        this.orthoCam = BaseScene.createScreenPlaneCam();

        /// post effect
        this.postEffectScene = new THREE.Scene();
        this.postEffectMesh = createFullScreenTexturePlane(this.mainTarget.texture);
        this.postEffectScene.add(this.postEffectMesh);
        this.postEffect2DShaderMaterials = new Map<string, THREE.ShaderMaterial>();
        this.postEffect2DTargets = new Map<string, THREE.WebGLRenderTarget>();
        this.postEffect2DActive = new Map<string, boolean>();

        // blend

        // 最終的な各コンポーネントの合成
        this.blendScene = new THREE.Scene();
        const blendUniforms = {
            tex0: {
                type: "t"
            },
            tex1: {
                type: "t",
            }
        };

        // レイヤーの合成用
        this.blendScene = new THREE.Scene();
        this.blendShader = this.createShaderMaterial(blendFs, blendUniforms);
        const blendGeo = new THREE.PlaneBufferGeometry(2, 2);
        const blendMesh = new THREE.Mesh(blendGeo, this.blendShader);
        this.blendScene.add(blendMesh);
        this.blendTarget = createRenderTarget(this.screenSize.x, this.screenSize.y);

        // output
        this.outputMesh = createFullScreenTexturePlane(this.mainTarget.texture, offScreenFs);
        this.outputScene = new THREE.Scene();
        this.outputScene.add(this.outputMesh);
    }

    enableOffScreen()
    {
        this.useOffScreen = true;
    }

    desableOffScreen()
    {
        this.useOffScreen = false;
    }

    get renderer() {
        return this.sceneManager.renderer;
    }

    get screenSize() {
        return this.sceneManager.absoluteResolution;
    }

    // enableMultiRenderingScene()
    // {
    //     this.sceneManager.addMultiRenderingScene(this);
    // }


    enableDebug() {

    }

    disableDebug() {

    }

    createShaderMaterial(fs: string, uniforms: {}) {
        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: offScreenVs,
            fragmentShader: fs ? fs : offScreenFs,
            transparent: true
        });
    }

    create2DPostEffect(name: string, fs: string, uniforms?: {},type?:number) {
        let effect_uniforms = Object.assign({
            uTex: {type: "t", value: null},
            uTime:{value:0.0},
        }, uniforms ? uniforms : {});
        this.postEffect2DShaderMaterials.set(name, this.createShaderMaterial(fs, effect_uniforms));

        const target = createRenderTarget(this.screenSize.x, this.screenSize.y, type);

        this.postEffect2DTargets.set(name, target);

        this.postEffect2DActive.set(name, false);

        return effect_uniforms;
    }

    useEffect(name: string, tex?: THREE.Texture) : THREE.Texture {
        if(tex)this.postEffect2DShaderMaterials.get(name).uniforms.uTex.value = tex;
        this.postEffectMesh.material = this.postEffect2DShaderMaterials.get(name);
        return this.render2Target(this.postEffectScene, this.orthoCam, this.postEffect2DTargets.get(name));
    }




    update(time:number) {

    }

    // 第四引数指定layerのIDを指定できる、省略でシーン内のオブジェクトを全て描画
    render2Target(scene:THREE.Scene, cam: THREE.Camera, target: THREE.WebGLRenderTarget, layerNum: LayerIds = LayerIds.ALL) : THREE.Texture {
        this.renderer.setRenderTarget(target);
        this.renderer.setClearColor(new THREE.Color(0,0,0), 0);

        cam.layers.set(layerNum);

        this.renderer.render(scene, cam, target);
        return target.texture;
    }

    blend2Tex(tex0: THREE.Texture, tex1: THREE.Texture) : THREE.Texture {
        this.blendShader.uniforms.tex0.value = tex0;
        this.blendShader.uniforms.tex1.value = tex1;
        this.orthoCam.layers.set(0);
        return this.render2Target(this.blendScene, this.orthoCam, this.blendTarget);
    }

    render() {
        // 一番最後になんかしらのターゲットにrender2Targetで書いたものが画面に映ります。


        if(!this.useOffScreen) this.sceneManager.renderer.render(this.mainScene,this.mainCamera);
    }

    render2Canvas(tex: THREE.Texture) {
        // @ts-ignore
        this.outputMesh.material.uniforms.uTex.value = tex;
        this.renderer.render(this.outputScene, this.orthoCam);
    }

    texture2Target(tex: THREE.Texture, target:THREE.WebGLRenderTarget) {
        // @ts-ignore
        this.outputMesh.material.uniforms.uTex.value = tex;
        this.renderer.setRenderTarget(target);
        this.renderer.render(this.outputScene, this.orthoCam, target);
    }

    static createScreenPlaneCam() {
        return new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    }

    updateMainCameraAspect()
    {
        this.mainCamera.aspect = window.innerWidth / window.innerHeight;
        this.mainCamera.updateProjectionMatrix();

    }


    onWindowResize = (width,height) => {
        // this.mainTarget = createRenderTarget(this.screenSize.x, this.screenSize.y);
    };

    onMouseMove = (e?) => {

    };

    onClick = (e?) => {

    };

    onMouseDown = (e?) => {

    };

    onMouseUp = (e?) => {

    };

    onKeyDown = (e?) => {

    };
}