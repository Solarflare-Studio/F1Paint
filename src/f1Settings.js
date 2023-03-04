import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {


    constructor() {
        this.init();
    }
    init() {
        var _self = this;

        this.mainLight1Intensity = 1.3;
        this.mainLight2Intensity = 1.3;

        this.dirLight1Intensity = 1.5;// 2.3;
        this.dirLight2Intensity = 1.5;//2.3;

        this.ambientLightIntensity = 1.0;

        this.tonemappingtype = THREE.ReinhardToneMapping;
        this.tonemappingamount = 1.5;

        this.envcarintensity = 7.0;
        this.envcarbaseintensity = 5.0;
        this.envgarageintensity = 2.5;


        
    }
    //======================



    //======================

}

export { F1Settings };


