/*! pui v0.5.1 |  from poohou.com */
(function (window) {
    var u = {};
    //**菜单
    $.fn.pMenu = function (index) {
        var _this = this;
        _this.each(function () {
            var thisObj = $(this);
            $(this).find("li[disabled]").each(function () {
                $(this).find("li").attr("disabled", true);
            })
            $(this).on("click","li[disabled] a", function (event) {
                return false;
            })
            $(this).on("click","li:not([disabled]) a", function (event) {
                
                var menuCallback = $(this).parent("li");
                var lisIndedx = thisObj.find("li").index($(this).parent("li"));
                var listText = $(this).text()
                menuCallback.index = function () {
                    return lisIndedx;
                }
                menuCallback.menu = function () {
                    return thisObj;
                }
                menuCallback.text = function () {
                    return listText;
                }
                index && index(menuCallback);
            });
        })
    }

    //**下拉菜单
    $.fn.pDropdown = function (options) {
        var _this = this;
        var defaults = {
            toggle: ".p-dropdown-toggle",
            menu: ".p-menu",
            event: "click",
            isTake: false,
            takeDom: ".p-dropdown-toggle>.btn>span",
            callback: ""
        };
        var settings = $.extend({}, defaults, options);
        //展开收起事件
        activeDropdown = "";
        switch (settings.event) {
            case "click":
                _this.children(settings.toggle).on("click", function (event) {
                    //计算位于屏幕的位置
                    var winHeight = $(window).height();
                    var winWidth = $(window).width();
                    var btnWinOffset =  $(this).offset().top - $(document).scrollTop()      
                    
                    var thisObj = $(this).parent();
                    if (!thisObj.hasClass("active")) {
                        if (activeDropdown) {
                            activeDropdown.removeClass("active");
//                            thisObj.find(".p-menu").removeClass("menu-top menu-bottom");
                        }
                        //判断向上还是向下
                        if((btnWinOffset+200)>winHeight){
                            thisObj.find(".p-menu").addClass("menu-top");
                        }else{
                            thisObj.find(".p-menu").addClass("menu-bottom");
                        }
                        //判断从是否从右展开
                        if($(this).offset().left+300<$(window).width()){
                            thisObj.find(".p-menu").addClass("menu-right")
                        };
                        thisObj.addClass("active");
                        settings.activeDropdown = thisObj;
                        activeDropdown = thisObj;
                    } else {
                        thisObj.removeClass("active");
                        activeDropdown = "";
                        
//                        thisObj.find(".p-menu").removeClass("menu-top menu-bottom");
                    }
                    event.stopPropagation();
                });

                break;
            case "hover":
                _this.on("mouseover mouseout", function (event) {
                    //计算位于屏幕的位置
                    var winHeight = $(window).height();
                    var btnWinOffset =  $(this).offset().top - $(document).scrollTop()   
                    
                    if (event.type == "mouseover") {
                        //判断向上还是向下
                        if((btnWinOffset+200)>winHeight){
                            $(this).find(".p-menu").addClass("menu-top");
                        }else{
                            $(this).find(".p-menu").addClass("menu-bottom");
                        }
                        //判断从是否从右展开
                        if($(this).offset().left+300<$(window).width()){
                            $(this).find(".p-menu").addClass("menu-right")
                        };
                        
                        $(this).addClass("active");
                        if (activeDropdown) {
                            activeDropdown.removeClass("active")
                        }
                    } else if (event.type == "mouseout") {
                        $(this).removeClass("active")
                    }
                    event.stopPropagation();
                });
        };
        $(document).on("click", function () {
            _this.removeClass("active")
        });
        //取值
        _this.children(settings.menu).pMenu(function (e) {
            
            if (settings.isTake) {
                e.menu().closest(_this).find(settings.takeDom).text(e.text());
            }
            settings.callback && settings.callback(e);
        });
        
    };
    
    //**select
    $.fn.pSelect = function (callback) {
        var defaults = "click";
        var selectWrap = '<div class="p-dropdown p-select">' + ' <div class="p-dropdown-toggle">' + '        <div class="btn tx-l"><span></span> <i class="icon icon-caret-down di-vm fz16"></i></div>' + '    </div>' + '    <ul class="p-menu">' + '    </ul>' + '</div>';
        var thisDorpdown;
        this.each(function () {
            var thisSelect = $(this);
            var thisDorpdown = $(selectWrap);
            var thisSelected = $(this).children("option:selected").text();
            var thisMunu = "";
            $(this).children("option").each(function () {
                var optionAttributes = "";
                for (var i = 0; i < $(this)[0].attributes.length; i++) {
                    var itemName = $(this)[0].attributes[i].name;
                    var itemVaule = $(this)[0].attributes[i].value;
                    optionAttributes += itemName + "=" + itemVaule + " ";
                }
                thisMunu += "<li " + optionAttributes + "><a href='javascript:void(0)'>" + $(this).text() + "</a></li>";
            })
            thisDorpdown.find(".p-dropdown-toggle>.btn>span").text(thisSelected);
            thisDorpdown.addClass($(this).attr("class"));
            thisDorpdown.find(".p-menu").append(thisMunu);
            $(this).wrapAll(thisDorpdown);
            $(this).parent().pDropdown({
                isTake: true,
                callback: function (e) {
                    callback && callback(e);
                    thisSelect.find("option").prop("selected",false).eq(e.index()).prop("selected",true);
                }
            })
        })
    }
    window.$p = u;
})(window);

$(function () {
    //默认调用对象
    $("[dropdown]").pDropdown();
    //select重构
    $("[pSelect]").pSelect();
})