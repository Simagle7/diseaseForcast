/**
 * Created by KatyBaby
 * 角色修改脚本
 */
$(function () {
    //表单校验
    var validator = $("#updateForm").validate({
        rules: {
            name: {required: true, maxlength: 10},
            appCode: {required: true},
            priority: {required: true, digits: true, max: 999, min: 1}
        },
        messages: {
            name: {required: "必填", maxlength: "最大长度为10字符"},
            appCode: {required: "必选"},
            priority: {required: "必填", digits: "请输入数字", max: "不能大于999", min: "不能小于1"}
        },
        errorPlacement: errorPlacement,
        success: "valid"
    });
    var vm = avalon.define({
        $id: 'editModule',
        data: {
            id: ROOT.getParam("id"),
            name: "",    //名称
            level: 1,     //等级
            priority: null,//排序
            isMenu: 1,     //是否为菜单
            icon: "",      //图标
            url: "",       //地址
            pCode: 0 ,      //父code
            fullCode: ""
        },
        modules: [],    //模块

        //选择模块
        selectModule: function(){
            vm.data.level = parseInt($(this).find('option:selected').attr("level"))+1;
        },
        //回显示查询
        queryOne: function () {
            $.ajax({
                url: '/cn/df/authModule/queryOne',
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
                        vm.data.level = result.bizData.level;
                        vm.data.priority = result.bizData.priority;
                        vm.data.pCode = result.bizData.pCode;
                        vm.data.fullCode = result.bizData.fullCode;
                        vm.data.isMenu = result.bizData.isMenu == true ? 1 : 0;
                        vm.data.icon = result.bizData.icon;
                        vm.data.url = result.bizData.url;
                        vm.queryModules();
                    }
                }
            })
        },

        //加载应用对应的模块
        queryModules: function () {
            $.ajax({
                url: "/cn/df/authModule/queryModulesWithoutChild",
                type: "GET",
                dataType: "JSON",
                data:{moduleFullCode:vm.data.fullCode},
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
                    url: "/cn/df/authModule/update",
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
    avalon.scan($("#editModule")[0], vm);
    vm.queryOne();
});