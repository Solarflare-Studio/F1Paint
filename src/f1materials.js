import * as THREE from '../node_modules/three/build/three.module.js';
import {DEBUG_MODE} from './adminuser'

import { updateProgress } from './f1gui.js';

import { f1Settings } from './F1Settings.js';

class F1Materials {

    constructor() {
        this.toloadlist = new Array();

        this.totalTexturesLoaded = 0;
        this.totalTexturesAttempted = 0;
        this.alltexturesloaded = false;
        this.filetimeout = 0;
        this.keepRibbon = 0;
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
            f1Settings.envStrengthGarage = strength;
            f1Garage.garageMaterial.envMapIntensity = f1Settings.envStrengthGarage;
            f1Garage.garageMaterial.needsUpdate=true;

            f1Garage.plinthSidesMat.envMapIntensity = f1Settings.envStrengthPlinthSides;
            f1Garage.plinthSidesMat.needsUpdate=true;
            
        }
        else if(which==0){
            f1Settings.envStrenghtCustom = strength;
            f1CarHelmet.theCustomMaterial.envMapIntensity = f1Settings.envStrenghtCustom;
            f1CarHelmet.theCustomMaterial.needsUpdate=true;
        }
        else if(which==3){
            f1Settings.envStrengthVisor = strength;
            if(f1CarHelmet.theVisorMaterial) {
                f1CarHelmet.theVisorMaterial.envMapIntensity = f1Settings.envStrengthVisor;
                f1CarHelmet.theVisorMaterial.needsUpdate=true;
            }
        }        
        else {
            f1Settings.envStrengthStatic = strength;
            f1CarHelmet.theStaticMaterial.envMapIntensity = f1Settings.envStrengthStatic;
            f1CarHelmet.theStaticMaterial.needsUpdate=true;
        }

    }
    //======================
    quickSetMaps(result,f1CarHelmet,f1Garage) {

        result.mapping = THREE.CubeReflectionMapping;
        if(f1CarHelmet && f1CarHelmet.theCustomMaterial && f1Garage.garageMaterial) {
            if(DEBUG_MODE)
                console.log(">> Materials all ready - envmap applying..")
            // f1CarHelmet.envMap = result;
            f1CarHelmet.theCustomMaterial.envMap = result;
            f1Garage.garageMaterial.envMap = result;
    
            // lees envmapintensity settings 280223
            f1Garage.garageMaterial.envMapIntensity = f1Settings.envStrengthGarage;//this.envmapStrength;// * 0.125;


            f1Garage.plinthSidesMat.envMap = result;
            f1Garage.plinthSidesMat.envMapIntensity = f1Settings.envStrengthPlinthSides;
            

            f1CarHelmet.theCustomMaterial.envMapIntensity = f1Settings.envStrenghtCustom;//this.envmapStrength;

            if(f1CarHelmet.theStaticMaterial!=null) {
                f1CarHelmet.theStaticMaterial.envMap = result;
                f1CarHelmet.theStaticMaterial.envMapIntensity = f1Settings.envStrengthStatic;//this.envmapStrength;
                f1CarHelmet.theStaticMaterial.needsUpdate=true;

                if(f1CarHelmet.theVisorMaterial) {
                    f1CarHelmet.theVisorMaterial.envMap = result;
                    f1CarHelmet.theVisorMaterial.envMapIntensity = f1Settings.envStrengthVisor;
                    f1CarHelmet.theVisorMaterial.needsUpdate=true;
                }
            }
            
            f1Garage.plinthSidesMat.needsUpdate=true;

            f1CarHelmet.theCustomMaterial.needsUpdate=true;
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
                        tex.encoding = THREE.sRGBEncoding; // for base texture map
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
                        tex.encoding = THREE.sRGBEncoding;  // garage floor texture map
                        f1Garage.garageMaterial.map = tex;
                        f1Garage.garageMaterial.needsUpdate=true;
                        f1Garage.plinthSidesMat.map = tex;
                        f1Garage.plinthSidesMat.needsUpdate=true;
                        
                        break;
                    case 8:
                        // f1Garage.garageMaterial.alphaMap = tex;

                        f1Garage.garageMaterial.roughnessMap = tex;
                        f1Garage.garageMaterial.needsUpdate=true;
                        f1Garage.plinthSidesMat.roughnessMap = tex;
                        f1Garage.plinthSidesMat.needsUpdate=true;
                        // also used for garagefloor sfx
                        f1Garage.garageSFXMaterial.uniforms.texture1.value = tex;
                        f1Garage.garageSFXMaterial.needsUpdate = true;


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
//try without here                        f1Ribbons.floorGlowMat.map = tex; // 
                         f1Ribbons.floorGlowMat.map = tex; // 
                        f1Ribbons.floorGlowMat.needsUpdate=true;
                        break;
                    case 13:                // scene bg
                        tex.premultiplyAlpha = false;
                        f1Garage.backgroundImage = tex;
                        break;

                    // visor
                    // case 20:         // base
                    //     tex.encoding = THREE.sRGBEncoding; // for base texture map
                    //     f1CarHelmet.theVisorMaterial.map = tex;
                    //     f1CarHelmet.theVisorMaterial.needsUpdate = true;
                    // break;
                    // case 21:         // metal
                    //     f1CarHelmet.theVisorMaterial.metalnessMap = tex;
                    //     f1CarHelmet.theVisorMaterial.needsUpdate = true;
                    //     break;
                    // case 22:         // rough
                    //     f1CarHelmet.theVisorMaterial.roughnessMap = tex;
                    //     f1CarHelmet.theVisorMaterial.needsUpdate = true;
                    //     break;
                    // case 23:         // ao
                    //     f1CarHelmet.theVisorMaterial.aoMap = tex;
                    //     f1CarHelmet.theVisorMaterial.needsUpdate = true;
                    //     break;
                    // case 24:         // normal
                    //     f1CarHelmet.theVisorMaterial.normalMap = tex;
                    //     f1CarHelmet.theVisorMaterial.needsUpdate = true;
                    //     break;                    

                }
            }
            this.sequentialLoadMaps(_filenames, _filecomplete,_types, _material1, _material2,f1Garage,f1CarHelmet,f1Ribbons);
        })
    }
    // ===============================================


}

export { F1Materials };


