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

                //map: tex,
                side: THREE.DoubleSide,
                // blending: THREE.AdditiveBlending,
                // depthWrite: false,
                // depthWrite: true,
                // opacity: 1,
                transparent: true,

                // color: new THREE.Color(0.41,0.4,0.4),
                // envMap: this.envMap,
                normalScale: new THREE.Vector2(-0.2, 0.2),

                depthTest: true,


            }
        );
    }

    // ===============================================
    // matsTextureLoader(_f1Gui, _file, _material, basemap, emissivemap, normalmap, aomap, metalmap, roughnessmap) {
    //     const textureloader = new THREE.TextureLoader();
    //     var self=this;
    //     textureloader.load(
    //         // resource URL
    //         _file,
        
    //         // onLoad callback
    //         function ( tex ) {

    //             tex.encoding = THREE.LinearEncoding;
    //             tex.flipY = false;
    //             tex.premultiplyAlpha = true;
    //             tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    //             _material.map = tex;
    //             _material.needsUpdate = true;

    //             _f1Gui.updateProgress(5,'texture loaded ' + _file);
    //             self.loadMaps(_material, null, emissivemap, normalmap, aomap, metalmap, roughnessmap, null, _f1Gui);
    //         },
        
    //         // onProgress callback currently not supported
    //         undefined,
        
    //         // onError callback
    //         function ( err ) {
    //             console.error( '>> An error happened trying to load texture image:' +_file );
    //         }
    //     );        
    // }
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


        // const newfilenames = _filenames.slice(1);
        // const newfiletypes = _types.slice(1);
        // const newfilecomplete = _filecomplete.slice(1);
        const _self = this;
        if(filetype==10) {  // force env map loading
            setTimeout(function() {
                clearTimeout(this.filetimeout);

                _self.loadEnvMap(f1CarHelmet,f1Garage);
            },1000);
            
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

                if(filetype==0) { //base
                    _material1.map = tex;
                    _material1.needsUpdate = true;
                }
                else if(filetype==1) { //metal
                    _material1.metalnessMap = tex;
                    _material1.needsUpdate = true;
                }
                else if(filetype==2) { //rough
                    _material1.roughnessMap = tex;
                    _material1.needsUpdate = true;
                }
                else if(filetype==3) { //ao
                    _material1.aoMap = tex;
                    _material1.needsUpdate = true;
                }
                else if(filetype==4) { //normal
                    _material1.normalMap = tex;
                    _material1.needsUpdate = true;
                }
                //
                else if(filetype==5) { //normal
                    _material2.normalMap = tex;
                    _material2.needsUpdate = true;
                }
                else if(filetype==6) { //ao
                    _material2.aoMap = tex;
                    _material2.needsUpdate = true;
                }
                else if(filetype==7) {  // garage floor
                    f1Garage.garageMaterial.map = tex;
                    f1Garage.garageMaterial.needsUpdate=true;
                }
                else if(filetype==8) {  // garage floor rough
                    f1Garage.garageMaterial.roughnessMap = tex;
                    // f1Garage.garageMaterial.envMapIntensity = 0.10;
                    
                    f1Garage.garageMaterial.needsUpdate=true;

                }
                else if(filetype==9) {  // garage wall
                    // f1Garage.garageWall.material.map = tex;
                    // // f1Garage.garageWall.material.envMapIntensity = 0.10;
                    // f1Garage.garageWall.material.needsUpdate=true;
                }
                else if(filetype==11) {  // ribbon
                    // tex.premultiplyAlpha = false;
                    tex.premultiplyAlpha = true;
                    f1Ribbons.uniforms.texture1.value = tex; // method with shader to distort and texture frag
                    // f1Ribbons.uniformsCarChange.texture1.value = tex;

                    this.keepRibbon = tex;

                    // this.ribbonMaterial.uniforms.baseTexture.value = tex; // method with shader to distort and texture frag
                    // f1Ribbons.ribbonMaterial.map = tex; // method with normal mat and buffergeom...todo
                    // f1Ribbons.ribbonMaterial.needsUpdate=true;
                }
                else if(filetype==12) {  // glow floor
                    tex.premultiplyAlpha = false;
                    f1Ribbons.floorGlowMat.map = tex; // 
                    f1Ribbons.floorGlowMat.needsUpdate=true;
                }
                else if(filetype==13) {  // scene bg
                    tex.premultiplyAlpha = false;
                    f1Garage.backgroundImage = tex;

                    // f1Garage.backgroundMat.map = tex;
    //                f1Garage.backgroundMat.needsUpdate=true;
                }
            }
          

            this.sequentialLoadMaps(_filenames, _filecomplete,_types, _material1, _material2,f1Garage,f1CarHelmet,f1Ribbons);

        })
    }
    // ===============================================


