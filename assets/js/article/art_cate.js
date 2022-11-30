$(function (){
    let layer = layui.layer
    let form = layui.form
    initAtrCateList()
    // 获取文章列表
    function initAtrCateList(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function (res){
                // 数据获取成功后，使用模板引擎渲染数据
                console.log(res)
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)

            }
        })
    }

    let indexAdd = null
    // 点击添加类别弹出页面
    $('#btnAddCate').click(function (){
        // open方法都会返回一个index
        indexAdd = layer.open({
            type: 1, 
            title:'添加文章分类',
            area:['500px','250px'],
            // 结构复杂的时候传入dom元素的html更为方便
            content: $('#dialog-add').html()
            //这里content是一个普通的String
          })

    })

    // 有问题 无法添加成功 怀疑接口失效
    // 实现新增文章分类
    // 因为表单是动态添加的，所以要委托一个页面已有的元素
    $('body').on('submit','#form-add',function (e){
        e.preventDefault()
        console.log('委托成功')
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            // 请求体
            data:$(this).serialize(),
            success: function (res){
                if(res.status === 1){
                    return layer.msg('新增文章分类失败！')
                }
                initAtrCateList()
                layer.msg('新增文章分类成功！')
                // 获取新的文章列表并渲染出来
                // 根据索引点击完了自动关闭弹出层
                layer.close(indexAdd)

            }

        })
    })

    let indexEdit = null
    // 点击编辑 弹出弹出层
    $('tbody').on('click','.btnEdit',function (){
        // console.log('被点击了')
        // open方法都会返回一个index
        indexEdit = layer.open({
            type: 1, 
            title:'修改文章分类',
            area:['500px','250px'],
            // 结构复杂的时候传入dom元素的html更为方便
            content: $('#dialog-edit').html()
            //这里content是一个普通的String
          })

          let id = $(this).attr('data-Id')
    // 根据id去实现点击编辑，将相应的行的信息显示出来
          $.ajax({
            url:'/my/article/cates/'+id,
            method:'GET',
            success: function (res){
                    form.val('form-edit',res.data)
            }

          })
    })

    // 通过代理的方式，为修改表单绑定提交事件
    $('body').on('submit','#form-edit',function (e){
        e.preventDefault()
        console.log('提交修改')
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success: function (res){
                if(res.status !== 0){
                    return layer.msg('更新分类信息失败！')
                }

                layer.msg('更新分类信息成功!')
                // 关闭弹出层
                layer.close(indexEdit)
                // 更新文章列表
                initAtrCateList()
            }

        })
    })

    // 通过代理的方式，为删除按钮绑定提交事件
    $('tbody').on('click','.btnDel',function (){
        // console.log('删除按钮被点击了')
        // 根据id进行删除，先获取id
        let id = $(this).attr('data-id')
        layer.confirm('确定要删除吗？', {icon: 3, title:'提示'}, function(index){
            // 点击了确定才会执行的逻辑代码
            $.ajax({
                url:'/my/article/deletecate/' + id,
                method:'GET',
                success: function (res){
                    if(res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
    
                    layer.msg('删除成功！')
                    layer.close(index)
                    initAtrCateList()
                }
            })
          })
    })

})