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

class ABend {
    constructor(force,offset,angle,tforce,toffset,tangle,duration, tweentype, yoyo) {
        this.force = force;
        this.offset = offset;
        this.angle = angle;
        this.tforce = tforce;
        this.toffset = toffset;
        this.tangle = tangle;
        this.tweentype = tweentype;
        this.yoyo = yoyo;
        this.duration = duration;
    }
}

class F1Ribbons {

   
    constructor(f1Materials) {

        this.prevupdate = new Date().getTime();
        this.timer1 = 0;
        

        this.init(f1Materials);
    }



    init(f1Materials) {
        console.log(">> init F1 Ribbons and fx");
        this.enabled=true;

        var _self = this;
        this.root = new THREE.Object3D();
        this.boxroot = new THREE.Object3D();
        this.root.visible=this.enabled;
        this.enableGlow = true;
        this.ribbonGeometry = new THREE.PlaneGeometry(200, 15, 64,2);
        this.setupRibbonMaterials(f1Materials);

        // this.ribbonGeometry = new THREE.BoxGeometry(200, 15, 2, 64,2,2);

        document.getElementById('c_bendmodcon').onchange = function () {
            var modcon = this.value;
            // if(modcon == 0) modcon = ModConstant.LEFT;
            // else if(modcon == 1) modcon = ModConstant.RIGHT;
//            else if(modcon == 2) modcon = ModConstant.C;
            const bendid =  document.getElementById('c_bend').value - 1;

            _self.modifier.stack[bendid].constraint = modcon;

        }

        document.getElementById('c_bend').onchange = function () {
            const bendid = this.value - 1;
            const force = _self.modifier.stack[bendid].force;
            const pos =  _self.modifier.stack[bendid].offset;
            const angle =  _self.modifier.stack[bendid].angle;
            const modcon = _self.modifier.stack[bendid].constraint;


            document.getElementById('c_bendFSliderTxt').innerHTML = 'force: ' + force;
            document.getElementById('c_bendPSliderTxt').innerHTML = 'offset: ' + pos;
            document.getElementById('c_bendASliderTxt').innerHTML = 'angle: ' + angle;
            document.getElementById('c_bendFSlider').value = force*100;
            document.getElementById('c_bendPSlider').value = pos*100;
            document.getElementById('c_bendASlider').value = angle / (Math.PI/180.0);

            document.getElementById('c_bendmodcon').value = modcon;
            

            _self.modifier.stack[bendid].force = force;
            _self.modifier.stack[bendid].offset = pos;
            _self.modifier.stack[bendid].angle = angle;
            _self.modifier.stack[bendid].constraint = modcon;
        }

        document.getElementById('c_bendFSlider').oninput = function () {
            const amount = this.value/100.0;
            const bendid = document.getElementById('c_bend').value - 1;

            document.getElementById('c_bendFSliderTxt').innerHTML = 'force: ' + amount;
            _self.modifier.stack[bendid].force = amount;
        }
        document.getElementById('c_bendPSlider').oninput = function () {
            const amount = this.value/100.0;
            const bendid = document.getElementById('c_bend').value - 1;
            document.getElementById('c_bendPSliderTxt').innerHTML = 'offset: ' + amount;
            _self.modifier.stack[bendid].offset = amount;
        }
        document.getElementById('c_bendASlider').oninput = function () {
            const amount = this.value * (Math.PI/180.0);
            const bendid = document.getElementById('c_bend').value - 1;
            document.getElementById('c_bendASliderTxt').innerHTML = 'angle: ' + amount;
            _self.modifier.stack[bendid].angle = amount;
        }

    }
    // ==============================================
    setupRibbonMaterials(f1Materials) {
        this.uniforms = {
            texture1: { value: 0 },  // base pattern
            fTime: { value: 0.0},
          };
  
        this.ribbonMaterial = new THREE.ShaderMaterial({
            name: 'ribbonMaterial',

            uniforms: this.uniforms,
            vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                vec3 pos = position;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
            `,
            fragmentShader: `
            uniform sampler2D texture1;

            varying vec2 vUv;
            uniform float fTime;

//==================================================================          
            vec3 getEndFade(vec3 vin, float edge) {
                if(vUv.x >= edge) {
                    return mix(vin,vec3(0,0,0), (vUv.x - edge) / (1.0-edge));
                }
                else
                    return vin;
            }
//==================================================================          
            void main() {
                float speedconst = 0.3;
                float r_rate = fTime * 4.0;
                float g_rate = fTime * 2.0;
                float b_rate = fTime * 1.0;

                vec2 uv = vUv.yx + vec2(0,r_rate);
                // uv.x *= 1.0;
                uv.x += (sin(fTime*3.14159275*20.0) * 0.052) * vUv.y;
                // uv.x *= sin(fTime/1000.0 * 3.14159254 * 2.0)*0.5;


                vec4 colour = texture2D(texture1, uv);
                vec3 outcolour = vec3(1,0,0) * max(max(colour.r,colour.g),colour.b);
                outcolour = getEndFade(outcolour, 0.9);

                uv = vUv.yx + vec2(0,g_rate);
                uv.x = (uv.x*0.6) + 0.5;
                colour = texture2D(texture1, uv);
                outcolour = max(outcolour, vec3(0.7,0.6,0) * max(max(colour.r,colour.g),colour.b));
                outcolour = getEndFade(outcolour, 0.75);

                uv = vUv.yx + vec2(0,b_rate);
                uv.x = (uv.x*1.3) + 0.5;
                colour = texture2D(texture1, uv);
                float b = max(max(colour.r,colour.g),colour.b);
                outcolour = max(outcolour, vec3(0.2,0.2,1) * max(max(colour.r,colour.g),colour.b));
                outcolour = getEndFade(outcolour, 0.6);

                float a = max(outcolour.r,max(outcolour.g,outcolour.b));

                if(vUv.y < 0.2) {
                    float amnt = (vUv.y / 0.2);
                    a = a * amnt;
                    outcolour*=amnt;
                }
                else if(vUv.y >= 0.8) {
                    float amnt = (1.0-((vUv.y-0.8) / 0.2));
                    a = a * amnt;
                    outcolour*=amnt;
                }

                gl_FragColor = vec4(outcolour,a);

      
            }
            `,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            alphaTest: 0.1,
          depthWrite: false, // disable writing to depth buffer
        //   depthTest: false, // disable depth testing            
          depthTest: true, // disable depth testing            
        });
        if(f1Materials.keepRibbon!=0) {
           this.uniforms.texture1.value = f1Materials.keepRibbon;
        }


        this.ribbonMaterialsimple = new THREE.MeshStandardMaterial( {
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

        this.floorGlowMat = new THREE.MeshBasicMaterial( {
            color: 0x5f0505,
        } );


    }
    // ==============================================
    createTwist(twistparams) { // 0=twistcount, 1=vec3 dir 2=tweentype, 3=target, 4=duration, 5=yoyo
        const twist = new Twist(twistparams[0]);
        twist.vector = twistparams[1];
        this.modifier.addModifier(twist);
        if(twistparams[5]!=0) {
            new TWEEN.Tween(twist)
            .to({
                    angle: twistparams[3],
                },
                twistparams[4]
            )

            .repeat(Infinity)
            .yoyo(twistparams[5]==1?true : false)
            .easing(twistparams[2])
            .onUpdate(function (object) {
                //obj.position.set( object.x,object.y,object.z);
            })
            .onComplete(function () {
                // Call nextPosition only after the animation has completed
            })        
            .start()

        }

    }
    // ==============================================

    createBend(b,bendparam) {
        const speed = 1.0;

        const bend = new Bend(bendparam.force, bendparam.offset, bendparam.angle);
        //bend.constraint = modCons;
        this.modifier.addModifier(bend);

        if(bendparam.yoyo!=0) {
            new TWEEN.Tween(bend)
            .to({
                    force: bendparam.tforce,
                    offset: bendparam.toffset,
                    angle: bendparam.tangle

                },
                bendparam.duration*speed
            )

            .repeat(Infinity)
            .yoyo(bendparam.yoyo==1?true : false)
            .easing(bendparam.tweentype)
            .onUpdate(function (object) {
                //obj.position.set( object.x,object.y,object.z);
            })
            .onComplete(function () {
                // Call nextPosition only after the animation has completed
            })        
            .start()
        }


    }
    // ==============================================
    createBentMeshParams(bendarray) {

//        var modcon = ModConstant.LEFT;
        for(var b=0;b<bendarray.length;b++) {
            this.createBend(b,bendarray[b]);
            // this.createBend(b,bendarray[b],bendaniarray[b],modcon);
            // if(modcon==ModConstant.LEFT)
            //     modcon = ModConstant.RIGHT;
            // else
            //     modcon = ModConstant.LEFT;
        }
    }
    // ==============================================
    getRandomBend() {
        const angle = 0.0;

        var bvals = new THREE.Vector3(Math.random()* 2.0,Math.random()* 1.0,angle);
        console.log('bvals='+bvals.x+","+bvals.y+","+bvals.z);

        return bvals;
    }
    // ==============================================
    changeModifier(bendid,f,p,a) {
        this.modifier.stack[bendid].force = f;
        this.modifier.stack[bendid].force = p;
        this.modifier.stack[bendid].angle = a;
        
    }
    // ==============================================
    createBentMesh() {
        console.log("--")
        var bends = new Array();
//TWEEN.Easing.Cubic.InOut
//TWEEN.Easing.Linear.None
//TWEEN.Easing.Elastic.
//TWEEN.Easing.Elastic.InOut

        // bends.push(new ABend(2.0, 0.49, 0.0,   2.0, 0.51, 0.0, 2000, -999,true));
        // bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI, 2000, TWEEN.Easing.Linear.None,false));
        // bends.push(new ABend(0.0, 0.0, 2.0,   0.5, 0.5, 4.0 , 2000, -999,true));
        // bends.push(new ABend(-2.0, 0.29, 3.50 ,   -0.1, 0.29, 3.50, 2000, -999,true));

        // bends.push(new ABend(2.0, 0.5, 0.0,   2.0, 0.5, 0.0, 0, -999,true)); // static
        // bends.push(new ABend(-2.0, 0.5, 0.0,   2.0, 0.5, 2.0 * Math.PI, 10000, -999,true));

        // bends.push(new ABend(0.0, 0.0, 2.0,   0.5, 0.5, 4.0 , 2000, -999,true));
        // bends.push(new ABend(-1.0, 0.0, 3.50 ,   -1.0, 1.0, 3.50, 10000, -999,false));
        



        bends.push(new ABend(2.0, 0.25, 0.0,   0.0, 0.75, 0.0,    30000, TWEEN.Easing.Cubic.InOut,1)); // static
        bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    30000, TWEEN.Easing.Linear.None,2));

        this.createBentMeshParams(bends);
        this.createTwist([2, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.0, 20000, 0]);// 1]);

        // 0=twistcount, 1=vec3 dir 2=tweentype, 3=target, 4=duration, 5=yoyo

    

    }
    // ==============================================
    getSceneObjects(f1Materials) {

        this.ribbonMesh = new THREE.Mesh( this.ribbonGeometry, this.ribbonMaterial );

        this.ribbonMesh.layers.set(3); // 1
        this.modifier = new ModifierStack(this.ribbonMesh);
        this.ribbonMesh.position.set(0,30,0 );

        this.createBentMesh();

     
        
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

        this.root.add(this.ribbonMesh);
        // this.root.add(this.boxroot);
        // this.nextPosition();

        // ok, another ribbon
        this.ribbonMesh2 = this.ribbonMesh.clone();
        this.ribbonMesh2.position.set(-20,25,-80 );
        this.ribbonMesh2.scale.set(3,4,2);
        this.ribbonMesh2.rotateZ((Math.PI / 180)*180);
//        this.ribbonMesh2.rotateZ((Math.PI / 180)*-45);


        this.root.add(this.ribbonMesh2);


        const planeCrop = new THREE.PlaneGeometry(300,300);
        const planeCropMesh = new THREE.Mesh( planeCrop, this.floorGlowMat );
        planeCropMesh.rotateX((Math.PI / 180)*-90);
        planeCropMesh.position.set(0,-9.5,0);
        planeCropMesh.layers.set(3);

        this.root.add(planeCropMesh);



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

        const currenttime = new Date().getTime();
        const elapsed = currenttime - this.prevupdate;

        const uvflow = (currenttime*0.25) % 5000;

        this.uniforms.fTime.value = uvflow/5000.0;
        // console.log('this.uniforms.fTime.value= '+this.uniforms.fTime.value);
        if(elapsed < 10)
            return;

        this.prevupdate = currenttime;
        
        if(this.modifier) {
             this.modifier && this.modifier.apply();
        }
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

/*
        new TWEEN.Tween(bend)
        .to({
                force: 0.0,

            },
            1000
        )
        // .to({
        //     force: bendparam.x,

        //     },
        //     1000
        // )
    
        .repeat(Infinity)
        .delay(100)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(function (object) {
            //obj.position.set( object.x,object.y,object.z);
        })
        .onComplete(function () {
            // Call nextPosition only after the animation has completed
        })        
        .start()
*/