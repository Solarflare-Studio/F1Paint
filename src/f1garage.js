import * as THREE from '../node_modules/three/build/three.module.js';



class F1Garage {


    constructor() {
        this.init();
    }
    init() {
        this.planeGeometry = new THREE.PlaneGeometry(1024,1024);

        var _self = this;
        // this.garageWall = 0;

        this.garageRoot = new THREE.Object3D();
        this.garageMaterial = this.newGarageMat();
        this.garageMaterial.color = new THREE.Color( 0x323232)
        // this.garageMaterial.color = new THREE.Color( 0x181818)

        this.backgroundImage = 0;
        this.backgroundMat =  new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide, // render both front and back faces
            // depthWrite: false, // disable writing to depth buffer
            // depthTest: false, // disable depth testing
            name: 'scene background',
        });
        this.plinthSidesMat = this.newGarageMat();
        this.plinthSidesMat.color = new THREE.Color( 0x322020)
        this.plinthSidesMat.needsUpdate = true;



        this.garageMaterial.needsUpdate = true;


        // let garagePlinthSideMaterial = f1materials.newGarageMat();
        // garagePlinthSideMaterial.color = new THREE.Color(0x5f0505);
        this.garageShaderMaterial();


        let garageFloor = new THREE.Mesh( new THREE.CircleGeometry( 80, 32 ), this.garageMaterial );
        let garageFloorSFX = new THREE.Mesh( new THREE.CircleGeometry( 80, 32 ), this.garageSFXMaterial );
        let garageFloorSides = new THREE.Mesh( new THREE.CylinderGeometry( 80, 80, 10, 32, 1, true ), this.garageMaterial);//plinthSidesMat );
        garageFloorSides.layers.set(3);
        // garageFloorSides.position.set(0,-5,0);
        garageFloorSides.position.set(0,-5.9,0);


        garageFloorSFX.layers.set(3); // try on glow layer
        // garageFloorSFX.layers.set(1); // not glow layer
        garageFloorSFX.rotateX((Math.PI / 180)*-90);
