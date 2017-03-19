/**
 * Created by katybaby on 2016/4/15.
 * 用户添加脚本
 */
$(function() {
    //表单校验
    var validator = $("#addForm").validate({
        rules: {
            username: {required: true, maxlength: 20},
            password: {required: true, rangelength:[6,14]},
            workNum: {maxlength:8},
            age: {min:1},
            position: {required: true}
        },
        messages: {
            username: {required: "必填", maxlength: "最大输入20个字符长度"},
            password: {required: "必填", rangelength: "长度为6-14个字符之间"},
            workNum: {maxlength: "最多输入8个字符"},
            age: {min:"年龄不能小于0"},
            position:{required: "必填"}
        },
        errorPlacement: errorPlacement,
        success: "valid"
    });

    var vm = avalon.define({
        $id: "setRole",
        baseUerDto: null,
        uid: ROOT.getParam("uid"),
        allChecked: false,
        //初始化
        init: function () {
            vm.roles = [];
            $.ajax({
                url: "/cn/df/authRoleUser/getUserInfoByUid",
                type: "GET",
                cache: false,
                data:{uid: vm.uid},
                dataType: 'JSON',
                success: function (result) {
                    if (isSuccess(result)) {
                        vm.baseUserDto = result.bizData;
                        vm.changeUserType();
                    }
                }
            })
        },
        //查询角色
        changeUserType: function () {
            //获取身份信息
            $.ajax({
                url: "/cn/df/authRoleUser/queryRolesForAuth",
                type: "POST",
                cache: false,
                data: {
                    uid: vm.uid,
                    isNeedDefault: false
                },
                dataType: 'json',
                beforeSend: function () {
                    ROOT.openLoading();
                },
                complete: function () {
                    ROOT.closeLoading();
                },
                success: function (result) {
                    if (isSuccess(result)) {
                        var selected = result.bizData.selected;
                        result.bizData.allRole.forEach(function (v) {
                            v.checked = selected.indexOf(v['code']) != -1;
                        });
                        vm.data = result.bizData.allRole;

                        vm.allChecked = vm.data.every(function (el) {
                            return el.checked;
                        });
                    }
                }
            })
        },

        save: function () {
            if (validator.form()) {
                var data = $("#addForm").serialize();
                $.ajax({
                    url: "/cn/df/user/add",
                    type: "POST",
                    dataType: 'JSON',
                    data: data,
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
    avalon.scan($("#setRole")[0], vm);
});

