$(function (){
let layer = layui.layer
      // 1.1 获取裁剪区域的 DOM 元素
  let $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

//  实现选择头像
$('#btnChooseImage').click(function (){
    $('#file').click()
})

// 实现更换裁剪图片
$('#file').on('change',function (e){
    let file = e.target.files[0]
    let newImgURL = URL.createObjectURL(file)
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
})

// 将图片上传到服务器
$('#btnUpload').on('click',function (){
    // 获取用户裁剪后的头像
    let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    //   发起请求
      $.ajax({
        url:'/my/update/avatar',
        method:'POST',
        data:{
            avatar:dataURL
        },
        // 有问题 user_pic值没变 更换头像不成功
        success: function (res){
            console.log(res)
            if(res.status !==0){
                return layer.msg('更换头像失败！')
            }

            layer.msg('更换头像成功！')
            window.parent.getUserInfo()
        }
      })
})
})