/**
 * Created by katybaby on 2016/4/13.
 */
//本页面脚本列表
var scripts = [null];
//加载完通用脚本后执行

ace.load_ajax_scripts(scripts, function () {
    //对需要权限控制的元素进行渲染控制
    $('a[ac-authCode],input[ac-authCode]').authController({moduleUrl:'/df/admin/sys/specimen'});
    avalon.ready(function () {
        var vm = avalon.define({
            $id: "listPatient",
            currentDate: new Date(),
            pageNo: 1,      //页码
            pageSize: 10,   //页大小
            records: 0,     //总数
            total: 0,       //页数
            data: [],
            username:null,  //用户名
            workNum:null,   //工号
            allChecked: false,  //是否全选，默认为false

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
                var data = $("#searchCondition").serialize();
                data += "&pageNo=" + vm.pageNo;
                data += "&pageSize=" + vm.pageSize;
                avalon.log(data);

                $.ajax({
                    url: '/cn/df/patient/queryPage',
                    type: 'POST',
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
                ROOT.openDialog("/sys/specimen/add.html", {}, "添加病人", "650", "350", function () {
                    vm.clear();    //重置
                });
            },

            //修改
            edit: function (id) {
                ROOT.openDialog("/sys/specimen/edit.html", {id: id}, "查看病人", "650", "350", function () {
                    vm.clear();    //重置
                });
            },

            //编辑入院症见
            editDiagnosis: function (code) {
                ROOT.openDialog("/sys/specimen/diagnosis.html", {code: code}, "编辑入院症见", "650", "350", function () {
                    vm.clear();    //重置
                });
            },
            //编辑体格检查
            editPExamination: function (code) {
                ROOT.openDialog("/sys/specimen/pExamination.html", {code: code}, "编辑体格检查", "650", "350", function () {
                    vm.clear();    //重置
                });
            },
            //编辑专科检查
            editSExamination: function (code) {
                ROOT.openDialog("/sys/specimen/sExamination.html", {code: code}, "编辑专科检查", "650", "350", function () {
                    vm.clear();    //重置
                });
            },
            //编辑检查分析
            editAnalysis: function (code) {
                ROOT.openDialog("/sys/specimen/analysis.html", {code: code}, "编辑检查分析", "1200px", "550px", function () {
                    vm.clear();    //重置
                });
            },
            //编辑彩超
            editUltrasound: function (code) {
                ROOT.openDialog("/sys/specimen/ultrasound.html", {code: code}, "编辑彩超", "1200px", "270px", function () {
                    vm.clear();    //重置
                });
            },

            //下载模板
            selectModel: function (code) {
                ROOT.openDialog("/sys/specimen/selectModel.html", {code: code}, "下载模板", "", "", function () {
                    vm.clear();    //重置
                });
            },


            //批量删除
            deleteBatch: function () {
                layer.confirm('确定要删除所选用户？', {icon: 2},function (index) {
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
                        url: "/cn/df/user/deleteByIds",
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
                layer.confirm('确定要删除该用户？', {icon: 2}, function (index) {
                    $.ajax({
                        url: "/cn/df/user/deleteOne",
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
            }
        });
        avalon.scan($("#listPatient")[0], vm);
        vm.init();
    });
});