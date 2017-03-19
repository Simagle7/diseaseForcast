/**
 * Created by simagle on 2016/4/15.
 */
avalon.ready(function () {
    var vm = avalon.define({
        $id: "chooseUser",
        role:[],
        queryRoles:function () {
            $.ajax({
                // todo 获取当前用户的所有角色
                url: "/cn/df/authRole/queryRoles4User",
                type:"GET",
                dataType:'json',
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (result) {
                    if(isSuccess(result)){

                    }else {

                    }
                }
            })
        },
        selectRoles: function (userCode,roleCode) {
            $.ajax({
                url: "/cn/df/user/initUser",
                type:"POST",
                dataType:'json',
                data:{usercode:userCode, roleCode: roleCode},
                beforeSend: function () {
                    layer.load(2);
                },
                complete: function () {
                    layer.closeAll('loading');
                },
                success: function (result) {
                    if(isSuccess(result)){
                        sessionStorage.setItem("CURRENTUSER", JSON.stringify(result.bizData));
                        sessionStorage.setItem("ISLOAD", true);
                        // 跳转至首页
                        window.setTimeout(function () {
                            window.location.href = "/index.html";
                        }, 1200);
                    }else {
                        layer.msg("暂无角色！！")
                    }
                }
            })
        }
    });
    avalon.scan($("#chooseUser")[0], vm);
});

