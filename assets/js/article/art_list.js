$(function (){
    let layer = layui.layer
    let form = layui.form
    // 分页对象
    let laypage = layui.laypage
    // 定义一个查询的参数对象，请求数据时，将其提交到服务器
    // get是用来从服务器获取数据，获取时也可以向服务器提交数据
    // 
    let q = {
        pagenum:1,//默认请求第一页的数据
        pagesize:2,//默认每页显示两条数据
        cate_id:'',//非必填，为空即可
        state:''
    }

    // 时间补零函数
    function padZore (n){
        return n > 9 ? n: '0'+n
    }

    // 美化列表时间的过滤器
    template.defaults.imports.dataForm = function (date){
        const dt = new Date(date)
// 注意创建时间对象，才能调用其内置方法
        let y = dt.getFullYear()
        let m = padZore (dt.getMonth())
        let d = padZore (dt.getDate())
        let hh = padZore (dt.getHours())
        let mm = padZore (dt.getMinutes())
        let ss = padZore (dt.getSeconds())

        return y + '-' + m + '-' + d +' ' + hh +':' + mm + ':' + ss
    }

    initTable()
    initCate()

    // 获取文章列表数据并使用模板引擎将其渲染出来
    function initTable(){
        $.ajax({
            url:'/my/article/list',
            method:'GET',
            data:q,
            success: function (res){
                if(res.status !== 0){
                    return layer.msg('获取列表数据失败!')
                }
                console.log(res)
                layer.msg('获取列表数据成功！')
                // 渲染数据
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            url:'/my/article/cates',
            method:'GET',
            success: function (res){
                if(res.status !== 0){
                    return layer.msg('获取分类名称！')
                }

                console.log('获取分类名称成功!')
                let htmlStr = template('tpl-cate',res)
                console.log(htmlStr)
                // 动态添加使用layui渲染的ui结构，需要再次渲染(通知layui)才会显示
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }

        })
    }

    // 为筛选表单绑定提交事件，并渲染筛选后的结果
    $('#form-search').on('submit',function (){
        // 获取被选中的筛选值，并修改查询对象中对应的值，再重新渲染表单
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function renderPage (total){
        // console.log(total)
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            // 分页容器的id
            ,count: total //数据总数，从服务端得到 总数条数
            ,limit:q.pagesize//每页显示几条
            ,curr:q.pagenum//设置默认被选中的分页
            // 其他控件
            ,layout:['count','limit','prev','page','next','skip']
            // 显示条数数组
            ,limits:[2,4,6,10]
            // 调用render函数也会触发
            // 分页触发时都会执行 jump 回调函数
            ,jump: function (obj,first){
                // console.log('jump回调函数被调用了')
                // console.log(obj.curr)
                // 点击哪一个页码值就显示哪一页
                q.pagenum = obj.curr
                // 将最新的条目数传给查询对象
                q.pagesize = obj.limit
                // initTable()
                if(!first){
                    // first是true，证明通过render函数触发，否则是jump函数
                initTable()

                }
            }
          })
    }

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click','btnDel',function (){
        let id = $(this).attr('data-Id')
        // 根据页面上是否还有删除按钮，如果只剩下一个，跳转到前一页并渲染
        // 不止一个，则正常删除        let len = $('.btnDel').length
        // 根据id去删除
        layer.confirm('确定要删除吗？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                url:'/my/article/delete/' + id
                ,method:'GET'
                ,success: function (res){
                    if(res.status !== 0 ){
                        return layer.msg('删除文章失败！')
                    }
    
                     layer.msg('删除文章成功！')
                     if(len === 1){
                        // 页码值最小是1
                        q.pagenum = q.pagenum === 1? 1: q.pagenum -1
                     }
                     initTable()
    
                }
    
    
            })
            layer.close(index);
          })
       
    })
})