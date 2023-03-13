import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {
    constructor() {
        this.tonemappingtype = THREE.ReinhardToneMapping;

        this.mainLight1Intensity = 0.5;
        this.mainLight2Intensity = 0.5;

        this.spotLight1Intensity = 0.7;
        this.spotLight2Intensity = 0.7;


        this.dirLight1Intensity = 1.8;// 2.3;
        this.dirLight2Intensity = 1.8;//2.3;

        this.ambientLightIntensity = 0.3;

        this.tonemappingamount = 1.5;

        this.envStrenghtCustom = 3.0;
        this.envStrengthStatic = 3.0;
        this.envStrengthGarage = 3.0;
        this.envStrengthPlinthSides = 2.0;

        this.envStrengthVisor = 5.0;
    }
}
export const f1Settings = new F1Settings();



