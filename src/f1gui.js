import * as THREE from '../node_modules/three/build/three.module.js';
import { TWEEN } from '../node_modules/three/examples/jsm/libs/tween.module.min'
import {DEBUG_MODE} from './adminuser'

const totalfilestoloadperc = 85;
var currentProgress = 0;
var isAutoSelectingPattern = true; // to indicate whether user has actually clicked on thumb or part of auto procedure setting up
let selectedLanguage = document.querySelector("#selectedLanguage");
selectedLanguage.innerHTML = "English";
// new html

const dropdownArrow = document.querySelector("#dropdownArrow");
export function uihandlelanguageSelect() {
    dropdownArrow.classList.toggle("rotate-180");
}



export function uihandlelanguageChange(e,f1Aws) {
  var languageArr = e.split(',');
  const langfile = languageArr[2] +"/" + languageArr[1]; // filename for language
  selectedLanguage.innerHTML = languageArr[0];
//   console.log('>>>>>>      lingo = ' + languageArr[0]);

  f1Aws.loadfromAWS('languages',langfile,1,null,f1Aws);  
}
















export function setAutoSelectingPattern(_val) {
    isAutoSelectingPattern = _val;
}
export function getAutoSelectingPattern() {
    return isAutoSelectingPattern;
}


export function updateProgress(percent,msg) {
    if(percent==-99) { // reset to 0
        currentProgress=0;
    }
    else {
        // const progress = document.getElementById("progress");
        currentProgress = currentProgress + percent;
        // progress.style.width = ((currentProgress / totalfilestoloadperc)*100) + "%";
        if(DEBUG_MODE)
            console.log(">> percent loaded = " + currentProgress + " - " + msg);
    }
}

class F1Gui {

    constructor(processJSON) {
        // this.backgroundcolourtype = 0;
        // this.colourbackgroundSolidColour = '#FFD933';
        // this.colourbackgroundBottomColour = '#ffff00';
        // this.colourbackgroundTopColour = '#ff0000';
        // this.totalfilestoloadperc = 85;

        this.scaleDevice = 1.0;
        this.currentPage = 1;
        this.inPresets = false;
        // this.currentProgress = 0;
        this.pickingColour = false;

        this.processJSON = processJSON;

        this.bestToolPosY = 0;
        this.tabHeight = 0;

        this.init();
    }

    init() {

    }

    // updateProgress(percent,msg) {
    //     const maxprogress = this.totalfilestoloadperc;
    //     const progress = document.getElementById("progress");
    //     this.currentProgress = this.currentProgress + percent;
    //     progress.style.width = ((this.currentProgress / maxprogress)*100) + "%";
    //     if(DEBUG_MODE)
    //         console.log(">> percent loaded = " + this.currentProgress + " - " + msg);
    // }
    //===================================
    updateProgress2(percent) {
        const maxprogress = 100;
        // const progress = document.getElementById("progress2");
        this.currentProgress = this.currentProgress + percent;
        // progress.style.width = ((this.currentProgress / maxprogress)*100) + "%";
        console.log(">> percent loaded = " + this.currentProgress);
        console.log('>>>> ' + percent + "%");


        document.getElementById("progress2").style.width = percent + "%";

    }




    //======================

    setBackgroundColourByID(_elementID,_col) {        this.setBackgroundColour(document.getElementById(_elementID),_col);    }
    setBackgroundColour(_element,_col) {        _element.style.backgroundColor = _col;    }

    // addClassToElementByID(_elementID,_class) {        document.getElementById(_elementID).classList.add(_class);    }
    // removeClassFromElement(_element,_class) {        _element.classList.remove(_class);    }
    // removeClassFromElementByID(_elementID,_class) {        document.getElementById(_elementID).classList.remove(_class);    }
    //======================



    // //======================
    // showCurrentLayerGUI(_currentLayer, _totLayers) {
    //     for(var l=0;l<_totLayers;l++) {
    //       var id = "layer"+(l+1)+"patterns_ins";
    //       if(l<_currentLayer)
    //         document.getElementById(id).classList.add("hidden");
    //       else if(l>_currentLayer)
    //         document.getElementById(id).classList.add("hidden");
    //       else
    //         document.getElementById(id).classList.remove("hidden");
    //     }
    //   }
    //======================

    // changedLayer(_currentLayer, _totLayers) {

    //     // this.removeClassFromElementByID('f1layerprev','coloursdisabled');
    //     // this.removeClassFromElementByID('patternsPanel','hiddenPatternsPanel');

	// 	if(_currentLayer == 0)
	// 		this.addClassToElementByID('f1layerprev','coloursdisabled');
	// 		// document.getElementById('f1layerprev').classList.add("coloursdisabled");
	// 	else
    //         this.removeClassFromElementByID('f1layerprev','coloursdisabled');
	// 	// document.getElementById('f1layerprev').classList.remove("coloursdisabled");

    //     if(_currentLayer == _totLayers - 1) {
    //         this.addClassToElementByID('f1layernext','coloursdisabled');
    //         this.removeClassFromElementByID('f1launchAR','coloursdisabled');
    //     }
    //     else {
    //         this.removeClassFromElementByID('f1layernext','coloursdisabled');
    //         this.addClassToElementByID('f1launchAR','coloursdisabled');

    //     }

