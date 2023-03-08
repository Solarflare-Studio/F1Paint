import * as THREE from '../node_modules/three/build/three.module.js';
import {DEBUG_MODE} from './adminuser'

import { updateProgress } from './f1gui.js';


class F1Materials {

    constructor(f1Settings) {
        this.toloadlist = new Array();

        this.envstrCustom = f1Settings.envcarintensity;// 7.0;// lees car setting
        this.envstrStatic = f1Settings.envcarbaseintensity;// 3.5 * 100;
        this.envstrGar = f1Settings.envgarageintensity;// 1.5;
        
        this.totalTexturesLoaded = 0;
        this.totalTexturesAttempted = 0;
        this.alltexturesloaded = false;
        this.filetimeout = 0;
        this.keepRibbon = 0;
        this.init();
    }
    init() {

        // this.ribbonMaterialold = new THREE.MeshBasicMaterial( {
        //     specular: 0xffffff, shininess: 250,
        //     side: THREE.DoubleSide,
        //     transparent: true
        // } );
/*
        this.ribbonMateriala = new THREE.ShaderMaterial( {
              name: 'ribbonMaterial',
    
              uniforms: {
                baseTexture: { value: null },
                amountRibbon: { value: 0.0 },
                time: { value: 0 },
              },
              vertexShader: `
              uniform float time;
              varying vec2 vUv;
              varying float speed;
              void main() {
                vUv = uv;
                vec3 pos = position.xyz;
                speed = 1.0;

                float incre = sin( uv.x * 3.14159265 * 0.5);
                float wavemove = (time*0.5*speed)+uv.x;
                float amnt = sin( wavemove * 3.14159265 * 3.0) * 50.0 * incre;
                pos = pos + (normal * amnt);
//                pos.z += amnt;

                float taper = ((sin( uv.x * 3.14159265 * 0.5)) * 2.0);
                pos.y *= 1.0 + (taper/0.5);

                gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

              }

              //----------------------

              `,
              fragmentShader: `
              uniform sampler2D baseTexture;
              uniform float amountRibbon;
              uniform float time;
              varying float speed;

              varying vec2 vUv;
    
              void main() {
                vec2 uv = vUv;
                uv.x *= 4.0;
                uv.x += time * 1.0 * speed;
                vec4 colbase = texture2D( baseTexture, uv );
                vec4 outcol = colbase;
                outcol.yz = vec2(0.2,0.2);
                float a = max(max(outcol.x,outcol.y),outcol.z);
                if(vUv.x<0.3) {
                    float s = sin(3.14159265 * 0.5 * (vUv.x/0.3));
                    a = a * s;
                    outcol.xyz *= s;
                }
                else if(vUv.x>0.7) {
                    float s = 1.0-(sin(3.14159265 * 0.5 * ((vUv.x-0.7)/0.3)));
                    a = a * s;
                    outcol.xyz *= s;
                }
                gl_FragColor = vec4(outcol.xyz, a );
              }
        
              `,
              transparent: true,
              side: THREE.DoubleSide,
              defines: {}
            } );
*/

        /*
       this.envMap = 0;
        this.envMapLoader = new THREE.CubeTextureLoader();
        var urls = [
            'assets/cubemap-static/px.png',
            'assets/cubemap-static/nx.jpg',
            'assets/cubemap-static/py.jpg',
            'assets/cubemap-static/ny.jpg',
            'assets/cubemap-static/pz.jpg',
            'assets/cubemap-static/nz.jpg'
          ];


    		// .setPath( 'assets/cubemap-static/' )
	        // 	.load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );

        this.envMapLoader.load(
            urls,
            function (texture) {
                this.envMap = texture;
          
            },
            // This function is called when the texture has finished loading
            function (xhr) {
              console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // This function is called if there is an error loading the texture
            function (xhr) {
              console.log('>> ** An error happened loading the environment map');
            }
          );



        */

        // this.loadEnvMap();
//        this.envMap = new THREE.CubeTextureLoader();//
    		// .setPath( './assets/cubemap-static/' )
	        // 	.load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ]);



        // try {
        //     this.envMap = new THREE.CubeTextureLoader();
        //     this.envMap.setPath('assets/cubemap-static/');
        //     this.envMap.load([
        //       'px.png', 'nx.png',
        //       'py.png', 'ny.png',
        //       'pz.png', 'nz.png'
        //     ], function(texture) {
        //         console.log('>> *** has loaded');
        //     }, function (xhr) {
        //       console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        //     }, function (err) {
        //       console.error('An error happened while loading the textures: ' + err);
        //     });
        //   } catch (err) {
        //     console.error('An error occurred while creating the CubeTextureLoader: ' + err);
        //   }


        // this.envMap = new THREE.CubeTextureLoader()
    	// 	.setPath( 'assets/cubemap-static/' )
	    //     	.load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ],
        //         function (texture) {
        //             // The texture has been loaded
        //             console.log('>> *** Cube texture loaded');
        //             // Do something with the texture, such as creating a material that uses it
        //             // var material = new THREE.MeshBasicMaterial({
        //             //     envMap: texture
        //             // });
        //             // ...
        //         },
        //         function(err) {
        //             console.log(">> error loading cubemap");
        //         }
                
                
        //         );
    }
    //======================
    loadEnvMap(f1CarHelmet,f1Garage) {

        // const px = new THREE.TextureLoader('./assets/cubemap-static/px.png');
        if(DEBUG_MODE)
            console.log("ENVMAP >> *** Environment map trying to load cube map env");

        var self = this;

        this.envMap = new THREE.CubeTextureLoader()
    		.setPath( './assets/cubemap-static/' )
	        	.load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ], function(result) {
                    // Code to execute when the environment map has finished loading
                    self.totalTexturesLoaded = self.totalTexturesAttempted;
                    if(DEBUG_MODE) {
                        console.log(">> " + self.totalTexturesLoaded + '/'+ self.totalTexturesAttempted + "== sequential LOADED  = ENVMAP");
                        console.log('ENVMAP >> TEXTURES ALL DONE!');
                    }

                    clearTimeout(self.filetimeout);

                    self.quickSetMaps(result,f1CarHelmet,f1Garage);

                    updateProgress(5,'envmap');
                    self.alltexturesloaded = true;

                    
                });


    }
    //======================
    setEnvStrength(strength,f1CarHelmet,f1Garage,which) {
        if(which==2) {
            this.envstrGar = strength;

            f1Garage.garageMaterial.envMapIntensity = this.envstrGar;
            f1Garage.garageMaterial.needsUpdate=true;
            // f1Garage.garageWall.material.envMapIntensity = this.envstrCustom;
            // f1Garage.garageWall.material.needsUpdate=true;   
        }
        else if(which==0){
            this.envstrCustom = strength;
            f1CarHelmet.theModelMaterial.envMapIntensity = this.envstrCustom;
            f1CarHelmet.theModelMaterial.needsUpdate=true;
        }
        else {
            this.envstrStatic = strength;
            f1CarHelmet.theBaseMaterial.envMapIntensity = this.envstrStatic;
            f1CarHelmet.theBaseMaterial.needsUpdate=true;
        }

    }
    //======================
    quickSetMaps(result,f1CarHelmet,f1Garage) {

        if(f1CarHelmet && f1CarHelmet.theModelMaterial && f1Garage.garageMaterial) {
            if(DEBUG_MODE)
                console.log(">> Materials all ready - envmap applying..")
            // f1CarHelmet.envMap = result;
            f1CarHelmet.theModelMaterial.envMap = result;
            f1Garage.garageMaterial.envMap = result;
    
            // lees envmapintensity settings 280223
            f1Garage.garageMaterial.envMapIntensity = this.envstrGar;//this.envmapStrength;// * 0.125;
            f1CarHelmet.theModelMaterial.envMapIntensity = this.envstrCustom;//this.envmapStrength;

            if(f1CarHelmet.theBaseMaterial!=null) {
                f1CarHelmet.theBaseMaterial.envMap = result;
                f1CarHelmet.theBaseMaterial.envMapIntensity = this.envstrStatic;//this.envmapStrength;
                f1CarHelmet.theBaseMaterial.needsUpdate=true;
            }
            
    
            f1CarHelmet.theModelMaterial.needsUpdate=true;
            f1Garage.garageMaterial.needsUpdate=true;
        }
        else {
            if(DEBUG_MODE)
                console.log(">> error materials not all present yet - envmap waiting..")
            var self = this;
            setTimeout(function() {
                self.quickSetMaps(result,f1CarHelmet,f1Garage);
            }, 500);
        }


    }

    //======================
    
    newGarageMat() {
        return new THREE.MeshStandardMaterial(
            {
                name: 'garagenewMaterial',
                fog: false,
                metalness: 0.5,
                envMapIntensity: 1.0,
                roughness: 0.8,
                emissiveIntensity: 1,
                aoMapIntensity: 1.0,

                side: THREE.DoubleSide,
                transparent: true,
                normalScale: new THREE.Vector2(-0.2, 0.2),

                depthTest: true,
            }
        );
    }

    // ===============================================
    sequentialLoadMaps(_filenames,_filecomplete, _types, _material1, _material2,f1Garage, f1CarHelmet,f1Ribbons) {

        this.totalTexturesAttempted++;
        const self = this;


        var filelistindex=-1;
        for(var i=0;i<_filenames.length;i++) {
            if(!_filecomplete[i]) {
                filelistindex=i;
                break;
            }
        }
        if(filelistindex==-1) { // all done
            return;
        }

        const filename = _filenames[i];
        const filetype = _types[i];

        if(DEBUG_MODE)
            console.log(">> " + this.totalTexturesLoaded + '/'+ this.totalTexturesAttempted + "== attempting loadmaps sequential = " + filename);

        const _self = this;
        if(filetype==10) {  // force env map loading
            setTimeout(function() {
                clearTimeout(this.filetimeout);

                _self.loadEnvMap(f1CarHelmet,f1Garage);
            },500);
            return;
        }

        clearTimeout(this.filetimeout);

        this.filetimeout = setTimeout( function() {
            if(DEBUG_MODE)
                console.log(">> .......checking file texture load timeout : " + self.totalTexturesAttempted +", "+ self.totalTexturesLoaded);
            if(self.totalTexturesAttempted != self.totalTexturesLoaded) {
    
                if(DEBUG_MODE)
                    console.log("*************** FILE FAILED *******************");
                self.totalTexturesAttempted--;
                self.sequentialLoadMaps(_filenames, _filecomplete,_types, _material1, _material2,f1Garage, f1CarHelmet,f1Ribbons);
            }
        }, 5000);

        const maptexture = new THREE.TextureLoader().load(filename, (tex) => {
            clearTimeout(this.filetimeout);
            if(_filecomplete[filelistindex]) { //already done!
                
            }
            else {
                _filecomplete[filelistindex] = true;

                this.totalTexturesLoaded++;

                tex.encoding = THREE.LinearEncoding
                // tex.encoding = THREE.sRGBEncoding;
    
                tex.flipY = false;
                tex.premultiplyAlpha = true;
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                if(DEBUG_MODE)
                    console.log(">> " + this.totalTexturesLoaded + '/'+ this.totalTexturesAttempted + "== sequential LOADED  = " + filename);
                updateProgress(5,'');

                switch(filetype) {
                    case 0:         // base
                        _material1.map = tex;
                        _material1.needsUpdate = true;
                        break;
                    case 1:         // metal
                        _material1.metalnessMap = tex;
                        _material1.needsUpdate = true;
                        break;
                    case 2:         // rough
                        _material1.roughnessMap = tex;
                        _material1.needsUpdate = true;
                        break;
                    case 3:         // ao
                        _material1.aoMap = tex;
                        _material1.needsUpdate = true;
                        break;
                    case 4:         // normal
                        _material1.normalMap = tex;
                        _material1.needsUpdate = true;
                        break;
                    case 5:         // normal for base
                        _material2.normalMap = tex;
                        _material2.needsUpdate = true;
                        break;
                    case 6:         // ao for base
                        _material2.aoMap = tex;
                        _material2.needsUpdate = true;                        
                        break;
                    case 7:         // garage floor
                        f1Garage.garageMaterial.map = tex;
                        f1Garage.garageMaterial.needsUpdate=true;
                        break;
                    case 8:
                        f1Garage.garageMaterial.roughnessMap = tex;
                        f1Garage.garageMaterial.needsUpdate=true;                        
                        break;
                    case 9:                 // garage wall not use
                        break;
                    case 10:                 // env map dealth with elsewhere
                        break;
                    case 11:                // ribbon
                        tex.premultiplyAlpha = true;
                        f1Ribbons.uniforms.texture1.value = tex; // method with shader to distort and texture frag
                        this.keepRibbon = tex;                                                
                        break;
                    case 12:                // glow floor
                        tex.premultiplyAlpha = false;
                        f1Ribbons.floorGlowMat.map = tex; // 
                        f1Ribbons.floorGlowMat.needsUpdate=true;
                        break;
                    case 13:                // scene bg
                        tex.premultiplyAlpha = false;
                        f1Garage.backgroundImage = tex;
                        break;
                }
            }
            this.sequentialLoadMaps(_filenames, _filecomplete,_types, _material1, _material2,f1Garage,f1CarHelmet,f1Ribbons);
        })
    }
    // ===============================================


}

export { F1Materials };


