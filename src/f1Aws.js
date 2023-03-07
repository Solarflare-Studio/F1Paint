import {DEBUG_MODE} from './adminuser'


class F1Aws {


    constructor() {
        this.languageSettings = 0;
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
    haveLoadedLanguageFile(data) {
        this.languageText = JSON.parse(data);
        const dialogues = this.languageText['dialogues'];
        for(var i=0;i<dialogues.length;i++) {
            document.getElementById(dialogues[i].name).innerHTML = dialogues[i].text;
        }
    }
    //======================
    haveLoadedLanguageChoice(data) {
        var _self = this;
        if(DEBUG_MODE)
            console.log(">> have loaded language choice json file from aws.");
        this.languageSettings = JSON.parse(data);

        const e = document.getElementById('languagechoices');

        // now interpret and put language choices in UI
        var lingos = new Array();
        const langs = this.languageSettings['languages'];
        
        for(var i = 0;i<langs.length;i++) {
            const alingo = langs[i].description;
            const lingofile = langs[i].file;
            lingos.push( [ alingo, lingofile]);
        }
        if(DEBUG_MODE)
            console.log(">> languages available : " + lingos);

        if(lingos.length>0) {
            var toadd = "";
            for(var i = 0;i<lingos.length;i++) {
                toadd = toadd + '<option value=' + lingos[i][1] + '>' + lingos[i][0] + '</option>';
            }
            document.getElementById('s_languagechoices').innerHTML = toadd;

            e.classList.remove('hidden');    
        }
        else if(lingos.length==1) {
            // set language to this!
        }
        document.getElementById('firstbuttonpanel').classList.remove('hidden');

        document.getElementById('s_languagechoices').onchange = function (){
            const langchoice =  this.value;
            const lfile = langchoice;
            _self.loadfromAWS('languages',lfile,1);
            

        }

        

    }
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
                
                if(type==0) { // language choices and settings
                    const str = await response.Body.transformToString();
                    _self.haveLoadedLanguageChoice(str);
                }
                else if(type==1) { // actual language file
                    const str = await response.Body.transformToString();
                    _self.haveLoadedLanguageFile(str);
                }
                else if(type==2) { // patterns json file
                    const str = await response.Body.transformToString();
                    callback(str,self,this); // pass back aws!
//                    _self.haveLoadedPatternsJSON(str);
                }
                else if(type==3) { // image files png
                    // const str = await response.Body.transformToString();
                    const blob = new Blob([await response.Body.transformToByteArray()], { type: "image/png" });
                    const url = URL.createObjectURL(blob);
                    callback(url,self);
                }
                else if(type==4) { // image files jpg
                    // const str = await response.Body.transformToString();
                    const blob = new Blob([await response.Body.transformToByteArray()], { type: "image/jpg" });
                    const url = URL.createObjectURL(blob);
                    callback(url,self);
                }
                else if(type==5) { // thumbs
                    const blob = new Blob([await response.Body.transformToByteArray()], { type: "image/jpg" });
                    const url = URL.createObjectURL(blob);
                    callback(url,self,thumb);
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


