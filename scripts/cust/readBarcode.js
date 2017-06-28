/**
*  HTML5 mobilecam Barcode Reader with Dynamsoft Barcode Reader SDK.
*  Support Mobile.
*/
var firstImg = new Image();
var orgCanvas = document.getElementById('orgCanvas');
var btnGrab = document.getElementById('btnGrab');
var btnRead = document.getElementById('btnRead');
//var xhr;
var S = KISSY;
var dlgDoBarcode;

var history_array = [];

window.mobileAndTabletcheck = function () {
    var check = true;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function showWaitDialog(strInfo) {
    var ObjString = "<div class=\"D-dailog-body-Recognition\">";
    ObjString += "<p>" + strInfo + "</p>";
    ObjString += "<img src='./images/loading.gif' style='width:160px; height:160px; margin-left:17px; margin-top:20px;' /></div>";
    document.getElementById("strBody").innerHTML = ObjString;

    try {
        ShowWaitDialog(237, 262);
    } catch (e) {

    } 
}

function DoNotShowWaitDDialogInner() {
    if (dlgDoBarcode) {
        dlgDoBarcode.hide();
    }
}

function ShowWaitDialog(varWidth, varHeight) {
    S.use("overlay", function (S, o) {
        dlgDoBarcode = new o.Dialog({
            srcNode: "#J_waiting",
            width: varWidth,
            height: varHeight,
            closable: false,
            mask: true,
            align: {
                points: ['cc', 'cc']
            }
        });
        dlgDoBarcode.show();
    });
}


function init() {
    if (!window.mobileAndTabletcheck()) {
        $("#demoInfoDiv").css("display", "block");
        $("#container").css("display", "none");
        return;
    }

    window.addEventListener("orientationchange", function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        //layout(false);
    }, false);

    $("#demoInfoDiv").css("display", "none");
    $("#container").css("display", "block");
    //layout(true);
}

function ClickCheckBox(obj) {
    var bSelect = obj.checked;
    if (bSelect == true) {
        $(obj).nextAll('.switch-handle').css('left', Math.floor($(window).width() * 0.136 - (Math.floor($(window).height() * 0.04) * 6 / 7)) + 'px'); //height_6_5
    }
    else {
        $(obj).nextAll('.switch-handle').css('left', '3px');
    }
}

function getBarcodeFormat() {
    var vType = 0;
    var barcodeType = document.getElementsByName("BarcodeType");
    for (i = 0; i < barcodeType.length; i++) {

        if (barcodeType[i].checked == true)
            vType = vType | (barcodeType[i].value * 1);
    }
    return vType;
}

function fileOnload(e) {
    var $img = $('<img>', { src: e.target.result });

    $img.load(function () {
        var w = 0, h = 0, scale = 0;
        if (this.width > this.height) {
            w = 800;
            scale = 800 / this.width;
            h = this.height * scale;
        } else {
            h = 800;
            scale = 800 / this.height;
            w = this.width * scale;
        }

        orgCanvas.width = w;
        orgCanvas.height = h;
        var orgCtx = orgCanvas.getContext('2d');
        orgCtx.drawImage(this, 0, 0, this.width, this.height,
                               0, 0, orgCanvas.width, orgCanvas.height);

        //scanBarcode();
        var count = 1;
        if(document.getElementById('chkMultiBarcodes').checked)
            count = 65535;
            
        var base64 = orgCanvas.toDataURL('image/jpeg', 0.7);
        var data = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
        Dynamsoft.BarcodeReaderDemo.ReadFromImage("readbarcode.php", data, getBarcodeFormat(), count, uploadComplete, uploadProgress, uploadFailed, uploadCanceled);
    });
}

$('#fileToUpload').change(function(e) {
    var file = e.target.files[0], imageType = /image.*/;

    if (!file.type.match(imageType))
    {
        banner_alert('The uploaded file is not supported.');
        return;
    }

    btnGrab.disabled = true;
    btnRead.disabled = true;

    loadImage(e.target.files[0],
        function (img) {
            //$("#imgContainer").empty();
            //$('#imgContainer').attr('min-height', '1px');
            //document.getElementById('imgContainer').appendChild(img);

            $("#divBorder").empty();
            $('#divBorder').attr('min-height', '1px');
            document.getElementById('divBorder').appendChild(img);

            btnGrab.disabled = false;
            btnRead.disabled = false;
        });

    $('#btnRead').click();
});

$('#btnGrab').click(function() {
    $('#fileToUpload').click();
});

$('#divBorder').click(function () {
    $('#fileToUpload').click();
});

$('#backBtn').click(function() {
    $('#redirected').hide();
    $("#divBorder").empty();
    $('#container').show();
    $('#backBtn').hide();
    $('#history').css({'left': '0px'});
})


btnRead.onclick = function () 
{
    closeNav();
    if (document.getElementById('fileToUpload').files.length < 1) {
        banner_alert("Please grab an image first.")
        return;
    }

    if (getBarcodeFormat() == 0) {
        banner_alert("Barcode Format is invalid.");
        return;
    }

    //btnRead.textContent = 'Uploading...';
    showWaitDialog('Uploading...');

    btnRead.disabled = true;
    btnGrab.disabled = true;

    var reader = new FileReader();
    reader.onload = fileOnload;
    
    reader.readAsDataURL(document.getElementById('fileToUpload').files[0]);
};

