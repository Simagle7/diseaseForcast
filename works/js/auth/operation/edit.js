/**
 * Created by KatyBaby
 * 角色修改脚本
 */
$(function () {
    //表单校验
    var validator = $("#updateForm").validate({
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
        $id: 'editOperation',
        data: {
            id: ROOT.getParam("id"),
            name: "",    //名称
            createDate: null,       //创建日期
            authCode:null,          //权限操作代码
            moduleCode: null        //所属模块代码
        },
        modules: [],    //模块

      
        //回显示查询
        queryOne: function () {
            $.ajax({
                url: '/cn/df/operation/queryOne',
                dataType: 'JSON',
                type: 'GET',
                data:{id: vm.data.id},
                beforeSend: function () {
                    ROOT.openLoading();
                },
                complete: function () {
                    ROOT.closeLoading();
                },
                success: function (result) {
                    if (isSuccess(result)) {
                        vm.data.id = result.bizData.id;
                        vm.data.name = result.bizData.name;
                        vm.data.createDate = result.bizData.createDate;
                        vm.data.authCode = result.bizData.authCode;
                        vm.data.moduleCode = result.bizData.moduleCode;
                        vm.queryModules();
                    }
                }
            })
        },

        //加载应用对应的模块
        queryModules: function () {
            $.ajax({
                url: "/cn/df/authModule/queryModules",
                type: "GET",
                dataType: "JSON",
                data:{status: 0},
                success: function (result) {
                    if (isSuccess(result)) {
                        vm.modules = result.bizData;
                    }
                }
            })
        },

        save: function () {
            if (validator.form()) {
                $.ajax({
                    url: "/cn/df/operation/update",
                    type: "POST",
                    dataType: 'JSON',
                    data: $("#updateForm").serialize(),
                    beforeSend: function () {
                        ROOT.openLoading();
                    },
                    complete: function () {
                        ROOT.closeLoading();
                    },
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
    avalon.scan($("#editOperation")[0], vm);
    vm.queryOne();
});