import * as THREE from '../node_modules/three/build/three.module.js';



class F1Text {

   
    constructor(f1Layers_mapUniforms, f1MetalRough_mapUniforms) {

        this.f1Layers_mapUniforms = f1Layers_mapUniforms;
        this.f1MetalRough_mapUniforms = f1MetalRough_mapUniforms;
        this.processJSON = 0;//liveryData;
        
        this.sizecanvas = 1024;

        this.isActive = false;
        this.isDebug = false;

        this.textTexture = 0;
        this.tagPattern = 0;
        this.tagComposite = 0;
        this.locations = 0;

        this.posX = 0.5;
        this.posY = 0.5;
        this.size = 1.0;
        this.rot = 0;




        // this.f1Garagemat = f1Garage.garageWall.material;

        this.locos = new Array();
        // x,y,size, rotation
        this.locos.push([ 0.48,-0.66, 0.145, 90]); // left side
//        this.locos.push([ 0.66,-0.68, 0.12, 90]); // left side

        this.locos.push([-0.57, 0.71, 0.145,-90]); // right side
        // this.locos.push([-0.73, 0.67, 0.21,-90]); // right side
        this.locos.push([-0.895, -0.422, 0.105,  -180]); // front nose






        this.locos.push([-0.16, 0.89, 0.11,270]); // left front fin
        this.locos.push([ 0.04, 0.04, 0.11,  0]); // right front fin


        this.locos.push([-0.3,-0.25, 0.10,180]); // left top mid
        this.locos.push([-0.6,-0.24, 0.10,180]); // right top mid

        this.locos.push([-0.66,-0.26, 0.23,180]); // right side large


        // this.locos.push([ 0.82, 0.21, 0.10,  0]); // front nose

        this.posX = -0.9;
        this.posY = -0.43;
        this.size = 0.125;
        this.rot = -180;



        // this.init();
    }



