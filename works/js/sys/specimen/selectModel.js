/**
 * Created by katybaby on 2016/4/15.
 * 用户添加脚本
 */
$(function() {
    //表单校验
    var validator = $("#addForm").validate({
        rules: {
            type: {required: true}

        },
        messages: {
            username: {required: "必填"}
        },
        errorPlacement: errorPlacement,
        success: "valid"
    });

    var vm = avalon.define({
        $id: "selectModel",
        // type:0,
        type:null,
        save: function () {
            if (validator.form()) {
                $.ajax({
                    url: "/doc/excel/"+vm.type+".xlxs",
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

