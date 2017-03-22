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
        $id: "addPatient",
        currentDate: new Date(),
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
    avalon.scan($("#addPatient")[0], vm);
});

