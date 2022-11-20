// 发起jq实现的ajax请求先都会先执行此函数
// options是我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options){
// 拼接根路径
    options.url = 'http://www.liulongbin.top:3007'+options.url

})