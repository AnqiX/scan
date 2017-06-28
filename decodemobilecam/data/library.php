<?php


function SN_to_URL($resultSerialNum)
{
    $final_result = [];

    $centralAPI = "http://10.172.86.7/central-db/WebApi/GetUnitInfo?serial_num=".$resultSerialNum;

    $APIResult = json_decode(file_get_contents($centralAPI), true)['ResponseData'];

    foreach ($APIResult as $key => $value) 
    {
        $status = $value['status'];
        if($status == 'UnitFound')
        {
            $final_result[$resultSerialNum] = $value['URL'];
        }
    }    

    return $final_result;
}


?>