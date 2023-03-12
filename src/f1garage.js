import * as THREE from '../node_modules/three/build/three.module.js';
import { TWEEN } from '../node_modules/three/examples/jsm/libs/tween.module.min'



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
        // this.garageMaterial.color = new THREE.Color( 0x323232)
        this.garageMaterial.color = new THREE.Color( 0xd0d0d0)

        this.backgroundImage = 0;
        this.backgroundMat =  new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide, // render both front and back faces
            // depthWrite: false, // disable writing to depth buffer
            // depthTest: false, // disable depth testing
            name: 'scene background',
        });
        this.plinthSidesMat = this.newGarageMat();
        // this.plinthSidesMat.color = new THREE.Color( 0x322020)
        this.plinthSidesMat.color = new THREE.Color( 0x727272);
        this.plinthSidesMat.transparent = false;

        this.plinthSidesMat.needsUpdate = true;



        this.garageMaterial.needsUpdate = true;


        // let garagePlinthSideMaterial = f1materials.newGarageMat();
        // garagePlinthSideMaterial.color = new THREE.Color(0x5f0505);
        this.garageShaderMaterial();


        let garageFloor = new THREE.Mesh( new THREE.CircleGeometry( 80, 32 ), this.garageMaterial );
        let garageFloorSFX = new THREE.Mesh( new THREE.CircleGeometry( 80, 32 ), this.garageSFXMaterial );
        let garageFloorSides = new THREE.Mesh( new THREE.CylinderGeometry( 80, 80, 10, 32, 1, true ), this.plinthSidesMat );
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
        garageFloor.receiveShadow = true;

        
        // debug new floor
        this.garageRoot.add(garageFloor);


        this.garageRoot.add(garageFloorSides);

        this.garageRoot.add(garageFloorSFX);




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

        this.floorMode = 0;
    }
    //======================
    startFloorMode(v) {
        this.floorMode = v;
        this.garageSFXMaterial.uniforms.mode.value = v;
        this.garageSFXMaterial.uniforms.fTime.value = 0.;
        var self = this;
        if(this.floorMode == 1) { // intro floor
            new TWEEN.Tween(self.garageSFXMaterial.uniforms.fTime)
            .to({
                    value: 1.0,
                },
                5000
            )
            .onComplete(function () {
                self.floorMode = 0;
                self.garageSFXMaterial.uniforms.fTime.value = 0.0;
            })        
            .start()
        }
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
            scale_x: { value: 1.0},
            scale_y: { value: 1.0},
            mode: {value: 0 },
          };
  
        this.garageSFXMaterial = new THREE.ShaderMaterial({
            name: 'garageFloorSFMaterial',

            uniforms: this.uniforms,
            vertexShader: `

            attribute vec4 tangent;

            varying vec2 vUv;
            varying float viewerDistance;
            varying vec3 vViewDirTangent;

            void main() {
                vUv = uv;
                vec3 vNormal = normalMatrix * normal;
                vec3 vTangent = normalMatrix * tangent.xyz;
                vec3 vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
            
                mat3 mTBN = transpose(mat3(vTangent, vBitangent, vNormal));

                vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );
                vec3 viewDir = -mvPos.xyz;
                vViewDirTangent = mTBN * viewDir;
            
                gl_Position = projectionMatrix * mvPos;


/*                vec3 pos = position;


                vec4 worldPosition = modelViewMatrix * vec4(pos, 1.0);
                vWorldPosition = worldPosition.xyz;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
*/

                // vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                // gl_Position = projectionMatrix * mvPosition;
              
                // Calculate distance from camera
                // viewerDistance = length(mvPosition.xyz);    // not currently used
            }
            `,
            fragmentShader: `


//==================================================================
uniform sampler2D texture1;
varying vec2 vUv;
uniform float fTime;
uniform int mode;
uniform float offset_x;
uniform float offset_y;

uniform float tot_x;
uniform float tot_y;

uniform float scale_x;
uniform float scale_y;

varying vec3 vViewDirTangent;

float hash21(vec2 p)
{
    return fract(sin(dot(p, vec2(141.13, 289.97)))*43758.5453);
}

float hex(in vec2 p)
{
    const vec2 s = vec2(1.7320508, 1);

    p = abs(p);    
    return max(dot(p, s*.5), p.y); // Hexagon.
}
struct HexInfo {
    vec2 xy;
    float row;
    float column;
    int oddRow;
    int oddColumn;
};

HexInfo getHex(vec2 p)
{    
    const vec2 s = vec2(1.7320508, 1);

    HexInfo hi;
    // The hexagon centers: Two sets of repeat hexagons are required to fill in the space, and
    // the two sets are stored in a "vec4" in order to group some calculations together. The hexagon
    // center we'll eventually use will depend upon which is closest to the current point. Since 
    // the central hexagon point is unique, it doubles as the unique hexagon ID.
    
    vec4 hC = floor(vec4(p, p - vec2(1, .5))/s.xyxy) + .5;
    
    // Centering the coordinates with the hexagon centers above.
    vec4 h = vec4(p - hC.xy*s, p - (hC.zw + .5)*s);
    hi.xy = h.xy;

    hi.row = h.z;
    hi.column = h.w;


    vec4 result=dot(h.xy, h.xy) < dot(h.zw, h.zw) 
        ? vec4(h.xy, hC.xy) 
        : vec4(h.zw, hC.zw + .5);

    hi.xy = result.xy;
    hi.column = result.z;
    hi.row = result.w;

    hi.oddColumn = 0;
    hi.oddRow = 0;
    return hi;
}

void main()
{
    const vec3 tintBlueCyan = vec3(0.18,.95,.96);
    const vec3 tintDarkPurple = vec3(0.59,.29,.91);
    const vec3 tintRed = vec3(0.91,.04,.03);
    
    const vec2 s = vec2(1.7320508, 1);

    vec2 uv = vUv;
    float vt = fTime; // effect from 0.0 to 1.0

    //
    const vec2 offset = vec2(-0.11, 0.02);
    const vec2 totgridsize = vec2(30.0, 30.0) + vec2(1.05, 1.57);

    vec2 u = uv.xy * totgridsize;
    u += offset + vec2( offset_x,offset_y + 0.03);
    
    HexInfo h = getHex(u*1. + s.yx);
    float eDist = hex(h.xy); // Edge distance.

    vec3 col = vec3(0.0);

    // middle column = 8


    float maxh = totgridsize.y;
    int maxhi = int(maxh) + 1;
    float maxw = totgridsize.x;
    int maxwi = int(maxw) + 1;
    maxh = float(maxhi);
    maxw = 33.0;
    
    const float maxc = 38.0;
    const float maxr = 66.0;

    float tc = vt * maxc;
    float tr = vt * maxr;

    int ci = int(h.column * 2.0);
    int ri = int(h.row * 2.0);
    float cf = float(ci);
    float rf = float(ri);


    vec2 norm = vec2(cf, rf) - vec2(19.0,33.0 );
    norm.x *= 2.0;

    // circle splash
    float radius = 45.0 * vt;
    float dist = length(norm);
    if(dist <= radius) {
        if( dist <= radius - 2.0) {
            if(dist >= radius - 4.0)
                col = tintDarkPurple;
            else {
                if(dist >= radius - 6.0) {
                    col = tintRed;
                }
                else {
                    if(dist >= radius - 10.0) {
                        float calc = (dist - (radius-8.0))/5.0;
                        col = tintRed * (calc);
                    }
                }
            }
        } 
        else {
            dist = (dist-radius) / (2.0);
            col = tintBlueCyan * dist;
        }
    }
    
    



    // if(ci == 19)
    //     col.r = 1.0;

//    if(ri == 64 || ri == 65)
  //      col.r = 1.0;




        // // calculate distance from center of grid
        // vec2 center = vec2(maxwi / 2.0, maxwi / 2.0);
        // float dist = length(vec2(h.column, h.row) - center);

        // if(dist < 3.0)
        //     col.r = 1.0 - (dist / 3.0);

        // // calculate pulse effect based on distance
        // float pulse = smoothstep(0.0, totgridsize.x / 2.0, dist) * (1.0 - smoothstep(totgridsize.x / 2.0, totgridsize.x, dist));
        
        // // calculate color based on pulse effect and edge distance
        // col = vec3(eDist * pulse);

        /*
    vec3 col = mix(vec3(0.), vec3(1), smoothstep(0., .03, eDist - .5 + .04));  
   
    float t = vt * (totgridsize.x - 3.0);
    float opacity = smoothstep(t - 1.0, t + 1.0, h.column);

    if(h.column >= 1.0 + t && h.column < 1.5 + t) {
       col = vec3(1.0*opacity,0,0);
    }
    else {
        col = vec3(0,0,0);
    }
    */

    // most modes just do hex outline by using mask from hex image
    vec4 colour = texture2D(texture1, uv);
    float g = colour.g;

    col *= g;
    col *= 0.5;

    gl_FragColor = vec4(col, .6);
}


/*


void main() {



    float timer = fTime / 5.0;
    vec2 uv = vUv.xy;
    vec4 colour = texture2D(texture1, uv);
    float g = colour.g;

    float hexagon_width = 1.0 / (35.8+tot_x);
    float hexagon_height = 1.0 / (31.59 + tot_y);
    float hexagon_side_length = min(hexagon_width, hexagon_height) / sqrt(3.0);
    
    float moffset_x = (-0.6 + offset_x) * hexagon_width + margin_x;
    float moffset_y = (-0.3 + offset_y) * hexagon_height + margin_y;
    uv.xy += vec2(moffset_x,moffset_y);
    
    float margin_x = scale_x * hexagon_width;
    float margin_y = scale_y * hexagon_height;

    
    // colour = vec4(g*0.15,g*0.15,g*0.15, 1.0);
    float alpha = 0.0;
    colour = vec4(0,0,0,0);

    
    float q = (sqrt(3.0)/3.0 * uv.x - 1.0/3.0 * uv.y) / hexagon_side_length;
    float r = (2.0/3.0 * uv.y) / hexagon_side_length;
    
    // Round the axial coordinates to the nearest integers
    int column = int(q + 0.5);
    int row = int(r + 0.5);
    
    if(row % 2==0 && column % 2==0) {
        colour = vec4(1,0,0,0.25);
    }
    else {
        colour = vec4(0,0,1,0.25);
    }

    
//    else colour = vec4(0,g,0,g);


    gl_FragColor = vec4(colour);
}

*/


/*
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
*/

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



/*

struct HexInfo {
    vec2 xy;
    float row;
    float column;
    int oddRow;
    int oddColumn;
};

HexInfo getHex(vec2 p)
{    
    HexInfo hi;
    // The hexagon centers: Two sets of repeat hexagons are required to fill in the space, and
    // the two sets are stored in a "vec4" in order to group some calculations together. The hexagon
    // center we'll eventually use will depend upon which is closest to the current point. Since 
    // the central hexagon point is unique, it doubles as the unique hexagon ID.
    
    vec4 hC = floor(vec4(p, p - vec2(1, .5))/s.xyxy) + .5;
    
    // Centering the coordinates with the hexagon centers above.
    vec4 h = vec4(p - hC.xy*s, p - (hC.zw + .5)*s);
    hi.xy = h.xy;
    
    vec4 result=dot(h.xy, h.xy) < dot(h.zw, h.zw) 
        ? vec4(h.xy, hC.xy) 
        : vec4(h.zw, hC.zw + .5);

    hi.xy = result.xy;
    
    hi.row = hC.y;
    hi.column = hC.x;
    hi.oddColumn = 0;
    hi.oddRow = 0;
    
    
    if(int(hi.row) % 2 == 0) hi.oddRow = 1;
    if(int(hi.column) % 2 == 0) hi.oddColumn = 1;
    
    return hi;
    
    // Nearest hexagon center (with respect to p) to the current point. In other words, when
    // "h.xy" is zero, we're at the center. We're also returning the corresponding hexagon ID -
    // in the form of the hexagonal central point.
    //
    // On a side note, I sometimes compare hex distances, but I noticed that Iomateron compared
    // the squared Euclidian version, which seems neater, so I've adopted that.
//    return dot(h.xy, h.xy) < dot(h.zw, h.zw) 
//        ? vec4(h.xy, hC.xy) 
//        : vec4(h.zw, hC.zw + .5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Aspect correct screen coordinates.
	vec2 u = (fragCoord - iResolution.xy*.5)/iResolution.y;
    
    // Scaling, translating, then converting it to a hexagonal grid cell coordinate and
    // a unique coordinate ID. The resultant vector contains everything you need to produce a
    // pretty pattern, so what you do from here is up to you.
    HexInfo h = getHex(u*5. + s.yx);
    
    // The beauty of working with hexagonal centers is that the relative edge distance will simply 
    // be the value of the 2D isofield for a hexagon.
    float eDist = hex(h.xy); // Edge distance.

    // Initiate the background to a white color, putting in some dark borders.
    vec3 col = mix(vec3(0.), vec3(1), smoothstep(0., .03, eDist - .5 + .04));  
    
    float d = length(h.xy);
    col.r = 1.0 - d;
    
    if(h.row == 2.5) {
        if(h.oddColumn == 1) 
            col.g = 1.0;
        else
            col.b = 1.0;
        
    }
    if(h.column == -.5) {
//        col.g = 1.0;
    }

    
    fragColor = vec4(col, 1);    
}



struct HexInfo {
    vec2 xy;
    float row;
    float column;
};

HexInfo getHex(vec2 p)
{    
    HexInfo hi;
    // The hexagon centers: Two sets of repeat hexagons are required to fill in the space, and
    // the two sets are stored in a "vec4" in order to group some calculations together. The hexagon
    // center we'll eventually use will depend upon which is closest to the current point. Since 
    // the central hexagon point is unique, it doubles as the unique hexagon ID.
    
    vec4 hC = floor(vec4(p, p - vec2(1, .5))/s.xyxy) + .5;
    
    // Centering the coordinates with the hexagon centers above.
    vec4 h = vec4(p - hC.xy*s, p - (hC.zw + .5)*s);
    hi.xy = h.xy;
    
    vec4 result=dot(h.xy, h.xy) < dot(h.zw, h.zw) 
        ? vec4(h.xy, hC.xy) 
        : vec4(h.zw, hC.zw + .5);

    hi.xy = result.xy;
    
    // Nearest hexagon center (with respect to p) to the current point. In other words, when
    // "h.xy" is zero, we're at the center. We're also returning the corresponding hexagon ID -
    // in the form of the hexagonal central point.
    return hi;

}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Aspect correct screen coordinates.
	vec2 u = (fragCoord - iResolution.xy*.5)/iResolution.y;
    
    // Scaling, translating, then converting it to a hexagonal grid cell coordinate and
    // a unique coordinate ID. The resultant vector contains everything you need to produce a
    // pretty pattern, so what you do from here is up to you.
    HexInfo h = getHex(u*5. + s.yx);
    
    // The beauty of working with hexagonal centers is that the relative edge distance will simply 
    // be the value of the 2D isofield for a hexagon.
    float eDist = hex(h.xy); // Edge distance.

    // Initiate the background to a white color, putting in some dark borders.
    vec3 col = mix(vec3(0.), vec3(1), smoothstep(0., .03, eDist - .5 + .04));  
    
    float d = length(h.xy);
    col.r = 1.0 - d;

    
    fragColor = vec4(col, 1);    
}


working shader toy
#define FLAT_TOP_HEXAGON

// Helper vector. If you're doing anything that involves regular triangles or hexagons, the
// 30-60-90 triangle will be involved in some way, which has sides of 1, sqrt(3) and 2.
const vec2 s = vec2(1.7320508, 1);

float hash21(vec2 p)
{
    return fract(sin(dot(p, vec2(141.13, 289.97)))*43758.5453);
}

// The 2D hexagonal isosuface function: If you were to render a horizontal line and one that
// slopes at 60 degrees, mirror, then combine them, you'd arrive at the following. As an aside,
// the function is a bound -- as opposed to a Euclidean distance representation, but either
// way, the result is hexagonal boundary lines.
float hex(in vec2 p)
{    
    p = abs(p);
    
    return max(dot(p, s*.5), p.y); // Hexagon.
}

// This function returns the hexagonal grid coordinate for the grid cell, and the corresponding 
// hexagon cell ID -- in the form of the central hexagonal point. That's basically all you need to 
// produce a hexagonal grid.
//
// When working with 2D, I guess it's not that important to streamline this particular function.
// However, if you need to raymarch a hexagonal grid, the number of operations tend to matter.
// This one has minimal setup, one "floor" call, a couple of "dot" calls, a ternary operator, etc.
// To use it to raymarch, you'd have to double up on everything -- in order to deal with 
// overlapping fields from neighboring cells, so the fewer operations the better.

struct HexInfo {
    vec2 xy;
    float row;
    float column;
    int oddRow;
    int oddColumn;
};

HexInfo getHex(vec2 p)
{    
    HexInfo hi;
    // The hexagon centers: Two sets of repeat hexagons are required to fill in the space, and
    // the two sets are stored in a "vec4" in order to group some calculations together. The hexagon
    // center we'll eventually use will depend upon which is closest to the current point. Since 
    // the central hexagon point is unique, it doubles as the unique hexagon ID.
    
    vec4 hC = floor(vec4(p, p - vec2(1, .5))/s.xyxy) + .5;
    
    // Centering the coordinates with the hexagon centers above.
    vec4 h = vec4(p - hC.xy*s, p - (hC.zw + .5)*s);
    hi.xy = h.xy;

    hi.row = h.z;
    hi.column = h.w;


    vec4 result=dot(h.xy, h.xy) < dot(h.zw, h.zw) 
        ? vec4(h.xy, hC.xy) 
        : vec4(h.zw, hC.zw + .5);

    hi.xy = result.xy;
    hi.row = result.z;

    hi.oddColumn = 0;
    hi.oddRow = 0;
    
    
    return hi;
    
    // Nearest hexagon center (with respect to p) to the current point. In other words, when
    // "h.xy" is zero, we're at the center. We're also returning the corresponding hexagon ID -
    // in the form of the hexagonal central point.
    //
    // On a side note, I sometimes compare hex distances, but I noticed that Iomateron compared
    // the squared Euclidian version, which seems neater, so I've adopted that.
//    return dot(h.xy, h.xy) < dot(h.zw, h.zw) 
//        ? vec4(h.xy, hC.xy) 
//        : vec4(h.zw, hC.zw + .5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Aspect correct screen coordinates.
	vec2 u = (fragCoord - iResolution.xy*.5)/iResolution.y;
    
    // Scaling, translating, then converting it to a hexagonal grid cell coordinate and
    // a unique coordinate ID. The resultant vector contains everything you need to produce a
    // pretty pattern, so what you do from here is up to you.
    HexInfo h = getHex(u*6. + s.yx);
    
    // The beauty of working with hexagonal centers is that the relative edge distance will simply 
    // be the value of the 2D isofield for a hexagon.
    float eDist = hex(h.xy); // Edge distance.

    // Initiate the background to a white color, putting in some dark borders.
    vec3 col = mix(vec3(0.), vec3(1), smoothstep(0., .03, eDist - .5 + .04));  
    
    float d = length(h.xy);
    col.r = 1.0 - d;
    
    if(h.row >= 0.6) {
        if(h.oddColumn == 1) 
            col.g = 1.0;
        else
            col.b = 1.0;
        
    }
    
    fragColor = vec4(col, 1);    
}

*/

/*
exce
#define FLAT_TOP_HEXAGON

// Helper vector. If you're doing anything that involves regular triangles or hexagons, the
// 30-60-90 triangle will be involved in some way, which has sides of 1, sqrt(3) and 2.
const vec2 s = vec2(1.7320508, 1);

float hash21(vec2 p)
{
    return fract(sin(dot(p, vec2(141.13, 289.97)))*43758.5453);
}

// The 2D hexagonal isosuface function: If you were to render a horizontal line and one that
// slopes at 60 degrees, mirror, then combine them, you'd arrive at the following. As an aside,
// the function is a bound -- as opposed to a Euclidean distance representation, but either
// way, the result is hexagonal boundary lines.
float hex(in vec2 p)
{    
    p = abs(p);
    
    return max(dot(p, s*.5), p.y); // Hexagon.
}

// This function returns the hexagonal grid coordinate for the grid cell, and the corresponding 
// hexagon cell ID -- in the form of the central hexagonal point. That's basically all you need to 
// produce a hexagonal grid.
//
// When working with 2D, I guess it's not that important to streamline this particular function.
// However, if you need to raymarch a hexagonal grid, the number of operations tend to matter.
// This one has minimal setup, one "floor" call, a couple of "dot" calls, a ternary operator, etc.
// To use it to raymarch, you'd have to double up on everything -- in order to deal with 
// overlapping fields from neighboring cells, so the fewer operations the better.

struct HexInfo {
    vec2 xy;
    float row;
    float column;
    int oddRow;
    int oddColumn;
};

HexInfo getHex(vec2 p)
{    
    HexInfo hi;
    // The hexagon centers: Two sets of repeat hexagons are required to fill in the space, and
    // the two sets are stored in a "vec4" in order to group some calculations together. The hexagon
    // center we'll eventually use will depend upon which is closest to the current point. Since 
    // the central hexagon point is unique, it doubles as the unique hexagon ID.
    
    vec4 hC = floor(vec4(p, p - vec2(1, .5))/s.xyxy) + .5;
    
    // Centering the coordinates with the hexagon centers above.
    vec4 h = vec4(p - hC.xy*s, p - (hC.zw + .5)*s);
    hi.xy = h.xy;

    hi.row = h.z;
    hi.column = h.w;


    vec4 result=dot(h.xy, h.xy) < dot(h.zw, h.zw) 
        ? vec4(h.xy, hC.xy) 
        : vec4(h.zw, hC.zw + .5);

    hi.xy = result.xy;
    hi.column = result.z;
    hi.row = result.w;

    hi.oddColumn = 0;
    hi.oddRow = 0;
    
    
    return hi;
    
    // Nearest hexagon center (with respect to p) to the current point. In other words, when
    // "h.xy" is zero, we're at the center. We're also returning the corresponding hexagon ID -
    // in the form of the hexagonal central point.
    //
    // On a side note, I sometimes compare hex distances, but I noticed that Iomateron compared
    // the squared Euclidian version, which seems neater, so I've adopted that.
//    return dot(h.xy, h.xy) < dot(h.zw, h.zw) 
//        ? vec4(h.xy, hC.xy) 
//        : vec4(h.zw, hC.zw + .5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Aspect correct screen coordinates.
	vec2 u = (fragCoord - iResolution.xy*.5)/iResolution.y;
    
    // Scaling, translating, then converting it to a hexagonal grid cell coordinate and
    // a unique coordinate ID. The resultant vector contains everything you need to produce a
    // pretty pattern, so what you do from here is up to you.
    HexInfo h = getHex(u*6. + s.yx);
    
    // The beauty of working with hexagonal centers is that the relative edge distance will simply 
    // be the value of the 2D isofield for a hexagon.
    float eDist = hex(h.xy); // Edge distance.

    // Initiate the background to a white color, putting in some dark borders.
    vec3 col = mix(vec3(0.), vec3(1), smoothstep(0., .03, eDist - .5 + .04));  
    
    float d = length(h.xy);
    col.r = 1.0 - d;
    
    if(h.column == 0.5) {
        if(h.oddColumn == 1) 
            col.g = 1.0;
        else
            col.b = 1.0;
        
    }
    
    fragColor = vec4(col, 1);    
}
*/