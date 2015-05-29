/**
 * Created by cai on 2015/1/21.
 */
;(function($, window){
    var adx_name = window.dsp_adma.adx_name;
    if(!adx_name) {
        $.ajax({
            "url": "/data/initAdxSession",
            "type": "GET",
            "dataType": "text",
            "async": false,
            "success": function (data, textStatus, jqXHR) {
                if(!!(+data)){
                    console.log("init session success.");
                }else{
                    console.log("init session fail.");
                }
            },
            "error": function (data, textStatus, jqXHR) {
                console.log("init session fail.");
            }
        });
    }
})(jQuery, window);