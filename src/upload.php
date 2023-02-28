<?php
	// define('UPLOAD_DIR', 'userimages/');
//	$img = $_POST['imgBase64'];

	$aws = new Aws($config);
// Get references to resource objects
	$bucket = $aws->s3->bucket('f1-paintshop');

	print 'very strange';
	echo 'ok bye';
/*

	$object = $bucket->object('image/bird.jpg');


	$filename = 'userimages/'.$_POST['filename'];
//	$filename = 'userimages/'.$userID.'_map'.'.png';
	$img = $_POST['file'];


	$img = str_replace('data:image/png;base64,', '', $img);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);
//	$datetimestamp = date("Y_m_d_H_i_s").uniqid();
//	$file = UPLOAD_DIR . uniqid() . '.png';
//	$file = UPLOAD_DIR . $datetimestamp . '.png';
	$file = $filename;
	$success = file_put_contents($file, $data);
	//send request to ocr 

	print $success ? $file : 'Unable to save the file.';

	echo $object['LastModified'];


// Call resource methods to take action
	$object->delete();

	*/
	$bucket->delete();

?>