$(function (){
    // 表单验证
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 昵称不能长于6 表单的name属性值 value是表单的值
        nickname: function (value){
            if(value.length>6){
                return layer.msg('昵称长度最大为6')
            }
        }
    })

    // 初始化用户信息
    initUserInfo()

    // 封装初始化用户基本信息的函数
function initUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        success: function (res){
                if(res.status === 1 ){
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res)
                // 快速给表单赋值
                form.val('formUserInfo',res.data)
        }
    })
}

$('#btnReset').click( function (e){
    e.preventDefault()
    initUserInfo()
// console.log('阻止表单默认行为')
})

// 监听表单更新提交事件
$('.layui-form').on('submit',function (e){
    e.preventDefault()
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        // 快速获取表单值
        data:$(this).serialize(),
        success: function (res){
            if(res.status !== 0){
                return layer.msg('更新用户信息失败！')
            }
            layer.msg('更新用户信息成功！')
            // 调用父页面中的方法，重新渲染用户的头像和用户的信息
            window.parent.getUserInfo()
        }
    })
})

})


