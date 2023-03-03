

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
        this.REGION = "eu-west-2"; //REGION
        this.albumBucketName = "f1-fanzone-paintshop"; //BUCKET_NAME        
        this.IdentityPoolId = "eu-west-2:cbf69f68-9773-42df-90ba-9f93aa42132b";

          // Initialize the Amazon Cognito credentials provider
        this.s3 = new S3Client({
            region: REGION,
            credentials: fromCognitoIdentityPool({
              client: new CognitoIdentityClient({ region: REGION }),
              identityPoolId: this.IdentityPoolId, // IDENTITY_POOL_ID
            }),
          });
          

    }
    //======================
    loadfromAWS(folder,file) {
        console.log(">> loading aws file :" + folder +"/" + file);


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
          

          // const thumbimage = document.createElement('img')
          // thumbimage.classList.add('preview_map')
          // document.getElementById('testimage').append(thumbimage)
          setTimeout( function() {
            tryLoadAWS(mapfile)
          } , 1000)
          
/*          const custommap = new THREE.TextureLoader().load(mapfile, (tex) => {
            tex.encoding = THREE.LinearEncoding

            tex.flipY = false
            tex.premultiplyAlpha = true
            tex.wrapS = THREE.RepeatWrapping
            tex.wrapT = THREE.RepeatWrapping

            modelCustomMaterial.map = tex
            modelCustomMaterial.needsUpdate = true
            console.log(">> loaded custom map file " + modelCustomMaterial.name)
          })  
*/          


       });
    }
    //======================



    readLanguage() {

    }



    //======================

}

export { F1Aws };


