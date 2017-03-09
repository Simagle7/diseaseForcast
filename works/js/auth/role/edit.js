/**
 * Created by KatyBaby
 * 角色修改脚本
 */
$(function () {
    //表单校验
    var validator = $("#updateForm").validate({
        rules: {
            name: {required: true, maxlength: 20},
            description: {maxlength: 200}
        },
        messages: {
            name: {required: "必填", maxlength: "最大输入20个字符长度"},
            description: {maxlength: "最大输入200个字符长度"}

        },
        errorPlacement: errorPlacement,
        success: "valid"
    });
    var vm = avalon.define({
        $id: 'editRole',
        data: {
            id: ROOT.getParam("id"),
            name: "",
            isSuper: null,
            isDefault:null,
            description: null,
            createDate:null
        },
        //回显示查询
        queryOne: function () {
            $.ajax({
                url: '/cn/df/authRole/queryOne',
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
                        vm.data.isSuper = result.bizData.isSuper;
                        vm.data.isDefault = result.bizData.isDefault;
                        vm.data.description = result.bizData.description;
                        vm.data.createDate = result.bizData.createDate;
                    }
                }
            })
        },

        save: function () {
            if (validator.form()) {
                $.ajax({
                    url: "/cn/df/authRole/update",
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
    avalon.scan($("#editRole")[0], vm);
    vm.queryOne();
});