	// 	// this.removeClassFromElementByID('f1layernext','coloursdisabled');
	// 	this.removeClassFromElementByID('patternsPanel','hiddenPatternsPanel');

    //     // this.showCurrentLayerGUI(_currentLayer, _totLayers);

	// 	// this.updateLayerLabel(_currentLayer, _totLayers);


	// 	// this.addClassToElementByID('colourPickerContainer','coloursdisabled_wheel');
	// 	// document.getElementById('colourPickerContainer').classList.add('coloursdisabled_wheel');


    // }












    // //======================
    // updateLayerLabel(_current, _total) {
	//     document.getElementById('f1layercurrent').innerHTML = "Layer " + (_current+1) + " of " + _total;
	// }
    //======================
    // showPresetPage(showit) {
    //     if(showit) {
    //         this.inPresets = true;
    //         document.getElementById('patternColours').classList.add('hidden');
    //         document.getElementById('paintpresetsblock').classList.remove('hidden');

    //         document.getElementById('backbutton').classList.add('hidden');
    //         document.getElementById('nextbutton').classList.add('hidden');
    //         document.getElementById('confirmbutton').classList.remove('hidden');            
    //     }
    //     else {
    //         this.inPresets = false;
    //         document.getElementById('paintpresetsblock').classList.add('hidden');
    //         document.getElementById('patternColours').classList.remove('hidden');

    //         document.getElementById('confirmbutton').classList.add('hidden');            
    //         document.getElementById('backbutton').classList.remove('hidden');
    //         document.getElementById('nextbutton').classList.remove('hidden');
    //     }

    //     // keep confirm button up
    // }
    //======================
	pickedChannelPaint(_index) {
//    pickedChannelPaint(_index) {
        this.pickingColour = true;

        switch (_index) {
            case 0:
                document.getElementById('whichchanneltext').innerHTML = document.getElementById('LK_paint_base').innerHTML;//"BASE COLOUR";
                break;
            case 1:
                document.getElementById('whichchanneltext').innerHTML = document.getElementById('LK_paint_primary').innerHTML;// "PRIMARY COLOUR";
                break;
            case 2:
                document.getElementById('whichchanneltext').innerHTML = document.getElementById('LK_paint_secondary').innerHTML;// "SECONDARY COLOUR";
                break;
            case 3:
                document.getElementById('whichchanneltext').innerHTML = document.getElementById('LK_tagstyle_paint').innerHTML;// "STYLE COLOUR";
                break;
            case 4:
                document.getElementById('whichchanneltext').innerHTML = document.getElementById('LK_tag_paint').innerHTML;// "TAG COLOUR";
                break;
            case 6:
                document.getElementById('whichchanneltext').innerHTML = document.getElementById('LK_sponsor_paint').innerHTML;// "SPONSOR COLOUR";
                break;
        }

        // var layerMsg = "BASE COLOUR";
        // if(_index==1)
        //     layerMsg = "PRIMARY COLOUR";
        // else if(_index==2)
        //     layerMsg = "SECONDARY COLOUR";

        // if(_index<3) { // pattern colours
        //     document.getElementById('patternColours').classList.add('hidden');
        // }
        // else if(_index<5) { // tag colour
        //     document.getElementById('paintatagblock').classList.remove('hidden');
        //     document.getElementById('tagblock').classList.add('hidden');
        //     document.getElementById('layer2tags_ins').classList.add('hidden');

        //     if(_index==3)
        //         layerMsg = "TAG COLOUR";
        //     else if(_index==4)
        //         layerMsg = "STYLE COLOUR";
        // }
        // else if(_index==6) { // sponsor
        //     document.getElementById('paintdecalblock').classList.remove('hidden');
        //     document.getElementById('decalblock').classList.add('hidden');
        //     document.getElementById('layer3decals_ins').classList.add('hidden');

        //     layerMsg = "SPONSOR COLOUR";

        // }

        // document.getElementById('backbutton').classList.add('hidden');
        // document.getElementById('nextbutton').classList.add('hidden');
        // document.getElementById('confirmbutton').classList.remove('hidden');


        // document.getElementById('whichchanneltext').innerHTML = layerMsg;

        // document.getElementById('paintachannelblock').classList.remove('hidden');

        // document.getElementById('colourPickerContainer').classList.remove('hidden');


    }
    //======================
    confirm(selectedChan) {
        // document.getElementById('confirmbutton').classList.add('hidden');
        // this.changedPage(this.currentPage); //refresh current page
    }

    //======================
    getElementColour(_index ) {
        var elementID;
        if(_index==0)
            elementID = 'basepaintbutton';
        else if(_index==1)
            elementID = 'primarypaintbutton';
        else if(_index==2)
            elementID = 'secondarypaintbutton';
        else if(_index==3) // tag style colours
            elementID = 'tagstylepaintbutton';
        else if(_index==4) // tag colours
            elementID = 'tagpaintbutton';
        else if(_index==6) // decal colours (5 is untouchable)
            elementID = 'sponsorpaintbutton';

        return window.getComputedStyle(  document.getElementById(elementID) ,null).getPropertyValue('background-color');
    }

