$( function (){

    let layer = layui.layer
    let form = layui.form
    // 定义文章状态
    let atr_state = '已发布'
     initCate()
     initEditor()

       // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)
    // 动态渲染文章类别
    function initCate (){
        $.ajax({
            url:'/my/article/cates'
            ,method:'GET'
            ,success: function (res){
                if(res.status !== 0){
                    return layer.msg('获取分类列表失败！')
                }

                 layer.msg('获取分类列表成功！')
                 let htmlStr = template('tpl-cate',res.data)
                //  console.log(htmlStr)
                 $('[name=cate_id]').html(htmlStr)
                // 重新渲染数据，让layui监听到
                form.render()

            }

        })
      
    }

    // 点击选择封面，弹出文件选择页面

    $('#btnChooseImage').click( function (){
        $('#coverfile').click()
    })

    // 用户修改头像
    $('#coverfile').on('change',function (e){
        // 判断用户是否选择图片
        // 获取文件列表数组
        let files = e.target.files
        if(files.length === 0){
            return 
        }
        //拿到用户选择的文件
        let file = e.target.files[0]

        let newImgURL = URL.createObjectURL(file)
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

    })

    $('#btnSaveDraft').click(function (){
        atr_state = '已发布'
    })

    // 监听表单提交事件
    $('#form-pub').on('submit',function (e){
        // 配置好请求体
        // 基于表单创建fd对象
        let fd = new FormData($(this)[0])
        fd.append('state',atr_state)
        // 调试输出
        fd.forEach(function (value,key){
            console.log(key,value)
        })
        // 将裁剪区域输出为文件，并添加到fd对象中
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img',blob)
        })

        // 调用发布文章的方法 只有被点击了才调用，所以该函数定义可以放后面
        publishArticle(fd)
    })

    // 发起发布文章的请求
    function publishArticle(fd){
        $.ajax({
            method:'POST'
            ,url:'/my/article/add'
            ,data:fd
            ,contentType: false
            ,processData: false
            ,success: function (res)
            {
                if(res.status !==0){
                    return layer.msg('发表文章失败！')
                }
                 layer.msg('发表文章成功！')

            }
        })
    }
})