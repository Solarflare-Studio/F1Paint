import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {


    constructor() {
        this.init();
    }
    init() {
        var _self = this;
        this.tonemappingtype = THREE.ReinhardToneMapping;

        this.mainLight1Intensity = 1.3;
        this.mainLight2Intensity = 1.0;

        this.dirLight1Intensity = 0.65;// 2.3;
        this.dirLight2Intensity = 0.65;//2.3;

        this.ambientLightIntensity = 0.5;

        this.tonemappingamount = 1.5;

        this.envcarintensity = 6.0;
        this.envcarbaseintensity = 1.0;
        this.envgarageintensity = 1.5;


        
    }
    //======================



    //======================

}

export { F1Settings };


