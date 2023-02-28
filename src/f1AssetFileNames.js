

class F1AssetFileNames {

    constructor() {
        // this.car_files = [ './assets/car/F1PS_F1_Car_V03_NewUV.glb',            // 3d model glb
        this.car_files = [ './assets/car/F1PS_F1_Car_V05_Split.glb',            // 3d model glb
                            './assets/car/F1PS_F1_V03_NewUV_BaseColor.png',     // customisable base colour map
                            './assets/car/F1PS_F1_V03_NewUV_Normal.jpg',        // customisable normal
                            './assets/car/F1PS_F1_V03_NewUV_AO.png',            // customisable ao
                            './assets/car/MetalRough.png',         // customisable metal
                            './assets/car/MetalRough.png',     // customisable rough
                            './assets/car/static/V04/F1PS_F1_V04_NewUV_BaseColor.jpg',      // static base map always stays the same
                            './assets/car/static/V04/F1PS_F1_V04_NewUV_Normal.jpg',         // static base normal
                            './assets/car/static/V04/F1PS_F1_V04_NewUV_AO.jpg',             // static base ao
                            './assets/car/static/V04/F1PS_F1_V04_NewUV_Metal.jpg',          // static base metal
                            './assets/car/static/V04/F1PS_F1_V04_NewUV_Roughness.jpg'   ];  // static base rough

        this.helmet_files = [ './assets/helmet/F1PS_Helmet.glb',                // 3d model glb
                                './assets/helmet/Helmet_BaseColor.png',         // customisable base colour map
                                './assets/helmet/Helmet Triangulated_Normal.png',
                                './assets/helmet/Helmet Triangulated_AO.png',
                                './assets/helmet/Helmet Triangulated_Metal.png',
                                './assets/helmet/Helmet Triangulated_Roughness.png'   ];

    }


}

export { F1AssetFileNames };
