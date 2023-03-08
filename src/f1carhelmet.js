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

        if (this.theModel) {
            // If theModel already exists, remove it and its children
            while (this.theModel.children.length > 0) {
              this.theModel.remove(this.theModel.children[0]);
            }
        }

        this.theModel = new THREE.Object3D();
        this.f1materials = f1materials;

        this.specialFXMesh = 0;
        this.baseFXMesh = 0;

        var _self = this;

         // main customisable material
        this.theModelMaterial = new THREE.MeshStandardMaterial({ // pbr
            name: 'theModelMaterial',
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
            normalScale: new THREE.Vector2(-0.5, 0.5),
            // normalScale: new THREE.Vector2(1, -1),
            // envMap: this.envMap
            side: THREE.DoubleSide

          })
        
        // car model has two meshes
        // if(!this.isHelmet) {
            // base texture doesnt change
            this.theBaseMaterial = new THREE.MeshStandardMaterial({ // pbr
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
                side: THREE.DoubleSide
                // envMap: this.envMap
            })
            // this.theBaseMaterial.color = new THREE.Color(0xffffff)
        // }

        var helmet3D;
        if(this.isHelmet)
            helmet3D = f1fnames.helmet_files[0];//'./assets/helmet/F1PS_Helmet.glb';
        else
            // helmet3D = './assets/car/F1PS_F1_Car_Mesh_v02_Collapsed.glb';
            helmet3D = f1fnames.car_files[0];//'./assets/car/F1PS_F1_Car_V03_NewUV.glb';



        this.helmetCentre = new THREE.Vector3();
        if(DEBUG_MODE)
            console.log(">> attempting to load 3d mesh="+helmet3D);
        this.gltfLoader.load( helmet3D, function ( gltf ) {
            let theModelScene = gltf.scene;
            _self.theModel.add(theModelScene);
            if(DEBUG_MODE)
                console.log(">> attempting to traverse mesh "+theModelScene.children.length);

            if(!_self.isHelmet) {
                var whichmat = 0;
                let modelMesh = theModelScene.getObjectByName('F1PS_F1_Car_Customizable')
                modelMesh.layers.set(2);
                modelMesh.material = _self.theModelMaterial;
                _self.specialFXMesh = modelMesh;
                modelMesh.castShadow = true;
                modelMesh.receiveShadow = false;

                let staticMesh = theModelScene.getObjectByName('F1PS_F1_Car_Static')
                staticMesh.layers.set(2); // make base black for glow...
                staticMesh.material = _self.theBaseMaterial;
                whichmat=1;
                staticMesh.castShadow = true;
                // staticMesh.receiveShadow = false;
                staticMesh.receiveShadow = true; // maybe! todo
                _self.baseFXMesh = staticMesh;
            }
            else {
                var whichmat = 0;
                let modelMesh = theModelScene.getObjectByName('Helmet_main_low')
                modelMesh.layers.set(2);
                modelMesh.material = _self.theModelMaterial;
                _self.specialFXMesh = modelMesh;
                modelMesh.castShadow = true;
                modelMesh.receiveShadow = false;

                let staticMesh = theModelScene.getObjectByName('Visor_low')
                staticMesh.layers.set(2); // make base black for glow...
                staticMesh.material = _self.theBaseMaterial;
                whichmat=1;
                staticMesh.castShadow = true;
                // staticMesh.receiveShadow = false;
                staticMesh.receiveShadow = true; // maybe! todo
                _self.baseFXMesh = staticMesh;
                // staticMesh.receiveShadow = false;

                whichmat=1;

            }
            
            updateProgress(10,'mesh');
            const filelist = new Array();
            const filetypelist = new Array();
            const filecomplete = new Array();
            
            // filelist.push('./assets/garage/whitefloor.jpg'); // garage floor
            
            // filelist.push('./assets/garage/concretetilesSquare.jpg' ); // floor
            filelist.push('./assets/garage/Background_Square.jpg' ); // floor
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
            filetypelist.push( 12 );             filecomplete.push(false);


            if(_self.isHelmet) { // really is helmet

                filetypelist.push( 5 ); filecomplete.push(false);
                filelist.push('./assets/helmet/Helmet Triangulated_Normal.png' ); // normal
                filetypelist.push( 6 ); filecomplete.push(false);
                filelist.push('./assets/helmet/Helmet Triangulated_AO.png' ); // ao

                // todo need helmet base texture for visor!
                _self.theBaseMaterial.emissive.r = 0.0;
                _self.theBaseMaterial.emissive.g = 0.0;
                _self.theBaseMaterial.emissive.b = 0.0;

            }
            else {  // is the car

                // now do car base mat              


                


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

                filelist.push(f1fnames.car_files[2] ); // normal
                filetypelist.push( 5 ); filecomplete.push(false);
                filelist.push(f1fnames.car_files[3] ); // ao
                filetypelist.push( 6 ); filecomplete.push(false);

            }

            // filelist.push('./assets/inapp/ribbon1.jpg'); // ribbon textures..
            //filelist.push('./assets/garage/ribbon2.jpg'); // ribbon textures..


            // keep the env map as last file to load
            filelist.push('envmap'); // force load of envmap now then
            filetypelist.push( 10 ); filecomplete.push(false);




            _self.f1materials.sequentialLoadMaps( filelist,filecomplete, filetypelist,_self.theBaseMaterial,_self.theModelMaterial,f1Garage, _self,f1Ribbons);

                


            // position 3D
            if(_self.isHelmet) {  
                _self.theModel.scale.set(22,22,22);
                _self.theModel.position.set(0,10,0); // helmet
            }
            else {
                _self.theModel.scale.set(18,18,18); // split
                _self.theModel.position.set(0,20,-20); // 

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


