$( function (){

    // 点击'去注册账号'跳转
    $('#link_reg').click( ()=> {
            $('.login-box').hide()
            $('.reg-box').show()
    })

    // 点击'去登录'跳转
    $('#link_login').click( ()=> {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义表单校验规则
    // 获取form对象
    let form = layui.form
    // 获取弹框对象
    let layer = layui.layer
    form.verify ( {
            // 定义一个名为pwd的规则
            pwd: [
                /^[\S]{6,12}$/
                ,'密码必须6到12位，且不能出现空格'
              ],
            //校验两次输入的密码是否一致
            repwd:function (value){
                // value是再次确认密码框输入的值
                let pwd = $('.reg-box [name=password]').val()

                if(pwd !== value){
                    return '两次密码不一样!'
                }

            }
    })

    // 监听注册表单提交事件
    $('#form_reg').on('submit',function (e){

        e.preventDefault()
        // 发起post请求
        // 手动拼接数据
        $.post('/api/reguser',{username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},
        // 服务器已响应
        function (res){
                if(res.status !==0 ){
                    // 使用弹框提示用户 注册失败
                    return layer.msg(res.message, {icon: 5})
                }
                // 注册成功
                layer.msg(res.message, {icon: 6})
                // 跳转回登录页面
                $('#link_login').click()
        })
    })

    // 监听登录表单提交事件
    $('#form_login').on('submit',function (e){
            e.preventDefault()
            // 发起登录请求
            $.ajax({
                url:'/api/login',
                method:'POST',
                // 快速获取表单数据 不需要再加{}
                data:$(this).serialize(),
                success:function (res){
                    // 请求成功，处理返回值
                    if(res.status !== 0){
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // console.log(res.token)
                    // 将用于有权限接口的身份认证信息存储到本地
                    localStorage.setItem('token',res.token)
                    // 登录成功后跳转到其他页面
                    location.href = 'index.html'
                }
            })

    })


} )