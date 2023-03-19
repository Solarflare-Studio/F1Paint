import * as THREE from '../node_modules/three/build/three.module.js';
import {DEBUG_MODE} from './adminuser'

class F1Text {

   
    constructor(f1Layers_mapUniforms, f1MetalRough_mapUniforms,f1SpecialFX_mapUniforms) {

        this.f1Layers_mapUniforms = f1Layers_mapUniforms;
        this.f1MetalRough_mapUniforms = f1MetalRough_mapUniforms;
        this.f1SpecialFX_mapUniforms = f1SpecialFX_mapUniforms;
        this.fontstyle = 0;
        this.processJSON = 0;

        this.sizecanvas = 1024;

        this.isActive = false;

        this.textTexture = 0;
        this.tagPattern = 0;
        this.tagComposite = 0;
        // this.locations = 0;

        // this.posX = 0.5;
        // this.posY = 0.5;
        // this.size = 1.0;
        // this.rot = 0;

        var _self=this;

        this.currentStyle = -1;


        // this.f1Garagemat = f1Garage.garageWall.material;

        this.locos = new Array();
        // x,y,size, rotation
        // this.locos.push([ 0.466 - 0.26,-0.678 -0.09, 0.133 +0.08, 90 +180]); // left side
        this.locos.push([ - 0.26, -0.09, 0.08, 180]); // left side
        this.locos.push([-0.14, -0.23, 0.08,180]); // right side
//        this.locos.push([0.24, -0.375, 0.1,  90]); // front nose
        this.locos.push([0.266, -0.375, 0.09,  90]); // front nose

        //
       //left
       this.locosstylemods = new Array();
       this.locosstylemods.push([ - 0.223, -0.111, 0.144, 180]); // left side
       this.locosstylemods.push([ - 0.259, -0.122, 0.107, 180]); // left side
       this.locosstylemods.push([ - 0.261, -0.115, 0.072, 180]); // left side
       this.locosstylemods.push([ - 0.259, -0.122, 0.097, 180]); // left side
       this.locosstylemods.push([ - 0.259, -0.122, 0.097, 180]); // left side
       this.locosstylemods.push([ - 0.224, -0.112, 0.153, 180]); // left side
       this.locosstylemods.push([ - 0.224, -0.114, 0.184, 180]); // left side
       this.locosstylemods.push([ - 0.259, -0.122, 0.097, 180]); // left side
       this.locosstylemods.push([ - 0.259, -0.119, 0.078, 180]); // left side

       //right
       this.locosstylemods2 = new Array();
       this.locosstylemods2.push([ - 0.177, -0.256, 0.144, 180]); 
       this.locosstylemods2.push([ - 0.143, -0.263, 0.107, 180]); 
       this.locosstylemods2.push([ - 0.143, -0.263, 0.072, 180]);
       this.locosstylemods2.push([ - 0.142, -0.264, 0.097, 180]);
       this.locosstylemods2.push([ - 0.142, -0.264, 0.097, 180]);
       this.locosstylemods2.push([ - 0.175, -0.254, 0.153, 180]);
       this.locosstylemods2.push([ - 0.176, -0.254, 0.184, 180]);
       this.locosstylemods2.push([ - 0.142, -0.264, 0.097, 180]);
       this.locosstylemods2.push([ - 0.142, -0.264, 0.078, 180]);

       //nose
       this.locosstylemods3 = new Array();
       this.locosstylemods3.push([ 0.266, -0.375, 0.09,  90]); 
       this.locosstylemods3.push([ 0.266, -0.375, 0.09,  90]); 
       this.locosstylemods3.push([ 0.266, -0.376, 0.068,  90]); 
       this.locosstylemods3.push([ 0.262, -0.376, 0.093,  90]); 
       this.locosstylemods3.push([ 0.263, -0.376, 0.09,  90]); 
       this.locosstylemods3.push([ 0.266, -0.375, 0.09,  90]); 
       this.locosstylemods3.push([ 0.266, -0.375, 0.09,  90]); 
       this.locosstylemods3.push([ 0.266, -0.375, 0.09,  90]); 
       this.locosstylemods3.push([ 0.264, -0.376, 0.08,  90]); 


        document.getElementById('c_tagXSlider').value = _self.locos[0][0] * 1000.0;
        document.getElementById('c_tagYSlider').value = _self.locos[0][1] * 1000.0;
        document.getElementById('c_tagScaleSlider').value = _self.locos[0][2] * 1000.0;
        document.getElementById('c_tagRotSlider').value = _self.locos[0][3] * 100.0;

        document.getElementById('c_tagXSliderTxt').value = "x= " + _self.locos[0][0];
        document.getElementById('c_tagYSliderTxt').value = "y= " + _self.locos[0][1];
        document.getElementById('c_tagScaleSliderTxt').value = "scale= " + _self.locos[0][2];
        document.getElementById('c_tagRotSliderTxt').value = "rot= " + _self.locos[0][3];
        // this.posX = -0.9;
        // this.posY = -0.43;
        // this.size = 0.125;
        // this.rot = -180;

        // console sliders
        document.getElementById('c_whichtag').onchange = function (){
            const loco = this.value;

            document.getElementById('c_tagXSlider').value = _self.locos[loco][0] * 1000.0;
            document.getElementById('c_tagYSlider').value = _self.locos[loco][1] * 1000.0;
            document.getElementById('c_tagScaleSlider').value = _self.locos[loco][2] * 1000.0;
            document.getElementById('c_tagRotSlider').value = _self.locos[loco][3] * 100.0;            

            document.getElementById('c_tagXSliderTxt').innerHTML = "x= " + _self.locos[loco][0];
            document.getElementById('c_tagYSliderTxt').innerHTML = "y= " + _self.locos[loco][1];
            document.getElementById('c_tagScaleSliderTxt').value = "scale= " + _self.locos[loco][2];
            document.getElementById('c_tagRotSliderTxt').value = "rot= " + _self.locos[loco][3];
    
            if(DEBUG_MODE)
                console.log("chosen loco");
        }

        document.getElementById('c_tagXSlider').addEventListener('input', function() {
            const loco = document.getElementById('c_whichtag').value;
            _self.locos[loco][0] = this.value / 1000.0;
            document.getElementById('c_tagXSliderTxt').innerHTML = "x= " + _self.locos[loco][0];
            _self.composite();
        });
        document.getElementById('c_tagYSlider').addEventListener('input', function() {
            const loco = document.getElementById('c_whichtag').value;
            _self.locos[loco][1] = this.value / 1000.0;
            document.getElementById('c_tagYSliderTxt').innerHTML = "y= " + _self.locos[loco][1];
            _self.composite();
        });
        document.getElementById('c_tagScaleSlider').addEventListener('input', function() {
            const loco = document.getElementById('c_whichtag').value;
            _self.locos[loco][2] = this.value / 1000.0;
            document.getElementById('c_tagScaleSliderTxt').innerHTML = "scale= " + _self.locos[loco][2];
            _self.composite();
        });
        document.getElementById('c_tagRotSlider').addEventListener('input', function() {
            const loco = document.getElementById('c_whichtag').value;
            _self.locos[loco][3] = this.value / 100.0;
            document.getElementById('c_tagRotSliderTxt').innerHTML = "rot= " + _self.locos[loco][3];
            _self.composite();
        });
//

        // document.getElementById('c_tagXSlider').onchange = function () {
        //     const loco = document.getElementById('c_whichtag').value;
        //     _self.locos[loco][0] = this.value / 1000.0;
        //     document.getElementById('c_tagXSliderTxt').innerHTML = "x= " + _self.locos[loco][0];
        //     _self.composite();
        // }
        // document.getElementById('c_tagYSlider').onchange = function () {
        //     const loco = document.getElementById('c_whichtag').value;
        //     _self.locos[loco][1] = this.value / 1000.0;
        //     document.getElementById('c_tagYSliderTxt').innerHTML = "y= " + _self.locos[loco][1];
        //     _self.composite();
        // }
        // document.getElementById('c_tagScaleSlider').onchange = function () {
        //     const loco = document.getElementById('c_whichtag').value;
        //     _self.locos[loco][2] = this.value / 1000.0;
        //     document.getElementById('c_tagScaleSliderTxt').innerHTML = "scale= " + _self.locos[loco][2];
        //     _self.composite();
        // }

        // document.getElementById('c_tagRotSlider').onchange = function () {
        //     const loco = document.getElementById('c_whichtag').value;
        //     _self.locos[loco][3] = this.value / 1000.0;
        //     document.getElementById('c_tagRotSliderTxt').innerHTML = "rot= " + _self.locos[loco][3];
        //     _self.composite();
        // }


    }
    // =======================


