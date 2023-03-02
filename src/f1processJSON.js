class ProcessJSON {


    constructor(patternItems) {
        this.loadedLiveryJSON = 0;
        this.totLayers = 0;
        this.liveryData = "";
        // this.layerPatternThumbElements = new Array();

        this.patternItems = patternItems;
        this.patternsJSONdata = {
        };
        this.patternsData = new Array();

        
    }

    //======================
    writePatterns() {
        console.log(">> save patterns json");
        this.writeJSON('./patterns/patterns.json');
    }
    //======================

    loadPatterns(isHelmet,userID,userName,userEmail,cookie_livery_value) {
        console.log(">> load patterns json");
        if(isHelmet)
            this.readJSON('./patterns/patterns_helmet.json','PATTERNS',userID,userName,userEmail,isHelmet,cookie_livery_value);
        else
            this.readJSON('./patterns/patterns_car.json','PATTERNS',userID,userName,userEmail,isHelmet,cookie_livery_value);
    }
    //======================
    haveloadedStartupJSON() {
        this.loadedLiveryJSON = 1;
    }
    //======================
    readJSON(filename,type,userID,userName,userEmail,isHelmet,cookie_livery_value) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', filename, true);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if(type=='PATTERNS') {
                console.log(">> have completed loading patterns json");

                this.processStrung(xhr.response);
                this.patternItems.buildGUI(this.patternsData);//, this.layerPatternThumbElements);

                for(var p=0;p<this.patternsData['Patterns'].length;p++) {
                    var layer=this.patternsData['Patterns'][p].layer;
                    if( layer > this.totLayers) 
                        this.totLayers = layer;
                }
                this.totLayers=this.totLayers+1;// cos tot is not 0 index based

                console.log(">> loaded " + this.patternsData['Patterns'].length + " with " + this.totLayers + " layers");

                // this.layerPatternThumbElements=[];
                // for(var e=0;e<this.totLayers;e++) {
                //     this.layerPatternThumbElements.push(0);
                // }
                var layersList = new Array();
                for(var l=0;l<this.totLayers;l++) {
                    
                    var channelsList = new Array();
   
                    var layername = "pattern";
                    if(l==0) {
                        channelsList.push({ id: 0, isActive: true, tint: "#320050", metalroughtype: 0 });
                        channelsList.push({ id: 1, isActive: true, tint: "#00ff00", metalroughtype: 0 });
                        channelsList.push({ id: 2, isActive: true, tint: "#0000ff", metalroughtype: 0 });    
                    }
                    if(l==1) {
                        layername = "tag";
                        channelsList.push({ id: 0, isActive: true, tint: "#320050", metalroughtype: 0 });
                        channelsList.push({ id: 1, isActive: true, tint: "#00ff00", metalroughtype: 0 });
                        channelsList.push({ id: 2, isActive: false, tint: "#0000ff", metalroughtype: 0 });    
                    }
                    else if(l==2) {
                         layername = "decal";
                         channelsList.push({ id: 0, isActive: true, tint: "#320050", metalroughtype: 0 });
                         channelsList.push({ id: 1, isActive: true, tint: "#00ff00", metalroughtype: 0 });
                         channelsList.push({ id: 2, isActive: false, tint: "#0000ff", metalroughtype: 0 });    
                     }
                    layersList.push({ name: layername, type: l, filename: "./", patternId: -1, Channels: channelsList });
                }


                // liveryItem.push({ name: "ben", id: 0 , Layers: layersList});
                // this.liveryData.push(liveryItem);
                var modeltype = 'car';
                if(isHelmet) modeltype = 'helmet';
                if(cookie_livery_value=="") { // we havent any livery cookie yet - so create 
                    this.liveryData = { name: userName, model: modeltype, timestamp: "000000_0000", email: userEmail, uniqueid: userID, tagtext: 'F1', tagfontstyle:1, Layers: layersList};
                    // if cookie doesn't exist, create livery cookie
                    var d = new Date();
                    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
                    var expires = "expires=" + d.toUTCString();

                    var liveryDataString = JSON.stringify( this.liveryData);
                    document.cookie = 'F1Livery=' + liveryDataString + "; " + expires + "; path=/";                    
                }
                else { // generate liveryData from the cookie!

                    this.liveryData = JSON.parse(cookie_livery_value);// { name: userName, model: modeltype, timestamp: "000000_0000", email: userEmail, uniqueid: userID, tagtext: 'F1', Layers: layersList};

                    // layersList.push({ name: layername, id: l, filename: "./", patternId: -1, Channels: channelsList });

                }

                

                console.log(">> set new livery json. " + this.liveryData);

                // ready to start!
                this.haveloadedStartupJSON();


            }
        };
        xhr.send();        
    }
    //======================
    writeJSON(filename) {

          var xhr = new XMLHttpRequest();
          xhr.open('POST', filename, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onload = function() {
            console.log('JSON file saved');
          };
          var strung = JSON.stringify(this.patternsJSONdata, null, 1).replace(/\n /g, "\n");
        //   var strung = JSON.stringify(this.patternsJSONdata);
          console.log(strung);
        //   xhr.send(strung);
    }

    //======================
    processStrung(strung) {
        this.patternsData=strung;
        console.log(this.patternsData);
//        this.patternsData = JSON.parse(strung);
    }
    //===========
    resetLiveryLayerPatterns() {
        for(var l=0;l<this.totLayers;l++) {
            this.liveryData['Layers'][l].patternId = -1; // todo - this may be = 0?
            // this.layerPatternThumbElements[l] = 0;
        }
        // update cookie
        var liveryDataString = JSON.stringify( this.liveryData);
        var d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
        var expires = "expires=" + d.toUTCString();
        document.cookie = 'F1Livery=' + liveryDataString + "; " + expires + "; path=/"; 
        
    }
}


export { ProcessJSON };









