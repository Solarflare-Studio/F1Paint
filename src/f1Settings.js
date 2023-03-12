import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {
    constructor() {
        this.tonemappingtype = THREE.ReinhardToneMapping;

        this.mainLight1Intensity = 1.0;
        this.mainLight2Intensity = 1.0;

        this.spotLight1Intensity = 1.4;
        this.spotLight2Intensity = 1.4;


        this.dirLight1Intensity = 2.2;// 2.3;
        this.dirLight2Intensity = 2.2;//2.3;

        this.ambientLightIntensity = 0.5;

        this.tonemappingamount = 1.6;

        this.envStrenghtCustom = 6.0;
        this.envStrengthStatic = 5.0;
        this.envStrengthGarage = 3.5;
        this.envStrengthPlinthSides = 2.0;

        this.envStrengthVisor = 5.0;
    }
}
export const f1Settings = new F1Settings();