/*


    sequentialLoadMapsOLD(_filenames,_filecomplete, _types, _material1, _material2,f1Gui,f1Garage, f1CarHelmet,f1Ribbons) {

        this.totalTexturesAttempted++;
        const self = this;
        if(DEBUG_MODE)
            console.log(">> " + this.totalTexturesLoaded + '/'+ this.totalTexturesAttempted + "== attempting loadmaps sequential = " + _filenames[0]);
        const filename = _filenames[0];
        const filetype = _types[0];
        const newfilenames = _filenames.slice(1);
        const newfiletypes = _types.slice(1);
        const newfilecomplete = _filecomplete.slice(1);
        const _self = this;
        if(filetype==10) {  // force env map loading
            setTimeout(function() {
                clearTimeout(this.filetimeout);

                _self.loadEnvMap(f1CarHelmet,f1Garage,f1Gui);
            },1000);
            
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
                self.sequentialLoadMaps(_filenames, _filecomplete,_types, _material1, _material2,f1Gui,f1Garage, f1CarHelmet,f1Ribbons);
            }
        }, 5000);

        const maptexture = new THREE.TextureLoader().load(filename, (tex) => {

            this.totalTexturesLoaded++;
            clearTimeout(this.filetimeout);

            tex.encoding = THREE.LinearEncoding
            // tex.encoding = THREE.sRGBEncoding;
 
            tex.flipY = false;
            tex.premultiplyAlpha = true;
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            if(DEBUG_MODE)
                console.log(">> " + this.totalTexturesLoaded + '/'+ this.totalTexturesAttempted + "== sequential LOADED  = " + filename);
            f1Gui.updateProgress(5,'');

            if(filetype==0) { //base
                _material1.map = tex;
                _material1.needsUpdate = true;
            }
            else if(filetype==1) { //metal
                _material1.metalnessMap = tex;
                _material1.needsUpdate = true;
            }
            else if(filetype==2) { //rough
                _material1.roughnessMap = tex;
                _material1.needsUpdate = true;
            }
            else if(filetype==3) { //ao
                _material1.aoMap = tex;
                _material1.needsUpdate = true;
            }
            else if(filetype==4) { //normal
                _material1.normalMap = tex;
                _material1.needsUpdate = true;
            }
            //
            else if(filetype==5) { //normal
                _material2.normalMap = tex;
                _material2.needsUpdate = true;
            }
            else if(filetype==6) { //ao
                _material2.aoMap = tex;
                _material2.needsUpdate = true;
            }
            else if(filetype==7) {  // garage floor
                f1Garage.garageMaterial.map = tex;
                f1Garage.garageMaterial.needsUpdate=true;
            }
            else if(filetype==8) {  // garage floor rough
                f1Garage.garageMaterial.roughnessMap = tex;
                // f1Garage.garageMaterial.envMapIntensity = 0.10;
                
                f1Garage.garageMaterial.needsUpdate=true;

            }
            else if(filetype==9) {  // garage wall
                // f1Garage.garageWall.material.map = tex;
                // // f1Garage.garageWall.material.envMapIntensity = 0.10;
                // f1Garage.garageWall.material.needsUpdate=true;
            }
            else if(filetype==11) {  // ribbon
                // tex.premultiplyAlpha = false;
                tex.premultiplyAlpha = true;
                f1Ribbons.uniforms.texture1.value = tex; // method with shader to distort and texture frag
                // f1Ribbons.uniformsCarChange.texture1.value = tex;

                this.keepRibbon = tex;

                // this.ribbonMaterial.uniforms.baseTexture.value = tex; // method with shader to distort and texture frag
                // f1Ribbons.ribbonMaterial.map = tex; // method with normal mat and buffergeom...todo
                // f1Ribbons.ribbonMaterial.needsUpdate=true;
            }
            else if(filetype==12) {  // glow floor
                tex.premultiplyAlpha = false;
                f1Ribbons.floorGlowMat.map = tex; // 
                f1Ribbons.floorGlowMat.needsUpdate=true;
            }
            else if(filetype==13) {  // scene bg
                tex.premultiplyAlpha = false;
                f1Garage.backgroundImage = tex;

                // f1Garage.backgroundMat.map = tex;
//                f1Garage.backgroundMat.needsUpdate=true;
            }
          

            if(newfilenames.length!=0)
                this.sequentialLoadMaps(newfilenames, newfilecomplete,newfiletypes, _material1, _material2,f1Gui,f1Garage,f1CarHelmet,f1Ribbons);


        })
    }
    // ===============================================
*/
    // loadMaps(material, basemap, emissivemap, normalmap, aomap, metalmap, roughnessmap, alphamap, f1Gui) {
    //     if (basemap) {

    //         console.log(">> == loadmaps basemap");
    //         this.matsTextureLoader(f1Gui, basemap, material, basemap, emissivemap, normalmap, aomap, metalmap, roughnessmap);
    //         return;

    //         // const texturebase = new THREE.TextureLoader().load(basemap, (tex) => {
    //         //     tex.encoding = THREE.LinearEncoding;
    //         //     material.map = tex;
    //         //     material.map.flipY = false;
    //         //     material.map.premultiplyAlpha = true;
    //         //     material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
    //         //     material.needsUpdate = true;

    //         //     f1Gui.updateProgress(5,'basemap');

    //         // }) 
    //     }
    //     if (emissivemap) {
            
    //         console.log(">> == loadmaps emissivemap");

    //         const textureemissivemap = new THREE.TextureLoader().load(emissivemap, (tex) => {
    //             tex.encoding = THREE.LinearEncoding
    //             material.emissiveMap = tex
    //             material.emissiveMap.flipY = false
    //             material.emissiveMap.wrapS = material.emissiveMap.wrapT = THREE.RepeatWrapping
    //             material.emissive.r = 1
    //             material.emissive.g = 1
    //             material.emissive.b = 1
    //             material.needsUpdate = true

    //             f1Gui.updateProgress(5,'emissivemap');

    //         })
    //     }
    //     if (normalmap) {
    //         console.log("NORMAL >> == LOADING aomap");

    //         const texturenormalmap = new THREE.TextureLoader().load(normalmap, (tex) => {
    //             tex.encoding = THREE.LinearEncoding
    //             material.normalMap = tex
    //             material.normalMap.flipY = false
    //             material.normalMap.wrapS = material.normalMap.wrapT = THREE.RepeatWrapping

    //             material.needsUpdate = true
    //             console.log("NORMAL >> == LOADED aomap");
    //             f1Gui.updateProgress(5,'normalmap');
    //             this.loadMaps(material, null, null, null, aomap, metalmap, roughnessmap, alphamap, f1Gui);

    //         })
    //         return;
    //     }
    //     if (aomap) {
    //         console.log("AO >> == LOADING aomap");

    //         const textureaomap = new THREE.TextureLoader().load(aomap, (tex) => {
    //             tex.encoding = THREE.LinearEncoding
    //             material.aoMap = tex
    //             material.aoMap.flipY = false
    //             material.aoMap.wrapS = material.aoMap.wrapT = THREE.RepeatWrapping
    //             material.needsUpdate = true
    //             console.log("AO >> == LOADED aomap");
    //             f1Gui.updateProgress(5,'aomap');
    //             this.loadMaps(material, null, null, null, null, metalmap, roughnessmap, alphamap, f1Gui);
    //         })
    //         return;
    //     }
    //     if (metalmap) {
    //         console.log("METAL >> == LOADING metalmap");

    //         const texturemetalmap = new THREE.TextureLoader().load(metalmap, (tex) => {
    //             tex.encoding = THREE.LinearEncoding
    //             material.metalnessMap = tex
    //             material.metalnessMap.flipY = false
    //             material.metalnessMap.wrapS = material.metalnessMap.wrapT = THREE.RepeatWrapping
    //             material.needsUpdate = true
    //             console.log("METAL >> == LOADED metalmap");
    //             f1Gui.updateProgress(5,'metalmap');
    //             this.loadMaps(material, null, null, null, null, null, roughnessmap, alphamap, f1Gui);
    //         })
    //         return;
    //     }
    //     if (roughnessmap) {
    //         console.log("ROUGH >> == LOADING roughnessmap");

    //         const textureroughnessmap = new THREE.TextureLoader().load(roughnessmap, (tex) => {
    //             tex.encoding = THREE.LinearEncoding
    //             material.roughnessMap = tex
    //             material.roughnessMap.flipY = false
    //             material.roughnessMap.wrapS = material.roughnessMap.wrapT = THREE.RepeatWrapping
    //             material.needsUpdate = true
    //             console.log("ROUGH >> == LOADED roughnessmap");
    //             f1Gui.updateProgress(5,'roughnessmap');

    //         })
    //     }
    //     // if (alphamap) {
    //     //     const texturealphamap = new THREE.TextureLoader().load(alphamap, (tex) => {
    //     //     tex.encoding = THREE.LinearEncoding
    //     //     material.alphaMap = tex
    //     //     material.alphaMap.flipY = false
    //     //     material.alphaMap.wrapS = material.alphaMap.wrapT = THREE.RepeatWrapping
    //     //     material.needsUpdate = true
    //     //     })
    //     // }
    // }
    //==================================================


    //======================

}

export { F1Materials };


