const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const {
	fromCognitoIdentityPool,
  } = require("@aws-sdk/credential-provider-cognito-identity");
const { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
  
  // Set the AWS Region
const REGION = "eu-west-2"; //REGION
  
  // Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
	region: REGION,
	credentials: fromCognitoIdentityPool({
	  client: new CognitoIdentityClient({ region: REGION }),
	  identityPoolId: "eu-west-2:cbf69f68-9773-42df-90ba-9f93aa42132b", // IDENTITY_POOL_ID
	}),
  });
  
const albumBucketName = "f1-fanzone-paintshop"; //BUCKET_NAME
const s3upload = async (datablob,filename) => {
	// const files = document.getElementById("photoupload").files;
	try {
	//   const albumPhotosKey = encodeURIComponent(albumName) + "/";
	  const albumPhotosKey = encodeURIComponent('userimages') + "/";

	  await s3.send(
		  new ListObjectsCommand({
			Prefix: albumPhotosKey,
			Bucket: albumBucketName
		  })
	  );
	  const file = datablob;// files[0];
	  const fileName = filename;// file.name;
	  const photoKey = albumPhotosKey + fileName;
	  const uploadParams = {
		Bucket: albumBucketName,
		Key: photoKey,
		Body: file
	};
	  try {
		await s3.send(new PutObjectCommand(uploadParams));
		console.log(">> Successfully uploaded images to aws server.");
	  } catch (err) {
		return 	console.log(">> There was an error uploading images to aws server: " + err.message);
			// alert("There was an error uploading your photo: ", err.message);
	  }
	} catch (err) {
	  if (!files.length) {
		return console.log(">> aws no files to upload?");
		//alert("Choose a file to upload first.");
	  }
	}
  };
  // Make addPhoto function available to the browser
  window.s3upload  = s3upload;