    //======================
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    //======================
    showPage(_page,_hide) {
        this.currentPage = _page;

        // do tab highlights
        // TODO HTML
        // document.getElementById('f1patterntab').classList.remove('f1tabActive');
        // document.getElementById('f1colourtab').classList.remove('f1tabActive');
        // document.getElementById('f1tagtab').classList.remove('f1tabActive');
        // document.getElementById('f1decalstab').classList.remove('f1tabActive');
        // document.getElementById('launchbutton').classList.add('hidden');
        // document.getElementById("launchARPage").classList.add("hidden");
        // document.getElementById("progressbarPage").classList.add("hidden");

        // if(this.currentPage<=1) { // disable back
        //     document.getElementById('backbutton').classList.add('disabledButton');
        //     document.getElementById('nextbutton').classList.remove('disabledButton');
        // }
        // else {
        //     document.getElementById('backbutton').classList.remove('disabledButton');
        //     if(this.currentPage>=5) {
        //         document.getElementById('nextbutton').classList.add('disabledButton');
        //     }
        //     else
        //         document.getElementById('nextbutton').classList.remove('disabledButton');
        // }

        if(_page == 1) { // patterns page
            // document.getElementById('f1patterntab').classList.add('f1tabActive');
            // // document.getElementById("patternColours").classList.add("hidden");

            // document.getElementById("tagblock").classList.add("hidden");
            // document.getElementById("decalblock").classList.add("hidden");

            // document.getElementById("finalPage").classList.add("hidden");
            // document.getElementById('confirmbutton').classList.add('hidden');
            // document.getElementById('nextbutton').classList.remove('hidden');
            // document.getElementById('backbutton').classList.remove('hidden');

            // document.getElementById("layer1patterns_ins").classList.remove("hidden");
            // document.getElementById('paintatagblock').classList.add('hidden');
            // document.getElementById('paintdecalblock').classList.add('hidden');

            // document.getElementById('paintachannelblock').classList.add('hidden');
            // document.getElementById('patternColours').classList.add('hidden');
        }
        else if(_page==2) { // paint
            // document.getElementById('f1colourtab').classList.add('f1tabActive');
            // document.getElementById("layer1patterns_ins").classList.add("hidden");
            // document.getElementById("tagblock").classList.add("hidden");
            // document.getElementById("decalblock").classList.add("hidden");

            // document.getElementById("finalPage").classList.add("hidden");
            // document.getElementById('confirmbutton').classList.add('hidden');
            // document.getElementById('nextbutton').classList.remove('hidden');
            // document.getElementById('backbutton').classList.remove('hidden');

            // document.getElementById("patternColours").classList.remove("hidden");
            // document.getElementById('paintatagblock').classList.add('hidden');
            // document.getElementById('paintachannelblock').classList.add('hidden');


            // document.getElementById('paintdecalblock').classList.add('hidden');
            // document.getElementById('decalblock').classList.add('hidden');
            // document.getElementById('layer3decals_ins').classList.add('hidden');

            // need to make sure the base pattern is loaded into glow sfx

            // TODO HTML
            if(this.processJSON.liveryData['Layers'][0].patternId == -1) {  // a none pattern
                // no 1st pattern selected, so hide second and third paint choices
                // document.getElementById("flexpair").classList.add("hidden");
                document.getElementById('primesecondpaints').classList.add('f1hidden');
                
            }
            else {
                document.getElementById('primesecondpaints').classList.remove('f1hidden');
                // document.getElementById("flexpair").classList.remove("hidden");
            }
        }
        else if(_page==3) { // tags
            // document.getElementById('f1tagtab').classList.add('f1tabActive');
            // document.getElementById("patternColours").classList.add("hidden");
            // document.getElementById("layer1patterns_ins").classList.add("hidden");
            // document.getElementById("finalPage").classList.add("hidden");
            // document.getElementById('confirmbutton').classList.add('hidden');
            // document.getElementById('nextbutton').classList.remove('hidden');
            // document.getElementById('backbutton').classList.remove('hidden');
            // document.getElementById("decalblock").classList.add("hidden");

            // document.getElementById("tagblock").classList.remove("hidden");

            // set tag colour buttons
            var tagstylecolour = this.processJSON.liveryData['Layers'][1].Channels[0].tint;
            var tagcolour = this.processJSON.liveryData['Layers'][1].Channels[1].tint;
            // document.getElementById('tagpaintbutton').style.backgroundColor = tagcolour;
            // document.getElementById('tagstylepaintbutton').style.backgroundColor = tagstylecolour;

            // document.getElementById('paintatagblock').classList.add('hidden');
            // document.getElementById('layer2tags_ins').classList.remove('hidden');

            // document.getElementById('paintachannelblock').classList.add('hidden');
            // document.getElementById('paintdecalblock').classList.add('hidden');
        }
        else if(_page==4) { // decals
            // document.getElementById('f1decalstab').classList.add('f1tabActive');
            // document.getElementById("patternColours").classList.add("hidden");
            // document.getElementById("layer1patterns_ins").classList.add("hidden");
            // document.getElementById("tagblock").classList.add("hidden");
            // document.getElementById("finalPage").classList.add("hidden");
            // document.getElementById('confirmbutton').classList.add('hidden');
            // document.getElementById('nextbutton').classList.remove('hidden');
            // document.getElementById('backbutton').classList.remove('hidden');
            // document.getElementById('paintatagblock').classList.add('hidden');

            // document.getElementById("decalblock").classList.remove("hidden");

            // set decal colour button
            var decalcolour = this.processJSON.liveryData['Layers'][2].Channels[1].tint;
            // document.getElementById('decalpaintbutton').style.backgroundColor = decalcolour;
            // document.getElementById('paintdecalblock').classList.add('hidden');
            // document.getElementById('decalblock').classList.remove('hidden');
            // document.getElementById('layer3decals_ins').classList.remove('hidden');
            // document.getElementById('paintachannelblock').classList.add('hidden');
        }
        else if(_page==5) { // launch AR = todo, is actually prepare paint job
            // document.getElementById("patternColours").classList.add("hidden");
            // document.getElementById("layer1patterns_ins").classList.add("hidden");
            // document.getElementById("tagblock").classList.add("hidden");
            // document.getElementById("decalblock").classList.add("hidden");
            // document.getElementById('paintatagblock').classList.add('hidden');
            // document.getElementById('backbutton').classList.remove('hidden');
            // document.getElementById('nextbutton').classList.add('hidden');
            // document.getElementById('confirmbutton').classList.remove('hidden');
            // document.getElementById("finalPage").classList.remove("hidden");
        }
        else if(_page==6) { // actual launch ar page
            // user has pressed confirm
            // document.getElementById("finalPage").classList.add("hidden");
            // document.getElementById('confirmbutton').classList.add('hidden');
            // document.getElementById('backbutton').classList.add('hidden');
            // document.getElementById('nextbutton').classList.add('hidden');
            // document.getElementById("progressbarPage").classList.remove("hidden");
        }
        else if(_page==7) { // actual launch ar page
            // document.getElementById("progressbarPage").classList.add("hidden");
            // // document.getElementById("ARpage").classList.remove("hidden");
            // document.getElementById('nextbutton').classList.add('hidden');
            // document.getElementById('launchbutton').classList.remove('hidden');
            // // document.getElementById("launchbutton").classList.remove("hidden");
            // document.getElementById("launchARPage").classList.remove("hidden");
            // document.getElementById('backbutton').classList.remove('hidden');
        }

    }
    //======================
    changedPage(topage) {
        this.currentPage = topage;
        if(this.processJSON.liveryData['Layers'][0].patternId==-1) { // is a NONE pattern
            const col = this.processJSON.liveryData['Layers'][0].Channels[0].tint;
            const ele = document.getElementById('basepaintbutton');
            ele.backgroundColor = col;
            // hide primary and second colour pickers...
        }

        var patternThumbElement = 0;
        var hasfound = false;
        var layerindex = 0;
        var patternblock = 0;
        if(topage==1 || topage==2) { // base pattern or base paint
            patternblock = document.getElementById('layer1patterns_ins');
            layerindex = 0;
        }
        else if(topage==3) { // tag
            patternblock = document.getElementById('layer2tags_ins');
            layerindex = 1;
        }
        else if(topage==4) { // sponsor
            patternblock = document.getElementById('layer3sponsors_ins');
            layerindex = 2;
        }

        // seek out thumb element from its pattern id attribute


        if(patternblock!=0) {
            for(var i=0;i<patternblock.children.length;i++) {
                const id= patternblock.children[i].children[1].children[0].children[0].getAttribute('patternId');

//                const id= patternblock.children[i].children[0].getAttribute('patternId');
                if(this.processJSON.liveryData['Layers'][layerindex].patternId == id){
                    // matched!
                    if(DEBUG_MODE)
                        console.log("matched");
                    hasfound=true;
                    // patternThumbElement = patternblock.children[i].children[0];
                    patternThumbElement = patternblock.children[i].children[1].children[0].children[0];
                    break;
                }
            }
        }
        if(!hasfound && DEBUG_MODE)
            console.log(">> **** error finding matching pattern");

        if(topage == 1) { // first page of patterns

            this.showPage( 1, false);

            if(patternThumbElement!=0) {
                //
                setAutoSelectingPattern(true);  // try without !! todo fix
                patternThumbElement.click();
            }
        }
        else if(topage == 2) { // paint

            this.showPage( 2, false);
            if(patternThumbElement!=0) {
                //
                setAutoSelectingPattern( true);  // try without !! todo fix
                patternThumbElement.click();
            }
        }
        else if(topage == 3) { // tags

            this.showPage( 3, false);

            if(patternThumbElement!=0) {
                //
                setAutoSelectingPattern(true);
                patternThumbElement.click();
            }
        }
        else if(topage == 4) { // decals

            this.showPage( 4, false);

            if(patternThumbElement!=0) {
                isAutoSelectingPattern = true;
                patternThumbElement.click();
            }

        }
        else if(topage == 5) { // final page to AR?

            this.showPage( 5, false);



        }

    }




