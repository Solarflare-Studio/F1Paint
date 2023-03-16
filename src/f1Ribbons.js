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

        this.ribbonStartTime = 0.;
        this.doingRibbon = false;

        // this.timer1 = this.prevupdate;
        

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
        // this.ribbonGeometry = new THREE.PlaneGeometry(200, 15, 64,2);
        this.ribbonGeometry = new THREE.PlaneGeometry(1500, 80, 64,2);
        // this.ribbonGeometry = new THREE.CylinderGeometry(50, 50, 1500, 6, 64, true);

        this.ribbonGeometry2 = new THREE.PlaneGeometry(1100, 35, 64,2);
        this.carChangeTween = 0;
        this.carChangeDelta = 0.0;
        this.countbetweenribbons = 0;
        this.randomgap = 0;

        this.setupRibbonMaterials(f1Materials);


    

        // this.ribbonGeometry = new THREE.BoxGeometry(200, 15, 2, 64,2,2);
/*
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
        */

        // document.getElementById('c_bendFSlider').oninput = function () {
        //     const amount = this.value/100.0;
        //     const bendid = document.getElementById('c_bend').value - 1;

        //     document.getElementById('c_bendFSliderTxt').innerHTML = 'force: ' + amount;
        //     _self.modifierChange.stack[bendid].force = amount;
        // }
        // document.getElementById('c_bendPSlider').oninput = function () {
        //     const amount = this.value/100.0;
        //     const bendid = document.getElementById('c_bend').value - 1;
        //     document.getElementById('c_bendPSliderTxt').innerHTML = 'offset: ' + amount;
        //     _self.modifierChange.stack[bendid].offset = amount;
        // }
        // document.getElementById('c_bendASlider').oninput = function () {
        //     const amount = this.value * (Math.PI/180.0);
        //     const bendid = document.getElementById('c_bend').value - 1;
        //     document.getElementById('c_bendASliderTxt').innerHTML = 'angle: ' + amount;
        //     _self.modifierChange.stack[bendid].angle = amount;
        // }

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
                viewerDistance = length(mvPosition.xyz);    // for removing the ribbon if in front of your nose
            }
            `,
            fragmentShader: `
            uniform sampler2D texture1;

            varying vec2 vUv;
            uniform float fTime;
            uniform float faderTime;
            varying float viewerDistance;

            vec2 rot(vec2 uv,float a){
                return vec2(uv.x*cos(a)-uv.y*sin(a),uv.y*cos(a)+uv.x*sin(a));
            }
            
            // generic rand return
            float rand(float n){
                 return fract(cos(n*89.42)*343.42);
            }
            

            void main() {
                float count = 6.0;
                // vec2 uv = vUv.yx;
                vec2 uv = 2.*( (vUv.yx) )-1.0 ;

                uv = rot(uv,3.1415927*1.0);
            
                float spread = 0.5;//1.5;
                float thickness = .0104;
                float wobble_freq = .025;
                float wobble_ampl = .315;
                float t = fTime*.177;

                float waveup = t * 4.0;
                

                float tints[24] = float[24](1.,1.,1., 0.91,.04,.03,  0.59,.29,.91,    0.,1.,1.,
                    1.,1.,1.,  0.91,.04,.03,  0.59,.29,.91,    0.,1.,1.);

                float thicknesses[8] = float[8]( .3, 1.2, .8, .4, .3, .6, .8, .4);

                float wobble_frequences[8] = float[8]( .025,.025,.025,.025, .025,.025,.025,.025);


                
                vec3 col = vec3(0.0);
                float s = 0.;
                vec3 outcol = vec3(0.0);

                float waveyMod = (sin(waveup)*0.5+0.5);
                // spread+=(sin(waveup)*0.5)*.5;
                wobble_freq+=(waveyMod)*0.05;
                // wobble_ampl+=(waveyMod*i)*0.3;

                // spread=0.;

                // vec3 debug = vec3(0,0,1);
              
                for(float i=0.;i<count;i++){    

                    // float wwwwobble_freq = wobble_freq +(waveyMod*i)*0.05;
                    // float wwwwobble_ampl = wobble_ampl +(waveyMod*i)*0.003;

                    // individual wobble here
                    // float sinwave_01 = sin( ((t+(i*10.))-i*116.41);
                    // if(sinwave_01 > debug.x)
                    //     debug.x = sinwave_01;



                    uv.x += sin( ((t+(i*10.))-i*116.41) * uv.y * (wobble_freq*(i*0.15))*.125  + (t-i*122.) + i*111.61 ) * (wobble_ampl+(i*.105));
//pre-merge                    uv.x += sin( ((t+(i*10.))-i*116.41) * uv.y * wobble_freq*.125  + (t-i*122.) + i*111.61 ) * (wobble_ampl+(i*.105));

                    // uv.x += sinwave_01 * uv.y * wobble_freq*.125  + (t-i*122.) + i*111.61 ) * (wobble_ampl+(i*.105));
                    // uv.x += sin( ((t+(i*10.))-i*116.41) * uv.y * wwwwobble_freq*.125  + (t-i*122.) + i*111.61 ) * (wwwwobble_ampl+(i*.105));

                    // make them all move slightly

                    float coswave_01 = cos((t*0.1) + i*uv.y * wobble_freq*.81);

//pre-merge                    float coswave_01 = cos((t*0.1) + i*uv.y * wobble_freq*.81);
                    uv.x += coswave_01*.02;
//good                    uv.x += cos((t*0.1) + i*uv.y * wobble_freq*.81)*.02;
                    // uv.x += cos((t*0.1) + i*uv.y * wwwwobble_freq*.81)*.02;
                    
                    // offset each line
                    uv.x +=	i*spread*.03 - spread*count*.011;
                    float amnt = 0.;
                    float scalethick = 2.0;
                    amnt = abs( .01 / uv.x* (thicknesses[int(i)]*scalethick));

                    amnt*=0.5;  // reduce intensity
                    
                    int cindex = int(i * 3.);
                    vec3 cc = vec3(tints[cindex+0],tints[cindex+1],tints[cindex+2]);
                    outcol = mix(outcol, cc, amnt);
                }
               
                // lowkey dithering :)
                //	s -= rand(uv.x)*.06;
  
                // emboss
                outcol.x = smoothstep(.2,.7,outcol.x);//-.1;
                outcol.y = smoothstep(.2,.7,outcol.y);//-.1;
                outcol.z = smoothstep(.2,.7,outcol.z);//-.1;
           
                // float vig = uv.x*uv.y * 15.0; 
                // outcol+=vig*=.0002;

                float alf = max(max(outcol.r,outcol.g),outcol.b);
                alf *= 0.45 * faderTime;

                if(uv.y <= -0.9) {
                    float fadeit = -uv.y;
                    fadeit = 1.0 - ((fadeit - 0.9) / 0.1);
                    alf *= fadeit;
                }
                else if(uv.y >= 0.9) {
                    float fadeit = uv.y;
                    fadeit = 1.0- ((fadeit - 0.9) / 0.1);
                    alf *= fadeit;
                }

                if(viewerDistance < 200.0) {
                    float amnt = viewerDistance / 200.0;
                    outcol *= amnt;
                    alf *= amnt;
                }

// outcol = debug;

                gl_FragColor = vec4( outcol, alf );
            }









            /* old ribbons

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
                // outcolour = getEndFade(outcolour, 0.75); // todo debug

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
            */

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


        this.ribbonMaterialsimple = new THREE.MeshBasicMaterial({
            // color: new THREE.Color(0,0.85,0),
            color: new THREE.Color(0.9,0.05,0.05),
            wireframe: true,

        });

        this.ribbonMaterialsimpleold = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            name: 'ribbonMaterialwirefame',

            wireframe:true,
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
        var self = this;

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


        this.speedModDebug = 0.5;

        bends.push(new ABend(-1.0, 0.45, 0.0,   1.0, 0.65, 0.0,    30000*this.speedModDebug, TWEEN.Easing.Cubic.InOut,1)); // static
        bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    60000*this.speedModDebug, TWEEN.Easing.Linear.None,2));
        // bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    25000*this.speedModDebug, TWEEN.Easing.Linear.None,2));

        this.createBentMeshParams(bends);
        //        this.createTwist([1.3, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.0, 20000*this.speedModDebug, 0],this.modifier);// 1]);
        this.createTwist([0.8, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.2, 20000*this.speedModDebug, 0],this.modifier);// 1]);








