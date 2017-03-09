/**
 * Created by Katybaby
 * 模块列表控制脚本
 */
//本页面脚本列表
var scripts = [null];
//加载完通用脚本后执行

ace.load_ajax_scripts(scripts, function () {
    avalon.ready(function () {
        var vm = avalon.define({
            $id: "listModule",
            currentDate: new Date(),
            pageNo: 1,      //页码
            pageSize: 10,   //页大小
            records: 0,     //总数
            total: 0,       //页数
            data: [],
            allChecked: false,  //是否全选，默认为false
            modules: [],
            moduleCode:null,    //选中的模块代码
            name:null,          //模块名称
            queryModules: function () {
                $.ajax({
                    url: "/cn/df/authModule/queryModules",
                    type: "GET",
                    dataType: "JSON",
                    data:{status: 0},
                    beforeSend: function () {
                        ROOT.openLoading();
                    },
                    complete: function () {
                        ROOT.closeLoading();
                    },
                    success: function (result) {
                        if (isSuccess(result)) {
                            vm.modules = result.bizData;
                        }
                    }
                })
            },

            //勾选
            checkOne: function () {
                if (!this.checked) {
                    vm.allChecked = false;
                } else {
                    vm.allChecked = vm.data.every(function (el) {
                        return isSelectedAll(el);
                    });
                }
            },
            //全选
            checkAll: function () {
                vm.data.forEach(function (el) {
                    if (el.status == 1) {
                        el.checked = vm.allChecked;
                    } else {
                        el.checked = false;
                    }
                });
            },
            //分页查询
            queryPage: function () {
                $.ajax({
                    url: '/cn/df/authModule/queryPage',
                    dataType: 'JSON',
                    type: 'POST',
                    data: {moduleCode:vm.moduleCode,name:vm.name, pageNo:vm.pageNo,pageSize:vm.pageSize},
                    beforeSend: function () {
                        ROOT.openLoading();
                    },
                    complete: function () {
                        ROOT.closeLoading();
                    },
                    success: function (result) {
                        if (isSuccess(result)) {
                            result.bizData.rows.forEach(function (el) {
                                el.checked = false;
                            });
                            vm.data = result.bizData.rows;
                            vm.total = result.bizData.total;
                            vm.records = result.bizData.records;
                        }
                    }
                })
            },

            //点击查询
            query: function (pageNo) {
                vm.pageNo = pageNo;
                vm.queryPage();
            },

            //回车查询
            enter: function (event) {
                vm.pageNo = 1;
                vm.pageSize = 10;
                if (event.keyCode == 13) {
                    vm.queryPage();
                }
            },

            //重置
            clear: function () {
                vm.pageNo = 1;
                vm.pageSize = 10;
                vm.queryPage();
            },

            //添加
            add: function () {
                ROOT.openDialog("/auth/module/add.html", {}, "添加模块", "650", "350", function () {
                    vm.clear();    //重置
                });
            },

            //修改
            edit: function (id) {
                ROOT.openDialog("/auth/module/edit.html", {id: id}, "修改模块", "650", "350", function () {
                    vm.clear();    //重置
                });
            },

            //批量删除
            deleteBatch: function () {
                layer.confirm('确定要删除所选模块？', {icon: 2},function (index) {
                    var ids = [];
                    vm.data.forEach(function (el) {
                        if (el.checked) {
                            ids.push(el.id);
                        }
                    });
                    if (ids.length <= 0) {
                        layer.alert("请勾选记录！");
                        return;
                    }
                    $.ajax({
                        url: "/cn/df/authModule/deleteByIds",
                        type: "POST",
                        dataType: 'json',
                        data: {ids: ids.join(",")},
                        complete: function () {
                            layer.close(index);
                            vm.query(1);
                        },
                        success: function (result) {
                            if (isSuccess(result)) {
                                layer.alert(result.bizData, {icon: 1});
                            } else {
                                layer.alert(result.msg , {icon: 2});
                            }
                        }
                    });
                });
            },

            //单个删除
            deleteOne: function (id) {
                layer.confirm('确定要删除该模块？', {icon: 2}, function (index) {
                    $.ajax({
                        url: "/cn/df/authModule/deleteOne",
                        type: "GET",
                        dataType: "JSON",
                        data:{id: id},
                        beforeSend: function () {
                            ROOT.openLoading();
                        },
                        complete: function () {
                            layer.close(index);
                            vm.query(vm.pageNo);
                        },
                        success: function (result) {
                            if (isSuccess(result)) {
                                layer.alert(result.bizData, {icon: 1});
                            } else {
                                layer.alert(result.msg , {icon: 2});
                            }
                        }
                    });
                });
            },

            //启用/停用
            disableOrEnable: function (status, id, flag) {
                var action = flag === 1 ? "停用" : "启用";
                var icon = flag === 1 ? 5 : 6;
                layer.confirm('确定要' + action + '该模块！', {icon: icon}, function (index) {
                    $.ajax({
                        url: "/cn/df/authModule/disableOrEnable",
                        type: "POST",
                        dataType: "JSON",
                        data:{id: id, status:status},
                        complete: function () {
                            layer.close(index);
                            vm.query(vm.pageNo);
                        },
                        success: function (result) {
                            if (isSuccess(result)) {
                                layer.alert(action + "成功！", {icon: 1});
                            }
                        }
                    });
                });
            },

            //首页，上下页，尾页
            selectPage: function (value) {
                vm.pageNo += parseInt(value);
                if (vm.pageNo < 1) {
                    vm.pageNo = 1;
                }
                if (vm.pageNo > vm.total) {
                    vm.pageNo = vm.total;
                }
                vm.queryPage();
            },

            //每页大小
            selectSize: function () {
                vm.pageSize = parseInt($("#pageSize").val());
                vm.pageNo = 1;
                vm.queryPage(vm.condition);
                $("#pageSize").val(vm.pageSize);
            },

            //跳转到某页
            toPage: function () {
                var val = $(this).val();
                if (isNaN(val) || val < 1 || val > vm.total) {
                    layer.alert("请输入正确的页号！", {icon: 5});
                    return;
                }
                vm.pageNo = parseInt(val);
                vm.queryPage();
            },
            init: function () {
                vm.queryPage();
                vm.queryModules();
            }
        });
        avalon.scan($("#listModule")[0], vm);
        vm.init();
    });
});