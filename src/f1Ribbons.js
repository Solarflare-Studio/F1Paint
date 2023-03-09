import * as THREE from '../node_modules/three/build/three.module.js';
import { RectAreaLightHelper } from '../node_modules/three/examples/jsm/helpers/RectAreaLightHelper.js';
import { TWEEN } from '../node_modules/three/examples/jsm/libs/tween.module.min'
import {DEBUG_MODE} from './adminuser'

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
        // this.timer1 = this.prevupdate;
        this.deviceTime = 0;
        

        this.init(f1Materials);
    }



    init(f1Materials) {
        if(DEBUG_MODE)
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
        }

        document.getElementById('c_bendFSlider').oninput = function () {
            const amount = this.value/100.0;
            const bendid = document.getElementById('c_bend').value - 1;

            document.getElementById('c_bendFSliderTxt').innerHTML = 'force: ' + amount;
            _self.modifierChange.stack[bendid].force = amount;
        }
        document.getElementById('c_bendPSlider').oninput = function () {
            const amount = this.value/100.0;
            const bendid = document.getElementById('c_bend').value - 1;
            document.getElementById('c_bendPSliderTxt').innerHTML = 'offset: ' + amount;
            _self.modifierChange.stack[bendid].offset = amount;
        }
        document.getElementById('c_bendASlider').oninput = function () {
            const amount = this.value * (Math.PI/180.0);
            const bendid = document.getElementById('c_bend').value - 1;
            document.getElementById('c_bendASliderTxt').innerHTML = 'angle: ' + amount;
            _self.modifierChange.stack[bendid].angle = amount;
        }

    }
    // ==============================================
    setupRibbonMaterials(f1Materials) {

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
                // viewerDistance = length(mvPosition.xyz);    // not currently used
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
                uv.x += (sin(fTime*3.14159275*20.0) * 0.052) * vUv.y;


                vec4 colour = texture2D(texture1, uv);
                vec3 outcolour = vec3(1,0,0) * max(max(colour.r,colour.g),colour.b);

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

                a = a * faderTime;
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
          depthTest: true, // disable depth testing            
        });
        this.failsafeLoadRibbon(this,f1Materials);

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
    failsafeLoadRibbon(self,f1Materials) {

        if(f1Materials.keepRibbon!=0) {
            self.uniforms.texture1.value = f1Materials.keepRibbon;
        }
        else {
            setTimeout( function() {
                self.failsafeLoadRibbon(self,f1Materials);
            },250);
        }
    }
    // ==============================================
    createTwist(twistparams,themodifier) { // 0=twistcount, 1=vec3 dir 2=tweentype, 3=target, 4=duration, 5=yoyo
        const twist = new Twist(twistparams[0]);
        twist.vector = twistparams[1];
        themodifier.addModifier(twist);

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

    createBend(b,bendparam,themodifier) {
        const speed = 1.0;

        const bend = new Bend(bendparam.force, bendparam.offset, bendparam.angle);
        themodifier.addModifier(bend);

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
                .start()
            }
        }
    }
    // ==============================================
    createBentMeshParams(bendarray) {

//        var modcon = ModConstant.LEFT;
        for(var b=0;b<bendarray.length;b++) {
            this.createBend(b,bendarray[b],this.modifier);
        }
    }
    // ==============================================
    getRandomBend() {
        const angle = 0.0;

        var bvals = new THREE.Vector3(Math.random()* 2.0,Math.random()* 1.0,angle);
        if(DEBUG_MODE)
            console.log('bvals='+bvals.x+","+bvals.y+","+bvals.z);

        return bvals;
    }
    // ==============================================
    changeModifier(bendid,f,p,a) {
        this.modifierChange.stack[bendid].force = f;
        this.modifierChange.stack[bendid].offset = p;
        this.modifierChange.stack[bendid].angle = a;
    }
    // ==============================================
    createBentMesh() {
        if(DEBUG_MODE)
            console.log("--")
        var bends = new Array();
//TWEEN.Easing.Cubic.InOut
//TWEEN.Easing.Linear.None
//TWEEN.Easing.Elastic.
//TWEEN.Easing.Elastic.InOut

        bends.push(new ABend(2.0, 0.25, 0.0,   2.0, 0.75, 0.0,    30000*this.speedModDebug, TWEEN.Easing.Cubic.InOut,1)); // static
        bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    30000*this.speedModDebug, TWEEN.Easing.Linear.None,2));

        this.createBentMeshParams(bends);
        this.createTwist([1.3, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.0, 20000*this.speedModDebug, 0],this.modifier);// 1]);
  

    }
   
    // ==============================================
    getSceneObjects() {

        this.ribbonMesh = new THREE.Mesh( this.ribbonGeometry, this.ribbonMaterial );

        this.ribbonMesh.layers.set(3); // 1
        this.modifier = new ModifierStack(this.ribbonMesh);
        this.ribbonMesh.position.set(5,20,-105 );

        this.createBentMesh();
        this.root.add(this.ribbonMesh);


        // ok, another ribbon
        this.ribbonMesh2 = this.ribbonMesh.clone();
        this.ribbonMesh2.position.set(-20,25,-100 );
        this.ribbonMesh2.scale.set(2,3,1.5);
        this.ribbonMesh2.rotateZ((Math.PI / 180)*180);

        this.root.add(this.ribbonMesh2); // all good with this one

        const planeCrop = new THREE.CircleGeometry( 80, 32 ); // same as garage floor

        const planeCropMesh = new THREE.Mesh( planeCrop, this.floorGlowMat );
        planeCropMesh.rotateX((Math.PI / 180)*-90);
        planeCropMesh.position.set(0,-9.8,0);
        planeCropMesh.layers.set(3);

        this.root.add(planeCropMesh);

        return this.root;
    }
    //======================
   

    update() {

        const currenttime = new Date().getTime();
        const elapsed = currenttime - this.prevupdate;
        if(DEBUG_MODE)
            document.getElementById('fpsindicator').innerHTML = Math.floor( 1000 / elapsed);

        const uvflow = (currenttime*0.25) % 5000;

        this.uniforms.fTime.value = uvflow/5000.0;
        
        const modded = (currenttime*0.00005)%360;
        var glow = Math.sin(modded);
        if(glow <= 0.0) {
            glow = -(glow*0.5);
        }
        this.uniforms.faderTime.value = glow;

        this.prevupdate = currenttime;
        this.deviceTime+=elapsed;
                
        if(this.modifier && glow>=0.3) {
            this.deviceTime =0;
             this.modifier && this.modifier.apply();
        }
    }

    //======================

}

export { F1Ribbons };

