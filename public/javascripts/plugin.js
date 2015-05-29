/**
 * Created by cai on 2015/1/21.
 */
;(function($, window, document, undefined){
    /**
     * 选应用或组
     * @param options
     * @constructor
     */
    function SelectMulOptForMulTab(options){
        $.extend(this, options);
        this.init();
    };
    SelectMulOptForMulTab.prototype = {
        constructor: SelectMulOptForMulTab,
        init:function(){
            var _this = this;
            for(var key in this.tableOps){
                //获取数据
                this.getData(this.tableOps[key]);
                //选中表格行
                this.tableOps[key].renderElement.on( 'click', 'tbody tr', function () {
                    $(this).toggleClass('selected');
                });
            }
            //取消
            this.cancelBtn && this.cancelBtn.click(function(event){
                //隐藏浮层
                _this.modaldialog && _this.modaldialog.modal('hide');
                _this.selectItem.trigger("focus");
            });
            //确定
            this.confirmBtn && this.confirmBtn.click( function (event) {
                _this.confirmCallback.apply(_this, [event]);
            } );
            //绑定事件
            this.bindEvent && this.bindEvent();

        },
        renderTable: function(event, item){
            var _this = this;
            setTimeout(function(){
                //初始化表格
                item.renderElement.html(item.tableTpml);
                //加入数据
                if(item.dataList.data && item.dataList.data.length){
                    item.tableOption["data"] = item.dataList.data;
                }else{
                    _this.stopAjax(item.getDataRequest);
                    item.tableOption["ajax"] = item.getDataUrl;
                }
                //渲染表格
                item.table = item.renderElement.DataTable(item.tableOption);
                //手动点击选中
                item.table && item.table.columns().eq( 0 ).each( function ( colIdx ) {
                    $( 'input', item.table.column( colIdx ).footer() ).on( 'keyup change', function () {
                        item.table.column( colIdx ).search( this.value ).draw();
                    } );
                } );
            }, 1000);
        },
        getData: function(item){
            var _this = this, data = "";
            if(window.sessionStorage && (data = window.sessionStorage.getItem(item.sessionDataKey))){
                item.dataList.data = (data && $.parseJSON(data).data) || [];
            }else{
                item.getDataUrl && (item.getDataRequest = $.ajax({
                    "url": item.getDataUrl,
                    "type": "GET",
                    "dataType": "json",
                    "cache": true,
                    "success": function(datas, textStatus, jqXHR){
                        item.dataList.data = datas.data || [];
                        if(window.sessionStorage){
                            window.sessionStorage.setItem(item.sessionDataKey, JSON.stringify(datas));
                        }
                    },
                    "error": function(data, textStatus, jqXHR){
                        console.log("error");
                    }.bind(this)
                }));
            }
        },
        hideModaldialog:function(){
            this.modaldialog && this.modaldialog.modal('hide');
            this.selectItem.trigger("focus");
            this.selectItem.trigger("blur");
        },
        stopAjax: function(request){
            request && request.abort();
        }
    };
    window.SelectMulOptForMulTab = SelectMulOptForMulTab;
})(jQuery, window, document);
;(function($, window, document, undefined){
    /**
     * jquery插件
     */
    $.extend($.fn, {
        selectMulOpt: function(option){
            "use strict";
            function selectMulOpts(options) {
                $.extend(this, options);
                this.init();
            }
            selectMulOpts.prototype = {
                constructor: selectMulOpts,
                init: function(){
                    //获取数据
                    this.getAppData();
                    //
                    this.bindEvent();
                    //绑定事件
                    this._bindEvent();
                },
                _bindEvent: function(){
                    var _this = this;
                    /*
                    //渲染表格
                    this.selectItem.one("click", function(event){
                        _this.renderTable.call(_this, event);
                    });
                    */
                    //选中表格行
                    this.appListTableElm.on( 'click', 'tbody tr', function () {
                        $(this).toggleClass('selected');
                    });
                    //确定
                    this.confirmBtn && this.confirmBtn.click( function (event) {
                        _this.confirmCallback.call(_this, event);
                    } );
                    //取消
                    this.cancelBtn && this.cancelBtn.click(function(event){
                        //隐藏浮层
                        _this.modaldialog && _this.modaldialog.modal('hide');
                        _this.selectItem.trigger("focus");
                    });

                },
                hideModaldialog:function(){
                    this.modaldialog && this.modaldialog.modal('hide');
                    this.selectItem.trigger("focus");
                    this.selectItem.trigger("blur");
                },
                getAppData: function(){
                    var _this = this, datas = "";
                    if(window.sessionStorage && (datas = window.sessionStorage.getItem("appListDatas"))){
                        _this.appListDatas = $.parseJSON(datas);
                        return;
                    }
                    this.getAppDataUrl && (this.getAppDataRequest = $.ajax({
                        "url": _this.getAppDataUrl,
                        "type": "GET",
                        "dataType": "json",
                        "cache": true,
                        "success": function(datas, textStatus, jqXHR){
                            _this.appListDatas = datas || [];
                            if(window.sessionStorage){
                                window.sessionStorage.setItem("appListDatas", JSON.stringify(datas));
                            }
                        },
                        "error": function(data, textStatus, jqXHR){
                            console.log("error");
                        }.bind(this)
                    }));
                },
                stopAjax: function(){
                    this.getAppDataRequest && this.getAppDataRequest.abort();
                }
            }
            setTimeout(function(){
                new selectMulOpts(option);
            }, 0);
            //
            return this;
        }
    });
})(jQuery, window, document);

