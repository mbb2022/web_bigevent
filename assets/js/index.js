$(function (){
    getUserInfo()

    let layer = layui.layer
    // 点击退出切换到登录页面
    $('#btnLogout').click(function(){
        // console.log('exit')
        layer.confirm('确定退出登录吗？', {icon: 3, title:'提示'}, function(index){
            //do something
            // index是指弹出框的索引
            // 清空token值
            localStorage.removeItem('token')
            // 跳转回登录页面
            //  /：根目录 采用绝对路径
            location.href = './login.html'
            // 关闭询问框
            layer.close(index)
          });
    })
})

// 封装获取用户基本信息的函数
function getUserInfo() {
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 设置请求头部
        // header是请求头配置对象
        // headers: {
        //     // 获取本地存取的token值
        //     Authorization: localStorage.getItem('token') || ''
        // },
        // 在baseAPI中统一设置了请求头部
        success: function (res){
            console.log(res)
            if(res.status !== 0){
                return layui.layer.msg(res.message)
            }
            // 渲染用户头像
            renderAvatar(res.data)
        },

        // 限制用户访问权限 如果用户没有获取到正确的用户信息（说明没有登陆）则跳转回登录页面
        // 所有ajax都要进行判断，所以优化放入ajaxprefilter中
        // complete:function(res){
        //     // 不是success函数中的res
        //     console.log(res)
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //             // 清空token值
        //             localStorage.removeItem('token')
        //             // 强制跳转到登陆页面
        //             location.href = './login.html'
        //     }
        // }
    })
}

// 渲染用户信息 没有考虑到新用户没有设置头像的问题
// 传进来的已经是数据
function renderAvatar(userData){
    let name = userData.username || userData.nickname
    // 渲染欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp'+ name)

    if(userData.user_pic !== null){
        // 渲染图片头像
        $('.layui-nav-img').
        attr('scr',userData.user_pic)
        .show()
        $('.text-avatar').hide()
    }else{
        // 渲染文本头像
        $('.layui-nav-img')
        .hide()
        // 获取用户输入名字的第一个字母
        let first = name[0].toUpperCase()
        $('.text-avatar')
        .html(first)
        .show()
    }
   

}