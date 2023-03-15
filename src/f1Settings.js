import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {
    constructor() {
        this.tonemappingtype = THREE.ReinhardToneMapping;

        this.mainLight1Intensity = 0.3;
        this.mainLight2Intensity = 0.3;

        this.spotLight1Intensity = 0.5;
        this.spotLight2Intensity = 0.5;


        this.dirLight1Intensity = 2.0;// 2.3;
        this.dirLight2Intensity = 2.0;//2.3;

        this.ambientLightIntensity = 0.3;

        this.tonemappingamount = 2.6; // 1.5; strange, everythings gone dark!

        this.envStrenghtCustom = 2.5;
        this.envStrengthStatic = 4.0;
        this.envStrengthGarage = 2.0;
        this.envStrengthPlinthSides = 1.5;

        this.envStrengthVisor = 5.0;
    }
}
export const f1Settings = new F1Settings();



