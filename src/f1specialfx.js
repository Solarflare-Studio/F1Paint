import * as THREE from '../node_modules/three/build/three.module.js';
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/F1EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from '../node_modules/three/examples/jsm/shaders/FXAAShader.js';

import {DEBUG_MODE} from './adminuser'


class F1SpecialFX {

   
    constructor(isHelmet, renderSize,f1fnames,liveryData,glowRenderSize) {

      this.f1BloomRibbonPass = 0;
      this.f1BloomLayersPass = 0;

      this.finalComposer = 0;
      this.fxComposer = 0;
      this.fxRibbonComposer = 0;
      this.finalPass = 0;
      this.fxaaPass = 0;

      this.effectStarttime = 0;
      this.duration = 0;

      this.init(isHelmet, renderSize,f1fnames,liveryData,glowRenderSize);

    }
    //======================
    initCarForIntro(f1CarHelmet,_isHelmet) {
      this.f1BloomLayersPass.strength = 2.5;
      this.f1BloomLayersPass.radius = 0.8;
      this.finalPass.uniforms.bloomAmount.value = 1.0;

      f1CarHelmet.customMesh.material = f1CarHelmet.wireFrameMat;
      f1CarHelmet.staticMesh.material = f1CarHelmet.wireFrameMat;
      if(_isHelmet)
        f1CarHelmet.visorMesh.material = f1CarHelmet.wireFrameMat;
    }
    resetCarFromIntro(f1CarHelmet,_isHelmet) {
      this.f1BloomLayersPass.strength = 3.0;
      this.f1BloomLayersPass.radius = 0.75;
      this.finalPass.uniforms.bloomAmount.value = 0.4; // start point for layers bloom

      f1CarHelmet.customMesh.material = f1CarHelmet.theCustomMaterial;

      if(f1CarHelmet.customMesh) { // revert the materials
        f1CarHelmet.staticMesh.material = f1CarHelmet.theStaticMaterial;
        f1CarHelmet.customMesh.material = f1CarHelmet.theCustomMaterial;
        if(_isHelmet)
          f1CarHelmet.visorMesh.material = f1CarHelmet.theVisorMaterial;
      }
    

    }
    //======================
    startFX(duration) {
      this.effectStarttime = new Date().getTime();
      this.duration = duration;

      this.finalPass.uniforms.amountBloom.value = 1.0;
    }
    //======================

    timePassing() {

      if(this.mapUniforms.leadin.value == 1.0) { // waiting to load fade in
        const elapsedtime = (new Date().getTime() - this.effectStarttime);
        // const amnt = elapsedtime / 330.0;
        const amnt = elapsedtime / this.duration;
        // console.log("elapsed time = " + elapsedtime + ", amnt = " +amnt);
        
        if(amnt >= 1.0) {
          this.finalPass.uniforms.amountBloom.value = 0.05;
          // this.mapUniforms.leadin.value = 0.0;
        }
        else
          this.finalPass.uniforms.amountBloom.value = 1.0 - amnt;

        // this.effectStarttime = new Date();
        // this.finalPass.uniforms.amountBloom.value = 1.0;
      }
      else if(this.mapUniforms.leadin.value == 2.0) { // colour change fade in out
        const elapsedtime = (new Date().getTime() - this.effectStarttime);
        const amnt = elapsedtime / this.duration;
        if(amnt >= 1.0) {
          this.finalPass.uniforms.amountBloom.value = 0.0;
        }
        else
          this.finalPass.uniforms.amountBloom.value = 1.0 - amnt;

      }
      else {  // pattern loaded fade in
        const elapsedtime = (new Date().getTime() - this.effectStarttime);
        const amnt = elapsedtime /this.duration;
        if(amnt >= 1.0) {
          this.finalPass.uniforms.amountBloom.value = 0.0;
        }
        else
          this.finalPass.uniforms.amountBloom.value = 1.0 - amnt;
      }
    }
    //======================

