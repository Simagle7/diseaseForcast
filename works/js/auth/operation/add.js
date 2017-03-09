/**
 * Created by katybaby on 2016/4/15.
 * 权限操作添加脚本
 */
$(function () {
    //表单校验
    var validator = $("#addForm").validate({
        rules: {
            name: {required: true, maxlength: 10},
            moduleCode: {required: true},
            authCode: {required: true, isAuthCode: true}
        },
        messages: {
            name: {required: "必填", maxlength: "最大长度为10字符"},
            moduleCode: {required: "必选"},
            authCode: {required: "必填"}
        },
        errorPlacement: errorPlacement,
        success: "valid"
    });

    var vm = avalon.define({
        $id: "addOperation",
        createDate: new Date(), //当前时间
        modules: [],    //模块

        //查询所有模块
        queryModules: function () {
            $.ajax({
                url: "/cn/df/authModule/queryModules",
                type: "GET",
                dataType: "JSON",
                data:{status: 0},
                beforeSend: function () {
                    ROOT.openLoading();
                },
                complete: function () {
                    ROOT.closeLoading();
                },
                success: function (result) {
                    if (isSuccess(result)) {
                        vm.modules = result.bizData;
                    }
                }
            })
        },

        //保存
        save: function () {
            if (validator.form()) {
                var data = $("#addForm").serialize();
                
                $.ajax({
                    url: "/cn/df/operation/add",
                    type: "POST",
                    dataType: 'JSON',
                    beforeSend: function () {
                        ROOT.openLoading();
                    },
                    complete: function () {
                        ROOT.closeLoading();
                    },
                    data: data,
                    success: function (result) {
                        if (isSuccess(result)) {
                            layer.alert(result.bizData, {icon: 1});
                            ROOT.closeDialog();
                        } else {
                            layer.alert(result.msg, {icon: 2});
                        }
                    }
                });
            }
        },
        back: function () {
            ROOT.cancelDialog();
        }
    });
    avalon.scan($("#addOperation")[0], vm);
    vm.queryModules();
});
