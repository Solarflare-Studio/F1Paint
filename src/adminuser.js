import * as THREE from '../node_modules/three/build/three.module.js';

export let DEBUG_MODE = false;

var lightHelper=0;

export function createLightHelper(light, type,scene) {
    if(lightHelper!=0)
        scene.remove(lightHelper);

    if(type==0)
        lightHelper = new THREE.DirectionalLightHelper(light, 5);
        else if(type==1)
        lightHelper = new THREE.PointLightHelper(light);
    else if(type==2)
        lightHelper = new THREE.SpotLightHelper(light);

    return lightHelper;
}