    init(processJSON) {
        console.log(">> init F1 Text pipeline");
        var _self = this;

        //
        document.addEventListener("keydown", onDocumentKeyDown, false);
        function onDocumentKeyDown(event) {
            if(_self.isActive ) {
                var keyCode = event.which;
                const step = 0.001;
                console.log(">> key pressed = " + keyCode);
                if (keyCode == 87) { // w
                    _self.posY += step; 
                } else if (keyCode == 83) { // s
                    _self.posY -= step;
                } else if (keyCode == 65) { // a
                    _self.posX -= step;
                } else if (keyCode == 68) { //d
                    _self.posX += step;
                } else if (keyCode == 81) { // q
                    _self.size -= 0.01;
                } else if (keyCode == 69) { // e
                    _self.size += 0.01;
                } else if (keyCode == 82) { // r
                    _self.rot +=5;
    //                if(_self.rot==4) _self.rot = 0;
                } else if (keyCode == 84) { // t
                    _self.rot -=5;
                } else if (keyCode == 223) { // `
                    _self.isDebug=!_self.isDebug;
                }                    
                console.log("x,y,s,r = " + _self.posX + ", " + _self.posY + ", " + _self.size + ", " + _self.rot);
                _self.composite();
            }
        };        




        //


        let inputField = document.getElementById('taginput');
        _self.textTexture = _self.createText("F1");

        // _self.composite();


        inputField.addEventListener('input', function() {
        //   let inputValue = inputField.value;
        //   console.log(inputValue);
        //   _self.textTexture = _self.createText(inputValue);
            _self.fixText(processJSON);
            _self.composite();
        //   _self.f1Layers_mapUniforms.texture2Tag.value = _self.tagComposite;
        //   _self.f1MetalRough_mapUniforms.texture2Tag.value = _self.tagComposite;


        });


        var _self = this;
    }
    //======================
    fixText(processJSON) {
        let inputField = document.getElementById('taginput');
        let inputValue = inputField.value;
        console.log(inputValue);
        this.textTexture = this.createText(inputValue);
        processJSON.liveryData.tagtext = inputValue;


        // this.f1Garagemat.map = this.textTexture;
        // this.f1Garagemat.needsUpdate = true;

    }
    //======================
    drawTextAt(loco,context) {
        context.save();
        const x =  this.locos[loco][0];
        const y =  this.locos[loco][1];
        const size =  this.locos[loco][2];
        const rot = this.locos[loco][3];

        // context.translate(x*this.sizecanvas, y*this.sizecanvas);


        context.rotate(( rot) * Math.PI / 180);

        context.drawImage(this.textTexture.image, 0, 0,this.textTexture.image.width, this.textTexture.image.height, 
            x*this.sizecanvas, y*this.sizecanvas, this.sizecanvas*size, this.sizecanvas*size);
        // context.drawImage(this.textTexture.image, -this.textTexture.image.width/2, -this.textTexture.image.height/2,this.textTexture.image.width, this.textTexture.image.height, 
        //     x*this.sizecanvas, y*this.sizecanvas, this.sizecanvas*size, this.sizecanvas*size);
    
        context.restore();
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
        if(this.locations==0) {

        }
        else if(this.locations==1) {

        }

        this.drawTextAt(0,context);
        this.drawTextAt(1,context);
        this.drawTextAt(2,context);
        // this.drawTextAt(3,context);
        // this.drawTextAt(4,context);
        // // this.drawTextAt(5,context);
        // this.drawTextAt(6,context);
        // this.drawTextAt(7,context);

        if(this.isActive && this.isDebug) {

        // for debug placement of text
            if(this.rot!=0) {
                context.save();
                // context.translate(sizecanvas*0.5, sizecanvas*0.5);
                // context.rotate((90 * this.rot) * Math.PI / 180);
                context.rotate(( this.rot) * Math.PI / 180);
            }

            // context.drawImage(this.textTexture.image, 0, 0,this.textTexture.image.width, this.textTexture.image.height, 0, 0, sizecanvas, sizecanvas);
            context.drawImage(this.textTexture.image, 0, 0,this.textTexture.image.width, this.textTexture.image.height, 
                this.posX*this.sizecanvas, this.posY*this.sizecanvas, this.sizecanvas*this.size, this.sizecanvas*this.size);

            if(this.rot!=1) {
                context.restore();
            }
            
        }    

        let texture = new THREE.CanvasTexture(canvas);
        this.tagComposite = texture;

        this.f1Layers_mapUniforms.texture2Tag.value = this.tagComposite;
        this.f1MetalRough_mapUniforms.texture2Tag.value = this.tagComposite;


        canvas.remove(); // probably!




    }
    //======================
    createText(text) {
        // Create a canvas element
        // const sizecanvas = 1024;
        const sizefont = this.sizecanvas * 0.5;
        let canvas = document.createElement('canvas');
        canvas.width = this.sizecanvas;
        canvas.height = this.sizecanvas;

        // Get the 2D rendering context from the canvas
        let context = canvas.getContext('2d');

        // Set the font and color for the text
        // context.font = '48px sans-serif'; //todo
        // context.font = sizefont + 'px sans-serif'; //todo
        context.font = sizefont + 'px F1PaintShopFont';
        
        context.fillStyle = 'green';


        
        // Draw the text on the canvas
        // for(var i=0;i<sizecanvas;i+=sizefont) {
        //     for(var j=0;j<sizecanvas;j+=sizefont) {
        //         context.fillText(text, i, j);
        //     }
        // }
        context.fillText(text, 0, sizefont);

        // Create a texture from the canvas
        let texture = new THREE.CanvasTexture(canvas);

        canvas.remove(); // probably!
        return texture;

        // Create a material for the text
        let textMaterial = new THREE.MeshBasicMaterial({ map: texture });

        // Create a plane geometry for the text
        let textGeometry = new THREE.PlaneGeometry(canvas.width, canvas.height);

        // Create a mesh for the text
        let textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Add the text mesh to the scene
        scene.add(textMesh);        
    }

    //======================

}

export { F1Text };


