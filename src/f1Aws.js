

class F1Aws {


    constructor() {
        this.init();
    }
    init() {
        var _self = this;
        console.log(">> connecting to AWS");
        const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");

        const {
            fromCognitoIdentityPool,
          } = require("@aws-sdk/credential-provider-cognito-identity");
        const { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
          
          // Set the AWS Region
        this.region = "eu-west-2"; //REGION
        this.albumBucketName = "f1-fanzone-paintshop"; //BUCKET_NAME        
        this.IdentityPoolId = "eu-west-2:cbf69f68-9773-42df-90ba-9f93aa42132b";

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
    haveLoadedLanguageChoice(data) {
        console.log(">> have loaded language choice json file from aws.");

    }
    //======================


    loadFile(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          var status = xhr.status;
          if (status === 200) {
            callback(null, xhr.response);
          } else {
            callback(status, xhr.response);
          }
        };
        xhr.send();
    }

    //======================
    loadfromAWS(folder,file,type) {

    }
    //======================
    /*
    loadfromAWS(folder,file,type) {
        console.log(">> loading aws file type : " + type + " from " + folder +"/" + file);


        AWS.config.region = this.REGION; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: this.IdentityPoolId,
        });

        // Create a new service object
        const s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: {Bucket: this.albumBucketName}
        });

        var albumPhotosKey = encodeURIComponent(folder) + '/';
        s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
          if (err) {
            return alert('There was an error viewing your folder: ' + err.message);
          }
          const href = this.request.httpRequest.endpoint.href;
          const bucketUrl = href + this.albumBucketName + '/' + folder + '/';

          const thefile = bucketUrl + file;
          
          setTimeout( function() {
            if(type==0) // language root file
                loadFile(thefile,
                    function(err, data) {
                        if (err !== null) {
                            console.log(">> ERROR loading language choice json");
                        } else {
                            haveLoadedLanguageChoice(data); 
                        }
                      }
                    );
          } , 100)
          


       });
    }
    */
    //======================



    readLanguage() {

    }



    //======================

}

export { F1Aws };


