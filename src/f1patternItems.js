//import * as THREE from '../node_modules/three/build/three.module.js';

import * as THREE from '../node_modules/three/build/three.module.js';
import {DEBUG_MODE} from './adminuser'
import { setAutoSelectingPattern,getAutoSelectingPattern } from './f1gui.js';

class PatternItems {

    constructor(useCustom) {
        this.currentPatternElement=0;
        this.init(useCustom);
    }
    init(useCustom) {
        this.useCustomBaseColours = useCustom; // for pattern colours
        this.useCustomTagColours = useCustom;
        this.useCustomSponsorColours = useCustom;

        this.patternLoaderTimeout = 0;
        this.patternTexture = 0;

    }
    //======
    // ===============================================
    patternTextureLoader( _file, _material, _f1SpecialFXmapUniforms) {

    }
    // ===============================================
    haveReadThumb(url,self,thumbimage) {
        // thumbimage.style.backgroundImage = "url('" + url + "')";
        thumbimage.src = url;


    }
    // ===============================================
    buildGUI(patternsData,f1Aws) { // ,layerPatternThumbElements) {


        if(DEBUG_MODE)
            console.log('>> adding thumbs');

        var layer1PatternDiv = document.getElementById('layer1patterns_ins');
        var layer2TagsDiv = document.getElementById('layer2tags_ins');
        var layer3SponsorsDiv = document.getElementById('layer3sponsors_ins');

        let layer1count = 0;
        let layer2count = 0;
        let layer3count = 0;
        

        layer1PatternDiv.innerHTML="";
        layer2TagsDiv.innerHTML="";
        layer3SponsorsDiv.innerHTML="";

        for(var i=0;i<patternsData['Patterns'].length;i++) {

            var thumbContainer = document.createElement("div");
            // thumbContainer.classList.add("patternContainer");
            thumbContainer.classList.add("patternt_check_wrp");

            var thumbInput = document.createElement("input");
            thumbInput.classList.add('w-full');
            thumbInput.classList.add('h-full');
            thumbInput.classList.add('hidden');
            thumbInput.setAttribute('type','radio');

            var thumbLabel = document.createElement("label");

            var thumbFigure = document.createElement("figure");
            thumbFigure.classList.add("rounded-br-[18px]");
            var thumbImage = document.createElement("img");
            thumbImage.classList.add("w-full");
            thumbImage.classList.add("h-full");
            thumbImage.classList.add("rounded-br-[18px]");
            var thumbExtra = document.createElement("div");
            thumbExtra.classList.add('hidden');
            var thumbExtra2 = document.createElement("span");
            var thumbExtra3 = document.createElement("img");
            thumbExtra3.src = "./assets/images/check_mark.svg";
            thumbExtra3.setAttribute('alt','checked');

            var thethumbfile = patternsData['Patterns'][i].thumbnail;

            switch (patternsData['Patterns'][i].layer) {
                case 0: // base pattern later
                    thumbInput.setAttribute('id','patternt'+(layer1count+1));
                    thumbInput.setAttribute('name','pattten');
                    if(layer1count==0)
                        thumbInput.setAttribute('checked','true');

                    thumbLabel.setAttribute('for','patternt'+(layer1count+1));
                    thumbImage.setAttribute('alt','pattten '+(layer1count+1));
                    // thumbExtra2.innerHTML="  ";//patternsData['Patterns'][i].name;

                    if(layer1count!=0)
                        f1Aws.loadfromAWS('patterns',thethumbfile,5,this.haveReadThumb,this,thumbImage); // aws thumbs
                    else
                        thumbImage.src = "./assets/inapp/newnone.jpg";

                    layer1count++;
                    break;
                case 1: // tag pattern later
                    thumbInput.setAttribute('id','tag'+(layer2count+1));
                    thumbInput.setAttribute('name','tag');
                    if(layer2count==0)
                        thumbInput.setAttribute('checked','true');

                    thumbLabel.setAttribute('for','tag'+(layer2count+1));
                    thumbImage.setAttribute('alt','tag '+(layer2count+1));
                    // thumbExtra2.innerHTML=patternsData['Patterns'][i].name;

                    if(layer2count!=0)
                        f1Aws.loadfromAWS('patterns',thethumbfile,5,this.haveReadThumb,this,thumbImage); // aws thumbs
                    else
                        thumbImage.src = "./assets/inapp/newnone.jpg";

                    layer2count++;
                    break;

                case 2: // sponsor pattern later
                    thumbInput.setAttribute('id','sponsor'+(layer3count+1));
                    thumbInput.setAttribute('name','sponsor');
                    if(layer3count==0)
                        thumbInput.setAttribute('checked','true');

                    thumbLabel.setAttribute('for','sponsor'+(layer3count+1));
                    thumbImage.setAttribute('alt','sponsor '+(layer3count+1));
                    // thumbExtra2.innerHTML=patternsData['Patterns'][i].name;

                    if(layer3count!=0)
                        f1Aws.loadfromAWS('patterns',thethumbfile,5,this.haveReadThumb,this,thumbImage); // aws thumbs
                    else
                        thumbImage.src = "./assets/inapp/newnone.jpg";

                    layer3count++;
                    break;                    

            }
            thumbLabel.classList.add('relative');
            thumbExtra2.innerHTML="  ";//patternsData['Patterns'][i].name;


            thumbImage.setAttribute('patternId', patternsData['Patterns'][i].id);
            thumbImage.setAttribute('onClick', "onPatternPicked("+ (i) +",'" + patternsData['Patterns'][i].image + "',this)");

            thumbFigure.appendChild(thumbImage);
            thumbLabel.appendChild(thumbFigure);
            thumbExtra.appendChild(thumbExtra2);
            thumbExtra.appendChild(thumbExtra3);
            thumbLabel.appendChild(thumbExtra);

            thumbContainer.appendChild(thumbInput);
            thumbContainer.appendChild(thumbLabel);

            if(patternsData['Patterns'][i].layer==0)
                layer1PatternDiv.appendChild(thumbContainer); 
            else if(patternsData['Patterns'][i].layer==1)
                layer2TagsDiv.appendChild(thumbContainer);
            else if(patternsData['Patterns'][i].layer==2)
                layer3SponsorsDiv.appendChild(thumbContainer);
//
/*
            var thumbContainer = document.createElement("div");
            thumbContainer.classList.add("patternContainer");

            var thumbimage = document.createElement("div");
            thumbimage.classList.add("pattern");
            thumbimage.setAttribute('patternId', patternsData['Patterns'][i].id);
            thumbimage.setAttribute('onClick', "onPatternPicked("+ (i) +",'" + patternsData['Patterns'][i].image + "',this)");


            var thumbdescription = document.createElement("div");
            thumbdescription.innerHTML=patternsData['Patterns'][i].name;
            thumbdescription.classList.add("patterndescription");
            thumbdescription.classList.add("hidden");



            thumbimage.appendChild(thumbdescription);


            if( patternsData['Patterns'][i].id==-1) {

                thumbimage.style.backgroundSize='contain'; // todo doesnt work on all browsers
                thumbimage.style.backgroundRepeat ='no-repeat'; 
                thumbimage.style.backgroundRepeatX = 'no-repeat';
                thumbimage.style.backgroundPosition = 'center';

                thumbimage.style.backgroundImage = "url('./assets/inapp/noneicon.png')";
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
            else {
                var thethumbfile = patternsData['Patterns'][i].thumbnail;

                // aws thumbs
                f1Aws.loadfromAWS('patterns',thethumbfile,5,this.haveReadThumb,this,thumbimage);

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
            */
        }
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
    nowloadtexture(url,self) {
        const texture = new THREE.TextureLoader().load(url, (tex) => {
            clearTimeout(self.patternLoaderTimeout);

            if(!getAutoSelectingPattern()) 
                self.f1Garage.startFloorMode(1); // radial 

            if(DEBUG_MODE)
                console.log(">>>> Texture image = LOADED > "+self.thefile);

            tex.premultiplyAlpha = true; // debug premultiply // or not!

            // tex.encoding = THREE.LinearEncoding;
            tex.encoding = THREE.sRGBEncoding;


            if(self.f1SpecialFX.effectStarttime==0) self.f1SpecialFX.effectStarttime = new Date().getTime();
            const forceddelay = (self.f1SpecialFX.duration + self.f1SpecialFX.effectStarttime) - new Date().getTime();
            if(DEBUG_MODE)
                console.log(">> wait for it! " + forceddelay);
            setTimeout(() => {
                self.patternTexture = tex;
                self.f1SpecialFX.mapUniforms.texture1Base.value = tex;

                self.f1SpecialFX.mapUniforms.leadin.value = 0.0;

                self.liveryData['Layers'][self.currentLayer].patternId = self.patternId;// which; // todo, make this the pattern id
                self.liveryData['Layers'][self.currentLayer].filename = self.thefile;


                if(!getAutoSelectingPattern()) {
                    if(DEBUG_MODE)
                        console.log(">> lead out sfx");

                    self.f1SpecialFX.startFX(1000); // sfx lead out
                }
                else 
                    setAutoSelectingPattern(false);


                if(self.currentLayer==0)
                    document.getElementById('layer1patterns_ins').classList.remove('disabledButton');
                else if(self.currentLayer==1)
                    document.getElementById('layer2tags_ins').classList.remove('disabledButton');
                else if(self.currentLayer==2)
                    document.getElementById('layer3sponsors_ins').classList.remove('disabledButton');
        

                if(self.currentLayer==0) { // base
                    self.mapUniforms.texture1Base.value = tex;
                    self.f1MetalRoughmapUniforms.texture1Base.value = tex;
                }
                else if(self.currentLayer==1 && !self.isNone) { // tag
                    self.mapUniforms.useTag.value = 1;
                    self.f1SpecialFX.mapUniforms.useTag.value = 1;
                    self.liveryData['Layers'].tagfontstyle = self.patternsData['Patterns'][self.which].style;

                    self.f1MetalRoughmapUniforms.useTag.value = 1;
                    self.f1Text.tagPattern = tex;
                    // f1Text.locations = patternsData['Patterns'][which].location; // todo
                    self.f1Text.locations = 1;
                    document.getElementById('taginput').classList.remove('disabledButton');
                    document.getElementById('tagpaintbutton').classList.remove('disabledButton');
                    document.getElementById('tagstylepaintbutton').classList.remove('disabledButton');


                    self.f1Text.fontstyle = self.liveryData['Layers'].tagfontstyle;
                    self.f1Text.fixText();
                    self.f1Text.composite();
                }
                else if(self.currentLayer==2 && !self.isNone) { // sponsor

                    self.mapUniforms.useDecal.value = 1;
                    self.f1MetalRoughmapUniforms.useDecal.value = 1;
                    self.f1SpecialFX.mapUniforms.useDecal.value = 1;

                    self.mapUniforms.texture3Decal.value = tex;
                    self.f1MetalRoughmapUniforms.texture3Decal.value = tex;

                }

                var d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
                var expires = "expires=" + d.toUTCString();
        
                if(self.currentLayer==0) { // tis pattern so update tints
                    // set colour for the pattern
                    var totChans = self.patternsData['Patterns'][self.which]['Channels'].length;
                    for(var t=0;t<3;t++) {
                        var tintcolour;
                        var colourconversion;
                        var newcol;
                        if(!self.useCustomBaseColours) {
                            tintcolour = self.patternsData['Patterns'][self.which]['Channels'][t].defaultColour;
                            colourconversion = new THREE.Color("rgb("+tintcolour+")");
                            newcol = self.rgbToHex(colourconversion.r*255.0,colourconversion.g*255.0,colourconversion.b*255.0);
                            self.liveryData['Layers'][self.currentLayer].Channels[t].tint = newcol;
                        }
                        else {
                            tintcolour = self.liveryData['Layers'][self.currentLayer].Channels[t].tint;
                            colourconversion = new THREE.Color(tintcolour);
        
                            newcol = self.rgbToHex(colourconversion.r*255.0,colourconversion.g*255.0,colourconversion.b*255.0);
                            // liveryData[0][0]['Layers'][currentLayer].Channels[t];
        
                        }
        
        
                        if(t==0) // base paint
                            document.getElementById('basepaintbutton').style.backgroundColor = newcol;//"rgb(255,0,0)";
                        else if(t==1) // primary paint
                            document.getElementById('primarypaintbutton').style.backgroundColor = newcol;//"rgb(255,0,0)";
                        else if(t==2) { // secondary paint
                            document.getElementById('secondarypaintbutton').style.backgroundColor = newcol;//"rgb(255,0,0)";

                            // also tint helmet visor
                            if(self.isHelmet) {
                                self.visormaterial.color = new THREE.Color( newcol );
                                self.visormaterial.needsUpdate = true;
                            }		                            
                        }
        
                        var tmpv4 = new THREE.Vector4(colourconversion.r,colourconversion.g,colourconversion.b,1.0);
                        if(t==0)
                            self.mapUniforms.texture1TintChannel1.value = tmpv4;
                        else if(t==1)
                            self.mapUniforms.texture1TintChannel2.value = tmpv4;
                        else if(t==2)
                            self.mapUniforms.texture1TintChannel3.value = tmpv4;
                    }
                }
                else if(self.currentLayer==1) { // tags..
                    for(var t=0;t<2;t++) { // 2 colour options
                        var tintcolour;
                        var colourconversion;
                        var newcol;
                        if(!self.useCustomTagColours) {
                            tintcolour = self.patternsData['Patterns'][self.which]['Channels'][t].defaultColour;
                            colourconversion = new THREE.Color("rgb("+tintcolour+")");
                            var newcol = self.rgbToHex(colourconversion.r*255.0,colourconversion.g*255.0,colourconversion.b*255.0);
                            self.liveryData['Layers'][self.currentLayer].Channels[t].tint = newcol;
                        }
                        else {
                            tintcolour = self.liveryData['Layers'][self.currentLayer].Channels[t].tint;
                            colourconversion = new THREE.Color(tintcolour);
        
                            newcol = self.rgbToHex(colourconversion.r*255.0,colourconversion.g*255.0,colourconversion.b*255.0);
                            // liveryData[0][0]['Layers'][currentLayer].Channels[t].tint;
        
                        }

                        if(t==0) // base paint
                            document.getElementById('tagstylepaintbutton').style.backgroundColor = newcol;//"rgb(255,0,0)";
                        else if(t==1) // primary paint
                            document.getElementById('tagpaintbutton').style.backgroundColor = newcol;//"rgb(255,0,0)";
        
                        var tmpv4 = new THREE.Vector4(colourconversion.r,colourconversion.g,colourconversion.b,1.0);
                        if(t==0)
                            self.mapUniforms.tagStyleTint.value = tmpv4;
                        else if(t==1)
                            self.mapUniforms.tagTint.value = tmpv4;
                    }
                }
                else if(self.currentLayer==2) { // sponsors
        
                    for(var t=0;t<2;t++) { // 2 colour option (1st or 2nd? is fixed unchangable though)
                        var tintcolour;
                        var colourconversion;
                        var newcol;
                        if(!self.useCustomSponsorColours || t==0) {
                            tintcolour = self.patternsData['Patterns'][self.which]['Channels'][t].defaultColour;
                            colourconversion = new THREE.Color("rgb("+tintcolour+")");
                            newcol = self.rgbToHex(colourconversion.r*255.0,colourconversion.g*255.0,colourconversion.b*255.0);
                            self.liveryData['Layers'][self.currentLayer].Channels[t].tint = newcol;
                        }
                        else {
                            tintcolour = self.liveryData['Layers'][self.currentLayer].Channels[t].tint;
                            colourconversion = new THREE.Color(tintcolour);
        
                            newcol = self.rgbToHex(colourconversion.r*255.0,colourconversion.g*255.0,colourconversion.b*255.0);
                            // liveryData[0][0]['Layers'][currentLayer].Channels[t].tint;
        
                        }

                        if(t==1) // 
                            document.getElementById('sponsorpaintbutton').style.backgroundColor = newcol;//"rgb(255,0,0)";
        
                        var tmpv4 = new THREE.Vector4(colourconversion.r,colourconversion.g,colourconversion.b,1.0);
                        if(t==0)
                            self.mapUniforms.decalTint.value = tmpv4;
                        else if(t==1)
                            self.mapUniforms.decal2Tint.value = tmpv4;
                    }
                }
                // self.thepatternelement.classList.add('patternSelected');
                self.currentPatternElement = self.thepatternelement;
                
                // // Show description name
                // self.currentPatternElement.children[0].classList.remove('hidden');

            }, forceddelay);

        });
    }
    //======


    changePattern(which,thefile,mapUniforms,
        thepatternelement,patternsData,liveryData,currentLayer,
        f1MetalRoughmapUniforms,f1Text,f1SpecialFX,f1Aws, visormaterial, isHelmet, f1Garage) {

        const patternId = thepatternelement.getAttribute("patternId");

        //
        var debMsg = ">> Picked pattern = " + which + " id='"+ patternId +"'\n    " + "file = " + thefile;
        if(thefile!='smallredimage.png')
            debMsg = debMsg + " name= " + patternsData['Patterns'][which].name+ "\n   " + patternsData['Patterns'][which].image;
        
        if(DEBUG_MODE)
            console.log(debMsg);


    

        // if(this.currentPatternElement!=0) {
        //     this.currentPatternElement.classList.remove('patternSelected');
        //     this.currentPatternElement.children[0].classList.add('hidden');
        // }

        var isNone = false;
        if(patternsData['Patterns'][which].id == -1 && currentLayer!=0) { // a null one
            if(currentLayer==0) {
                document.getElementById('layer1patterns_ins').classList.remove('disabledButton');
                // never!
            }
            else if(currentLayer==1) {
                isNone=true;
                document.getElementById('layer2tags_ins').classList.remove('disabledButton');
                document.getElementById('taginput').classList.add('disabledButton');
                document.getElementById('tagpaintbutton').classList.add('disabledButton');
                document.getElementById('tagstylepaintbutton').classList.add('disabledButton');                
                mapUniforms.useTag.value = 0;

                f1SpecialFX.mapUniforms.useTag.value = 0;
                f1MetalRoughmapUniforms.useTag.value = 0;

                // thepatternelement.classList.add('patternSelected');
                this.currentPatternElement = thepatternelement;
                // // Show description name
                // this.currentPatternElement.children[0].classList.remove('hidden');


            }
            else if(currentLayer==2) {
                isNone=true;

                document.getElementById('layer3sponsors_ins').classList.remove('disabledButton');
                mapUniforms.useDecal.value = 0;
                f1MetalRoughmapUniforms.useDecal.value = 0;

                f1SpecialFX.mapUniforms.useDecal.value = 0;

                // thepatternelement.classList.add('patternSelected');
                this.currentPatternElement = thepatternelement;
                // // Show description name
                // this.currentPatternElement.children[0].classList.remove('hidden');

            }
 
        }

        // IS A PATTERN/TAG/SPONSOR
        
        var self = this;
        if(DEBUG_MODE)
            console.log(">>>> Texture image = attempt load > " + thefile);

//          
        clearTimeout(this.patternLoaderTimeout);
        this.patternLoaderTimeout = setTimeout(function() {
            if(DEBUG_MODE)
                console.log(">>>> ********* TIMED OUT - RETRY > "+thefile);

            self.patternTexture=0; // todo try this to remove chance of texure now loading twice...
            self.changePattern(which,thefile,mapUniforms,
                thepatternelement,patternsData,liveryData,currentLayer,
                f1MetalRoughmapUniforms,f1Text,f1SpecialFX,f1Aws,visormaterial,isHelmet,f1Garage);

        }, 4000); 


// todo refactor this requirement to keep hold of these vals as the nowloadtexture lose them elsewise
        this.thefile = thefile;
        this.f1SpecialFX = f1SpecialFX;
        this.liveryData = liveryData;
        this.currentLayer = currentLayer;
        this.patternId = patternId;
        this.mapUniforms =mapUniforms;
        this.f1MetalRoughmapUniforms =f1MetalRoughmapUniforms;
        this.isNone = isNone;
        this.patternsData = patternsData;
        this.which = which;
        this.f1Text = f1Text;
        this.thepatternelement = thepatternelement;
        this.visormaterial = visormaterial;
        this.isHelmet = isHelmet;
        this.f1Garage = f1Garage;

        if(thefile == 'smallredimage.png') {
            this.nowloadtexture('./assets/textures/' + thefile,this);
        }
        else if(thefile == 'smallblankimage.png') {
            this.nowloadtexture('./assets/textures/' + thefile,this);
        }
        else {
            if(currentLayer==0)
                f1Aws.loadfromAWS('patterns',thefile,4,this.nowloadtexture,this); // jpg
            else 
                f1Aws.loadfromAWS('patterns',thefile,3,this.nowloadtexture,this);
        }


    }
    //======

}


export { PatternItems };
