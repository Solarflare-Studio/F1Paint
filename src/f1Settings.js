import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {


    constructor() {
        this.init();
    }
    init() {
        var _self = this;

        this.mainLight1Intensity = 1.3;
        this.mainLight2Intensity = 1.3;

        this.dirLight1Intensity = 2.3;
        this.dirLight2Intensity = 2.3;

        this.ambientLightIntensity = 1.0;

        this.tonemappingtype = THREE.ReinhardToneMapping;
        this.tonemappingamount = 1.5;

        this.envcarintensity = 5.5;
        this.envcarbaseintensity = 25;
        this.envgarageintensity = 2.5;


        
    }
    //======================



    //======================

}

export { F1Settings };


