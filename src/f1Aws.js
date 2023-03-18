import {DEBUG_MODE} from './adminuser'


class F1Aws {


    constructor() {
        this.languageSettingsJson = 0;
        this.preloadlanguagecode = "";
        this.init();
    }
    init() {
        var _self = this;
        if(DEBUG_MODE)
            console.log(">> connecting to AWS");
        const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");

        const {
            fromCognitoIdentityPool,
          } = require("@aws-sdk/credential-provider-cognito-identity");
        const { S3Client,GetObjectCommand, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
        this.getObjectCommand = GetObjectCommand;
        this.ListObjectsCommand = ListObjectsCommand;
        this.PutObjectCommand = PutObjectCommand;
          // Set the AWS Region
        this.region = "eu-west-2"; //REGION
        this.bucketName = "f1-fanzone-paintshop"; //BUCKET_NAME        
        this.IdentityPoolId = "eu-west-2:cbf69f68-9773-42df-90ba-9f93aa42132b";

// new one =  this.IdentityPoolId = "eu-west-2:a8b5a2f0-f4f8-475e-83cc-fef46286b88c";    

        this.filessavedcount = 0;

          // Initialize the Amazon Cognito credentials provider for writing images
        this.s3 = new S3Client({
            region: this.region,
            credentials: fromCognitoIdentityPool({
              client: new CognitoIdentityClient({ region: this.region }),
              identityPoolId: this.IdentityPoolId, // IDENTITY_POOL_ID
            }),
          });
          

    }
    //======================
    haveLoadedPatternsJSON(data) {

    }

    //======================
    haveLoadedLanguageFile(data,f1aws) {
        f1aws.languageText = JSON.parse(data);
        const dialogues = f1aws.languageText['dialogues'];
        for(var i=0;i<dialogues.length;i++) {
            const textElement = document.getElementById(dialogues[i].name);
            if(textElement)
                textElement.innerHTML = dialogues[i].text;
        }
    }
    //======================
    haveLoadedLanguageChoice(data,f1Aws) {
        var _self = f1Aws;
        if(DEBUG_MODE)
            console.log(">> have loaded language choice json file from aws.");
        _self.languageSettingsJson = JSON.parse(data);

        const languageChoiceDropdown = document.getElementById('languageChoices');

        // now interpret and put language choices in UI
        var lingos = new Array();
        const langs = _self.languageSettingsJson['languages'];
        var preloadfile = "";
        var preloaddesc = "";
        for(var i = 0;i<langs.length;i++) {
            const alingo = langs[i].description;
            const lingofile = langs[i].file;
            const lingoISO =  langs[i].code;
            lingos.push( [ alingo, lingofile, lingoISO]);
            if(lingoISO == _self.preloadlanguagecode) {
                preloadfile = lingoISO + "/" + lingofile;
                preloaddesc = alingo;
            }
        }
        if(DEBUG_MODE)
            console.log(">> languages available : " + lingos);

        let choicesHtml = "";
        for(var i = 0;i<lingos.length;i++) {
            if(i!=0)
                choicesHtml = choicesHtml + '<hr class="border-netural border-t-2">';
            
            choicesHtml = choicesHtml + '<li class="language-option" onclick="handleLanguageChange(';
            choicesHtml = choicesHtml + "'" + lingos[i] + "'" + ')">' + lingos[i][0] + '</li>';
        }
        languageChoiceDropdown.innerHTML = choicesHtml;

        // auto switch language if we had one passed via url
        if(preloadfile!="") {
            _self.loadfromAWS('languages',preloadfile,1,null,_self);  
            document.getElementById('selectedLanguage').innerHTML=preloaddesc;
        }

        


/*



        if(lingos.length>0) {
            var toadd = "";
            for(var i = 0;i<lingos.length;i++) {
                // toadd = toadd + '<option value=' + lingos[i][1] + '>' + lingos[i][0] + '</option>';


                
                toadd = toadd + '<option value=' + lingos[i] + '>' + lingos[i][0] + '</option>';
            }
            document.getElementById('s_languagechoices').innerHTML = toadd;

            e.classList.remove('hidden');    
        }
        else if(lingos.length==1) {
            // set language to this!
        }

        // listener if user changes language
        document.getElementById('s_languagechoices').onchange = function (){
            var languageArr = this.value.split(',');
            const langfile =  languageArr[1]; // filename for language
            _self.loadfromAWS('languages',langfile,1);
        }

        // allow user to progress
        document.getElementById('firstbuttonpanel').classList.remove('hidden'); 

        */
    }
    //======================   
    /* 
    haveLoadedLanguageChoice(data) {
        var _self = this;
        if(DEBUG_MODE)
            console.log(">> have loaded language choice json file from aws.");
        this.languageSettingsJson = JSON.parse(data);

        const e = document.getElementById('languagechoices');

        // now interpret and put language choices in UI
        var lingos = new Array();
        const langs = this.languageSettingsJson['languages'];
        
        for(var i = 0;i<langs.length;i++) {
            const alingo = langs[i].description;
            const lingofile = langs[i].file;
            const lingoISO =  langs[i].code;
            lingos.push( [ alingo, lingofile, lingoISO]);
        }
        if(DEBUG_MODE)
            console.log(">> languages available : " + lingos);

        if(lingos.length>0) {
            var toadd = "";
            for(var i = 0;i<lingos.length;i++) {
                // toadd = toadd + '<option value=' + lingos[i][1] + '>' + lingos[i][0] + '</option>';


                
                toadd = toadd + '<option value=' + lingos[i] + '>' + lingos[i][0] + '</option>';
            }
            document.getElementById('s_languagechoices').innerHTML = toadd;

            e.classList.remove('hidden');    
        }
        else if(lingos.length==1) {
            // set language to this!
        }

        // listener if user changes language
        document.getElementById('s_languagechoices').onchange = function (){
            var languageArr = this.value.split(',');
            const langfile =  languageArr[1]; // filename for language
            _self.loadfromAWS('languages',langfile,1);
        }

        // allow user to progress
        document.getElementById('firstbuttonpanel').classList.remove('hidden'); 
    }*/
    //======================
    async s3upload(datablob,filename) {
        try {
            const folderKey = encodeURIComponent('userimages') + "/";
    
            // await this.s3.send(
            //     new this.ListObjectsCommand({
            //     Prefix: folderKey,
            //     Bucket: this.bucketName
            //     })
            // );
            const file = datablob;// files[0];
            const fileName = filename;// file.name;
            const photoKey = folderKey + fileName;
            const uploadParams = {
                Bucket: this.bucketName,
                Key: photoKey,
                Body: file
            };
            try {
                await this.s3.send(new this.PutObjectCommand(uploadParams));
                if(DEBUG_MODE)
                    console.log(">> Successfully uploaded images to aws server.");
                this.filessavedcount++;
            } catch (err) {
                return 	console.log(">> There was an error uploading images to aws server: " + err.message);
                    // alert("There was an error uploading your photo: ", err.message);
                }
            } catch (err) {
                // if (!files.length) {
                return console.log(">> aws no files to upload");
                //alert("Choose a file to upload first.");
                // }
        }
    }

    //======================
    checkFilesAWS(folder,file) {
        if(DEBUG_MODE)
            console.log(">> checking aws file exists : " + folder +"/" + file);
        const filepathname = folder + "/" + file;
        var _self = this;
        const main = async () => {

            try {
                const response = await this.s3.send(
                  new this.ListObjectsCommand({
                    Bucket: this.bucketName,
                    Prefix: filepathname,
                    MaxKeys: 1,
                  })
                );
                return response.Contents.length > 0;
              } catch (error) {
                if(DEBUG_MODE)
                    console.log(`Error checking if file exists: ${error}`);
                return false;
              }


        };
        return main();
    }
    //======================
    loadfromAWS(folder,file,type,callback,self,thumb) {
        if(DEBUG_MODE)
            console.log(">> loading aws file type : " + type + " from " + folder +"/" + file);
        const filepathname = folder + "/" + file;
        var _self = this;

        const main = async () => {
            const command = new this.getObjectCommand({
              Bucket: this.bucketName,
              Key: filepathname
            });
          
            try {
                const response = await this.s3.send(command);
                // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
                switch(type) {
                    case 0:
                        _self.haveLoadedLanguageChoice(await response.Body.transformToString(),self);
                        break;
                    case 1:
                        _self.haveLoadedLanguageFile(await response.Body.transformToString(),self);
                        break;
                    case 2:
                        callback(await response.Body.transformToString(),self,this); // pass back aws!
                        break;
                    case 3:
                        callback(URL.createObjectURL(new Blob([await response.Body.transformToByteArray()], { type: "image/png" })),self);
                        break;
                    case 4:
                        callback(URL.createObjectURL(new Blob([await response.Body.transformToByteArray()], { type: "image/jpg" })),self);
                        break;
                    case 5:
                        callback(URL.createObjectURL(new Blob([await response.Body.transformToByteArray()], { type: "image/jpg" })),self,thumb);
                        break;
                }
            } catch (err) {
                if(DEBUG_MODE)
                    console.error(err);
                // alert("AWS error "+ err);
            }
        };
        main();
    }
    //======================
    
    //======================




    //======================

}

export { F1Aws };


