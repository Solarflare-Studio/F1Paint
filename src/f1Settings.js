import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {
    constructor() {
        this.tonemappingtype = THREE.ReinhardToneMapping;

        this.mainLight1Intensity = 0.6;
        this.mainLight2Intensity = 0.6;

        this.spotLight1Intensity = 0.9;
        this.spotLight2Intensity = 0.9;


        this.dirLight1Intensity = 2.4;// 2.3;
        this.dirLight2Intensity = 2.4;//2.3;

        this.ambientLightIntensity = 0.5;

        this.tonemappingamount = 1.5;

        this.envStrenghtCustom = 6.0;
        this.envStrengthStatic = 5.0;
        this.envStrengthGarage = 3.5;
        this.envStrengthPlinthSides = 1.5;

        this.envStrengthVisor = 5.0;
    }
}
export const f1Settings = new F1Settings();



