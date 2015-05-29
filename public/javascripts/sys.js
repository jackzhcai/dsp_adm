// JavaScript Document
window.MyObj = {};
window.MyObj.ListPage = (function($, window, document){
	return {
        table: null,
        tabDataTable: null,
		initTable:function(dataTabOps, delay){
            setTimeout(function(){
                if(this.table.length) {
                    this.tabDataTable = this.table.DataTable(dataTabOps);
                }
            }.bind(this), delay);
		},
		sendAjax:function(option){
			option.url && $.ajax({
				"url": option.url,
				"type": option.method || "GET",
                "dataType": option.dataType || "text",
                "data": option.data || null,
				"success": option.suc || function(data, textStatus, jqXHR){
					console.log("success");
				},
				"error": option.err || function(data, textStatus, jqXHR){
					console.log("error");
				}	
			});
		},
		delRow:function(event){
            event.stopPropagation();
            event.preventDefault();
            var tar = $(event.target);
            var delState = window.confirm(tar.attr("data-confirm-text") || "Delete it!");
            if(delState){
                var tr = tar.closest("tr");
                var delurl = tar.attr("href") || null;
                tr.addClass('selected');
                //send ajax
                delurl && this.sendAjax({
                    "url": delurl,
                    "type": "GET",
                    "dataType": "text",
                    "suc": function(data, textStatus, jqXHR){
                        //data为后台删除信息，'1'删除成功'0'删除失败
                        if(!!(+data)){
                            this.tabDataTable.row('.selected').remove().draw( false );
                        }else{
                            alert("delete failure");
                            tr.removeClass('selected');
                            this.tabDataTable.draw( false );
                        }
                    }.bind(this),
                    "err": function(data, textStatus, jqXHR){
                        tr.removeClass('selected');
                        this.tabDataTable.draw( false );
                    }.bind(this)
                });
            }
		},
        showMoreInfo:function(event){
            var tar = $(event.target);
            var tr = tar.closest('tr');
            var row = this.tabDataTable.row(tr);
            var genMoreTemp = (event.data && event.data.genMoreTemp) || null;
            var genMoreTempUrl = (event.data && event.data.genMoreTempUrl) || null;
            var format = function(showMoreTemp, data) {
                return showMoreTemp;
            };
            if ( row.child.isShown() ) {
                row.child.hide();
                tr.removeClass('shown');
                tar.attr("title", tar.attr("data-showmore-text"));
                tar.removeClass("hidemore");
                tar.text(tar.attr("data-showmore-text"));
            }else {
                if(!!tar.attr("data-moreinfo-html")){
                    row.child(tar.attr("data-moreinfo-html")).show();
                    tr.addClass('shown');
                    tar.attr("title", tar.attr("data-hidemore-text"));
                    tar.addClass("hidemore");
                    tar.text(tar.attr("data-hidemore-text"));
                    return;
                }
                if(genMoreTempUrl){
                    this.sendAjax({
                        "url": "/data/getAppMoreData",//genMoreTempUrl,
                        "type": "GET",
                        "dataType": "json",
                        "data": "appid=" + (row.data().appid || '') + "&adx_name=" + (row.data().adx_name || ''),
                        "suc": function(data, textStatus, jqXHR){
                            var temp = (genMoreTemp && typeof (genMoreTemp === 'function')) ? genMoreTemp(data) : '';
                            tar.attr("data-moreinfo-html", temp);
                            setTimeout(function(){
                                row.child(temp).show();
                                tr.addClass('shown');
                                tar.addClass("hidemore");
                                tar.text(tar.attr("data-hidemore-text"));
                            }, 0);
                        }.bind(this),
                        "err": function(data, textStatus, jqXHR){
                            console.log("err");
                        }.bind(this)
                    });
                }else{
                    row.child((genMoreTemp && typeof (genMoreTemp === 'function')) ? genMoreTemp(row.data()) : '').show();
                    tr.addClass('shown');
                    tar.addClass("hidemore");
                    tar.text(tar.attr("data-hidemore-text"));
                }
                /*
                var temp = (event.data.genMoreTemp && typeof (event.data.genMoreTemp === 'function')) ? event.data.genMoreTemp(row.data()) : '';
                setTimeout(function(){
                    row.child(temp).show();
                    tr.addClass('shown');
                    tar.text(tar.attr("data-hidemore-text"));
                }, 0);
                */
            }
        },
        bindEvent:function(option){
            //删除
            !!(option.delBtns) && this.table.delegate(option.delBtns, "click", this.delRow.bind(this));
            //附加信息
            !!(option.showMoreBtn) && this.table.delegate(option.showMoreBtn, "click", {"genMoreTemp": option.showMoreTemp || null, "genMoreTempUrl": option.genMoreTempUrl || null}, this.showMoreInfo.bind(this));
        },
		init:function(option){
            var _this = this;
            _this.table = $(option.tableId);
			//初始化表格
			this.initTable(option.dataTabOps, (option.delay? option.delay : 0) );
			//事件绑定
            this.bindEvent(option);
		}		
	};
})(jQuery, window, document);
//
window.MyObj.FormPage = (function($, window, document){
	return {
		submitBtn: null,
		submitForm: null,
		getQueryString:function(uid){
			var reg = new RegExp("(^|&)" + uid + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) 
				return unescape(r[2]); 
			return null;
			
		},
		sendAjax: function(option){
            option.url && $.ajax({
                "url": option.url,
                "type": option.type || "GET",
                "dataType": option.dataType || "text",
                "data" : option.data || {},
				"success": option.suc || function(data, textStatus, jqXHR){
					console.log("success");
				},
				"error": option.err || function(data, textStatus, jqXHR){
					console.log("error");
				}	
			});
		},
        getFiledVal: function(form){
            var datas = {}, fields = form && form.find("input, textarea, select");
            fields.each(function(idx, elem){
                elem = $(elem);
                var name = elem.attr("name"), items, len, vals;
                if(!!name && !datas[name]){
                    if(elem.get(0).tagName.toLowerCase() == "input"){
                        if(elem.attr("type") === "checkbox"){
                            items = $("input[name='"+name+"']");
                            len = items.length, vals = [];
                            for(var i=0; i<len; i++){
                                if(items.get(i).checked){
                                    vals.push(items.eq(i).val());
                                }
                            }
                            datas[name] = vals;
                        }else if(elem.attr("type") === "radio"){
                            items = $("input[name='"+name+"']");
                            len = items.length;
                            vals = '';
                            for(var j=0; j<len; j++){
                                if(items.get(i).checked){
                                    vals = items.eq(i).val();
                                    break;
                                }
                            }
                            datas[name] = vals;
                        }else{
                            datas[name] = elem.val();
                        }
                    }else{
                        datas[name] = elem.val();
                    }
                }
            });
            return datas;
        },
		subForm:function(event){
			event.stopPropagation();
			event.preventDefault();
            //if(this.hasError(event.data)) return false;
            var _this = this,
                sendDataUrl = (this.submitForm && this.submitForm.attr("action")) || null,
                sendDataMethod = (this.submitForm && this.submitForm.attr("method")) || "POST";
            setTimeout(function(){
                if(!!(+_this.submitForm.attr("data-validation-costom-haserror"))) return;
                sendDataUrl && _this.sendAjax({
                    "url": sendDataUrl,
                    "type": sendDataMethod,
                    "dataType": "json",
                    "data": _this.getFiledVal(_this.submitForm),
                    "suc": function(data, textStatus, jqXHR){
                        if(!!(+data)){
                            window.location.href = _this.submitBtn.attr("data-submit-redirect");
                        }else{
                            alert("save fail.");
                        }
                    }.bind(_this),
                    "err": function(data, textStatus, jqXHR){
                        console.log(arguments);
                    }.bind(_this)
                });
            }, 10);
		},
        initFormData:function(uuid, getCurDataUrl, cusCallback, errCallback, initCallback){
            var id = this.getQueryString(uuid) || null;
            if(getCurDataUrl && id){
                this.sendAjax({
                    "url": getCurDataUrl+"?"+uuid+"="+id,
                    "type": "GET",
                    //"async": false,
                    "dataType": "json",
                    "suc": cusCallback || function(data, textStatus, jqXHR){
                        for(var key in data){
                            if(Object.prototype.toString.apply(data[key]) === '[object String]'){
                                $("[name="+key+"]").val(data[key]);
                            }
                            if(Object.prototype.toString.apply(data[key]) === '[object Number]'){
                                $("[name="+key+"]").val(data[key]);
                            }
                            if(Object.prototype.toString.apply(data[key]) === '[object Array]'){
                                $("[name="+key+"]").each(function(idx, item){
                                    if($.inArray($(this).val(), data[key]) > -1){
                                        $(this).get(0).checked = true;
                                    }
                                })
                            }
                        }
                        //回调
                        initCallback && Object.prototype.toString.call(initCallback) === "[object Function]" && initCallback.call(this);
                    },
                    "err": errCallback || function(data, textStatus, jqXHR){
                        console.log("ajax fail");
                    }
                });
            }
		},
		initElem:function(submitBtnId){
			this.submitBtn = $(submitBtnId) || null;
			this.submitForm = (this.submitBtn && this.submitBtn.closest("form")) || null;
		},
		bindEvent:function(option){
			//this.submitBtn && this.submitBtn.on("click", this.subForm.bind(this));
			this.submitForm && this.submitForm.on("submit", {"formErrCls": option.formErrCls}, this.subForm.bind(this));
		},
		init:function(option){
            var _this = this;
			//初始化DOM
			this.initElem(option.submitBtnId);
            //初始化表单
            this.initFormData(option.uuid, option.getCurDataUrl, option.cusCallback || null, option.errCallback || null,  option.initCallback || null);
			//事件绑定
			this.bindEvent(option);
		}	
	};
})(jQuery, window, document);