    //======================

    /*
    setBackgroundColours(colors, _col1, _col2, _col3) {
        for(var a=0;a<18;a+=3) {
            if(a<6) { colors[a] = _col1.r; colors[a+1] = _col1.g; colors[a+2] = _col1.b;}
            else if(a<12) { colors[a] = _col2.r; colors[a+1] = _col2.g; colors[a+2] = _col2.b;}
            else { colors[a] = _col3.r; colors[a+1] = _col3.g; colors[a+2] = _col3.b;}
        }
    }

    //======================

    backgroundColourSolid(colourBackgroundButtonOff,colourBackgroundButtonOn,backgroundGradientMesh) {
        this.backgroundcolourtype = 0;
        this.setBackgroundColourByID('coloursolidbut',colourBackgroundButtonOn);
        document.getElementById('coloursolidbut').style.color = '#000000';
        this.setBackgroundColourByID('colourtopbut',colourBackgroundButtonOff);
        document.getElementById('colourtopbut').style.color = '#ffffff';
        this.setBackgroundColourByID('colourbottombut',colourBackgroundButtonOff);
        document.getElementById('colourbottombut').style.color = '#ffffff';

        var solcolour = this.hexToRgb(this.colourbackgroundSolidColour);
        const colors = backgroundGradientMesh.geometry.attributes.color.array;

        this.setBackgroundColours(colors, solcolour, solcolour, solcolour);

    }
    //======================


    togglecolourtop(colourBackgroundButtonOff,colourBackgroundButtonOn,backgroundGradientMesh) {
    	this.backgroundcolourtype = 1;
    	this.setBackgroundColourByID('coloursolidbut',colourBackgroundButtonOff);
        document.getElementById('coloursolidbut').style.color = '#ffffff';

	    this.setBackgroundColourByID('colourtopbut',colourBackgroundButtonOn);
        document.getElementById('colourtopbut').style.color = '#000000';

        this.setBackgroundColourByID('colourbottombut',colourBackgroundButtonOff);
        document.getElementById('colourbottombut').style.color = '#ffffff';

        var solcolourtop = this.hexToRgb(this.colourbackgroundTopColour);
        var solcolour = this.hexToRgb(this.colourbackgroundBottomColour);
        const colors = backgroundGradientMesh.geometry.attributes.color.array;

        this.setBackgroundColours(colors, solcolourtop, solcolour, solcolourtop);

    }

    togglecolourbottom(colourBackgroundButtonOff,colourBackgroundButtonOn,backgroundGradientMesh) {
        this.backgroundcolourtype = 2;

        this.setBackgroundColourByID('coloursolidbut',colourBackgroundButtonOff);
        document.getElementById('coloursolidbut').style.color = '#ffffff';

        this.setBackgroundColourByID('colourtopbut',colourBackgroundButtonOff);
        document.getElementById('colourtopbut').style.color = '#ffffff';

        this.setBackgroundColourByID('colourbottombut',colourBackgroundButtonOn);
        document.getElementById('colourbottombut').style.color = '#000000';


        var solcolourtop = this.hexToRgb(this.colourbackgroundTopColour);
        var solcolour = this.hexToRgb(this.colourbackgroundBottomColour);

        const colors = backgroundGradientMesh.geometry.attributes.color.array;

        this.setBackgroundColours(colors, solcolourtop, solcolour, solcolourtop);

    }
    //======================
    onColourPickedChanged(color,backgroundGradientMesh) {
        let colourstr;
        if(this.backgroundcolourtype==0) //solid
        {
            this.colourbackgroundSolidColour = color.hexString;
            colourstr = createGradientString(this.colourbackgroundSolidColour, this.colourbackgroundSolidColour);

            const colors = backgroundGradientMesh.geometry.attributes.color.array;
            for(var i=0;i<18;i+=3) {
                colors[i+0] = color.red;
                colors[i+1] = color.green;
                colors[i+2] = color.blue;
            }
            backgroundGradientMesh.geometry.attributes.color.needsUpdate = true;
        }
        else if(this.backgroundcolourtype==1) // setting top colour
        {
            this.colourbackgroundTopColour = color.hexString;
            colourstr = createGradientString(this.colourbackgroundTopColour, this.colourbackgroundBottomColour);

            const colors = backgroundGradientMesh.geometry.attributes.color.array;
            for(var i=0;i<18;i+=3) {
                colors[i+0] = color.red;
                colors[i+1] = color.green;
                colors[i+2] = color.blue;
            }
            backgroundGradientMesh.geometry.attributes.color.needsUpdate = true;
        }
        else if(this.backgroundcolourtype==2)
        {
            this.colourbackgroundBottomColour = color.hexString;
            colourstr = createGradientString(this.colourbackgroundTopColour, this.colourbackgroundBottomColour);

            const colors = backgroundGradientMesh.geometry.attributes.color.array;
            for(var i=6;i<12;i+=3) {
                colors[i+0] = color.red;
                colors[i+1] = color.green;
                colors[i+2] = color.blue;
            }

            backgroundGradientMesh.geometry.attributes.color.needsUpdate = true;
        }
        this.getFromID('container').style.backgroundImage = colourstr;
    }
    */
    //======================
    setRendererSize(renderWidth, renderHeight, renderer,camera) {

        renderer.setSize( renderWidth, renderHeight );

        camera.top = renderHeight*0.5;
        camera.bottom = -renderHeight*0.5;
        camera.left = -renderWidth*0.5;
        camera.right = renderWidth*0.5;
        camera.aspect = renderWidth / renderHeight;
        camera.updateProjectionMatrix () ;

        // console.log("toolsPosY = " + toolsPosY + ",  renderHeight = " + renderHeight);


    }
    //======================
    setSize(w,h,renderer,camera, colorPatternPicker ) {

        // TODO HTML calc sizes
        this.bestToolPosY = 360; // from html css
        this.setRendererSize(w,h - this.bestToolPosY, renderer,camera);

        return;
        // TODO HTML


        const rootElement = document.querySelector(':root');
        const toolsElement = document.getElementById('palette_toolsBlock')

        const lerp = (a, b, t) => (b-a)*t+a;
        const unlerp = (a, b, t) => (t-a)/(b-a);
        const map = (a1, b1, a2, b2, t) => lerp(a2, b2, unlerp(a1, b1, t));


        var fontsizepix = 20;
        var gapHeightBase = 19;
//        fontsizepx = w / 20.0;
        const aspectratio = h / w;

        fontsizepix = map(290,800,12,18,w);
        fontsizepix += map(1.5,3.0,-2,2,aspectratio);
        if(DEBUG_MODE)
            console.log(">> ** fontsizepix="+fontsizepix);
        gapHeightBase = map(10,20,0.5,20,fontsizepix);

        if(DEBUG_MODE)
            console.log(fontsizepix + ",aspectratio = " + fontsizepix + ", " + aspectratio );
        // fontsizepix = (fontsizepix*aspectratio*0.8);

        // if(w<290)
        //     fontsizepix = 12;
        // else if(w<320)
        //     fontsizepix = 14;
        // else if(w<500)
        //     fontsizepix = 16;
        // else if(w<800)
        //     fontsizepix = 18;

        // if(h<600) {
        //     fontsizepix = 14;
        //     gapHeightBase = 2;
        //     document.getElementById('redspacer').style.display="none";
        // }
        // else {
        //     document.getElementById('redspacer').style.display="block";
        // }

        rootElement.style.setProperty('--rootFontSize', fontsizepix + 'px');
        rootElement.style.setProperty('--gapHeightBase', gapHeightBase + 'px');

        // colorPatternPicker.handleRadius = fontsizepix * 0.4;
        // colorPatternPicker.width = w * 0.5;
        // colorPatternPicker.props.handleRadius = fontsizepix * 0.4;
        // colorPatternPicker.props.width = w * 0.5;
        // have moved changing colour picker into f1engine, todo check delete / create if onsize...



        //

        // var bottomButtonsHeight = document.getElementById('backornextblock').clientHeight;
        var bottomButtonsHeight = fontsizepix * 2;

        var toolsPosY = h - ((bottomButtonsHeight * 13) + (gapHeightBase*5));
        rootElement.style.setProperty('--toolsPosY', toolsPosY + 'px');
        this.bestToolPosY = toolsPosY;
        this.tabHeight = bottomButtonsHeight * 2;


        document.getElementById('guicontainer').style.height = this.tabHeight + "px";


        var toolsPosX = 0;

        rootElement.style.setProperty('--screenWidth', w + 'px');

        // document.getElementById('my-iframe').style.width = (w-50) + "px";
        // document.getElementById('my-iframe').style.height = (h-50) + "px";
        


        var toolsWidth = w;
        toolsElement.style.width = toolsWidth + 'px';
        toolsElement.style.left = toolsPosX + 'px';
//        toolsElement.style.top = toolsPosY + 'px';

        const patternsWidth = (toolsWidth-36) * 0.45;
        const patternsHeight = patternsWidth * 0.44;
        
        rootElement.style.setProperty('--patternWidth', patternsWidth + 'px');
        rootElement.style.setProperty('--patternHeight', patternsHeight + 'px');


        // also set intro page divider
        // new html todo
        // document.getElementById('tut2block').style.height = toolsPosY + "px";
        // document.getElementById('tut1block').style.height = (h-toolsPosY) + "px";



        // we want to add a bit more to the bottom so that the gui tabs have some 3D window to edges of..
        var clientHeight = this.tabHeight;// document.getElementById('guitabs').clientHeight;

        // set height of bottom panel to always reach bottom

        // TODO NEW HTML

        var mainHeight = document.getElementById('oldmaincontainerblock').offsetHeight ;
        //        document.getElementById('toolscontainer').style.height = (mainHeight - toolsPosY) + 'px';
        //        toolsElement.style.height = (mainHeight - toolsPosY) + 'px';
        document.getElementById('toolscontainer').style.height = (mainHeight - toolsPosY - clientHeight) + 'px';

        var maxHeightPatternsPanel = (mainHeight - toolsPosY - clientHeight) - (bottomButtonsHeight*3);
//        maxHeightPatternsPanel = maxHeightPatternsPanel - (0); // bottom margin
        rootElement.style.setProperty('--layersContainerHeight', maxHeightPatternsPanel + 'px');


        // set max-height of the tags scrolling container
        var tagblock = document.getElementById('tagblock');
        var decalblock = document.getElementById('decalblock');
        var washiddendecal = false;
        if(decalblock.classList.contains('hidden')) {
            washiddendecal = true;
        }




        var tagBlockHeight = document.getElementById('gettagblockheight').clientHeight ;
        if(document.getElementById('tagblock').classList.contains('hidden')) {
            document.getElementById('tagblock').classList.remove('hidden');
            tagBlockHeight = document.getElementById('gettagblockheight').clientHeight ;
            document.getElementById('tagblock').classList.add('hidden');
        }

        rootElement.style.setProperty('--layersTagContainerHeight', (maxHeightPatternsPanel-tagBlockHeight) + 'px');


        var decalBlockHeight = document.getElementById('getdecalblockheight').clientHeight ;
        if(document.getElementById('decalblock').classList.contains('hidden')) {
            document.getElementById('decalblock').classList.remove('hidden');
            decalBlockHeight = document.getElementById('getdecalblockheight').clientHeight ;
            document.getElementById('decalblock').classList.add('hidden');
        }


        rootElement.style.setProperty('--layersDecalsContainerHeight', (maxHeightPatternsPanel - decalBlockHeight) + 'px');


        if(this.currentPage!=3) // not actually in tagblock...
            document.getElementById('tagblock').classList.add('hidden');



        this.setRendererSize(w,toolsPosY + this.tabHeight, renderer,camera);


        // calculate height of tabs to offset the height from top (making them appear in the 3D area, above the top of the rest of the gui)
        // var guitabsHeight = document.getElementById('guitabs').clientHeight;
        // rootElement.style.setProperty('--guiTabHeight', guitabsHeight + 'px');

        if(washiddendecal)
            document.getElementById('decalblock').classList.add('hidden');

    }
    //======================
    /*
    oldsetSize(w,h,renderer,camera) {

        const canvasPositioner = document.getElementById('canvas-positioner')
        // const creditselement = this.getFromID('padcredits')
        const toolsElement = document.getElementById('palette_tools')
        const palette_tools_aboutElement = document.getElementById('palette_tools_about');
        const titleContainerElement = document.getElementById('thetitlecontainer')
        const rootElement = document.querySelector(':root');

        var toolsPosX = 0;
        var toolsPosY = h * 0.55;
        var toolsWidth = 400;
        this.scaleDevice = 1.0;

        // determine good root font size....
        var fontsizepix = 20;
        var gapHeightBase = 19;
        if(w<320)
            fontsizepix = 14;
        else if(w<500)
            fontsizepix = 16;
        else if(w<800)
            fontsizepix = 18;

        //
        if(h<600) {
            fontsizepix = 14;
            gapHeightBase = 2;
        }

        rootElement.style.setProperty('--rootFontSize', fontsizepix + 'px');

        rootElement.style.setProperty('--gapHeightBase', gapHeightBase + 'px');




        if(h>w) { // portrait
            toolsWidth = w;
            // this.getFromID('burgermenu').style.width = (toolsWidth * 0.17 * this.scaleDevice) + 'px';
            // this.getFromID('burgermenu').style.height = (toolsWidth * 0.17 * this.scaleDevice) + 'px';
            // this.getFromID('burgermenu').style.top = (toolsWidth * 0.054 * this.scaleDevice) + 'px';
            // this.getFromID('burgermenu').style.right = (toolsWidth * 0.042 * this.scaleDevice) + 'px';
        }

        // layout tools panel stuff
        toolsElement.style.width = toolsWidth + 'px';
        toolsElement.style.left = toolsPosX + 'px';
        toolsElement.style.top = toolsPosY + 'px';


        var renderHeight = toolsPosY;
        // we want to add a bit more to the bottom so that the gui tabs have some 3D window to edges of..
        var clientHeight = document.getElementById('guitabs').clientHeight;
        renderHeight = renderHeight + clientHeight;

        // set height of bottom panel to always reach bottom
        var mainHeight = document.getElementById('container').offsetHeight ;
        //        document.getElementById('toolscontainer').style.height = (mainHeight - toolsPosY) + 'px';
        //        toolsElement.style.height = (mainHeight - toolsPosY) + 'px';
        document.getElementById('toolscontainer').style.height = (mainHeight - toolsPosY - clientHeight) + 'px';

        var bottomButtonsHeight = document.getElementById('backornextblock').clientHeight;

        var maxHeightPatternsPanel = (mainHeight - toolsPosY - clientHeight) - bottomButtonsHeight;
        maxHeightPatternsPanel = maxHeightPatternsPanel - (19 + 32); // bottom margin
        rootElement.style.setProperty('--layersContainerHeight', maxHeightPatternsPanel + 'px');


        // set max-height of the tags scrolling container
        var tagblock = document.getElementById('tagblock');
        var decalblock = document.getElementById('decalblock');
        var washiddendecal = false;
        if(decalblock.classList.contains('hidden')) {
            washiddendecal = true;
        }




        var tagBlockHeight = document.getElementById('gettagblockheight').clientHeight ;
        if(tagblock.classList.contains('hidden')) {
            tagblock.classList.remove('hidden');
            var tagBlockHeight = document.getElementById('gettagblockheight').clientHeight ;
            tagblock.classList.add('hidden');
        }

        maxHeightPatternsPanel -= tagBlockHeight;

        // maxHeightPatternsPanel = (mainHeight - toolsPosY - clientHeight - tagBlockHeight) - bottomButtonsHeight;
        // maxHeightPatternsPanel = maxHeightPatternsPanel - (19 + 32); // bottom margin
        rootElement.style.setProperty('--layersTagContainerHeight', maxHeightPatternsPanel + 'px');
        if(this.currentPage!=3) // not actually in tagblock...
            document.getElementById('tagblock').classList.add('hidden');



        var renderWidth  = toolsWidth;
        renderer.setSize( renderWidth, renderHeight );

        camera.top = renderHeight*0.5;
        camera.bottom = -renderHeight*0.5;
        camera.left = -renderWidth*0.5;
        camera.right = renderWidth*0.5;
        camera.aspect = renderWidth / renderHeight;
        camera.updateProjectionMatrix () ;

        console.log("toolsPosY = " + toolsPosY + ",  renderHeight = " + renderHeight);

        // calculate height of tabs to offset the height from top (making them appear in the 3D area, above the top of the rest of the gui)
        // var guitabsHeight = document.getElementById('guitabs').clientHeight;
        // rootElement.style.setProperty('--guiTabHeight', guitabsHeight + 'px');

        if(washiddendecal)
            document.getElementById('decalblock').classList.add('hidden');

        return;
*/


