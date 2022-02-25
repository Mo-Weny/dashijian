$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;



    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date()


        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义一个查询参数对象,将来请求数据的时候
    //把参数对象提交给服务器
    var q = {
        pagenum: 1,//页码在,默认请求第一页的
        pagesize: 2,//煤业显示几条数据,默认显示2条
        cate_id: '',//文章分类的Id
        state: '',//文章的发布状态
    }
    initTable()
    initCate()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                //调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)

                $('[name=cate_id').html(htmlStr)
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单选中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件 重新2渲染表格数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用下面方法渲染分页结构
        laypage.render({
            elem: 'pageBox',//分页容器Id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几天数据
            curr: q.pagenum,//设置默认选中分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            //分页发送切换的时候，触发jump回调

            //触发jump回调的方式有两种：
            //1点击页面的时候jump回触发回调
            //2只要调用了 laypage.render方法就会出发jump回调
            //可以通过!first的值来触发方式2
            jump: function (obj, first) {
                //把最新的页码值 赋值到q这个查询对象中
                q.pagenum = obj.curr
                //把最新的条目数 赋值到q这个查询对象中pagesize
                q.pagesize = obj.limit
                //根据最新的Q获取数据列表
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //通过代理为删除按钮绑定点击事件

    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮个数
        var len = $('.btn-dalete').length
        var id = $(this).attr('data-id')
        //询问用户是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //当数据删除完成后 需要判断当当前页是否在这一页中，是否还有数据
                    //如果没有剩余的数据 则让页码值-1之后再重新调用 initTable()
                    if (len === 1) {
                        //如果len等于1 ，证明删除完毕之后页面就没有数据了
                        //页码值最小必须是1
                        q.pagenum = pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()
                }
            })
            layer.close(index);

        });
    })
})