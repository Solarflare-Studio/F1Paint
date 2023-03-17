

class F1AssetFileNames {

    constructor() {
        // this.car_files = [ './assets/car/F1PS_F1_Car_V03_NewUV.glb',            // 3d model glb
        this.car_files = [ './assets/car/F1PS_F1_Car_V11.glb',            // 3d model glb
                            './assets/textures/smallblackimage.jpg',     // customisable base colour map
                            './assets/car/00_CustomMainMaps/V10/F1PS_Car_Custom_V10_Normal.jpg',        // customisable normal
                            './assets/car/00_CustomMainMaps/V10/F1PS_Car_Custom_V10_AO.jpg',            // customisable ao
                            './assets/car/00_CustomMainMaps/V10/notused',         // customisable metal
                            './assets/car/00_CustomMainMaps/V10/notused',     // customisable rough
                            './assets/car/01_StaticMainMaps/V11/1k/F1PS_Car_Static_V11_BaseColor.jpg',      // static base map always stays the same
                            './assets/car/01_StaticMainMaps/V11/F1PS_Car_Static_V11_Normal.jpg',         // static base normal
                            './assets/car/01_StaticMainMaps/V11/F1PS_Car_Static_V11_AO.jpg',             // static base ao
                            './assets/car/01_StaticMainMaps/V11/F1PS_Car_Static_V11_Metal.jpg',          // static base metal
                            './assets/car/01_StaticMainMaps/V11/F1PS_Car_Static_V11_Roughness.jpg'   ];  // static base rough

        this.helmet_files = [ './assets/helmet/F1PS_Helmet_V07.glb',                // 3d model glb
                                './assets/textures/smallblackimage.jpg',         // customisable base colour map
                                './assets/helmet/old/Helmet Triangulated_Normal.png',
                                './assets/helmet/old/Helmet Triangulated_AO.png',
                                './assets/helmet/old/Helmet Triangulated_Metal.png',
                                './assets/helmet/old/Helmet Triangulated_Roughness.png'   ];

    }


}

export { F1AssetFileNames };
