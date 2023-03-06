import * as THREE from '../node_modules/three/build/three.module.js';

class F1Layers {

    constructor(isHelmet, renderSize,f1fnames,liveryData) {
        this.init(isHelmet, renderSize,f1fnames,liveryData);

    }

    init(isHelmet, renderSize, f1fnames) {
        console.log(">> init F1 LayerShader");
        var offscreenSize = renderSize;

        var _self = this;

        this.baseLayer = new THREE.TextureLoader().load('./patterns/smallredimage.png', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })
        this.tagLayer = new THREE.TextureLoader().load('./patterns/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })
        this.decalLayer = new THREE.TextureLoader().load('./patterns/smallblackimage.jpg', (tex) => {
          tex.encoding = THREE.LinearEncoding;
        })

        this.planeGeometry = new THREE.PlaneGeometry(renderSize, renderSize);


        this.bufferMapScene = new THREE.Scene();
        this.bufferMapCamera = new THREE.OrthographicCamera( 
                        -offscreenSize*0.5,offscreenSize*0.5,
                         -offscreenSize*0.5, offscreenSize*0.5, 1, 10 );

        this.bufferMapCamera.position.set(0,0,1);
        this.bufferMapScene.add(this.bufferMapCamera);
        this.bufferMapSceneTarget = new THREE.WebGLRenderTarget( offscreenSize, offscreenSize, { 
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

        _self.bufferMapMaterial = new THREE.ShaderMaterial({
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
                  c1 = mix(outcol,decalTint * color3.g, color3.a).xyz;
                  c2 = mix(outcol,decal2Tint * color3.r, color3.a).xyz;

                  outcol = vec4(mix(c1,c2,color3.r),1.0);
                }




                gl_FragColor = outcol;
                return;



                if(mixMode==0) // straight through
                {
//                  gl_FragColor = color1;

                  if(renderMode==1)
                    gl_FragColor = color1;
                  else {
                    gl_FragColor = vec4(1,0,0,1);
                  }


                }
                else
                {
                  // for alpha
                  vec3 c1 = mix(color1,tint1 * color2.r, color2.a).xyz;
                  vec3 c2 = mix(color1,tint2 * color2.g, color2.a).xyz;
                  vec3 c3 = mix(color1,tint3 * color2.b, color2.a).xyz;

                  vec4 outcol = vec4(mix(c1,c2,color2.g),1.0);
                  outcol = vec4(mix(outcol.xyz,c3,color2.b),1.0);



                  if(renderMode==1)
                    gl_FragColor = outcol;
                  else {
                    float tone = (color2.r + color2.g + color2.b) / 3.0;
                    gl_FragColor = vec4(tone,tone,tone,color2.a * tone);
                    gl_FragColor = vec4(tone,tone,tone,0.5);
                  }
                }

              }
            `,
            side: THREE.DoubleSide,



          });
    
        const bufferMapMesh = new THREE.Mesh( _self.planeGeometry, _self.bufferMapMaterial );
    
        _self.bufferMapScene.add(bufferMapMesh);
        _self.bufferMapMaterial.needsUpdate = true;
    
    }




    //======================

}

export { F1Layers };


