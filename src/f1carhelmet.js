import * as THREE from '../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

class F1CarHelmet {

    constructor() {
    }

    init(f1materials,f1Layers,isHelmet, f1fnames, f1MetalRough,f1Gui,f1SpecialFX, f1Garage, f1Ribbons) {

        this.isHelmet = isHelmet;




        this.gltfLoader = new GLTFLoader();

        if (this.theHelmet) {
        //     // If theHelmet already exists, remove it and its children
            while (this.theHelmet.children.length > 0) {
              this.theHelmet.remove(this.theHelmet.children[0]);
            }
        //     // Remove theHelmet from its parent, if it has one
        //     if (this.theHelmet.parent) {
        //       this.theHelmet.parent.remove(this.theHelmet);
        //     }
        }

        this.theHelmet = new THREE.Object3D();
        this.f1materials = f1materials;
        // this.f1Layers = f1Layers;
        // this.f1MetalRough = f1MetalRough;
        // this.instancedMesh = new THREE.Object3D(); 
        this.f1Gui = f1Gui;
        this.specialFXMesh = 0;
        this.baseFXMesh = 0;

        var _self = this;

        // this.envamount = 0.10;
        // this.envMap = f1materials.envMap;



        // main customisable material
        this.theHelmetMaterial = new THREE.MeshStandardMaterial({ // pbr
            name: 'theHelmetMaterial',
            map: f1Layers.bufferMapSceneTarget.texture,
            fog: false,
            metalness: 1.0,
            // envMapIntensity: _self.envamount, //3.4,// 3.4,//5.0,
            roughness: 1.0,
            emissiveIntensity:1,
            aoMapIntensity: 1.0,

            metalnessMap: f1MetalRough.bufferMapSceneTarget.texture,
            roughnessMap: f1MetalRough.bufferMapSceneTarget.texture,
        //    emissiveMap: f1SpecialFX.bufferMapSceneTarget.texture, // check todo
            color: new THREE.Color(0xffffff),
            // shadowSide: THREE.FrontSide,// THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
            emissive: new THREE.Color(0,0,0),
            normalScale: new THREE.Vector2(-0.5, 0.5),
            // envMap: this.envMap
            side: THREE.DoubleSide

          })
        
        // car model has two meshes
        if(!this.isHelmet) {
            // base texture doesnt change
            this.theBaseMaterial = new THREE.MeshStandardMaterial({ // pbr
                name: 'theHelmetBaseMaterial',
                fog: false,
                // metalness: 1.0,
                // roughness: 1.0,
                // color: new THREE.Color(0xffffff),
                metalness: 0.8,
                roughness: 0.8,
                color: new THREE.Color(0xffffff),
                emissiveIntensity: 1,
                aoMapIntensity: 1.0,
                // shadowSide: THREE.FrontSide,// THREE.DoubleSide,
                shadowSide: THREE.DoubleSide,
                
                emissive: new THREE.Color(0,0,0),
                normalScale: new THREE.Vector2(-0.5, 0.5),
                side: THREE.DoubleSide
                // envMap: this.envMap
            })
            // this.theBaseMaterial.color = new THREE.Color(0xffffff)
        }

        var helmet3D;
        if(this.isHelmet)
            helmet3D = f1fnames.helmet_files[0];//'./assets/helmet/F1PS_Helmet.glb';
        else
            // helmet3D = './assets/car/F1PS_F1_Car_Mesh_v02_Collapsed.glb';
            helmet3D = f1fnames.car_files[0];//'./assets/car/F1PS_F1_Car_V03_NewUV.glb';



        this.helmetCentre = new THREE.Vector3();
        console.log(">> attempting to load 3d mesh="+helmet3D);
        this.gltfLoader.load( helmet3D, function ( gltf ) {
            let theModelScene = gltf.scene;
            _self.theHelmet.add(theModelScene);
            console.log(">> attempting to traverse mesh "+theModelScene.children.length);

            // theModelScene.traverse( function ( child ) {
            //     if ( child.isMesh ) {
            //         console.log(">> model child name =" + child.name);
            //         child.castShadow = true;
            //         // child.receiveShadow = false;
            //         child.receiveShadow = true;
    
            //         child.material = _self.theHelmetMaterial;
            //     }
            // });


            if(!_self.isHelmet) {
                var whichmat = 0;
                let modelMesh = theModelScene.getObjectByName('F1PS_F1_Car_Customizable')
                modelMesh.layers.set(2);
                modelMesh.material = _self.theHelmetMaterial;
                _self.specialFXMesh = modelMesh;
                modelMesh.castShadow = true;
                // modelMesh.receiveShadow = false;
                modelMesh.receiveShadow = true;
                let staticMesh = theModelScene.getObjectByName('F1PS_F1_Car_Static')
                staticMesh.layers.set(2); // make base black for glow...
                staticMesh.material = _self.theBaseMaterial;
                whichmat=1;
                staticMesh.castShadow = true;
                // staticMesh.receiveShadow = false;
                staticMesh.receiveShadow = true; // maybe! todo
                _self.baseFXMesh = staticMesh;
                // staticMesh.receiveShadow = false;


            }
            else {
                let modelMesh = theModelScene.getObjectByName('Helmet_main_low')
                modelMesh.layers.set(2);
                modelMesh.material = _self.theHelmetMaterial;
                _self.specialFXMesh = modelMesh;
                modelMesh.castShadow = true;
                modelMesh.receiveShadow = false;
                whichmat=1;

            }
            /*
            theModelScene.traverse( function ( child ) {
    
                if ( child.isMesh ) {
                    console.log(">>car model materials=" + child.material.name);
                    // if(child.material.name == 'F1PS_F1_Car_Customizable') {
                    // if(whichmat==1) {
                    if(child.name=='F1PS_F1_Car_Customizable') {
                        child.layers.set(2);
                        child.material = _self.theHelmetMaterial;
                        _self.specialFXMesh = child;
                        // duplicate this layer !
                        // _self.specialFXMesh = new THREE.InstancedMesh( child, _self.fxMaterial, 1 );
                        // _self.specialFXMesh = child.clone();
                        // _self.specialFXMesh.parent = child.parent;
                        // _self.specialFXMesh.layers.set(2);
                        // _self.theHelmet.add(_self.specialFXMesh);

                    }
                    else if(child.name=='F1PS_F1_Car_Static') {
                        // child.layers.set(1);
                        child.layers.set(2); // make base black for glow...
                        child.material = _self.theBaseMaterial;
                        whichmat=1;
                        _self.baseFXMesh = child;
                    }
                    else {
                        console.log(">> ** error unexpected child mesh : " + child.name);
                    }
                    
                    child.castShadow = true;
                    child.receiveShadow = false;

                    child.geometry.computeBoundingBox();
                    child.geometry.boundingBox.getCenter(_self.helmetCentre);
                }
    
            } );
            */
            _self.f1Gui.updateProgress(10,'mesh');
            const filelist = new Array();
            const filetypelist = new Array();
            
            // filelist.push('./assets/garage/whitefloor.jpg'); // garage floor
            filelist.push('./assets/garage/concretetilesSquare.jpg' ); // floor
            filetypelist.push( 7 );
            filelist.push('./assets/garage/concretetilesSquare.jpg' ); // floor roughmap
            filetypelist.push( 8 );
            // filelist.push('./assets/garage/walls.jpg' ); // garage walls
            // filetypelist.push( 9 );
            filelist.push('./assets/sfx/scenebackground.jpg' ); // garage walls
            filetypelist.push( 13 );

            filelist.push('./assets/garage/ribbon2.png'); // ribbon textures..
            // filelist.push('./assets/sfx/ribbon3.png'); // ribbon textures..
            filetypelist.push( 11 );
            filelist.push('./assets/sfx/floorglow.jpg'); // flow glow texture
            filetypelist.push( 12 );            


            if(_self.isHelmet) { // really is helmet

                filetypelist.push( 5 );
                filelist.push('./assets/helmet/Helmet Triangulated_Normal.png' ); // normal
                filetypelist.push( 6 );
                filelist.push('./assets/helmet/Helmet Triangulated_AO.png' ); // ao

                // _self.f1materials.loadMaps(_self.theHelmetMaterial, 
                //     null,//'./assets/helmet/Helmet_BaseColor.png',
                //     null,
                //     './assets/helmet/Helmet Triangulated_Normal.png',
                //     './assets/helmet/Helmet Triangulated_AO.png',
                //     null,//'./assets/helmet/Helmet Triangulated_Metal.png',
                //     null,//'./assets/helmet/Helmet Triangulated_Roughness.png',
                //     null,_self.f1Gui);
                // _self.theHelmetMaterial.needsUpdate=true;
            }
            else {  // is the car

                // now do car base mat              


                


                filelist.push(f1fnames.car_files[6] ); // base
                filetypelist.push( 0 );
                filelist.push(f1fnames.car_files[9] ); // metal
                filetypelist.push( 1 );
                filelist.push(f1fnames.car_files[10] ); // rough
                filetypelist.push( 2 );
                filelist.push(f1fnames.car_files[8] ); // ao
                filetypelist.push( 3 );
                filelist.push(f1fnames.car_files[7] ); // normal
                filetypelist.push( 4 );

                filelist.push(f1fnames.car_files[2] ); // normal
                filetypelist.push( 5 );
                filelist.push(f1fnames.car_files[3] ); // ao
                filetypelist.push( 6 );

                _self.theBaseMaterial.emissive.r = 0.0;
                _self.theBaseMaterial.emissive.g = 0.0;
                _self.theBaseMaterial.emissive.b = 0.0;
            }

            // filelist.push('./assets/inapp/ribbon1.jpg'); // ribbon textures..
            //filelist.push('./assets/garage/ribbon2.jpg'); // ribbon textures..


            filelist.push('envmap'); // force load of envmap now then
            filetypelist.push( 10 );


            _self.theHelmetMaterial.emissive.r = 0.0;
            _self.theHelmetMaterial.emissive.g = 0.0;
            _self.theHelmetMaterial.emissive.b = 0.0;

            _self.f1materials.sequentialLoadMaps( filelist, filetypelist,_self.theBaseMaterial,_self.theHelmetMaterial,_self.f1Gui,f1Garage, _self,f1Ribbons);

                


                // _self.f1materials.loadMaps(_self.theBaseMaterial, 
                //     f1fnames.car_files[6],//'./assets/car/static/F1PS_F1_V03_NewUV_BaseColor.png',// base always stays the same
                //     null,
                //     f1fnames.car_files[7],//'./assets/car/static/F1PS_F1_V03_NewUV_Normal.png',
                //     f1fnames.car_files[8],//'./assets/car/static/F1PS_F1_V03_NewUV_AO.png',
                //     f1fnames.car_files[9],//'./assets/car/static/F1PS_F1_V03_NewUV_Metal.png',
                //     f1fnames.car_files[10],//'./assets/car/static/F1PS_F1_V03_NewUV_Roughness.png',
                //     null,_self.f1Gui);                


                // _self.f1materials.loadMaps(_self.theHelmetMaterial, 
                //     null,//'./assets/helmet/Helmet_BaseColor.png',
                //     null,
                //     f1fnames.car_files[2],//'./assets/car/F1PS_F1_V03_NewUV_Normal.png',
                //     f1fnames.car_files[3],//'./assets/car/F1PS_F1_V03_NewUV_AO.png',
                //     // use same map for both rough and map split green blue
                //     null,//f1fnames.car_files[4],//'./assets/car/F1PS_F1_V03_NewUV_Metal.png',
                //     null,//f1fnames.car_files[5],//'./assets/car/F1PS_F1_V03_NewUV_Roughness.png',
                //     null,_self.f1Gui);
                // _self.theHelmetMaterial.needsUpdate=true;


                // _self.theBaseMaterial.needsUpdate=true;

                    // _self.f1materials.setupMaterial(_self.theBaseMaterial);

            // }

    

            // _self.theHelmetMaterial.map = f1Layers.bufferMapSceneTarget.texture;
            // _self.theHelmetMaterial.metalnessMap = f1MetalRough.bufferMapSceneTarget.texture,
            // _self.theHelmetMaterial.roughnessMap = f1MetalRough.bufferMapSceneTarget.texture,
            
            // _self.f1materials.setupMaterial(_self.theHelmetMaterial);




            // position 3D
            if(_self.isHelmet) {  
                _self.theHelmet.scale.set(22,22,22);
                _self.theHelmet.position.set(0,10,0); // helmet
            }
            else {
//                _self.theHelmet.scale.set(0.5,0.5,0.5); // orig model
                _self.theHelmet.scale.set(18,18,18); // split
                _self.theHelmet.position.set(0,20,-20); // 

            }
        }, undefined, function ( error ) {
        
            console.error( error );
        
        } );
    }
    //======================



    //======================

}

export { F1CarHelmet };


