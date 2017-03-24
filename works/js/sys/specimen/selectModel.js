/**
 * Created by katybaby on 2016/4/15.
 * 用户添加脚本
 */
$(function() {
    //表单校验
    var validator = $("#addForm").validate({
        rules: {
            type: {required: true, min: 0}

        },
        messages: {
            username: {required: "必填", maxlength: "请选择一项模板"}
        },
        errorPlacement: errorPlacement,
        success: "valid"
    });

    var vm = avalon.define({
        $id: "selectModel",
        type:0,
        save: function () {
            if (validator.form()) {
                $.ajax({
                    url: "/doc/excel/"+type+".xlxs",
                    type: "GET",
                    beforeSend: function () {
                        ROOT.openLoading();
                    },
                    complete: function () {
                        ROOT.closeLoading();
                    },
                    success: function (result) {
                    }
                });
            }
        },
        back: function () {
            ROOT.cancelDialog();
        }
    });
    avalon.scan($("#selectModel")[0], vm);
});