function uploadComplete(evt) {
    /* This event is raised when the server send back a response */
    var strMsg;
    var result = JSON.parse(evt.target.responseText);
    var redirect = false;

    console.log("uploadComplete result: ", result);

    if (result != null && result.barcodes != null && result.barcodes.length > 0) 
    {
        if(result.barcodes.length == 1)
        {
            // strMsg = "Total barcode(s) found: " + result.barcodes.length + ".<br/>";
            // strMsg += "Barcode " + (idx + 1) + ":<br/>";
            // strMsg += "Type: " + result.barcodes[idx].formatString + "<br/>";
            // strMsg += "Value: " + result.barcodes[idx].displayValue + "<br/>";
            // strMsg += "<br/>";
            redirect = true;
            var raw_result = result.barcodes[0].displayValue;
            var barcode_type = result.barcodes[0].formatString;
        }
        else
        {
            strMsg = "Please take only one barcode in the picture.";
        }
    }
    else if(result != null && result.errorCode != 0) 
    {
        strMsg = result.errorString;
    }
    else 
    {
        strMsg = "No barcode found. ";
    }

    if(redirect)
    {
        process_and_redirect(raw_result, barcode_type);
    }
    else
    {
        // $("#dlgResult").html('<div class="resultContent">' + strMsg + '</div>').dialog({
        //     modal: true,
        //     buttons: { 'OK': function() { $("#dlgResult").dialog("close"); $("#divBorder").empty();} }
        // });

        banner_alert(strMsg);

        //DoNotShowWaitDDialogInner();
    }

    //btnRead.textContent = 'Read Barcode';
    //DoNotShowWaitDDialogInner();
    btnRead.disabled = false;
    btnGrab.disabled = false;

    
}

function process_and_redirect(raw_result, barcode_type)
{
    console.log(raw_result, barcode_type);

    if(barcode_type == 'QR_CODE' || barcode_type == 'DATAMATRIX')
    {
        var delimiters = ['~', ':'];
        var delimiter = '';
        var delimiters_found = 0;

        for (var i = 0; i < delimiters.length; i++)
        {
            if(raw_result.includes(delimiters[i]))
            {
                delimiter = delimiters[i];
                delimiters_found += 1;
            }
        }

        if(delimiters_found != 1)
        {
            banner_alert('Wrong barcode format. No delimiter found.');
        }
        else
        {
            $.ajax(
            {
                type: "GET",
                data: 
                {
                    'delimiter': delimiter,
                    'raw_scan_result': raw_result
                },
                url: "data/twoD_to_URL.php",
                success: 
                function(data)
                {
                    handle_API_result(data);
                },
                error: function(data, textStatus, errorThrown) 
                {
                    console.log(data, textStatus, errorThrown);
                }
            });
        }
    }
    else
    {
        if (raw_result.length == 10)
        {
            $.ajax(
            {
                type: "GET",
                data: 
                {
                    'SerialNum': raw_result
                },
                url: "data/SN_to_URL.php",
                success: 
                function(data)
                {
                    console.log(data);
                    handle_API_result(data);
                },
                error: function(data, textStatus, errorThrown) 
                {
                    console.log(data, textStatus, errorThrown);
                }
            });
        }
        else
        {
            banner_alert('Wong barcode format.');
            //DoNotShowWaitDDialogInner();
        }
    }
}

function handle_API_result(data)
{
    var url_array = JSON.parse(data);

    console.log(url_array);



    if (typeof url_array['error_msg'] == 'undefined')
    {
        history_array.push(url_array);
        //history_array[];

        var opt_string = '<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>';

        for (var i = 0; i < history_array.length; i++)
        {
            for (var key in history_array[i])
            {
                opt_string += '<a onclick=goToURL("' + history_array[i][key] + '")>' + key + '</a>';
                
            }
        }

        $('#mySidenav').html(opt_string);

        for (var key in url_array)
        {
            var this_url = url_array[key];
        }
        goToURL(this_url);

    }
    else
    {
        banner_alert(url_array['error_msg']);
        //DoNotShowWaitDDialogInner();
    }   
}


function goToURL(url)
{
    console.log('goToURL', url);

    $('#container').hide();
    $('#redirected').show();
    $('#backBtn').show();
    $('#history').css({'left': '70px'});
    $('#iframe').attr("src", url);
    DoNotShowWaitDDialogInner();
}



function uploadFailed(evt) {
    banner_alert("There was an error attempting to upload the file.")
    //btnRead.textContent = 'Read Barcode';
    DoNotShowWaitDDialogInner();
    btnRead.disabled = false;
    btnGrab.disabled = false;
}

function uploadCanceled(evt) {

    banner_alert("The upload has been canceled by the user or the browser dropped the connection.");
}

function uploadProgress(evt)
{
    if (evt.lengthComputable && evt.loaded == evt.total) {
        //btnRead.textContent = 'Scanning...';
        DoNotShowWaitDDialogInner();
        showWaitDialog('Searching for units...');
    }
}


function banner_alert(msg)
{
    $('#alertP').html(msg);
    $('#alertMsg').fadeIn();
    DoNotShowWaitDDialogInner();

    setTimeout(function(){ $('#alertMsg').fadeOut(); $("#divBorder").empty();}, 3000);
}

$('#alertCloseBtn').click(function ()
{
    $('#alertMsg').fadeOut();
    $('#divBorder').empty();
})

init();

function toggleNav()
{
    if($('#mySidenav').width() > 0)
    {
        closeNav();
    }
    else
    {
        openNav();
    }
}


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}