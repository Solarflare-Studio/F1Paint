import * as THREE from '../node_modules/three/build/three.module.js';

class F1Settings {
    constructor() {
        this.tonemappingtype = THREE.ReinhardToneMapping;

        this.mainLight1Intensity = 1.3;
        this.mainLight2Intensity = 1.0;

        this.dirLight1Intensity = 0.65;// 2.3;
        this.dirLight2Intensity = 0.65;//2.3;

        this.ambientLightIntensity = 0.5;

        this.tonemappingamount = 1.5;

        this.envStrenghtCustom = 6.0;
        this.envStrengthStatic = 4.5;
        this.envStrengthGarage = 3.5;

        this.envStrengthVisor = 5.0;
    }
}
export const f1Settings = new F1Settings();



