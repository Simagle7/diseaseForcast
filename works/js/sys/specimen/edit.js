/**
 * Created by KatyBaby
 * 用户信息修改脚本
 */
$(function () {
    //表单校验
    var validator = $("#updateForm").validate({
        rules: {
            workNum: {maxlength :8},
            age: {min:1},
            position: {required: true}
        },
        messages: {
            workNum: {maxlength: "最多输入8个字符"},
            age: {min:"年龄不能小于0"},
            position:{required: "必填"}
        },
        errorPlacement: errorPlacement,
        success: "valid"
    });
    var vm = avalon.define({
        $id: 'editPatient',
        data: {
            id: ROOT.getParam("id"),
            username: "",
            password: null,
            sex: null,
            age:null,
            workNum: null,
            position: null,
            createDate:null
        },
        //回显示查询
        queryOne: function () {
            $.ajax({
                url: '/cn/df/user/queryOne',
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
                        vm.data.username = result.bizData.username;
                        // vm.data.password = result.bizData.password;
                        vm.data.sex = result.bizData.sex;
                        vm.data.age = result.bizData.age;
                        vm.data.workNum = result.bizData.workNum;
                        vm.data.position = result.bizData.position;
                        vm.data.createDate = result.bizData.createDate;
                    }
                }
            })
        },

        resetPasswd: function () {
            var index = layer.confirm("确定要重置该用户的密码？", {icon: 2}, function () {
                $.ajax({
                    url: "/cn/df/user/resetPassword",
                    dataType: "JSON",
                    type: "GET",
                    data: {id: vm.data.id},
                    beforeSend: function () {
                        ROOT.openLoading();
                        layer.close(index);
                    },
                    complete: function () {
                        ROOT.closeLoading();
                    },
                    success: function (result) {
                        if (isSuccess(result)) {
                            layer.alert("密码修改成功！新密码为：" + result.bizData, 1);
                            vm.data.password = result.bizData;
                        } else {
                            layer.alert("密码重置失败！", 2);
                        }
                    }
                })
            });
        },



        save: function () {
            if (validator.form()) {
                $.ajax({
                    url: "/cn/df/user/update",
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
    avalon.scan($("#editPatient")[0], vm);
    vm.queryOne();
});