<?php
include_once 'DB_Connection.php';
include_once 'library.php';

$resultSerialNum = $_GET['SerialNum'];


if(strlen($resultSerialNum) != 10)
{
	$final_result['error_msg'] = 'Invalid serial number format'; //invalid serial number format
}
else
{
    $final_result = SN_to_URL($resultSerialNum);
}

echo json_encode($final_result);

?>