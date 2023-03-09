

class F1AssetFileNames {

    constructor() {
        // this.car_files = [ './assets/car/F1PS_F1_Car_V03_NewUV.glb',            // 3d model glb
        this.car_files = [ './assets/car/F1PS_F1_Car_V09.glb',            // 3d model glb
                            './assets/textures/smallblackimage.jpg',     // customisable base colour map
                            './assets/car/custom/F1PS_Car_Custom_V08_Normal.jpg',        // customisable normal
                            './assets/car/custom/F1PS_Car_Custom_V08_AO.jpg',            // customisable ao
                            './assets/car/custom/F1PS_Car_Custom_V08_Metal.jpg',         // customisable metal
                            './assets/car/custom/F1PS_Car_Custom_V08_Roughness.jpg',     // customisable rough
                            './assets/car/static/F1PS_Car_Custom_V07_BaseColor.jpg',      // static base map always stays the same
                            './assets/car/static/F1PS_Car_Custom_V07_Normal.jpg',         // static base normal
                            './assets/car/static/F1PS_Car_Custom_V07_AO.jpg',             // static base ao
                            './assets/car/static/F1PS_Car_Custom_V07_Metal.jpg',          // static base metal
                            './assets/car/static/F1PS_Car_Custom_V07_Roughness.jpg'   ];  // static base rough

        this.helmet_files = [ './assets/helmet/F1PS_Helmet_V03.glb',                // 3d model glb
                                './assets/helmet/Helmet_BaseColor.png',         // customisable base colour map
                                './assets/helmet/Helmet Triangulated_Normal.png',
                                './assets/helmet/Helmet Triangulated_AO.png',
                                './assets/helmet/Helmet Triangulated_Metal.png',
                                './assets/helmet/Helmet Triangulated_Roughness.png'   ];

    }


}

export { F1AssetFileNames };
