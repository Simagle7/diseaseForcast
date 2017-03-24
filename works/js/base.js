/**
 * Created by Katybaby on 2017/2/27.
 * 公共脚本
 */



/**通用方法**/
//ajax 回调状态码判断
function isSuccess(result) {
    var rtnCode = result.rtnCode;
    if (rtnCode == '0000000')
        return true;
    if (rtnCode == '0100041') {
        if (layer) {
            layer.alert(result.msg, {icon: 5});
        } else {
            alert(result.msg);
        }
    }
    return false;
}
/** 判断是否登录 **/
function isLoad() {
    return sessionStorage.getItem("ISLOAD");
}

/** 复选框是否全选 **/
function isSelectedAll(item) {
    if (item.status == 1) {
        return item.checked;
    } else {
        return true;
    }
}


/**qtip最顶部**/
$.fn.qtip.zindex = 19941209; //为啥是这个是这个数字呢,哈哈哈哈，katybaby的生日呢

/**错误显示**/
function errorPlacement(error, element) {
    if (element.is(':radio') || element.is(':checkbox')) { //如果是radio或checkbox
        var eid = element.attr('name'); //获取元素的name属性
        element = $("input[name='" + eid + "']").last().parent(); //将错误信息添加当前元素的父结点后面
    }
    if (!error.is(':empty')) {
        $(element).not('.valid').qtip({
            overwrite: false,
            content: error,
            hide: false,
            show: {
                event: false,
                ready: true
            },
            style: {
                classes: 'qtip-cream qtip-shadow qtip-rounded'
            },
            position: {
                my: 'top left',
                at: 'bottom right'
            }
        }).qtip('option', 'content.text', error);
    }
    else {
        element.qtip('destroy');
    }
}
/** 拓展验证规则 **/
// 判断英文字符
jQuery.validator.addMethod("isEnglish", function (value, element) {
    return this.optional(element) || /^[A-Za-z]+$/.test(value);
}, "只能包含英文字符。");
// 判断手机号码
jQuery.validator.addMethod("isPhone", function (value, element) {
    return this.optional(element) || /^1\d{10}$/.test(value);
}, "电话号码不正确");
// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function (value, element) {
    //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
    return this.optional(element) || isIdCardNo(value);
}, "请输入正确的身份证号码。");
//身份证号码的验证规则
function isIdCardNo(num) {
    //if (isNaN(num)) {alert("输入的不是数字！"); return false;}
    var len = num.length, re;
    if (len == 15)
        re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
    else if (len == 18)
        re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
    else {
        //alert("输入的数字位数不对。");
        return false;
    }
    var a = num.match(re);
    if (a != null) {
        if (len == 15) {
            //noinspection JSDuplicatedDeclaration
            var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
            //noinspection JSDuplicatedDeclaration
            var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        }
        else {
            //noinspection JSDuplicatedDeclaration
            var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
            //noinspection JSDuplicatedDeclaration
            var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        }
        if (!B) {
            //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。");
            return false;
        }
    }
    return re.test(num);

}
// 字符验证，只能包含中文、英文、数字、下划线等字符。
jQuery.validator.addMethod("stringCheck", function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
}, "只能包含中文、英文、数字、下划线等字符");
// 判断数值类型，包括整数和浮点数
jQuery.validator.addMethod("isNumber", function (value, element) {
    return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);
}, "匹配数值类型，包括整数和浮点数");
//权限代码校验
jQuery.validator.addMethod("isAuthCode", function (value, element) {
    return this.optional(element) || /[A-Za-z]+:[A-Za-z]+/.test(value);
}, "验证码格式必须为模块名:操作");
//关闭所有提示
function closeAllTip() {
    $('.qtip').each(function () {
        $(this).data('qtip').destroy();
    })
}

/** avalon 过滤器*/

/**
 * @return {string}
 */
avalon.filters.TORFFilter = function (value, args, args2) {
    return value == true ? "<i class='fa fa-check' style='font-size:20px;color: #2def79'></i>":"<i class='fa fa-times' style='font-size: 20px;color: #ff4b5a'></i>";
};
avalon.filters.statusFilter = function (value, args, args2) {
    return value == 0 ? "<font style='color: #2def79'>Enabled</font>" : "<font style='color: #ff4b5a'>Disabled</font>";
};

avalon.filters.genderFilter = function (value, args, args2) {
    return value == 0 ? "<font style='color: #38bbff'><i style='font-size:15px;margin-right:3px;' class='fa fa-mars-stroke'></i>man</font>" : "<font style='color: #f185b7'><i style='font-size:15px;margin-right:3px;' class='fa fa-venus'></i>woman</font>";
};
avalon.filters.isSickenFilter = function (value, args, args2) {
    if(value == 0){
        return "<font style='color: #ff4b5a'><i style='font-size:15px;margin-right:3px;' class='fa fa-times'></i>否</font>";
    } else if(value ==1){
        return "<font style='color: #2def79'><i style='font-size:15px;margin-right:3px;' class='fa fa-check'></i>是</font>";
    } else if(value == 2){
        return "<font style='color: #ef973f'><i style='font-size:15px;margin-right:3px;' class='fa fa-exclamation-triangle'></i>不确定</font>";
    }
};
avalon.filters.fullNameFilter = function (value, args, args2) {
    var moduleNames = value.split("|");
    var moduleName = "";
    if (moduleNames.length > 1) {
        moduleName = moduleNames[moduleNames.length - 2];
    }
    return moduleName;
};