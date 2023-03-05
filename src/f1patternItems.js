//import * as THREE from '../node_modules/three/build/three.module.js';

import * as THREE from '../node_modules/three/build/three.module.js';


class PatternItems {

    constructor(useCustom) {
        this.currentPatternElement=0;
        this.init(useCustom);
    }
    init(useCustom) {
        this.useCustom = useCustom; // for pattern colours
        this.useCustomTag = useCustom;
        this.useCustomDecal = useCustom;



        this.layerNoneElements = new Array();
        // this.timer1 = 0;
        this.patternLoaderTimeout = 0;
        this.patternTexture = 0;

//         this.loadmanager = new THREE.LoadingManager();
//         this.loadmanager.onStart = function(item, loaded, total) {
//             console.log(">>> texture loading..");
//         }
//         this.loadmanager.onLoad = function () {
//             console.log('Loading complete');            
// //            bar.destroy();
//         };
    
//         this.loadmanager.onProgress = function (item, loaded, total) {            
//             console.log(item, loaded, total);
//             console.log('Loaded:', Math.round(loaded / total * 100, 2) + '%')
// //            bar.animate(1.0);
//         };
    
//         this.loadmanager.onError = function (url) {
//             console.log('Error loading image from ' + url);
//         };


    }
    //======
    // ===============================================
    patternTextureLoader( _file, _material, _f1SpecialFXmapUniforms) {

    }
    // ===============================================
    buildGUI(patternsData) { // ,layerPatternThumbElements) {
        console.log('>> adding thumbs');
        var layer1PatternDiv = document.getElementById('layer1patterns_ins');
        var layer2TagsDiv = document.getElementById('layer2tags_ins');
        var layer3DecalsDiv = document.getElementById('layer3decals_ins');

        layer1PatternDiv.innerHTML="";
        layer2TagsDiv.innerHTML="";
        layer3DecalsDiv.innerHTML="";

        /*
        for(var i=0;i<4;i++) {
            var thumbContainer = document.createElement("div");
            thumbContainer.classList.add("patternContainer");

            var thumbimage = document.createElement("div");
            thumbimage.classList.add("pattern");
            thumbimage.classList.add('patternSelected');

            thumbimage.style.backgroundImage = "url('./assets/inapp/noneicon.png')";
            // thumbimage.setAttribute('onClick', "onNonePicked("+ i +",this)");
//            thumbimage.setAttribute('onClick', "onPatternPicked("+ i +",'NONE',this)");
//            thumbimage.setAttribute('onClick', "onPatternPicked(-1,-1,this);");
            thumbimage.setAttribute('onClick', "onPatternPicked(0,'./assets/inapp/smallredimage.png',this)");



            thumbimage.style.backgroundSize='contain';
            thumbimage.style.backgroundRepeatX = 'no-repeat';
            thumbimage.style.backgroundPosition = 'center';

            this.layerNoneElements.push(thumbimage);

            thumbContainer.appendChild(thumbimage);

            if(i==0)
                layer1PatternDiv.appendChild(thumbContainer); 
            else if(i==1)
                layer2TagsDiv.appendChild(thumbContainer);
            else if(i==2)
                layer3DecalsDiv.appendChild(thumbContainer); 


        }
        this.currentPatternElement  = this.layerNoneElements[0];
        */
        for(var i=0;i<patternsData['Patterns'].length;i++) {
//            console.log(">> found pattern item.. ");

            var thumbContainer = document.createElement("div");
            thumbContainer.classList.add("patternContainer");

            var thumbimage = document.createElement("div");
            thumbimage.classList.add("pattern");
            thumbimage.setAttribute('patternId', patternsData['Patterns'][i].id);
            thumbimage.setAttribute('onClick', "onPatternPicked("+ (i) +",'./patterns/" + patternsData['Patterns'][i].image + "',this)");


            var thumbdescription = document.createElement("div");
            thumbdescription.innerHTML=patternsData['Patterns'][i].name;
            thumbdescription.classList.add("patterndescription");
            thumbdescription.classList.add("hidden");



            thumbimage.appendChild(thumbdescription);


            if( patternsData['Patterns'][i].id==-1) {

                // const noneimage = document.createElement('img');
                // noneimage.src = './assets/inapp/noneicon.png';
                // noneimage.setAttribute('width', '100%');
                // noneimage.setAttribute('height', '100%');
                
                // thumbimage.appendChild(noneimage);


                thumbimage.style.backgroundSize='contain'; // todo doesnt work on all browsers
                thumbimage.style.backgroundRepeat ='no-repeat'; 
                thumbimage.style.backgroundRepeatX = 'no-repeat';
                thumbimage.style.backgroundPosition = 'center';

                this.layerNoneElements.push(thumbimage);

                thumbimage.style.backgroundImage = "url('./assets/inapp/noneicon.png')";
            }
            else {
                // to prevent caching... + '?t=' + (new Date()).getTime()
                var thethumbfile = patternsData['Patterns'][i].thumbnail;                
                thumbimage.style.backgroundImage = "url('./patterns/" + thethumbfile + "')";
            }

            thumbContainer.appendChild(thumbimage);

            if(patternsData['Patterns'][i].layer==0)
                layer1PatternDiv.appendChild(thumbContainer); 
            else if(patternsData['Patterns'][i].layer==1)
                layer2TagsDiv.appendChild(thumbContainer);
            else if(patternsData['Patterns'][i].layer==2)
                layer3DecalsDiv.appendChild(thumbContainer); 
            else
                alert("error layer overflow");//layer2PatternDiv.appendChild(thumbimage); 

        }
        // this.currentPatternElement  = this.layerNoneElements[0];
        // layerPatternThumbElements[0] = this.layerNoneElements[0];
        // layerPatternThumbElements[1] = this.layerNoneElements[1];
        // layerPatternThumbElements[2] = this.layerNoneElements[2];

    }
    //======
    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    //======
    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    //======
//     enableColourPickArea() {
//         document.getElementById('f1col1').classList.remove('f1colbuttonsDisabled');
//         document.getElementById('f1col2').classList.remove('f1colbuttonsDisabled');
//         document.getElementById('f1col3').classList.remove('f1colbuttonsDisabled');
//         document.getElementById('f1col1').classList.remove('coloursdisabled');
//         document.getElementById('f1col2').classList.remove('coloursdisabled');
//         document.getElementById('f1col3').classList.remove('coloursdisabled');
// //        document.getElementById('f1colnone').classList.remove('coloursdisabled');

// 		document.getElementById('f1col1').classList.remove('patternSelected');
// 		document.getElementById('f1col2').classList.remove('patternSelected');
// 		document.getElementById('f1col3').classList.remove('patternSelected');       
//     }
    //======
//     disableColourPickArea() {
//         document.getElementById('f1col1').classList.add('f1colbuttonsDisabled');
//         document.getElementById('f1col2').classList.add('f1colbuttonsDisabled');
//         document.getElementById('f1col3').classList.add('f1colbuttonsDisabled');
//         document.getElementById('f1col1').classList.add('coloursdisabled');
//         document.getElementById('f1col2').classList.add('coloursdisabled');
//         document.getElementById('f1col3').classList.add('coloursdisabled');
// //        document.getElementById('f1colnone').classList.add('coloursdisabled');

// 		document.getElementById('f1col1').classList.remove('patternSelected');
// 		document.getElementById('f1col2').classList.remove('patternSelected');
// 		document.getElementById('f1col3').classList.remove('patternSelected');  
        
// //        document.getElementById('f1coldone').classList.add('hidden');

//     }
    //======
    changePattern(which,thefile,mapUniforms,
        thepatternelement,patternsData,liveryData,currentLayer,
        f1MetalRoughmapUniforms,f1Text,f1SpecialFX,f1Gui,f1Ribbons) {
        const patternId = thepatternelement.getAttribute("patternId");

        var debMsg = ">> Picked pattern = " + which + " id='"+ patternId +"'\n    " + "file = " + thefile;
        if(thefile!='./patterns/smallredimage.png')
            debMsg = debMsg + patternsData['Patterns'][which].name+ "\n   " + patternsData['Patterns'][which].image;

        console.log(debMsg);


    

        if(this.currentPatternElement!=0) {
            this.currentPatternElement.classList.remove('patternSelected');
            this.currentPatternElement.children[0].classList.add('hidden');
        }



       
        // layerPatternThumbElements[currentLayer] = thepatternelement;
        // IS NULL PATTERN
        // if(thefile=='./patterns/smallblackimage.jpg') {
        var isNone = false;
        if(patternsData['Patterns'][which].id == -1 && currentLayer!=0) { // a null one
            if(currentLayer==0) {
                document.getElementById('layer1patterns_ins').classList.remove('disabledButton');
                // never!
            }
            else if(currentLayer==1) {
                isNone=true;
                document.getElementById('layer2tags_ins').classList.remove('disabledButton');
                document.getElementById('taginputcontainer').classList.add('disabledButton');
                mapUniforms.useTag.value = 0;

                f1SpecialFX.mapUniforms.useTag.value = 0;
                f1MetalRoughmapUniforms.useTag.value = 0;

                thepatternelement.classList.add('patternSelected');
                this.currentPatternElement = thepatternelement;
                // Show description name
                this.currentPatternElement.children[0].classList.remove('hidden');


            }
            else if(currentLayer==2) {
                isNone=true;

                document.getElementById('layer3decals_ins').classList.remove('disabledButton');
                mapUniforms.useDecal.value = 0;
                f1MetalRoughmapUniforms.useDecal.value = 0;

                f1SpecialFX.mapUniforms.useDecal.value = 0;

                thepatternelement.classList.add('patternSelected');
                this.currentPatternElement = thepatternelement;
                // Show description name
                this.currentPatternElement.children[0].classList.remove('hidden');

            }
 


            // setTimeout(function() {
            //     liveryData['Layers'][currentLayer].patternId = patternId;// which; // todo, make this the pattern id
            //     liveryData['Layers'][currentLayer].filename = thefile;
        
            //     f1SpecialFX.mapUniforms.leadin.value = 0.0;
            //     if(!f1Gui.isAuto) {
            //        f1SpecialFX.startFX(1000); // sfx lead out
            //     }
            //     else
            //         f1Gui.isAuto=false;

                    
            // }, 350); // sfx lead in
            // f1SpecialFXmapUniforms.leadin.value = 0.0;
        }

// try without the else!

        // IS A PATTERN/DECAL/SPONSOR
        // else 
        {
            // if(currentLayer==1) {
            //     mapUniforms.useTag.value = 1;
            //     f1MetalRoughmapUniforms.useTag.value = 1;
            // }
            // else if(currentLayer==2) {
            //     mapUniforms.useDecal.value = 1;
            //     f1MetalRoughmapUniforms.useDecal.value = 1;
            // }

            // to prevent caching...
            thefile = thefile;// + '?t=' + (new Date()).getTime();


            var self = this;
            console.log(">>>> Texture image = attempt load > " + thefile);

//          
            clearTimeout(this.patternLoaderTimeout);
            this.patternLoaderTimeout = setTimeout(function() {
                console.log(">>>> ********* TIMED OUT - RETRY > "+thefile);

                self.patternTexture=0; // todo try this to remove chance of texure now loading twice...
                self.changePattern(which,thefile,mapUniforms,
                    thepatternelement,patternsData,liveryData,currentLayer,
                    f1MetalRoughmapUniforms,f1Text,f1SpecialFX,f1Gui);

            }, 4000); //todo


//
            



            const texture = new THREE.TextureLoader().load(thefile, (tex) => {
                clearTimeout(this.patternLoaderTimeout);

                console.log(">>>> Texture image = LOADED > "+thefile);

                // trigger any effect on car changing
                // f1Ribbons.carChangeAnimate();


                tex.premultiplyAlpha = true; // debug premultiply // or not!
                tex.encoding = THREE.LinearEncoding;

                // f1SpecialFXmapUniforms.leadin.value = 0.0;
                // f1SpecialFX.finalPass.uniforms.amountBloom.value = 1.0;

                // if(f1SpecialFX.finalPass.uniforms.amountBloom.value != 0.0)
                //     f1SpecialFX.startFX();
                if(f1SpecialFX.effectStarttime==0) f1SpecialFX.effectStarttime = new Date().getTime();
                const forceddelay = (f1SpecialFX.duration + f1SpecialFX.effectStarttime) - new Date().getTime();
                console.log(">> wait for it! " + forceddelay);
                setTimeout(() => {
                    this.patternTexture = tex;
                    f1SpecialFX.mapUniforms.texture1Base.value = tex;

                    f1SpecialFX.mapUniforms.leadin.value = 0.0;

                    liveryData['Layers'][currentLayer].patternId = patternId;// which; // todo, make this the pattern id
                    liveryData['Layers'][currentLayer].filename = thefile;

                    if(!f1Gui.isAuto) {
                        f1SpecialFX.startFX(1000); // sfx lead out
                    }
                    else 
                        f1Gui.isAuto = false;


                    if(currentLayer==0)
                        document.getElementById('layer1patterns_ins').classList.remove('disabledButton');
                    else if(currentLayer==1)
                        document.getElementById('layer2tags_ins').classList.remove('disabledButton');
                    else if(currentLayer==2)
                        document.getElementById('layer3decals_ins').classList.remove('disabledButton');
            

                    if(currentLayer==0) {
                        mapUniforms.texture1Base.value = tex;
                        f1MetalRoughmapUniforms.texture1Base.value = tex;
                    }
                    else if(currentLayer==1 && !isNone) {
                        mapUniforms.useTag.value = 1;
                        f1SpecialFX.mapUniforms.useTag.value = 1;
                        liveryData['Layers'].tagfontstyle = patternsData['Patterns'][which].style;

                        f1MetalRoughmapUniforms.useTag.value = 1;
                        f1Text.tagPattern = tex;
                        // f1Text.locations = patternsData['Patterns'][which].location; // todo
                        f1Text.locations = 1;
                        document.getElementById('taginputcontainer').classList.remove('disabledButton');
                        f1Text.fontstyle = liveryData['Layers'].tagfontstyle;
                        f1Text.fixText();
                        f1Text.composite();
                    }
                    else if(currentLayer==2 && !isNone) {

                        mapUniforms.useDecal.value = 1;
                        f1MetalRoughmapUniforms.useDecal.value = 1;
                        f1SpecialFX.mapUniforms.useDecal.value = 1;

                        mapUniforms.texture3Decal.value = tex;
                        f1MetalRoughmapUniforms.texture3Decal.value = tex;
    
                    }














                    var d = new Date();
                    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
                    var expires = "expires=" + d.toUTCString();
            
                    if(currentLayer==0) { // tis pattern so update tints
                        // set colour for the pattern
                        var totChans = patternsData['Patterns'][which]['Channels'].length;
                        for(var t=0;t<3;t++) {
                            var c1;
                            var defaultCol;
                            if(!this.useCustom) {
                                c1 = patternsData['Patterns'][which]['Channels'][t].defaultColour;
                                defaultCol = new THREE.Color("rgb("+c1+")");
                                var tmp1 = this.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
                                liveryData['Layers'][currentLayer].Channels[t].tint = tmp1;
                            }
                            else {
                                c1 = liveryData['Layers'][currentLayer].Channels[t].tint;
                                defaultCol = new THREE.Color(c1);
            
                                var tmp1 = this.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
                                // liveryData[0][0]['Layers'][currentLayer].Channels[t];
            
                            }
            
            
                            if(t==0) // base paint
                                document.getElementById('basepaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
                            else if(t==1) // primary paint
                                document.getElementById('primarypaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
                            else if(t==2) // secondary paint
                                document.getElementById('secondarypaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
            
                            var tmpv4 = new THREE.Vector4(defaultCol.r,defaultCol.g,defaultCol.b,1.0);
                            if(t==0)
                                mapUniforms.texture1TintChannel1.value = tmpv4;
                            else if(t==1)
                                mapUniforms.texture1TintChannel2.value = tmpv4;
                            else if(t==2)
                                mapUniforms.texture1TintChannel3.value = tmpv4;
                        }
                    }
                    else if(currentLayer==1) { // tags..
                        for(var t=0;t<2;t++) { // 2 colour options
                            var c1;
                            var defaultCol;
                            if(!this.useCustomTag) {
                                c1 = patternsData['Patterns'][which]['Channels'][t].defaultColour;
                                defaultCol = new THREE.Color("rgb("+c1+")");
                                var tmp1 = this.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
                                liveryData['Layers'][currentLayer].Channels[t].tint = tmp1;
                            }
                            else {
                                c1 = liveryData['Layers'][currentLayer].Channels[t].tint;
                                defaultCol = new THREE.Color(c1);
            
                                var tmp1 = this.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
                                // liveryData[0][0]['Layers'][currentLayer].Channels[t].tint;
            
                            }
            
            
                            if(t==0) // base paint
                                document.getElementById('tagstylepaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
                            else if(t==1) // primary paint
                                document.getElementById('tagpaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
            
                            var tmpv4 = new THREE.Vector4(defaultCol.r,defaultCol.g,defaultCol.b,1.0);
                            if(t==0)
                                mapUniforms.tagStyleTint.value = tmpv4;
                            else if(t==1)
                                mapUniforms.tagTint.value = tmpv4;
                        }
                    }
                    else if(currentLayer==2) {
            
                        for(var t=0;t<2;t++) { // 2 colour option (2nd is fixed unchangable though)
                            var c1;
                            var defaultCol;
                            if(!this.useCustomDecal || t==1) {
                                c1 = patternsData['Patterns'][which]['Channels'][t].defaultColour;
                                defaultCol = new THREE.Color("rgb("+c1+")");
                                var tmp1 = this.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
                                liveryData['Layers'][currentLayer].Channels[t].tint = tmp1;
                            }
                            else {
                                c1 = liveryData['Layers'][currentLayer].Channels[t].tint;
                                defaultCol = new THREE.Color(c1);
            
                                var tmp1 = this.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
                                // liveryData[0][0]['Layers'][currentLayer].Channels[t].tint;
            
                            }
            
            
                            if(t==0) // base paint
                                document.getElementById('decalpaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
            
                            var tmpv4 = new THREE.Vector4(defaultCol.r,defaultCol.g,defaultCol.b,1.0);
                            if(t==0)
                                mapUniforms.decalTint.value = tmpv4;
                            else if(t==1)
                                mapUniforms.decal2Tint.value = tmpv4;
                        }
                    }
            //        this.useCustom = false;
                    thepatternelement.classList.add('patternSelected');
                    this.currentPatternElement = thepatternelement;
                    // Show description name
                    this.currentPatternElement.children[0].classList.remove('hidden');


















    
                }, forceddelay);


                // clearTimeout(self.timer1);
                // self.timer1 = setTimeout(function() {
                //     if(currentLayer==0) {
                //         mapUniforms.texture1Base.value = tex;
                //         f1MetalRoughmapUniforms.texture1Base.value = tex;
                //     }
                //     else if(currentLayer==2) {
                //         mapUniforms.texture3Decal.value = tex;
                //         f1MetalRoughmapUniforms.texture3Decal.value = tex;
                //         f1MetalRoughmapUniforms.useDecal.value = 1;                    
    
                //     }
                //     clearTimeout(self.timer1);

                // },120);

            // this.patternTexture = new THREE.TextureLoader().load(thefile, (tex) => {
                // tex.premultiplyAlpha = false; // debug premultiply // or not!


            });
        }
        // this.enableColourPickArea();

    }
    //======

}


export { PatternItems };
