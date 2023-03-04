import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {


    constructor() {
        this.init();
    }
    init() {
        var _self = this;

        this.mainLight1Intensity = 1.9;
        this.mainLight2Intensity = 1.0;

        this.dirLight1Intensity = 0.85;// 2.3;
        this.dirLight2Intensity = 0.8;//2.3;

        this.ambientLightIntensity = 1.0;

        this.tonemappingtype = THREE.ReinhardToneMapping;
        this.tonemappingamount = 1.8;

        this.envcarintensity = 6.0;
        this.envcarbaseintensity = 4.0;
        this.envgarageintensity = 1.5;


        
    }
    //======================



    //======================

}

export { F1Settings };


