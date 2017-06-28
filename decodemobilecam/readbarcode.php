<?php
include "dynamsoftbarcodereader.php";

class ReadResult {
    public $errorCode;
    public $errorString;
    public $barcodes;
}

class Barcode {
    public $format;
    public $formatString;
    public $displayValue;
    public $rawValue;
    //public $boundingBox;    //{x,y,width,height}
    //public $cornerPoints;   //[{x,y},{x,y},{x,y},{x,y}]
    public $pageNumber;
}

function is_utf8($str){
    $len = strlen($str);
    for($i = 0; $i < $len; $i++){
        $c = ord($str[$i]);
        if ($c > 128) {
            if (($c > 247)) return false;
            elseif ($c > 239) $bytes = 4;
            elseif ($c > 223) $bytes = 3;
            elseif ($c > 191) $bytes = 2;
            else return false;
            if (($i + $bytes) > $len) return false;
            while ($bytes > 1) {
                $i++;
                $b = ord($str[$i]);
                if ($b < 128 || $b > 191) return false;
                $bytes--;
            }
        }
    }
    return true;
}

ini_set('display_errors',1);
error_reporting(E_ALL);

$json_str = file_get_contents("php://input");
$obj = json_decode($json_str);

$base64str = $obj->image;
$type = $obj->barcodeFormat;
$count = $obj->maxNumPerPage;

$result = new ReadResult();
$result->errorCode = 0;
$result->errorString = "Success.";

try {
    $br = new BarcodeReader();
} catch (exception $exp) {
    $result->errorCode = -10000;
    $result->errorString = "Your barcode reader component is not registered correctly. Please refer to ReadMe.txt for details.";

    echo json_encode($result);
    exit;
}

$br->initLicense('t0068NQAAACC3JMVuXyVFz8G5CFVyJA0AtDhRsaAHFgpoVbrPQDEwS/0/bFMYaJ7vaM1dYgTsnMkHHWZtxExl1PudfD1UEcc=');
$br->setBarcodeFormats($type);
$br->setMaxBarcodesNumPerPage($count);

try {
    $br->decodeBase64String($base64str);
} catch(Exception $exp) {
    $result->errorCode = $br->getErrorCode();
    $result->errorString = $br->getErrorString();

    echo json_encode($result);
    exit;
}

$cnt = $br->getBarcodesCount();
if($cnt > 0) {
    $result->barcodes = array();

    for ($i = 0; $i < $cnt; $i++) {
        $res = $br->getBarcodeResult($i);

        $barcode = new Barcode();
        $barcode->format = $res->BarcodeFormat;
        $barcode->formatString = $res->BarcodeFormatString;
        if(!is_utf8($res->BarcodeText)) {
            $barcode->displayValue = mb_convert_encoding($res->BarcodeText, "UTF-8");
        } else {
            $barcode->displayValue = $res->BarcodeText;
        }
        $barcode->rawValue = $res->BarcodeData;
        $barcode->pageNumber = $res->PageNum;

        array_push($result->barcodes, $barcode);
    }
}

echo json_encode($result);

?>