/*

        bends.push(new ABend(2.0, 0.25, 0.0,   2.0, 0.75, 0.0,    30000*this.speedModDebug, TWEEN.Easing.Cubic.InOut,0)); // static
        bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    30000*this.speedModDebug, TWEEN.Easing.Linear.None,2));
        // bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    25000*this.speedModDebug, TWEEN.Easing.Linear.None,2));

        this.createBentMeshParams(bends);
//        this.createTwist([1.3, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.0, 20000*this.speedModDebug, 0],this.modifier);// 1]);
        this.createTwist([0.8, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.2, 20000*this.speedModDebug, 0],this.modifier);// 1]);


        */
/*

        bends.push(new ABend(2.0, 0.45, 0.0,   2.0, 0.55, 0.0,    30000*this.speedModDebug, TWEEN.Easing.Cubic.InOut,1)); // static
        bends.push(new ABend(-2.0, 0.5, 0.0,   -2.0, 0.5, 2.0 * Math.PI,    60000*this.speedModDebug, TWEEN.Easing.Linear.None,2));

        this.createBentMeshParams(bends);
        this.createTwist([0.8, new Vector3(1,0,0), TWEEN.Easing.Linear.None, 0.2, 90000*this.speedModDebug, 1],this.modifier);// 1]);
  */


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
        // this.ribbonMesh2 = this.ribbonMesh.clone();
        // this.ribbonMesh2.position.set(-20,-10,-500 );
        // this.ribbonMesh2.scale.set(1,3,1);
        // this.ribbonMesh2.rotateZ((Math.PI / 180)*10);

        // this.root.add(this.ribbonMesh2); // all good with this one

        const planeCrop = new THREE.CircleGeometry( 80, 32 ); // same as garage floor

        const planeCropMesh = new THREE.Mesh( planeCrop, this.floorGlowMat );
        planeCropMesh.rotateX((Math.PI / 180)*-90);
        planeCropMesh.position.set(0,-10.5,0);
        planeCropMesh.layers.set(3);

        this.root.add(planeCropMesh);

        const plinthSideCropMesh = new THREE.Mesh( new THREE.CylinderGeometry( 78, 78, 9.9, 32, 1, true ), new THREE.MeshBasicMaterial({
            color: 0x00000,
            side: THREE.DoubleSide, // render both front and back faces
            // depthWrite: false, // disable writing to depth buffer
            // depthTest: false, // disable depth testing
            name: 'blackMaterial',
        }) );
        plinthSideCropMesh.layers.set(3);
        plinthSideCropMesh.position.set(0,-15.5,0);

        this.root.add(plinthSideCropMesh);



        return this.root;
    }
    //======================
    triggerRibbon() {
        this.ribbonStartTime = new Date().getTime();
        this.doingRibbon = true;
        this.ribbonBrightMax = 0.8;
    }
    //======================

    update(elapsed,currenttime) {

        if(DEBUG_MODE)
            document.getElementById('fpsindicator').innerHTML = Math.floor( 1000 / elapsed);

        // const uvflow = (currenttime*0.25) % 5000;
        // this.uniforms.fTime.value = uvflow/5000.0;

        const ttime = currenttime - this.ribbonStartTime;

        this.uniforms.fTime.value = ((currenttime%100000)/1000)*0.5;

        // const modded = (ttime*0.00015)%360;
        const modded = (ttime*0.0001)%360;
        var glow = Math.sin(modded);

        // console.log("preglow = "+ glow);


        if(glow <= 0.0) { // woz 0.0
            glow = -(glow*0.5);
        }
        else {
            glow *= this.ribbonBrightMax;
        }

        // glow=1.0;

        if(!this.doingRibbon)
            glow = 0.;

        // console.log("glow = "+ glow);

        this.uniforms.faderTime.value = glow;

        if(this.modifier)   {   // && glow>=0.3) {
             this.modifier && this.modifier.apply();
        }
    }

    //======================

}

export { F1Ribbons };