        /*













        var logosize;


        let cpX = 0;
        let cpY = 0;

        let calcy = 0; // to calc y pos of canvas

        let dslogoHeight = 100;

        if(w>h) // landscape
        {

            let maxlogowidth = w - toolsWidth;
            let maxlogoheight = h - dslogoHeight;

            logosize = maxlogowidth * 0.9; // try reduction ... test todo confirm?
            if(logosize > maxlogoheight)
            {
                logosize = maxlogoheight;
            }

            let cpxoffset = (maxlogowidth - logosize) / 2;

            cpX = toolsWidth + cpxoffset;
            cpY = dslogoHeight;


            //
            // calcy = (h / 2) - ((logosize / 4)-45);
            // calcy = (h / 2) - ((0)-45);
            calcy = 0;



            // 267 x 786
            let aspectratio = 267.0 / 786.0;


            let imwidth = aspectratio * (h-70);



        }
        else
        { // portrait




            let maxlogowidth = w;
            let maxlogoheight = h - dslogoHeight;

            logosize = maxlogowidth;// * 0.9; // try reduction ... test todo confirm?
            if(logosize / 2 > maxlogoheight)
            {
                logosize = maxlogoheight * 2;
            }

            let cpxoffset = (maxlogowidth - logosize) / 2;

            cpX = cpxoffset;
            cpY = dslogoHeight;

            //
    //		calcy = (h / 2) - ((logosize / 4)-45);

            cpY = dslogoHeight;
            // calcy = cpY;
            calcy = 0;

    //		toolsPosY = cpY + logosize;// (w / 2) + cpY + 20;
            toolsPosY = cpY + logosize / 2;// (w / 2) + cpY + 20;

            toolsPosY = toolsPosY + (w*0.2);//20; // add gap below design in portrait

            toolsWidth = w;// / 2;



            // 267 x 786
            let aspectratio = 267.0 / 786.0;


            let imwidth = aspectratio * (h-70);


        }

        if(w>h)
        {
            // if(logosize > )
            canvasPositioner.style.width = logosize+'px';
            // canvasPositioner.style.height = (logosize / 2)+'px';
            canvasPositioner.style.height = (logosize)+'px';
            // toolsElement.style.height = h + 'px'; // ben disabled

            // move credit
            // creditselement.style.top = h - 30 + 'px';
            // creditselement.style.display="block";


            document.getElementById('logoImage').style.marginTop = 35 + "px";


            const boxes = document.querySelectorAll(".minmax");
            for (const box of boxes) {
                box.style.left = "272px";
            }
        }
        else
        {
            document.getElementById('logoImage').style.marginTop = 0 + "px";

            canvasPositioner.style.width = logosize+'px';
            canvasPositioner.style.height = (logosize)+'px';

            // move credit
            // creditselement.style.top = 15 + 'px';
            // creditselement.style.display="none";

            // toolsElement.style.height = 300 + 'px'; // ben disabled

            const boxes = document.querySelectorAll(".minmax");
            for (const box of boxes) {
                box.style.left = (w-80) + "px";
            }

        }

        canvasPositioner.style.left = cpX + 'px';



        canvasPositioner.style.top = calcy + 'px';


        // reposition logo
        let logotoppx = canvasPositioner.style.top;
        let logotop = logotoppx.split('px')[0];
        let logomidpx = canvasPositioner.style.width;
        let logomid = (logomidpx.split('px')[0]) / 2;


        let shiftit = 0;
        if(w<1000) // fudge to ensure logo icon doesnt overwrite the logo circles
            shiftit = 20;


        document.getElementById('logoImage').style.top = (logotop - (65 + shiftit)) + "px";
        document.getElementById('logoImage').style.left = (logomid - 45) + "px";

        toolsElement.style.width = toolsWidth + 'px';
        toolsElement.style.left = toolsPosX + 'px';
        toolsElement.style.top = toolsPosY + 'px';

        palette_tools_aboutElement.style.width = toolsWidth + 'px';
        palette_tools_aboutElement.style.left = toolsPosX + 'px';

        if(w>h)
        {
            palette_tools_aboutElement.style.top = toolsPosY + 'px';
        }
        else
        {
            palette_tools_aboutElement.style.top = 0 + 'px';
        }
        // palette_tools_aboutElement.style.height = '45px'; // try!


        titleContainerElement.style.left = canvasPositioner.style.left;
        titleContainerElement.style.width = canvasPositioner.style.width;
        titleContainerElement.style.height = dslogoHeight;


        threecanvasElement.style.width='100%';
        threecanvasElement.style.height='100%';


        //
        var patternWidth = (toolsWidth / 4) + "px";
        var patternHeight = ((toolsWidth / 4) * 0.5) + "px";
        rootElement.style.setProperty('--patternWidth', patternWidth);
        rootElement.style.setProperty('--patternHeight', patternHeight);

*/

//    }


}

// export { F1Gui };
export { F1Gui };


