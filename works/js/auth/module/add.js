/**
 * Created by katybaby on 2016/4/15.
 * 用户添加脚本
 */
$(function () {
    //表单校验
    var validator = $("#addForm").validate({
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
        $id: "addModule",
        modules: [],    //模块
        moduleLevel: 1, //菜单等级

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

        //选择模块
        selectModule: function(){
            vm.moduleLevel = parseInt($(this).find('option:selected').attr("level"))+1;
        },

        //保存
        save: function () {
            if (validator.form()) {
                var data = $("#addForm").serialize();
                $.ajax({
                    url: "/cn/df/authModule/add",
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
    avalon.scan($("#addModule")[0], vm);
    vm.queryModules();
});
