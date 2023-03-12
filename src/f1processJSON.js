import {DEBUG_MODE} from './adminuser'

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
    // writePatterns() {
    //     console.log(">> save patterns json");
    //     this.writeJSON('./patterns/patterns.json');
    // }
    //======================

    loadPatterns(f1User,f1Aws) {
//        isHelmet,userID,userName,userEmail,cookie_livery_value) {
        if(DEBUG_MODE)
            console.log(">> load patterns json");
        if(f1User.isHelmet)
            this.readPatternsJSON('patterns','patterns_helmet.json','PATTERNS',f1User.userID,f1User.userName,f1User.userEmail,f1User.isHelmet,f1User.cookie_livery_value,f1Aws);
        else
            this.readPatternsJSON('patterns','patterns_car.json','PATTERNS',f1User.userID,f1User.userName,f1User.userEmail,f1User.isHelmet,f1User.cookie_livery_value,f1Aws);
    }
    //======================
    haveloadedStartupJSON() {
        this.loadedLiveryJSON = 1;
    }
    //======================
    haveReadPatternJSON(data,self,f1Aws) {
        if(DEBUG_MODE)
            console.log(">> have read patterns json from aws");
        if(self.type=='PATTERNS') {
            if(DEBUG_MODE)
                console.log(">> have completed loading patterns json");

            self.processStrung(JSON.parse(data));
            self.patternItems.buildGUI(self.patternsData,f1Aws);//, this.layerPatternThumbElements);

            for(var p=0;p<self.patternsData['Patterns'].length;p++) {
                var layer=self.patternsData['Patterns'][p].layer;
                if( layer > self.totLayers) 
                self.totLayers = layer;
            }
            self.totLayers=self.totLayers+1;// cos tot is not 0 index based

            if(DEBUG_MODE)
                console.log(">> loaded " + self.patternsData['Patterns'].length + " with " + self.totLayers + " layers");

            // this.layerPatternThumbElements=[];
            // for(var e=0;e<this.totLayers;e++) {
            //     this.layerPatternThumbElements.push(0);
            // }
            var layersList = new Array();
            for(var l=0;l<self.totLayers;l++) {
                
                var channelsList = new Array();

                var layername = "pattern";
                if(l==0) {
                    channelsList.push({ id: 0, isActive: true, tint: "#320050", metalroughtype: 0 });
                    channelsList.push({ id: 1, isActive: true, tint: "#00ff00", metalroughtype: 0 });
                    channelsList.push({ id: 2, isActive: true, tint: "#0000ff", metalroughtype: 0 });    
                }
                else if(l==1) {
                    layername = "tag";
                    channelsList.push({ id: 0, isActive: true, tint: "#320050", metalroughtype: 0 });
                    channelsList.push({ id: 1, isActive: true, tint: "#00ff00", metalroughtype: 0 });
                    channelsList.push({ id: 2, isActive: false, tint: "#0000ff", metalroughtype: 0 });    
                }
                else if(l==2) {
                     layername = "sponsor";
                     channelsList.push({ id: 0, isActive: true, tint: "#320050", metalroughtype: 0 });
                     channelsList.push({ id: 1, isActive: true, tint: "#00ff00", metalroughtype: 0 });
                     channelsList.push({ id: 2, isActive: false, tint: "#0000ff", metalroughtype: 0 });    
                 }
                layersList.push({ name: layername, type: l, filename: "./", patternId: -1, Channels: channelsList });
            }

            var modeltype = 'car';
            if(self.isHelmet) modeltype = 'helmet';
            if(self.cookie_livery_value=="") { // we havent any livery cookie yet - so create 
                self.liveryData = { name: self.userName, model: modeltype, timestamp: "000000_0000", email: self.userEmail, uniqueid: self.userID, tagtext: 'F1', tagfontstyle:1, Layers: layersList};
                // if cookie doesn't exist, create livery cookie
                var d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
                var expires = "expires=" + d.toUTCString();

                var liveryDataString = JSON.stringify( self.liveryData);
                document.cookie = 'F1Livery=' + liveryDataString + "; " + expires + "; path=/";                    
            }
            else { // generate liveryData from the cookie!
                self.liveryData = JSON.parse(self.cookie_livery_value);// { name: userName, model: modeltype, timestamp: "000000_0000", email: userEmail, uniqueid: userID, tagtext: 'F1', Layers: layersList};
            }

            if(DEBUG_MODE)
                console.log(">> set new livery json. " + self.liveryData);

            // ready to start!
            self.haveloadedStartupJSON();
        }
    }
    //======================
    readPatternsJSON(folder, filename,type,userID,userName,userEmail,isHelmet,cookie_livery_value,f1Aws) {

        this.type = type;
        this.userID = userID;
        this.userName = userName;
        this.userEmail = userEmail;
        this.isHelmet = isHelmet;
        this.cookie_livery_value = cookie_livery_value;

        f1Aws.loadfromAWS(folder,filename,2,this.haveReadPatternJSON,this);
    }
    //======================
    // writeJSON(filename) {

    //       var xhr = new XMLHttpRequest();
    //       xhr.open('POST', filename, true);
    //       xhr.setRequestHeader('Content-Type', 'application/json');
    //       xhr.onload = function() {
    //         console.log('JSON file saved');
    //       };
    //       var strung = JSON.stringify(this.patternsJSONdata, null, 1).replace(/\n /g, "\n");
    //     //   var strung = JSON.stringify(this.patternsJSONdata);
    //       console.log(strung);
    //     //   xhr.send(strung);
    // }

    //======================
    processStrung(strung) {
        this.patternsData=strung;
        if(DEBUG_MODE)
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









