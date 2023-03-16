import * as THREE from '../node_modules/three/build/three.module.js';
import {DEBUG_MODE} from './adminuser'

class F1Layers {

    constructor(isHelmet, renderSize,f1fnames,liveryData) {
        this.init(isHelmet, renderSize,f1fnames,liveryData);

    }

    init(isHelmet, renderSize, f1fnames) {
        if(DEBUG_MODE)
          console.log(">> init F1 LayerShader");
        var customMapSize = renderSize;

        var _self = this;

        this.baseLayer = new THREE.TextureLoader().load('./assets/textures/smallredimage.png', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })
        this.tagLayer = new THREE.TextureLoader().load('./assets/textures/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })
        this.decalLayer = new THREE.TextureLoader().load('./assets/textures/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })

        // this.planeGeometry = new THREE.PlaneGeometry(renderSize, renderSize);
        this.customMapPlaneGeometry = new THREE.PlaneGeometry(customMapSize, customMapSize);

        this.customMapBufferMapScene = new THREE.Scene();
        
        this.customMapBufferMapCamera = new THREE.OrthographicCamera( 
                        -customMapSize*0.5,customMapSize*0.5,
                         -customMapSize*0.5, customMapSize*0.5, 1, 10 );

        this.customMapBufferMapCamera.position.set(0,0,1);
        this.customMapBufferMapScene.add(this.customMapBufferMapCamera);
        this.customMapBufferMapSceneTarget = new THREE.WebGLRenderTarget( customMapSize, customMapSize, { 
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
          texture1TintChannel1: { value: new THREE.Vector4(.19,0,0.314,1) }, // base colours TODO get from default
          texture1TintChannel2: { value: new THREE.Vector4(0,1,0,1) },
          texture1TintChannel3: { value: new THREE.Vector4(0,0,1,1) },
          tagTint:{value: new THREE.Vector4(1,1,1,1)},
          tagStyleTint:{value: new THREE.Vector4(1,1,1,1)},
          decalTint:{value: new THREE.Vector4(1,1,1,1)},
          decal2Tint:{value: new THREE.Vector4(1,1,1,1)},
          useTag: { value: 0},
          useDecal: { value: 0},


        };

        _self.customMapBufferMapMaterial = new THREE.ShaderMaterial({
            name: 'layersbufferMapMaterial',
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
    
              uniform vec4 texture1TintChannel1;
              uniform vec4 texture1TintChannel2;
              uniform vec4 texture1TintChannel3;

              uniform vec4 tagTint;
              uniform vec4 tagStyleTint;
              uniform vec4 decalTint;
              uniform vec4 decal2Tint;

              uniform int mixMode;
              uniform int renderMode;
              uniform float fxamount;
          
              uniform int useTag;
              uniform int useDecal;


              varying vec2 vUv;
          
              void main() {
                vec4 tint1 = texture1TintChannel1;//vec4(1,0,0,1);
                vec4 tint2 = texture1TintChannel2;//vec4(0,1,0,1);
                vec4 tint3 = texture1TintChannel3;//vec4(0,0,1,1);
    
                vec4 color1 = texture2D(texture1Base, vUv);
                vec4 color2 = texture2D(texture2Tag, vUv);
                vec4 color3 = texture2D(texture3Decal, vUv);


                vec3 c1 = mix(color1,tint1 * color1.r, color1.a).xyz;
                vec3 c2 = mix(color1,tint2 * color1.g, color1.a).xyz;
                vec3 c3 = mix(color1,tint3 * color1.b, color1.a).xyz;

                vec4 outcol = vec4(mix(c1,c2,color1.g),1.0);
                outcol = vec4(mix(outcol.xyz,c3,color1.b),1.0);

                // now overlay texture2 tags
                if(useTag==1) {
                  c1 = mix(outcol,tagStyleTint * color2.r, color2.a).xyz;
                  c2 = mix(outcol,tagTint * color2.g, color2.a).xyz;
                  outcol = vec4(mix(c1,c2,color2.g),1.0);
                  // outcol = vec4(mix(outcol.xyz,color2.xyz, color2.a),1.0);
                }
                if(useDecal==1) {
                  c1 = mix(outcol,decalTint * color3.r, color3.a).xyz;
                  c2 = mix(outcol,decal2Tint * color3.g, color3.a).xyz;

                  outcol = vec4(mix(c1,c2,color3.g),1.0);
                }
                gl_FragColor = outcol;
              }
            `,
            side: THREE.DoubleSide,
            // encoding: THREE.sRGBEncoding, // specify sRGB encoding
          });
    
        const bufferCustomMapMesh = new THREE.Mesh( _self.customMapPlaneGeometry, _self.customMapBufferMapMaterial );
    
        _self.customMapBufferMapScene.add(bufferCustomMapMesh);
        _self.customMapBufferMapMaterial.needsUpdate = true;
    
    }




    //======================

}

export { F1Layers };


