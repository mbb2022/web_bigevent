$(function (){
    let form = layui.form
    let layer = layui.layer
    // 验证表单
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位，且不能包含空格'],
        //验证新密码是否与原密码一致
        samePwd: function (value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能一样！'
            }
        },
        // 验证再次确认的密码是否与新密码一致
        rePwd: function (value){
            if(value !== $('[name=newPwd]').val()){
                return '两次输入的密码不一致！'
            }
        }

    })
    // 重置密码
    $('.layui-form').on('submit',function (e){
        e.preventDefault()
        $.ajax({
            url:'/my/updatepwd',
            method:'POST',
            data: $(this).serialize(),
            success: function(res){
                if(res.status === 1){
                    return layer.msg('密码重置失败！')
                }
                layer.msg('重置密码成功！')
                // 恢复初始页面
                $('.layui-form')[0].reset()

            }
        })
    })
})