    init(isHelmet, renderSize, f1fnames,glowRenderSize) {
        if(DEBUG_MODE)
          console.log(">> init F1 Special FX Render pipeline");

        this.sfxBloomRenderSize = glowRenderSize;
        // this.offscreenSize = 512;// renderSize;
        // this.offscreenSize = 1024;// renderSize;
        // this.offscreenSize = renderSize;

        this.plainMat = new THREE.MeshBasicMaterial({ // todo, replace with shader to offset mesh for specialfx
          name: 'plainMaterial',

          // side: THREE.DoubleSide,
          transparent: true,
          // blending: THREE.CustomBlending,
          // blendEquation: THREE.AddEquation,
          // blendSrc: THREE.SrcAlphaFactor,
          // blendDst: THREE.OneMinusSrcAlphaFactor,
        })


        this.blackMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          side: THREE.DoubleSide, // render both front and back faces
          // depthWrite: false, // disable writing to depth buffer
          // depthTest: false, // disable depth testing
          name: 'blackMaterial',
        });



/*
        this.blackMat = new  THREE.MeshBasicMaterial({
          name: 'blackMaterial',

          // side: THREE.DoubleSide,
          color: new THREE.Color(0,0,0),
          transparent: true,
          blending: THREE.CustomBlending,
          blendEquation: THREE.AddEquation,
          blendSrc: THREE.SrcAlphaFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
        })
*/

        var _self = this;

        this.baseLayer = new THREE.TextureLoader().load('./assets/textures/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })

        this.glowPlaneGeometry = new THREE.PlaneGeometry(this.sfxBloomRenderSize, this.sfxBloomRenderSize);
        // this.staticPlaneGeometry = new THREE.PlaneGeometry(renderSize, renderSize);


        this.glowBufferMapScene = new THREE.Scene();
        this.glowBufferMapCamera = new THREE.OrthographicCamera( 
                        -this.sfxBloomRenderSize*0.5,this.sfxBloomRenderSize*0.5,
                         -this.sfxBloomRenderSize*0.5, this.sfxBloomRenderSize*0.5, 1, 10 );

        this.glowBufferMapCamera.position.set(0,0,1);
        this.glowBufferMapScene.add(this.glowBufferMapCamera);
        this.glowBufferMapSceneTarget = new THREE.WebGLRenderTarget( this.sfxBloomRenderSize, this.sfxBloomRenderSize, { 
                alpha: true, 
                minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter,
                antialias: true, 
                premultipliedAlpha: true,//false,
                blending: THREE.AdditiveBlending,
                format: THREE.RGBAFormat,
        });

        this.mapUniforms = {
          texture1Base: { value: this.baseLayer },  // base pattern
          fTime: { value: 0.0},
          layer: { value: 0.0 },
          leadin: {value: 0.0 },
          chan1Colour: { value: new THREE.Vector3(0,0,0)},
          chan2Colour: { value: new THREE.Vector3(0,0,0)},
          chan3Colour: { value: new THREE.Vector3(0,0,0)},
          useTag: { value: 0.0 },
          useDecal: { value: 0.0 }
        };

        _self.glowBufferMapMaterial = new THREE.ShaderMaterial({
            name: 'specialFXbufferMapMaterial',

            uniforms: _self.mapUniforms,
            vertexShader: `
              varying vec2 vUv;

              void main() {
                vUv = uv;
                // vUv.y = 1.0 - vUv.y;
                vec3 pos = position;


                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D texture1Base;

              varying vec2 vUv;
              uniform float fTime;
              uniform float layer;
              uniform float leadin;
              uniform float useTag;
              uniform float useDecal;

              uniform vec3 chan1Colour;
              uniform vec3 chan2Colour;
              uniform vec3 chan3Colour;
//==================================================================          
              void main() {
                vec4 colour = texture2D(texture1Base, vUv);
                float calc = 1.0 - fTime;
                float amnt = sin(calc * (3.1415926538 * 0.5));

                if(leadin==2.0) {
                  amnt = sin(calc * (3.1415926538) * 1.0);
                  vec3 rc = (colour.r) * chan1Colour;
                  vec3 gc = (colour.g) * chan2Colour;
                  vec3 bc = (colour.b) * chan3Colour;
                  vec3 c= mix(rc,gc,colour.g);
                  c= mix(c,bc,colour.b);
                  
                  vec3 cv = max(bc,gc);
                  c = mix(c,cv,amnt);
                  c = max(c,colour.r * vec3(1,0,0));



                  if(fTime>0.8) {
                    // c = mix(c,rc, ((fTime-0.8)/0.2) );
                    // c = mix(rc,vec3(1,1,1),0.5);
                  }
                
                  float alpha = amnt;
                  gl_FragColor = vec4(c,alpha*0.85);


                }
                else
                
                if(layer==1.0) {
                  if(leadin==1.0) {
                    amnt = sin(calc * (3.1415926538 * 0.5));
                    float cosit = 1.0*(sin(calc * (3.1415926538 * 0.5)));
                    // cosit = 1.0;
                    float alpha=1.0;
                    
                    if(amnt<0.3) {
                      alpha = mix(0.0,1.0, (amnt/0.3));
                    }


                    vec3 c= mix(vec3(0,0,0),vec3(1,0,0),cosit);
                    gl_FragColor = vec4(c,alpha*0.5*amnt);


                  }
                  else {
                    amnt = sin(calc * (3.1415926538 * 0.5));

                    vec3 rc = (colour.r) * chan1Colour;
                    vec3 gc = (colour.g) * chan2Colour;
                    vec3 bc = (colour.b) * chan3Colour;

                    vec3 c;
                    if(amnt<0.3) {
                      c=mix(vec3(1,0,0),rc, amnt/0.3);
                    }
                    else if(amnt<0.5) {
                      c=mix(rc,bc, (amnt-0.3)/0.2);
                    }
                    else if(amnt<0.7) {
                      vec3 cv = max(bc,gc);
                      c=mix(bc,cv, (amnt-0.5)/0.2);
                    }
                    else
                      c=gc;
                    
                    if(amnt>=0.8) {
                      gl_FragColor = vec4(c,(1.0-((amnt-0.8)/0.2))*0.85);
                    }
                    else
                      gl_FragColor = vec4(c,0.85);

                  }
                }
                else if(layer==3.0) {
                  if(leadin>=0.5) {
                    colour.g = 0.0;
                    vec3 rc = (amnt * colour.r) * chan1Colour;
                    vec3 gc = (amnt * colour.g) * chan2Colour;
                    vec3 c = mix(rc,gc,colour.g);
                    gl_FragColor = vec4(c,amnt);
                  }
                  else {
                    vec3 rc = (1.0 * colour.r) * chan1Colour;
                    vec3 gc = (1.0 * colour.g) * chan2Colour;

                    vec3 c1 = mix(rc,gc,colour.g);
                    
                    // calc = calc * 4.0;
                    if(calc>=1.0) {
                      calc=1.0;
                    }

                    vec3 c2 = gc;
                    if(useTag>0.5)
                      c1 = mix(c1,c2,calc);
                    else
                      c1 = mix(c1,vec3(0,0,0),calc);

                      // gl_FragColor = vec4(rc,1.-amnt);
                      gl_FragColor = vec4(c1,1.0-amnt);
                    }                  
                }
                else if(layer==4.0) {
                  if(leadin>=0.5) {
                    colour.g = 0.0;
                    vec3 rc = (amnt * colour.r) * chan1Colour;
                    vec3 gc = (amnt * colour.g) * chan2Colour;
                    vec3 c = mix(rc,gc,colour.g);
                    gl_FragColor = vec4(c,amnt);
                  }
                  else {
                    vec3 rc = (1.0 * colour.r) * chan1Colour;
                    vec3 gc = (1.0 * colour.g) * chan2Colour;

                    vec3 c1 = mix(rc,gc,colour.g);
                    
                    // calc = calc * 4.0;
                    if(calc>=1.0) {
                      calc=1.0;
                    }

                    vec3 c2 = gc;
                    if(useDecal>0.5)
                      c1 = mix(c1,c2,calc);
                    else
                      c1 = mix(c1,vec3(0,0,0),calc);


                    gl_FragColor = vec4(c1,1.0-amnt);
                  }      
                }


              }
            `,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,

            // encoding: THREE.sRGBEncoding, // specify sRGB encoding

          });
    
        const glowBufferMapMesh = new THREE.Mesh( _self.glowPlaneGeometry, _self.glowBufferMapMaterial );
            _self.glowBufferMapScene.add(glowBufferMapMesh);
        _self.glowBufferMapMaterial.needsUpdate = true;
    
    }

    //======================
    setupBloom(scene, camera,renderer,renderSize,f1Garage) {

      const ribbonbloomRenderSize = 512;

      // setup static scene
      // const staticscene = new THREE.Scene();
      // staticscene.add( new THREE.Mesh( this.staticPlaneGeometry, f1Garage.backgroundMat ) );
      // const renderSceneBackground = new RenderPass( staticscene, camera );

    


      // render pass of the normal scene but has model materials swapped at render
      const renderScene = new RenderPass( scene, camera );
      // bloom for glow layer
      this.f1BloomLayersPass = new UnrealBloomPass(new THREE.Vector2( this.sfxBloomRenderSize, this.sfxBloomRenderSize ), 3.0, 0.75, 0.00015);

      // composer for glow bloom layer
      this.fxComposer = new EffectComposer(renderer);
      this.fxComposer.renderToScreen = false;
      this.fxComposer.addPass( renderScene );
      this.fxComposer.addPass( this.f1BloomLayersPass );
      //
      const renderRibbonScene = new RenderPass( scene, camera );
      // this.f1BloomRibbonPass = new UnrealBloomPass(new THREE.Vector2( ribbonbloomRenderSize, ribbonbloomRenderSize ), 8.5, 1.0, 0.000015);
      // new also for garage floor
      // this.f1BloomRibbonPass = new UnrealBloomPass(new THREE.Vector2( ribbonbloomRenderSize, ribbonbloomRenderSize ), 8.5, 0.15, 0.05);
      // this.f1BloomRibbonPass = new UnrealBloomPass(new THREE.Vector2( ribbonbloomRenderSize, ribbonbloomRenderSize ), 8.5, 1.0, 0.0005);
      // this.f1BloomRibbonPass = new UnrealBloomPass(new THREE.Vector2( ribbonbloomRenderSize, ribbonbloomRenderSize ), 7.5, 0.9, 0.0005);
      this.f1BloomRibbonPass = new UnrealBloomPass(new THREE.Vector2( ribbonbloomRenderSize, ribbonbloomRenderSize ), 6.5, 0.5, 0.00005);

      //
      this.fxRibbonComposer = new EffectComposer(renderer);
      this.fxRibbonComposer.renderToScreen = false;
      this.fxRibbonComposer.addPass( renderRibbonScene );
      this.fxRibbonComposer.addPass( this.f1BloomRibbonPass ); // render bloom

      // anti-aliasing test
      this.fxaaPass = new ShaderPass( FXAAShader );
      const pixelRatio = renderer.getPixelRatio();

      this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( renderSize * pixelRatio );
      this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( renderSize * pixelRatio );
    
      this.finalPass = new ShaderPass(
        new THREE.ShaderMaterial( {
          name: 'finalpassshadermat',

          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: this.fxComposer.renderTarget2.texture },
            bloomRibbonTexture: { value: this.fxRibbonComposer.renderTarget2.texture },
            amountBloom: { value: 0.0 },
            bloomAmount: { value: 0.4 }, // constant
          },
          vertexShader: `
          varying vec2 vUv;

          void main() {
    
            vUv = uv;
            vec3 pos = position;


            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    
          }
          `,
          fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          uniform sampler2D bloomRibbonTexture;
          
          uniform float amountBloom;
          uniform float bloomAmount;
          varying vec2 vUv;

          void main() {
    
            vec4 colbase = texture2D( baseTexture, vUv );
            vec4 colBloom = texture2D( bloomTexture, vUv );
            vec4 colRibbon = texture2D( bloomRibbonTexture, vUv );

            
            float a = max(max(colBloom.x,colBloom.y),colBloom.z) * bloomAmount;
            vec4 outcol = mix(colbase,colBloom,a);
            outcol = max(outcol,colRibbon);

            float newalf = max( max(colBloom.a , colbase.a), colRibbon.a);

            gl_FragColor = vec4(outcol.xyz,newalf );
            // gl_FragColor = vec4(outcol.xyz,colBloom.a * colbase.a * colRibbon.a );
 
          }
    
          `,
          transparent: true,
    
          defines: {}
        } ), 'baseTexture'
      );
      // this.finalPass.needsSwap = true; // todo confirm dont require
    
      this.finalComposer = new EffectComposer( renderer );

      this.finalComposer.addPass( renderScene );

      this.finalComposer.addPass( this.finalPass );
      this.finalComposer.addPass( this.fxaaPass );
    
      this.finalComposer.setSize(renderSize,renderSize);
      this.fxComposer.setSize(this.sfxBloomRenderSize,this.sfxBloomRenderSize);
      this.fxRibbonComposer.setSize(ribbonbloomRenderSize,ribbonbloomRenderSize);
      
    
    }
    //======================
    resize(_w,_h) { // when resizing canvas

    }
    //======================


}

export { F1SpecialFX };


