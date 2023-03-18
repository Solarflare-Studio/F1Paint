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
        this.plinthSidesMat.color = new THREE.Color( 0x322020)
        // this.plinthSidesMat.color = new THREE.Color( 0x929292);

        this.plinthSidesMat.transparent = false;

        this.plinthSidesMat.needsUpdate = true;



        this.garageMaterial.needsUpdate = true;


        // let garagePlinthSideMaterial = f1materials.newGarageMat();
        // garagePlinthSideMaterial.color = new THREE.Color(0x5f0505);
        this.garageShaderMaterial();


        let garageFloor = new THREE.Mesh( new THREE.CircleGeometry( 80, 32 ), this.garageMaterial );
        let garageFloorSFX = new THREE.Mesh( new THREE.CircleGeometry( 80, 32 ), this.garageSFXMaterial );
        let garageFloorSides = new THREE.Mesh( new THREE.CylinderGeometry( 80, 80, 10, 32, 1, true ), this.plinthSidesMat );
        garageFloorSides.layers.set(3); // with glow
        // garageFloorSides.layers.set(1); // without
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

        // create blank hex floor grid for later
        this.hexPixelBuffer = this.createHexPixelData(64,64);
        this.hexPixTexture = new THREE.DataTexture(this.hexPixelBuffer, 64,64, THREE.RGBFormat );
        this.garageSFXMaterial.uniforms.texture2.value = this.hexPixTexture;
        this.garageSFXMaterial.needsUpdate=true;
    }
    //======================
    createHexPixelData(width,height) {

        // create a pixel buffer with alternating black and white pixels
        var pixels = new Uint8Array(width * height * 3);
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var i = (y * width + x) * 3;
                var color = 0;// ((x ^ y) & 0x8) ? 255 : 0;
                pixels[i] = pixels[i + 1] = pixels[i + 2] = color;
            }
        }
        return pixels;
    }
    //======================
    multplyByte(b,factor) {
        if(b!=0) {
            console.log('ss');
        }
        let floatValue = b / 255.0;
        let resultFloatValue = floatValue * factor;
        return Math.round(resultFloatValue * 255.0);
    }
    //======================


    startFloorMode(v,extras) {
        this.floorMode = v;
        this.garageSFXMaterial.uniforms.mode.value = v;
        this.garageSFXMaterial.uniforms.fTime.value = 0.;
        var self = this;
        if(this.floorMode == 0) { // wipe to zero

            self.garageSFXMaterial.uniforms.dimmer.value = 0.8;
            new TWEEN.Tween({ value: 255 })
            .to({ value: 0 },
                1000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(function (object) {
                for (var i = 0; i < self.hexPixelBuffer.length; i += 3) {
                    if(self.hexPixelBuffer[i]>object.value) 
                        self.hexPixelBuffer[i] = object.value;
                    if(self.hexPixelBuffer[i+1]>object.value) self.hexPixelBuffer[i+1] = object.value;
                    if(self.hexPixelBuffer[i+2]>object.value) self.hexPixelBuffer[i+2] = object.value;
                }

                self.hexPixTexture.needsUpdate=true;
            })
            .onComplete(function () {
                // Call nextPosition only after the animation has completed
            })        
            .start()               
        }
        if(this.floorMode == 1) { // intro floor
            self.garageSFXMaterial.uniforms.dimmer.value = 0.5;

            new TWEEN.Tween(self.garageSFXMaterial.uniforms.fTime)
            .to({
                    value: 1.0,
                },
                5000
            )
            .easing(TWEEN.Easing.Quintic.Out)
//            .easing(TWEEN.Easing.Cubic.Out)
            .onComplete(function () {
                self.floorMode = 0;
                self.garageSFXMaterial.uniforms.fTime.value = 0.0;
            })        
            .start()
        }
        else if(this.floorMode == 2) { // start grid
            var self = this;
            self.garageSFXMaterial.uniforms.dimmer.value = 0.8;

            new TWEEN.Tween({ value: 0 })
            .to({
                    value: 255,
                },
                2000
            )
            .easing(TWEEN.Easing.Quintic.InOut)
            .onUpdate(function (object) {
                const starty = 14;
                for(var y=starty;y<23;y++) {
                    var x = 21;
                    var i = x*3 + (y*64*3);
                    if(self.hexPixelBuffer[i]<object.value) self.hexPixelBuffer[i] = object.value;
                    if(self.hexPixelBuffer[i+1]<object.value) self.hexPixelBuffer[i+1] = object.value;
                    if(self.hexPixelBuffer[i+2]<object.value) self.hexPixelBuffer[i+2] = object.value;
                    x = 43;
                    i = x*3 + ((y+1.)*64*3);
                    if(self.hexPixelBuffer[i]<object.value) self.hexPixelBuffer[i] = object.value;
                    if(self.hexPixelBuffer[i+1]<object.value) self.hexPixelBuffer[i+1] = object.value;
                    if(self.hexPixelBuffer[i+2]<object.value) self.hexPixelBuffer[i+2] = object.value;
                }
                for(var x=21;x<44;x++) {
                    var i = x*3 + (starty*64*3);
                    if(self.hexPixelBuffer[i]<object.value) self.hexPixelBuffer[i] = object.value;
                    if(self.hexPixelBuffer[i+1]<object.value) self.hexPixelBuffer[i+1] = object.value;
                    if(self.hexPixelBuffer[i+2]<object.value) self.hexPixelBuffer[i+2] = object.value;
                    i = x*3 + ((starty-1)*64*3);
                    if(self.hexPixelBuffer[i]<object.value) self.hexPixelBuffer[i] = object.value;
                    if(self.hexPixelBuffer[i+1]<object.value) self.hexPixelBuffer[i+1] = object.value;
                    if(self.hexPixelBuffer[i+2]<object.value) self.hexPixelBuffer[i+2] = object.value;
                }

                self.hexPixTexture.needsUpdate=true;
            })
            .onComplete(function () {
                // Call nextPosition only after the animation has completed
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
            texture2: { value: 0 },  // hex pixels for alternative method
            fTime: { value: 0.0},
            offset_y: { value: 0.0},
            offset_x: { value: 0.0},
            tot_x: { value: 0.0},
            tot_y: { value: 0.0},
            scale_x: { value: 1.0},
            scale_y: { value: 1.0},
            mode: {value: 0 },
            dimmer: {value: 0.5},
          };
  
        this.garageSFXMaterial = new THREE.ShaderMaterial({
            name: 'garageFloorSFXMaterial',

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
            uniform sampler2D texture1;
            uniform sampler2D texture2; // input texture to drive hexagons if non computational

            uniform float dimmer;

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
            //==================================================================
            float hash21(vec2 p)
            {
                return fract(sin(dot(p, vec2(141.13, 289.97)))*43758.5453);
            }
            //==================================================================
            float hex(in vec2 p)
            {
                const vec2 s = vec2(1.7320508, 1);

                p = abs(p);    
                return max(dot(p, s*.5), p.y); // Hexagon.
            }
            //==================================================================
            struct HexInfo {
                vec2 xy;
                float row;
                float column;
                int oddRow;
                int oddColumn;
            };
            //==================================================================
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
            //==================================================================
            void main()
            {
                float tints[24] = float[24](1.,1.,1., 0.91,.04,.03,  0.59,.29,.91,    0.,1.,1.,
                    1.,1.,1.,  0.91,.04,.03,  0.59,.29,.91,    0.,1.,1.);

                const vec3 tintBlueCyan = vec3(0.18,.95,.96);
                const vec3 tintDarkPurple = vec3(0.59,.29,.91);
                const vec3 tintRed = vec3(0.91,.04,.03);

                // max extents
                const float maxc = 38.0;
                const float maxr = 66.0;
                
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
                int ci = int(h.column * 2.0);
                int ri = int(h.row * 2.0);
                float cf = float(ci);
                float rf = float(ri);

                vec3 outcol = vec3(0.0);

                // ==============
                if(int(mode)==2 || int(mode)==0) { // use pixelmap
                    vec2 targetuv=vec2(cf/maxc,rf/maxr);
                    vec3 colourpixels = texture2D(texture2, targetuv).xyz;
                    outcol = colourpixels.xyz;
                }
                // ==============
                else if(int(mode)==1) { // draws circle from centre outwards
                    float tc = vt * maxc;
                    float tr = vt * maxr;


                    vec2 norm = vec2(cf, rf) - vec2(19.0,33.0 );
                    norm.x *= 2.0;

                    // circle splash
                    float radius = 45.0 * vt;
                    float dist = length(norm);
                    if(dist <= radius) {
                        if( dist <= radius - 2.0) {
                            if(dist >= radius - 4.0)
                                outcol = tintDarkPurple;
                            else {
                                if(dist >= radius - 6.0) {
                                    outcol = tintRed;
                                }
                                else {
                                    if(dist >= radius - 10.0) {
                                        float calc = (dist - (radius-8.0))/5.0;
                                        outcol = tintRed * (calc);
                                    }
                                }
                            }
                        } 
                        else {
                            dist = (dist-radius) / (2.0);
                            outcol = tintBlueCyan * dist;
                        }
                    }
                }

                // most modes just do hex outline by using mask from hex image
                vec4 colour = texture2D(texture1, uv);
                float g = colour.g;

                outcol *= g;
                outcol *= dimmer;// 0.5;

                gl_FragColor = vec4(outcol, .6);
            }
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