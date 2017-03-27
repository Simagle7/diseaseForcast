/**
 * Created by simagle on 2016/4/13.
 */
//本页面脚本列表
var scripts = [null];
//加载完通用脚本后执行

ace.load_ajax_scripts(scripts, function () {
    //对需要权限控制的元素进行渲染控制
    $('a[ac-authCode],input[ac-authCode]').authController({moduleUrl:'/df/admin/sys/diagnose'});
    avalon.ready(function () {
        var vm = avalon.define({
            $id: "listDiagnose",
            id: null,
            data: null,
            probability: 0,
            rate:null,
            queryPatienById: function () {
                $.ajax({
                    url: "/cn/df/patient/queryOne",
                    type: 'GET',
                    dataType: 'JSON',
                    data: {id:vm.id},
                    beforeSend: function () {
                        ROOT.openLoading();
                    },
                    complete: function () {
                        ROOT.closeLoading();
                    },
                    success: function (result) {
                        vm.data = result.bizData;
                    }
                });
            },
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
            diagnose: function (id) {
                if(id == null){
                    layer.alert("请选择病人！",{icon:2});
                    return
                }
                $.ajax({
                    url: "/cn/df/patient/diagnose",
                    type: "GET",
                    dataType: "JSON",
                    data:{id:id},
                    beforeSend: function () {
                        ROOT.openLoading();
                    },
                    success: function (result) {
                      if(isSuccess(result)){
                          setTimeout(function () {
                              ROOT.closeLoading();
                              vm.probability = result.bizData*100;
                              vm.rate = vm.probability+"%";
                          },10000);
                      }else{
                          layer.alert(result.msg,{icon:2})
                      }
                    }
                })
            },

        });
        avalon.scan($("#listDiagnose")[0], vm);
    });
});