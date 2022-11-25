// 发起jq实现的ajax请求先都会先执行此函数
// options是我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options){
// 拼接根路径
    options.url = 'http://www.liulongbin.top:3007'+options.url
    // 统一为需要权限的页面设置请求头部
    if(options.url.indexOf('/my/') !== -1){
        options.headers = {
            // 获取本地存取的token值
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 限制用户权限
    options.complete = function (res){
        // 不是success函数中的res
        console.log(res)
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
                // 清空token值
                localStorage.removeItem('token')
                // 强制跳转到登陆页面
                location.href = './login.html'
        }
    }


})