//        garageFloorSFX.position.set(0,.2,0);
        garageFloorSFX.position.set(0,-.2,0);


        garageFloor.layers.set(1);
        garageFloor.rotateX((Math.PI / 180)*-90);
        garageFloor.receiveShadow = false;

        // garageFloor.add(garageFloorSides);

        this.garageRoot.add(garageFloor);
        this.garageRoot.add(garageFloorSides);

        // this.garageRoot.add(garageFloorSFX);




        this.garageRoot.position.set(0,20,-20);

        
        // and shadow layer
        const shadowmaterial = new THREE.ShadowMaterial();
        shadowmaterial.opacity = 0.4;// 0.34;
        shadowmaterial.side = THREE.DoubleSide;
        shadowmaterial.transparent = true;
        shadowmaterial.needsUpdate=true;

        let garageFloorShadow = new THREE.Mesh( new THREE.PlaneGeometry(512,512), shadowmaterial );
        // let garageFloorShadow = new THREE.Mesh( this.planeGeometry, new THREE.MeshBasicMaterial({color:new THREE.Color(0xff00ff),side:THREE.DoubleSide}) );

        garageFloorShadow.position.set(0.0,0.05,0.0);
        // garageFloorShadow.scale.set(0.5,1,0.5);
        

        garageFloorShadow.layers.set(1);
        garageFloorShadow.scale.set(0.5,0.5,0.5);
        // garageFloorShadow.scale.set(0.5,0.5,0.5);
        garageFloorShadow.rotateX((Math.PI / 180)*90);
        garageFloorShadow.receiveShadow = true;
        this.garageRoot.add(garageFloorShadow);
    }

    //======================
    newGarageMat() {
        return new THREE.MeshStandardMaterial(
            {
                name: 'garagenewMaterial',
                fog: false,
                metalness: 0.5,
                envMapIntensity: 1.0,
                roughness: 0.8,
                emissiveIntensity: 1,
                aoMapIntensity: 1.0,

                side: THREE.FrontSide,
                transparent: true,
                normalScale: new THREE.Vector2(-0.2, 0.2),

                depthTest: true,
                depthWrite: false, // try
            }
        );
    }
    //======================

    garageShaderMaterial() {
        this.uniforms = {
            texture1: { value: 0 },  // base pattern
            fTime: { value: 0.0},
            offset_y: { value: 0.0},
            offset_x: { value: 0.0},
            tot_x: { value: 0.0},
            tot_y: { value: 0.0},
          };
  
        this.garageSFXMaterial = new THREE.ShaderMaterial({
            name: 'garageFloorSFMaterial',

            uniforms: this.uniforms,
            vertexShader: `
            varying vec2 vUv;
            varying float viewerDistance;

            void main() {
                vUv = uv;
                vec3 pos = position;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
              
                // Calculate distance from camera
                // viewerDistance = length(mvPosition.xyz);    // not currently used
            }
            `,
            fragmentShader: `


//==================================================================
uniform sampler2D texture1;
varying vec2 vUv;
uniform float fTime;
uniform float offset_x;
uniform float offset_y;

uniform float tot_x;
uniform float tot_y;


void main() {
    float timer = fTime / 5.0;
    vec2 uv = vUv.xy;
    vec4 colour = texture2D(texture1, uv);
    float g = colour.g;
    
    // colour = vec4(g*0.15,g*0.15,g*0.15, 1.0);
    float alpha = 0.0;
    colour = vec4(0,0,0,0);


    float hexagon_width = 1.0 / (35.8+tot_x);
    float hexagon_height = 1.0 / (31.59 + tot_y);

    float margin_x = 0.33 * hexagon_width;
    float margin_y = 0.13 * hexagon_height;


    float moffset_x = (-0.6 + offset_x) * hexagon_width;
    float moffset_y = (-0.3 + offset_y) * hexagon_height;
    
    float t = timer;
    int column = int(t * (31.59 + tot_y));
    int row = int(t * (35.32 + tot_x));

    // detect

    // // detect if in hexagon
    if(int((uv.y+moffset_y) / hexagon_height) == column) {
        colour = vec4(g, 0, 0, g);
        alpha = g;
    }
    if(int((uv.x+moffset_x) / hexagon_width) == row) {
        colour = vec4(0, g, g, g);
        alpha = g;
    }

    // // Adding the margin to the hexagon
    if (int((uv.y + moffset_y + margin_y) / hexagon_height) == column) {
        colour = vec4(g, 0, 0, g);
        alpha = g;
    }
    if (int((uv.x + moffset_x + margin_x) / hexagon_width) == row) {
        colour = vec4(0, g, g, g);
        alpha = g;
    }

    gl_FragColor = vec4(colour.rgb, alpha);
}


//==================================================================          
/*
for (int y = 0; y < num_rows; y++) {
    for (int x = 0; x < num_cols; x++) {
      // Compute the position of the hexagon
      float hex_x = tx + x * sx * 3.0 + (y % 2) * sx * 1.5;
      float hex_y = ty + y * sy * 2.0;
  
      // Apply the shader to color the hexagon
      colorHexagon(hex_x, hex_y);
    }
  }
  */

/*
uniform sampler2D texture1;
varying vec2 vUv;
uniform float fTime;
void main() {
    vec2 uv = vUv.xy;
    vec4 colour = texture2D(texture1, uv);
    float g = colour.g;
    
    colour = vec4(0, 0, 0, 0);

    float size_y = 1.0 / 31.9;
    float size_x = 1.0 / 35.8;

    float offset_x = 0.5;
    float offset_y = 0.5;

    if( uv.x >= offset_x-size_x && uv.x <= offset_x+size_x ) {
        if( uv.y >= offset_y-size_x && uv.y <= offset_y+size_y ) {
            colour = vec4(g,0,0,g);
        }
    }
    
    gl_FragColor = vec4(colour.rgb, 1.0);
}
*/
/*

void main() {
    vec2 uv = vUv.xy;
    vec4 colour = texture2D(texture1, uv);
    float g = colour.g;

    float sx = 0.0187;
    float sy = 0.017;

    float x5 = sx * 3.0;
    float y5 = sy * 3.0;

    float tx = 0.335;
    float ty = 0.308;

    float tx5 = tx - x5;
    float ty5 = ty;

    float dist = abs(uv.x - tx);
    float hexWidth = sx * 2.0;
    float hexSpacing = sx;
    float hexesPerRow = 10.0;
    float hexRowOffset = 0.5 * hexWidth;

    if (dist < hexWidth * 0.5) {
        colour = vec4(g, 0.0, 0.0, g);
    } else if (dist > (hexesPerRow * hexWidth + (hexesPerRow - 1.0) * hexSpacing) - hexWidth * 0.5) {
        colour = vec4(g * 0.27, g, g, g);
    } else {
        float rowOffset = mod(floor((uv.y + ty) / (sy * 2.0)), 2.0) * hexRowOffset;
        float hexOffset = mod(floor((uv.x - tx - rowOffset) / (hexWidth + hexSpacing)), hexesPerRow);
        float start = tx + hexOffset * (hexWidth + hexSpacing) + rowOffset;
        float end = start + hexWidth;

        float t = clamp((fTime / 2.0 - start) / (end - start), 0.0, 1.0);
        colour = mix(vec4(0.0), vec4(g), t);
    }

    gl_FragColor = vec4(colour.rgb * g, g);
}

*/

/*
void main() {
    vec2 uv = vUv.xy;
    vec4 colour = texture2D(texture1, uv);
    float g = colour.g;

    float sx = 0.0187;
    float sy = 0.017;

    float x5 = sx * 3.0;
    float y5 = sy * 3.0;

    float tx = 0.335;
    float ty = 0.308;

    float tx5 = tx - x5;
    float ty5 = ty;

    colour = vec4(0, 0, 0, 0);
    
    if(uv.x >= tx-sx && uv.x <= tx+sx && uv.y >= ty-sy && uv.y <= ty+sy )
        colour = vec4(g,0,0,g);
    else
    if(uv.x >= tx5-sx && uv.x <= tx5+sx && uv.y >= ty5-sy && uv.y <= ty5+sy )
        colour = vec4(g*0.27,g,g,g);

    gl_FragColor = vec4(colour.rgb, 1.0);
}
*/
/*
uniform sampler2D texture1;
varying vec2 vUv;
uniform float fTime;

void main() {
    vec2 uv = vUv.xy;
    vec4 colour = texture2D(texture1, uv);
    float g = colour.g;

    float sx = 0.0187;
    float sy = 0.017;

    float x5 = sx * 3.0;
    float y5 = sy * 3.0;

    float tx = 0.335;
    float ty = 0.308;

    float tx5 = tx - x5;
    float ty5 = ty;

    // Calculate the index of the current hexagon based on fTime
    float timeIndex = mod(fTime * 0.1, 4.0); // Assuming 2 seconds for a full cycle
    int hexagonIndex = int(floor(timeIndex * 16.0)); // Assuming 16 hexagons in the grid

    // Calculate the coordinates of the hexagon based on its index
    float hexagonX = mod(float(hexagonIndex), 4.0) * (sx * 4.0) + tx - (sx * 4.0);
    float hexagonY = floor(float(hexagonIndex) / 4.0) * (sy * 4.0) + ty - (sy * 4.0);

    colour = vec4(0, 0, 0, 0);
    
    // Check if the current pixel is within the current hexagon
    if (uv.x >= hexagonX - sx && uv.x <= hexagonX + sx && uv.y >= hexagonY - sy && uv.y <= hexagonY + sy) {
        colour = vec4(g, 0, 0, g);
    } else if (uv.x >= tx5 - sx && uv.x <= tx5 + sx && uv.y >= ty5 - sy && uv.y <= ty5 + sy) {
        colour = vec4(g * 0.27, g, g, g);
    }

    gl_FragColor = vec4(colour.rgb, 1.0);
}

*/


/*
            varying vec2 vUv;
            uniform float fTime;

            void main() {

                vec2 uv = vUv.xy;
                vec4 colour = texture2D(texture1, uv);

                float g = colour.g;// *0.5;

                float sx = 0.0187;
                float sy = 0.017;

                float x5 = sx * 3.0;
                float y5 = sy * 3.0;


                float tx = 0.335;
                float ty = 0.308;

                float tx5 = tx - x5;
                float ty5 = ty;


                colour = vec4(0,0,0,0);
                
                if(uv.x >= tx-sx && uv.x <= tx+sx && uv.y >= ty-sy && uv.y <= ty+sy )
                    colour = vec4(g,0,0,g);
                else
                if(uv.x >= tx5-sx && uv.x <= tx5+sx && uv.y >= ty5-sy && uv.y <= ty5+sy )
                    colour = vec4(g*0.27,g,g,g);

                    //
                // colour = vec4(1,1,1,1);
                // colour = vec4(g*0.27,g,g,g);

                colour.r = sin(fTime);

                gl_FragColor = vec4(colour);
      
            }*/
            `,
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            // alphaTest: 0.1,
          depthWrite: false, // disable writing to depth buffer
          depthTest: true, // disable depth testing            


        //     side: THREE.FrontSide,
        //     transparent: false,
        //     blending: THREE.CustomBlending,
        //     blendEquation: THREE.AddEquation,
        //     blendSrc: THREE.SrcAlphaFactor,
        //     blendDst: THREE.OneMinusSrcAlphaFactor,
        //     alphaTest: 0.1,
        //   depthWrite: false, // disable writing to depth buffer
        //   depthTest: true, // disable depth testing            
        });
    }



    //======================

}

export { F1Garage };


