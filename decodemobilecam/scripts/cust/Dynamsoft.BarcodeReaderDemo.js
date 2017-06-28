var Dynamsoft = {};
Dynamsoft.BarcodeReaderDemo = {};

Dynamsoft.BarcodeReaderDemo.EnumBarcodeFormat = {
	Unknown: 234882047,	
	
    CODE_39: 1,
    CODE_128: 2,
	CODE_93: 4,   
    CODABAR: 8,   
    ITF: 16,
    EAN_13: 32,
	EAN_8: 64,	
	UPC_A: 128,
	UPC_E: 256,
	INDUSTRIAL_25: 512,
	OneD : 1023, 
	
	QR_CODE: 67108864,
	PDF417: 33554432,
	DATAMATRIX: 134217728
};

Dynamsoft.BarcodeReaderDemo.ReadFromURL = function(service, url, format, count, onSuccess, onProgress, onFailure, onAbort)
{
    Dynamsoft.BarcodeReaderDemo.ReadInner(service, url, 1, format, count, onSuccess, onProgress, onFailure, onAbort);
};

Dynamsoft.BarcodeReaderDemo.ReadFromImage = function(service, base64img, format, count, onSuccess, onProgress, onFailure, onAbort)
{
    Dynamsoft.BarcodeReaderDemo.ReadInner(service, base64img, 0, format, count, onSuccess, onProgress, onFailure, onAbort);
};

Dynamsoft.BarcodeReaderDemo.ReadInner = function(service, urlOrImg, bURL, format, count, onSuccess, onProgress, onFailure, onAbort)
{
    var xhr = new XMLHttpRequest();
    
    xhr.addEventListener("load", onSuccess, false);
    xhr.addEventListener("error", onFailure, false);
    xhr.addEventListener("abort", onAbort, false);
    xhr.upload.addEventListener('progress',onProgress, false);
    
    xhr.open("POST", service);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    var data = "";
    
    if(bURL) 
    {
        data = JSON.stringify({
            "url": urlOrImg,
            "barcodeFormat": format,
            "maxNumPerPage": count
        });
    }
    else
    {
        data = JSON.stringify({
            "image": urlOrImg,
            "barcodeFormat": format,
            "maxNumPerPage": count
        });            
    }
    
    xhr.send(data);
};