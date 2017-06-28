<?php
include_once 'DB_Connection.php';
include_once 'library.php';

$delimiter = $_GET['delimiter'];
$raw_scan = $_GET['raw_scan_result'];

//$raw_scan = 'CYP~VSX140421~AC~1706253928~20161205151541';

$raw_scan_array = explode($delimiter, $raw_scan);
$num_pos = sizeof($raw_scan_array);

$sql1 = "SELECT [format_name] FROM [Scan].[dbo].[barcode_format] where value = '".$delimiter."'";

$possible_formats = executeAQueryManEng($sql1);

$sql2 = "SELECT format_name, count(value_key) as num_keys
  FROM [Scan].[dbo].[barcode_format]
  where (";



foreach ($possible_formats as $key => $value) 
{
	$format_name = $value['format_name'];

	$sql2 .= "format_name = '".$format_name."' or ";
}

$sql2 = rtrim($sql2," or ");
$sql2 .= ") and value_key != 'Delimiter'
  group by format_name";

$format_key_stats = executeAQueryManEng($sql2);

$result_pos = [];

foreach ($format_key_stats as $key => $value) 
{

	$num_keys = $value['num_keys'];

	if($num_keys == $num_pos)
	{
		$sql3 = "SELECT [value_key]
	  	FROM [Scan].[dbo].[barcode_format]
	  	where format_name = '".$value['format_name']."' and value = 'SerialNum'";

	  	$SerialNum_result = executeAQueryManEng($sql3)[0]['value_key'];
	  	array_push($result_pos, $SerialNum_result);
	}
}

$final_result = [];


if(sizeof($result_pos) == 1)
{
    $thestring = $result_pos[0];

    $position = preg_replace("/[^0-9]/","",$thestring) - 1;

    if ($position > 0)
    {

        $resultSerialNum = $raw_scan_array[$position];

        if(strlen($resultSerialNum) != 10)
        {
        	$final_result['error_msg'] = 'Invalid serial number format'; //invalid serial number format
        }
        else
        {
            $final_result = SN_to_URL($resultSerialNum);
            
            if($final_result == [])
            {
                $final_result['error_msg'] = 'No record found in the production database for unit '.$resultSerialNum;
            }
        }
    }
    else
    {
        $final_result['error_msg'] = 'Invalid serial number format';
    }
}
else
{
    $final_result['error_msg'] = 'Unable to determine the format of the barcode content.'; //unable to determine the format of the barcode content
}


echo json_encode($final_result);

?>