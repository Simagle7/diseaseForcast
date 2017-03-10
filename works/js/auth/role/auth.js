
//树形配置
var setting = {
    check: {
        enable: true,
        chkStyle: "checkbox",
        chkboxType: {"Y": "ps", "N": "ps"}
    },
    view: {
        selectedMulti: false,
        nameIsHTML: true
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "code",
            pIdKey: "pCode",
            rootPid: "0"
        }
    },
    callback: {
        onCheck: function (event, treeId, treeNode) {
            if (treeNode.checked) {
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                var nodes = treeObj.getCheckedNodes(false);
                if (nodes.length == 0) {
                    vm.allChecked = true;
                }
            } else {
                vm.allChecked = false;
            }

        }
    }
};

var vm = avalon.define({
    $id: "authAuthRole",
    allChecked: false,  //全选
    roleCode: ROOT.getParam("roleCode"),  //角色Code

    //初始化
    init: function () {
        $.ajax({
            //获取已选择的模块及操作
            url: "/cn/df/authAcl/queryAuthAcl",
            type: "GET",
            cache: false,
            data:{subjectType:0, roleCode: vm.roleCode},
            dataType: 'json',
            beforeSend: function () {
                ROOT.openLoading();
            },
            complete: function () {
                ROOT.closeLoading();
            },
            success: function (result) {
                if (isSuccess(result)) {
                    var resourceCodes = result.bizData;
                    //初始化树形
                    $.ajax({
                        url: "/cn/df/authRole/queryModuleAndOperation",
                        type: "GET",
                        cache: false,
                        dataType: 'json',
                        beforeSend: function () {
                            ROOT.openLoading();
                        },
                        complete: function () {
                            ROOT.closeLoading();
                        },
                        success: function (result) {
                            if (isSuccess(result)) {
                                $.fn.zTree.init($("#treeDemo"), setting, result.bizData);
                                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                                treeObj.expandAll(true);
                                $(resourceCodes).each(function (i, item) {
                                    var node = treeObj.getNodeByParam("code", item, null);
                                    if (node != null) {
                                        treeObj.checkNode(node, true, false, false);
                                    }
                                });
                                var nodes = treeObj.getCheckedNodes(false);
                                if (nodes.length == 0) {
                                    vm.allChecked = true;
                                }
                            }
                        }
                    })
                }
            }
        })
    },
    //全选/不选
    checkAll: function () {
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        treeObj.checkAllNodes(vm.allChecked);
    },
    //保存
    save: function () {
        var modules = [], operation = [];
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = treeObj.getCheckedNodes(true);
        for (var i = 0, l = nodes.length; i < l; i++) {
            var code = nodes[i].code;
            if (code == null) {
                code = "0";
            }
            if (nodes[i].isParent) {
                //模块
                modules.push(code)
            } else {
                //操作
                operation.push(code)
            }
        }
        $.ajax({
            url: "/cn/df/authRole/saveAuth",
            type: "POST",
            dataType: 'JSON',
            data: {
                "roleCode": vm.roleCode,
                "moduleCodes": modules.join(","),
                "operationCodes": operation.join(",")
            },
            success: function (result) {
                avalon.log(result);
                if (isSuccess(result)) {
                    layer.alert(result.bizData);
                    ROOT.closeDialog();
                } else {
                    layer.alert(result.msg);
                }
            }
        });
    },
    back: function () {
        ROOT.cancelDialog();
    }
});
avalon.scan($("#authAuthRole")[0], vm);
vm.init();