    init(processJSON) {
        if(DEBUG_MODE)
            console.log(">> init F1 Text pipeline");
        var _self = this;
        this.processJSON = processJSON;

        this.loadedFonts = false;

        const font = new FontFace('F1PaintShopWideFont', 'url("./assets/fonts/Formula1-Display-Wide.otf")');
        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
        });

        //


        let inputField = document.getElementById('taginput');
        _self.textTexture = _self.createText("F1", 1);

        // _self.composite();

        inputField.addEventListener("click", function() {
            inputField.placeholder = inputField.value;
            inputField.value = "";
            
        });


        inputField.addEventListener('input', function() {
            var letters = /^[A-Za-z0-9]+$/;
            if(this.value.match(letters)) {
                this.value = this.value.toUpperCase();
                _self.fixText();
                _self.composite();
            }
            else {
                // prevent typing invalid characters
                var lastValidValue = this.getAttribute('data-last-valid-value');
                if (lastValidValue) {
                    this.value = lastValidValue;
                } else {
                    this.value = 'F1';
                }            
            }
            this.setAttribute('data-last-valid-value', this.value);

        });


        var _self = this;
    }
    //======================
    fixText() {
        let inputField = document.getElementById('taginput');
        let inputValue = inputField.value;
        if(DEBUG_MODE)
            console.log(inputValue);
        const styletype = this.processJSON.liveryData['Layers'].tagfontstyle; // tag layer
        this.textTexture = this.createText(inputValue,styletype);
        this.processJSON.liveryData.tagtext = inputValue;


        // this.f1Garagemat.map = this.textTexture;
        // this.f1Garagemat.needsUpdate = true;

    }
    //======================
    drawTextAt(loco,context) {
        context.save();
        const x = this.locos[loco][0];
        const y = this.locos[loco][1];
        const size = this.locos[loco][2];
        const rot = this.locos[loco][3];
        
        // Translate the context to the center of the object.
        context.translate((x + 0.5) * this.sizecanvas, (y + 0.5) * this.sizecanvas);
        
        // Rotate the context.
        context.rotate(rot * Math.PI / 180);
        
        // Draw the object at the new position, which is now its center.
        context.drawImage(
            this.textTexture.image, 
            -0.5 * this.sizecanvas * size, 
            -0.5 * this.sizecanvas * size, 
            this.sizecanvas * size, 
            this.sizecanvas * size
        );
        
        // Translate the context back to the original position.
        context.translate(-(x + 0.5) * this.sizecanvas, -(y + 0.5) * this.sizecanvas);
        
        context.restore();
        


        // context.save();
        // const x =  this.locos[loco][0];
        // const y =  this.locos[loco][1];
        // const size =  this.locos[loco][2];
        // const rot = this.locos[loco][3];

        // // context.translate(x*this.sizecanvas, y*this.sizecanvas);


        // context.rotate(( rot) * Math.PI / 180);

        // context.drawImage(this.textTexture.image, 0, 0,this.textTexture.image.width, this.textTexture.image.height, 
        //     x*this.sizecanvas, y*this.sizecanvas, this.sizecanvas*size, this.sizecanvas*size);
        // // context.drawImage(this.textTexture.image, -this.textTexture.image.width/2, -this.textTexture.image.height/2,this.textTexture.image.width, this.textTexture.image.height, 
        // //     x*this.sizecanvas, y*this.sizecanvas, this.sizecanvas*size, this.sizecanvas*size);
    
        // context.restore();
    }



    //======================
    composite() {
        


        // this.fixText();

        let canvas = document.createElement('canvas');
        canvas.width = this.sizecanvas;
        canvas.height = this.sizecanvas;
        let context = canvas.getContext('2d');


        // context.drawImage(this.tagPattern,0,0,sizecanvas,sizecanvas);
        context.drawImage(this.tagPattern.image, 0, 0,this.tagPattern.image.width, this.tagPattern.image.height, 0, 0, this.sizecanvas, this.sizecanvas);

        // console.log(">> tag text locations type = " + this.locations);
        // if(this.locations==0) {

        // }
        // else if(this.locations==1) {

        // }

        this.drawTextAt(0,context);
        this.drawTextAt(1,context);
        this.drawTextAt(2,context);
        // this.drawTextAt(3,context);
        // this.drawTextAt(4,context);
        // // this.drawTextAt(5,context);
        // this.drawTextAt(6,context);
        // this.drawTextAt(7,context);

        // if(this.isActive && this.isDebug) {

        // // for debug placement of text
        //     if(this.rot!=0) {
        //         context.save();
        //         // context.translate(sizecanvas*0.5, sizecanvas*0.5);
        //         // context.rotate((90 * this.rot) * Math.PI / 180);
        //         context.rotate(( this.rot) * Math.PI / 180);
        //     }

        //     // context.drawImage(this.textTexture.image, 0, 0,this.textTexture.image.width, this.textTexture.image.height, 0, 0, sizecanvas, sizecanvas);
        //     context.drawImage(this.textTexture.image, 0, 0,this.textTexture.image.width, this.textTexture.image.height, 
        //         this.posX*this.sizecanvas, this.posY*this.sizecanvas, this.sizecanvas*this.size, this.sizecanvas*this.size);

        //     if(this.rot!=1) {
        //         context.restore();
        //     }
            
        // }    

        let texture = new THREE.CanvasTexture(canvas);
        this.tagComposite = texture;

        this.f1Layers_mapUniforms.texture2Tag.value = this.tagComposite;
        this.f1MetalRough_mapUniforms.texture2Tag.value = this.tagComposite;

        this.f1SpecialFX_mapUniforms.texture1Base.value = this.tagComposite;


        canvas.remove(); // probably!




    }
    //======================
    actualCreateText(text,styletype) {
        // Create a canvas element
        // const sizecanvas = 1024;
//premerge        const sizefont = this.sizecanvas * 0.5;
        const sizefont = this.sizecanvas * 0.45;

        var sizemodifier = 1.0;
        let canvas = document.createElement('canvas');
        canvas.width = this.sizecanvas;
        canvas.height = this.sizecanvas;


        // Get the 2D rendering context from the canvas
        let context = canvas.getContext('2d');
        context.lineWidth = 0;

        context.fillStyle = 'rgb(0,255,0)';// 'green';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // to confirm todo
        /*
        context.lineJoin = 'round';
        context.fillStyle = "white"
        // stroke color
        context.strokeStyle = 'red';
        // context.strokeText('ABCDEFGHIJKLMNOPQRSTUVWXYZ!', x, y);
        // context.fillText('ABCDEFGHIJKLMNOPQRSTUVWXYZ!', x, y); 
        */




        // Set the font and color for the text
        // context.font = '48px sans-serif'; //todo
        // context.font = sizefont + 'px sans-serif'; //todo

        var fontdesc = "px ";
        var needsoutline = false;
        var needsgapoutline = false;

        sizemodifier = 0.75;
        this.locos[0] = this.locosstylemods[styletype-1];
        this.locos[1] = this.locosstylemods2[styletype-1];
        this.locos[2] = this.locosstylemods3[styletype-1];


        switch (styletype) {
            case 1:
                fontdesc += "F1PaintShopBoldFont";
                context.lineJoin = 'round';
                needsgapoutline=true;
                sizemodifier = 0.75;
                break;
            case 2:
                fontdesc += "F1PaintShopBoldFont";
                sizemodifier = 0.75;
                needsoutline = false;
                break;
            case 3:
                fontdesc += "F1PaintShopWideFont";
                sizemodifier = 0.5;
                needsoutline = false;
                break;
            case 4:
                fontdesc += "F1PaintShopBoldFont";
                sizemodifier = 0.75;
                needsoutline = false;
                break;
            case 5:
                fontdesc += "F1PaintShopBoldFont";
                sizemodifier = 0.75;
                needsoutline = false;
                break;
            case 6:
                fontdesc += "F1PaintShopWideFont";
                sizemodifier = 0.45;
                needsoutline = true;
                break;
            case 7:
                fontdesc += "F1PaintShopBoldFont";
                sizemodifier = 0.75;
                needsoutline = true;
                break;
            case 8:
                fontdesc += "F1PaintShopBoldFont";
                sizemodifier = 0.75;
                needsoutline = true;

                break;
            case 9:
                fontdesc += "F1PaintShopBoldFont";
                sizemodifier = 0.75;
                needsoutline = false;
                break;
        }
/*
        if(styletype==0) { // 
            fontdesc += "F1PaintShopBoldFont";
        }
        else if(styletype==1) { // 
            fontdesc += "F1PaintShopWideFont";
            sizemodifier = 0.55;
        }
        else if(styletype==2) { // 
            fontdesc += "F1PaintShopBoldFont";
        }
        else if(styletype==3) { // 
            fontdesc += "F1PaintShopWideFont";
            sizemodifier = 0.55;
        }
        else if(styletype==4) { // needs outline
            needsoutline=true;
            fontdesc += "F1PaintShopBoldFont";
            sizemodifier = 1.1;
            context.lineJoin = 'round';

        }
        else if(styletype==5) { // needs outline
            // needsoutline=true;
            needsgapoutline=true;
            fontdesc += "F1PaintShopWideFont";
            sizemodifier = 0.55;
            context.lineJoin = 'round';

        }

*/

        // if(styletype==0) // normal
        //     fontdesc += "F1PaintShopFont";
        // else if(styletype==1) // bold
        //     fontdesc += "F1PaintShopBoldFont";
        // else if(styletype==2) // black
        //     fontdesc += "F1PaintShopBlackFont";
        // else if(styletype==3) // wide
        //     fontdesc += "F1PaintShopWideFont";

        context.font = (sizefont*sizemodifier) + fontdesc;// 'px F1PaintShopFont';
        


        
        // Draw the text on the canvas
        // for(var i=0;i<sizecanvas;i+=sizefont) {
        //     for(var j=0;j<sizecanvas;j+=sizefont) {
        //         context.fillText(text, i, j);
        //     }
        // }




        if(needsoutline) {
            context.strokeStyle = 'rgb(255,0,0)';
            if(styletype==8) {
                context.fillStyle = 'rgb(0,255,0)';// ;
                // context.fillStyle = 'rgb(0,0,0)';// 'red';
                context.strokeStyle = 'rgb(255,0,0)';
            }
            context.lineWidth = sizefont*0.08*sizemodifier;
            context.strokeText(text, this.sizecanvas*0.5,sizefont);
            context.fillText(text, this.sizecanvas*0.5,sizefont);// sizefont);
        }
        else if(needsgapoutline) {
            context.strokeStyle = 'rgb(0,255,0)';

            context.lineWidth = sizefont*0.5*sizemodifier;
            context.strokeText(text, this.sizecanvas*0.5,sizefont);

            context.strokeStyle = 'rgb(255,0,0)';
            context.lineWidth = sizefont*0.35*sizemodifier;
            context.strokeText(text, this.sizecanvas*0.5,sizefont);

            context.fillText(text, this.sizecanvas*0.5,sizefont);// sizefont);

        }
        else
            context.fillText(text, this.sizecanvas*0.5,sizefont);// sizefont);





        // Create a texture from the canvas
        let texture = new THREE.CanvasTexture(canvas);

        canvas.remove(); // probably!
        return texture;

    }
    //======================
    createText(text, styletype) {

        this.currentStyle = styletype;
        return this.actualCreateText(text,styletype);

        var self = this;
        if(!this.loadedFont) {
            // force preload wide font
            const font = new FontFace('F1PaintShopWideFont', 'url("./assets/fonts/Formula1-Display-Wide.otf")');
            font.load().then((loadedFont) => {
                document.fonts.add(loadedFont);
                return self.actualCreateText(text,styletype);
            });
        }
        else {
            return self.actualCreateText(text,styletype);
        }


    }

    //======================

}

export { F1Text };

