import * as THREE from '../node_modules/three/build/three.module.js';
import { RectAreaLightHelper } from '../node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js';
import { TWEEN } from '../node_modules/three/examples/jsm/libs/tween.module.min'

import {
    ModifierStack,
    Bend,
    Twist,
    Noise,
    Cloth,
    UserDefined,
    Taper,
    Break,
    Bloat,
    Vector3,
    ModConstant,
  } from "../node_modules/three.modifiers";


class F1Ribbons {

   
    constructor() {
        this.init();
    }



    init() {
        console.log(">> init F1 Ribbons and fx");
        var _self = this;
        this.root = new THREE.Object3D();
        this.boxroot = new THREE.Object3D();
        this.root.visible=false;
        this.setupRibbonMaterials();

        this.ribbonGeometry = new THREE.BoxGeometry(200, 15, 2, 64,2,2);

    }
    // ==============================================
    setupRibbonMaterials() {
        this.ribbonMaterial = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            name: 'ribbonMaterial'
        } );
        //
        this.redf1mat = new THREE.MeshBasicMaterial( {
            color: 0x451212,
            
        } );

    }
    // ==============================================
    getBentMesh() {

        this.ribbonMesh.dispose();
        this.ribbonMesh = new THREE.Mesh( this.ribbonGeometry, this.ribbonMaterial );
        this.ribbonMesh.position.set(0,30,0 );
        this.ribbonMesh.layers.set(1);

        this.modifier = new ModifierStack(this.ribbonMesh);
        const bend = new  Bend(1.0, 0.0, 0);
        bend.constraint = ModConstant.LEFT;


        this.modifier.addModifier(bend);
    }
    // ==============================================
    getSceneObjects(f1Materials) {
        //
        // const geometry = new THREE.BoxGeometry( 12, 12, 12 );
        // const ribbonGeometry = new THREE.PlaneGeometry(1024,128);
        // const ribbonGeometry = new THREE.PlaneBufferGeometry(2048, 128, 512, 128)
        // // const material = new THREE.MeshBasicMaterial( { color: 0xff0f0f } );
        // // const cube = new THREE.Mesh( geometry, material );
        // const ribbonMesh = new THREE.Mesh( ribbonGeometry, f1Materials.ribbonMaterial );
        // // baseTexture
        // ribbonMesh.scale.set(.3,.1,.1);
        // ribbonMesh.rotateX(-3.14159265 * 0.5);
        // ribbonMesh.rotateZ( -3.14159265 * 0.5);


        // ribbonMesh.position.set(-35,5,-164 );
        // ribbonMesh.layers.set(3);
        // const ribbonGeometry = new THREE.PlaneBufferGeometry(256, 64, 256, 64)
        // const ribbonGeometry = new THREE.BoxGeometry(50, 50, 50, 64,64,64);


        getBentMesh();


        // this.modifier = new ModifierStack(this.ribbonMesh);
        // const bend = new  Bend(1.0, 0.0, 0);
        // bend.constraint = ModConstant.LEFT;

        // const bend2 = new  Bend(0.5, 0.4, 0);
        // bend2.constraint = ModConstant.RIGHT;
        // const bend3 = new  Bend(0.5, 0.6, 0);
        // bend.constraint = ModConstant.LEFT;
        // // const bend4 = new  Bend(0.5, 0.85, 0);
        // // bend2.constraint = ModConstant.RIGHT;

        // this.modifier.addModifier(bend);
        // this.modifier.addModifier(bend2);
        // this.modifier.addModifier(bend3);
        // this.modifier.addModifier(bend4);




        // const bend = new  Bend(1.5, 0.2, 0);
        // bend.constraint = ModConstant.LEFT;
        
        // const cloth = new Cloth(1, 0);
        // cloth.setForce(0.2, -0.2, -0.2);
        
        // const twist = new Twist(0);
        // twist.vector = new Vector3(0, 1, 0);
        
        // const taper = new Taper(1);
        // taper.setFalloff(0.1, 0.5);
        
        // this.modifier.addModifier(bend);
        // this.modifier.addModifier(cloth);
        // this.modifier.addModifier(twist);
        // this.modifier.addModifier(taper);











        // ribbonMesh.position.set(0,30,-50 );

        //
        
        const boxgeometry = new THREE.BoxGeometry( 10, 10, 10 );
        const boxMesh = new THREE.Mesh( boxgeometry, this.redf1mat );
        this.boxroot.add(boxMesh);

        // const boxlamp = new THREE.PointLight(0xff0000,5.0,200);
        this.barlamp = new THREE.RectAreaLight(0xff0000,70,10,10);
        // const barlamphelper = new RectAreaLightHelper( barlamp );
        // barlamp.add( barlamphelper ); // helper must be added as a child of the light
        this.barlamp.rotateX(-3.14159265 * 0.5);

        this.boxroot.add(this.barlamp);
        this.boxroot.layers.set(3);
        this.boxroot.position.set(-35,25,-80 );

        //

        this.root.add(ribbonMesh);
        // this.root.add(this.boxroot);
        // this.nextPosition();

        // ok, another ribbon





        return this.root;
    }
    //======================
    stretchAnimation(obj, scale, duration) {

        const _self = this;

        var tweenscale = new TWEEN.Tween(obj.scale)
        .to({
                x: scale.x, y: scale.y, z: scale.z
            },
            duration
        )
        // .repeat(1)
        .delay(100)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(function (object) {
            _self.barlamp.width=(object.x * 10.0);
            _self.barlamp.height=(object.y * 10.0);
            // _self.barlamp.scale.set(object.x,object.y,object.z);
            //obj.position.set( object.x,object.y,object.z);
        })
        .onComplete(function () {
            // Call nextPosition only after the animation has completed
            _self.randomTransition();
        })        
        .start()
    }
    //======================
    randomTransition() {
        const r = (Math.random() * 2)| 0;
        console.log('random num r*2 = ' + r);
        if(r==0)
            this.nextPosition();
        else
        this.nextScale();
    }
    //======================
    moveAnimation(obj, pos, duration) {
        const _self = this;

        var tweenscale = new TWEEN.Tween(obj.position)
        .to({
                x: pos.x, y: pos.y, z: pos.z
            },
            duration
        )
        // .repeat(1)
        .delay(100)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(function (object) {
            //obj.position.set( object.x,object.y,object.z);
        })
        .onComplete(function () {
            // Call nextPosition only after the animation has completed
            _self.randomTransition();
        })        
        .start()
    }
    //======================
    nextPosition() {
        const x = Math.random() * 50.0;
        const y = Math.random() * 5.0;
        const z = Math.random() * 50.0;
        const duration = 1500;
        const _self = this;

        this.moveAnimation(this.boxroot, new THREE.Vector3(x,y+20,z), duration);

        
    }
    //======================
    nextScale() {
        const x = Math.random() * 5;
        const y = 0.2 + (Math.random() * .2);
        const z = Math.random() * 5;
        const duration = 500;
        const _self = this;

        this.stretchAnimation(this.boxroot, new THREE.Vector3(x,y,z), duration);

        
    }
    //======================
    update() {
		// TWEEN.update();
        // modifier.apply
        if(this.modifier) {
             this.modifier && this.modifier.apply();
        }
        // modifier && modifier.apply();
    }

    //======================

}

export { F1Ribbons };



/*
var geometry = new THREE.PlaneBufferGeometry(10, 10, 32, 32);

// Apply the BendModifier to the geometry
var modifier = new THREE.BendModifier();

// Set the bend angle to a sine function of the X coordinate
modifier.set(function(vertex, index, length) {
  var angle = Math.sin(vertex.x * 5) * Math.PI / 2;
  vertex.y = vertex.y * Math.cos(angle) + vertex.z * Math.sin(angle);
  vertex.z = vertex.z * Math.cos(angle) - vertex.y * Math.sin(angle);
});

modifier.modify(geometry);

// Create a Mesh using the modified geometry
var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
*/