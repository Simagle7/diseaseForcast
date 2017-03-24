/**
 * Created by katybaby on 2016/4/15.
 * 用户添加脚本
 */
$(function() {
    //表单校验
    var validator = $("#addForm").validate({
        rules: {
            age: {required: true, min: 0,digits:true}

        },
        messages: {
            username: {required: "必填", maxlength: "年龄不能为负数",digits:"年龄必须为整数"}
        },
        errorPlacement: errorPlacement,
        success: "valid"
    });

    var vm = avalon.define({
        $id: "editPExamination",
        currentDate: new Date(),
        save: function () {
            if (validator.form()) {
                var data = $("#addForm").serialize();
                $.ajax({
                    url: "/cn/df/patient/add",
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
    avalon.scan($("#editPExamination")[0], vm);
});

