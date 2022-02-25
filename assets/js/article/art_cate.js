$(function () {

    var layer = layui.layer
    var form = layui.form


    initArtCateList()
    //获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //为添加按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    //通过代理发送为formadd表单绑定
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增失败')
                }
                initArtCateList()
                layer.msg('新增成功')
                //更具索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
    //通过代理的 为btn-edit绑定事件
    $('tbody').on('click', '#btn-edit', function () {
        //弹出编辑框
        indexEdit = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        //发起请求获取分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    //通过代理的 为修改分类绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败')
                }
                layer.msg('更新分类信息成功')
                layer.close(indexEdit)
                initArtCateList()
            }

        })
    })

    //通过代理的 为删除绑定事件btn-delete
    $('tbody').on('click', '.btn-delete', function () {

        var id = $(this).attr('data-id')
        //提示用户是否删除
        //eg1
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！！')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });
    })
})
