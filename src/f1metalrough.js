import * as THREE from '../node_modules/three/build/three.module.js';
import {DEBUG_MODE} from './adminuser'

class F1MetalRough {

    // metal = blue
    // rough = green
   
    constructor(isHelmet, renderSize,f1fnames,liveryData) {
        this.init(isHelmet, renderSize,f1fnames,liveryData);

    }

    init(isHelmet, renderSize, f1fnames) {
        if(DEBUG_MODE)
          console.log(">> init F1 Metal Rough");
        var metaloffscreenSize = renderSize;

        var _self = this;

        this.baseLayer = new THREE.TextureLoader().load('./assets/textures/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })
        this.tagLayer = new THREE.TextureLoader().load('./assets/textures/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })
        this.decalLayer = new THREE.TextureLoader().load('./assets/textures/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })

        this.metalPlaneGeometry = new THREE.PlaneGeometry(metaloffscreenSize, metaloffscreenSize);


        this.metalBufferMapScene = new THREE.Scene();
        this.metalBufferMapCamera = new THREE.OrthographicCamera( 
                        -metaloffscreenSize*0.5,metaloffscreenSize*0.5,
                         -metaloffscreenSize*0.5, metaloffscreenSize*0.5, 1, 10 );

        this.metalBufferMapCamera.position.set(0,0,1);
        this.metalBufferMapScene.add(this.metalBufferMapCamera);
        this.metalBufferMapSceneTarget = new THREE.WebGLRenderTarget( metaloffscreenSize, metaloffscreenSize, { 
                alpha: true, 
                minFilter: THREE.LinearFilter, 
                magFilter: THREE.NearestFilter,
                antialias: true, 
                premultipliedAlpha: true,//false,
    
                blending: THREE.AdditiveBlending,
                
                // ... testing
                format: THREE.RGBAFormat,
                stencilBufer: false,
        });

        this.mapUniforms = {
          renderMode: { value: 1 },
          texture1Base: { value: this.baseLayer },  // base pattern
          texture2Tag: { value: this.tagLayer },  // tag
          texture3Decal: { value: this.decalLayer },  // decal

          baseChannel1Metal: { value: 0.0 },
          baseChannel1Rough: { value: 0.0 },
          baseChannel2Metal: { value: 0.0 },
          baseChannel2Rough: { value: 0.0 },
          baseChannel3Metal: { value: 0.0 },
          baseChannel3Rough: { value: 0.0 },
          
          tagChannel1Metal: { value: 0.0 },
          tagChannel1Rough: { value: 0.0 },
          tagChannel2Metal: { value: 0.0 },
          tagChannel2Rough: { value: 0.0 },
          
          decalChannel1Metal: { value: 0.0 },
          decalChannel1Rough: { value: 0.0 },

          useTag: { value: 0},
          useDecal: { value: 0},

        };

        _self.metalBufferMapMaterial = new THREE.ShaderMaterial({
            name: 'metalroughbufferMapMaterial',

            uniforms: _self.mapUniforms,
            vertexShader: `
              varying vec2 vUv;
              uniform int renderMode;
              uniform float fxAmount;

              void main() {
                vUv = uv;
                vec3 pos = position;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `,
            fragmentShader: `
              uniform sampler2D texture1Base;
              uniform sampler2D texture2Tag;
              uniform sampler2D texture3Decal;
    
              uniform float baseChannel1Metal;
              uniform float baseChannel1Rough;
              uniform float baseChannel2Metal;
              uniform float baseChannel2Rough;
              uniform float baseChannel3Metal;
              uniform float baseChannel3Rough;
              
              uniform float tagChannel1Metal;
              uniform float tagChannel1Rough;
              uniform float tagChannel2Metal;
              uniform float tagChannel2Rough;
              
              uniform float decalChannel1Metal;
              uniform float decalChannel1Rough;

              uniform int mixMode;
              uniform int renderMode;
              uniform float fxamount;
          
              uniform int useTag;
              uniform int useDecal;


              varying vec2 vUv;
          
              void main() {

                vec4 color1 = texture2D(texture1Base, vUv);

                float metalness1 = color1.r * baseChannel1Metal *  color1.a * 0.8;
                float roughness1 = color1.r * baseChannel1Rough *  color1.a;

                float metalness2 = color1.g * baseChannel2Metal *  color1.a * 0.8;
                float roughness2 = color1.g * baseChannel2Rough *  color1.a;

                float metalness3 = color1.b * baseChannel3Metal *  color1.a * 0.8;
                float roughness3 = color1.b * baseChannel3Rough *  color1.a;

                vec4 outcol = vec4(0,roughness1,metalness1 ,1);
                outcol = vec4(mix(outcol.xyz, vec3(0,roughness2,metalness2), color1.g ),1);
                outcol = vec4(mix(outcol.xyz, vec3(0,roughness3,metalness3), color1.b ),1);

                if(useTag!=0) {
                    vec4 color2 = texture2D(texture2Tag, vUv);
                    float metalnesstagstyle = color2.r * tagChannel1Metal *  color2.a;
                    float roughnesstagstyle = color2.r * tagChannel1Rough *  color2.a;

                    float metalnesstag = color2.g * tagChannel2Metal *  color2.a;
                    float roughnesstag = color2.g * tagChannel2Rough *  color2.a;

                    vec4 outcoltag = vec4(0,roughnesstagstyle,metalnesstagstyle ,1);
                    // outcoltag = vec4(mix(outcoltag.xyz, vec3(0,roughnesstag,metalnesstag), color2.g ),1);

                    if(color2.g>0.0) {
                      if(color2.g<0.2) 
                        outcoltag = vec4(mix(outcoltag.xyz, vec3(0,roughnesstag,metalnesstag), color2.g ),1);
                      else
                        outcoltag = vec4(0,roughnesstag,metalnesstag,1);
                    }
                    
                    outcol = mix(outcol,outcoltag,color2.a);
                }
                if(useDecal!=0) {
                    vec4 color3 = texture2D(texture3Decal, vUv);
                    float metalnessdecal = color3.r * decalChannel1Metal *  color3.a;
                    float roughnessdecal = color3.r * decalChannel1Rough *  color3.a;

                    float metalnessdecal2 = color3.g * decalChannel1Metal *  color3.a;
                    float roughnessdecal2 = color3.g * decalChannel1Rough *  color3.a;

                    vec4 outcoldecal = vec4(0,roughnessdecal,metalnessdecal ,1);
                    // outcoldecal = vec4(mix(outcoldecal.xyz, vec3(0,roughnessdecal2,metalnessdecal2), color3.g ),1);

                    if(color3.g>0.0) {
                      if(color3.g<0.2) 
                        outcoldecal = vec4(mix(outcoldecal.xyz, vec3(0,roughnessdecal2,metalnessdecal2), color3.g ),1);
                      else
                        outcoldecal = vec4(0,roughnessdecal2,metalnessdecal2,1);
                    }


                    outcol = mix(outcol,outcoldecal,color3.a);
                }

                
                gl_FragColor = outcol;


          



                

              }
            `,
            side: THREE.DoubleSide,



          });
    
        const metalBufferMapMesh = new THREE.Mesh( _self.metalPlaneGeometry, _self.metalBufferMapMaterial );
    
        _self.metalBufferMapScene.add(metalBufferMapMesh);
        _self.metalBufferMapMaterial.needsUpdate = true;
    
    }




    //======================

}

export { F1MetalRough };


