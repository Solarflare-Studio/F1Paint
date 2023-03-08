import * as THREE from '../node_modules/three/build/three.module.js';



class F1Garage {


    constructor(f1materials) {
        this.init(f1materials);
    }
    init(f1materials) {
        this.planeGeometry = new THREE.PlaneGeometry(1024,1024);

        this.f1materials = f1materials;
        var _self = this;
        // this.garageWall = 0;

        this.garageRoot = new THREE.Object3D();
        this.garageMaterial = f1materials.newGarageMat();
        this.garageMaterial.color = new THREE.Color( 0x323232)
        // this.garageMaterial.color = new THREE.Color( 0x181818)

        this.backgroundImage = 0;
        this.backgroundMat =  new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide, // render both front and back faces
            // depthWrite: false, // disable writing to depth buffer
            // depthTest: false, // disable depth testing
            name: 'scene background',
        });

        // _self.f1materials.loadMaps(_self.garageMaterial, 
        //     './assets/garage/whitefloor.jpg',// './assets/garage/concretetiles.jpg',//             './assets/garage/floor.jpg',
        //     null,
        //     null,//'./assets/garage/groundnormals.jpg',
        //     null,
        //     null,
        //     './assets/garage/concretetiles.jpg',
        //     null,_self.f1Gui);



        this.garageMaterial.needsUpdate = true;
/*

        let garagetexture = new THREE.TextureLoader().load(baseMap, (tex) => {
            tex.encoding = THREE.LinearEncoding;
            this.garageMaterial.map = tex;
            this.garageMaterial.normalMap = tex;
            this.garageMaterial.color = new THREE.Color(0.21,0.2,0.2);
            this.garageMaterial.envMap = envMap;
            this.garageMaterial.normalScale = new THREE.Vector2(-0.15, 0.15)
    
            this.garageMaterial.needsUpdate = true;
    

        })
  */  

        // walls
        // this.garageWall = new THREE.Mesh( this.planeGeometry, f1materials.newGarageMat() );
        // _self.f1materials.loadMaps(this.garageWall.material, 
        //     './assets/garage/walls.jpg',
        //     null, //'./assets/garage/wall_lights.jpg',
        //     null,//'./assets/garage/groundnormals.jpg',
        //     null,
        //     null,
        //     null,
        //     null,_self.f1Gui);

        // this.garageWall.layers.set(1);
//        garageWall.rotateX((Math.PI / 180)*90);
        // this.garageWall.rotateZ((Math.PI / 180)*180);
        // this.garageWall.scale.set(0.5,0.5,0.5);

        // garageWall.position.x = -10;
        // garageWall.position.y = -10;
        // this.garageWall.receiveShadow = false;

        // const morewalls = this.garageWall.clone();
        // morewalls.rotateY((Math.PI / 180)*90);
        // morewalls.position.x = -250;
        // this.garageRoot.add(morewalls);

        // const morewallsR = this.garageWall.clone();
        // morewallsR.rotateY((Math.PI / 180)*90);
        // morewallsR.position.x = 250;
        // this.garageRoot.add(morewallsR);

        // const morewallsF = this.garageWall.clone();
        // morewallsF.position.z = 250;
        // this.garageRoot.add(morewallsF);



        // this.garageWall.position.z = -250;




        // this.garageRoot.add(this.garageWall);




        // let garageFloor = new THREE.Mesh( new THREE.CircleGeometry( 350, 32 ), this.garageMaterial );
        let garageFloor = new THREE.Mesh( new THREE.CircleGeometry( 160, 32 ), this.garageMaterial );
        garageFloor.layers.set(1);
        garageFloor.rotateX((Math.PI / 180)*90);
        garageFloor.scale.set(0.5,0.5,0.5);

        garageFloor.receiveShadow = false;
        this.garageRoot.add(garageFloor);

        this.garageRoot.position.set(0,20,-20);

        
        // and shadow layer
        const shadowmaterial = new THREE.ShadowMaterial();
        shadowmaterial.opacity = 0.4;// 0.34;
        shadowmaterial.side = THREE.DoubleSide;
        shadowmaterial.transparent = true;
        shadowmaterial.needsUpdate=true;

        let garageFloorShadow = new THREE.Mesh( new THREE.PlaneGeometry(512,512), shadowmaterial );
        // let garageFloorShadow = new THREE.Mesh( this.planeGeometry, new THREE.MeshBasicMaterial({color:new THREE.Color(0xff00ff),side:THREE.DoubleSide}) );

        garageFloorShadow.position.set(0.0,0.05,0.0);
        // garageFloorShadow.scale.set(0.5,1,0.5);
        

        garageFloorShadow.layers.set(1);
        garageFloorShadow.scale.set(0.5,0.5,0.5);
        // garageFloorShadow.scale.set(0.5,0.5,0.5);
        garageFloorShadow.rotateX((Math.PI / 180)*90);
        garageFloorShadow.receiveShadow = true;
        this.garageRoot.add(garageFloorShadow);
    }
    //======================



    //======================

}

export { F1Garage };


