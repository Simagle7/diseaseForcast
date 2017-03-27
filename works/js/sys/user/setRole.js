/**
 * Created by katybaby on 2016/4/15.
 * 用户添加脚本
 */
$(function() {
    //表单校验
    var validator = $("#addForm").validate({
        rules: {

        },
        messages: {

        },
        errorPlacement: errorPlacement,
        success: "valid"
    });

    var vm = avalon.define({
        $id: "setRole",
        baseUserDto: null,
        uid: ROOT.getParam("uid"),
        allChecked: false,
        data:[],
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
            var roleCodes = [];
            vm.data.forEach(function (el) {
                if (el.checked) {
                    roleCodes.push(el.code);
                }
            });
            $.ajax({
                url: "/cn/df/authRoleUser/save",
                type: "POST",
                cache: false,
                data: {
                    uid: vm.uid,
                    userType: vm.userType,
                    roleCodes: roleCodes.join(",")
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
                        layer.alert(result.bizData);
                        ROOT.closeDialog();
                    } else {
                        layer.alert("修改失败！" + result.msg);
                    }
                }
            })
        },
        back: function () {
            ROOT.cancelDialog();
        }
    });
    avalon.scan($("#setRole")[0], vm);
    vm.init();
});

