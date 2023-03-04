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
        this.carChangeDuration = 3000;
        this.speedModDebug = 1.0;
        this.dodebug = false;

        this.prevupdate = new Date().getTime();
        this.timer1 = this.prevupdate;
        

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
        this.ribbonGeometry2 = new THREE.PlaneGeometry(300, 35, 64,4);
        this.carChangeTween = 0;
        this.carChangeDelta = 0.0;
        this.countbetweenribbons = 0;
        this.randomgap = 0;

        this.setupRibbonMaterials(f1Materials);

        // this.ribbonGeometry = new THREE.BoxGeometry(200, 15, 2, 64,2,2);

        document.getElementById('c_bendmodcon').onchange = function () {

            // _self.carChangeAnimate();

            var modcon = this.value;
            // if(modcon == 0) modcon = ModConstant.LEFT;
            // else if(modcon == 1) modcon = ModConstant.RIGHT;
//            else if(modcon == 2) modcon = ModConstant.C;
            const bendid =  document.getElementById('c_bend').value - 1;

            
            _self.modifierChange.stack[bendid].constraint = modcon;
            // _self.modifier.stack[bendid].constraint = modcon;

        }

        document.getElementById('c_bend').onchange = function () {
            const bendid = this.value - 1;
            // const force = _self.modifier.stack[bendid].force;
            // const pos =  _self.modifier.stack[bendid].offset;
            // const angle =  _self.modifier.stack[bendid].angle;
            // const modcon = _self.modifier.stack[bendid].constraint;
            const force = _self.modifierChange.stack[bendid].force;
            const pos =  _self.modifierChange.stack[bendid].offset;
            const angle =  _self.modifierChange.stack[bendid].angle;
            const modcon = _self.modifierChange.stack[bendid].constraint;


            document.getElementById('c_bendFSliderTxt').innerHTML = 'force: ' + force;
            document.getElementById('c_bendPSliderTxt').innerHTML = 'offset: ' + pos;
            document.getElementById('c_bendASliderTxt').innerHTML = 'angle: ' + angle;
            document.getElementById('c_bendFSlider').value = force*100;
            document.getElementById('c_bendPSlider').value = pos*100;
            document.getElementById('c_bendASlider').value = angle / (Math.PI/180.0);

            document.getElementById('c_bendmodcon').value = modcon;
            
            _self.modifierChange.stack[bendid].force = force;
            _self.modifierChange.stack[bendid].offset = pos;
            _self.modifierChange.stack[bendid].angle = angle;
            _self.modifierChange.stack[bendid].constraint = modcon;
            // _self.modifier.stack[bendid].force = force;
            // _self.modifier.stack[bendid].offset = pos;
            // _self.modifier.stack[bendid].angle = angle;
            // _self.modifier.stack[bendid].constraint = modcon;
        }

        document.getElementById('c_bendFSlider').oninput = function () {
            const amount = this.value/100.0;
            const bendid = document.getElementById('c_bend').value - 1;

            document.getElementById('c_bendFSliderTxt').innerHTML = 'force: ' + amount;
            // _self.modifier.stack[bendid].force = amount;
            _self.modifierChange.stack[bendid].force = amount;
        }
        document.getElementById('c_bendPSlider').oninput = function () {
            const amount = this.value/100.0;
            const bendid = document.getElementById('c_bend').value - 1;
            document.getElementById('c_bendPSliderTxt').innerHTML = 'offset: ' + amount;
            // _self.modifier.stack[bendid].offset = amount;
            _self.modifierChange.stack[bendid].offset = amount;
        }
        document.getElementById('c_bendASlider').oninput = function () {
            const amount = this.value * (Math.PI/180.0);
            const bendid = document.getElementById('c_bend').value - 1;
            document.getElementById('c_bendASliderTxt').innerHTML = 'angle: ' + amount;
            // _self.modifier.stack[bendid].angle = amount;
            _self.modifierChange.stack[bendid].angle = amount;
        }

    }
    // ==============================================
    setupRibbonMaterials(f1Materials) {

        /*
        // == car change one
        this.uniformsCarChange = {
            texture1: { value: 0 },  // base pattern
            fTime: { value: 0.0},
            faderTime: { value: 0.0},
          };
  
        this.ribbonMaterialCarChange = new THREE.ShaderMaterial({
            name: 'ribbonMaterialCarChange',

            uniforms: this.uniformsCarChange,
            vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                vec3 pos = position;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
            `,
            fragmentShader: `
            uniform sampler2D texture1;

            varying vec2 vUv;
            uniform float fTime;
//==================================================================          
            void main() {

                vec2 uv = vUv.yx;
                // uv.y=1.0-uv.y; // start from the correct start point 


                vec4 colour = texture2D(texture1, uv - vec2(0,fTime*2.0));

                vec4 outcolour = colour;
                float alf = outcolour.x;

                outcolour.x = uv.y;
                outcolour.y = fTime;

                //                if((1.0-uv.y) < fTime*4.0) outcolour.xyz = vec3(0,0,0);
                // if(uv.y < fTime*4.0) outcolour.xyz = vec3(0,0,0);
                if(uv.y > fTime*3.0) outcolour.xyz = vec3(0,0,0);

                gl_FragColor = vec4(outcolour.xyz,alf);
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
            depthTest: true, // disable depth testing            
        });        
        */




        //==================================
        this.uniforms = {
            texture1: { value: 0 },  // base pattern
            fTime: { value: 0.0},
            faderTime: { value: 0.0},
          };
  
        this.ribbonMaterial = new THREE.ShaderMaterial({
            name: 'ribbonMaterial',

            uniforms: this.uniforms,
            vertexShader: `
            varying vec2 vUv;
            varying float viewerDistance;

            void main() {
                vUv = uv;
                vec3 pos = position;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
              
                // Calculate distance from camera
                viewerDistance = length(mvPosition.xyz);
                              
//                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
            `,
            fragmentShader: `
            uniform sampler2D texture1;

            varying vec2 vUv;
            uniform float fTime;
            uniform float faderTime;
            varying float viewerDistance;

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
                // outcolour = getEndFade(outcolour, 0.9);

                // if(uv.y >= fTime - 0.2 && uv.y <= fTime + 0.2) {
                //     float amnt=1.0;
                //     if(uv.y < fTime) {
                //         amnt = (uv.y - fTime + 0.2) / 0.2;
                //     }
                //     else if(uv.y > fTime) {
                //         amnt = 1.0 - ((uv.y - fTime) / 0.2);
                //     }
                //     outcolour *= amnt;
                // }



                uv = vUv.yx + vec2(0,g_rate);
                uv.x = (uv.x*0.6) + 0.5;
                colour = texture2D(texture1, uv);
                // if(uv.y >= fTime - 0.2 && uv.y <= fTime + 0.2) {

                //     float amnt=1.0;
                //     if(uv.y < fTime) {
                //         amnt = (uv.y - fTime + 0.2) / 0.2;
                //     }
                //     else if(uv.y > fTime) {
                //         amnt = 1.0 - ((uv.y - fTime) / 0.2);
                //     }
                //     colour *= amnt;
                // }


                outcolour = max(outcolour, vec3(0.7,0.6,0) * max(max(colour.r,colour.g),colour.b));
                outcolour = getEndFade(outcolour, 0.75);

                uv = vUv.yx + vec2(0,b_rate);
                uv.x = (uv.x*1.3) + 0.5;
                colour = texture2D(texture1, uv);
                // if(uv.y >= fTime - 0.2 && uv.y <= fTime + 0.2) {

                //     float amnt=1.0;
                //     if(uv.y < fTime) {
                //         amnt = (uv.y - fTime + 0.2) / 0.2;
                //     }
                //     else if(uv.y > fTime) {
                //         amnt = 1.0 - ((uv.y - fTime) / 0.2);
                //     }
                //     colour *= amnt;
                // }



                float b = max(max(colour.r,colour.g),colour.b);
                outcolour = max(outcolour, vec3(0.2,0.2,1) * max(max(colour.r,colour.g),colour.b));
                outcolour = getEndFade(outcolour, 0.6);


                // if(vUv.y < 0.2) {
                //     float amnt = (vUv.y / 0.2);
                //     a = a * amnt;
                //     outcolour*=amnt;
                // }
                // else if(vUv.y >= 0.8) {
                //     float amnt = (1.0-((vUv.y-0.8) / 0.2));
                //     a = a * amnt;
                //     outcolour*=amnt;
                // }

                float v = 1.0;
                // if( viewerDistance >= 200.0) {
                //     float amnt = (viewerDistance - 200.0) / 300.0;
                //     if(amnt>1.0) amnt=1.0;
                //     amnt = 1.0 - amnt;
                //     outcolour *= amnt;
                // }

                float amnt =1.0;
                // if( viewerDistance <= 150.0) {
                //     amnt = (viewerDistance ) / 150.0;
                //     if(amnt>1.0) amnt=1.0;
                //     // amnt = 1.0 - amnt;
                //     outcolour *= amnt * amnt;
                // }
                // else if( viewerDistance >= 200.0) {
                //     float amnt = (viewerDistance - 200.0) / 300.0;
                //     if(amnt>1.0) amnt=1.0;
                //     amnt = 1.0 - amnt;
                //     outcolour *= amnt;
                // }


                float a = max(outcolour.r,max(outcolour.g,outcolour.b));

                a = a * faderTime * amnt;
                outcolour *= faderTime;

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
            // this.uniformsCarChange.texture1.value = f1Materials.keepRibbon;
            
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
    // this.createTwist([1.3, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.0, 20000*this.speedModDebug, 0]);// 1]);

    createTwist(twistparams,themodifier) { // 0=twistcount, 1=vec3 dir 2=tweentype, 3=target, 4=duration, 5=yoyo
        const twist = new Twist(twistparams[0]);
        twist.vector = twistparams[1];
        themodifier.addModifier(twist);

        // if(!this.dodebug) {

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
        // }
    }
    // ==============================================

    createBend(b,bendparam,themodifier) {
        const speed = 1.0;

        const bend = new Bend(bendparam.force, bendparam.offset, bendparam.angle);
        //bend.constraint = modCons;
        themodifier.addModifier(bend);
        // this.modifier.addModifier(bend);

        if(!this.dodebug) {
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
    }
    // ==============================================
    createBentMeshParams(bendarray) {

//        var modcon = ModConstant.LEFT;
        for(var b=0;b<bendarray.length;b++) {
            this.createBend(b,bendarray[b],this.modifier);
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
        // this.modifier.stack[bendid].force = f;
        // this.modifier.stack[bendid].offset = p;
        // this.modifier.stack[bendid].angle = a;
        this.modifierChange.stack[bendid].force = f;
        this.modifierChange.stack[bendid].offset = p;
        this.modifierChange.stack[bendid].angle = a;
        
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
        


        bends.push(new ABend(2.0, 0.25, 0.0,   2.0, 0.75, 0.0,    30000*this.speedModDebug, TWEEN.Easing.Cubic.InOut,1)); // static
        bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    30000*this.speedModDebug, TWEEN.Easing.Linear.None,2));
        // bends.push(new ABend(2.0, 0, 0.0,   2.0, 1, 0.0,    30000*this.speedModDebug, TWEEN.Easing.Cubic.InOut,1)); // static
        // bends.push(new ABend(-2.0, 0, 0.0,   -2.0, 1, 0.0 * Math.PI,    30000*this.speedModDebug, TWEEN.Easing.Linear.None,1));

        this.createBentMeshParams(bends);
        this.createTwist([1.3, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.0, 20000*this.speedModDebug, 0],this.modifier);// 1]);
        // this.createTwist([1.5, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0, 20000*this.speedModDebug, 0]);// 1]);

        // 0=twistcount, 1=vec3 dir 2=tweentype, 3=target, 4=duration, 5=yoyo

    

    }
    // ==============================================
    /*
    carChangeAnimate() {
        var _self=this;
        _self.modifierChange.stack[2].offset = 0.3;
        _self.ribbonMeshChange.visible=true;
        this.uniformsCarChange.fTime.value = 0.0;
        
        this.carChangeDelta = 0.0;

        if(this.carChangeTween) {
            TWEEN.remove(this.carChangeTween);
        }
        // return;
        this.carChangeTween = new TWEEN.Tween(this.modifierChange.stack[2])
            .to({
                    offset: 0.8,
                },
                _self.carChangeDuration
            )

            // .repeat(Infinity)
            // .yoyo(bendparam.yoyo==1?true : false)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function (object) {
                //obj.position.set( object.x,object.y,object.z);
            })
            .onComplete(function () {
                // Call nextPosition only after the animation has completed
                // hide and set back to position for next one
                _self.ribbonMeshChange.visible=false;
                _self.uniformsCarChange.fTime.value = -1.0;
                this.carChangeDelta=0.0;
                console.log(">> done animated car change ribbon")
            })        
            .start()
    }
    
    // ==============================================
    addCarChangeRibbon() {
        // ribbon for when change occurs
        // this.ribbonMeshChange = new THREE.Mesh( this.ribbonGeometry2,new THREE.MeshStandardMaterial( {
        //     color: 0xffffff,
        //     transparent: true,
        //     opacity: 1,
        //     side: THREE.DoubleSide,
        //     name: 'ribbonMaterial'
        // } ) );
        this.ribbonMeshChange = new THREE.Mesh( this.ribbonGeometry2,this.ribbonMaterialCarChange );        
        this.ribbonMeshChange.layers.set(3); // 1
        this.modifierChange = new ModifierStack(this.ribbonMeshChange);
        this.ribbonMeshChange.position.set(0,15,-20 );
        this.ribbonMeshChange.rotateY((Math.PI / 180)*90);
        this.ribbonMeshChange.rotateX((Math.PI / 180)*90);

        // this.createBentMesh();
        this.createBend(0,new ABend(2.0, 0.5, 0*(Math.PI/180.0),   2.0, 0.5, 2.0 * Math.PI,    30000*this.speedModDebug, TWEEN.Easing.Linear.None,0),this.modifierChange);
        this.createBend(1,new ABend(-0.95, 0.5, 0*(Math.PI/180.0),   1.2, 0.5, 1.6 * Math.PI,    30000*this.speedModDebug, TWEEN.Easing.Linear.None,0),this.modifierChange);
        this.createBend(2,new ABend( 2, 0.3, 0* (Math.PI/180.0),   2, 0.8, 0 * Math.PI,    30000*this.speedModDebug, TWEEN.Easing.Linear.None,0),this.modifierChange);
        this.createTwist([-1.5, new Vector3(1,1,1), TWEEN.Easing.Linear.None, 1.5, 20000*this.speedModDebug, 1],this.modifierChange);// 1]);

        this.modifierChange.stack[0].constraint = -1;
        this.modifierChange.stack[1].constraint = 1;
        this.modifierChange.stack[2].constraint = 1;


        this.root.add(this.ribbonMeshChange);
        //
    }
    */
    // ==============================================
    getSceneObjects(f1Materials) {

        // addCarChangeRibbon();
        
        this.ribbonMesh = new THREE.Mesh( this.ribbonGeometry, this.ribbonMaterial );
        // this.ribbonMesh = new THREE.Mesh( this.ribbonGeometry, new THREE.MeshStandardMaterial( {
        //     color: 0xffffff,
        //     transparent: true,
        //     opacity: 1,
        //     side: THREE.DoubleSide,
        //     name: 'ribbonMaterial'
        // } ) );

        this.ribbonMesh.layers.set(3); // 1
        this.modifier = new ModifierStack(this.ribbonMesh);
        this.ribbonMesh.position.set(5,20,-105 );

        this.createBentMesh();
        this.root.add(this.ribbonMesh);

     
        
        // const boxgeometry = new THREE.BoxGeometry( 10, 10, 10 );
        // const boxMesh = new THREE.Mesh( boxgeometry, this.redf1mat );
        // this.boxroot.add(boxMesh);

        // // const boxlamp = new THREE.PointLight(0xff0000,5.0,200);
        // this.barlamp = new THREE.RectAreaLight(0xff0000,70,10,10);
        // // const barlamphelper = new RectAreaLightHelper( barlamp );
        // // barlamp.add( barlamphelper ); // helper must be added as a child of the light
        // this.barlamp.rotateX(-3.14159265 * 0.5);

        // this.boxroot.add(this.barlamp);
        // this.boxroot.layers.set(3);
        // this.boxroot.position.set(-35,25,-80 );

        //

        // this.root.add(this.boxroot);
        // this.nextPosition();

        // ok, another ribbon
        this.ribbonMesh2 = this.ribbonMesh.clone();
        this.ribbonMesh2.position.set(-20,25,-100 );
        this.ribbonMesh2.scale.set(2,3,1.5);
        this.ribbonMesh2.rotateZ((Math.PI / 180)*180);
//        this.ribbonMesh2.rotateZ((Math.PI / 180)*-45);

        // also try moving them far and near
        if(!this.dodebug) {
            // new TWEEN.Tween(this.ribbonMesh2.position)
            // .to({
            //         x: -20,
            //         y: -25,
            //         z: -120
            //     },
            //     32000*this.speedModDebug
            // )
            // .repeat(Infinity)
            // .yoyo(true)
            // .easing(TWEEN.Easing.Back.InOut)
            // .start()
            // new TWEEN.Tween(this.ribbonMesh.position)
            // .to({
            //         x: 0,
            //         y: 30,
            //         z: -80

            //     },
            //     30000*this.speedModDebug
            // )
            // .repeat(Infinity)
            // .yoyo(true)
            // .easing(TWEEN.Easing.Back.InOut)
            // .start()        
        }


        this.root.add(this.ribbonMesh2); // all good with this one


        // const planeCrop = new THREE.PlaneGeometry(300,300);
        // const planeCrop = new THREE.CircleGeometry( 160, 32 ); // same as garage floor
        const planeCrop = new THREE.CircleGeometry( 80, 32 ); // same as garage floor

        const planeCropMesh = new THREE.Mesh( planeCrop, this.floorGlowMat );
        planeCropMesh.rotateX((Math.PI / 180)*-90);
        planeCropMesh.position.set(0,-9.8,0);
        planeCropMesh.layers.set(3);

        this.root.add(planeCropMesh);



        return this.root;
    }
    //======================
    /*
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
    */
    //======================
    mathPulse(a) {

        const tweak = 1.0;

        let w1 = 0.5 * tweak;
        let w2 = 0.75 * tweak;
        let w3 = 1.0 * tweak;
        let p1 = 0.2 * tweak;
        let p2 = Math.PI/2;
        let p3 = Math.PI;
        let A1 = 0.2;
        let A2 = 0.3;
        let A3 = 0.5;
        let wm = 0.1;
        let A3m = 0.2;

        let combinedAmplitude = Math.sqrt(A1*A1 + A2*A2 + A3*A3 + 2*A1*A2*Math.cos(w1*a - w2*a + p2 - p1) + 2*A1*A3*Math.cos(w1*a - w3*a + p3 - p1) + 2*A2*A3*Math.cos(w2*a - w3*a + p3 - p2));
        let combinedWave = A1*Math.sin(w1*a + p1) + A2*Math.sin(w2*a + p2) + A3*Math.sin(w3*a + p3) + A3m*Math.sin(wm*a)*A3;
        return (combinedWave/combinedAmplitude + 1)/2;


        // return A1 * Math.sin(w1 * a + p1) +
        //        A2 * Math.sin(w2 * a + p2) +
        //        (A3 + A3m * Math.sin(wm * a)) * Math.sin(w3 * a + p3);
      }

    sineWave(t) {
        return (1 + Math.sin(2*Math.PI*t - Math.PI/2))/2;
    }
      
    easedSineWave(t) {
        const easeInDuration = 0.1; // time to ease into 1
        const easeOutDuration = 0.6; // time to ease out of 1
        const easeInFactor = this.easeFactor(t, easeInDuration);
        const easeOutFactor = this.easeFactor(t, easeOutDuration);
        const easedValue = this.sineWave(t) * easeOutFactor + (1 - easeInFactor);
        return easedValue;
    }
    
    easeFactor(t, duration) {
        const halfDuration = duration / 2;
        const startTime = 0.5 - halfDuration;
        const endTime = 0.5 + halfDuration;
        if (t < startTime) {
            return 0;
        } else if (t < 0.5) {
            return 0.5 * (1 + Math.sin(Math.PI * (t - startTime) / duration - Math.PI / 2));
        } else if (t < endTime) {
            return 1;
        } else {
            return 0.5 * (1 + Math.sin(Math.PI * (t - endTime) / duration - Math.PI / 2));
        }
    }
      


    update() {

        const currenttime = new Date().getTime();
        const elapsed = currenttime - this.prevupdate;

        const uvflow = (currenttime*0.25) % 5000;

        this.uniforms.fTime.value = uvflow/5000.0;
        
        const modded = (currenttime*0.00005)%360;
        // const sined = (Math.sin( modded * (3.14159265 * 2.0) ) + 1.0)*0.5;
        // this.uniforms.faderTime.value = (sined*0.5)+0.5;

        // if( this.uniformsCarChange.fTime.value >= 0.0) {
        //     this.carChangeDelta += elapsed;
        //     if(this.carChangeDelta>=this.carChangeDuration) this.carChangeDelta = this.carChangeDuration;
        //     // console.log(this.carChangeDelta / this.carChangeDuration);
        //     this.uniformsCarChange.fTime.value = this.carChangeDelta / this.carChangeDuration;
        //     // console.log(this.uniformsCarChange.fTime.value + " , " + (this.carChangeDelta / this.carChangeDuration));

        // }
            

        
        // let a = (currenttime*0.0005) % (2 * Math.PI);
        // const glow = this.mathPulse(a);

        // const glow = this.easedSineWave(modded*0.45);
        var glow = Math.sin(modded);
        if(glow <= 0.0) {
            glow = -(glow*0.5);
        }
        // console.log(modded + " = " + glow);


        this.uniforms.faderTime.value = glow;



        // console.log('a=' + sined);

//        const t = (this.uniforms.faderTime.value % 360) * (3.14159265 * 2.0);
//        const sinefade = (Math.sin(t)+1.0)*0.5;

//        console.log('this.uniforms.faderTime.value = '+ this.uniforms.faderTime.value);
        // console.log('this.uniforms.fTime.value= '+this.uniforms.fTime.value);
        if(elapsed < 10)
            return;

        this.prevupdate = currenttime;
        
        if(this.modifier) {
             this.modifier && this.modifier.apply();
        }
        if(this.modifierChange) {
            this.modifierChange && this.modifierChange.apply();
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