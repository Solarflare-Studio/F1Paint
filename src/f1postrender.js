import * as THREE from '../node_modules/three/build/three.module.js';

class F1PostRender {

    // metal = blue
    // rough = green
   
    constructor(isHelmet, renderSize,f1fnames,liveryData) {
        this.init(isHelmet, renderSize,f1fnames,liveryData);

    }

    init(isHelmet, renderSize, f1fnames) {
        console.log(">> init F1 Post Render");
        var offscreenSize = renderSize;

        var _self = this;

        this.baseLayer = new THREE.TextureLoader().load('./assets/textures/smallblackimage.jpg', (tex) => {
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

                // autoClear: true,

        });

        this.mapUniforms = {
          texture1Base: { value: this.baseLayer },  // base pattern
          // texture2FX: { value: this.baseLayer },  // special fx layer
        };

        _self.bufferMapMaterial = new THREE.ShaderMaterial({
            name: 'postrenderbufferMapMaterial',

            uniforms: _self.mapUniforms,
            vertexShader: `
              varying vec2 vUv;

              void main() {
                vUv = uv;
                vUv.y = 1.0 - vUv.y;
                vec3 pos = position;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `,
            fragmentShader: `
            uniform sampler2D texture1Base;
            // uniform sampler2D texture2FX;

              varying vec2 vUv;
          
              void main() {

                vec4 colour = texture2D(texture1Base, vUv);
                // vec4 colourFX = texture2D(texture2FX, vUv);
                vec4 outcol = colour;
//                 if(colourFX.a!=0.0) {
//                   outcol = mix(outcol,vec4(0,0,0,1),colourFX.g * colourFX.a);
// //                  outcol = mix(outcol,colourFX,colourFX.g * colourFX.a);
//                 }

                gl_FragColor = outcol;


          



                

              }
            `,
            side: THREE.DoubleSide,
            // transparent: true, // maybe?



          });
    
        const bufferMapMesh = new THREE.Mesh( _self.planeGeometry, _self.bufferMapMaterial );
    
        _self.bufferMapScene.add(bufferMapMesh);
        _self.bufferMapMaterial.needsUpdate = true;
    
    }




    //======================

}

export { F1PostRender };


