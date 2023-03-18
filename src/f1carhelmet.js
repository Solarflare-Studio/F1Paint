import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import {DEBUG_MODE} from './adminuser'

import { updateProgress } from './f1gui.js';

class F1CarHelmet {

    constructor() {
    }

    init(f1materials,f1Layers,isHelmet, f1fnames, f1MetalRough,f1SpecialFX, f1Garage, f1Ribbons) {

        this.isHelmet = isHelmet;

        this.gltfLoader = new GLTFLoader();

        if (this.theModelRoot) {
            // If theModel already exists, remove it and its children
            while (this.theModelRoot.children.length > 0) {
              this.theModelRoot.remove(this.theModelRoot.children[0]);
            }
        }

        this.theModelRoot = new THREE.Object3D();
        this.f1materials = f1materials;

        this.customMesh = 0;
        this.staticMesh = 0;
        this.visorMesh = 0;

        var _self = this;

        // for wireframe
        // clipping plane for intro spfx
        this.clipPlanes = [
            // new THREE.Plane( new THREE.Vector3( 0, 0, -1 ), 0 ),
            new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0 ),
            new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 ),
        ];

        this.clipPlanesCustom = [
            // new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 ),
            new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0 ),
        ];          

        this.wireFrameMat = new THREE.MeshBasicMaterial({
            // color: new THREE.Color(0,0.85,0),
            color: new THREE.Color(0.9,0.05,0.05),
            wireframe: true,

            // clipping for intro
            clippingPlanes: this.clipPlanes,
            clipIntersection: false
        });

         // main customisable material
        this.theCustomMaterial = new THREE.MeshStandardMaterial({ // pbr
            name: 'theCustomMaterial',
            map: f1Layers.customMapBufferMapSceneTarget.texture,
            fog: false,
            metalness: 1.0,
            // envMapIntensity: _self.envamount, //3.4,// 3.4,//5.0,
            roughness: 1.0,
            emissiveIntensity:1,
            aoMapIntensity: 1.0,

            metalnessMap: f1MetalRough.metalBufferMapSceneTarget.texture,
            roughnessMap: f1MetalRough.metalBufferMapSceneTarget.texture,
        //    emissiveMap: f1SpecialFX.bufferMapSceneTarget.texture, // check todo
            color: new THREE.Color(0xffffff),
            // shadowSide: THREE.FrontSide,// THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
            emissive: new THREE.Color(0,0,0),
            // normalScale: new THREE.Vector2(-0.5, 0.5),
            normalScale: new THREE.Vector2(1, -1),
            // envMap: this.envMap
            side: THREE.DoubleSide,


            // clipping for intro
            clippingPlanes: this.clipPlanesCustom,
            clipIntersection: false,
            

          })
        
        // car model has two meshes
        // if(!this.isHelmet) {
            // base texture doesnt change
            this.theStaticMaterial = new THREE.MeshStandardMaterial({ // pbr
                name: 'theModelBaseMaterial',
                fog: false,
                // metalness: 1.0,
                // roughness: 1.0,
                // color: new THREE.Color(0xffffff),
                metalness: 1,// 0.4,// 1,
                roughness: 1,//0.27, //1,
                color: new THREE.Color(0xffffff),
                emissiveIntensity: 1,
                aoMapIntensity: 1.0,
                // shadowSide: THREE.FrontSide,// THREE.DoubleSide,
                shadowSide: THREE.DoubleSide,
                
                emissive: new THREE.Color(0,0,0),
                // normalScale: new THREE.Vector2(-0.5, 0.5),
                normalScale: new THREE.Vector2(1, -1),
                side: THREE.DoubleSide,
                // envMap: this.envMap

                // clipping for intro
                clippingPlanes: this.clipPlanesCustom,
                clipIntersection: false

            })
            // this.theStaticMaterial.color = new THREE.Color(0xffffff)
        // }
        // visor
        if(this.isHelmet) {
            this.theVisorMaterial = new THREE.MeshStandardMaterial({ // pbr
                name: 'theVisorMaterial',
                fog: false,
                metalness: 0.6,
                roughness: 0.2,
                // metalness: 1.,
                // roughness: 1.,
                emissiveIntensity:1,
                aoMapIntensity: 1.0,

                color: new THREE.Color(0xffdf00),
                // shadowSide: THREE.FrontSide,// THREE.DoubleSide,
                shadowSide: THREE.DoubleSide,
                emissive: new THREE.Color(0,0,0),
                // normalScale: new THREE.Vector2(-0.5, 0.5),
                normalScale: new THREE.Vector2(1, -1),
                side: THREE.DoubleSide,

                // clipping for intro
                clippingPlanes: this.clipPlanesCustom,
                clipIntersection: false
            })
        }
        //
        var model3D;
        if(this.isHelmet)
            model3D = f1fnames.helmet_files[0];
        else
            model3D = f1fnames.car_files[0];



        if(DEBUG_MODE)
            console.log(">> attempting to load 3d mesh="+model3D);
        this.gltfLoader.load( model3D, function ( gltf ) {
            let theModelScene = gltf.scene;
            _self.theModelRoot.add(theModelScene);
            if(DEBUG_MODE)
                console.log(">> attempting to traverse mesh "+theModelScene.children.length);

            if(!_self.isHelmet) {
                _self.customMesh = theModelScene.getObjectByName('F1PS_F1_Car_Customizable')
                _self.customMesh.layers.set(2);
                _self.customMesh.material = _self.theCustomMaterial;
                _self.customMesh.castShadow = true;
                _self.customMesh.receiveShadow = true;//false;

                let staticMesh = theModelScene.getObjectByName('F1PS_F1_Car_Static')
                staticMesh.layers.set(2); // make base black for glow...
                staticMesh.material = _self.theStaticMaterial;
                staticMesh.castShadow = true;
                // staticMesh.receiveShadow = false;
                staticMesh.receiveShadow = true; // maybe! todo
                _self.staticMesh = staticMesh;
            }
            else {
                _self.customMesh = theModelScene.getObjectByName('Helmet_main_1')
                _self.customMesh.layers.set(2);
                _self.customMesh.material = _self.theCustomMaterial;
                _self.customMesh.material.normalScale = new THREE.Vector2(-0.1, 0.1),
                _self.customMesh.castShadow = true;
                _self.customMesh.receiveShadow = false;

                let staticMesh = theModelScene.getObjectByName('Helmet_main_2')
                staticMesh.layers.set(2); // make base black for glow...
                staticMesh.material = _self.theStaticMaterial;
                staticMesh.castShadow = true;
                staticMesh.receiveShadow = false;// true; // maybe! todo
                _self.staticMesh = staticMesh;

                _self.visorMesh = theModelScene.getObjectByName('Helmet_main_visor')
                _self.visorMesh.layers.set(2); // make base black for glow...
                _self.visorMesh.material = _self.theVisorMaterial;
                _self.visorMesh.castShadow = true;
                _self.visorMesh.receiveShadow = false;// true; // maybe! todo
                // staticMesh.receiveShadow = false;

            }
            
            updateProgress(10,'mesh');
            const filelist = new Array();
            const filetypelist = new Array();
            const filecomplete = new Array();
            
            // filelist.push('./assets/garage/whitefloor.jpg'); // garage floor
            
            // filelist.push('./assets/garage/concretetilesSquare.jpg' ); // floor
            filelist.push('./assets/garage/Background_Square.jpg' ); // floor
            // filelist.push('./assets/garage/Background_Square trans.png' ); // floor
            filetypelist.push( 7 ); filecomplete.push(false);
            // filelist.push('./assets/garage/concretetilesSquare.jpg' ); // floor roughmap
            filelist.push('./assets/garage/Background_Square_rm.jpg' ); // floor roughmetal
            filetypelist.push( 8 ); filecomplete.push(false);
            // filelist.push('./assets/garage/walls.jpg' ); // garage walls
            // filetypelist.push( 9 );
            filelist.push('./assets/sfx/scenebackground.jpg' ); // garage walls
            filetypelist.push( 13 ); filecomplete.push(false);

            // filelist.push('./assets/sfx/ribbon2.png'); // ribbon textures..
            filelist.push('./assets/sfx/ribbon4.png'); // ribbon textures..
            // filelist.push('./assets/sfx/ribbon3.png'); // ribbon textures..
            filetypelist.push( 11 ); filecomplete.push(false);
            filelist.push('./assets/sfx/floorglow.jpg'); // flow glow texture
            filetypelist.push( 12 );             
            filecomplete.push(false);


            if(_self.isHelmet) { // really is helmet

                // todo
                // now do HELMET static mat              
                filelist.push(f1fnames.helmet_files[6] ); // base
                filetypelist.push( 0 ); filecomplete.push(false);
                filelist.push(f1fnames.helmet_files[9] ); // metal
                filetypelist.push( 1 ); filecomplete.push(false);
                filelist.push(f1fnames.helmet_files[10] ); // rough
                filetypelist.push( 2 ); filecomplete.push(false);
                filelist.push(f1fnames.helmet_files[8] ); // ao
                filetypelist.push( 3 ); filecomplete.push(false);
                filelist.push(f1fnames.helmet_files[7] ); // normal
                filetypelist.push( 4 ); filecomplete.push(false);

                // custom mat
                filelist.push(f1fnames.helmet_files[2] ); // normal
                filetypelist.push( 5 ); filecomplete.push(false);
                filelist.push(f1fnames.helmet_files[3] ); // ao
                filetypelist.push( 6 ); filecomplete.push(false);

                // visor
                // filelist.push(f1fnames.helmet_files[11] ); // base
                // filetypelist.push( 20 ); filecomplete.push(false);
                // filelist.push(f1fnames.helmet_files[14] ); // metal
                // filetypelist.push( 21 ); filecomplete.push(false);
                // filelist.push(f1fnames.helmet_files[15] ); // rough
                // filetypelist.push( 22 ); filecomplete.push(false);
                // filelist.push(f1fnames.helmet_files[13] ); // ao
                // filetypelist.push( 23 ); filecomplete.push(false);
                // filelist.push(f1fnames.helmet_files[12] ); // normal
                // filetypelist.push( 24 ); filecomplete.push(false);



            }
            else {  // is the car

                // now do car static mat              
                filelist.push(f1fnames.car_files[6] ); // base
                filetypelist.push( 0 ); filecomplete.push(false);
                filelist.push(f1fnames.car_files[9] ); // metal
                filetypelist.push( 1 ); filecomplete.push(false);
                filelist.push(f1fnames.car_files[10] ); // rough
                filetypelist.push( 2 ); filecomplete.push(false);
                filelist.push(f1fnames.car_files[8] ); // ao
                filetypelist.push( 3 ); filecomplete.push(false);
                filelist.push(f1fnames.car_files[7] ); // normal
                filetypelist.push( 4 ); filecomplete.push(false);

                // custom mat
                filelist.push(f1fnames.car_files[2] ); // normal
                filetypelist.push( 5 ); filecomplete.push(false);
                filelist.push(f1fnames.car_files[3] ); // ao
                filetypelist.push( 6 ); filecomplete.push(false);

            }

            // keep the env map as last file to load
            filelist.push('envmap'); // force load of envmap now then
            filetypelist.push( 10 ); filecomplete.push(false);

            _self.f1materials.sequentialLoadMaps( filelist,filecomplete, filetypelist,_self.theStaticMaterial,_self.theCustomMaterial,f1Garage, _self,f1Ribbons);


            // position 3D
            if(_self.isHelmet) {  
                _self.theModelRoot.scale.set(24,24,24);
                // _self.theModelRoot.position.set(0,10,0); // helmet
                _self.theModelRoot.position.set(0,7,-2); // helmet
            }
            else {
                _self.theModelRoot.scale.set(18,18,18); // split
                _self.theModelRoot.position.set(0,20,-20); // 

            }
        }, undefined, function ( error ) {
        
            if(DEBUG_MODE)
                console.error( error );
        
        } );
    }
    //======================



    //======================

}

export { F1CarHelmet };


