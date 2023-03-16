

class F1AssetFileNames {

    constructor() {
        // this.car_files = [ './assets/car/F1PS_F1_Car_V03_NewUV.glb',            // 3d model glb
        this.car_files = [ './assets/car/F1PS_F1_Car_V10.glb',            // 3d model glb
                            './assets/textures/smallblackimage.jpg',     // customisable base colour map
                            './assets/car/00_CustomMainMaps/V10/F1PS_Car_Custom_V10_Normal.jpg',        // customisable normal
                            './assets/car/00_CustomMainMaps/V10/F1PS_Car_Custom_V10_AO.jpg',            // customisable ao
                            './assets/car/00_CustomMainMaps/V10/F1PS_Car_Custom_V10_Metal.jpg',         // customisable metal
                            './assets/car/00_CustomMainMaps/V10/F1PS_Car_Custom_V10_Roughness.jpg',     // customisable rough
                            './assets/car/01_StaticMainMaps/V10/2K/F1PS_Car_Static_V10_2k_BaseColor.jpg',      // static base map always stays the same
                            './assets/car/01_StaticMainMaps/V10/1k/F1PS_Car_Static_V10_1k_Normal.jpg',         // static base normal
                            './assets/car/01_StaticMainMaps/V10/1k/F1PS_Car_Static_V10_1k_AO.jpg',             // static base ao
                            './assets/car/01_StaticMainMaps/V10/1k/F1PS_Car_Static_V10_1k_Metal.jpg',          // static base metal
                            './assets/car/01_StaticMainMaps/V10/1k/F1PS_Car_Static_V10_1k_Roughness.jpg'   ];  // static base rough


        this.helmet_files = [ './assets/helmet/F1PS_Helmet_V03.glb',                // 3d model glb
                                './assets/helmet/Helmet_BaseColor.png',         // customisable base colour map
                                './assets/helmet/Helmet Triangulated_Normal.png',
                                './assets/helmet/Helmet Triangulated_AO.png',
                                './assets/helmet/Helmet Triangulated_Metal.png',
                                './assets/helmet/Helmet Triangulated_Roughness.png'   ];

    }


}

export { F1AssetFileNames };
