/**
 * Created by katybaby on 2016/4/15.
 * 用户添加脚本
 */
$(function () {
    //表单校验
    var validator = $("#addForm").validate({
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
        $id: "addRole",
        currentDate: new Date(),
        save: function () {
            if (validator.form()) {
                var data = $("#addForm").serialize();
                $.ajax({
                    url: "/cn/df/authRole/add",
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
    avalon.scan($("#addRole")[0], vm);
});
